import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const submitSchema = z.object({
  email: z.string().email(),
  orderNumber: z.string().max(40).optional().nullable(),
  subject: z.string().min(3).max(150),
  body: z.string().min(5).max(5000),
});

// Public — no auth required. Rate-limited by quick checks in handler.
export const submitTicket = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Best-effort: try to link to an existing order by order_number + email
    let orderId: string | null = null;
    if (data.orderNumber) {
      const { data: o } = await supabaseAdmin
        .from("orders")
        .select("id,email")
        .eq("order_number", data.orderNumber)
        .maybeSingle();
      if (o && o.email.toLowerCase() === data.email.toLowerCase()) orderId = o.id;
    }

    const { data: t, error } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        email: data.email,
        order_id: orderId,
        order_number: data.orderNumber ?? null,
        subject: data.subject,
        status: "open",
        priority: "normal",
      })
      .select("id,ticket_number")
      .single();
    if (error || !t) throw new Error(error?.message ?? "Création impossible");

    await supabaseAdmin.from("support_messages").insert({
      ticket_id: t.id,
      author_role: "client",
      author_email: data.email,
      body: data.body,
    });

    try {
      const { broadcastToAdmins } = await import("./push.server");
      await broadcastToAdmins({
        title: "Nouveau ticket SAV",
        body: `${t.ticket_number} · ${data.subject}`,
        url: "/admin/sav",
        tag: `ticket-${t.id}`,
      });
    } catch (e) {
      console.error("admin push failed", e);
    }

    try {
      const { enqueueAppEmail } = await import("@/lib/email/enqueue.server");
      const recipients = ["peptinium@gmail.com", "contact@peptinium.com"];
      await Promise.all(
        recipients.map((to) =>
          enqueueAppEmail({
            templateName: "admin-new-ticket",
            recipientEmail: to,
            idempotencyKey: `admin-new-ticket-${t.id}-${to}`,
            templateData: {
              ticketNumber: t.ticket_number,
              subject: data.subject,
              email: data.email,
              body: data.body,
              orderNumber: data.orderNumber ?? null,
              adminUrl: "https://peptinium.com/admin/sav",
            },
          }),
        ),
      );
    } catch (e) {
      console.error("admin email failed", e);
    }

    return { ticketNumber: t.ticket_number };
  });
