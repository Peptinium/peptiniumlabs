import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  dosage: string;
  price: number;
  qty: number;
};

export const EAU_SLUG = "eau-bacteriostatique";
export const EAU_PRICE = 5.99;
export const EAU_DOSAGE = "10 mL";
export const SHIPPING = 6.0;
export const FREE_SHIPPING_THRESHOLD = 150;

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
const STORAGE_KEY = "aetherion_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
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
    .filter((i) => i.slug !== EAU_SLUG)
    .reduce((s, i) => s + i.qty, 0);

  const eauItem = items.find((i) => i.slug === EAU_SLUG);

  // Clamp eau qty to peptideCount on changes
  useEffect(() => {
    if (!hydrated) return;
    if (eauItem && eauItem.qty > peptideCount) {
      if (peptideCount === 0) {
        setItems((prev) => prev.filter((i) => i.slug !== EAU_SLUG));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.slug === EAU_SLUG ? { ...i, qty: peptideCount } : i)),
        );
      }
    }
  }, [peptideCount, eauItem, hydrated]);

  const ctx: CartCtx = useMemo(() => {
    const add: CartCtx["add"] = (item, qty = 1) => {
      setItems((prev) => {
        const k = itemKey(item.slug, item.dosage);
        const existing = prev.find((p) => itemKey(p.slug, p.dosage) === k);
        if (existing) {
          return prev.map((p) =>
            itemKey(p.slug, p.dosage) === k ? { ...p, qty: p.qty + qty } : p,
          );
        }
        return [...prev, { ...item, qty }];
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
      const clamped = Math.min(Math.max(0, qty), peptideCount);
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
