import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductVisual } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";

export const Route = createFileRoute("/etudes-scientifiques")({
  head: () => ({
    meta: [
      { title: "Études scientifiques — Références PubMed · Peptinium Labs" },
      {
        name: "description",
        content:
          "Bibliographie scientifique référencée sur PubMed et PMC pour chaque peptide de recherche du catalogue Peptinium Labs.",
      },
      { property: "og:url", content: "/etudes-scientifiques" },
    ],
    links: [{ rel: "canonical", href: "/etudes-scientifiques" }],
  }),
  component: StudiesPage,
});

const ORDER = [
  "retatrutide",
  "ghk-cu",
  "cjc-1295-ipamorelin",
  "semax",
  "ahk-cu",
  "bpc-157",
  "mt-1",
  "mt-2",
  "klow",
  "nad-plus",
  "tesamoreline",
];

function StudiesPage() {
  const sorted = [...products]
    .filter((p) => p.references.length > 0)
    .sort((a, b) => {
      const ai = ORDER.indexOf(a.slug);
      const bi = ORDER.indexOf(b.slug);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="container-prose relative py-20">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              — Bibliographie scientifique
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              <span className="shimmer-text">Études de référence par molécule</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Chaque réactif du catalogue est documenté par une sélection de publications
              scientifiques indexées sur PubMed / PMC ou éditées par les principales revues
              médicales internationales. Ces références sont fournies à titre documentaire
              exclusivement et ne constituent en aucun cas une indication d'usage diagnostique,
              thérapeutique ou vétérinaire.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-prose py-16">
        <div className="space-y-10">
          {sorted.map((p, idx) => (
            <Reveal key={p.slug} delay={idx * 40}>
              <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/40 hover:shadow-[0_8px_30px_-12px_oklch(0.7_0.12_200/30%)]">
                <div className="grid gap-6 p-6 sm:grid-cols-[120px_1fr] sm:gap-8 sm:p-8">
                  {/* Vial thumbnail */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-surface">
                      <ProductVisual
                        product={p}
                        dosage={p.variants[0]?.dosage}
                        alt={`Flacon ${p.name}`}
                        className="aspect-[2/3] w-full"
                        imageClassName="size-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                        Pureté
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-foreground">{p.purity}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                          {p.category}
                        </div>
                        <h2 className="mt-1.5 font-display text-2xl font-medium tracking-tight">
                          {p.name}
                        </h2>
                      </div>
                      <Link
                        to="/produits/$slug"
                        params={{ slug: p.slug }}
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-accent"
                      >
                        Fiche produit →
                      </Link>
                    </div>

                    <ul className="mt-5 space-y-2.5">
                      {p.references.map((r, i) => (
                        <li
                          key={r.url}
                          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3 transition-all hover:border-accent/40 hover:bg-surface"
                        >
                          <div className="min-w-0">
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                              Référence n°{i + 1} · {r.source}
                            </div>
                            <div className="mt-0.5 truncate font-mono text-[12px] text-foreground">
                              {r.id}
                            </div>
                          </div>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-all hover:border-accent hover:bg-accent/5"
                          >
                            Consulter sur {r.source}
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path
                                d="M1 5h8m-3-3 3 3-3 3"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                              />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>

                    {p.slug === "klow" && (
                      <p className="mt-4 rounded-md border border-border bg-surface px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
                        KLOW est une co-formulation de GHK-Cu + BPC-157 + TB-500 + KPV. Les
                        références ci-dessus correspondent aux études individuelles des
                        composants actifs (cicatrisation, anti-inflammation, remodelage matriciel).
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-surface p-6 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Sources
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            NIH · National Library of Medicine · PubMed · PubMed Central (PMC) · JAMA Network.
            Liens directs vérifiés vers les publications originales.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
