/**
 * Server-only helpers for direct-to-wallet crypto payments.
 * No third-party payment platform — we use public blockchain APIs.
 */

export type CryptoCurrency = "BTC" | "USDC_POLYGON" | "USDT_POLYGON" | "LTC";

export const CRYPTO_META: Record<
  CryptoCurrency,
  { label: string; unit: string; decimals: number; network: string; coinbaseSymbol: string; coinpaprikaId: string; isStable: boolean }
> = {
  BTC: { label: "Bitcoin", unit: "BTC", decimals: 8, network: "Bitcoin", coinbaseSymbol: "BTC", coinpaprikaId: "btc-bitcoin", isStable: false },
  USDC_POLYGON: { label: "USDC (POL)", unit: "USDC", decimals: 6, network: "POL", coinbaseSymbol: "USDC", coinpaprikaId: "usdc-usd-coin", isStable: true },
  // `unit` affiche USDT0 : Tether a migré le contrat Polygon vers son standard
  // omnichain et c'est ce symbole que voit le client dans son wallet.
  USDT_POLYGON: { label: "USDT (POL)", unit: "USDT0", decimals: 6, network: "POL", coinbaseSymbol: "USDT", coinpaprikaId: "usdt-tether", isStable: true },
  LTC: { label: "Litecoin", unit: "LTC", decimals: 8, network: "Litecoin", coinbaseSymbol: "LTC", coinpaprikaId: "ltc-litecoin", isStable: false },
};

export function getWalletAddress(currency: CryptoCurrency): string {
  const map: Record<CryptoCurrency, string | undefined> = {
    BTC: process.env.WALLET_BTC,
    // Même compte Ledger que l'USDC : sur Polygon, une adresse reçoit tous les
    // tokens. La variable reste distincte pour pouvoir les séparer plus tard.
    USDC_POLYGON: process.env.WALLET_USDC_POLYGON,
    USDT_POLYGON:
      process.env.WALLET_USDT_POLYGON ?? process.env.WALLET_USDC_POLYGON,
    LTC: process.env.WALLET_LTC,
  };
  const addr = map[currency];
  if (!addr) throw new Error(`Wallet address not configured for ${currency}`);
  return addr.trim();
}

const RATE_TIMEOUT_MS = 6500;

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RATE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "PeptiniumLabs/1.0",
      },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchUsdToEurRate(): Promise<number> {
  const providers: Array<() => Promise<number>> = [
    async () => {
      const json = await fetchJson<{ rates?: { EUR?: number } }>("https://api.frankfurter.app/latest?from=USD&to=EUR");
      return Number(json.rates?.EUR);
    },
    async () => {
      const json = await fetchJson<{ rates?: { EUR?: number } }>("https://open.er-api.com/v6/latest/USD");
      return Number(json.rates?.EUR);
    },
  ];

  for (const provider of providers) {
    try {
      const rate = await provider();
      if (Number.isFinite(rate) && rate > 0) return rate;
    } catch (e) {
      console.error("[crypto-rate] USD/EUR provider failed", e);
    }
  }

  // Dernier recours si les deux fournisseurs de change sont indisponibles.
  // La constante précédente (0.92) datait : le taux réel tourne autour de 0,87,
  // donc elle faisait demander ~6 % de stablecoins en moins que nécessaire —
  // une sous-facturation silencieuse sur chaque commande.
  // Valeur volontairement prudente et journalisée bruyamment.
  console.error(
    "[crypto-rate] AUCUN fournisseur EUR/USD disponible — repli sur une constante, vérifier les prix",
  );
  return 0.86;
}

