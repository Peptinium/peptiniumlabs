import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, Clock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/paiements")({
  component: PaiementsPage,
});

function PaiementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const [{ data: payments, error: e1 }, { data: pending, error: e2 }] = await Promise.all([
        supabase
          .from("payments")
          .select("id, amount_eur, method, reference, validated_at, order_id, orders(order_number, first_name, last_name)")
          .order("validated_at", { ascending: false })
          .limit(50),
        supabase.from("orders").select("total_eur").eq("status", "pending"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { payments: payments ?? [], pending: pending ?? [] };
    },
  });

  const payments = data?.payments ?? [];
  const received = payments.reduce((s, p) => s + Number(p.amount_eur || 0), 0);
  const pendingTotal = (data?.pending ?? []).reduce((s, o) => s + Number(o.total_eur || 0), 0);

  const stats = [
    { label: "Reçus", value: `${received.toFixed(2)} €`, icon: ArrowDownLeft, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "En attente", value: `${pendingTotal.toFixed(2)} €`, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Paiements</h2>
        <p className="text-sm text-muted-foreground">Suivi des transactions</p>
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
        <h3 className="mb-3 text-sm font-semibold">Transactions récentes</h3>
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">Chargement…</div>
        ) : payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun paiement enregistré.
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((p: any) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-medium">
                        {p.orders?.first_name ?? ""} {p.orders?.last_name ?? ""}
                      </div>
                      <div className="text-xs text-muted-foreground">{p.method}</div>
                    </div>
                  </div>
                  <span className="font-medium text-sm">{Number(p.amount_eur).toFixed(2)} €</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/70">
                  <span>{p.orders?.order_number ?? p.reference ?? ""}</span>
                  <span>{new Date(p.validated_at).toLocaleString("fr-FR")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
