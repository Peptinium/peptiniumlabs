import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { products as catalogProducts } from "@/data/products";

async function getOptionalUserId(): Promise<string | null> {
  try {
    const auth = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
    if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
    const token = auth.slice(7).trim();
    if (!token) return null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

const itemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  dosage: z.string().min(1).optional(),
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
  paymentMethod: z.enum(["bank", "card", "crypto", "peptidepay"]).default("bank"),
  cryptoCurrency: z.enum(["BTC", "USDC_POLYGON", "LTC"]).optional(),
  promoCode: z.string().trim().max(40).optional().nullable(),
  expectedTotal: z.number().nonnegative().optional(),
});

const SHIPPING_FEE_EUR = 6.0;
const FREE_SHIPPING_THRESHOLD_EUR = 150;

const normalizeDosage = (value: string) => value.toLowerCase().replace(/\s+/g, "").trim();
const roundMoney = (value: number) => Math.round(value * 100) / 100;

function findCatalogVariant(slug: string, dosage?: string, displayName?: string, unitPriceHint?: number) {
  const product = catalogProducts.find((p) => p.slug === slug);
  if (!product) return null;
  const normalizedDosage = dosage ? normalizeDosage(dosage) : "";
  const normalizedName = displayName ? normalizeDosage(displayName) : "";
  const hintedUnit = Number(unitPriceHint);
  const variant =
    product.variants.find((v) => normalizedDosage && normalizeDosage(v.dosage) === normalizedDosage) ??
    product.variants.find((v) => normalizedName.includes(normalizeDosage(v.dosage))) ??
    product.variants.find((v) => Number.isFinite(hintedUnit) && Math.abs(Number(v.price) - hintedUnit) < 0.01) ??
    (product.variants.length === 1 ? product.variants[0] : null);
  if (!variant) return null;
  return { product, variant };
}


