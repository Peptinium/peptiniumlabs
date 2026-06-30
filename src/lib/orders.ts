// Shared order status/payment-method maps used by the admin UI.

export type OrderStatus =
  | "pending"
  | "payment_link_sent"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "bank" | "card" | "crypto" | "other";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente de paiement",
  payment_link_sent: "Lien de paiement envoyé",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  payment_link_sent: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shipped: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  refunded: "bg-muted text-muted-foreground",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank: "Virement bancaire",
  card: "Carte bancaire (lien)",
  crypto: "Crypto-monnaie",
  other: "Autre",
};

export interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_eur: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address_line: string;
  postal_code: string;
  city: string;
  country: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  tracking_number: string | null;
  tracking_carrier: string | null;
  invoice_number: string | null;
  invoice_issued_at: string | null;
  user_id: string | null;
  payment_method: string;
  payment_link: string | null;
  payment_link_sent_at: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  payment_validated_at: string | null;
  payment_validated_by: string | null;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price_eur: number | string;
  line_total_eur: number | string;
  created_at: string;
}

export function formatEUR(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(n) ? n : 0);
}
