import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard, ProductVisual } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { RuoBadge } from "@/components/RuoBadge";
import { formatPrice, minPrice, products, type Product } from "@/data/products";

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
      {
        name: "keywords",
        content:
          "peptides, peptides de recherche, acheter peptides France, Retatrutide, GHK-Cu, AHK-Cu, CJC-1295, Ipamorelin, Semax, BPC-157, Melanotan I, Melanotan II, MT-1, MT-2, KLOW, NAD+, Tesamorelin, eau bactériostatique, GLP-1, GIP, GHRP, mélanocortine, HPLC, certificat d'analyse, CoA, RUO",
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

const categories = ["Toutes", "GLP-1/GIP", "Croissance", "Cognitif", "Réparation", "Mélanocortine", "Anti-âge", "Reconstitution"] as const;

function CatalogPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Toutes");
  const list = useMemo(
    () => (cat === "Toutes" ? products : products.filter((p) => p.category === cat)),
    [cat],
  );
  return (
    <SiteLayout>
      {/* HERO éditorial Vela */}
      <section className="relative overflow-hidden border-b border-border/60 bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 82% 22%, color-mix(in oklab, var(--brand-violet) 10%, transparent) 0%, transparent 65%), radial-gradient(40% 40% at 8% 88%, color-mix(in oklab, var(--brand-cyan) 8%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
        />

        <div className="container-prose relative px-5 pt-20 pb-14 lg:pt-28 lg:pb-20">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <RuoBadge />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                · {products.length} référence(s) disponibles
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-8 max-w-[16ch] text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[72px] lg:text-[96px] lg:leading-[0.94]">
              Catalogue de{" "}
              <span className="brand-gradient-text">réactifs peptidiques</span>.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-muted-foreground">
              Composés validés par HPLC et spectrométrie de masse, conditionnés
              en flacons stériles. Réactifs destinés{" "}
              <strong className="text-foreground">
                exclusivement à la recherche scientifique en laboratoire.
              </strong>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible lg:pb-0">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 rounded-full border px-5 py-3 font-sans text-[13px] font-medium transition-all lg:py-2.5 lg:text-[12px] ${
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


      <section className="container-prose py-10 lg:py-16">
        <div key={`${cat}-mobile`} className="grid animate-[fade-in_0.5s_ease-out_both] gap-4 lg:hidden">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 35}>
              <MobileCatalogCard product={p} />
            </Reveal>
          ))}
        </div>

        <div key={`${cat}-desktop`} className="hidden animate-[fade-in_0.5s_ease-out_both] gap-3 sm:gap-5 lg:grid lg:grid-cols-3">
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

function MobileCatalogCard({ product }: { product: Product }) {
  const hasMultiple = product.variants.length > 1;
  const allSoldOut = product.variants.every((v) => v.soldOut);

  return (
    <Link
      to="/produits/$slug"
      params={{ slug: product.slug }}
      className="grid grid-cols-[128px_minmax(0,1fr)] gap-4 rounded-2xl border border-border bg-card p-3.5 shadow-[0_18px_44px_-32px_oklch(0.55_0.06_250/0.24)]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-surface">
        <ProductVisual
          product={product}
          dosage={product.variants[0]?.dosage}
          alt={`Flacon ${product.name} — Research Use Only`}
          className="size-full"
          imageClassName="size-full object-cover"
          loading="lazy"
        />
        {allSoldOut && (
          <div className="absolute left-2 top-2 rounded-full border border-warning/40 bg-warning/15 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-warning backdrop-blur-sm">
            Rupture
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col py-1">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          {product.category}
        </div>
        <h2 className="mt-1 font-display text-[24px] font-semibold leading-[1.04] tracking-tight text-foreground">
          {product.name}
        </h2>
        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.45] text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.11em] text-muted-foreground">
          {hasMultiple ? product.variants.map((v) => v.dosage).join(" · ") : product.variants[0].dosage}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {hasMultiple ? "Dès" : "Prix"}
            </div>
            <div className="font-display text-[25px] font-semibold leading-none text-foreground">
              {formatPrice(minPrice(product))}
            </div>
          </div>
          <span className="shrink-0 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">
            Fiche →
          </span>
        </div>
      </div>
    </Link>
  );
}
