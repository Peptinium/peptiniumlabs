/**
 * Server-only helpers for direct-to-wallet crypto payments.
 * No third-party payment platform — we use public blockchain APIs.
 */

export type CryptoCurrency = "BTC" | "USDC_POLYGON" | "LTC";

export const CRYPTO_META: Record<
  CryptoCurrency,
  { label: string; unit: string; decimals: number; network: string; coingeckoId: string; isStable: boolean }
> = {
  BTC: { label: "Bitcoin", unit: "BTC", decimals: 8, network: "Bitcoin", coingeckoId: "bitcoin", isStable: false },
  USDC_POLYGON: { label: "USDC (Polygon)", unit: "USDC", decimals: 6, network: "Polygon (MATIC)", coingeckoId: "usd-coin", isStable: true },
  LTC: { label: "Litecoin", unit: "LTC", decimals: 8, network: "Litecoin", coingeckoId: "litecoin", isStable: false },
};

export function getWalletAddress(currency: CryptoCurrency): string {
  const map: Record<CryptoCurrency, string | undefined> = {
    BTC: process.env.WALLET_BTC,
    USDC_POLYGON: process.env.WALLET_USDC_POLYGON,
    LTC: process.env.WALLET_LTC,
  };
  const addr = map[currency];
  if (!addr) throw new Error(`Wallet address not configured for ${currency}`);
  return addr.trim();
}

/** Fetch EUR price for 1 unit of the crypto via CoinGecko (no API key). */
export async function fetchEurRate(currency: CryptoCurrency): Promise<number> {
  const id = CRYPTO_META[currency].coingeckoId;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=eur`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`CoinGecko error ${res.status}`);
  const json = (await res.json()) as Record<string, { eur?: number }>;
  const eur = json?.[id]?.eur;
  if (!eur || eur <= 0) throw new Error(`CoinGecko returned no EUR rate for ${currency}`);
  return eur;
}

/**
 * Compute a unique crypto amount for an order.
 * We start from the raw conversion and add a small deterministic "salt" in the
 * last few decimals so two concurrent payments never collide on the same amount.
 * The salt is derived from the order id → stable across retries.
 */
export function computeUniqueAmount(
  amountEur: number,
  ratePerUnit: number,
  currency: CryptoCurrency,
  orderId: string,
): number {
  const meta = CRYPTO_META[currency];
  const base = amountEur / ratePerUnit;
  // Salt: 4 last digits derived from order id, applied at the decimals - 4 position.
  let hash = 0;
  for (let i = 0; i < orderId.length; i++) hash = (hash * 31 + orderId.charCodeAt(i)) >>> 0;
  const saltDigits = hash % 9000; // 0..8999
  const saltUnit = 1000 + saltDigits; // 1000..9999
  const saltPlace = meta.decimals - 4; // e.g. BTC: 4, USDC: 2
  const saltValue = saltUnit / Math.pow(10, meta.decimals);
  const total = base + saltValue;
  // Round to full precision
  const factor = Math.pow(10, meta.decimals);
  return Math.round(total * factor) / factor;
}

export function formatCryptoAmount(amount: number, currency: CryptoCurrency): string {
  return amount.toFixed(CRYPTO_META[currency].decimals);
}

/** Payment URI (BIP-21 style) for QR codes. */
export function buildPaymentUri(currency: CryptoCurrency, address: string, amount: number): string {
  const amt = formatCryptoAmount(amount, currency);
  switch (currency) {
    case "BTC":
      return `bitcoin:${address}?amount=${amt}`;
    case "LTC":
      return `litecoin:${address}?amount=${amt}`;
    case "USDC_POLYGON":
      // EIP-681 for ERC-20 transfer on Polygon (chain id 137).
      // Most wallets prefill the address; user picks token/amount inside.
      return `ethereum:${address}@137`;
  }
}

// -----------------------------------------------------------------------------
// Blockchain scanners — return matching transactions for a wallet address.
// Each returns { txHash, amount } tuples for RECENT INCOMING transfers.
// -----------------------------------------------------------------------------

export type IncomingTx = { txHash: string; amount: number; confirmations: number };

const USDC_POLYGON_CONTRACT = "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"; // native USDC on Polygon

async function scanBtc(address: string): Promise<IncomingTx[]> {
  // mempool.space is free, no key, and includes mempool + confirmed txs.
  const url = `https://mempool.space/api/address/${address}/txs`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) return [];
  const txs = (await res.json()) as Array<{
    txid: string;
    status: { confirmed: boolean; block_height?: number };
    vout: Array<{ scriptpubkey_address?: string; value: number }>;
  }>;
  const tipRes = await fetch("https://mempool.space/api/blocks/tip/height");
  const tip = tipRes.ok ? Number(await tipRes.text()) : 0;
  const out: IncomingTx[] = [];
  for (const tx of txs) {
    const received = tx.vout
      .filter((v) => v.scriptpubkey_address === address)
      .reduce((s, v) => s + v.value, 0);
    if (received <= 0) continue;
    const confirmations = tx.status.confirmed && tx.status.block_height ? tip - tx.status.block_height + 1 : 0;
    out.push({ txHash: tx.txid, amount: received / 1e8, confirmations });
  }
  return out;
}

