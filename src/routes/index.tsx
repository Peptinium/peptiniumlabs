import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { RuoBadge } from "@/components/RuoBadge";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aetherion Labs — Peptides de recherche RUO, HPLC ≥ 98 %" },
      {
        name: "description",
        content:
          "Catalogue de peptides synthétiques de qualité recherche : Retatrutide, Tirzepatide, Semaglutide, BPC-157. Livrés avec Certificat d'Analyse. Research Use Only.",
      },
      { property: "og:title", content: "Aetherion Labs — Réactifs peptidiques de recherche" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = products.find((p) => p.featured)!;
  const rest = products.filter((p) => !p.featured).slice(0, 6);
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="border-b border-border bg-surface">
        <div className="container-prose grid gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
          <div>
            <RuoBadge />
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Réactifs peptidiques
              <br />
              <span className="text-medical">de qualité recherche.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Aetherion Labs fournit aux laboratoires académiques, CRO et instituts de recherche
              des peptides synthétiques validés par HPLC et spectrométrie de masse. Chaque lot est
              livré avec son Certificat d'Analyse.{" "}
              <strong className="text-foreground">
                Strictement destinés à la recherche scientifique en laboratoire (RUO).
              </strong>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/produits"
                className="rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explorer le catalogue
              </Link>
              <Link
                to="/etudes-scientifiques"
                className="rounded-sm border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                Références PubMed
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { k: "≥ 98 %", v: "Pureté HPLC" },
                { k: "CoA", v: "Pour chaque lot" },
                { k: "−20 °C", v: "Chaîne du froid" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-semibold text-medical">{s.k}</dt>
                  <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Featured product card */}
          <Link
            to="/produits/$slug"
            params={{ slug: featured.slug }}
            className="group block rounded-md border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-medical">
                Produit phare — recherche métabolique
              </span>
              <RuoBadge compact />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
                <svg viewBox="0 0 100 140" className="size-full">
                  <rect x="35" y="0" width="30" height="8" rx="2" fill="oklch(0.55 0.04 240)" />
                  <rect x="32" y="8" width="36" height="6" fill="oklch(0.7 0.02 240)" />
                  <path
                    d="M35 14 H65 V110 a14 14 0 0 1 -14 14 H49 a14 14 0 0 1 -14 -14 Z"
                    fill="oklch(0.99 0 0)"
                    stroke="oklch(0.85 0.01 240)"
                  />
                  <path
                    d="M35 80 H65 V110 a14 14 0 0 1 -14 14 H49 a14 14 0 0 1 -14 -14 Z"
                    fill="oklch(0.85 0.08 195 / 60%)"
                  />
                  <rect x="38" y="42" width="24" height="20" fill="oklch(1 0 0)" stroke="oklch(0.88 0.01 240)" />
                  <text x="50" y="55" textAnchor="middle" fontSize="5" fontFamily="ui-monospace" fontWeight="600" fill="oklch(0.32 0.06 235)">
                    RETATRU
                  </text>
                  <text x="50" y="60" textAnchor="middle" fontSize="3" fontFamily="ui-monospace" fill="oklch(0.5 0.02 240)">
                    10 mg · RUO
                  </text>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{featured.name}</h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  CAS {featured.cas} · {featured.molecularWeight}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {featured.shortDescription}
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      À partir de
                    </div>
                    <div className="text-2xl font-semibold">{featured.price} €</div>
                  </div>
                  <span className="font-mono text-xs text-medical group-hover:underline">
                    Voir la fiche →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CATALOGUE */}
      <section className="container-prose py-20">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
              Catalogue
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Réactifs sélectionnés pour la recherche
            </h2>
          </div>
          <Link to="/produits" className="hidden font-mono text-xs uppercase tracking-wider text-medical hover:underline sm:inline">
            Tout voir →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* QUALITY */}
      <section className="border-y border-border bg-surface">
        <div className="container-prose grid gap-10 py-20 md:grid-cols-3">
          {[
            {
              t: "Contrôle qualité",
              d: "Chaque lot est analysé par HPLC en phase inverse et par spectrométrie de masse. Un Certificat d'Analyse (CoA) est joint à chaque commande.",
              k: "HPLC · MS · CoA",
            },
            {
              t: "Conditionnement laboratoire",
              d: "Flacons en verre borosilicate type I, bouchons butyle, sertissage aluminium. Lyophilisat sous atmosphère contrôlée.",
              k: "Type I · Lyo",
            },
            {
              t: "Logistique chaîne du froid",
              d: "Expédition réfrigérée avec traceurs de température. Documentation complète pour l'audit de votre laboratoire.",
              k: "−20 °C · Tracking",
            },
          ].map((c) => (
            <div key={c.t} className="border-l border-medical/40 pl-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-medical">
                {c.k}
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL RUO REMINDER */}
      <section className="container-prose py-16">
        <div className="rounded-md border border-warning/40 bg-warning/5 p-6 sm:p-8">
          <RuoBadge />
          <h2 className="mt-3 text-xl font-semibold tracking-tight">
            Avis réglementaire — Research Use Only (RUO)
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
            Les produits commercialisés par Aetherion Labs sont des{" "}
            <strong>réactifs chimiques destinés à la recherche scientifique in vitro</strong>{" "}
            en environnement de laboratoire contrôlé. Ils ne sont pas destinés ni adaptés à un
            usage humain, vétérinaire, diagnostique, thérapeutique, alimentaire ou cosmétique.
            Toute manipulation doit être effectuée par un personnel qualifié, dans le respect des
            bonnes pratiques de laboratoire et des réglementations en vigueur.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
