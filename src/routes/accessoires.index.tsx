import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { accessories, type Accessory } from "@/data/accessories";
import { formatPrice } from "@/data/products";

const SITE_URL = "https://peptinium.com";

export const Route = createFileRoute("/accessoires/")({
  head: () => ({
    meta: [
      { title: "Accessoires laboratoire — Seringues, tampons, packs · Peptinium Labs" },
      {
        name: "description",
        content:
          "Packs accessoires, seringues insuline 0,5 ml 30G × 8 mm et tampons alcoolisés 70 % pour vos manipulations de recherche. Consommables stériles, conditionnement individuel.",
      },
      { property: "og:title", content: "Accessoires laboratoire — Peptinium Labs" },
      {
        property: "og:description",
        content:
          "Packs prêts à l'emploi, seringues et tampons alcoolisés pour la recherche.",
      },
      { property: "og:url", content: `${SITE_URL}/accessoires` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/accessoires` }],
  }),
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const packs = accessories.filter((a) => a.family === "Pack");
  const others = accessories.filter((a) => a.family !== "Pack");
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border/60 bg-[oklch(0.97_0.015_270)]">
        <div className="container-prose relative px-5 pt-20 pb-14 lg:pt-28 lg:pb-20">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70">
              Accessoires <span className="mx-2 opacity-40">·</span> {accessories.length} références
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-8 font-display text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[72px] lg:text-[88px]">
              Accessoires labo
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 max-w-[36ch] font-display text-[24px] font-normal leading-[1.15] tracking-[-0.015em] text-muted-foreground sm:text-[32px]">
              Packs prêts à l'emploi, seringues insuline et tampons alcoolisés pour vos manipulations de recherche.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-prose px-5 py-10 lg:py-16">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">— Packs prêts à l'emploi</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {packs.map((a, i) => (
            <Reveal key={a.slug} delay={i * 60} className="h-full">
              <AccessoryCard accessory={a} large />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">— Consommables à l'unité</div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          {others.map((a, i) => (
            <Reveal key={a.slug} delay={i * 40} className="h-full">
              <AccessoryCard accessory={a} />
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function AccessoryCard({ accessory, large }: { accessory: Accessory; large?: boolean }) {
  return (
    <Link
      to="/accessoires/$slug"
      params={{ slug: accessory.slug }}
      className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div className={`relative overflow-hidden border-b border-border bg-surface ${large ? "aspect-[4/3]" : "aspect-[2/3]"}`}>
        <img
          src={accessory.imageUrl}
          alt={accessory.name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute right-3 top-3 rounded-full border border-border bg-card/92 px-2.5 py-1 font-display text-sm font-medium shadow-sm backdrop-blur-sm">
          <span className="text-foreground">{formatPrice(accessory.priceEUR)}</span>
        </div>
        {accessory.badge && (
          <div className="absolute left-3 top-3 rounded-full border border-accent/50 bg-accent/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
            {accessory.badge}
          </div>
        )}
        {accessory.originalPriceEUR && (
          <div className="absolute bottom-3 left-3 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
            <span className="line-through opacity-70 mr-1">{formatPrice(accessory.originalPriceEUR)}</span>
            <span className="text-accent">−{Math.round((1 - accessory.priceEUR / accessory.originalPriceEUR) * 100)}%</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{accessory.family}</div>
        <h3 className="font-display text-[15px] font-medium tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-[17px]">
          {accessory.name}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="truncate">{accessory.variantLabel}</span>
          <span className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5">Fiche →</span>
        </div>
      </div>
    </Link>
  );
}
