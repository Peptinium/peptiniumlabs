import { createHmac, timingSafeEqual } from "node:crypto";

const PEPTIDEPAY_BASE = "https://pay.qistdigital.com";

export type PeptidePaySession = {
  id: string;
  url: string;
  status: string;
  amount?: number;
  currency?: string;
  expires_at?: string;
};

export type CreateSessionInput = {
  amountCents: number;
  currency: "EUR" | "USD" | "GBP" | "CAD" | "CHF" | "AUD";
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  productName?: string;
  webhookUrl?: string;
  idempotencyKey?: string;
};

/**
 * Create a hosted checkout session on PeptidePay.
 * Uses Bearer auth when PEPTIDEPAY_API_KEY is set; otherwise falls back to
 * wallet-only mode using PEPTIDEPAY_WALLET.
 */
export async function createPeptidePaySession(
  input: CreateSessionInput,
): Promise<PeptidePaySession> {
  const apiKey = process.env.PEPTIDEPAY_API_KEY;
  const wallet = process.env.PEPTIDEPAY_WALLET;

  if (!apiKey && !wallet) {
    throw new Error(
      "PeptidePay non configuré : définis PEPTIDEPAY_API_KEY ou PEPTIDEPAY_WALLET.",
    );
  }
  if (apiKey && !apiKey.startsWith("sk_live_")) {
    throw new Error(
      "PEPTIDEPAY_API_KEY doit commencer par sk_live_ (la clé sk_test_ n'est utilisable que pour le simulateur de webhook).",
    );
  }
  if (input.amountCents < 100 || input.amountCents > 10_000_000) {
    throw new Error("amountCents doit être entre 100 et 10 000 000.");
  }

  const body: Record<string, unknown> = {
    amount_cents: input.amountCents,
    currency: input.currency,
  };
  // Header is the identity when API key is set; omit `wallet` in that case.
  if (!apiKey && wallet) body.wallet = wallet;
  if (input.metadata) body.metadata = input.metadata;
  if (input.successUrl) body.success_url = input.successUrl;
  if (input.cancelUrl) body.cancel_url = input.cancelUrl;
  if (input.customerEmail) body.customer_email = input.customerEmail;
  if (input.productName) body.product_name = input.productName;
  if (input.webhookUrl) body.webhook_url = input.webhookUrl;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (input.idempotencyKey) headers["Idempotency-Key"] = input.idempotencyKey;

  const res = await fetch(`${PEPTIDEPAY_BASE}/api/v1/checkout/init`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `PeptidePay /checkout/init a répondu ${res.status}: ${text.slice(0, 500)}`,
    );
  }
  let json: PeptidePaySession;
  try {
    json = JSON.parse(text) as PeptidePaySession;
  } catch {
    throw new Error(`Réponse PeptidePay invalide: ${text.slice(0, 200)}`);
  }
  if (!json.url || !json.id) {
    throw new Error("Réponse PeptidePay incomplète (id/url manquants).");
  }
  return json;
}

/**
 * Fetch the current status of a PeptidePay session (webhook fallback).
 */
export async function getPeptidePaySession(
  id: string,
): Promise<PeptidePaySession> {
  const apiKey = process.env.PEPTIDEPAY_API_KEY;
  const headers: Record<string, string> = {};
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  const res = await fetch(`${PEPTIDEPAY_BASE}/api/v1/sessions/${id}`, {
    headers,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `PeptidePay /sessions/${id} a répondu ${res.status}: ${text.slice(0, 500)}`,
    );
  }
  return JSON.parse(text) as PeptidePaySession;
}

/**
 * Verify a PeptidePay webhook signature.
 * Header format: `t=<unix_seconds>,v1=<hex HMAC-SHA256>`
 * MAC input: `${t}.${rawBody}` with PEPTIDEPAY_WEBHOOK_SECRET.
 * Rejects signatures older than 300s.
 */
export function verifyPeptidePaySignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
): boolean {
  const secret = process.env.PEPTIDEPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  if (!signatureHeader) return false;

  let t: string | null = null;
  let v1: string | null = null;
  for (const part of signatureHeader.split(",")) {
    const [k, v] = part.split("=");
    if (k === "t") t = v ?? null;
    else if (k === "v1") v1 = v ?? null;
  }
  if (!t || !v1) return false;

  const ts = Number.parseInt(t, 10);
  if (!Number.isFinite(ts)) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex");

  let a: Buffer;
  let b: Buffer;
  try {
    a = Buffer.from(v1, "hex");
    b = Buffer.from(expected, "hex");
  } catch {
    return false;
  }
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
