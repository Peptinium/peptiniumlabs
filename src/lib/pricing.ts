import type { Variant } from "@/data/products";

export type BulkTier = { minQty: number; discountPct: number; label?: string };

/**
 * Effective unit price for a given variant and quantity.
 * Priority:
 *   1. If quantity triggers a bulkTier → base * (1 - discount%). Ignores promoPrice.
 *   2. Else if variant has a promoPrice → promoPrice.
 *   3. Else → base price.
 *
 * Rationale: quantity discounts apply on the reference price, NOT on top of the daily promo.
 */
export function computeUnitPrice(
  variant: Variant,
  qty: number,
): { unit: number; base: number; tier?: BulkTier; promoApplied: boolean } {
  const base = variant.price;
  const tiers = (variant.bulkTiers ?? []) as BulkTier[];
  const applicable = tiers
    .filter((t) => qty >= t.minQty)
    .sort((a, b) => b.discountPct - a.discountPct)[0];
  if (applicable) {
    const unit = Math.round(base * (1 - applicable.discountPct / 100) * 100) / 100;
    return { unit, base, tier: applicable, promoApplied: false };
  }
  if (variant.promoPrice != null) {
    return { unit: variant.promoPrice, base, promoApplied: true };
  }
  return { unit: base, base, promoApplied: false };
}

/** Smallest possible unit price the customer can pay for a variant (best tier or promo). */
export function bestUnitPrice(variant: Variant): number {
  const tiers = (variant.bulkTiers ?? []) as BulkTier[];
  const best = tiers.reduce((min, t) => {
    const p = Math.round(variant.price * (1 - t.discountPct / 100) * 100) / 100;
    return p < min ? p : min;
  }, variant.promoPrice ?? variant.price);
  return best;
}
