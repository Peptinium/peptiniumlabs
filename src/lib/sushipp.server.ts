import { createHmac, timingSafeEqual } from "node:crypto";

// Fenêtre anti-rejeu des webhooks (secondes).
const REPLAY_WINDOW_SECONDS = 300;

export type CreateSessionInput = {
  amountCents: number;
  currency: "EUR" | "USD";
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  productName?: string;
  idempotencyKey?: string;
};

export type SushippSession = { id: string; url: string };

/**
 * Crée un lien de paiement hébergé via Sushipp (pay.sushipp.com).
 * Le prix N'est jamais fourni par le client : l'appelant le relit côté serveur
 * depuis orders.total_eur avant d'appeler ici.
 */
export async function createSushippSession(
  input: CreateSessionInput,
): Promise<SushippSession> {
  const base = process.env.SUSHIPP_API_URL?.replace(/\/+$/, "");
  const apiKey = process.env.SUSHIPP_API_KEY;
  if (!base || !apiKey) {
    throw new Error(
      "Sushipp non configuré : définis SUSHIPP_API_URL et SUSHIPP_API_KEY.",
    );
  }
  if (input.amountCents < 100) {
    throw new Error("Montant minimum 1 EUR.");
  }

  const ref = input.metadata?.order_number ?? input.metadata?.order_id ?? "";
  const res = await fetch(`${base}/api/site/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({
      amount: (input.amountCents / 100).toFixed(2),
      ref,
      // Libellé de la ligne Shopify. Sans ce champ, pay-shopify retombe sur un
      // nom de produit au hasard : on impose la référence de commande.
      title: input.productName ?? `Commande ${ref}`,
      note: input.productName ?? `Commande ${ref}`,
      metadata: input.metadata ?? {},
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Sushipp /api/site/checkout ${res.status}: ${t.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    orderNumber?: string;
    url?: string;
    shortUrl?: string;
  };
  const url = data.shortUrl || data.url;
  if (!url || !data.orderNumber) {
    throw new Error("Sushipp : réponse invalide (url ou orderNumber manquant).");
  }
  return { id: data.orderNumber, url };
}

/**
 * Vérifie la signature d'un webhook Sushipp.
 * Format : en-tête x-sushipp-signature = "t=<unix>,v1=<hmac hex>",
 * HMAC-SHA256 de `${t}.${rawBody}` avec SUSHIPP_WEBHOOK_SECRET.
 */
export function verifySushippSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.SUSHIPP_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    }),
  );
  const t = parseInt(parts.t ?? "", 10);
  const v1 = parts.v1;
  if (!Number.isFinite(t) || !v1) return false;
  if (Math.abs(Date.now() / 1000 - t) > REPLAY_WINDOW_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}
