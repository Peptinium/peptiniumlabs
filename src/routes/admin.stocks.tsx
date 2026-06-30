import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check, Minus, PackageCheck, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/stocks")({
  component: StocksPage,
});

type VariantRow = {
  id: string;
  product_id: string;
  dosage: string;
  price_eur: number;
  stock: number;
  low_stock_threshold: number;
  sold_out: boolean;
  position: number;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  stock: number;
  low_stock_threshold: number;
  product_variants: VariantRow[];
};

function StocksPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products-with-variants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, stock, low_stock_threshold, product_variants(id, product_id, dosage, price_eur, stock, low_stock_threshold, sold_out, position)")
        .order("name");
      if (error) throw error;
      return (data ?? []) as unknown as ProductRow[];
    },
  });

  const updateVariant = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<VariantRow> }) => {
      const { error } = await supabase.from("product_variants").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products-with-variants"] });
      setEditingId(null);
    },
    onError: (e: Error) => toast.error(e.message ?? "Erreur de mise à jour"),
  });

  const products = data ?? [];
  const allVariants = products.flatMap((p) => p.product_variants);
  const alerts = allVariants.filter((v) => !v.sold_out && v.stock <= v.low_stock_threshold).length;
  const ruptures = allVariants.filter((v) => v.sold_out || v.stock === 0).length;

  const stats = [
    { label: "Variantes", value: allVariants.length, icon: PackageCheck, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Alertes", value: alerts, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Ruptures", value: ruptures, icon: X, color: "text-rose-400", bg: "bg-rose-400/10" },
  ];

  const statusOf = (v: VariantRow) => {
    if (v.sold_out) return "Rupture";
    if (v.stock === 0) return "Rupture";
    if (v.stock <= Math.max(1, Math.floor(v.low_stock_threshold / 2))) return "Critique";
    if (v.stock <= v.low_stock_threshold) return "Alerte";
    return "OK";
  };

  const styleOf = (s: string) => {
    if (s === "OK") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
    if (s === "Alerte") return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    if (s === "Critique") return "bg-orange-400/10 text-orange-400 border-orange-400/20";
    return "bg-rose-400/10 text-rose-400 border-rose-400/20";
  };

  const startEdit = (id: string, current: number) => {
    setEditingId(id);
    setDraftValue(String(current));
  };

  const quickAdjust = (v: VariantRow, delta: number) => {
    const next = Math.max(0, v.stock + delta);
    updateVariant.mutate({ id: v.id, patch: { stock: next } });
  };

  const commitEdit = (id: string) => {
    const parsed = parseInt(draftValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      toast.error("Quantité invalide");
      return;
    }
    updateVariant.mutate({ id, patch: { stock: parsed } });
  };

  const toggleSoldOut = (v: VariantRow) => {
    updateVariant.mutate({ id: v.id, patch: { sold_out: !v.sold_out } });
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Stocks par dosage</h2>
        <p className="text-sm text-muted-foreground">Inventaire et alertes par variante</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-3">
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`size-4 ${stat.color}`} />
              </div>
              <div className="mt-2 text-xl font-bold">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">Chargement…</div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
          Aucun produit en base.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const variants = [...product.product_variants].sort((a, b) => a.position - b.position);
            return (
              <div key={product.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-3 py-2">
                  <div className="text-sm font-semibold">{product.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {product.slug} · total {product.stock}
                  </div>
                </div>
                {variants.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">Aucune variante</div>
                ) : (
                  <div className="divide-y divide-border">
                    {variants.map((v) => {
                      const statut = statusOf(v);
                      const isEditing = editingId === v.id;
                      const isPending = updateVariant.isPending && updateVariant.variables?.id === v.id;
                      return (
                        <div key={v.id} className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="text-sm font-medium">{v.dosage}</div>
                              <div className="text-[11px] text-muted-foreground">{v.price_eur.toFixed(2)} €</div>
                            </div>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${styleOf(statut)}`}>
                              {statut}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">Stock</span>
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  inputMode="numeric"
                                  value={draftValue}
                                  onChange={(e) => setDraftValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") commitEdit(v.id);
                                    if (e.key === "Escape") setEditingId(null);
                                  }}
                                  className="h-8 w-20 rounded-md border border-border bg-background px-2 text-sm"
                                  autoFocus
                                />
                                <button
                                  onClick={() => commitEdit(v.id)}
                                  disabled={isPending}
                                  className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
                                  aria-label="Valider"
                                >
                                  <Check className="size-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="flex size-8 items-center justify-center rounded-md border border-border"
                                  aria-label="Annuler"
                                >
                                  <X className="size-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => quickAdjust(v, -1)}
                                  disabled={isPending || v.stock === 0}
                                  className="flex size-8 items-center justify-center rounded-md border border-border disabled:opacity-40"
                                  aria-label="Retirer"
                                >
                                  <Minus className="size-4" />
                                </button>
                                <button
                                  onClick={() => startEdit(v.id, v.stock)}
                                  className="flex h-8 min-w-12 items-center justify-center rounded-md border border-border px-2 text-sm font-semibold"
                                >
                                  {v.stock}
                                  <Pencil className="ml-1 size-3 text-muted-foreground" />
                                </button>
                                <button
                                  onClick={() => quickAdjust(v, 1)}
                                  disabled={isPending}
                                  className="flex size-8 items-center justify-center rounded-md border border-border"
                                  aria-label="Ajouter"
                                >
                                  <Plus className="size-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleSoldOut(v)}
                            disabled={isPending}
                            className={`mt-2 w-full rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                              v.sold_out
                                ? "border-rose-400/30 bg-rose-400/10 text-rose-400"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {v.sold_out ? "Marquée en rupture" : "Disponible"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
