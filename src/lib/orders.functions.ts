import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { products as catalogProducts } from "@/data/products";

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
  cryptoCurrency: z.enum(["BTC", "USDC_POLYGON", "USDT_POLYGON"]).optional(),
  promoCode: z.string().trim().max(40).optional().nullable(),
  expectedTotal: z.number().nonnegative().optional(),
  // Preuve d'acceptation (certification RUO + CGV), horodatée côté client.
  consent: z
    .object({
      ruoAcceptedAt: z.string().max(40).optional().nullable(),
      cgvAcceptedAt: z.string().max(40).optional().nullable(),
    })
    .optional(),
});

const SHIPPING_FEE_EUR = 3.90;
const FREE_SHIPPING_THRESHOLD_EUR = 160;

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

const EAU_OFFERTE_SLUG = "eau-bacteriostatique-3ml-offerte";
const EAU_OFFERTE_PRICE_PAID = 4.90;

async function getOptionalUserEmail(): Promise<{ userId: string | null; email: string | null }> {
  try {
    const auth = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
    if (!auth || !auth.toLowerCase().startsWith("bearer ")) return { userId: null, email: null };
    const token = auth.slice(7).trim();
    if (!token) return { userId: null, email: null };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.auth.getUser(token);
    return { userId: data.user?.id ?? null, email: (data.user?.email ?? "").toLowerCase() || null };
  } catch {
    return { userId: null, email: null };
  }
}

async function isFirstOrderEligible(_userId: string | null, email: string | null): Promise<boolean> {
  if (!email) return true;
  const { countMedusaOrdersByEmail } = await import("./medusa.server");
  const count = await countMedusaOrdersByEmail(email);
  return count === 0;
}

export const getFreeWaterEligibility = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().email().optional().nullable() }).parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const { userId, email } = await getOptionalUserEmail();
    const effectiveEmail = email ?? (data.email ? data.email.toLowerCase() : null);
    const eligible = await isFirstOrderEligible(userId, effectiveEmail);
    return { eligible, paidPrice: EAU_OFFERTE_PRICE_PAID };
  });




