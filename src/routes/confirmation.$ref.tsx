import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/confirmation/$ref")({
  validateSearch: (search: Record<string, unknown>) => ({
    statut: search.statut === "attente" ? ("attente" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Commande — Peptinium Labs" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { ref } = Route.useParams();
  const { statut } = Route.useSearch();
  const pending = statut === "attente";

  return (
    <SiteLayout>
      <section className="container-prose px-5 py-20 text-center lg:py-28">
        {pending ? (
          <>
            <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-amber-500/10 text-3xl text-amber-600">
              !
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Paiement non confirmé
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Nous n'avons pas encore reçu le paiement de la commande{" "}
              <span className="font-mono font-semibold text-foreground">
                {ref}
              </span>
              .
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Si vous venez de payer, patientez quelques instants puis
              rafraîchissez cette page. Sinon, vous pouvez reprendre votre
              commande depuis votre panier.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/panier"
                className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
              >
                Retour au panier
              </Link>
              <Link
                to="/support"
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold"
              >
                Nous contacter
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-emerald-500/10 text-3xl text-emerald-600">
              ✓
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Merci pour votre commande
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Votre paiement a bien été reçu. Votre commande{" "}
              <span className="font-mono font-semibold text-foreground">
                {ref}
              </span>{" "}
              est confirmée.
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Un email de confirmation vous a été envoyé, avec le récapitulatif
              de votre commande. Conservez la référence ci-dessus pour tout
              échange avec notre support.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/produits"
                className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
              >
                Continuer mes achats
              </Link>
              <Link
                to="/support"
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold"
              >
                Nous contacter
              </Link>
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
