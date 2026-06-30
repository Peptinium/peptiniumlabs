import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  ChevronDown,
  FileText,
  Loader2,
  Mail,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteOrder, listOrders, updateOrderStatus } from "@/lib/orders.functions";
import {
  generateInvoice,
  sendBrandedEmailTests,
  sendCryptoPayment,
  sendPaymentLink,
  sendShippingNotification,
  validatePayment,
} from "@/lib/admin.functions";

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

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  paid: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  shipped: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-rose-400/10 text-rose-400 border-rose-400/20",
};

function CommandesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listOrders);
  const updateFn = useServerFn(updateOrderStatus);
  const deleteFn = useServerFn(deleteOrder);
  const invoiceFn = useServerFn(generateInvoice);
  const testEmailsFn = useServerFn(sendBrandedEmailTests);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const testEmailsMut = useMutation({
    mutationFn: (recipient: string) => testEmailsFn({ data: { recipient } }),
    onSuccess: (res) => {
      const ok = res.results.filter((r: any) => r.ok).length;
      const total = res.results.length;
      if (ok === total) toast.success(`${total} emails de test envoyés à ${res.recipient}`);
      else toast.warning(`${ok}/${total} envoyés — vérifier les logs`);
    },
    onError: (e: Error) => toast.error(e.message || "Envoi impossible"),
  });

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
      return [order.order_number, order.first_name, order.last_name, order.email, order.city]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [orders, filter, search]);

  const total = orders.length;
  const pending = orders.filter((o: any) => o.status === "pending").length;
  const paidLike = orders.filter((o: any) =>
    ["paid", "shipped", "delivered"].includes(o.status),
  ).length;
  const revenue = orders
    .filter((o: any) => !["cancelled", "pending"].includes(o.status))
    .reduce((s: number, o: any) => s + Number(o.total_eur || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Espace administration
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Tableau de bord commandes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivi des commandes, paiements, suivi colis et factures.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={testEmailsMut.isPending}
          onClick={() => testEmailsMut.mutate("peptinium@gmail.com")}
        >
          <Send className="mr-1.5 size-4" />
          {testEmailsMut.isPending ? "Envoi en cours…" : "Tester les 5 emails Peptinium"}
        </Button>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Commandes totales" value={String(total)} />
        <StatCard label="En attente" value={String(pending)} accent="amber" />
        <StatCard label="Payées / expédiées" value={String(paidLike)} accent="emerald" />
        <StatCard label="CA encaissé" value={`${revenue.toFixed(2)} €`} accent="cyan" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par n°, email, nom…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-2">
        {ordersQ.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Chargement…
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
            Aucune commande ne correspond à ces critères.
          </div>
        ) : (
          filteredOrders.map((o: any) => {
            const isOpen = expandedId === o.id;
            const orderItems = itemsByOrder.get(o.id) ?? [];



            return (
              <div key={o.id} className="rounded-xl border border-border bg-card">
                <button
                  onClick={() => setExpandedId(isOpen ? null : o.id)}
                  className="flex w-full items-center gap-4 p-4 text-left hover:bg-secondary/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{o.order_number}</span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[o.status] ?? "border-border"}`}
                      >
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {o.first_name} {o.last_name} · {o.email} ·{" "}
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p className="hidden font-display text-lg font-bold sm:block">
                    {Number(o.total_eur).toFixed(2)} €
                  </p>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border p-5 text-sm">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Client
                        </h4>
                        <p className="font-medium">{o.first_name} {o.last_name}</p>
                        <p className="text-muted-foreground">
                          <Mail className="mr-1 inline size-3" />
                          {o.email}
                        </p>
                        {o.phone && <p className="text-muted-foreground">{o.phone}</p>}
                        <h4 className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Livraison
                        </h4>
                        <p className="text-muted-foreground">
                          {o.address_line || "Adresse non renseignée"}
                          <br />
                          {[o.postal_code, o.city, o.country].filter(Boolean).join(" · ")}
                        </p>
                        {o.notes && (
                          <>
                            <h4 className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                              Notes
                            </h4>
                            <p className="text-muted-foreground">{o.notes}</p>
                          </>
                        )}
                      </div>

                      <div>
                        <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Articles
                        </h4>
                        <ul className="space-y-1 text-xs">
                          {orderItems.map((item: any) => (
                            <li key={item.id} className="flex justify-between">
                              <span>
                                {item.product_name} × {item.quantity}
                              </span>
                              <span className="font-mono">
                                {Number(item.line_total_eur).toFixed(2)} €
                              </span>
                            </li>
                          ))}
                          {orderItems.length === 0 && (
                            <li className="text-muted-foreground">Aucun article.</li>
                          )}
                        </ul>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">Total</span>
                          <span className="font-display text-lg font-bold">
                            {Number(o.total_eur).toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4 border-t border-border pt-4">
                      <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Statut de la commande
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(["pending", "paid", "shipped", "cancelled"] as const).map((status) => (
                            <button
                              key={status}
                              disabled={o.status === status || updateMut.isPending}
                              onClick={() => updateMut.mutate({ id: o.id, status })}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                                o.status === status
                                  ? "border-transparent bg-foreground text-background"
                                  : "border-border bg-card hover:bg-muted"
                              } disabled:opacity-50`}
                            >
                              {STATUS_LABELS[status]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <PaymentLinkPanel order={o} />
                      <CryptoPanel order={o} />
                      <ShippingPanel order={o} />

                      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={invoiceMut.isPending}
                          onClick={() => invoiceMut.mutate(o.id)}
                        >
                          <FileText className="mr-1.5 size-4" /> Facture PDF
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={deleteMut.isPending}
                          onClick={() => {
                            if (confirm(`Supprimer la commande ${o.order_number} ?`)) {
                              deleteMut.mutate(o.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-1.5 size-4" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "cyan" | "amber" | "emerald";
}) {
  const accentCls =
    accent === "cyan"
      ? "text-sky-400"
      : accent === "amber"
        ? "text-amber-400"
        : accent === "emerald"
          ? "text-emerald-400"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-display text-2xl font-bold ${accentCls}`}>{value}</p>
    </div>
  );
}
