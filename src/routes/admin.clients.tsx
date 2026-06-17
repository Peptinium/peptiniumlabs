import { createFileRoute } from "@tanstack/react-router";
import { Users, TrendingUp, UserPlus, Activity } from "lucide-react";

export const Route = createFileRoute("/admin/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const stats = [
    { label: "Total clients", value: 156, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Nouveaux (30j)", value: 12, icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Commandes/client", value: "3.2", icon: Activity, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Panier moyen", value: "340 €", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  const clients = [
    { id: "C-001", nom: "Labo Scientifique SARL", email: "contact@labosci.fr", commandes: 8, total: 3450.0, last: "Aujourd'hui" },
    { id: "C-002", nom: "Université Lyon 1", email: "achats@univ-lyon1.fr", commandes: 15, total: 8900.0, last: "Aujourd'hui" },
    { id: "C-003", nom: "BioPharma Research", email: "procurement@biopharma.eu", commandes: 5, total: 2100.0, last: "Hier" },
    { id: "C-004", nom: "CRO MedTest", email: "orders@medtest.cro", commandes: 3, total: 780.0, last: "Hier" },
    { id: "C-005", nom: "Institut Pasteur", email: "labo@pasteur.fr", commandes: 12, total: 5600.0, last: "17 juin" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Stats Clients</h2>
        <p className="text-sm text-muted-foreground">Analyse clientèle</p>
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

      {/* Clients List */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Meilleurs clients</h3>
        <div className="space-y-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{client.nom}</div>
                  <div className="text-xs text-muted-foreground">{client.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{client.total.toLocaleString("fr-FR")} €</div>
                  <div className="text-[10px] text-muted-foreground">{client.commandes} cmd</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground/70">
                Dernière commande : {client.last}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
