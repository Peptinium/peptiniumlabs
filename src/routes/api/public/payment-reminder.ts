import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron : relance des commandes PeptidePay non payées.
 * Envoie UNE SEULE relance par commande, entre 30 min et 12 h après création,
 * uniquement si :
 *  - status = 'pending'
 *  - payment_method = 'peptidepay'
 *  - payment_link présent
 *  - payment_reminder_sent_at IS NULL
 *  - la session PeptidePay est toujours en statut 'pending' (sécurité)
 *
 * Auth : apikey publishable (comme la cron crypto-watcher).
 */
export const Route = createFileRoute("/api/public/payment-reminder")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey") ?? request.headers.get("x-cron-key");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (expected && apiKey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { enqueueAppEmail } = await import("@/lib/email/enqueue.server");

        const now = Date.now();
        const minAgeIso = new Date(now - 30 * 60 * 1000).toISOString();
        const maxAgeIso = new Date(now - 12 * 60 * 60 * 1000).toISOString();

        const { data: orders, error } = await supabaseAdmin
          .from("orders")
          .select("id, order_number, email, first_name, total_eur, payment_link, created_at")
          .eq("status", "pending")
          .eq("payment_method", "peptidepay")
          .is("payment_reminder_sent_at", null)
          .not("payment_link", "is", null)
          .lte("created_at", minAgeIso)
          .gte("created_at", maxAgeIso)
          .limit(50);

        if (error) {
          console.error("[payment-reminder] db read failed", error);
          return new Response("DB error", { status: 500 });
        }
        if (!orders || orders.length === 0) {
          return Response.json({ ok: true, reminded: 0 });
        }

        const peptideKey = process.env.PEPTIDEPAY_API_KEY;
        let reminded = 0;

        for (const o of orders) {
          // Extraction session id à partir du payment_link
          // Format : https://pay.qistdigital.com/session/cs_XXXX
          const m = /\/session\/([A-Za-z0-9_-]+)/.exec(o.payment_link ?? "");
          const sessionId = m?.[1];

          // Vérif que la session est toujours pending côté PeptidePay
          if (sessionId && peptideKey) {
            try {
              const res = await fetch(
                `https://pay.qistdigital.com/api/v1/sessions/${sessionId}`,
                { headers: { Authorization: `Bearer ${peptideKey}` } },
              );
              if (res.ok) {
                const s = await res.json();
                if (s?.status && s.status !== "pending") {
                  // Déjà payé/expiré/annulé — on marque pour ne pas retenter
                  await supabaseAdmin
                    .from("orders")
                    .update({ payment_reminder_sent_at: new Date().toISOString() })
                    .eq("id", o.id);
                  continue;
                }
              }
            } catch (e) {
              console.error("[payment-reminder] peptidepay check failed", o.id, e);
              continue;
            }
          }

          try {
            await enqueueAppEmail({
              templateName: "payment-reminder",
              recipientEmail: o.email,
              idempotencyKey: `payment-reminder-${o.id}`,
              templateData: {
                customerName: o.first_name ?? undefined,
                orderNumber: o.order_number,
                totalEur: Number(o.total_eur),
                paymentLink: o.payment_link,
              },
            });
            await supabaseAdmin
              .from("orders")
              .update({ payment_reminder_sent_at: new Date().toISOString() })
              .eq("id", o.id);
            reminded++;
          } catch (e) {
            console.error("[payment-reminder] enqueue failed", o.id, e);
          }
        }

        return Response.json({ ok: true, scanned: orders.length, reminded });
      },
    },
  },
});
