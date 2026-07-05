import { createFileRoute } from "@tanstack/react-router";
import { verifyPeptidePaySignature } from "@/lib/peptidepay.server";

type PeptidePayEvent = {
  event: string;
  session_id: string;
  order_id?: string;
  metadata?: { order_id?: string; order_number?: string } & Record<string, unknown>;
  address_in?: string;
  status: string;
  amount: number;
  currency: string;
  txid?: string;
  paid_at?: string;
  attempt?: number;
};


export const Route = createFileRoute("/api/public/peptidepay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Read the RAW body BEFORE any JSON parsing.
        const rawBody = await request.text();
        const signature = request.headers.get("x-peptidepay-signature");

        // 2. Signature verification. If PEPTIDEPAY_WEBHOOK_SECRET is set,
        //    the header is REQUIRED and must match. Wallet-only unsigned
        //    fallback is not enabled here — set the secret in Peptinium's
        //    PeptidePay dashboard.
        if (!verifyPeptidePaySignature(rawBody, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: PeptidePayEvent;
        try {
          event = JSON.parse(rawBody) as PeptidePayEvent;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        if (event.status !== "paid" && event.event !== "order.paid") {
          // Not a settlement event — acknowledge to stop retries.
          return new Response("ok", { status: 200 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const orderId = event.order_id;
        if (!orderId) {
          return new Response("Missing order_id", { status: 400 });
        }

        const { data: order, error: readErr } = await supabaseAdmin
          .from("orders")
          .select("id, status, total_eur")
          .eq("id", orderId)
          .maybeSingle();

        if (readErr) {
          return new Response("DB error", { status: 500 });
        }
        if (!order) {
          // Unknown order — ack to stop retries, log server-side.
          console.warn("[peptidepay-webhook] unknown order", orderId);
          return new Response("ok", { status: 200 });
        }

        // Idempotency: already paid → ack.
        if (order.status === "paid") {
          return new Response("ok", { status: 200 });
        }

        // Sanity check the amount (cents).
        const expectedCents = Math.round(Number(order.total_eur) * 100);
        if (event.amount !== expectedCents) {
          console.warn(
            "[peptidepay-webhook] amount mismatch",
            orderId,
            event.amount,
            expectedCents,
          );
          return new Response("Amount mismatch", { status: 400 });
        }

        const paidAt = event.paid_at ?? new Date().toISOString();

        const { error: updErr } = await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            paid_at: paidAt,
            payment_method: "peptidepay",
            payment_validated_at: paidAt,
          })
          .eq("id", orderId)
          .neq("status", "paid"); // race-safe idempotency

        if (updErr) {
          return new Response("DB update failed", { status: 500 });
        }

        // Best-effort payment log.
        try {
          await supabaseAdmin.from("payments").insert({
            order_id: orderId,
            method: "peptidepay",
            amount_eur: event.amount / 100,
            reference: event.txid ?? event.session_id,
            validated_at: paidAt,
            note: `PeptidePay ${event.currency} · session ${event.session_id}`,
          });
        } catch (e) {
          console.error("[peptidepay-webhook] payments insert failed", e);
        }

        // Notify admins now that the payment is actually confirmed.
        try {
          const { notifyAdminsOrderPaid } = await import("@/lib/order-notify.server");
          await notifyAdminsOrderPaid(orderId);
        } catch (e) {
          console.error("[peptidepay-webhook] notify failed", e);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