/** Fetch EUR price for 1 unit of the crypto with multiple public providers. */
export async function fetchEurRate(currency: CryptoCurrency): Promise<number> {
  const meta = CRYPTO_META[currency];

  if (meta.isStable) {
    return fetchUsdToEurRate();
  }

  const providers: Array<() => Promise<number>> = [
    async () => {
      const json = await fetchJson<{ data?: { rates?: { EUR?: string } } }>(
        `https://api.coinbase.com/v2/exchange-rates?currency=${meta.coinbaseSymbol}`,
      );
      return Number(json.data?.rates?.EUR);
    },
    async () => {
      const json = await fetchJson<{ quotes?: { EUR?: { price?: number } } }>(
        `https://api.coinpaprika.com/v1/tickers/${meta.coinpaprikaId}?quotes=EUR`,
      );
      return Number(json.quotes?.EUR?.price);
    },
    async () => {
      const usdToEur = await fetchUsdToEurRate();
      const json = await fetchJson<{ data?: { rates?: { USD?: string } } }>(
        `https://api.coinbase.com/v2/exchange-rates?currency=${meta.coinbaseSymbol}`,
      );
      return Number(json.data?.rates?.USD) * usdToEur;
    },
  ];

  for (const provider of providers) {
    try {
      const eur = await provider();
      if (Number.isFinite(eur) && eur > 0) return eur;
    } catch (e) {
      console.error(`[crypto-rate] ${currency} provider failed`, e);
    }
  }

  throw new Error(`Taux crypto indisponible pour ${currency}. Réessayez dans quelques minutes.`);
}

/**
 * Increment separating two concurrent invoices of the same currency.
 *
 * Attribution is by amount, so this spacing has to be comfortably wider than
 * {@link MATCH_EPSILON}. The previous scheme salted the 3rd-to-6th decimal of
 * USDC (~0.005 spacing) while the matcher accepted anything within 0.5% of the
 * total (~0.25 on a 50 USDC order) — the tolerance was 50x the spacing, so two
 * similar orders each fell inside the other's window and a payment could settle
 * the wrong one.
 */
const AMOUNT_STEP: Record<CryptoCurrency, number> = {
  BTC: 0.000001, // 100 sat, ~0,06 EUR
  USDC_POLYGON: 0.01, // 1 cent, visible et saisissable par le client
  USDT_POLYGON: 0.01,
  LTC: 0.00001,
};

/**
 * Matching tolerance, absolute and deliberately tiny — kept below half a step
 * so two invoices can never both match one transaction.
 *
 * A percentage tolerance is not needed: network fees are paid separately (in
 * POL for an ERC-20 transfer, by the sender for Bitcoin), so the exact amount
 * asked for is the amount that lands. It only absorbs float rounding.
 */
const MATCH_EPSILON: Record<CryptoCurrency, number> = {
  BTC: 0.0000004,
  USDC_POLYGON: 0.004,
  USDT_POLYGON: 0.004,
  LTC: 0.000004,
};

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Smallest unused amount that covers the order.
 *
 * The base conversion is rounded UP to the next step so the shop is never
 * undercharged, then walked up in steps until the amount is free. `taken` is
 * the set of amounts already reserved by open invoices in this currency —
 * allocation is explicit rather than hoping a hash does not collide, and the
 * unique index on the table is the final backstop.
 */
export function allocateUniqueAmount(
  amountEur: number,
  ratePerUnit: number,
  currency: CryptoCurrency,
  taken: number[] = [],
): number {
  const decimals = CRYPTO_META[currency].decimals;
  const step = AMOUNT_STEP[currency];
  const base = amountEur / ratePerUnit;

  let candidate = roundTo(Math.ceil(base / step) * step, decimals);
  const reserved = new Set(taken.map((t) => roundTo(Number(t), decimals)));

  let guard = 0;
  while (reserved.has(candidate) && guard < 1000) {
    candidate = roundTo(candidate + step, decimals);
    guard++;
  }
  if (guard >= 1000) {
    throw new Error("Impossible d'allouer un montant crypto unique.");
  }
  return candidate;
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
    case "USDT_POLYGON": {
      // EIP-681, transfert ERC-20 sur Polygon (chainId 137). La forme
      // précédente (`ethereum:<adresse>@137`) ne portait ni le token ni le
      // montant : le client devait choisir « USDC » et saisir le montant à la
      // main, ce qui produit des montants approximatifs — or l'attribution
      // repose justement sur le montant exact.
      //
      // Le contrat cité est l'USDC natif ; un paiement en USDC.e reste
      // détecté, seul le QR pointe vers le natif.
      const base = BigInt(
        Math.round(amount * Math.pow(10, CRYPTO_META[currency].decimals)),
      );
      const token = POLYGON_TOKEN_CONTRACTS[currency][0];
      return `ethereum:${token}@137/transfer?address=${address}&uint256=${base}`;
    }
  }
}

