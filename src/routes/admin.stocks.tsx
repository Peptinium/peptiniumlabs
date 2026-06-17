import { createFileRoute } from "@tanstack/react-router";
import { Warehouse, AlertTriangle, PackageCheck, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/admin/stocks")({
  component: StocksPage,
});

function StocksPage() {
  const stats = [
    { label: "Références", value: 24, icon: PackageCheck, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Alertes", value: 3, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
  ];

  const stocks = [
    { id: "RET-10", nom: "Retatrutide 10 mg", stock: 45, seuil: 20, statut: "OK" },
    { id: "RET-20", nom: "Retatrutide 20 mg", stock: 12, seuil: 15, statut: "Alerte" },
    { id: "GHK-50", nom: "GHK-Cu 50 mg", stock: 78, seuil: 30, statut: "OK" },
    { id: "BPC-10", nom: "BPC-157 10 mg", stock: 5, seuil: 10, statut: "Critique" },
    { id: "CJC-IP", nom: "CJC-1295 + Ipamorelin", stock: 23, seuil: 15, statut: "OK" },
    { id: "NAD-1K", nom: "NAD+ 1000 mg", stock: 8, seuil: 10, statut: "Alerte" },
  ];

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case "OK":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "Alerte":
        return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      case "Critique":
        return "bg-rose-400/10 text-rose-400 border-rose-400/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Stocks</h2>
        <p className="text-sm text-muted-foreground">Inventaire et alertes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`size-4 ${stat.color}`} />
              </div>
              <div className="mt-2 text-xl font-bold">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Stocks List */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Inventaire</h3>
        <div className="space-y-2">
          {stocks.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{item.nom}</div>
                  <div className="text-xs text-muted-foreground">{item.id}</div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatutStyle(
                    item.statut
                  )}`}
                >
                  {item.statut}
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
                      item.statut === "Critique"
                        ? "bg-rose-400"
                        : item.statut === "Alerte"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                    style={{
                      width: `${Math.min((item.stock / (item.seuil * 3)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground/70">
                  Seuil : {item.seuil} unités
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
