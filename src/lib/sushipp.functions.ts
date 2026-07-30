import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

// L'id est un identifiant de commande Medusa (ex. "order_01..."), pas un uuid.
const inputSchema = z.object({ orderId: z.string().min(1) });

/**
 * Crée une session de paiement hébergée Sushipp pour une commande Medusa.
 * Le montant est relu côté serveur depuis la commande Medusa (metadata.charge_total)
 * — le client ne fournit jamais le prix.
 */
export const createSushippCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const { getSushippCheckoutData } = await import("./medusa.server");
    const { createSushippSession } = await import("./sushipp.server");

    const od = await getSushippCheckoutData(data.orderId);
    if (!od) throw new Error("Commande introuvable.");
    if (!od.chargeTotal || od.chargeTotal <= 0) {
      throw new Error("Montant de commande invalide.");
    }

    const origin = "https://peptinium.com";
    const session = await createSushippSession({
      amountCents: Math.round(od.chargeTotal * 100),
      currency: "EUR",
      customerEmail: od.email ?? undefined,
      productName: `Commande ${od.orderNumber}`,
      metadata: { order_id: data.orderId, order_number: od.orderNumber },
      successUrl: `${origin}/retour-paiement`,
      cancelUrl: `${origin}/panier`,
      idempotencyKey: `order-${data.orderId}`,
    });

    // Shopify ne renvoie pas la commande au retour : on mémorise l'id Medusa,
    // que /retour-paiement utilise pour VÉRIFIER le paiement avant de confirmer.
    setCookie("pep_last_order", data.orderId, {
      maxAge: 3600,
      sameSite: "Lax",
      path: "/",
      httpOnly: true,
    });

    return { url: session.url, id: session.id };
  });