export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-price server-side from the same catalog used by the cart, by dosage.
    // This prevents the previous bug where Retatrutide 10 mg was charged as the base 5 mg product price.
    const slugs = data.items.map((i) => i.slug);
    const { data: prods, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id,slug,name,stock,active,product_variants(id,dosage,stock,sold_out)")
      .in("slug", slugs);
    if (prodErr) throw new Error("Erreur produits");
    const bySlug = new Map((prods ?? []).map((p: any) => [p.slug, p]));

    let subtotal = 0;
    const stockUpdates: Array<{
      slug: string;
      productId: string;
      productStock: number;
      variantId: string | null;
      currentVariantStock: number | null;
      quantity: number;
    }> = [];

    const items = data.items.map((i) => {
      const p: any = bySlug.get(i.slug);
      const catalog = findCatalogVariant(i.slug, i.dosage, i.name, i.unitPrice);
      if (!p || !p.active || !catalog) throw new Error(`Produit indisponible : ${i.slug}`);

      const variantRows = Array.isArray(p.product_variants) ? p.product_variants : [];
      const variantRow = variantRows.find(
        (v: any) => normalizeDosage(String(v.dosage ?? "")) === normalizeDosage(catalog.variant.dosage),
      );
      const stock = variantRow ? Number(variantRow.stock ?? 0) : Number(p.stock ?? 0);
      if (catalog.variant.soldOut || variantRow?.sold_out || stock < i.quantity) {
        throw new Error(`Stock insuffisant pour ${catalog.product.name} ${catalog.variant.dosage}`);
      }

      const unit = Number(catalog.variant.price);
      const line = roundMoney(unit * i.quantity);
      subtotal = roundMoney(subtotal + line);
      stockUpdates.push({
        slug: i.slug,
        productId: String(p.id),
        productStock: Number(p.stock ?? 0),
        variantId: variantRow?.id ? String(variantRow.id) : null,
        currentVariantStock: variantRow ? Number(variantRow.stock ?? 0) : null,
        quantity: i.quantity,
      });
      return {
        product_slug: i.slug,
        product_name: `${catalog.product.name} ${catalog.variant.dosage}`.trim(),
        quantity: i.quantity,
        unit_price_eur: unit,
        line_total_eur: line,
      };
    });

    // Server-side promo code validation (fetch first — may unlock free shipping)
    let discount = 0;
    let appliedPromoCode: string | null = null;
    let promoFreeShipping = false;
    if (data.promoCode && data.promoCode.trim().length > 0) {
      const code = data.promoCode.trim().toUpperCase();
      const { data: promo } = await supabaseAdmin
        .from("promo_codes")
        .select("code,rate,amount_off_eur,free_shipping,active")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();
      if (promo) {
        const rateDiscount = roundMoney(subtotal * Number(promo.rate ?? 0));
        const amountOff = roundMoney(Number(promo.amount_off_eur ?? 0));
        discount = Math.min(subtotal, roundMoney(rateDiscount + amountOff));
        appliedPromoCode = promo.code;
        promoFreeShipping = !!promo.free_shipping;
      }
    }

    // Server-side shipping fee (cannot be tampered by the client)
    const shippingFee = promoFreeShipping
      ? 0
      : subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD_EUR
        ? 0
        : SHIPPING_FEE_EUR;

    const total = roundMoney(Math.max(0, subtotal - discount + shippingFee));

    if (data.expectedTotal !== undefined && Math.abs(roundMoney(data.expectedTotal) - total) > 0.01) {
      throw new Error("Le montant du panier a changé. Actualisez le panier avant de payer.");
    }

    const userId = await getOptionalUserId();

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
        user_id: userId,
        payment_method: data.paymentMethod,
      })
      .select("id, order_number, total_eur, payment_method")
      .single();
    if (orderErr || !order) throw new Error("Création commande échouée");

    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));
    if (itemsErr) throw new Error("Articles non enregistrés");

    // Decrement stock on the ordered dosage, then keep product aggregate stock in sync.
    for (const update of stockUpdates) {
      if (update.variantId && update.currentVariantStock !== null) {
        const nextVariantStock = Math.max(0, update.currentVariantStock - update.quantity);
        await supabaseAdmin
          .from("product_variants")
          .update({ stock: nextVariantStock, sold_out: nextVariantStock <= 0 })
          .eq("id", update.variantId);
      }

      const { data: variantsAfter } = await supabaseAdmin
        .from("product_variants")
        .select("stock")
        .eq("product_id", update.productId);

      const nextProductStock =
        variantsAfter && variantsAfter.length > 0
          ? variantsAfter.reduce((sum: number, v: any) => sum + Number(v.stock ?? 0), 0)
          : Math.max(0, update.productStock - update.quantity);

      await supabaseAdmin
        .from("products")
        .update({ stock: nextProductStock })
        .eq("slug", update.slug);
    }

    // ─── Auto-create payment resource (link or crypto intent) BEFORE the email ───
    let peptidePayUrl: string | null = null;
    let cryptoDetails: {
      currency: string;
      label: string;
      network: string;
      walletAddress: string;
      amountCrypto: number;
      amountCryptoFormatted: string;
      unit: string;
      paymentUri: string;
      expiresAt: string;
    } | null = null;

    if (data.paymentMethod === "peptidepay") {
      try {
        const { createPeptidePaySession } = await import("./peptidepay.server");
        const origin = "https://peptinium.com";
        const session = await createPeptidePaySession({
          amountCents: Math.round(total * 100),
          currency: "EUR",
          customerEmail: data.shipping.email,
          productName: `Commande ${order.order_number}`,
          metadata: { order_id: order.id, order_number: order.order_number },
          successUrl: `${origin}/mon-compte?order=${order.order_number}`,
          cancelUrl: `${origin}/panier`,
          idempotencyKey: `order-${order.id}`,
        });
        peptidePayUrl = session.url;
        await supabaseAdmin
          .from("orders")
          .update({
            payment_link: session.url,
            payment_link_sent_at: new Date().toISOString(),
          })
          .eq("id", order.id);
      } catch (e) {
        console.error("peptidepay auto-create failed", e);
      }
    } else if (data.paymentMethod === "crypto" && data.cryptoCurrency) {
      try {
        const mod = await import("./crypto-payments.server");
        const address = mod.getWalletAddress(data.cryptoCurrency);
        const rate = await mod.fetchEurRate(data.cryptoCurrency);
        const amountCrypto = mod.computeUniqueAmount(total, rate, data.cryptoCurrency, order.id);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        const { data: inserted } = await supabaseAdmin
          .from("crypto_payments")
          .insert({
            order_id: order.id,
            currency: data.cryptoCurrency,
            wallet_address: address,
            amount_eur: total,
            rate_eur_per_unit: rate,
            amount_crypto: amountCrypto,
            status: "pending",
            expires_at: expiresAt,
          })
          .select("*")
          .single();
        if (inserted) {
          const meta = mod.CRYPTO_META[data.cryptoCurrency];
          cryptoDetails = {
            currency: data.cryptoCurrency,
            label: meta.label,
            network: meta.network,
            walletAddress: address,
            amountCrypto,
            amountCryptoFormatted: mod.formatCryptoAmount(amountCrypto, data.cryptoCurrency),
            unit: meta.unit,
            paymentUri: mod.buildPaymentUri(data.cryptoCurrency, address, amountCrypto),
            expiresAt,
          };
        }
      } catch (e) {
        console.error("crypto auto-create failed", e);
      }
    }

    // NOTE: Admin push + admin email are intentionally NOT sent here.
    // They fire from the payment webhooks (PeptidePay / crypto watcher) once
    // the payment is actually received — see src/lib/order-notify.server.ts.

    // Customer "order received" — includes the payment link / crypto details when available
    try {
      const { enqueueAppEmail } = await import("./email/enqueue.server");
      await enqueueAppEmail({
        templateName: "order-pending",
        recipientEmail: data.shipping.email,
        idempotencyKey: `order-pending-${order.id}`,
        templateData: {
          customerName: `${data.shipping.firstName} ${data.shipping.lastName}`.trim(),
          orderNumber: order.order_number,
          totalEur: Number(order.total_eur),
          paymentMethod: data.paymentMethod,
          paymentLink: peptidePayUrl,
          crypto: cryptoDetails,
          items: items.map((i) => ({
            name: i.product_name,
            quantity: i.quantity,
            price_eur: Number(i.unit_price_eur),
          })),
        },
      });
    } catch (e) {
      console.error("order-pending email failed", e);
    }

    // Admin notification is sent from the payment webhook / crypto watcher
    // when the payment is confirmed — not at order creation.

    return {
      orderId: order.id as string,
      orderNumber: order.order_number as string,
      total: Number(order.total_eur),
      paymentMethod: order.payment_method as string,
    };
  });

// Public: validate a promo code (returns rate if active, otherwise null)
export const validatePromoCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().trim().min(1).max(40) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code = data.code.trim().toUpperCase();
    const { data: promo } = await supabaseAdmin
      .from("promo_codes")
      .select("code,rate,amount_off_eur,free_shipping,active")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();
    if (!promo) return { valid: false as const };
    return {
      valid: true as const,
      code: promo.code,
      rate: Number(promo.rate ?? 0),
      amountOff: Number(promo.amount_off_eur ?? 0),
      freeShipping: !!promo.free_shipping,
    };
  });


// ─────── Admin server functions ───────


export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
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

export const deleteOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin) throw new Error("Accès refusé");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("order_items").delete().eq("order_id", data.id);
    const { error } = await supabaseAdmin.from("orders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
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
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
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
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
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
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
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

// NOTE: The public "claim admin" bootstrap endpoint has been removed for
// security reasons. Admin roles must be granted directly via the database
// (INSERT INTO public.user_roles ...) — never via a client-callable endpoint.

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    return { isAdmin: !!roleRow, userId };
  });