async function scanLtc(address: string): Promise<IncomingTx[]> {
  // BlockCypher public endpoint (rate-limited but free, no key).
  const url = `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/full?limit=25`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    txs?: Array<{
      hash: string;
      confirmations: number;
      outputs: Array<{ addresses?: string[]; value: number }>;
    }>;
  };
  const out: IncomingTx[] = [];
  for (const tx of json.txs ?? []) {
    const received = tx.outputs
      .filter((o) => o.addresses?.includes(address))
      .reduce((s, o) => s + o.value, 0);
    if (received <= 0) continue;
    out.push({ txHash: tx.hash, amount: received / 1e8, confirmations: tx.confirmations ?? 0 });
  }
  return out;
}

async function scanUsdcPolygon(address: string): Promise<IncomingTx[]> {
  // PolygonScan-compatible public API (no key needed for low volume).
  const url =
    `https://api.polygonscan.com/api?module=account&action=tokentx` +
    `&contractaddress=${USDC_POLYGON_CONTRACT}&address=${address}` +
    `&page=1&offset=25&sort=desc`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    status: string;
    result?: Array<{ hash: string; to: string; value: string; confirmations: string; tokenDecimal: string }>;
  };
  if (json.status !== "1" || !json.result) return [];
  const out: IncomingTx[] = [];
  for (const tx of json.result) {
    if (tx.to.toLowerCase() !== address.toLowerCase()) continue;
    const decimals = Number(tx.tokenDecimal) || 6;
    const amount = Number(tx.value) / Math.pow(10, decimals);
    out.push({ txHash: tx.hash, amount, confirmations: Number(tx.confirmations) || 0 });
  }
  return out;
}

export async function scanIncomingTransactions(
  currency: CryptoCurrency,
  address: string,
): Promise<IncomingTx[]> {
  try {
    switch (currency) {
      case "BTC":
        return await scanBtc(address);
      case "LTC":
        return await scanLtc(address);
      case "USDC_POLYGON":
        return await scanUsdcPolygon(address);
    }
  } catch (e) {
    console.error(`[crypto-watcher] scan ${currency} failed`, e);
    return [];
  }
}

/**
 * Match a pending payment against scanned txs.
 * Tolerance: 0.5% under the expected amount (fee coverage / rounding).
 */
export function matchTransaction(
  expected: number,
  currency: CryptoCurrency,
  txs: IncomingTx[],
): IncomingTx | null {
  const minAmount = expected * 0.995;
  // Prefer highest-confirmation match first.
  const sorted = [...txs].sort((a, b) => b.confirmations - a.confirmations);
  for (const tx of sorted) {
    if (tx.amount + 1e-12 >= minAmount) return tx;
  }
  return null;
}

/** Minimum confirmations required to mark a payment as confirmed. */
export function requiredConfirmations(currency: CryptoCurrency): number {
  switch (currency) {
    case "BTC":
      return 1;
    case "LTC":
      return 1;
    case "USDC_POLYGON":
      return 3; // ~15s on Polygon
  }
}
