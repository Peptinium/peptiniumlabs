import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  orderId: z.string().uuid(),
});

/**
 * Create a PeptidePay hosted-checkout session for an existing order.
 * The order MUST already exist in the DB (created via your normal checkout
 * flow). The amount is re-read server-side from `orders.total_eur` — the
 * client never supplies the price.
 */
export const createPeptidePayCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createPeptidePaySession } = await import("./peptidepay.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total_eur, email, status")
      .eq("id", data.orderId)
      .maybeSingle();

    if (error || !order) throw new Error("Commande introuvable.");
    if (order.status === "paid") throw new Error("Commande déjà payée.");
    if (!order.total_eur || Number(order.total_eur) <= 0) {
      throw new Error("Montant de commande invalide.");
    }

    const amountCents = Math.round(Number(order.total_eur) * 100);
    const origin = "https://peptinium.com";

    const session = await createPeptidePaySession({
      amountCents,
      currency: "EUR",
      customerEmail: order.email ?? undefined,
      productName: `Commande ${order.order_number}`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
      successUrl: `${origin}/mon-compte?order=${order.order_number}`,
      cancelUrl: `${origin}/panier`,
      idempotencyKey: `order-${order.id}`,
    });

    // Persist the checkout URL so the customer can be re-sent to it.
    await supabaseAdmin
      .from("orders")
      .update({
        payment_method: "peptidepay",
        payment_link: session.url,
        payment_link_sent_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return { url: session.url, id: session.id };
  });
