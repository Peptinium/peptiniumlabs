import { createFileRoute } from "@tanstack/react-router";
import { verifySushippSignature } from "@/lib/sushipp.server";

type SushippEvent = {
  orderNumber: string;
  status: string;
  amountCents?: number;
  currency?: string;
  shopifyOrder?: string;
  metadata?: Record<string, string>;
  order_id?: string;
  order_number?: string;
};

export const Route = createFileRoute("/api/public/sushipp-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("x-sushipp-signature");

        if (!verifySushippSignature(rawBody, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: SushippEvent;
        try {
          event = JSON.parse(rawBody) as SushippEvent;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        if (event.status !== "paid") {
          return new Response("ok", { status: 200 });
        }

        // order_id = id de la commande Medusa (posé dans les métadonnées Sushipp).
        const orderId = event.metadata?.order_id ?? event.order_id;
        if (!orderId) {
          console.warn("[sushipp-webhook] missing order_id", event.orderNumber);
          return new Response("Missing order_id", { status: 400 });
        }

        // Paiement confirmé : on complète la commande Medusa (draft -> order)
        // et on décrémente l'inventaire. Idempotent (retries webhook sûrs).
        try {
          const { completeMedusaOrder } = await import("@/lib/medusa.server");
          await completeMedusaOrder(orderId);
        } catch (e) {
          console.error("[sushipp-webhook] completeMedusaOrder failed", orderId, e);
          return new Response("Order completion failed", { status: 500 });
        }

        // Emails (non bloquants) : « paiement confirmé » au client + notif admin.
        try {
          const { getOrderEmailData } = await import("@/lib/medusa.server");
          const od = await getOrderEmailData(orderId);
          if (od) {
            const { enqueueAppEmail } = await import("@/lib/email/enqueue.server");

            // 1) Client — « paiement reçu ».
            if (od.email) {
              await enqueueAppEmail({
                templateName: "order-paid",
                recipientEmail: od.email,
                idempotencyKey: `order-paid-${orderId}`,
                templateData: {
                  orderNumber: od.orderNumber,
                  totalEur: od.totalEur,
                  items: od.items,
                  shippingAddress: od.shippingAddress,
                },
              });
            }

            // 2) Admin — notification à chaque vente.
            await enqueueAppEmail({
              templateName: "admin-new-order",
              recipientEmail: "peptinium@gmail.com",
              idempotencyKey: `admin-paid-${orderId}`,
              templateData: {
                orderNumber: od.orderNumber,
                customerName: od.customerName,
                email: od.email,
                totalEur: od.totalEur,
                paymentMethod: "card",
                adminUrl: "https://peptinium.com/admin",
                items: od.items,
              },
            });
          }
        } catch (e) {
          console.error("[sushipp-webhook] emails failed", orderId, e);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
