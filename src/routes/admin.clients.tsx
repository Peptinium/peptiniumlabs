import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, UserPlus, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("email, first_name, last_name, total_eur, created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const orders = data ?? [];
  const byClient = new Map<string, { email: string; nom: string; commandes: number; total: number; last: string }>();
  for (const o of orders) {
    const key = o.email.toLowerCase();
    const prev = byClient.get(key);
    const nom = `${o.first_name} ${o.last_name}`.trim();
    if (prev) {
      prev.commandes += 1;
      prev.total += Number(o.total_eur || 0);
      if (new Date(o.created_at) > new Date(prev.last)) prev.last = o.created_at;
    } else {
      byClient.set(key, { email: o.email, nom, commandes: 1, total: Number(o.total_eur || 0), last: o.created_at });
    }
  }
  const clients = Array.from(byClient.values()).sort((a, b) => b.total - a.total);

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newClients = Array.from(byClient.values()).filter((c) => new Date(c.last).getTime() >= thirtyDaysAgo).length;
  const avgOrders = clients.length ? (orders.length / clients.length).toFixed(1) : "0";
  const avgBasket = orders.length ? orders.reduce((s, o) => s + Number(o.total_eur || 0), 0) / orders.length : 0;

  const stats = [
    { label: "Total clients", value: clients.length, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Actifs (30j)", value: newClients, icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Commandes/client", value: avgOrders, icon: Activity, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Panier moyen", value: `${avgBasket.toFixed(0)} €`, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Stats Clients</h2>
        <p className="text-sm text-muted-foreground">Analyse clientèle</p>
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
        <h3 className="mb-3 text-sm font-semibold">Meilleurs clients</h3>
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">Chargement…</div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun client pour le moment.
          </div>
        ) : (
          <div className="space-y-2">
            {clients.slice(0, 20).map((client) => (
              <div key={client.email} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{client.nom || client.email}</div>
                    <div className="text-xs text-muted-foreground">{client.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{client.total.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €</div>
                    <div className="text-[10px] text-muted-foreground">{client.commandes} cmd</div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground/70">
                  Dernière commande : {new Date(client.last).toLocaleDateString("fr-FR")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
