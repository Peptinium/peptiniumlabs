import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, TrendingUp, ArrowDownLeft, ArrowUpRight, CheckCircle2, XCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/paiements")({
  component: PaiementsPage,
});

function PaiementsPage() {
  const stats = [
    { label: "Reçus", value: "12 450 €", icon: ArrowDownLeft, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "En attente", value: "2 340 €", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  const paiements = [
    { id: "PAY-001", client: "Labo Scientifique SARL", montant: 456.0, methode: "Carte", statut: "Réussi", date: "Aujourd'hui 14:35" },
    { id: "PAY-002", client: "Université Lyon 1", montant: 128.5, methode: "Virement", statut: "En attente", date: "Aujourd'hui 11:18" },
    { id: "PAY-003", client: "BioPharma Research", montant: 890.0, methode: "Carte", statut: "Réussi", date: "Hier 16:50" },
    { id: "PAY-004", client: "CRO MedTest", montant: 234.0, methode: "PayPal", statut: "Réussi", date: "Hier 09:25" },
    { id: "PAY-005", client: "Institut Pasteur", montant: 567.0, methode: "Virement", statut: "Échoué", date: "17 juin 2026" },
  ];

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "Réussi":
        return <CheckCircle2 className="size-3.5 text-emerald-400" />;
      case "Échoué":
        return <XCircle className="size-3.5 text-rose-400" />;
      case "En attente":
        return <Clock className="size-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case "Réussi":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "Échoué":
        return "bg-rose-400/10 text-rose-400 border-rose-400/20";
      case "En attente":
        return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Paiements</h2>
        <p className="text-sm text-muted-foreground">Suivi des transactions</p>
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

      {/* Paiements List */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Transactions récentes</h3>
        <div className="space-y-2">
          {paiements.map((pay) => (
            <div
              key={pay.id}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatutIcon(pay.statut)}
                  <div>
                    <div className="text-sm font-medium">{pay.client}</div>
                    <div className="text-xs text-muted-foreground">{pay.methode}</div>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatutStyle(
                    pay.statut
                  )}`}
                >
                  {pay.statut}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{pay.id}</span>
                <span className="font-medium text-foreground">{pay.montant.toFixed(2)} €</span>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground/70">{pay.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
