import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Package,
  Search,
  Trash2,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteOrder, listOrders, updateOrderStatus } from "@/lib/orders.functions";
import { generateInvoice, sendBrandedEmailTests, setTrackingNumber } from "@/lib/admin.functions";


export const Route = createFileRoute("/admin/")({
  component: CommandesPage,
});

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function CommandesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listOrders);
  const updateFn = useServerFn(updateOrderStatus);
  const deleteFn = useServerFn(deleteOrder);
  const trackingFn = useServerFn(setTrackingNumber);
  const invoiceFn = useServerFn(generateInvoice);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, string>>({});

  const ordersQ = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => listFn(),
    refetchInterval: 30000,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "paid" | "shipped" | "cancelled" }) =>
      updateFn({ data: { id, status } }),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "clients", "orders"] });
    },
    onError: (e: Error) => toast.error(e.message || "Erreur de mise à jour"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Commande supprimée");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "clients", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "clients", "items"] });
    },
    onError: (e: Error) => toast.error(e.message || "Suppression impossible"),
  });

  const trackingMut = useMutation({
    mutationFn: ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string | null }) =>
      trackingFn({ data: { orderId, trackingNumber } }),
    onSuccess: (_, vars) => {
      toast.success("Numéro de suivi enregistré");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      setTrackingDrafts((prev) => ({ ...prev, [vars.orderId]: vars.trackingNumber ?? "" }));
    },
    onError: (e: Error) => toast.error(e.message || "Erreur d'enregistrement"),
  });

  const invoiceMut = useMutation({
    mutationFn: (orderId: string) => invoiceFn({ data: { orderId } }),
    onSuccess: (res) => {
      const binary = atob(res.base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Facture générée");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (e: Error) => toast.error(e.message || "Facture impossible"),
  });

  const orders = ordersQ.data?.orders ?? [];
  const items = ordersQ.data?.items ?? [];

  const itemsByOrder = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const item of items) {
      if (!map.has(item.order_id)) map.set(item.order_id, []);
      map.get(item.order_id)!.push(item);
    }
    return map;
  }, [items]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      if (filter !== "all" && order.status !== filter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return [
        order.order_number,
        order.first_name,
        order.last_name,
        order.email,
        order.city,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [orders, filter, search]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pending = orders.filter((o: any) => o.status === "pending").length;
  const paid = orders.filter((o: any) => o.status === "paid").length;
  const shipped = orders.filter((o: any) => o.status === "shipped").length;
  const late = orders.filter((o: any) => {
    if (o.status !== "pending") return false;
    return Date.now() - new Date(o.created_at).getTime() > 3 * 24 * 60 * 60 * 1000;
  }).length;
  const revenueToday = orders
    .filter((o: any) => o.status !== "cancelled" && new Date(o.created_at) >= today)
    .reduce((sum: number, o: any) => sum + Number(o.total_eur || 0), 0);

  const stats = [
    { label: "En attente", value: pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Payées", value: paid, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Expédiées", value: shipped, icon: Truck, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "En retard", value: late, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "CA du jour", value: `${revenueToday.toFixed(2)} €`, icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-400/10" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Tableau de bord commandes</h2>
        <p className="text-sm text-muted-foreground">
          Suivi des commandes, paiements, suivi colis et factures.
        </p>
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

      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une commande, un nom, un email"
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payée</option>
            <option value="shipped">Expédiée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Commandes</h3>
        {ordersQ.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
            Chargement…
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucune commande trouvée.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredOrders.map((order: any) => {
              const isOpen = expandedId === order.id;
              const orderItems = itemsByOrder.get(order.id) ?? [];
              const trackingValue =
                trackingDrafts[order.id] ?? (order.tracking_number ? String(order.tracking_number) : "");

              return (
                <div key={order.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                    className="flex w-full items-start justify-between gap-3 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {order.order_number} · {new Date(order.created_at).toLocaleString("fr-FR")}
                      </div>
                      <div className="truncate text-sm font-semibold">
                        {order.first_name} {order.last_name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {order.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {Number(order.total_eur).toFixed(2)} €
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      {isOpen ? (
                        <ChevronUp className="mt-0.5 size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="mt-0.5 size-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="space-y-4 border-t border-border bg-background/30 p-4">
                      <section>
                        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Livraison
                        </div>
                        <div className="text-sm">
                          {order.address_line || "Adresse non renseignée"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {[order.postal_code, order.city, order.country].filter(Boolean).join(" · ")}
                        </div>
                        {(order.phone || order.notes) && (
                          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {order.phone && <div>Tél. {order.phone}</div>}
                            {order.notes && <div>Note : {order.notes}</div>}
                          </div>
                        )}
                      </section>

                      <section>
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Articles
                        </div>
                        <div className="space-y-1.5">
                          {orderItems.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span>
                                {item.product_name} <span className="text-muted-foreground">× {item.quantity}</span>
                              </span>
                              <span className="font-medium">{Number(item.line_total_eur).toFixed(2)} €</span>
                            </div>
                          ))}
                          {orderItems.length === 0 && (
                            <div className="text-xs text-muted-foreground">Aucun article trouvé.</div>
                          )}
                        </div>
                      </section>

                      <section>
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Actions rapides
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(["pending", "paid", "shipped", "cancelled"] as const).map((status) => (
                            <button
                              key={status}
                              disabled={order.status === status || updateMut.isPending}
                              onClick={() => updateMut.mutate({ id: order.id, status })}
                              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                                order.status === status
                                  ? "border-transparent bg-foreground text-background"
                                  : "border-border bg-card hover:bg-muted"
                              } disabled:opacity-50`}
                            >
                              {STATUS_LABELS[status]}
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className="space-y-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Suivi & facture
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={trackingValue}
                            onChange={(e) =>
                              setTrackingDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            placeholder="Numéro de suivi"
                            className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={trackingMut.isPending}
                            onClick={() =>
                              trackingMut.mutate({
                                orderId: order.id,
                                trackingNumber: trackingValue.trim() || null,
                              })
                            }
                          >
                            Sauver
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="justify-center"
                            disabled={invoiceMut.isPending}
                            onClick={() => invoiceMut.mutate(order.id)}
                          >
                            <FileText className="mr-1 size-4" />
                            Facture
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            className="justify-center"
                            disabled={deleteMut.isPending}
                            onClick={() => {
                              if (confirm(`Supprimer la commande ${order.order_number} ?`)) {
                                deleteMut.mutate(order.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-1 size-4" />
                            Supprimer
                          </Button>
                        </div>
                      </section>
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

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "pending"
      ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
      : status === "paid" || status === "shipped" || status === "delivered"
        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
        : status === "cancelled"
          ? "border-rose-400/20 bg-rose-400/10 text-rose-400"
          : "border-border bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
