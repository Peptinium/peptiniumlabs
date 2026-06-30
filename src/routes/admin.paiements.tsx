import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDownLeft,
  Bitcoin,
  CheckCircle2,
  Clock,
  CreditCard,
  Landmark,
  Link as LinkIcon,
  Package,
  Receipt,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  validatePayment,
  sendPaymentLink,
  sendCryptoPayment,
  sendShippingNotification,
} from "@/lib/admin.functions";
import { listOrders } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin/paiements")({
  component: PaiementsPage,
});

type Order = any;

const METHOD_META: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  bank: { label: "Virement", icon: Landmark, color: "text-sky-400", bg: "bg-sky-400/10" },
  card: { label: "CB (lien différé)", icon: CreditCard, color: "text-violet-400", bg: "bg-violet-400/10" },
  crypto: { label: "Crypto BTC", icon: Bitcoin, color: "text-amber-400", bg: "bg-amber-400/10" },
};

function PaiementsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listOrders);
  const validateFn = useServerFn(validatePayment);
  const sendLinkFn = useServerFn(sendPaymentLink);
  const sendCryptoFn = useServerFn(sendCryptoPayment);
  const shipFn = useServerFn(sendShippingNotification);

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

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin", "payments"] });
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    qc.invalidateQueries({ queryKey: ["admin", "clients", "orders"] });
  };

  const validateMut = useMutation({
    mutationFn: (v: { orderId: string; amount: number; reference: string; note: string }) =>
      validateFn({ data: v }),
    onSuccess: () => { toast.success("Paiement validé"); invalidateAll(); },
    onError: (e: Error) => toast.error(e.message || "Validation impossible"),
  });

  const sendLinkMut = useMutation({
    mutationFn: (v: { orderId: string; paymentLink: string }) => sendLinkFn({ data: v }),
    onSuccess: () => { toast.success("Lien de paiement envoyé au client"); invalidateAll(); },
    onError: (e: Error) => toast.error(e.message || "Envoi impossible"),
  });

  const sendCryptoMut = useMutation({
    mutationFn: (v: { orderId: string; address: string }) =>
      sendCryptoFn({ data: { ...v, currencyName: "Bitcoin", currencyCode: "BTC", network: "Bitcoin (BTC)" } }),
    onSuccess: () => { toast.success("Adresse BTC envoyée au client"); invalidateAll(); },
    onError: (e: Error) => toast.error(e.message || "Envoi impossible"),
  });

  const shipMut = useMutation({
    mutationFn: (v: { orderId: string; carrier: string; trackingNumber: string }) => shipFn({ data: v }),
    onSuccess: () => { toast.success("Notification d'expédition envoyée"); invalidateAll(); },
    onError: (e: Error) => toast.error(e.message || "Envoi impossible"),
  });

  const orders: Order[] = ordersQ.data?.orders ?? [];
  const actionable = orders.filter(
    (o) => o.status === "pending" || o.status === "payment_link_sent" || o.status === "paid",
  );
  const payments = historyQ.data ?? [];

  const pendingTotal = orders
    .filter((o) => o.status === "pending" || o.status === "payment_link_sent")
    .reduce((sum, o) => sum + Number(o.total_eur || 0), 0);
  const received = payments.reduce((sum: number, p: any) => sum + Number(p.amount_eur || 0), 0);

  const stats = [
    { label: "À traiter", value: actionable.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "En attente", value: `${pendingTotal.toFixed(2)} €`, icon: Landmark, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Reçus", value: `${received.toFixed(2)} €`, icon: ArrowDownLeft, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Transactions", value: payments.length, icon: Receipt, color: "text-violet-400", bg: "bg-violet-400/10" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Paiements & expéditions</h2>
        <p className="text-sm text-muted-foreground">
          Envoyez les liens de paiement, validez les règlements et notifiez les expéditions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-3">
              <div className={`flex size-8 items-center justify-center rounded-lg ${s.bg}`}>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <div className="mt-2 text-xl font-bold">{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Commandes à traiter</h3>
        {ordersQ.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
            Chargement…
          </div>
        ) : actionable.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucune commande à traiter.
          </div>
        ) : (
          <div className="space-y-3">
            {actionable.map((o) => (
              <OrderActionCard
                key={o.id}
                order={o}
                pendingLink={sendLinkMut.isPending}
                pendingCrypto={sendCryptoMut.isPending}
                pendingValidate={validateMut.isPending}
                pendingShip={shipMut.isPending}
                onSendLink={(paymentLink) => sendLinkMut.mutate({ orderId: o.id, paymentLink })}
                onSendCrypto={(address) => sendCryptoMut.mutate({ orderId: o.id, address })}
                onValidate={(amount, reference, note) =>
                  validateMut.mutate({ orderId: o.id, amount, reference, note })
                }
                onShip={(carrier, trackingNumber) =>
                  shipMut.mutate({ orderId: o.id, carrier, trackingNumber })
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
            {payments.map((p: any) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-400/10">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {p.orders?.first_name ?? ""} {p.orders?.last_name ?? ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.orders?.order_number ?? p.reference ?? "Réf. indisponible"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{Number(p.amount_eur).toFixed(2)} €</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(p.validated_at).toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {p.method}{p.note ? ` · ${p.note}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderActionCard({
  order,
  pendingLink,
  pendingCrypto,
  pendingValidate,
  pendingShip,
  onSendLink,
  onSendCrypto,
  onValidate,
  onShip,
}: {
  order: Order;
  pendingLink: boolean;
  pendingCrypto: boolean;
  pendingValidate: boolean;
  pendingShip: boolean;
  onSendLink: (paymentLink: string) => void;
  onSendCrypto: (address: string) => void;
  onValidate: (amount: number, reference: string, note: string) => void;
  onShip: (carrier: string, trackingNumber: string) => void;
}) {
  const method = (order.payment_method ?? "bank") as keyof typeof METHOD_META;
  const meta = METHOD_META[method] ?? METHOD_META.bank;
  const MethodIcon = meta.icon;

  const [paymentLink, setPaymentLink] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [amount, setAmount] = useState(String(Number(order.total_eur).toFixed(2)));
  const [reference, setReference] = useState(order.order_number ?? "");
  const [note, setNote] = useState("");
  const [carrier, setCarrier] = useState("Colissimo");
  const [tracking, setTracking] = useState("");

  const statusColor = order.status === "paid"
    ? "border-emerald-400/40 bg-emerald-400/5"
    : order.status === "payment_link_sent"
      ? "border-sky-400/40 bg-sky-400/5"
      : "border-amber-400/40 bg-amber-400/5";
  const statusLabel = order.status === "paid"
    ? "Payée · à expédier"
    : order.status === "payment_link_sent"
      ? "Lien envoyé · en attente de règlement"
      : "Nouvelle commande";

  return (
    <div className={`rounded-xl border ${statusColor} p-4 space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] text-muted-foreground">
            {order.order_number} · {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </div>
          <div className="font-medium truncate">
            {order.first_name} {order.last_name}
          </div>
          <div className="text-xs text-muted-foreground truncate">{order.email}</div>
          <div className="mt-1 inline-flex items-center gap-1.5 text-[11px]">
            <span className={`inline-flex size-5 items-center justify-center rounded ${meta.bg}`}>
              <MethodIcon className={`size-3 ${meta.color}`} />
            </span>
            <span className="text-muted-foreground">{meta.label}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-foreground">{statusLabel}</span>
          </div>
        </div>
        <div className="text-right font-semibold">{Number(order.total_eur).toFixed(2)} €</div>
      </div>

      {/* ───── Étape 1 : envoyer lien / adresse selon méthode (si encore pending) ───── */}
      {order.status === "pending" && method === "card" && (
        <div className="rounded-lg border border-violet-400/30 bg-background p-3 space-y-2">
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <LinkIcon className="size-3.5 text-violet-400" />
            Envoyer le lien de paiement Revolut au client
          </div>
          <input
            value={paymentLink}
            onChange={(e) => setPaymentLink(e.target.value)}
            placeholder="https://checkout.revolut.com/pay/…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <Button
            type="button"
            size="sm"
            className="w-full"
            disabled={pendingLink || !paymentLink}
            onClick={() => onSendLink(paymentLink)}
          >
            {pendingLink ? "Envoi…" : "Envoyer le lien par email"}
          </Button>
        </div>
      )}

      {order.status === "pending" && method === "crypto" && (
        <div className="rounded-lg border border-amber-400/30 bg-background p-3 space-y-2">
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <Bitcoin className="size-3.5 text-amber-400" />
            Envoyer l'adresse Bitcoin au client
          </div>
          <input
            value={cryptoAddress}
            onChange={(e) => setCryptoAddress(e.target.value)}
            placeholder="bc1q… (adresse BTC)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none font-mono"
          />
          <Button
            type="button"
            size="sm"
            className="w-full"
            disabled={pendingCrypto || cryptoAddress.length < 4}
            onClick={() => onSendCrypto(cryptoAddress)}
          >
            {pendingCrypto ? "Envoi…" : "Envoyer l'adresse par email"}
          </Button>
        </div>
      )}

      {/* ───── Étape 2 : marquer comme payée (toutes méthodes, status pending OU link_sent) ───── */}
      {(order.status === "pending" || order.status === "payment_link_sent") && (
        <div className="rounded-lg border border-emerald-400/30 bg-background p-3 space-y-2">
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            Confirmer le paiement reçu
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none"
            />
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Référence"
              className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none"
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note"
              className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full"
            disabled={pendingValidate || !amount}
            onClick={() => onValidate(Number(amount), reference, note)}
          >
            {pendingValidate ? "Validation…" : "Marquer comme payée"}
          </Button>
        </div>
      )}

      {/* ───── Étape 3 : expédier (status paid) ───── */}
      {order.status === "paid" && (
        <div className="rounded-lg border border-sky-400/30 bg-background p-3 space-y-2">
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <Truck className="size-3.5 text-sky-400" />
            Notifier l'expédition au client
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none"
            >
              <option>Colissimo</option>
              <option>Chronopost</option>
              <option>Mondial Relay</option>
              <option>DHL</option>
              <option>UPS</option>
              <option>FedEx</option>
              <option>DPD</option>
              <option>GLS</option>
            </select>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="N° de suivi"
              className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none font-mono"
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="w-full"
            disabled={pendingShip || !tracking}
            onClick={() => onShip(carrier, tracking)}
          >
            <Package className="mr-2 size-3.5" />
            {pendingShip ? "Envoi…" : "Marquer expédiée + envoyer email"}
          </Button>
        </div>
      )}
    </div>
  );
}
