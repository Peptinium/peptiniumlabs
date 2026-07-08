import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";

const visibleProducts = products.filter((p) => !p.hidden);

const SITE_URL = "https://peptinium.com";

export const Route = createFileRoute("/produits/")({
  head: () => ({
    meta: [
      { title: "Catalogue de peptides — Retatrutide, BPC-157, GHK-Cu, CJC-1295, Semax, Melanotan, NAD+ · Peptinium Labs" },
      {
        name: "description",
        content:
          "Catalogue complet de peptides de recherche : Retatrutide, GHK-Cu, AHK-Cu, CJC-1295/Ipamorelin, Semax, BPC-157, Melanotan I & II, KLOW, NAD+, Tesamorelin, eau bactériostatique. HPLC ≥ 99 %, RUO.",
      },
      { property: "og:title", content: "Catalogue de peptides de recherche — Peptinium Labs" },
      {
        property: "og:description",
        content:
          "Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tesamorelin. Pureté HPLC ≥ 99 %.",
      },
      { property: "og:url", content: `${SITE_URL}/produits` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/produits` }],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  return (
    <SiteLayout>
      {/* HERO éditorial */}
      <section className="relative overflow-hidden border-b border-border/60 bg-[oklch(0.97_0.015_270)]">
        <div className="container-prose relative px-5 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70">
              Catalogue <span className="mx-2 opacity-40">·</span> {visibleProducts.length} sur {visibleProducts.length}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-8 font-display text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[72px] lg:text-[92px] lg:leading-[0.96]">
              Tous les peptides
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 max-w-[22ch] font-display text-[36px] font-normal leading-[1.05] tracking-[-0.02em] text-muted-foreground sm:max-w-none sm:text-[52px] lg:text-[72px] lg:leading-[1.02]">
              Des peptides de qualité premium pour la recherche.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grille produits */}
      <section className="container-prose px-5 py-10 lg:py-16">
        <div className="grid animate-[fade-in_0.5s_ease-out_both] grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 40}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
