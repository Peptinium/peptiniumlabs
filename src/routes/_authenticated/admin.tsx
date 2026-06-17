import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Package,
  CreditCard,
  Boxes,
  Users,
  BarChart3,
  LifeBuoy,
  LogOut,
  FileText,
  Search,
  AlertTriangle,
  Plus,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import {
  amIAdmin,
  claimAdminIfNone,
  listOrders,
  listProductsAdmin,
  updateOrderStatus,
  updateProduct,
} from "@/lib/orders.functions";
import {
  validatePayment,
  setTrackingNumber,
  adjustStock,
  setLowStockThreshold,
  listCustomers,
  upsertCustomerNote,
  getStats,
  listTickets,
  replyTicket,
  updateTicket,
  generateInvoice,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Aetherion Labs" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "theme-color", content: "#0c0d10" },
    ],
  }),
  component: AdminPage,
});

type Tab = "orders" | "payments" | "stock" | "customers" | "stats" | "tickets";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "orders", label: "Commandes", icon: Package },
  { id: "payments", label: "Paiements", icon: CreditCard },
  { id: "stock", label: "Stock", icon: Boxes },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "customers", label: "Clients", icon: Users },
  { id: "tickets", label: "SAV", icon: LifeBuoy },
];

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("orders");

  const amI = useServerFn(amIAdmin);
  const claim = useServerFn(claimAdminIfNone);
  const meQ = useQuery({ queryKey: ["amIAdmin"], queryFn: () => amI() });
  const claimMut = useMutation({
    mutationFn: () => claim(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["amIAdmin"] }),
  });

  if (meQ.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Chargement…
      </div>
    );
  }

  const isAdmin = meQ.data?.isAdmin === true;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center">
          <h2 className="font-display text-lg font-medium">Compte non-admin</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Si tu es propriétaire du site et qu'aucun admin n'existe encore, tu
            peux revendiquer le rôle maintenant.
          </p>
          <button
            onClick={() => claimMut.mutate()}
            disabled={claimMut.isPending}
            className="mt-5 w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
          >
            {claimMut.isPending ? "…" : "Devenir administrateur"}
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="mt-3 w-full text-xs text-muted-foreground underline"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  const TabIcon = TABS.find((t) => t.id === tab)?.icon ?? Package;
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* App-style top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <TabIcon className="size-5 text-accent" />
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                Aetherion · Admin
              </div>
              <h1 className="font-display text-base font-medium leading-tight">
                {TABS.find((t) => t.id === tab)?.label}
              </h1>
            </div>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-surface"
            aria-label="Se déconnecter"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        {tab === "orders" && <OrdersTab />}
        {tab === "payments" && <PaymentsTab />}
        {tab === "stock" && <StockTab />}
        {tab === "stats" && <StatsTab />}
        {tab === "customers" && <CustomersTab />}
        {tab === "tickets" && <TicketsTab />}
      </main>

      {/* Bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-5xl grid-cols-6">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMMANDES
// ═══════════════════════════════════════════════════════════
const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  cancelled: "Annulée",
};

function OrdersTab() {
  const qc = useQueryClient();
  const list = useServerFn(listOrders);
  const upd = useServerFn(updateOrderStatus);
  const setTrack = useServerFn(setTrackingNumber);
  const invoice = useServerFn(generateInvoice);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const q = useQuery({ queryKey: ["orders"], queryFn: () => list() });
  const mut = useMutation({
    mutationFn: (v: { id: string; status: any }) => upd({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
  const trackMut = useMutation({
    mutationFn: (v: { orderId: string; trackingNumber: string | null }) =>
      setTrack({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
  const invoiceMut = useMutation({
    mutationFn: (orderId: string) => invoice({ data: { orderId } }),
    onSuccess: (res) => {
      const bin = atob(res.base64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([arr], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      a.click();
      URL.revokeObjectURL(url);
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (q.isLoading) return <Loading />;
  const orders = q.data?.orders ?? [];
  const itemsByOrder = new Map<string, any[]>();
  (q.data?.items ?? []).forEach((it: any) => {
    if (!itemsByOrder.has(it.order_id)) itemsByOrder.set(it.order_id, []);
    itemsByOrder.get(it.order_id)!.push(it);
  });

  const filtered = orders.filter((o: any) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(s) ||
      o.first_name.toLowerCase().includes(s) ||
      o.last_name.toLowerCase().includes(s) ||
      o.email.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche n° / nom / email"
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="all">Tous statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && <Empty>Aucune commande</Empty>}

      {filtered.map((o: any) => {
        const open = expanded === o.id;
        const its = itemsByOrder.get(o.id) ?? [];
        return (
          <div key={o.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              onClick={() => setExpanded(open ? null : o.id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] text-muted-foreground">
                  {o.order_number} · {new Date(o.created_at).toLocaleDateString("fr-FR")}
                </div>
                <div className="truncate font-medium">
                  {o.first_name} {o.last_name}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {o.city}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-medium">
                  {Number(o.total_eur).toFixed(2)} €
                </div>
                <StatusBadge status={o.status} />
              </div>
            </button>
            {open && (
              <div className="space-y-4 border-t border-border bg-surface/30 p-4">
                <Section title="Client">
                  <div className="text-sm">
                    {o.first_name} {o.last_name}
                    <br />
                    {o.address_line}
                    <br />
                    {o.postal_code} {o.city}
                    <br />
                    {o.country}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {o.email}
                    {o.phone ? ` · ${o.phone}` : ""}
                  </div>
                </Section>
                <Section title="Articles">
                  <ul className="space-y-1 text-sm">
                    {its.map((it) => (
                      <li key={it.id} className="flex justify-between gap-2">
                        <span>
                          {it.product_name} × {it.quantity}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {Number(it.line_total_eur).toFixed(2)} €
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>
                <Section title="Statut">
                  <div className="flex flex-wrap gap-1.5">
                    {(["pending", "paid", "shipped", "cancelled"] as const).map((s) => (
                      <button
                        key={s}
                        disabled={o.status === s || mut.isPending}
                        onClick={() => mut.mutate({ id: o.id, status: s })}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                          o.status === s
                            ? "bg-foreground text-background"
                            : "border border-border bg-background hover:bg-surface"
                        } disabled:opacity-50`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </Section>
                <Section title="N° de suivi">
                  <TrackingInput
                    initial={o.tracking_number ?? ""}
                    onSave={(v) =>
                      trackMut.mutate({ orderId: o.id, trackingNumber: v || null })
                    }
                  />
                </Section>
                <Section title="Facture">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => invoiceMut.mutate(o.id)}
                      disabled={invoiceMut.isPending}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-surface disabled:opacity-40"
                    >
                      <FileText className="size-3.5" />
                      Télécharger PDF
                    </button>
                    {o.invoice_number && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {o.invoice_number}
                      </span>
                    )}
                  </div>
                </Section>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TrackingInput({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (v: string) => void;
}) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex gap-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="ex. 1Z999AA10123456784"
        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
      />
      <button
        disabled={v === initial}
        onClick={() => onSave(v)}
        className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-30"
      >
        Enregistrer
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAIEMENTS À VALIDER
// ═══════════════════════════════════════════════════════════
function PaymentsTab() {
  const qc = useQueryClient();
  const list = useServerFn(listOrders);
  const validate = useServerFn(validatePayment);
  const q = useQuery({ queryKey: ["orders"], queryFn: () => list() });
  const mut = useMutation({
    mutationFn: (v: { orderId: string; amount: number; reference: string; note: string }) =>
      validate({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (q.isLoading) return <Loading />;
  const pending = (q.data?.orders ?? []).filter((o: any) => o.status === "pending");

  if (pending.length === 0)
    return <Empty>Aucun paiement en attente. ✓</Empty>;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Vérifie le virement reçu sur ton compte bancaire, puis valide la
        commande. Le statut passe à « Payée ».
      </p>
      {pending.map((o: any) => (
        <PaymentCard
          key={o.id}
          order={o}
          onValidate={(amount, reference, note) =>
            mut.mutate({ orderId: o.id, amount, reference, note })
          }
          pending={mut.isPending}
        />
      ))}
    </div>
  );
}

function PaymentCard({
  order,
  onValidate,
  pending,
}: {
  order: any;
  onValidate: (amount: number, reference: string, note: string) => void;
  pending: boolean;
}) {
  const [amount, setAmount] = useState(String(order.total_eur));
  const [ref, setRef] = useState(order.order_number);
  const [note, setNote] = useState("");

  return (
    <div className="rounded-xl border border-warning/40 bg-warning/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] text-muted-foreground">
            {order.order_number} · {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </div>
          <div className="font-medium">
            {order.first_name} {order.last_name}
          </div>
          <div className="text-xs text-muted-foreground">{order.email}</div>
        </div>
        <div className="text-right font-mono text-base font-semibold">
          {Number(order.total_eur).toFixed(2)} €
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant reçu"
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        />
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Référence virement"
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (facultatif)"
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        />
      </div>
      <button
        onClick={() => onValidate(Number(amount), ref, note)}
        disabled={pending || !amount}
        className="mt-3 w-full rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 sm:w-auto"
      >
        {pending ? "Validation…" : "Marquer comme payée"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STOCK
// ═══════════════════════════════════════════════════════════
function StockTab() {
  const qc = useQueryClient();
  const list = useServerFn(listProductsAdmin);
  const upd = useServerFn(updateProduct);
  const adjust = useServerFn(adjustStock);
  const setThr = useServerFn(setLowStockThreshold);
  const q = useQuery({ queryKey: ["adminProducts"], queryFn: () => list() });
  const updMut = useMutation({
    mutationFn: (v: { id: string; stock?: number; active?: boolean; price_eur?: number }) =>
      upd({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminProducts"] }),
  });
  const adjMut = useMutation({
    mutationFn: (v: { productId: string; slug: string; delta: number; reason: any; note: string }) =>
      adjust({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminProducts"] }),
  });
  const thrMut = useMutation({
    mutationFn: (v: { productId: string; threshold: number }) => setThr({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  if (q.isLoading) return <Loading />;
  const products = q.data ?? [];

  return (
    <div className="space-y-3">
      {products.map((p: any) => (
        <ProductStockCard
          key={p.id}
          p={p}
          onSave={(v) => updMut.mutate({ id: p.id, ...v })}
          onAdjust={(delta, reason, note) =>
            adjMut.mutate({ productId: p.id, slug: p.slug, delta, reason, note })
          }
          onThreshold={(t) => thrMut.mutate({ productId: p.id, threshold: t })}
        />
      ))}
    </div>
  );
}

function ProductStockCard({
  p,
  onSave,
  onAdjust,
  onThreshold,
}: {
  p: any;
  onSave: (v: { active?: boolean; price_eur?: number }) => void;
  onAdjust: (delta: number, reason: string, note: string) => void;
  onThreshold: (t: number) => void;
}) {
  const [price, setPrice] = useState(String(p.price_eur));
  const [threshold, setThreshold] = useState(String(p.low_stock_threshold ?? 5));
  const [adjustQty, setAdjustQty] = useState("1");
  const [reason, setReason] = useState<string>("restock");
  const [note, setNote] = useState("");
  const low = p.stock <= (p.low_stock_threshold ?? 5);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{p.name}</h3>
            {low && (
              <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-warning">
                <AlertTriangle className="size-3" />
                Stock bas
              </span>
            )}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">{p.slug}</div>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={p.active}
            onChange={(e) => onSave({ active: e.target.checked })}
            className="size-4 cursor-pointer accent-[color:var(--color-accent)]"
          />
          Actif
        </label>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Prix € TTC</Label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            />
            <button
              disabled={Number(price) === Number(p.price_eur)}
              onClick={() => onSave({ price_eur: Number(price) })}
              className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-30"
            >
              OK
            </button>
          </div>
        </div>
        <div>
          <Label>Seuil stock bas</Label>
          <div className="flex gap-2">
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            />
            <button
              disabled={Number(threshold) === p.low_stock_threshold}
              onClick={() => onThreshold(Number(threshold))}
              className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-30"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface/40 p-3">
        <div className="flex items-center justify-between">
          <Label>Stock actuel</Label>
          <span className={`font-mono text-lg font-semibold ${low ? "text-warning" : ""}`}>
            {p.stock}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <button
            onClick={() => setAdjustQty(String(Math.max(1, Number(adjustQty) - 1)))}
            className="rounded-lg border border-border bg-background p-1.5"
          >
            <Minus className="size-3" />
          </button>
          <input
            type="number"
            min={1}
            value={adjustQty}
            onChange={(e) => setAdjustQty(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-center text-sm"
          />
          <button
            onClick={() => setAdjustQty(String(Number(adjustQty) + 1))}
            className="rounded-lg border border-border bg-background p-1.5"
          >
            <Plus className="size-3" />
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
          >
            <option value="restock">Réapprovisionnement</option>
            <option value="manual">Ajustement manuel</option>
            <option value="return">Retour client</option>
            <option value="loss">Perte / casse</option>
            <option value="correction">Correction inventaire</option>
          </select>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onAdjust(Number(adjustQty), reason, note);
              setNote("");
            }}
            className="rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-white"
          >
            + Ajouter
          </button>
          <button
            onClick={() => {
              onAdjust(-Number(adjustQty), reason, note);
              setNote("");
            }}
            className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-white"
          >
            − Retirer
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STATISTIQUES
// ═══════════════════════════════════════════════════════════
function StatsTab() {
  const stats = useServerFn(getStats);
  const [days, setDays] = useState(30);
  const q = useQuery({
    queryKey: ["stats", days],
    queryFn: () => stats({ data: { days } }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {[7, 30, 90, 365].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              days === d
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {d === 365 ? "1 an" : `${d} j`}
          </button>
        ))}
      </div>

      {q.isLoading || !q.data ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <KPI label="CA" value={`${q.data.revenue.toFixed(0)} €`} />
            <KPI label="Commandes" value={String(q.data.orderCount)} />
            <KPI label="Panier moyen" value={`${q.data.avgBasket.toFixed(0)} €`} />
            <KPI label="Visiteurs" value={String(q.data.uniqueSessions)} />
            <KPI label="Pages vues" value={String(q.data.pageViews)} />
            <KPI
              label="Conversion"
              value={`${q.data.conversionRate.toFixed(1)} %`}
            />
          </div>

          <ChartCard title="Ventes & visites par jour">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={q.data.daily} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="revenue" name="CA €" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="views" name="Visites" stroke="#8884d8" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top produits (CA)">
            <ResponsiveContainer width="100%" height={Math.max(160, q.data.topProducts.length * 30)}>
              <BarChart data={q.data.topProducts} layout="vertical" margin={{ left: 0, right: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid gap-3 sm:grid-cols-2">
            <ChartCard title="Sources de trafic">
              <ul className="divide-y divide-border text-sm">
                {q.data.topReferrers.map((r) => (
                  <li key={r.source} className="flex justify-between py-1.5">
                    <span className="truncate">{r.source}</span>
                    <span className="font-mono text-xs text-muted-foreground">{r.count}</span>
                  </li>
                ))}
                {q.data.topReferrers.length === 0 && (
                  <li className="py-2 text-xs text-muted-foreground">Aucune donnée</li>
                )}
              </ul>
            </ChartCard>
            <ChartCard title="Pages les plus vues">
              <ul className="divide-y divide-border text-sm">
                {q.data.topPages.map((p) => (
                  <li key={p.path} className="flex justify-between py-1.5">
                    <span className="truncate font-mono text-xs">{p.path}</span>
                    <span className="font-mono text-xs text-muted-foreground">{p.count}</span>
                  </li>
                ))}
                {q.data.topPages.length === 0 && (
                  <li className="py-2 text-xs text-muted-foreground">Aucune donnée</li>
                )}
              </ul>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════════════════════
function CustomersTab() {
  const qc = useQueryClient();
  const list = useServerFn(listCustomers);
  const note = useServerFn(upsertCustomerNote);
  const q = useQuery({ queryKey: ["customers"], queryFn: () => list() });
  const noteMut = useMutation({
    mutationFn: (v: { email: string; note: string }) => note({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (q.isLoading) return <Loading />;
  const customers = (q.data ?? []).filter((c: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.email.toLowerCase().includes(s) ||
      (c.firstName + " " + c.lastName).toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Recherche nom ou email"
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm"
        />
      </div>
      {customers.length === 0 && <Empty>Aucun client</Empty>}
      {customers.map((c: any) => {
        const open = expanded === c.email;
        return (
          <div key={c.email} className="rounded-xl border border-border bg-card">
            <button
              onClick={() => setExpanded(open ? null : c.email)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">
                  {c.firstName} {c.lastName}
                </div>
                <div className="truncate text-xs text-muted-foreground">{c.email}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-medium">
                  {c.totalSpent.toFixed(0)} €
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.orderCount} cmd
                </div>
              </div>
            </button>
            {open && (
              <div className="space-y-3 border-t border-border bg-surface/30 p-4 text-sm">
                <div className="text-xs text-muted-foreground">
                  Dernière adresse : {c.lastAddress}
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.phone ? `Tél : ${c.phone} · ` : ""}
                  Première commande : {new Date(c.firstOrder).toLocaleDateString("fr-FR")} ·
                  dernière : {new Date(c.lastOrder).toLocaleDateString("fr-FR")}
                </div>
                <CustomerNote
                  initial={c.note}
                  onSave={(n) => noteMut.mutate({ email: c.email, note: n })}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CustomerNote({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <div>
      <Label>Note interne</Label>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      <button
        disabled={v === initial}
        onClick={() => onSave(v)}
        className="mt-2 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-30"
      >
        Enregistrer
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SAV
// ═══════════════════════════════════════════════════════════
function TicketsTab() {
  const qc = useQueryClient();
  const list = useServerFn(listTickets);
  const reply = useServerFn(replyTicket);
  const upd = useServerFn(updateTicket);
  const q = useQuery({ queryKey: ["tickets"], queryFn: () => list() });
  const replyMut = useMutation({
    mutationFn: (v: { ticketId: string; body: string; status?: any }) =>
      reply({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
  const updMut = useMutation({
    mutationFn: (v: { ticketId: string; status?: any; priority?: any }) =>
      upd({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("open");

  const grouped = useMemo(() => {
    const m = new Map<string, any[]>();
    (q.data?.messages ?? []).forEach((msg: any) => {
      if (!m.has(msg.ticket_id)) m.set(msg.ticket_id, []);
      m.get(msg.ticket_id)!.push(msg);
    });
    return m;
  }, [q.data]);

  if (q.isLoading) return <Loading />;

  const tickets = (q.data?.tickets ?? []).filter((t: any) =>
    statusFilter === "all" ? true : t.status === statusFilter,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {(["open", "in_progress", "resolved", "closed", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              statusFilter === s
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {TICKET_STATUS[s] ?? "Tous"}
          </button>
        ))}
      </div>

      {tickets.length === 0 && <Empty>Aucun ticket dans cette catégorie</Empty>}

      {tickets.map((t: any) => {
        const open = expanded === t.id;
        const msgs = grouped.get(t.id) ?? [];
        return (
          <div key={t.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              onClick={() => setExpanded(open ? null : t.id)}
              className="flex w-full items-start justify-between gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] text-muted-foreground">
                  {t.ticket_number} · {new Date(t.created_at).toLocaleDateString("fr-FR")}
                </div>
                <div className="truncate font-medium">{t.subject}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {t.email}
                  {t.order_number ? ` · ${t.order_number}` : ""}
                </div>
              </div>
              <TicketBadge status={t.status} />
            </button>
            {open && (
              <div className="space-y-3 border-t border-border bg-surface/30 p-4">
                <div className="space-y-2">
                  {msgs.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-lg p-3 text-sm ${
                        m.author_role === "admin"
                          ? "ml-6 bg-accent/10"
                          : "mr-6 bg-background"
                      }`}
                    >
                      <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                        {m.author_role === "admin" ? "Vous" : m.author_email || "Client"}
                        {" · "}
                        {new Date(m.created_at).toLocaleString("fr-FR")}
                      </div>
                      <div className="whitespace-pre-wrap">{m.body}</div>
                    </div>
                  ))}
                </div>
                <ReplyBox
                  onSend={(body, status) =>
                    replyMut.mutate({ ticketId: t.id, body, status })
                  }
                  pending={replyMut.isPending}
                />
                <div className="flex flex-wrap gap-1.5">
                  {(["open", "in_progress", "resolved", "closed"] as const).map((s) => (
                    <button
                      key={s}
                      disabled={t.status === s}
                      onClick={() => updMut.mutate({ ticketId: t.id, status: s })}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                        t.status === s
                          ? "bg-foreground text-background"
                          : "border border-border bg-background hover:bg-surface"
                      } disabled:opacity-50`}
                    >
                      {TICKET_STATUS[s]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const TICKET_STATUS: Record<string, string> = {
  open: "Ouvert",
  in_progress: "En cours",
  resolved: "Résolu",
  closed: "Fermé",
  all: "Tous",
};

function TicketBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "border-warning/40 bg-warning/10 text-warning",
    in_progress: "border-accent/40 bg-accent/10 text-accent",
    resolved: "border-success/40 bg-success/10 text-success",
    closed: "border-border bg-surface text-muted-foreground",
  };
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${styles[status] ?? ""}`}
    >
      {TICKET_STATUS[status] ?? status}
    </span>
  );
}

function ReplyBox({
  onSend,
  pending,
}: {
  onSend: (body: string, status?: string) => void;
  pending: boolean;
}) {
  const [body, setBody] = useState("");
  return (
    <div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Votre réponse…"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          disabled={!body.trim() || pending}
          onClick={() => {
            onSend(body, "in_progress");
            setBody("");
          }}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-40"
        >
          Envoyer
        </button>
        <button
          disabled={!body.trim() || pending}
          onClick={() => {
            onSend(body, "resolved");
            setBody("");
          }}
          className="rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          Envoyer & résoudre
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HELPERS PARTAGÉS
// ═══════════════════════════════════════════════════════════
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{title}</Label>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-warning/40 bg-warning/10 text-warning",
    paid: "border-accent/40 bg-accent/10 text-accent",
    shipped: "border-success/40 bg-success/10 text-success",
    cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`mt-1 inline-flex rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${styles[status] ?? ""}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function Loading() {
  return <div className="py-8 text-center text-sm text-muted-foreground">Chargement…</div>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
