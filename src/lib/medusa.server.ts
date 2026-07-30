// Helper serveur Medusa (Admin API) — création de commande + inventaire.
// Utilisé uniquement côté serveur (clé secrète).

const ADMIN = process.env.MEDUSA_URL || "http://127.0.0.1:9000";
const SK = process.env.MEDUSA_SECRET_KEY || "";
const REG = process.env.MEDUSA_REGION_ID || "";
const SC = process.env.MEDUSA_SALES_CHANNEL_ID || "";
const SO = process.env.MEDUSA_SHIPPING_OPTION_ID || "";
const LOC = process.env.MEDUSA_STOCK_LOCATION_ID || "";

function authHeader(): string {
  return "Basic " + Buffer.from(`${SK}:`).toString("base64");
}

async function madmin(path: string, opts: any = {}): Promise<any> {
  const r = await fetch(`${ADMIN}${path}`, {
    ...opts,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`Medusa ${opts.method || "GET"} ${path} ${r.status}: ${body.slice(0, 300)}`);
  }
  if (r.status === 204) return null;
  return await r.json();
}

const norm = (s: any) => String(s || "").toLowerCase().replace(/\s+/g, "");

async function findVariant(slug: string, dosage?: string): Promise<string | null> {
  const d = await madmin(
    `/admin/products?handle=${encodeURIComponent(slug)}&fields=id,variants.id,variants.title`,
  );
  const p = d.products?.[0];
  if (!p) return null;
  const v =
    (dosage && p.variants.find((x: any) => norm(x.title) === norm(dosage))) ||
    (p.variants.length === 1 ? p.variants[0] : null);
  return v ? v.id : null;
}

export type MedusaOrderItem = {
  slug: string;
  dosage?: string;
  quantity: number;
  unitPrice: number;
  title?: string;
  isAccessory?: boolean;
};

export type MedusaShipping = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string | null;
  postal: string;
  city: string;
  phone?: string | null;
  email: string;
};

