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

        // 2. Fetch active payments (pending or detected but not yet confirmed).
        const { data: active } = await supabaseAdmin
          .from("crypto_payments")
          .select("id, order_id, currency, wallet_address, amount_crypto, status, tx_hash")
          .in("status", ["pending", "detected"])
          .gte("expires_at", nowIso);

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

        let updated = 0;
        for (const [key, payments] of buckets) {
          const [currency, address] = key.split("|") as [
            import("@/lib/crypto-payments.server").CryptoCurrency,
            string,
          ];
          const txs = await mod.scanIncomingTransactions(currency, address);
          if (txs.length === 0) continue;

          const minConfirmations = mod.requiredConfirmations(currency);
          for (const payment of payments) {
            const match = mod.matchTransaction(Number(payment.amount_crypto), currency, txs);
            if (!match) continue;

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
            }

            updated++;
          }
        }

        return Response.json({ ok: true, scanned: buckets.size, updated });
      },
    },
  },
});
