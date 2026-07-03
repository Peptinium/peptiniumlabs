import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getOptionalUserId(): Promise<string | null> {
  try {
    const auth = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
    if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
    const token = auth.slice(7).trim();
    if (!token) return null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

const itemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

const placeOrderSchema = z.object({
  shipping: z.object({
    email: z.string().email(),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    phone: z.string().max(40).optional().nullable(),
    address: z.string().min(1).max(200),
    address2: z.string().max(200).optional().nullable(),
    postal: z.string().min(1).max(20),
    city: z.string().min(1).max(100),
    country: z.string().min(1).max(80),
    notes: z.string().max(1000).optional().nullable(),
  }),
  items: z.array(itemSchema).min(1).max(50),
  paymentMethod: z.enum(["bank", "card", "crypto"]).default("bank"),
  promoCode: z.string().trim().max(40).optional().nullable(),
});

const SHIPPING_FEE_EUR = 6.0;
const FREE_SHIPPING_THRESHOLD_EUR = 150;


export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-price server-side from products table to prevent tampering
    const slugs = data.items.map((i) => i.slug);
    const { data: prods, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("slug,name,price_eur,stock,active")
      .in("slug", slugs);
    if (prodErr) throw new Error("Erreur produits");
    const bySlug = new Map((prods ?? []).map((p) => [p.slug, p]));

    let subtotal = 0;
    const items = data.items.map((i) => {
      const p = bySlug.get(i.slug);
      if (!p || !p.active) throw new Error(`Produit indisponible : ${i.slug}`);
      if (p.stock < i.quantity)
        throw new Error(`Stock insuffisant pour ${p.name}`);
      const unit = Number(p.price_eur);
      const line = unit * i.quantity;
      subtotal += line;
      return {
        product_slug: i.slug,
        product_name: p.name,
        quantity: i.quantity,
        unit_price_eur: unit,
        line_total_eur: line,
      };
    });

    // Server-side shipping fee (cannot be tampered by the client)
    const shippingFee =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD_EUR ? 0 : SHIPPING_FEE_EUR;

    // Server-side promo code validation
    let discount = 0;
    let appliedPromoCode: string | null = null;
    if (data.promoCode && data.promoCode.trim().length > 0) {
      const code = data.promoCode.trim().toUpperCase();
      const { data: promo } = await supabaseAdmin
        .from("promo_codes")
        .select("code,rate,active")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();
      if (promo) {
        discount = Math.round(subtotal * Number(promo.rate) * 100) / 100;
        appliedPromoCode = promo.code;
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);

    const userId = await getOptionalUserId();

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        status: "pending",
        total_eur: total,
        first_name: data.shipping.firstName,
        last_name: data.shipping.lastName,
        email: data.shipping.email,
        phone: data.shipping.phone ?? null,
        address_line:
          data.shipping.address +
          (data.shipping.address2 ? `, ${data.shipping.address2}` : ""),
        postal_code: data.shipping.postal,
        city: data.shipping.city,
        country: data.shipping.country,
        notes: data.shipping.notes ?? null,
        user_id: userId,
        payment_method: data.paymentMethod,
      })
      .select("id, order_number, total_eur, payment_method")
      .single();
    if (orderErr || !order) throw new Error("Création commande échouée");

    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));
    if (itemsErr) throw new Error("Articles non enregistrés");

    // Decrement stock
    for (const i of data.items) {
      const p = bySlug.get(i.slug)!;
      await supabaseAdmin
        .from("products")
        .update({ stock: p.stock - i.quantity })
        .eq("slug", i.slug);
    }

    try {
      const { broadcastToAdmins } = await import("./push.server");
      await broadcastToAdmins({
        title: "Nouvelle commande",
        body: `${order.order_number} · ${Number(order.total_eur).toFixed(2)} €`,
        url: "/admin",
        tag: `order-${order.id}`,
      });
    } catch (e) {
      console.error("admin push failed", e);
    }

    // Customer "order received — instructions sous 24 h"
    try {
      const { enqueueAppEmail } = await import("./email/enqueue.server");
      await enqueueAppEmail({
        templateName: "order-pending",
        recipientEmail: data.shipping.email,
        idempotencyKey: `order-pending-${order.id}`,
        templateData: {
          customerName: `${data.shipping.firstName} ${data.shipping.lastName}`.trim(),
          orderNumber: order.order_number,
          totalEur: Number(order.total_eur),
          paymentMethod: data.paymentMethod,
          items: items.map((i) => ({
            name: i.product_name,
            quantity: i.quantity,
            price_eur: Number(i.unit_price_eur),
          })),
        },
      });
    } catch (e) {
      console.error("order-pending email failed", e);
    }

    // Admin notification
    try {
      const { enqueueAppEmail } = await import("./email/enqueue.server");
      await enqueueAppEmail({
        templateName: "admin-new-order",
        recipientEmail: "peptinium@gmail.com",
        idempotencyKey: `admin-new-${order.id}`,
        templateData: {
          orderNumber: order.order_number,
          customerName: `${data.shipping.firstName} ${data.shipping.lastName}`.trim(),
          email: data.shipping.email,
          totalEur: Number(order.total_eur),
          paymentMethod: data.paymentMethod,
          adminUrl: "https://peptinium.com/admin",
          items: items.map((i) => ({
            name: i.product_name,
            quantity: i.quantity,
            price_eur: Number(i.unit_price_eur),
          })),
        },
      });
    } catch (e) {
      console.error("admin-new-order email failed", e);
    }

    return {
      orderNumber: order.order_number as string,
      total: Number(order.total_eur),
      paymentMethod: order.payment_method as string,
    };
  });

// Public: validate a promo code (returns rate if active, otherwise null)
export const validatePromoCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().trim().min(1).max(40) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code = data.code.trim().toUpperCase();
    const { data: promo } = await supabaseAdmin
      .from("promo_codes")
      .select("code,rate,active")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();
    if (!promo) return { valid: false as const };
    return { valid: true as const, code: promo.code, rate: Number(promo.rate) };
  });

// ─────── Admin server functions ───────


export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin) throw new Error("Accès refusé");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: items } = await supabaseAdmin.from("order_items").select("*");
    return {
      orders: orders ?? [],
      items: items ?? [],
    };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("order_items").delete().eq("order_id", data.id);
    const { error } = await supabaseAdmin.from("orders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "paid", "shipped", "cancelled"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listProductsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("name");
    return data ?? [];
  });

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        stock: z.number().int().min(0).optional(),
        active: z.boolean().optional(),
        price_eur: z.number().nonnegative().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { stock?: number; active?: boolean; price_eur?: number } = {};
    if (data.stock !== undefined) patch.stock = data.stock;
    if (data.active !== undefined) patch.active = data.active;
    if (data.price_eur !== undefined) patch.price_eur = data.price_eur;
    const { error } = await supabaseAdmin
      .from("products")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// NOTE: The public "claim admin" bootstrap endpoint has been removed for
// security reasons. Admin roles must be granted directly via the database
// (INSERT INTO public.user_roles ...) — never via a client-callable endpoint.

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    return { isAdmin: !!roleRow, userId };
  });
