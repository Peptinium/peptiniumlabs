import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  dosage: string;
  price: number;
  qty: number;
};

export const EAU_SLUG = "eau-bacteriostatique";
export const EAU_PRICE = 9.90;
export const EAU_DOSAGE = "10 mL";
export const EAU_OFFERTE_SLUG = "eau-bacteriostatique-3ml-offerte";
export const EAU_OFFERTE_NAME = "Eau bactériostatique 3 mL offerte";
export const EAU_OFFERTE_DOSAGE = "3 mL";
export const EAU_OFFERTE_PRICE = 0;
export const SHIPPING = 3.90;
export const FREE_SHIPPING_THRESHOLD = 160;

const RETATRUTIDE_ELIGIBLE_DOSAGES = ["10 mg", "20 mg", "30 mg"];

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  peptideCount: number; // total qty of non-water items
  eauQty: number;
  setEau: (qty: number) => void;
  subtotal: number;
};

export const itemKey = (slug: string, dosage: string) => `${slug}::${dosage}`;

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "peptinium_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const clean: CartItem[] = parsed
            .filter(
              (i: any) =>
                i &&
                typeof i.slug === "string" &&
                typeof i.dosage === "string" &&
                Number.isFinite(Number(i.price)) &&
                Number.isFinite(Number(i.qty)) &&
                Number(i.qty) > 0,
            )
            .map((i: any) => ({
              slug: String(i.slug),
              name: String(i.name ?? i.slug),
              dosage: String(i.dosage),
              price: Number(i.price),
              qty: Number(i.qty),
            }));
          setItems(clean);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const peptideCount = items
    .filter((i) => i.slug !== EAU_SLUG && i.slug !== EAU_OFFERTE_SLUG)
    .reduce((s, i) => s + i.qty, 0);

  const eauItem = items.find((i) => i.slug === EAU_SLUG);

  // Note: eau bactériostatique can be purchased standalone, so we don't auto-clamp here.

  const ctx: CartCtx = useMemo(() => {
    const add: CartCtx["add"] = (item, qty = 1) => {
      setItems((prev) => {
        const k = itemKey(item.slug, item.dosage);
        const existing = prev.find((p) => itemKey(p.slug, p.dosage) === k);
        const next = existing
          ? prev.map((p) =>
              itemKey(p.slug, p.dosage) === k ? { ...p, qty: p.qty + qty } : p,
            )
          : [...prev, { ...item, qty }];

        // Offre : 1 eau bactériostatique 3 mL offerte à la première commande
        // de Retatrutide 10/20/30 mg dans ce panier.
        const isEligibleRetatrutide =
          item.slug === "retatrutide" && RETATRUTIDE_ELIGIBLE_DOSAGES.includes(item.dosage);
        const alreadyHasFreeWater = next.some(
          (p) => p.slug === EAU_OFFERTE_SLUG && p.dosage === EAU_OFFERTE_DOSAGE,
        );
        if (isEligibleRetatrutide && !alreadyHasFreeWater) {
          return [
            ...next,
            {
              slug: EAU_OFFERTE_SLUG,
              name: EAU_OFFERTE_NAME,
              dosage: EAU_OFFERTE_DOSAGE,
              price: EAU_OFFERTE_PRICE,
              qty: 1,
            },
          ];
        }
        return next;
      });
    };
    const setQty: CartCtx["setQty"] = (key, qty) => {
      setItems((prev) =>
        prev
          .map((p) => (itemKey(p.slug, p.dosage) === key ? { ...p, qty: Math.max(0, qty) } : p))
          .filter((p) => p.qty > 0),
      );
    };
    const remove: CartCtx["remove"] = (key) => {
      setItems((prev) => prev.filter((p) => itemKey(p.slug, p.dosage) !== key));
    };
    const clear = () => setItems([]);
    const setEau = (qty: number) => {
      const clamped = Math.max(0, qty);
      setItems((prev) => {
        const without = prev.filter((p) => p.slug !== EAU_SLUG);
        if (clamped <= 0) return without;
        return [
          ...without,
          {
            slug: EAU_SLUG,
            name: "Eau bactériostatique",
            dosage: EAU_DOSAGE,
            price: EAU_PRICE,
            qty: clamped,
          },
        ];
      });
    };
    return {
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((s, i) => s + i.qty, 0),
      peptideCount,
      eauQty: eauItem?.qty ?? 0,
      setEau,
      subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
    };
  }, [items, peptideCount, eauItem]);

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
