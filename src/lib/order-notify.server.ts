/**
 * Server-only helper that notifies admins when an order becomes PAID.
 * Called from the PeptidePay webhook and the crypto watcher after a
 * successful settlement — never at order creation.
 */
export async function notifyAdminsOrderPaid(orderId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, total_eur, payment_method, first_name, last_name, email, notified_paid_at")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return;
  // Idempotency guard — never notify twice for the same order.
  if ((order as any).notified_paid_at) return;

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("product_name, quantity, unit_price_eur")
    .eq("order_id", orderId);

  const customerName = `${order.first_name ?? ""} ${order.last_name ?? ""}`.trim();
  const total = Number(order.total_eur);

  // Admin push
  try {
    const { broadcastToAdmins } = await import("./push.server");
    await broadcastToAdmins({
      title: "Commande payée ✅",
      body: `${order.order_number} · ${total.toFixed(2)} €`,
      url: "/admin",
      tag: `order-paid-${order.id}`,
    });
  } catch (e) {
    console.error("[notifyAdminsOrderPaid] push failed", e);
  }

  // Admin email
  try {
    const { enqueueAppEmail } = await import("./email/enqueue.server");
    await enqueueAppEmail({
      templateName: "admin-new-order",
      recipientEmail: "peptinium@gmail.com",
      idempotencyKey: `admin-paid-${order.id}`,
      templateData: {
        orderNumber: order.order_number,
        customerName,
        email: order.email,
        totalEur: total,
        paymentMethod: order.payment_method,
        adminUrl: "https://peptinium.com/admin",
        items: (items ?? []).map((i: any) => ({
          name: i.product_name,
          quantity: i.quantity,
          price_eur: Number(i.unit_price_eur),
        })),
      },
    });
  } catch (e) {
    console.error("[notifyAdminsOrderPaid] admin email failed", e);
  }

  // Mark as notified so retries don't re-send.
  try {
    await supabaseAdmin
      .from("orders")
      .update({ notified_paid_at: new Date().toISOString() })
      .eq("id", orderId);
  } catch (e) {
    // Column may not exist yet — non-fatal, idempotency still enforced by email idempotencyKey.
  }
}
