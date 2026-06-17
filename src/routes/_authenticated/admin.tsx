import { createFileRoute, useNavigate, useServerFn } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  amIAdmin,
  claimAdminIfNone,
  listOrders,
  listProductsAdmin,
  updateOrderStatus,
  updateProduct,
} from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Aetherion Labs" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Virement reçu",
  shipped: "Expédiée",
  cancelled: "Annulée",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"orders" | "stock">("orders");

  const amI = useServerFn(amIAdmin);
  const claim = useServerFn(claimAdminIfNone);

  const meQ = useQuery({
    queryKey: ["amIAdmin"],
    queryFn: () => amI(),
  });

  const claimMut = useMutation({
    mutationFn: () => claim(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["amIAdmin"] }),
  });

  if (meQ.isLoading) {
    return (
      <SiteLayout>
        <div className="container-prose py-16 text-center text-sm text-muted-foreground">
          Chargement…
        </div>
      </SiteLayout>
    );
  }

  const isAdmin = meQ.data?.isAdmin === true;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose flex flex-wrap items-center justify-between gap-3 py-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Back-office
            </div>
            <h1 className="mt-1 font-display text-2xl font-medium">
              Administration
            </h1>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium hover:bg-surface"
          >
            Se déconnecter
          </button>
        </div>
      </section>

      <div className="container-prose py-8">
        {!isAdmin ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 text-center">
            <h2 className="font-display text-lg font-medium">
              Compte non-admin
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ton compte est connecté mais n'a pas le rôle administrateur. Si tu
              es le propriétaire du site et qu'aucun admin n'existe encore, tu
              peux le revendiquer maintenant.
            </p>
            <button
              onClick={() => claimMut.mutate()}
              disabled={claimMut.isPending}
              className="mt-5 w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
            >
              {claimMut.isPending ? "…" : "Devenir administrateur"}
            </button>
            {claimMut.data && !claimMut.data.granted && !claimMut.data.isAdmin && (
              <p className="mt-3 text-xs text-destructive">
                Un administrateur existe déjà. Contacte-le pour obtenir l'accès.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 inline-flex gap-1 rounded-lg border border-border bg-card p-1">
              {(["orders", "stock"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                    tab === t
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "orders" ? "Commandes" : "Stock"}
                </button>
              ))}
            </div>

            {tab === "orders" ? <OrdersTab /> : <StockTab />}
          </>
        )}
      </div>
    </SiteLayout>
  );
}

function OrdersTab() {
  const qc = useQueryClient();
  const list = useServerFn(listOrders);
  const upd = useServerFn(updateOrderStatus);
  const [expanded, setExpanded] = useState<string | null>(null);

  const q = useQuery({ queryKey: ["orders"], queryFn: () => list() });

  const mut = useMutation({
    mutationFn: (vars: { id: string; status: any }) =>
      upd({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  if (q.isLoading) return <div className="text-sm text-muted-foreground">Chargement…</div>;
  if (q.error) return <div className="text-sm text-destructive">{(q.error as Error).message}</div>;

  const orders = q.data?.orders ?? [];
  const itemsByOrder = new Map<string, any[]>();
  (q.data?.items ?? []).forEach((it: any) => {
    if (!itemsByOrder.has(it.order_id)) itemsByOrder.set(it.order_id, []);
    itemsByOrder.get(it.order_id)!.push(it);
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Aucune commande pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o: any) => {
        const open = expanded === o.id;
        const its = itemsByOrder.get(o.id) ?? [];
        return (
          <div key={o.id} className="rounded-xl border border-border bg-card">
            <button
              onClick={() => setExpanded(open ? null : o.id)}
              className="grid w-full grid-cols-1 gap-2 p-4 text-left sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
            >
              <div>
                <div className="font-mono text-xs text-muted-foreground">
                  {o.order_number} · {new Date(o.created_at).toLocaleString("fr-FR")}
                </div>
                <div className="font-display text-sm font-medium">
                  {o.first_name} {o.last_name}
                </div>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                {o.city} ({o.postal_code})
              </div>
              <div className="font-mono text-sm font-medium sm:text-right">
                {Number(o.total_eur).toFixed(2)} €
              </div>
              <StatusBadge status={o.status} />
            </button>
            {open && (
              <div className="border-t border-border p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Adresse de livraison
                    </div>
                    <div className="mt-1 text-sm">
                      {o.first_name} {o.last_name}
                      <br />
                      {o.address_line}
                      <br />
                      {o.postal_code} {o.city}
                      <br />
                      {o.country}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {o.email} {o.phone ? `· ${o.phone}` : ""}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Articles
                    </div>
                    <ul className="mt-1 space-y-1 text-sm">
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
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(["pending", "paid", "shipped", "cancelled"] as const).map(
                    (s) => (
                      <button
                        key={s}
                        disabled={o.status === s || mut.isPending}
                        onClick={() => mut.mutate({ id: o.id, status: s })}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          o.status === s
                            ? "bg-foreground text-background"
                            : "border border-border bg-background hover:bg-surface"
                        } disabled:opacity-50`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
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
      className={`inline-flex justify-self-start rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide sm:justify-self-end ${styles[status] ?? ""}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function StockTab() {
  const qc = useQueryClient();
  const list = useServerFn(listProductsAdmin);
  const upd = useServerFn(updateProduct);
  const q = useQuery({ queryKey: ["adminProducts"], queryFn: () => list() });

  const mut = useMutation({
    mutationFn: (v: { id: string; stock?: number; active?: boolean; price_eur?: number }) =>
      upd({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  if (q.isLoading) return <div className="text-sm text-muted-foreground">Chargement…</div>;
  const products = q.data ?? [];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Produit</th>
            <th className="px-4 py-3 text-right">Prix €</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3 text-center">Actif</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p: any) => (
            <ProductRow key={p.id} p={p} onSave={(v) => mut.mutate({ id: p.id, ...v })} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({
  p,
  onSave,
}: {
  p: any;
  onSave: (v: { stock?: number; active?: boolean; price_eur?: number }) => void;
}) {
  const [stock, setStock] = useState<string>(String(p.stock));
  const [price, setPrice] = useState<string>(String(p.price_eur));
  const dirty = Number(stock) !== p.stock || Number(price) !== Number(p.price_eur);

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="font-medium">{p.name}</div>
        <div className="font-mono text-[10px] text-muted-foreground">{p.slug}</div>
      </td>
      <td className="px-2 py-3 text-right">
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24 rounded border border-border bg-background px-2 py-1 text-right text-sm"
        />
      </td>
      <td className="px-2 py-3 text-right">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-20 rounded border border-border bg-background px-2 py-1 text-right text-sm"
        />
      </td>
      <td className="px-4 py-3 text-center">
        <input
          type="checkbox"
          checked={p.active}
          onChange={(e) => onSave({ active: e.target.checked })}
          className="size-4 cursor-pointer accent-[color:var(--color-accent)]"
        />
      </td>
      <td className="px-3 py-3 text-right">
        <button
          disabled={!dirty}
          onClick={() =>
            onSave({ stock: Number(stock), price_eur: Number(price) })
          }
          className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background disabled:opacity-30"
        >
          Enregistrer
        </button>
      </td>
    </tr>
  );
}
