import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";
import retatrutideVial from "@/assets/retatrutide-vial.png.asset.json";

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
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        {/* animated grid bg */}
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [animation:grid-drift_24s_linear_infinite]" />
        {/* radial fade */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,var(--background)_75%)]" />
        {/* beam */}
        <div className="pointer-events-none absolute -top-px left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_5s_ease-in-out_infinite]" />

        <div className="container-prose relative grid gap-14 py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-32">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <RuoBadge />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
                  <span className="size-1 rounded-full bg-accent" /> Lot QC-2026.06 actif
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[44px] font-medium leading-[1.02] tracking-[-0.035em] text-balance sm:text-6xl lg:text-[68px]">
                Réactifs peptidiques
                <br />
                <span className="shimmer-text">de qualité recherche.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Aetherion Labs fournit aux laboratoires académiques, CRO et instituts des
                peptides synthétiques validés par HPLC et spectrométrie de masse. Chaque lot
                est livré avec son Certificat d'Analyse —{" "}
                <strong className="text-foreground">
                  strictement destinés à la recherche scientifique in vitro (RUO).
                </strong>
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/produits"
                  className="group relative overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explorer le catalogue
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="absolute inset-y-0 left-0 w-14 -translate-x-full bg-accent/40 blur-md transition-transform duration-700 group-hover:translate-x-[460%]" />
                </Link>
                <Link
                  to="/etudes-scientifiques"
                  className="link-underline rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                >
                  Bibliographie PubMed
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8">
                {[
                  { k: "≥ 98 %", v: "Pureté HPLC" },
                  { k: "CoA", v: "Pour chaque lot" },
                  { k: "−20 °C", v: "Chaîne du froid" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-2xl font-medium text-foreground">{s.k}</dt>
                    <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Featured molecule card */}
          <Reveal delay={120}>
            <FeaturedCard featured={featured} />
          </Reveal>
        </div>
      </section>

      {/* ============ MARQUEE OF SPECS ============ */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="overflow-hidden">
          <div className="flex animate-[marquee_45s_linear_infinite] whitespace-nowrap py-5">
            {[...specsMarquee, ...specsMarquee].map((s, i) => (
              <div key={i} className="flex items-center gap-4 px-8 font-mono text-[11px] uppercase tracking-[0.22em] text-background/70">
                <span className="text-accent">◆</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATALOG GRID ============ */}
      <section className="container-prose py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                — Catalogue
              </div>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                Réactifs sélectionnés pour la recherche
              </h2>
            </div>
            <Link to="/produits" className="link-underline font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
              Tout voir →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ QUALITY BENTO ============ */}
      <section className="border-y border-border bg-surface">
        <div className="container-prose py-24">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Notre laboratoire
            </div>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              Un protocole qualité reproductible, lot après lot.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-6">
            <QualityCard
              className="md:col-span-3 md:row-span-2"
              k="01"
              t="Contrôle analytique"
              d="Chaque lot est analysé par HPLC en phase inverse et validation d'identité par spectrométrie de masse. Le Certificat d'Analyse (CoA) accompagne chaque expédition."
              tag="HPLC · MS · CoA"
              big
            />
            <QualityCard
              className="md:col-span-3"
              k="02"
              t="Conditionnement type I"
              d="Flacons en verre borosilicate, bouchons butyle, sertissage aluminium."
              tag="ISO-friendly"
            />
            <QualityCard
              className="md:col-span-3"
              k="03"
              t="Chaîne du froid"
              d="Expédition réfrigérée avec traceurs de température, documentation auditable."
              tag="−20 °C"
            />
            <QualityCard
              className="md:col-span-2"
              k="04"
              t="Traçabilité"
              d="N° de lot unique, archives 5 ans."
              tag="QMS"
            />
            <QualityCard
              className="md:col-span-2"
              k="05"
              t="Sourcing audité"
              d="Partenaires SPPS Fmoc audités."
              tag="SPPS"
            />
            <QualityCard
              className="md:col-span-2"
              k="06"
              t="Support recherche"
              d="MSDS, protocoles labo sur demande."
              tag="Support"
            />
          </div>
        </div>
      </section>

      {/* ============ RUO REMINDER ============ */}
      <section className="container-prose py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-warning/40 bg-warning/5 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-warning/10 blur-3xl" />
            <RuoBadge />
            <h2 className="mt-4 max-w-3xl font-display text-2xl font-medium tracking-tight text-balance sm:text-3xl">
              Avis réglementaire — Research Use Only (RUO)
            </h2>
            <p className="relative mt-4 max-w-3xl text-sm leading-relaxed text-foreground/80">
              Les produits commercialisés par Aetherion Labs sont des{" "}
              <strong>réactifs chimiques destinés à la recherche scientifique in vitro</strong> en
              environnement de laboratoire contrôlé. Ils ne sont pas destinés ni adaptés à un
              usage humain, vétérinaire, diagnostique, thérapeutique, alimentaire ou cosmétique.
              Toute manipulation doit être effectuée par un personnel qualifié, dans le respect
              des bonnes pratiques de laboratoire et des réglementations en vigueur.
            </p>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

const specsMarquee = [
  "HPLC ≥ 98 %",
  "Mass spectrometry validated",
  "Lyophilized · Type I glass",
  "Certificate of Analysis",
  "Cold chain −20 °C",
  "Research Use Only",
  "Lot traceability",
  "SPPS Fmoc synthesis",
];

function QualityCard({
  k, t, d, tag, className = "", big = false,
}: { k: string; t: string; d: string; tag: string; className?: string; big?: boolean }) {
  return (
    <Reveal className={className}>
      <div className="hover-lift group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              — {k}
            </span>
            <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
              {tag}
            </span>
          </div>
          <h3 className={`mt-4 font-display font-medium tracking-tight ${big ? "text-2xl sm:text-3xl" : "text-lg"}`}>
            {t}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
        </div>
        {big && (
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {["HPLC RP", "MS ID", "CoA"].map((x) => (
              <div key={x} className="rounded-md border border-border bg-surface px-2 py-2 text-center">
                {x}
              </div>
            ))}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </Reveal>
  );
}

function FeaturedCard({ featured }: { featured: typeof products[number] }) {
  return (
    <Link
      to="/produits/$slug"
      params={{ slug: featured.slug }}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-30px_oklch(0.22_0.06_250/25%)] transition-shadow hover:shadow-[0_40px_80px_-30px_oklch(0.22_0.06_250/35%)]"
    >
      {/* header */}
      <div className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <div className="pointer-events-none absolute inset-0 opacity-20 grid-bg" />
        <div className="relative flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-background/80">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Produit phare · recherche métabolique
          </div>
          <RuoBadge compact variant="ghost" />
        </div>
        <div className="pointer-events-none absolute -bottom-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_5s_ease-in-out_infinite]" />
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-[140px_1fr] sm:items-center sm:p-7">
        <div className="relative mx-auto aspect-[3/4] w-32 overflow-hidden rounded-md bg-surface sm:mx-0">
          <div className="absolute inset-0 dot-bg opacity-60" />
          <img
            src={retatrutideVial.url}
            alt="Flacon Retatrutide — Research Use Only"
            className="absolute inset-0 size-full object-contain p-2"
            loading="eager"
          />
        </div>
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent">
            {featured.name}
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            CAS {featured.cas} · {featured.molecularWeight}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {featured.shortDescription}
          </p>
          <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                À partir de
              </div>
              <div className="font-display text-2xl font-medium">
                {Math.min(...featured.variants.map((v) => v.price))} €
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent transition-transform duration-300 group-hover:translate-x-0.5">
              Voir la fiche →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
