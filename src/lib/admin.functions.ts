import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Helper inside handlers
async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Accès refusé");
}

// ─────────── Paiements ───────────
export const validatePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        amount: z.number().nonnegative(),
        reference: z.string().max(200).optional().nullable(),
        note: z.string().max(1000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    const { error: pErr } = await supabaseAdmin.from("payments").insert({
      order_id: data.orderId,
      method: "bank_transfer",
      amount_eur: data.amount,
      reference: data.reference ?? null,
      note: data.note ?? null,
      validated_at: now,
      validated_by: context.userId,
    });
    if (pErr) throw new Error(pErr.message);
    const { error: oErr } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        payment_validated_at: now,
        payment_validated_by: context.userId,
      })
      .eq("id", data.orderId);
    if (oErr) throw new Error(oErr.message);

    // Send "paiement confirmé" email (best-effort, direct enqueue, service-role)
    try {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("order_number,email,first_name,last_name,total_eur,address_line,postal_code,city,country")
        .eq("id", data.orderId)
        .maybeSingle();
      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("product_name,quantity,unit_price_eur")
        .eq("order_id", data.orderId);
      if (order?.email) {
        const { enqueueAppEmail } = await import("@/lib/email/enqueue.server");
        const shippingAddress = [
          order.address_line,
          `${order.postal_code ?? ""} ${order.city ?? ""}`.trim(),
          order.country,
        ]
          .filter(Boolean)
          .join("\n");
        await enqueueAppEmail({
          templateName: "order-paid",
          recipientEmail: order.email,
          idempotencyKey: `order-paid-${data.orderId}`,
          templateData: {
            customerName: [order.first_name, order.last_name].filter(Boolean).join(" "),
            orderNumber: order.order_number ?? "",
            totalEur: Number(order.total_eur ?? 0),
            shippingAddress,
            items: (items ?? []).map((i) => ({
              name: i.product_name,
              quantity: i.quantity,
              price_eur: Number(i.unit_price_eur ?? 0),
            })),
          },
        });
      }
    } catch (e) {
      console.error("order-paid email failed", e);
    }

    try {
      const { supabaseAdmin: sa } = await import("@/integrations/supabase/client.server");
      const { data: o } = await sa
        .from("orders")
        .select("user_id, order_number")
        .eq("id", data.orderId)
        .maybeSingle();
      if (o?.user_id) {
        const { safeBroadcastToUser } = await import("./push.server");
        await safeBroadcastToUser(o.user_id, {
          title: "Paiement confirmé ✅",
          body: `Commande ${o.order_number} validée. Préparation en cours.`,
          url: "/mon-compte",
          tag: `paid-${data.orderId}`,
        });
      }
    } catch (e) {
      console.error("customer push failed", e);
    }
    return { ok: true };
  });

export const setTrackingNumber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        trackingNumber: z.string().max(80).nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ tracking_number: data.trackingNumber || null })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ─────────── Lien de paiement CB (différé) ───────────
function validatePaymentLink(link: string): string {
  const trimmed = (link ?? "").trim();
  if (!trimmed) throw new Error("Lien de paiement vide.");
  if (trimmed.length > 2000) throw new Error("Lien trop long.");
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Lien invalide.");
  }
  if (url.protocol !== "https:") {
    throw new Error("Le lien doit commencer par https://");
  }
  return trimmed;
}


