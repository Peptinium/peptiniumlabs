import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { RuoBadge } from "@/components/RuoBadge";
import { products } from "@/data/products";

const SITE_URL = "https://peptinium-labs.com";

export const Route = createFileRoute("/produits/")({
  head: () => ({
    meta: [
      { title: "Catalogue de peptides — Retatrutide, BPC-157, GHK-Cu, CJC-1295, Semax, Melanotan, NAD+ · Peptinium Labs" },
      {
        name: "description",
        content:
          "Catalogue complet de peptides de recherche : Retatrutide, GHK-Cu, AHK-Cu, CJC-1295/Ipamorelin, Semax, BPC-157, Melanotan I & II, KLOW, NAD+, Tesamorelin, eau bactériostatique. HPLC ≥ 99 %, CoA, RUO.",
      },
      {
        name: "keywords",
        content:
          "peptides, peptides de recherche, acheter peptides France, Retatrutide, GHK-Cu, AHK-Cu, CJC-1295, Ipamorelin, Semax, BPC-157, Melanotan I, Melanotan II, MT-1, MT-2, KLOW, NAD+, Tesamorelin, eau bactériostatique, GLP-1, GIP, GHRP, mélanocortine, HPLC, certificat d'analyse, CoA, RUO",
      },
      { property: "og:title", content: "Catalogue de peptides de recherche — Peptinium Labs" },
      {
        property: "og:description",
        content:
          "Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tesamorelin. Pureté HPLC ≥ 99 %, CoA fourni.",
      },
      { property: "og:url", content: `${SITE_URL}/produits` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/produits` }],
  }),
  component: CatalogPage,
});

const categories = ["Toutes", "GLP-1/GIP", "Croissance", "Cognitif", "Réparation", "Mélanocortine", "Anti-âge", "Reconstitution"] as const;

function CatalogPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Toutes");
  const list = useMemo(
    () => (cat === "Toutes" ? products : products.filter((p) => p.category === cat)),
    [cat],
  );
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50 [animation:grid-drift_24s_linear_infinite]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,var(--background)_85%)]" />
        <div className="container-prose relative py-20">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <RuoBadge />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                · {products.length} référence(s) disponibles
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium tracking-[-0.03em] text-balance sm:text-5xl">
              Catalogue de réactifs peptidiques
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Composés validés par HPLC et spectrométrie de masse, conditionnés en flacons
              stériles et livrés avec leur Certificat d'Analyse. Réactifs destinés{" "}
              <strong className="text-foreground">
                exclusivement à la recherche scientifique en laboratoire.
              </strong>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-all ${
                    cat === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-prose py-16">
        <div key={cat} className="grid grid-cols-2 animate-[fade-in_0.5s_ease-out_both] gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 50}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
