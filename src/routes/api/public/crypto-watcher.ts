import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron endpoint that scans the blockchain for pending crypto payments
 * and updates their status. Called every ~60s by pg_cron.
 *
 * Auth: the pg_cron job passes the Supabase publishable key in the `apikey`
 * header. We accept it as a lightweight caller check; blockchain reads are
 * public anyway and no PII is exposed.
 */
export const Route = createFileRoute("/api/public/crypto-watcher")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey") ?? request.headers.get("x-cron-key");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (expected && apiKey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const mod = await import("@/lib/crypto-payments.server");

        // 1. Expire stale pending payments.
        const nowIso = new Date().toISOString();
        await supabaseAdmin
          .from("crypto_payments")
          .update({ status: "expired" })
          .eq("status", "pending")
          .lt("expires_at", nowIso);

        // 2. Fetch active payments. Once a tx is DETECTED we keep scanning it
        //    until it's fully confirmed, even past expires_at — otherwise a slow
        //    Bitcoin block would leave the customer paid without validation.
        const { data: active } = await supabaseAdmin
          .from("crypto_payments")
          .select("id, order_id, currency, wallet_address, amount_crypto, status, tx_hash, expires_at")
          .in("status", ["pending", "detected"])
          .or(`status.eq.detected,expires_at.gte.${nowIso}`);

        if (!active || active.length === 0) {
          return Response.json({ ok: true, scanned: 0, updated: 0 });
        }

        // 3. Group by (currency, address) so we scan each wallet at most once.
        const buckets = new Map<string, typeof active>();
        for (const p of active) {
          const k = `${p.currency}|${p.wallet_address}`;
          const bucket = buckets.get(k) ?? [];
          bucket.push(p);
          buckets.set(k, bucket);
        }

        // 3b. Toute transaction déjà rattachée à une facture est hors jeu.
        //     Sans ce garde-fou, un seul virement entrant peut satisfaire
        //     plusieurs commandes et les faire toutes passer en payées.
        const { data: bound } = await supabaseAdmin
          .from("crypto_payments")
          .select("tx_hash")
          .not("tx_hash", "is", null);
        const usedHashes = new Set(
          (bound ?? [])
            .map((r) => r.tx_hash as string | null)
            .filter((h): h is string => !!h),
        );

        let updated = 0;
        for (const [key, payments] of buckets) {
          const [currency, address] = key.split("|") as [
            import("@/lib/crypto-payments.server").CryptoCurrency,
            string,
          ];
          const txs = await mod.scanIncomingTransactions(currency, address);
          if (txs.length === 0) continue;

          const minConfirmations = mod.requiredConfirmations(currency);
          // Les factures les plus anciennes servies d'abord : un client qui a
          // payé avant ne doit pas se faire voler son virement par une commande
          // créée après lui.
          const ordered = [...payments].sort((a, b) =>
            String(a.expires_at).localeCompare(String(b.expires_at)),
          );
          for (const payment of ordered) {
            const match = mod.matchTransaction(
              Number(payment.amount_crypto),
              currency,
              txs,
              usedHashes,
            );
            if (!match) continue;
            // Réservé immédiatement, pour que la facture suivante de ce lot ne
            // puisse pas réclamer la même transaction.
            usedHashes.add(match.txHash);

            const isConfirmed = match.confirmations >= minConfirmations;
            const newStatus: "detected" | "confirmed" = isConfirmed ? "confirmed" : "detected";

            if (payment.status === newStatus && payment.tx_hash === match.txHash) continue;

            await supabaseAdmin
              .from("crypto_payments")
              .update({
                status: newStatus,
                tx_hash: match.txHash,
                detected_at: payment.status === "pending" ? nowIso : undefined,
                confirmed_at: isConfirmed ? nowIso : null,
              })
              .eq("id", payment.id);

            if (isConfirmed) {
              await supabaseAdmin
                .from("orders")
                .update({ status: "paid", paid_at: nowIso })
                .eq("id", payment.order_id)
                .neq("status", "paid");

              try {
                const { notifyAdminsOrderPaid } = await import("@/lib/order-notify.server");
                await notifyAdminsOrderPaid(payment.order_id);
              } catch (e) {
                console.error("[crypto-watcher] notify failed", e);
              }
            }

            updated++;
          }

          // Filet de réconciliation : de l'argent est arrivé sur l'adresse mais
          // n'a pu être rattaché à aucune facture (montant approximatif, client
          // hors tunnel, facture expirée). Silencieux, ce cas ressemble à « rien
          // n'est arrivé » — il doit rester visible dans les logs.
          const unattributed = txs.filter((tx) => !usedHashes.has(tx.txHash));
          for (const tx of unattributed) {
            console.warn(
              "[crypto-watcher] paiement non attribué",
              currency,
              address,
              tx.txHash,
              `montant ${tx.amount}`,
            );
          }
        }

        return Response.json({ ok: true, scanned: buckets.size, updated });
      },
    },
  },
});
