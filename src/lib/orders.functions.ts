import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const itemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

const placeOrderSchema = z.object({
  shipping: z.object({
    email: z.string().email(),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    phone: z.string().max(40).optional().nullable(),
    address: z.string().min(1).max(200),
    address2: z.string().max(200).optional().nullable(),
    postal: z.string().min(1).max(20),
    city: z.string().min(1).max(100),
    country: z.string().min(1).max(80),
    notes: z.string().max(1000).optional().nullable(),
  }),
  items: z.array(itemSchema).min(1).max(50),
  shippingFee: z.number().nonnegative(),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-price server-side from products table to prevent tampering
    const slugs = data.items.map((i) => i.slug);
    const { data: prods, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("slug,name,price_eur,stock,active")
      .in("slug", slugs);
    if (prodErr) throw new Error("Erreur produits");
    const bySlug = new Map((prods ?? []).map((p) => [p.slug, p]));

    let subtotal = 0;
    const items = data.items.map((i) => {
      const p = bySlug.get(i.slug);
      if (!p || !p.active) throw new Error(`Produit indisponible : ${i.slug}`);
      if (p.stock < i.quantity)
        throw new Error(`Stock insuffisant pour ${p.name}`);
      const unit = Number(p.price_eur);
      const line = unit * i.quantity;
      subtotal += line;
      return {
        product_slug: i.slug,
        product_name: p.name,
        quantity: i.quantity,
        unit_price_eur: unit,
        line_total_eur: line,
      };
    });

    const total = subtotal + data.shippingFee;

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        status: "pending",
        total_eur: total,
        first_name: data.shipping.firstName,
        last_name: data.shipping.lastName,
        email: data.shipping.email,
        phone: data.shipping.phone ?? null,
        address_line:
          data.shipping.address +
          (data.shipping.address2 ? `, ${data.shipping.address2}` : ""),
        postal_code: data.shipping.postal,
        city: data.shipping.city,
        country: data.shipping.country,
        notes: data.shipping.notes ?? null,
      })
      .select("id, order_number, total_eur")
      .single();
    if (orderErr || !order) throw new Error("Création commande échouée");

    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));
    if (itemsErr) throw new Error("Articles non enregistrés");

    // Decrement stock
    for (const i of data.items) {
      const p = bySlug.get(i.slug)!;
      await supabaseAdmin
        .from("products")
        .update({ stock: p.stock - i.quantity })
        .eq("slug", i.slug);
    }

    return {
      orderNumber: order.order_number as string,
      total: Number(order.total_eur),
    };
  });

// ─────── Admin server functions ───────

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Accès refusé");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: items } = await supabaseAdmin.from("order_items").select("*");
    return {
      orders: orders ?? [],
      items: items ?? [],
    };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "paid", "shipped", "cancelled"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listProductsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("name");
    return data ?? [];
  });

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        stock: z.number().int().min(0).optional(),
        active: z.boolean().optional(),
        price_eur: z.number().nonnegative().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { stock?: number; active?: boolean; price_eur?: number } = {};
    if (data.stock !== undefined) patch.stock = data.stock;
    if (data.active !== undefined) patch.active = data.active;
    if (data.price_eur !== undefined) patch.price_eur = data.price_eur;
    const { error } = await supabaseAdmin
      .from("products")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Bootstrap: lets the first signed-in user claim the admin role
// if no admin exists yet. Safe one-shot for initial setup.
export const claimAdminIfNone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) {
      // Already an admin, check if it's me
      const { data: mine } = await supabaseAdmin
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      return { isAdmin: !!mine, granted: false };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { isAdmin: true, granted: true };
  });

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    return { isAdmin: !!data, userId };
  });
