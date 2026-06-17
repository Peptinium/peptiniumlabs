import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/sav")({
  component: SavPage,
});

function SavPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("id, ticket_number, email, subject, status, priority, order_number, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const tickets = data ?? [];
  const stats = [
    { label: "Ouverts", value: tickets.filter((t) => t.status === "open").length, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "En cours", value: tickets.filter((t) => t.status === "in_progress").length, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Résolus", value: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  const statusLabel = (s: string) =>
    ({ open: "Ouvert", in_progress: "En cours", resolved: "Résolu", closed: "Fermé" } as Record<string, string>)[s] ?? s;
  const prioLabel = (p: string) =>
    ({ low: "Basse", normal: "Normale", high: "Haute", urgent: "Urgente" } as Record<string, string>)[p] ?? p;

  const getStatutStyle = (s: string) => {
    if (s === "open") return "bg-rose-400/10 text-rose-400 border-rose-400/20";
    if (s === "in_progress") return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
  };
  const getPrioriteStyle = (p: string) => {
    if (p === "high" || p === "urgent") return "bg-rose-400/10 text-rose-400 border-rose-400/20";
    if (p === "low") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
    return "bg-sky-400/10 text-sky-400 border-sky-400/20";
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">SAV</h2>
        <p className="text-sm text-muted-foreground">Service après-vente</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-3">
              <div className={`flex size-7 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`size-3.5 ${stat.color}`} />
              </div>
              <div className="mt-2 text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Tickets actifs</h3>
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">Chargement…</div>
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun ticket SAV.
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{t.subject}</div>
                    <div className="text-xs text-muted-foreground">{t.email}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getPrioriteStyle(t.priority)}`}>
                      {prioLabel(t.priority)}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatutStyle(t.status)}`}>
                      {statusLabel(t.status)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground/70">
                  <Mail className="size-3" />
                  <span>{t.ticket_number}</span>
                  {t.order_number && (<><span>·</span><span>{t.order_number}</span></>)}
                  <span>·</span>
                  <span>{new Date(t.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
