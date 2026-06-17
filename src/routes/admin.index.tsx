import { createFileRoute } from "@tanstack/react-router";
import { Package, TrendingUp, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: CommandesPage,
});

function CommandesPage() {
  const stats = [
    { label: "En attente", value: 12, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Expédiées", value: 48, icon: Package, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "En retard", value: 3, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "CA du jour", value: "2 840 €", icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
  ];

  const commandes = [
    { id: "CMD-2406-001", client: "Labo Scientifique SARL", produits: 3, total: 456.0, statut: "En attente", date: "Aujourd'hui 14:32" },
    { id: "CMD-2406-002", client: "Université Lyon 1", produits: 1, total: 128.5, statut: "En attente", date: "Aujourd'hui 11:15" },
    { id: "CMD-2406-003", client: "BioPharma Research", produits: 5, total: 890.0, statut: "Expédiée", date: "Hier 16:45" },
    { id: "CMD-2406-004", client: "CRO MedTest", produits: 2, total: 234.0, statut: "Expédiée", date: "Hier 09:20" },
    { id: "CMD-2406-005", client: "Institut Pasteur", produits: 4, total: 567.0, statut: "En retard", date: "17 juin 2026" },
  ];

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case "En attente":
        return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      case "Expédiée":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "En retard":
        return "bg-rose-400/10 text-rose-400 border-rose-400/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Commandes</h2>
        <p className="text-sm text-muted-foreground">Gérez vos commandes en temps réel</p>
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

      {/* Commandes List */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Commandes récentes</h3>
        <div className="space-y-2">
          {commandes.map((cmd) => (
            <div
              key={cmd.id}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{cmd.id}</div>
                  <div className="text-xs text-muted-foreground">{cmd.client}</div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatutStyle(
                    cmd.statut
                  )}`}
                >
                  {cmd.statut}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{cmd.produits} produit{cmd.produits > 1 ? "s" : ""}</span>
                <span className="font-medium text-foreground">{cmd.total.toFixed(2)} €</span>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground/70">{cmd.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