export const sendPaymentLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        paymentLink: z.string().min(1).max(2000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const cleanLink = validatePaymentLink(data.paymentLink);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, email, first_name, last_name, total_eur")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order) throw new Error("Commande introuvable");

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_name, quantity, unit_price_eur")
      .eq("order_id", data.orderId);

    const sentAt = new Date().toISOString();
    const { error: uErr } = await supabaseAdmin
      .from("orders")
      .update({
        payment_link: cleanLink,
        payment_link_sent_at: sentAt,
        status: "payment_link_sent",
      })
      .eq("id", data.orderId);
    if (uErr) throw new Error(uErr.message);

    try {
      const { sendAppEmail } = await import("@/lib/email/send.server");
      await sendAppEmail({
        templateName: "payment-link",
        recipientEmail: order.email,
        idempotencyKey: `payment-link-${order.id}-${Date.now()}`,
        templateData: {
          customerName: [order.first_name, order.last_name].filter(Boolean).join(" "),
          orderNumber: order.order_number,
          totalEur: Number(order.total_eur ?? 0),
          paymentLink: cleanLink,
          items: (items ?? []).map((i) => ({
            name: i.product_name,
            quantity: i.quantity,
            price_eur: Number(i.unit_price_eur ?? 0),
          })),
        },
      });
    } catch (e) {
      console.error("payment-link email failed", e);
    }
    return { ok: true, sentAt };
  });

// ─────────── Adresse crypto (BTC) ───────────
export const sendCryptoPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        address: z.string().min(4).max(200),
        currencyName: z.string().min(1).max(50).default("Bitcoin"),
        currencyCode: z.string().min(1).max(20).default("BTC"),
        network: z.string().min(1).max(100).default("Bitcoin (BTC)"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, email, first_name, last_name, total_eur")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order) throw new Error("Commande introuvable");

    const sentAt = new Date().toISOString();
    await supabaseAdmin
      .from("orders")
      .update({
        payment_link: `${data.currencyCode}:${data.address.trim()}`,
        payment_link_sent_at: sentAt,
        status: "payment_link_sent",
      })
      .eq("id", data.orderId);

    try {
      const { sendAppEmail } = await import("@/lib/email/send.server");
      await sendAppEmail({
        templateName: "crypto-payment",
        recipientEmail: order.email,
        idempotencyKey: `crypto-${order.id}-${Date.now()}`,
        templateData: {
          customerName: [order.first_name, order.last_name].filter(Boolean).join(" "),
          orderNumber: order.order_number,
          totalEur: Number(order.total_eur ?? 0),
          currencyName: data.currencyName,
          currencyCode: data.currencyCode,
          network: data.network,
          address: data.address.trim(),
        },
      });
    } catch (e) {
      console.error("crypto-payment email failed", e);
    }
    return { ok: true, sentAt };
  });

// ─────────── Notification d'expédition ───────────
function buildTrackingUrl(carrier: string, tracking: string): string {
  const c = carrier.toLowerCase().trim();
  const t = encodeURIComponent(tracking.trim());
  if (c.includes("colissimo") || c.includes("poste"))
    return `https://www.laposte.fr/outils/suivre-vos-envois?code=${t}`;
  if (c.includes("chronopost"))
    return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${t}`;
  if (c.includes("mondial"))
    return `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${t}`;
  if (c.includes("dhl")) return `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${t}`;
  if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${t}`;
  if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${t}`;
  if (c.includes("dpd")) return `https://www.dpd.fr/trace/${t}`;
  if (c.includes("gls")) return `https://gls-group.com/FR/fr/suivi-colis?match=${t}`;
  return `https://www.google.com/search?q=${encodeURIComponent(carrier + " suivi " + tracking)}`;
}

export const sendShippingNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        carrier: z.string().min(1).max(100),
        trackingNumber: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, email, first_name, last_name")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order) throw new Error("Commande introuvable");

    const trackingUrl = buildTrackingUrl(data.carrier, data.trackingNumber);
    const shippedAt = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        tracking_number: data.trackingNumber.trim(),
        status: "shipped",
        shipped_at: shippedAt,
      })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);

    try {
      const { sendAppEmail } = await import("@/lib/email/send.server");
      await sendAppEmail({
        templateName: "order-shipped",
        recipientEmail: order.email,
        idempotencyKey: `shipped-${order.id}-${Date.now()}`,
        templateData: {
          customerName: [order.first_name, order.last_name].filter(Boolean).join(" "),
          orderNumber: order.order_number,
          carrier: data.carrier,
          trackingNumber: data.trackingNumber.trim(),
          trackingUrl,
        },
      });
    } catch (e) {
      console.error("order-shipped email failed", e);
    }
    try {
      const { data: o2 } = await supabaseAdmin
        .from("orders")
        .select("user_id")
        .eq("id", data.orderId)
        .maybeSingle();
      if (o2?.user_id) {
        const { safeBroadcastToUser } = await import("./push.server");
        await safeBroadcastToUser(o2.user_id, {
          title: "Commande expédiée 📦",
          body: `${order.order_number} · ${data.carrier} ${data.trackingNumber}`,
          url: "/mon-compte",
          tag: `ship-${order.id}`,
        });
      }
    } catch (e) {
      console.error("customer push failed", e);
    }
    return { ok: true, shippedAt, trackingUrl };
  });