// -----------------------------------------------------------------------------
// Blockchain scanners — return matching transactions for a wallet address.
// Each returns { txHash, amount } tuples for RECENT INCOMING transfers.
// -----------------------------------------------------------------------------

export type IncomingTx = { txHash: string; amount: number; confirmations: number };

/**
 * There are TWO USDC contracts on Polygon and customers use both. Watching
 * only the native one silently misses most payments: verified on-chain, the
 * bridged contract carries ~1.03B supply against ~626M for the native one.
 */
const POLYGON_TOKEN_CONTRACTS: Record<
  "USDC_POLYGON" | "USDT_POLYGON",
  readonly string[]
> = {
  USDC_POLYGON: [
    "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // natif
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // bridgé (USDC.e)
  ],
  USDT_POLYGON: [
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT0 (ex-USDT Polygon)
  ],
};

/**
 * Free public Polygon RPCs. The historic polygon-rpc.com now answers 401, and
 * each of these caps `eth_getLogs` at 50 blocks, hence the chunked scan below.
 */
const POLYGON_RPCS = [
  "https://polygon-bor-rpc.publicnode.com",
  "https://polygon.drpc.org",
  "https://1rpc.io/matic",
];

/** Hard cap imposed by the free RPCs on a single eth_getLogs range. */
const POLYGON_LOG_CHUNK = 50n;

/** Polygon produces ~2 s blocks, so this covers ~20 min — one invoice TTL. */
const POLYGON_LOOKBACK_BLOCKS = 600n;

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

/**
 * Etherscan v2 (unified, chainid=137). Full history in one call, but needs a
 * free key. `api.polygonscan.com` without a key now answers 301 — that older
 * path silently returned zero transactions, so no USDC payment was ever seen.
 */
async function scanPolygonViaEtherscan(
  address: string,
  apiKey: string,
  contracts: readonly string[],
): Promise<IncomingTx[]> {
  const out: IncomingTx[] = [];
  for (const contract of contracts) {
    const url =
      `https://api.etherscan.io/v2/api?chainid=137&module=account&action=tokentx` +
      `&contractaddress=${contract}&address=${address}` +
      `&page=1&offset=50&sort=desc&apikey=${apiKey}`;
    const json = await fetchJson<{
      status?: string;
      result?: Array<{
        hash: string;
        to: string;
        value: string;
        confirmations: string;
        tokenDecimal: string;
      }>;
    }>(url);
    if (json.status !== "1" || !Array.isArray(json.result)) continue;
    for (const tx of json.result) {
      if (tx.to?.toLowerCase() !== address.toLowerCase()) continue;
      const decimals = Number(tx.tokenDecimal) || 6;
      out.push({
        txHash: tx.hash,
        amount: Number(tx.value) / Math.pow(10, decimals),
        confirmations: Number(tx.confirmations) || 0,
      });
    }
  }
  return out;
}

/**
 * Fallback with no account required: read ERC-20 Transfer logs straight from
 * public RPCs. Each caps a range at 50 blocks, so the lookback window is
 * walked in chunks and the first responsive RPC wins.
 */
