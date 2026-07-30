import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// LTC retire : plus propose dans le panier et aucune adresse WALLET_LTC
// configuree, donc le choisir levait une exception au lieu d'etre rejete ici.
const currencySchema = z.enum(["BTC", "USDC_POLYGON", "USDT_POLYGON"]);

// Les commandes vivent dans Medusa : leurs identifiants sont des ULID
// prefixes (`order_01KY...`), pas des UUID. Un z.string().uuid() rejetait
// toute commande reelle avant meme d'atteindre la logique de paiement.
const orderIdSchema = z.string().min(1).max(128);

const createSchema = z.object({
  orderId: orderIdSchema,
  currency: currencySchema,
});

const getSchema = z.object({
  orderId: orderIdSchema,
});

const INVOICE_TTL_MS = 20 * 60 * 1000;

/**
 * Create (or refresh) a crypto payment intent for an order.
 * - Reads the order total from MEDUSA (client cannot tamper).
 * - Fetches live EUR→crypto rate from redundant public rate providers.
 * - Allocates an amount unique among open invoices so the incoming
 *   transaction can be attributed to this order and no other.
 */
export const createCryptoPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const mod = await import("./crypto-payments.server");
    const { getSushippCheckoutData, getOrderPaidStatus } = await import("./medusa.server");

    // Montant faisant foi : celui enregistré dans Medusa à la création de la
    // commande (metadata.charge_total), jamais une valeur venue du client.
    const medusaOrder = await getSushippCheckoutData(data.orderId);
    if (!medusaOrder) throw new Error("Commande introuvable.");

    const amountEur = Number(medusaOrder.chargeTotal);
    if (!amountEur || amountEur <= 0) throw new Error("Montant invalide.");

    const paid = await getOrderPaidStatus(data.orderId);
    if (paid?.paid) throw new Error("Commande déjà payée.");

    // Réutiliser une facture ouverte et non expirée pour cette devise : le
    // montant doit rester stable si le client recharge la page.
    const nowIso = new Date().toISOString();
    const { data: existing } = await supabaseAdmin
      .from("crypto_payments")
      .select("*")
      .eq("order_id", data.orderId)
      .eq("currency", data.currency)
      .in("status", ["pending", "detected"])
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) return serialize(existing, mod);

    const address = mod.getWalletAddress(data.currency);
    const rate = await mod.fetchEurRate(data.currency);
    const expiresAt = new Date(Date.now() + INVOICE_TTL_MS).toISOString();

    // Attribution par montant : le montant doit être unique parmi les factures
    // ouvertes de cette devise. On lit les montants réservés, on en alloue un
    // libre, et l'index unique en base tranche les courses résiduelles — d'où
    // la boucle de reprise sur conflit (code Postgres 23505).
    let inserted: Record<string, unknown> | null = null;
    let lastErr: unknown = null;

    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      const { data: openRows } = await supabaseAdmin
        .from("crypto_payments")
        .select("amount_crypto")
        .eq("currency", data.currency)
        .in("status", ["pending", "detected"]);

      const amountCrypto = mod.allocateUniqueAmount(
        amountEur,
        rate,
        data.currency,
        (openRows ?? []).map((r) => Number(r.amount_crypto)),
      );

      const { data: row, error: insErr } = await supabaseAdmin
        .from("crypto_payments")
        .insert({
          order_id: data.orderId,
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

      if (!insErr && row) {
        inserted = row;
        break;
      }
      lastErr = insErr;
      if (insErr && (insErr as { code?: string }).code !== "23505") break;
    }

    if (!inserted) {
      console.error("[crypto-payment] insertion impossible", lastErr);
      throw new Error("Impossible de créer le paiement crypto.");
    }

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