// ─────────── Stock ───────────
export const adjustStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        productId: z.string().uuid(),
        slug: z.string(),
        delta: z.number().int(),
        reason: z.enum(["restock", "manual", "return", "loss", "correction"]),
        note: z.string().max(500).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p } = await supabaseAdmin
      .from("products")
      .select("stock")
      .eq("id", data.productId)
      .maybeSingle();
    if (!p) throw new Error("Produit introuvable");
    const newStock = Math.max(0, p.stock + data.delta);
    const { error: uErr } = await supabaseAdmin
      .from("products")
      .update({ stock: newStock })
      .eq("id", data.productId);
    if (uErr) throw new Error(uErr.message);
    await supabaseAdmin.from("stock_movements").insert({
      product_slug: data.slug,
      delta: data.delta,
      reason: data.reason,
      note: data.note ?? null,
      created_by: context.userId,
    });
    return { stock: newStock };
  });

export const setLowStockThreshold = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ productId: z.string().uuid(), threshold: z.number().int().min(0) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("products")
      .update({ low_stock_threshold: data.threshold })
      .eq("id", data.productId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listStockMovements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("stock_movements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

// ─────────── Clients ───────────
export const listCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select(
        "id,email,first_name,last_name,phone,address_line,postal_code,city,country,total_eur,created_at,status",
      )
      .order("created_at", { ascending: false });
    const { data: notes } = await supabaseAdmin.from("customer_notes").select("*");
    const notesByEmail = new Map((notes ?? []).map((n) => [n.email, n.note]));

    const byEmail = new Map<string, any>();
    for (const o of orders ?? []) {
      const key = o.email.toLowerCase();
      const prev = byEmail.get(key);
      if (!prev) {
        byEmail.set(key, {
          email: o.email,
          firstName: o.first_name,
          lastName: o.last_name,
          phone: o.phone,
          lastAddress: `${o.address_line}, ${o.postal_code} ${o.city}, ${o.country}`,
          orderCount: 1,
          totalSpent: Number(o.total_eur),
          firstOrder: o.created_at,
          lastOrder: o.created_at,
          note: notesByEmail.get(o.email) ?? "",
        });
      } else {
        prev.orderCount += 1;
        prev.totalSpent += Number(o.total_eur);
        if (o.created_at > prev.lastOrder) prev.lastOrder = o.created_at;
        if (o.created_at < prev.firstOrder) prev.firstOrder = o.created_at;
      }
    }
    return Array.from(byEmail.values()).sort(
      (a, b) => +new Date(b.lastOrder) - +new Date(a.lastOrder),
    );
  });

