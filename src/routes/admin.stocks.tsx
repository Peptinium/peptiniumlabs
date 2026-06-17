import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, PackageCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/stocks")({
  component: StocksPage,
});

function StocksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, stock, low_stock_threshold, active")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const products = data ?? [];
  const alerts = products.filter((p) => p.stock <= p.low_stock_threshold).length;

  const stats = [
    { label: "Références", value: products.length, icon: PackageCheck, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Alertes", value: alerts, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
  ];

  const statusOf = (stock: number, seuil: number) => {
    if (stock === 0) return "Rupture";
    if (stock <= Math.max(1, Math.floor(seuil / 2))) return "Critique";
    if (stock <= seuil) return "Alerte";
    return "OK";
  };

  const getStatutStyle = (s: string) => {
    if (s === "OK") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
    if (s === "Alerte") return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    return "bg-rose-400/10 text-rose-400 border-rose-400/20";
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Stocks</h2>
        <p className="text-sm text-muted-foreground">Inventaire et alertes</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
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

      <div>
        <h3 className="mb-3 text-sm font-semibold">Inventaire</h3>
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">Chargement…</div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun produit en base.
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((item) => {
              const statut = statusOf(item.stock, item.low_stock_threshold);
              return (
                <div key={item.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.slug}</div>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatutStyle(statut)}`}>
                      {statut}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Stock actuel</span>
                      <span className="font-medium text-foreground">{item.stock} unités</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          statut === "Critique" || statut === "Rupture" ? "bg-rose-400" : statut === "Alerte" ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                        style={{ width: `${Math.min((item.stock / Math.max(1, item.low_stock_threshold * 3)) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground/70">Seuil : {item.low_stock_threshold} unités</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
