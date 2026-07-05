import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const currencySchema = z.enum(["BTC", "USDC_POLYGON", "LTC"]);

const createSchema = z.object({
  orderId: z.string().uuid(),
  currency: currencySchema,
});

const getSchema = z.object({
  orderId: z.string().uuid(),
});

/**
 * Create (or refresh) a crypto payment intent for an order.
 * - Reads the order total from DB (client cannot tamper).
 * - Fetches live EUR→crypto rate from CoinGecko.
 * - Computes a unique amount so we can identify the tx on-chain.
 * - Locks the amount for 20 minutes.
 */
export const createCryptoPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const mod = await import("./crypto-payments.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total_eur, status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error || !order) throw new Error("Commande introuvable.");
    if (order.status === "paid") throw new Error("Commande déjà payée.");
    const amountEur = Number(order.total_eur);
    if (!amountEur || amountEur <= 0) throw new Error("Montant invalide.");

    // Reuse an existing non-expired pending row for the same currency.
    const nowIso = new Date().toISOString();
    const { data: existing } = await supabaseAdmin
      .from("crypto_payments")
      .select("*")
      .eq("order_id", order.id)
      .eq("currency", data.currency)
      .in("status", ["pending", "detected"])
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) {
      return serialize(existing, mod);
    }

    const address = mod.getWalletAddress(data.currency);
    const rate = await mod.fetchEurRate(data.currency);
    const amountCrypto = mod.computeUniqueAmount(amountEur, rate, data.currency, order.id);
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("crypto_payments")
      .insert({
        order_id: order.id,
        currency: data.currency,
        wallet_address: address,
        amount_eur: amountEur,
        rate_eur_per_unit: rate,
        amount_crypto: amountCrypto,
        status: "pending",
        expires_at: expiresAt,
      })
      .select("*")
      .single();
    if (insErr || !inserted) throw new Error("Impossible de créer le paiement crypto.");

    // Mark the order as awaiting crypto payment.
    await supabaseAdmin
      .from("orders")
      .update({ payment_method: "crypto", status: "pending" })
      .eq("id", order.id);

    return serialize(inserted, mod);
  });

function serialize(row: any, mod: typeof import("./crypto-payments.server")) {
  const amount = Number(row.amount_crypto);
  const currency = row.currency as import("./crypto-payments.server").CryptoCurrency;
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    currency,
    label: mod.CRYPTO_META[currency].label,
    unit: mod.CRYPTO_META[currency].unit,
    network: mod.CRYPTO_META[currency].network,
    walletAddress: row.wallet_address as string,
    amountEur: Number(row.amount_eur),
    amountCrypto: amount,
    amountCryptoFormatted: mod.formatCryptoAmount(amount, currency),
    rate: Number(row.rate_eur_per_unit),
    status: row.status as "pending" | "detected" | "confirmed" | "expired" | "failed",
    txHash: (row.tx_hash as string | null) ?? null,
    expiresAt: row.expires_at as string,
    paymentUri: mod.buildPaymentUri(currency, row.wallet_address, amount),
  };
}

/** Poll status of an existing crypto payment. */
export const getCryptoPaymentStatus = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => getSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const mod = await import("./crypto-payments.server");
    const { data: row } = await supabaseAdmin
      .from("crypto_payments")
      .select("*")
      .eq("order_id", data.orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!row) return null;
    return serialize(row, mod);
  });
