import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Users,
  TrendingUp,
  UserPlus,
  Activity,
  Eye,
  MousePointerClick,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { updateOrderStatus, deleteOrder } from "@/lib/orders.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/clients")({
  component: ClientsPage,
});

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_eur: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address_line: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  created_at: string;
};

type Item = {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price_eur: number;
  line_total_eur: number;
};

function ClientsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);

  const ordersQ = useQuery({
    queryKey: ["admin", "clients", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, status, total_eur, first_name, last_name, email, phone, address_line, postal_code, city, country, notes, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Order[];
    },
  });

  const itemsQ = useQuery({
    queryKey: ["admin", "clients", "items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("id, order_id, product_slug, product_name, quantity, unit_price_eur, line_total_eur");
      if (error) throw error;
      return (data ?? []) as Item[];
    },
  });

  const trafficQ = useQuery({
    queryKey: ["admin", "clients", "traffic"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("page_views")
        .select("session_id, path, created_at")
        .gte("created_at", since);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 30000,
  });

  // Realtime: refresh on new page views & orders
  useEffect(() => {
    const ch = supabase
      .channel("admin-clients-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "page_views" },
        () => qc.invalidateQueries({ queryKey: ["admin", "clients", "traffic"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          qc.invalidateQueries({ queryKey: ["admin", "clients", "orders"] });
          qc.invalidateQueries({ queryKey: ["admin", "clients", "items"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const updateFn = useServerFn(updateOrderStatus);
  const deleteFn = useServerFn(deleteOrder);

  const confirmMut = useMutation({
    mutationFn: (id: string) => updateFn({ data: { id, status: "paid" } }),
    onSuccess: () => {
      toast.success("Commande confirmée");
      qc.invalidateQueries({ queryKey: ["admin", "clients", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Commande supprimée");
      qc.invalidateQueries({ queryKey: ["admin", "clients", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "clients", "items"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const orders = ordersQ.data ?? [];
  const items = itemsQ.data ?? [];
  const views = trafficQ.data ?? [];

  const byClient = new Map<
    string,
    { email: string; nom: string; commandes: number; total: number; last: string; orders: Order[] }
  >();
  for (const o of orders) {
    const key = o.email.toLowerCase();
    const nom = `${o.first_name} ${o.last_name}`.trim();
    const prev = byClient.get(key);
    if (prev) {
      prev.commandes += 1;
      prev.total += Number(o.total_eur || 0);
      prev.orders.push(o);
      if (new Date(o.created_at) > new Date(prev.last)) prev.last = o.created_at;
    } else {
      byClient.set(key, {
        email: o.email,
        nom,
        commandes: 1,
        total: Number(o.total_eur || 0),
        last: o.created_at,
        orders: [o],
      });
    }
  }
  const clients = Array.from(byClient.values()).sort((a, b) => b.total - a.total);

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newClients = Array.from(byClient.values()).filter(
    (c) => new Date(c.last).getTime() >= thirtyDaysAgo,
  ).length;
  const avgOrders = clients.length ? (orders.length / clients.length).toFixed(1) : "0";
  const avgBasket = orders.length
    ? orders.reduce((s, o) => s + Number(o.total_eur || 0), 0) / orders.length
    : 0;

  const uniqueVisitors = new Set(views.map((v) => v.session_id)).size;
  const totalViews = views.length;
  const conversion =
    uniqueVisitors > 0 ? ((orders.length / uniqueVisitors) * 100).toFixed(1) : "0";

  const clientStats = [
    { label: "Total clients", value: clients.length, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Actifs (30j)", value: newClients, icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Commandes/client", value: avgOrders, icon: Activity, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Panier moyen", value: `${avgBasket.toFixed(0)} €`, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  const trafficStats = [
    { label: "Visiteurs uniques (30j)", value: uniqueVisitors, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Pages vues (30j)", value: totalViews, icon: Eye, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Commandes (total)", value: orders.length, icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Taux conversion", value: `${conversion} %`, icon: MousePointerClick, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  // Build daily series for last 14 days from real page_views + orders
  const chartData = useMemo(() => {
    const DAYS = 14;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets: Record<
      string,
      { date: string; label: string; visiteurs: Set<string>; vues: number; commandes: number }
    > = {};
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      buckets[key] = {
        date: key,
        label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
        visiteurs: new Set<string>(),
        vues: 0,
        commandes: 0,
      };
    }
    for (const v of views) {
      const key = new Date(v.created_at).toISOString().slice(0, 10);
      const b = buckets[key];
      if (!b) continue;
      b.vues += 1;
      if (v.session_id) b.visiteurs.add(v.session_id);
    }
    for (const o of orders) {
      const key = new Date(o.created_at).toISOString().slice(0, 10);
      const b = buckets[key];
      if (!b) continue;
      b.commandes += 1;
    }
    return Object.values(buckets).map((b) => ({
      label: b.label,
      Visiteurs: b.visiteurs.size,
      "Pages vues": b.vues,
      Commandes: b.commandes,
    }));
  }, [views, orders]);

  const statusLabel = (s: string) =>
    ({
      pending: "En attente",
      paid: "Payée",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    } as Record<string, string>)[s] ?? s;

  const statusStyle = (s: string) => {
    if (s === "pending") return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    if (s === "shipped" || s === "delivered" || s === "paid")
      return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
    if (s === "cancelled") return "bg-rose-400/10 text-rose-400 border-rose-400/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-5 p-4">
      <div>
        <h2 className="text-lg font-semibold">Trafic & Clients</h2>
        <p className="text-sm text-muted-foreground">Analyse visiteurs et clientèle</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Trafic du site (30 derniers jours)</h3>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Temps réel
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trafficStats.map((stat) => {
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

        <div className="mt-3 rounded-xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold">Évolution sur 14 jours</div>
              <div className="text-[10px] text-muted-foreground">
                Visiteurs uniques, pages vues et commandes par jour
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(258 90% 66%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(258 90% 66%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="Pages vues"
                  stroke="hsl(258 90% 66%)"
                  fill="url(#gViews)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="Visiteurs"
                  stroke="hsl(199 89% 48%)"
                  fill="url(#gVisits)"
                  strokeWidth={2}
                />
                <Bar dataKey="Commandes" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} barSize={14} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Stats clients</h3>
        <div className="grid grid-cols-2 gap-3">
          {clientStats.map((stat) => {
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
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Meilleurs clients</h3>
        {ordersQ.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
            Chargement…
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun client pour le moment.
          </div>
        ) : (
          <div className="space-y-2">
            {clients.slice(0, 30).map((client) => {
              const isOpen = open === client.email;
              return (
                <div key={client.email} className="rounded-xl border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : client.email)}
                    className="flex w-full items-start justify-between p-3 text-left"
                  >
                    <div>
                      <div className="text-sm font-medium">{client.nom || client.email}</div>
                      <div className="text-xs text-muted-foreground">{client.email}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground/70">
                        Dernière : {new Date(client.last).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {client.total.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €
                      </div>
                      <div className="text-[10px] text-muted-foreground">{client.commandes} cmd</div>
                      <div className="mt-1 inline-flex">
                        {isOpen ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="space-y-3 border-t border-border p-3">
                      {client.orders.map((o) => {
                        const oi = items.filter((i) => i.order_id === o.id);
                        return (
                          <div key={o.id} className="rounded-lg border border-border bg-background/50 p-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xs font-semibold">{o.order_number}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  {new Date(o.created_at).toLocaleString("fr-FR")}
                                </div>
                              </div>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyle(o.status)}`}
                              >
                                {statusLabel(o.status)}
                              </span>
                            </div>

                            {(o.address_line || o.city) && (
                              <div className="mt-2 text-[11px] text-muted-foreground">
                                {o.address_line}
                                {o.postal_code || o.city
                                  ? `, ${o.postal_code ?? ""} ${o.city ?? ""}`
                                  : ""}
                                {o.country ? `, ${o.country}` : ""}
                                {o.phone ? ` · ${o.phone}` : ""}
                              </div>
                            )}

                            <div className="mt-2 space-y-1">
                              {oi.length === 0 ? (
                                <div className="text-[11px] text-muted-foreground">
                                  Aucun article.
                                </div>
                              ) : (
                                oi.map((i) => (
                                  <div
                                    key={i.id}
                                    className="flex items-center justify-between text-[11px]"
                                  >
                                    <span>
                                      {i.product_name}{" "}
                                      <span className="text-muted-foreground">× {i.quantity}</span>
                                    </span>
                                    <span className="font-medium">
                                      {Number(i.line_total_eur).toFixed(2)} €
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>

                            {o.notes && (
                              <div className="mt-2 rounded border border-border bg-card p-2 text-[11px] text-muted-foreground">
                                Note : {o.notes}
                              </div>
                            )}

                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-xs font-semibold">
                                Total {Number(o.total_eur).toFixed(2)} €
                              </div>
                              <div className="flex gap-2">
                                {o.status !== "paid" &&
                                  o.status !== "shipped" &&
                                  o.status !== "delivered" && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      disabled={confirmMut.isPending}
                                      onClick={() => confirmMut.mutate(o.id)}
                                    >
                                      <CheckCircle2 className="size-3.5" />
                                      Confirmer paiement
                                    </Button>
                                  )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={deleteMut.isPending}
                                  onClick={() => {
                                    if (confirm(`Supprimer la commande ${o.order_number} ?`))
                                      deleteMut.mutate(o.id);
                                  }}
                                >
                                  <Trash2 className="size-3.5" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
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
    </div>
  );
}