export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-price server-side from the same catalog used by the cart, by dosage.
    // This prevents the previous bug where Retatrutide 10 mg was charged as the base 5 mg product price.
    const { findAccessory } = await import("@/data/accessories");
    let subtotal = 0;
    const items = data.items.map((i) => {
      // 1) Peptide (catalogue principal)
      const catalog = findCatalogVariant(i.slug, i.dosage, i.name, i.unitPrice);
      if (catalog) {
        if (catalog.variant.soldOut) {
          throw new Error(`Stock insuffisant pour ${catalog.product.name} ${catalog.variant.dosage}`);
        }
        const unit = Number(catalog.variant.promoPrice ?? catalog.variant.price);
        const line = roundMoney(unit * i.quantity);
        subtotal = roundMoney(subtotal + line);
        return {
          product_slug: i.slug,
          dosage: catalog.variant.dosage as string | undefined,
          product_name: `${catalog.product.name} ${catalog.variant.dosage}`.trim(),
          quantity: i.quantity,
          unit_price_eur: unit,
          line_total_eur: line,
          is_accessory: false,
        };
      }
      // 2) Accessoire / pack (catalogue séparé)
      const acc = findAccessory(i.slug);
      if (acc) {
        const unit = Number(acc.priceEUR);
        const line = roundMoney(unit * i.quantity);
        subtotal = roundMoney(subtotal + line);
        return {
          product_slug: i.slug,
          dosage: undefined as string | undefined,
          product_name: acc.name,
          quantity: i.quantity,
          unit_price_eur: unit,
          line_total_eur: line,
          is_accessory: true,
        };
      }
      throw new Error(`Produit indisponible : ${i.slug}`);
    });


    // Validation code promo côté serveur depuis les Promotions Medusa.
    let discount = 0;
    let appliedPromoCode: string | null = null;
    let promoFreeShipping = false;
    if (data.promoCode && data.promoCode.trim().length > 0) {
      const { validateMedusaPromotion } = await import("./medusa.server");
      const m = await validateMedusaPromotion(data.promoCode.trim());
      if (m.valid) {
        const rateDiscount = roundMoney(subtotal * m.rate);
        const amountOff = roundMoney(m.amountOff);
        discount = Math.min(subtotal, roundMoney(rateDiscount + amountOff));
        appliedPromoCode = m.code;
        promoFreeShipping = m.freeShipping;
      }
    }

    // Frais de livraison depuis Medusa (tarif de l'option + seuil de gratuité).
    const { getShippingConfig } = await import("./medusa.server");
    const shipCfg = await getShippingConfig();
    const shippingFee = promoFreeShipping
      ? 0
      : subtotal === 0 || subtotal >= shipCfg.threshold
        ? 0
        : shipCfg.fee;

    const total = roundMoney(Math.max(0, subtotal - discount + shippingFee));

    if (data.expectedTotal !== undefined && Math.abs(roundMoney(data.expectedTotal) - total) > 0.01) {
      throw new Error("Le montant du panier a changé. Actualisez le panier avant de payer.");
    }

    // Commande créée dans Medusa (source de vérité). L'inventaire est décrémenté
    // à la confirmation de paiement (webhook Sushipp) via completeMedusaOrder.
    const { createMedusaDraftOrder } = await import("./medusa.server");
    const medusaOrder = await createMedusaDraftOrder({
      items: items.map((i) => ({
        slug: i.product_slug,
        dosage: i.dosage,
        quantity: i.quantity,
        unitPrice: i.unit_price_eur,
        title: i.product_name,
        isAccessory: i.is_accessory,
      })),
      shipping: {
        firstName: data.shipping.firstName,
        lastName: data.shipping.lastName,
        address:
          data.shipping.address +
          (data.shipping.address2 ? `, ${data.shipping.address2}` : ""),
        postal: data.shipping.postal,
        city: data.shipping.city,
        phone: data.shipping.phone ?? null,
        email: data.shipping.email,
      },
      note: data.shipping.notes ?? null,
      shippingFee,
      chargeTotal: total,
      promoCodes: appliedPromoCode ? [appliedPromoCode] : undefined,
      // Preuve d'acceptation : horodatages client + éléments serveur (non falsifiables).
      consent: {
        ruo_accepted_at: data.consent?.ruoAcceptedAt ?? null,
        cgv_accepted_at: data.consent?.cgvAcceptedAt ?? null,
        recorded_at: new Date().toISOString(),
        ip:
          (getRequestHeader("x-forwarded-for") || "").split(",")[0].trim() ||
          getRequestHeader("x-real-ip") ||
          null,
        user_agent: getRequestHeader("user-agent") || null,
      },
    });
    const order = {
      id: medusaOrder.orderId,
      order_number: `PEP-${String(medusaOrder.displayId).padStart(5, "0")}`,
      total_eur: total,
      payment_method: data.paymentMethod,
    };

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

    // Le paiement Sushipp (session + cookie de retour) est créé par
    // createSushippCheckout, appelé par le panier après placeOrder.
    if (data.paymentMethod === "crypto" && data.cryptoCurrency) {
      try {
        const mod = await import("./crypto-payments.server");
        const address = mod.getWalletAddress(data.cryptoCurrency);
        const rate = await mod.fetchEurRate(data.cryptoCurrency);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        // Le montant identifie la commande sur la chaîne : il doit être unique
        // parmi les factures ouvertes. On relit les montants réservés à chaque
        // tentative, l'index unique tranchant les courses (Postgres 23505).
        let inserted: Record<string, unknown> | null = null;
        let amountCrypto = 0;

        for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
          const { data: openRows } = await supabaseAdmin
            .from("crypto_payments")
            .select("amount_crypto")
            .eq("currency", data.cryptoCurrency)
            .in("status", ["pending", "detected"]);

          amountCrypto = mod.allocateUniqueAmount(
            total,
            rate,
            data.cryptoCurrency,
            (openRows ?? []).map((r) => Number(r.amount_crypto)),
          );

          const { data: row, error: insErr } = await supabaseAdmin
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

          if (!insErr && row) {
            inserted = row;
            break;
          }
          if (insErr && (insErr as { code?: string }).code !== "23505") {
            console.error("[placeOrder] insertion crypto impossible", insErr);
            break;
          }
        }

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

    // Admin notification for NEW pending order (email + push).
    // A second notification fires from the payment webhooks once the payment
    // is actually received — see src/lib/order-notify.server.ts.
    try {
      const { broadcastToAdmins } = await import("./push.server");
      await broadcastToAdmins({
        title: "Nouvelle commande 🆕",
        body: `${order.order_number} · ${Number(order.total_eur).toFixed(2)} € · ${data.paymentMethod}`,
        url: "/admin/paiements",
        tag: `order-new-${order.id}`,
      });
    } catch (e) {
      console.error("admin push (new order) failed", e);
    }
    // Pas d'email admin a la creation (statut pending) : le template
    // admin-new-order dit "Commande payee" et ne doit partir qu'au
    // PAIEMENT reel (via notifyAdminsOrderPaid / sushipp-webhook).


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
    const { validateMedusaPromotion } = await import("./medusa.server");
    const m = await validateMedusaPromotion(data.code.trim());
    if (!m.valid) return { valid: false as const };
    return {
      valid: true as const,
      code: m.code,
      rate: m.rate,
      amountOff: m.amountOff,
      freeShipping: m.freeShipping,
      fixedTotal: undefined as number | undefined,
    };
  });

// Config de livraison (tarif + seuil de gratuité) depuis Medusa, pour le panier.
export const getShippingConfigFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getShippingConfig } = await import("./medusa.server");
    return await getShippingConfig();
  },
);


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
        status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
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
