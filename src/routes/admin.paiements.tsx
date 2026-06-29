import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDownLeft, CheckCircle2, Clock, Landmark, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { validatePayment } from "@/lib/admin.functions";
import { listOrders } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin/paiements")({
  component: PaiementsPage,
});

function PaiementsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listOrders);
  const validateFn = useServerFn(validatePayment);

  const ordersQ = useQuery({
    queryKey: ["admin", "payments", "orders"],
    queryFn: () => listFn(),
    refetchInterval: 30000,
  });

  const historyQ = useQuery({
    queryKey: ["admin", "payments", "history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(
          "id, amount_eur, method, reference, validated_at, note, order_id, orders(order_number, first_name, last_name)",
        )
        .order("validated_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 30000,
  });

  const validateMut = useMutation({
    mutationFn: ({ orderId, amount, reference, note }: { orderId: string; amount: number; reference: string; note: string }) =>
      validateFn({ data: { orderId, amount, reference, note } }),
    onSuccess: () => {
      toast.success("Paiement validé");
      qc.invalidateQueries({ queryKey: ["admin", "payments"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "clients", "orders"] });
    },
    onError: (e: Error) => toast.error(e.message || "Validation impossible"),
  });

  const orders = ordersQ.data?.orders ?? [];
  const pendingOrders = orders.filter((order: any) => order.status === "pending");
  const payments = historyQ.data ?? [];

  const pendingTotal = pendingOrders.reduce((sum: number, order: any) => sum + Number(order.total_eur || 0), 0);
  const received = payments.reduce((sum: number, payment: any) => sum + Number(payment.amount_eur || 0), 0);

  const stats = [
    { label: "À valider", value: pendingOrders.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "En attente", value: `${pendingTotal.toFixed(2)} €`, icon: Landmark, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Reçus", value: `${received.toFixed(2)} €`, icon: ArrowDownLeft, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Transactions", value: payments.length, icon: Receipt, color: "text-violet-400", bg: "bg-violet-400/10" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Paiements</h2>
        <p className="text-sm text-muted-foreground">
          Validation manuelle des virements et historique des transactions.
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

      <div>
        <h3 className="mb-3 text-sm font-semibold">Virements en attente</h3>
        {ordersQ.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
            Chargement…
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun paiement à valider.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((order: any) => (
              <PaymentValidationCard
                key={order.id}
                order={order}
                pending={validateMut.isPending}
                onValidate={(amount, reference, note) =>
                  validateMut.mutate({ orderId: order.id, amount, reference, note })
                }
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Historique récent</h3>
        {historyQ.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
            Chargement…
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun paiement enregistré.
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((payment: any) => (
              <div key={payment.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-400/10">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {payment.orders?.first_name ?? ""} {payment.orders?.last_name ?? ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payment.orders?.order_number ?? payment.reference ?? "Référence indisponible"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{Number(payment.amount_eur).toFixed(2)} €</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(payment.validated_at).toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {payment.method}
                  {payment.note ? ` · ${payment.note}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentValidationCard({
  order,
  onValidate,
  pending,
}: {
  order: any;
  onValidate: (amount: number, reference: string, note: string) => void;
  pending: boolean;
}) {
  const [amount, setAmount] = useState(String(Number(order.total_eur).toFixed(2)));
  const [reference, setReference] = useState(order.order_number ?? "");
  const [note, setNote] = useState("");

  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] text-muted-foreground">
            {order.order_number} · {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </div>
          <div className="font-medium">
            {order.first_name} {order.last_name}
          </div>
          <div className="text-xs text-muted-foreground">{order.email}</div>
        </div>
        <div className="text-right font-semibold">{Number(order.total_eur).toFixed(2)} €</div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant reçu"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        />
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Référence virement"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note interne"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        />
      </div>

      <Button
        type="button"
        className="mt-3 w-full sm:w-auto"
        disabled={pending || !amount}
        onClick={() => onValidate(Number(amount), reference, note)}
      >
        {pending ? "Validation…" : "Marquer comme payée"}
      </Button>
    </div>
  );
}