export const upsertCustomerNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().email(), note: z.string().max(4000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("customer_notes")
      .upsert({ email: data.email, note: data.note, updated_by: context.userId, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ─────────── Statistiques ───────────
export const getStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ days: z.number().int().min(1).max(365).default(30) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.days * 86400_000).toISOString();

    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("id,total_eur,status,created_at,email")
      .gte("created_at", since);
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_name,quantity,line_total_eur,created_at")
      .gte("created_at", since);
    const { data: views } = await supabaseAdmin
      .from("page_views")
      .select("path,referrer,session_id,country,created_at")
      .gte("created_at", since);

    const validOrders = (orders ?? []).filter((o) => o.status !== "cancelled");
    const revenue = validOrders.reduce((a, o) => a + Number(o.total_eur), 0);
    const avgBasket = validOrders.length ? revenue / validOrders.length : 0;
    const uniqueSessions = new Set((views ?? []).map((v) => v.session_id).filter(Boolean)).size;
    const conversionRate = uniqueSessions ? (validOrders.length / uniqueSessions) * 100 : 0;

    // Daily series
    const daily = new Map<string, { date: string; revenue: number; orders: number; views: number }>();
    for (let i = data.days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
      daily.set(d, { date: d, revenue: 0, orders: 0, views: 0 });
    }
    for (const o of validOrders) {
      const d = o.created_at.slice(0, 10);
      const row = daily.get(d);
      if (row) {
        row.revenue += Number(o.total_eur);
        row.orders += 1;
      }
    }
    for (const v of views ?? []) {
      const d = v.created_at.slice(0, 10);
      const row = daily.get(d);
      if (row) row.views += 1;
    }

    // Top products
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const it of items ?? []) {
      const cur = productMap.get(it.product_name) ?? { name: it.product_name, quantity: 0, revenue: 0 };
      cur.quantity += it.quantity;
      cur.revenue += Number(it.line_total_eur);
      productMap.set(it.product_name, cur);
    }
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    // Referrer breakdown
    const refMap = new Map<string, number>();
    for (const v of views ?? []) {
      const host = v.referrer ? safeHost(v.referrer) : "direct";
      refMap.set(host, (refMap.get(host) ?? 0) + 1);
    }
    const topReferrers = Array.from(refMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Top pages
    const pageMap = new Map<string, number>();
    for (const v of views ?? []) pageMap.set(v.path, (pageMap.get(v.path) ?? 0) + 1);
    const topPages = Array.from(pageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      revenue,
      orderCount: validOrders.length,
      avgBasket,
      pageViews: views?.length ?? 0,
      uniqueSessions,
      conversionRate,
      daily: Array.from(daily.values()),
      topProducts,
      topReferrers,
      topPages,
    };
  });

function safeHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "direct";
  }
}

// ─────────── Tickets SAV ───────────
export const listTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: tickets } = await supabaseAdmin
      .from("support_tickets")
      .select("*")
      .order("updated_at", { ascending: false });
    const { data: messages } = await supabaseAdmin
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: true });
    return { tickets: tickets ?? [], messages: messages ?? [] };
  });

export const replyTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        ticketId: z.string().uuid(),
        body: z.string().min(1).max(5000),
        status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("support_messages").insert({
      ticket_id: data.ticketId,
      author_role: "admin",
      body: data.body,
    });
    const patch: { updated_at: string; status?: string } = {
      updated_at: new Date().toISOString(),
    };
    if (data.status) patch.status = data.status;
    await supabaseAdmin.from("support_tickets").update(patch).eq("id", data.ticketId);

    // Send reply email to ticket author (best-effort)
    try {
      const { data: ticket } = await supabaseAdmin
        .from("support_tickets")
        .select("email,subject,id")
        .eq("id", data.ticketId)
        .maybeSingle();
      if (ticket?.email) {
        const { sendAppEmail } = await import("@/lib/email/send.server");
        await sendAppEmail({
          templateName: "support-reply",
          recipientEmail: ticket.email,
          idempotencyKey: `sav-reply-${data.ticketId}-${Date.now()}`,
          templateData: {
            subject: ticket.subject ?? "",
            body: data.body,
            ticketRef: ticket.id.slice(0, 8).toUpperCase(),
          },
        });
      }
    } catch (e) {
      console.error("SAV reply email failed", e);
    }

    return { ok: true };
  });

export const updateTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        ticketId: z.string().uuid(),
        status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
        priority: z.enum(["low", "normal", "high"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { updated_at: string; status?: string; priority?: string } = {
      updated_at: new Date().toISOString(),
    };
    if (data.status) patch.status = data.status;
    if (data.priority) patch.priority = data.priority;
    await supabaseAdmin.from("support_tickets").update(patch).eq("id", data.ticketId);

    return { ok: true };
  });

