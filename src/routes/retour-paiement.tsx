import { createFileRoute } from "@tanstack/react-router";
import { getCookie, deleteCookie } from "@tanstack/react-start/server";

/**
 * GET /retour-paiement
 *
 * Point d'atterrissage après un passage sur la boutique Shopify.
 * Le cookie `pep_last_order` contient l'id de la commande Medusa.
 *
 * On NE confirme jamais sans vérifier : on interroge Medusa pour savoir si le
 * paiement a réellement été encaissé (le client peut arriver ici simplement en
 * cliquant sur le logo de la boutique, sans avoir payé).
 */
export const Route = createFileRoute("/retour-paiement")({
  server: {
    handlers: {
      GET: async () => {
        const base = "https://peptinium.com";
        const redirect = (to: string) =>
          new Response(null, { status: 302, headers: { Location: to } });

        const orderId = getCookie("pep_last_order");
        if (!orderId) return redirect(`${base}/panier`);

        const { getOrderPaidStatus } = await import("@/lib/medusa.server");
        const st = await getOrderPaidStatus(orderId).catch(() => null);
        if (!st) {
          deleteCookie("pep_last_order", { path: "/" });
          return redirect(`${base}/panier`);
        }

        if (st.paid) {
          // Paiement encaissé : cookie à usage unique.
          deleteCookie("pep_last_order", { path: "/" });
          return redirect(
            `${base}/confirmation/${encodeURIComponent(st.orderNumber)}`,
          );
        }

        // Paiement pas (encore) confirmé : on garde le cookie — le client peut
        // revenir une fois le webhook passé — et on l'informe honnêtement.
        return redirect(
          `${base}/confirmation/${encodeURIComponent(st.orderNumber)}?statut=attente`,
        );
      },
    },
  },
});
