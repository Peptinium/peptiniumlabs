import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: CommandesPage,
});

function CommandesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total_eur, first_name, last_name, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const orders = data ?? [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const shipped = orders.filter((o) => o.status === "shipped" || o.status === "delivered").length;
  const late = orders.filter((o) => {
    if (o.status !== "pending") return false;
    return (Date.now() - new Date(o.created_at).getTime()) > 1000 * 60 * 60 * 24 * 3;
  }).length;
  const caToday = orders
    .filter((o) => new Date(o.created_at) >= today)
    .reduce((s, o) => s + Number(o.total_eur || 0), 0);

  const stats = [
    { label: "En attente", value: pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Expédiées", value: shipped, icon: Package, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "En retard", value: late, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "CA du jour", value: `${caToday.toFixed(2)} €`, icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
  ];

  const statusLabel = (s: string) =>
    ({ pending: "En attente", paid: "Payée", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" } as Record<string, string>)[s] ?? s;

  const getStatutStyle = (s: string) => {
    if (s === "pending") return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    if (s === "shipped" || s === "delivered" || s === "paid") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
    if (s === "cancelled") return "bg-rose-400/10 text-rose-400 border-rose-400/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Commandes</h2>
        <p className="text-sm text-muted-foreground">Gérez vos commandes en temps réel</p>
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
        <h3 className="mb-3 text-sm font-semibold">Commandes récentes</h3>
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">Chargement…</div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucune commande pour le moment.
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 20).map((o) => (
              <div key={o.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{o.first_name} {o.last_name}</div>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatutStyle(o.status)}`}>
                    {statusLabel(o.status)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(o.created_at).toLocaleString("fr-FR")}</span>
                  <span className="font-medium text-foreground">{Number(o.total_eur).toFixed(2)} €</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