/** Crée une commande Medusa en brouillon (en attente de paiement). Renvoie son id. */
export async function createMedusaDraftOrder(input: {
  items: MedusaOrderItem[];
  shipping: MedusaShipping;
  ref?: string;
  note?: string | null;
  shippingFee?: number;
  chargeTotal?: number;
  promoCodes?: string[];
  consent?: Record<string, unknown>;
}): Promise<{ orderId: string; displayId: number }> {
  const lineItems: any[] = [];
  for (const it of input.items) {
    // Accessoire / pack : ligne personnalisée (pas de produit Medusa dédié).
    if (it.isAccessory) {
      lineItems.push({
        title: it.title || it.slug,
        unit_price: it.unitPrice,
        quantity: it.quantity,
      });
      continue;
    }
    const variantId = await findVariant(it.slug, it.dosage);
    if (!variantId) throw new Error(`Variante Medusa introuvable : ${it.slug} ${it.dosage ?? ""}`);
    lineItems.push({
      variant_id: variantId,
      quantity: it.quantity,
      unit_price: it.unitPrice,
    });
  }
  const body = {
    email: input.shipping.email,
    region_id: REG,
    sales_channel_id: SC,
    ...(input.promoCodes?.length ? { promo_codes: input.promoCodes } : {}),
    items: lineItems,
    shipping_address: {
      first_name: input.shipping.firstName,
      last_name: input.shipping.lastName,
      address_1: input.shipping.address,
      address_2: input.shipping.address2 || undefined,
      city: input.shipping.city,
      postal_code: input.shipping.postal,
      country_code: "fr",
      phone: input.shipping.phone || undefined,
    },
    shipping_methods: [
      { shipping_option_id: SO, name: "Livraison", amount: input.shippingFee ?? 0 },
    ],
    metadata: {
      source: "peptinium",
      ref: input.ref,
      charge_total: input.chargeTotal ?? null,
      // Preuve d'acceptation RUO + CGV (horodatages, IP, navigateur).
      consent: input.consent ?? null,
      ...(input.note ? { note: input.note } : {}),
    },
  };
  const d = await madmin(`/admin/draft-orders`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return { orderId: d.draft_order.id, displayId: d.draft_order.display_id };
}

/** Au paiement confirmé : décrémente l'inventaire puis convertit en commande. Idempotent. */
export async function completeMedusaOrder(orderId: string): Promise<void> {
  const d = await madmin(
    `/admin/draft-orders/${orderId}?fields=id,status,*items,items.variant.inventory_items.inventory_item_id`,
  ).catch(() => null);
  const order = d?.draft_order;
  // Déjà converti (status != draft) ou introuvable : rien à faire (retry sûr).
  if (!order || order.status !== "draft") return;

  // 1) Décrément d'inventaire (tant que la commande est encore en brouillon).
  for (const it of order.items || []) {
    const qty = Number(it.quantity);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    const inv = it.variant?.inventory_items?.[0]?.inventory_item_id;
    if (!inv) continue;
    const lvl = await madmin(
      `/admin/inventory-items/${inv}/location-levels?fields=stocked_quantity,location_id`,
    );
    const level =
      (lvl.inventory_levels || []).find((l: any) => l.location_id === LOC) ||
      lvl.inventory_levels?.[0];
    if (!level || typeof level.stocked_quantity !== "number") continue;
    const next = Math.max(0, level.stocked_quantity - qty);
    await madmin(`/admin/inventory-items/${inv}/location-levels/${level.location_id}`, {
      method: "POST",
      body: JSON.stringify({ stocked_quantity: next }),
    });
  }

  // 2) Conversion brouillon -> commande (la fait passer dans "Orders").
  await madmin(`/admin/draft-orders/${orderId}/convert-to-order`, { method: "POST" });

  // 3) Marquage payé (Sushipp a confirmé). Secondaire : si ça échoue, la commande
  //    et le stock sont déjà bons — on ne bloque pas.
  try {
    const ord = await madmin(`/admin/orders/${orderId}?fields=total`);
    const total = ord?.order?.total;
    if (typeof total === "number") {
      const pc = await madmin(`/admin/payment-collections`, {
        method: "POST",
        body: JSON.stringify({ order_id: orderId, amount: total }),
      });
      const pcId = pc?.payment_collection?.id;
      if (pcId) {
        await madmin(`/admin/payment-collections/${pcId}/mark-as-paid`, {
          method: "POST",
          body: JSON.stringify({ order_id: orderId }),
        });
      }
    }
  } catch {
    /* marquage payé best-effort */
  }
}

/** Config de livraison depuis Medusa : tarif (prix de l'option) + seuil de gratuité (métadonnées store). */
export async function getShippingConfig(): Promise<{ fee: number; threshold: number }> {
  const [so, store] = await Promise.all([
    madmin(`/admin/shipping-options?fields=id,*prices`).catch(() => null),
    madmin(`/admin/stores?fields=metadata`).catch(() => null),
  ]);
  const opt = (so?.shipping_options || [])[0];
  const price = (opt?.prices || []).find((p: any) => p.currency_code === "eur");
  const fee = Number(price?.amount ?? 0);
  const threshold = Number(
    store?.stores?.[0]?.metadata?.free_shipping_threshold ?? 160,
  );
  return { fee, threshold };
}

/** Valide un code promo depuis les Promotions Medusa (source de vérité). */
export async function validateMedusaPromotion(
  code: string,
): Promise<
  | { valid: false }
  | { valid: true; code: string; rate: number; amountOff: number; freeShipping: boolean }
> {
  const raw = (code || "").trim();
  if (!raw) return { valid: false };
  const d = await madmin(
    `/admin/promotions?limit=100&fields=id,code,status,*application_method`,
  ).catch(() => null);
  const p = (d?.promotions || []).find(
    (x: any) => String(x.code || "").toLowerCase() === raw.toLowerCase(),
  );
  if (!p || p.status !== "active") return { valid: false };
  const am = p.application_method || {};
  const value = Number(am.value ?? 0);
  // Promo ciblant la LIVRAISON (Medusa v2 = "shipping_methods") => port gratuit,
  // et JAMAIS de remise sur les articles.
  if (am.target_type === "shipping_methods" || am.target_type === "shipping") {
    return { valid: true, code: p.code, rate: 0, amountOff: 0, freeShipping: true };
  }
  if (am.type === "percentage") {
    return {
      valid: true,
      code: p.code,
      rate: Math.min(1, value / 100),
      amountOff: 0,
      freeShipping: false,
    };
  }
  // montant fixe (€)
  return { valid: true, code: p.code, rate: 0, amountOff: value, freeShipping: false };
}

/** Résout le customer_id Medusa depuis un email (filtre exact). */
async function findCustomerId(email: string): Promise<string | null> {
  const d = await madmin(
    `/admin/customers?email=${encodeURIComponent(email.toLowerCase())}&fields=id&limit=1`,
  ).catch(() => null);
  return d?.customers?.[0]?.id ?? null;
}

/** Statut de paiement d'une commande Medusa (pour la page de retour). */
export async function getOrderPaidStatus(
  orderId: string,
): Promise<null | { paid: boolean; orderNumber: string }> {
  const d = await madmin(
    `/admin/orders/${orderId}?fields=id,display_id,status,payment_status`,
  ).catch(() => null);
  const o = d?.order;
  if (!o) return null;
  const paid =
    o.payment_status === "captured" || o.payment_status === "partially_captured";
  return {
    paid,
    orderNumber: `PEP-${String(o.display_id ?? "").padStart(5, "0")}`,
  };
}

/** Données pour créer la session de paiement Sushipp (montant à facturer inclus). */
export async function getSushippCheckoutData(
  orderId: string,
): Promise<null | { email: string; orderNumber: string; chargeTotal: number }> {
  // Au moment du paiement la commande est encore un brouillon (convertie au webhook).
  let d = await madmin(
    `/admin/draft-orders/${orderId}?fields=email,display_id,status,metadata`,
  ).catch(() => null);
  let o = d?.draft_order;
  if (!o) {
    d = await madmin(
      `/admin/orders/${orderId}?fields=email,display_id,metadata`,
    ).catch(() => null);
    o = d?.order;
  }
  if (!o) return null;
  return {
    email: o.email,
    orderNumber: `PEP-${String(o.display_id ?? "").padStart(5, "0")}`,
    chargeTotal: Number(o.metadata?.charge_total ?? 0),
  };
}

/** Données d'une commande Medusa pour l'email « paiement confirmé ». */
export async function getOrderEmailData(orderId: string): Promise<null | {
  email: string;
  customerName: string;
  orderNumber: string;
  totalEur: number;
  items: Array<{ name: string; quantity: number; price_eur: number }>;
  shippingAddress: string;
}> {
  const d = await madmin(
    `/admin/orders/${orderId}?fields=email,display_id,total,*items,*shipping_address`,
  ).catch(() => null);
  const o = d?.order;
  if (!o) return null;
  const sa = o.shipping_address || {};
  return {
    email: o.email,
    customerName: [sa.first_name, sa.last_name].filter(Boolean).join(" "),
    orderNumber: `PEP-${String(o.display_id ?? "").padStart(5, "0")}`,
    totalEur: Number(o.total ?? 0),
    items: (o.items || []).map((it: any) => ({
      name: [it.title, it.variant_title].filter(Boolean).join(" ") || it.title || "Article",
      quantity: Number(it.quantity ?? 1),
      price_eur: Number(it.unit_price ?? 0),
    })),
    shippingAddress: [sa.address_1, sa.postal_code, sa.city, sa.country_code]
      .filter(Boolean)
      .join(", "),
  };
}

/** Nombre de commandes Medusa (hors brouillon) pour un email — pour l'éligibilité 1ʳᵉ commande. */
export async function countMedusaOrdersByEmail(email: string): Promise<number> {
  if (!email) return 0;
  const cid = await findCustomerId(email);
  if (!cid) return 0;
  const d = await madmin(
    `/admin/orders?customer_id=${cid}&limit=1&fields=id`,
  ).catch(() => null);
  return Number(d?.count ?? 0);
}

/** Commandes d'un client (par email) au format attendu par la page « mes commandes ». */
export async function getMedusaOrdersForEmail(
  email: string,
): Promise<{ orders: any[]; items: any[] }> {
  if (!email) return { orders: [], items: [] };
  const cid = await findCustomerId(email);
  if (!cid) return { orders: [], items: [] };
  const oFields = encodeURIComponent(
    "id,display_id,status,payment_status,fulfillment_status,total,created_at,*items,*shipping_address",
  );
  const dFields = encodeURIComponent(
    "id,display_id,status,total,created_at,*items,*shipping_address",
  );
  const [ord, drafts] = await Promise.all([
    madmin(`/admin/orders?customer_id=${cid}&limit=100&order=-created_at&fields=${oFields}`).catch(
      () => null,
    ),
    madmin(`/admin/draft-orders?customer_id=${cid}&limit=100&fields=${dFields}`).catch(
      () => null,
    ),
  ]);

  const orders: any[] = [];
  const items: any[] = [];
  const push = (o: any, status: string) => {
    const sa = o.shipping_address || {};
    orders.push({
      id: o.id,
      order_number: `PEP-${String(o.display_id ?? "").padStart(5, "0")}`,
      status,
      total_eur: o.total,
      created_at: o.created_at,
      tracking_number: null,
      invoice_number: null,
      first_name: sa.first_name ?? null,
      last_name: sa.last_name ?? null,
      address_line: sa.address_1 ?? null,
      postal_code: sa.postal_code ?? null,
      city: sa.city ?? null,
      country: sa.country_code ? String(sa.country_code).toUpperCase() : null,
    });
    for (const it of o.items || []) {
      const name = [it.title, it.variant_title].filter(Boolean).join(" ");
      const qty = Number(it.quantity ?? 1);
      const unit = Number(it.unit_price ?? 0);
      items.push({
        id: it.id,
        order_id: o.id,
        product_name: name || it.title || "Article",
        quantity: qty,
        unit_price_eur: unit,
        line_total_eur: Number(it.total ?? unit * qty),
      });
    }
  };

  for (const o of ord?.orders || []) {
    let status = "pending";
    if (o.status === "canceled") status = "cancelled";
    else if (
      ["shipped", "partially_shipped", "delivered", "partially_delivered"].includes(
        o.fulfillment_status,
      )
    )
      status = "shipped";
    else if (o.payment_status === "captured") status = "paid";
    push(o, status);
  }
  for (const d of drafts?.draft_orders || []) {
    if (d.status !== "draft") continue; // les convertis sont déjà dans /orders
    push(d, "pending");
  }

  orders.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return { orders, items };
}
