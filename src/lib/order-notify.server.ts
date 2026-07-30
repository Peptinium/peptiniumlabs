/**
 * Server-only helper that notifies admins when an order becomes PAID.
 * Called from the PeptidePay webhook and the crypto watcher after a
 * successful settlement — never at order creation.
 *
 * Two order stores coexist: the legacy `public.orders` table, and Medusa,
 * which is the source of truth for everything `placeOrder` creates. A Medusa
 * id (`order_01KY...`) matches nothing in Supabase, so this used to return
 * silently and no admin was ever notified for a real order.
 *
 * `amountEurHint` wins when provided: Medusa's `total` is not reliably
 * expressed in euros, whereas the caller (the crypto watcher) holds the exact
 * amount it invoiced.
 */
export async function notifyAdminsOrderPaid(
  orderId: string,
  amountEurHint?: number,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  type Info = {
    orderNumber: string;
    customerName: string;
    email: string;
    total: number;
    paymentMethod: string;
    items: Array<{ name: string; quantity: number; price_eur: number }>;
    /** Legacy rows carry their own idempotency column. */
    legacy: boolean;
  };

  let info: Info;

  // 1. Chemin historique : commande dans public.orders.
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select(
      "id, order_number, total_eur, payment_method, first_name, last_name, email, notified_paid_at",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (order) {
    // Garde-fou d'idempotence propre à ce chemin.
    if ((order as any).notified_paid_at) return;

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_name, quantity, unit_price_eur")
      .eq("order_id", orderId);

    info = {
      orderNumber: order.order_number,
      customerName: `${order.first_name ?? ""} ${order.last_name ?? ""}`.trim(),
      email: order.email,
      total: amountEurHint ?? Number(order.total_eur),
      paymentMethod: order.payment_method,
      items: (items ?? []).map((i: any) => ({
        name: i.product_name,
        quantity: i.quantity,
        price_eur: Number(i.unit_price_eur),
      })),
      legacy: true,
    };
  } else {
    // 2. Commande Medusa. L'idempotence est assurée par l'appelant
    //    (crypto_payments.notified_at) et par l'idempotencyKey de l'email.
    const { getOrderEmailData } = await import("./medusa.server");
    const m = await getOrderEmailData(orderId).catch(() => null);
    if (!m) {
      console.warn("[notifyAdminsOrderPaid] commande introuvable", orderId);
      return;
    }
    info = {
      orderNumber: m.orderNumber,
      customerName: m.customerName,
      email: m.email,
      total: amountEurHint ?? m.totalEur,
      paymentMethod: "crypto",
      items: m.items,
      legacy: false,
    };
  }

  // Admin push
  try {
    const { broadcastToAdmins } = await import("./push.server");
    await broadcastToAdmins({
      title: "Commande payée ✅",
      body: `${info.orderNumber} · ${info.total.toFixed(2)} €`,
      url: "/admin",
      tag: `order-paid-${orderId}`,
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
      idempotencyKey: `admin-paid-${orderId}`,
      templateData: {
        orderNumber: info.orderNumber,
        customerName: info.customerName,
        email: info.email,
        totalEur: info.total,
        paymentMethod: info.paymentMethod,
        adminUrl: "https://peptinium.com/admin",
        items: info.items,
      },
    });
  } catch (e) {
    console.error("[notifyAdminsOrderPaid] admin email failed", e);
  }

  // Marquage anti-relance, uniquement pour le chemin historique.
  if (info.legacy) {
    try {
      await supabaseAdmin
        .from("orders")
        .update({ notified_paid_at: new Date().toISOString() })
        .eq("id", orderId);
    } catch {
      // Colonne éventuellement absente — non bloquant, l'idempotencyKey de
      // l'email empêche déjà le doublon.
    }
  }
}
