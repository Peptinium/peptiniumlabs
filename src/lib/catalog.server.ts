import { createServerFn } from "@tanstack/react-start";
import type { Product, Reference, Variant } from "@/data/products";

const MEDUSA_URL = process.env.MEDUSA_URL || "http://127.0.0.1:9000";
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || "";
const REGION = process.env.MEDUSA_REGION_ID || "";

// Cache court en mémoire pour ne pas taper Medusa à chaque requête SSR.
let _cache: { at: number; data: Product[] } | null = null;
const TTL_MS = 60_000;

function mapVariant(v: any): Variant & { _pos: number } {
  const m = v.metadata || {};
  const price = Number(
    m.list_price ?? v.calculated_price?.calculated_amount ?? 0,
  );
  const out: any = { dosage: v.title, price, _pos: Number(m.pos ?? 0) };
  if (m.promo_price != null) out.promoPrice = Number(m.promo_price);
  if (m.bulk_tiers) out.bulkTiers = m.bulk_tiers;
  if (m.sold_out) out.soldOut = true;
  else if (
    typeof v.inventory_quantity === "number" &&
    v.inventory_quantity <= 0
  )
    out.soldOut = true;
  if (m.low_stock) out.lowStock = true;
  return out;
}

function mapProduct(p: any): Product & { _sort: number } {
  const m = p.metadata || {};
  const variants = (p.variants || [])
    .map(mapVariant)
    .sort((a: any, b: any) => a._pos - b._pos)
    .map(({ _pos, ...v }: any) => v as Variant);
  return {
    slug: p.handle,
    name: p.title,
    cas: m.cas || undefined,
    molecularFormula: m.molecular_formula || undefined,
    molecularWeight: m.molecular_weight || undefined,
    purity: m.purity || "",
    variants,
    category: m.category,
    featured: !!m.featured,
    hidden: !!m.hidden,
    shortDescription: m.short_description || "",
    researchSummary: m.research_summary || "",
    detailedEffects: m.detailed_effects || "",
    storage: m.storage || "",
    reconstitution: m.reconstitution || "",
    references: (m.references || []) as Reference[],
    _sort: Number(m.sort ?? 0),
  } as any;
}

async function fetchCatalog(): Promise<Product[]> {
  if (!PK || !REGION) {
    throw new Error("MEDUSA_PUBLISHABLE_KEY / MEDUSA_REGION_ID manquants");
  }
  const fields =
    "handle,title,subtitle,status,metadata,*categories,*variants,*variants.calculated_price,+variants.inventory_quantity";
  const url =
    `${MEDUSA_URL}/store/products?limit=200&region_id=${REGION}` +
    `&fields=${encodeURIComponent(fields)}`;
  const r = await fetch(url, { headers: { "x-publishable-api-key": PK } });
  if (!r.ok) {
    throw new Error(`Medusa store ${r.status}: ${await r.text()}`);
  }
  const j = await r.json();
  const list = (j.products || [])
    .map(mapProduct)
    .sort((a: any, b: any) => a._sort - b._sort);
  return list.map(({ _sort, ...p }: any) => p as Product);
}

/** Catalogue complet (lu depuis Medusa), au même format que l'ancien statique. */
export async function loadCatalog(): Promise<Product[]> {
  const now = Date.now();
  if (_cache && now - _cache.at < TTL_MS) return _cache.data;
  const data = await fetchCatalog();
  _cache = { at: now, data };
  return data;
}

/** Server function appelable depuis les loaders / composants. */
export const getCatalog = createServerFn({ method: "GET" }).handler(
  async () => {
    return await loadCatalog();
  },
);

/** Un produit par slug (ou null). */
export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const all = await loadCatalog();
    return all.find((p) => p.slug === slug) ?? null;
  });
