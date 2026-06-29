import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Peptinium Labs" },
      { name: "description", content: "Mentions légales du site Peptinium Labs." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/mentions-legales" },
    ],
    links: [{ rel: "canonical", href: "/mentions-legales" }],
  }),
  component: () => (
    <SiteLayout>
      <article className="container-prose prose-sm max-w-3xl py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Mentions légales</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">Éditeur</h2>
            <p>Peptinium Labs — fournisseur de réactifs de recherche.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">Hébergement</h2>
            <p>Site hébergé sur infrastructure cloud sécurisée.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">Destination des produits</h2>
            <p>
              L'ensemble des produits présentés sur ce site sont des réactifs chimiques destinés{" "}
              <strong className="text-foreground">
                exclusivement à la recherche scientifique en laboratoire
              </strong>{" "}
              (Research Use Only — RUO). Ils ne sont pas destinés à un usage vétérinaire,
              diagnostique, thérapeutique, alimentaire ou cosmétique. L'éditeur décline toute
              responsabilité en cas d'usage détourné.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus du site (textes, identité visuelle, fiches techniques) sont
              protégés et réservés.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  ),
});
