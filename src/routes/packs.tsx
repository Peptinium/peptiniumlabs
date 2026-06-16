import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { packs, products } from "@/data/products";

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Packs recherche — Aetherion Labs" },
      {
        name: "description",
        content:
          "Ensembles de réactifs peptidiques pour protocoles de recherche in vitro : métabolisme, axe somatotrope, réparation cellulaire. RUO uniquement.",
      },
      { property: "og:url", content: "/packs" },
    ],
    links: [{ rel: "canonical", href: "/packs" }],
  }),
  component: PacksPage,
});

function PacksPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-14">
          <RuoBadge />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Packs de recherche
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Ensembles de réactifs sélectionnés pour faciliter les protocoles comparatifs in vitro.
            Chaque pack est livré avec les CoA correspondants. Destinés{" "}
            <strong className="text-foreground">exclusivement à la recherche scientifique en laboratoire</strong>.
          </p>
        </div>
      </section>
      <section className="container-prose grid gap-6 py-14 md:grid-cols-2 lg:grid-cols-3">
        {packs.map((pk) => (
          <div key={pk.slug} className="flex flex-col rounded-md border border-border bg-card p-6">
            <RuoBadge compact />
            <h2 className="mt-3 text-lg font-semibold tracking-tight">{pk.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pk.description}</p>
            <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              {pk.items.map((it) => (
                <li key={it} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-medical" />
                  <span className="font-mono text-xs text-foreground">{it}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-end justify-between pt-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Tarif pack
                </div>
                <div className="text-2xl font-semibold">{pk.price} €</div>
                <div className="font-mono text-[11px] text-medical">−{pk.saving} % vs unitaire</div>
              </div>
              <button className="rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                Devis labo
              </button>
            </div>
          </div>
        ))}
      </section>
      <section className="container-prose pb-16">
        <div className="rounded-md border border-border bg-surface p-6">
          <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
            Composition personnalisée
          </div>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            Besoin d'un pack sur-mesure pour votre laboratoire ?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Nous assemblons des kits adaptés à votre protocole de recherche, avec documentation
            complète (CoA, MSDS, certificats de stérilité du conditionnement). Composez librement
            parmi nos {products.length} référence(s) catalogue.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
