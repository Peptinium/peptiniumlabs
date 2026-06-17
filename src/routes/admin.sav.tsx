import { createFileRoute } from "@tanstack/react-router";
import { HeadphonesIcon, Clock, CheckCircle2, AlertCircle, MessageSquare, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/sav")({
  component: SavPage,
});

function SavPage() {
  const stats = [
    { label: "Ouverts", value: 5, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "En cours", value: 3, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Résolus", value: 28, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  const tickets = [
    { id: "TK-001", client: "Labo Scientifique SARL", sujet: "Retard livraison", priorite: "Haute", statut: "Ouvert", canal: "Email", date: "Aujourd'hui 10:00" },
    { id: "TK-002", client: "BioPharma Research", sujet: "Question produit", priorite: "Normale", statut: "En cours", canal: "Téléphone", date: "Hier 14:30" },
    { id: "TK-003", client: "Université Lyon 1", sujet: "Demande CoA", priorite: "Normale", statut: "En cours", canal: "Email", date: "Hier 09:15" },
    { id: "TK-004", client: "CRO MedTest", sujet: "Problème paiement", priorite: "Haute", statut: "Ouvert", canal: "Téléphone", date: "17 juin 2026" },
    { id: "TK-005", client: "Institut Pasteur", sujet: "Retour produit", priorite: "Basse", statut: "Ouvert", canal: "Email", date: "16 juin 2026" },
  ];

  const getPrioriteStyle = (priorite: string) => {
    switch (priorite) {
      case "Haute":
        return "bg-rose-400/10 text-rose-400 border-rose-400/20";
      case "Normale":
        return "bg-sky-400/10 text-sky-400 border-sky-400/20";
      case "Basse":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case "Ouvert":
        return "bg-rose-400/10 text-rose-400 border-rose-400/20";
      case "En cours":
        return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      case "Résolu":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case "Email":
        return <Mail className="size-3 text-muted-foreground" />;
      case "Téléphone":
        return <Phone className="size-3 text-muted-foreground" />;
      default:
        return <MessageSquare className="size-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">SAV</h2>
        <p className="text-sm text-muted-foreground">Service après-vente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className={`flex size-7 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`size-3.5 ${stat.color}`} />
              </div>
              <div className="mt-2 text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tickets List */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Tickets actifs</h3>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{ticket.sujet}</div>
                  <div className="text-xs text-muted-foreground">{ticket.client}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getPrioriteStyle(
                      ticket.priorite
                    )}`}
                  >
                    {ticket.priorite}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatutStyle(
                      ticket.statut
                    )}`}
                  >
                    {ticket.statut}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground/70">
                <span className="flex items-center gap-1">
                  {getCanalIcon(ticket.canal)}
                  {ticket.canal}
                </span>
                <span>·</span>
                <span>{ticket.id}</span>
                <span>·</span>
                <span>{ticket.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
