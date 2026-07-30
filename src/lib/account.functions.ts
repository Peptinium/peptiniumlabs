import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  first_name: z.string().trim().max(80).nullable().optional(),
  last_name: z.string().trim().max(80).nullable().optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  address_line: z.string().trim().max(200).nullable().optional(),
  address_line2: z.string().trim().max(200).nullable().optional(),
  postal_code: z.string().trim().max(20).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  country: z.string().trim().max(80).nullable().optional(),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    return {
      profile: data ?? null,
      email: (context.claims as any)?.email ?? null,
      userId: context.userId,
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => profileSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: context.userId, ...data }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = ((context.claims as any)?.email ?? "").toString().toLowerCase();
    let query = supabaseAdmin
      .from("orders")
      .select("id, order_number, status, total_eur, created_at, tracking_number, invoice_number, address_line, postal_code, city, country, first_name, last_name")
      .order("created_at", { ascending: false });
    if (email) {
      query = query.or(`user_id.eq.${context.userId},email.eq.${email}`);
    } else {
      query = query.eq("user_id", context.userId);
    }
    const { data: orders, error } = await query;
    if (error) throw new Error(error.message);
    const ids = (orders ?? []).map((o) => o.id);
    const { data: items } = ids.length
      ? await supabaseAdmin.from("order_items").select("*").in("order_id", ids)
      : { data: [] as any[] };
    // Best-effort: backfill user_id for legacy guest orders with matching email
    if (email) {
      await supabaseAdmin
        .from("orders")
        .update({ user_id: context.userId })
        .is("user_id", null)
        .eq("email", email);
    }
    return { orders: orders ?? [], items: items ?? [] };
  });

export const listMyTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = ((context.claims as any)?.email ?? "").toString().toLowerCase();
    let q = supabaseAdmin
      .from("support_tickets")
      .select("id, ticket_number, subject, status, priority, created_at, order_number")
      .order("created_at", { ascending: false });
    if (email) {
      q = q.or(`user_id.eq.${context.userId},email.eq.${email}`);
    } else {
      q = q.eq("user_id", context.userId);
    }
    const { data: tickets, error } = await q;
    if (error) throw new Error(error.message);
    const ids = (tickets ?? []).map((t) => t.id);
    const { data: messages } = ids.length
      ? await supabaseAdmin
          .from("support_messages")
          .select("id, ticket_id, author_role, body, created_at")
          .in("ticket_id", ids)
          .order("created_at", { ascending: true })
      : { data: [] as any[] };
    if (email) {
      await supabaseAdmin
        .from("support_tickets")
        .update({ user_id: context.userId })
        .is("user_id", null)
        .eq("email", email);
    }
    return { tickets: tickets ?? [], messages: messages ?? [] };
  });

const newTicketSchema = z.object({
  subject: z.string().trim().min(3).max(140),
  body: z.string().trim().min(5).max(4000),
  order_number: z.string().trim().max(40).optional().nullable(),
});

export const createMyTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => newTicketSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = ((context.claims as any)?.email ?? "").toString();
    const ticketNumber = `T-${Date.now().toString(36).toUpperCase()}`;
    const { data: ticket, error } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        ticket_number: ticketNumber,
        email,
        subject: data.subject,
        status: "open",
        priority: "normal",
        order_number: data.order_number ?? null,
        user_id: context.userId,
      })
      .select("id, ticket_number")
      .single();
    if (error || !ticket) throw new Error(error?.message ?? "Création ticket échouée");
    await supabaseAdmin.from("support_messages").insert({
      ticket_id: ticket.id,
      author_role: "customer",
      author_email: email,
      body: data.body,
    });
    return { id: ticket.id, ticket_number: ticket.ticket_number };
  });

const replySchema = z.object({
  ticket_id: z.string().uuid(),
  body: z.string().trim().min(1).max(4000),
});

export const replyMyTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => replySchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = ((context.claims as any)?.email ?? "").toString().toLowerCase();
    const { data: ticket } = await supabaseAdmin
      .from("support_tickets")
      .select("id, user_id, email")
      .eq("id", data.ticket_id)
      .maybeSingle();
    if (
      !ticket ||
      (ticket.user_id !== context.userId &&
        (ticket.email ?? "").toLowerCase() !== email)
    ) {
      throw new Error("Ticket introuvable");
    }
    const { error } = await supabaseAdmin.from("support_messages").insert({
      ticket_id: ticket.id,
      author_role: "customer",
      author_email: (context.claims as any)?.email ?? null,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    await supabaseAdmin
      .from("support_tickets")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", ticket.id);
    return { ok: true };
  });
