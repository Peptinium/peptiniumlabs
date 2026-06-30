import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PaymentLinkInput = z.object({
  orderId: z.string().uuid(),
  paymentLink: z.string().min(1).max(2000),
});

const MarkPaidInput = z.object({
  orderId: z.string().uuid(),
});

const ShippingInput = z.object({
  orderId: z.string().uuid(),
  trackingNumber: z.string().min(1).max(200),
  carrier: z.string().min(1).max(100),
});

const CryptoInput = z.object({
  orderId: z.string().uuid(),
  address: z.string().min(4).max(200),
  currencyName: z.string().min(1).max(50).default("Bitcoin"),
  currencyCode: z.string().min(1).max(20).default("BTC"),
  network: z.string().min(1).max(100).default("Bitcoin (BTC)"),
});

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Accès refusé");
}

export const sendPaymentLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PaymentLinkInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { validatePaymentLink, buildShippingAddress } = await import(
      "./admin-payment.server"
    );
    const { enqueueAppEmail } = await import("./email/enqueue.server");

    const cleanLink = validatePaymentLink(data.paymentLink);

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error || !order) throw new Error("Commande introuvable.");

    const sentAt = new Date().toISOString();
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({
        payment_link: cleanLink,
        payment_link_sent_at: sentAt,
        status: "payment_link_sent",
      })
      .eq("id", data.orderId);
    if (updErr) throw new Error(`Mise à jour échouée : ${updErr.message}`);

    await enqueueAppEmail({
      templateName: "payment-link",
      recipientEmail: order.email,
      idempotencyKey: `payment-link-${order.id}-${Date.now()}`,
      templateData: {
        customerName: `${order.first_name} ${order.last_name}`.trim(),
        orderNumber: order.order_number,
        totalEur: Number(order.total_eur),
        paymentLink: cleanLink,
        shippingAddress: buildShippingAddress(order),
        items: (order.order_items ?? []).map((it: any) => ({
          name: it.product_name,
          quantity: it.quantity,
          price_eur: Number(it.unit_price_eur),
        })),
      },
    });

    return { success: true, sentAt };
  });

export const sendCryptoPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CryptoInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { buildShippingAddress } = await import("./admin-payment.server");
    const { enqueueAppEmail } = await import("./email/enqueue.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error || !order) throw new Error("Commande introuvable.");

    const sentAt = new Date().toISOString();
    await supabaseAdmin
      .from("orders")
      .update({
        payment_link: `${data.currencyCode}:${data.address}`,
        payment_link_sent_at: sentAt,
        status: "payment_link_sent",
      })
      .eq("id", data.orderId);

    await enqueueAppEmail({
      templateName: "crypto-payment",
      recipientEmail: order.email,
      idempotencyKey: `crypto-payment-${order.id}-${Date.now()}`,
      templateData: {
        customerName: `${order.first_name} ${order.last_name}`.trim(),
        orderNumber: order.order_number,
        totalEur: Number(order.total_eur),
        currencyName: data.currencyName,
        currencyCode: data.currencyCode,
        network: data.network,
        address: data.address.trim(),
        shippingAddress: buildShippingAddress(order),
        items: (order.order_items ?? []).map((it: any) => ({
          name: it.product_name,
          quantity: it.quantity,
          price_eur: Number(it.unit_price_eur),
        })),
      },
    });

    return { success: true, sentAt };
  });

export const markOrderPaid = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => MarkPaidInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { buildShippingAddress } = await import("./admin-payment.server");
    const { enqueueAppEmail } = await import("./email/enqueue.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error || !order) throw new Error("Commande introuvable.");

    const paidAt = new Date().toISOString();
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        paid_at: paidAt,
        payment_validated_at: paidAt,
        payment_validated_by: context.userId,
      })
      .eq("id", data.orderId);
    if (updErr) throw new Error(`Mise à jour échouée : ${updErr.message}`);

    await enqueueAppEmail({
      templateName: "order-paid",
      recipientEmail: order.email,
      idempotencyKey: `order-paid-${order.id}`,
      templateData: {
        customerName: `${order.first_name} ${order.last_name}`.trim(),
        orderNumber: order.order_number,
        totalEur: Number(order.total_eur),
        shippingAddress: buildShippingAddress(order),
        items: (order.order_items ?? []).map((it: any) => ({
          name: it.product_name,
          quantity: it.quantity,
          price_eur: Number(it.unit_price_eur),
        })),
      },
    });

    return { success: true, paidAt };
  });

export const sendShippingNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ShippingInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { buildTrackingUrl } = await import("./admin-payment.server");
    const { enqueueAppEmail } = await import("./email/enqueue.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error || !order) throw new Error("Commande introuvable.");

    const trackingNumber = data.trackingNumber.trim();
    const carrier = data.carrier.trim();
    const trackingUrl = buildTrackingUrl(carrier, trackingNumber);

    const shippedAt = new Date().toISOString();
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({
        tracking_number: trackingNumber,
        tracking_carrier: carrier,
        status: "shipped",
        shipped_at: shippedAt,
      })
      .eq("id", data.orderId);
    if (updErr) throw new Error(`Mise à jour échouée : ${updErr.message}`);

    await enqueueAppEmail({
      templateName: "order-shipped",
      recipientEmail: order.email,
      idempotencyKey: `order-shipped-${order.id}-${Date.now()}`,
      templateData: {
        customerName: `${order.first_name} ${order.last_name}`.trim(),
        orderNumber: order.order_number,
        carrier,
        trackingNumber,
        trackingUrl,
      },
    });

    return { success: true, shippedAt, trackingUrl };
  });