// ─────────── Facture PDF ───────────
export const generateInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ orderId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order) throw new Error("Commande introuvable");
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", data.orderId);

    // Reserve invoice number if none yet
    let invoiceNumber = order.invoice_number as string | null;
    let issuedAt = order.invoice_issued_at as string | null;
    if (!invoiceNumber) {
      const { data: next } = await supabaseAdmin.rpc("next_invoice_number");
      invoiceNumber = next as string;
      issuedAt = new Date().toISOString();
      await supabaseAdmin
        .from("orders")
        .update({ invoice_number: invoiceNumber, invoice_issued_at: issuedAt })
        .eq("id", order.id);
    }

    const pdfBytes = await buildInvoicePdf({
      invoiceNumber: invoiceNumber!,
      issuedAt: issuedAt!,
      order,
      items: items ?? [],
    });

    // Convert to base64 (Worker-safe)
    let binary = "";
    const bytes = new Uint8Array(pdfBytes);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(binary);

    return {
      filename: `${invoiceNumber}.pdf`,
      base64,
      invoiceNumber,
    };
  });

async function buildInvoicePdf(opts: {
  invoiceNumber: string;
  issuedAt: string;
  order: any;
  items: any[];
}) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const draw = (
    text: string,
    x: number,
    y: number,
    size = 10,
    font = helv,
    color = rgb(0.1, 0.1, 0.12),
  ) => page.drawText(text, { x, y, size, font, color });

  // Header
  draw("PEPTINIUM", 40, 790, 22, helvBold, rgb(0.06, 0.06, 0.08));
  draw("LABS", 158, 790, 22, helv, rgb(0.55, 0.22, 0.12));
  draw("Réactifs peptidiques de recherche (RUO)", 40, 772, 9, helv, rgb(0.45, 0.45, 0.5));
  draw("contact@peptinium.com  ·  www.peptinium.com", 40, 760, 9);

  draw("FACTURE", 420, 790, 16, helvBold);
  draw(`N° ${opts.invoiceNumber}`, 420, 770, 10, helvBold);
  draw(`Émise le ${new Date(opts.issuedAt).toLocaleDateString("fr-FR")}`, 420, 758, 9);
  draw(`Commande ${opts.order.order_number}`, 420, 746, 9);

  // Separator
  page.drawLine({
    start: { x: 40, y: 730 },
    end: { x: 555, y: 730 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.88),
  });

  // Client
  draw("FACTURÉ À", 40, 710, 8, helvBold, rgb(0.45, 0.45, 0.5));
  draw(`${opts.order.first_name} ${opts.order.last_name}`, 40, 696, 11, helvBold);
  draw(opts.order.address_line, 40, 682, 9);
  draw(`${opts.order.postal_code} ${opts.order.city}`, 40, 670, 9);
  draw(opts.order.country, 40, 658, 9);

  // Table header
  let y = 600;
  page.drawRectangle({
    x: 40,
    y: y - 4,
    width: 515,
    height: 22,
    color: rgb(0.96, 0.96, 0.97),
  });
  draw("Désignation", 48, y + 4, 9, helvBold);
  draw("Qté", 380, y + 4, 9, helvBold);
  draw("PU HT", 425, y + 4, 9, helvBold);
  draw("Total HT", 500, y + 4, 9, helvBold);
  y -= 24;

  const VAT_RATE = 0.2;
  let totalTTC = Number(opts.order.total_eur);
  let totalHT = 0;
  for (const it of opts.items) {
    const lineTTC = Number(it.line_total_eur);
    const lineHT = lineTTC / (1 + VAT_RATE);
    const unitHT = Number(it.unit_price_eur) / (1 + VAT_RATE);
    totalHT += lineHT;
    draw(truncate(it.product_name, 55), 48, y, 9);
    draw(String(it.quantity), 380, y, 9);
    draw(unitHT.toFixed(2) + " €", 425, y, 9);
    draw(lineHT.toFixed(2) + " €", 500, y, 9);
    y -= 18;
    if (y < 200) break;
  }
  const vat = totalTTC - totalHT;

  // Totals
  y -= 10;
  page.drawLine({
    start: { x: 360, y },
    end: { x: 555, y },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.88),
  });
  y -= 18;
  draw("Total HT", 380, y, 9);
  draw(totalHT.toFixed(2) + " €", 500, y, 9);
  y -= 14;
  draw(`TVA ${(VAT_RATE * 100).toFixed(0)} %`, 380, y, 9);
  draw(vat.toFixed(2) + " €", 500, y, 9);
  y -= 16;
  draw("Total TTC", 380, y, 11, helvBold);
  draw(totalTTC.toFixed(2) + " €", 500, y, 11, helvBold);

  // Footer
  draw(
    "Produits réservés strictement à la recherche scientifique en laboratoire (RUO).",
    40,
    90,
    8,
    helv,
    rgb(0.55, 0.55, 0.6),
  );
  draw(
    "Non destinés à un usage vétérinaire, diagnostique ou thérapeutique.",
    40,
    78,
    8,
    helv,
    rgb(0.55, 0.55, 0.6),
  );
  draw("Peptinium Labs — TVA non applicable, art. 293 B du CGI.", 40, 60, 8);
  draw(`Paiement par virement bancaire — voir coordonnées transmises par email`, 40, 48, 8);

  return await doc.save();
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// ─────────── Test d'envoi des emails de marque (admin) ───────────
export const sendBrandedEmailTests = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ recipient: z.string().email() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { sendAppEmail } = await import("@/lib/email/send.server");
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const authHeader = req?.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const stamp = Date.now();
    const sends = [
      {
        templateName: "order-confirmation",
        templateData: {
          customerName: "Peptinium",
          orderNumber: "TEST-OC-001",
          totalEur: 149.9,
          items: [{ name: "BPC-157 5mg", quantity: 2, price_eur: 74.95 }],
        },
      },
      {
        templateName: "payment-link",
        templateData: {
          customerName: "Peptinium",
          orderNumber: "TEST-PL-001",
          totalEur: 189,
          paymentLink: "https://checkout.revolut.com/pay/example",
          items: [{ name: "Retatrutide 10mg", quantity: 1, price_eur: 189 }],
        },
      },
      {
        templateName: "crypto-payment",
        templateData: {
          customerName: "Peptinium",
          orderNumber: "TEST-CP-001",
          totalEur: 189,
          currencyName: "Bitcoin",
          currencyCode: "BTC",
          network: "Bitcoin (BTC)",
          address: "bc1qexampleexampleexampleexampleexampleex",
        },
      },
      {
        templateName: "order-shipped",
        templateData: {
          customerName: "Peptinium",
          orderNumber: "TEST-OS-001",
          carrier: "Colissimo",
          trackingNumber: "6A12345678901",
          trackingUrl:
            "https://www.laposte.fr/outils/suivre-vos-envois?code=6A12345678901",
        },
      },
      {
        templateName: "support-reply",
        templateData: {
          subject: "Test mise en page Peptinium",
          body: "Bonjour, ceci est un test de la nouvelle mise en page Peptinium pour les emails SAV.",
          ticketRef: "SAV-TEST-001",
        },
      },
    ];
    const results: Array<{ template: string; ok: boolean; error?: string }> = [];
    for (const s of sends) {
      const r = await sendAppEmail({
        templateName: s.templateName,
        recipientEmail: data.recipient,
        idempotencyKey: `test-${s.templateName}-${stamp}`,
        templateData: s.templateData,
        request: req ?? undefined,
        bearerToken,
      });
      results.push({ template: s.templateName, ok: r.ok, error: r.error });
    }
    return { recipient: data.recipient, results };
  });

