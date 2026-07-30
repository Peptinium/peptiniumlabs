import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { listMyOrders } from "@/lib/account.functions";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/_authenticated/mon-compte/")({
  component: MesCommandes,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente de paiement",
  paid: "Payée",
  shipped: "Expédiée",
  cancelled: "Annulée",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  shipped: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

function MesCommandes() {
  const fetchOrders = useServerFn(listMyOrders);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ orders: any[]; items: any[] }>({ orders: [], items: [] });
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchOrders();
        if (!cancelled) setData(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchOrders]);

  if (loading) {
    return <div className="py-10 text-center text-sm text-muted-foreground">Chargement…</div>;
  }
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }
  if (data.orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          📦
        </div>
        <h2 className="font-display text-lg font-medium">Aucune commande pour le moment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vos commandes apparaîtront ici après votre premier achat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.orders.map((o) => {
        const items = data.items.filter((it) => it.order_id === o.id);
        const open = openId === o.id;
        return (
          <div key={o.id} className="rounded-xl border border-border bg-card">
            <button
              onClick={() => setOpenId(open ? null : o.id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold">{o.order_number}</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                      STATUS_COLOR[o.status] ?? STATUS_COLOR.cancelled
                    }`}
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {o.tracking_number ? ` · Suivi : ${o.tracking_number}` : ""}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-sm font-semibold">
                  {formatPrice(Number(o.total_eur))}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {open ? "Masquer" : "Détails"}
                </div>
              </div>
            </button>
            {open && (
              <div className="border-t border-border p-4 text-sm">
                <div className="space-y-1.5">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate">{it.product_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {it.quantity} × {formatPrice(Number(it.unit_price_eur))}
                        </div>
                      </div>
                      <div className="font-mono text-xs">
                        {formatPrice(Number(it.line_total_eur))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <div>
                    Livraison : {o.first_name} {o.last_name} · {o.address_line}, {o.postal_code}{" "}
                    {o.city}, {o.country}
                  </div>
                  {o.invoice_number && <div className="mt-1">Facture : {o.invoice_number}</div>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