async function scanPolygonViaRpc(
  address: string,
  contracts: readonly string[],
): Promise<IncomingTx[]> {
  const { createPublicClient, http, parseAbiItem } = await import("viem");
  const { polygon } = await import("viem/chains");

  const transferEvent = parseAbiItem(
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  );

  let lastError: unknown;
  for (const url of POLYGON_RPCS) {
    try {
      const client = createPublicClient({
        chain: polygon,
        transport: http(url, { timeout: 10_000 }),
      });
      const tip = await client.getBlockNumber();
      const floor =
        tip > POLYGON_LOOKBACK_BLOCKS ? tip - POLYGON_LOOKBACK_BLOCKS : 0n;

      const ranges: Array<{ from: bigint; to: bigint }> = [];
      for (let to = tip; to > floor; to -= POLYGON_LOG_CHUNK + 1n) {
        const from = to - POLYGON_LOG_CHUNK > floor ? to - POLYGON_LOG_CHUNK : floor;
        ranges.push({ from, to });
      }

      const out: IncomingTx[] = [];
      for (const contract of contracts) {
        const batches = await Promise.all(
          ranges.map((r) =>
            client.getLogs({
              address: contract as `0x${string}`,
              event: transferEvent,
              args: { to: address as `0x${string}` },
              fromBlock: r.from,
              toBlock: r.to,
            }),
          ),
        );
        for (const logs of batches) {
          for (const log of logs) {
            const value = log.args.value;
            if (value === undefined) continue;
            out.push({
              txHash: log.transactionHash,
              amount: Number(value) / 1e6,
              confirmations: Number(tip - log.blockNumber) + 1,
            });
          }
        }
      }
      return out;
    } catch (e) {
      lastError = e;
    }
  }
  console.error("[crypto-watcher] tous les RPC Polygon ont échoué", lastError);
  return [];
}

async function scanPolygonToken(
  address: string,
  currency: "USDC_POLYGON" | "USDT_POLYGON",
): Promise<IncomingTx[]> {
  const contracts = POLYGON_TOKEN_CONTRACTS[currency];
  const apiKey = process.env.ETHERSCAN_API_KEY?.trim();
  if (apiKey) {
    try {
      return await scanPolygonViaEtherscan(address, apiKey, contracts);
    } catch (e) {
      console.error("[crypto-watcher] Etherscan a échoué, bascule RPC", e);
    }
  }
  return scanPolygonViaRpc(address, contracts);
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
      case "USDT_POLYGON":
        return await scanPolygonToken(address, currency);
    }
  } catch (e) {
    console.error(`[crypto-watcher] scan ${currency} failed`, e);
    return [];
  }
}

/**
 * Match a pending invoice against scanned transactions.
 *
 * `usedHashes` must carry every tx already bound to another invoice: without
 * it a single incoming payment could settle several orders at once, since
 * nothing else ties a transaction to one invoice.
 *
 * Among the candidates that cover the expected amount, the CLOSEST one wins —
 * not the most confirmed. Otherwise a large overpayment meant for one invoice
 * would be captured by a smaller invoice it also happens to cover.
 */
export function matchTransaction(
  expected: number,
  currency: CryptoCurrency,
  txs: IncomingTx[],
  usedHashes: Set<string> = new Set(),
): IncomingTx | null {
  const epsilon = MATCH_EPSILON[currency];
  const minAmount = expected - epsilon;
  // Borne SUPÉRIEURE indispensable : sans elle, un virement de 100 USDC
  // satisfait une facture de 11 USDC (100 >= 11) et se fait créditer à la
  // mauvaise commande dès que celle-ci est la plus ancienne. On n'accepte donc
  // que le quasi-exact ; tout écart plus large part en revue manuelle.
  const maxAmount = expected + AMOUNT_STEP[currency];

  const candidates = txs.filter(
    (tx) =>
      !usedHashes.has(tx.txHash) &&
      tx.amount >= minAmount &&
      tx.amount <= maxAmount,
  );
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const da = Math.abs(a.amount - expected);
    const db = Math.abs(b.amount - expected);
    if (da !== db) return da - db;
    return b.confirmations - a.confirmations;
  });
  return candidates[0];
}

/**
 * True when a transaction covers the invoice but overshoots it by more than one
 * allocation step — worth flagging to an admin rather than silently keeping the
 * difference.
 */
export function isOverpayment(
  expected: number,
  currency: CryptoCurrency,
  received: number,
): boolean {
  return received - expected > AMOUNT_STEP[currency];
}

/** Minimum confirmations required to mark a payment as confirmed. */
export function requiredConfirmations(currency: CryptoCurrency): number {
  switch (currency) {
    case "BTC":
      return 1;
    case "LTC":
      return 1;
    case "USDC_POLYGON":
    case "USDT_POLYGON":
      return 3; // ~15s on Polygon
  }
}
