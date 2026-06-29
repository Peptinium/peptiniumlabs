import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard, ProductVisual } from "@/components/ProductCard";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";
import { products, formatPrice } from "@/data/products";
import labBg from "@/assets/lab-bg-ruo.jpg";

const SITE_URL = "https://peptinium-labs.com";
const ALL_PEPTIDES_KEYWORDS = [
  "peptides", "peptides de recherche", "peptides France", "acheter peptides", "vente peptides",
  "peptides RUO", "peptides HPLC", "peptides qualité recherche", "réactifs peptidiques",
  "Retatrutide", "LY3437943", "GLP-1", "GIP", "agoniste GLP-1", "triple agoniste",
  "Tirzepatide", "Semaglutide", "Liraglutide",
  "GHK-Cu", "AHK-Cu", "peptide cuivre", "cuivre tripeptide",
  "CJC-1295", "Ipamorelin", "CJC-1295 Ipamorelin", "GHRP", "GHRH", "hormone de croissance",
  "Semax", "peptide nootropique", "BDNF",
  "BPC-157", "Body Protection Compound", "réparation tissulaire",
  "Melanotan", "Melanotan I", "Melanotan II", "MT-1", "MT-2", "mélanocortine",
  "KLOW", "blend KLOW", "GHK-Cu BPC-157 TB-500",
  "NAD+", "NAD plus", "nicotinamide adénine dinucléotide", "anti-âge cellulaire",
  "Tésamoréline", "tesamorelin",
  "eau bactériostatique", "solvant peptides", "reconstitution peptides",
  "CAS", "pureté HPLC", "spectrométrie de masse", "certificat d'analyse", "CoA",
  "calculatrice dilution peptides", "tester ses fioles", "laboratoire CRO", "in vitro",
].join(", ");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peptides de recherche — Retatrutide, BPC-157, GHK-Cu, CJC-1295, Semax · Peptinium Labs" },
      {
        name: "description",
        content:
          "Achetez vos peptides de recherche en France : Retatrutide, Tirzepatide, Semaglutide, BPC-157, GHK-Cu, AHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan I/II, KLOW, NAD+, Tésamoréline. Pureté HPLC ≥ 99 %, Certificat d'Analyse, livraison rapide. RUO.",
      },
      { name: "keywords", content: ALL_PEPTIDES_KEYWORDS },
      { property: "og:title", content: "Peptinium Labs — Peptides de recherche (Retatrutide, BPC-157, GHK-Cu, CJC-1295…)" },
      {
        property: "og:description",
        content:
          "Peptides synthétiques HPLC ≥ 99 % livrés avec CoA : Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tésamoréline.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Peptinium Labs — Peptides de recherche RUO" },
      { name: "twitter:description", content: "Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tésamoréline. HPLC ≥ 99 %, CoA." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Peptinium Labs",
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/produits?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Peptinium Labs",
          url: SITE_URL,
          description:
            "Fournisseur français de peptides synthétiques de qualité recherche (RUO) : Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tésamoréline.",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = products.find((p) => p.featured)!;
  const rest = products.filter((p) => !p.featured).slice(0, 6);

  return (
    <SiteLayout>
      <SideOrnaments />
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">

        {/* animated grid bg */}
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [animation:grid-drift_24s_linear_infinite]" />
        {/* radial fade */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,var(--background)_75%)]" />
        {/* beam */}
        <div className="pointer-events-none absolute -top-px left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_5s_ease-in-out_infinite]" />

        <div className="container-prose relative grid gap-16 py-20 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:py-32">
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
              <h1 className="mt-8 font-display text-[34px] font-normal leading-[1.1] tracking-[-0.025em] text-balance sm:mt-6 sm:text-6xl sm:font-medium sm:leading-[1.02] sm:tracking-[-0.035em] lg:text-[68px]">
                Réactifs peptidiques
                <br />
                <span className="shimmer-text">pour motif de recherche.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-[15px] leading-[1.75] text-muted-foreground sm:mt-7 sm:leading-relaxed">
                Peptinium Labs fournit aux laboratoires académiques, CRO et instituts des
                peptides synthétiques validés par HPLC et spectrométrie de masse. Chaque lot
                est livré avec son Certificat d'Analyse —{" "}
                <strong className="text-foreground">
                  strictement destinés à la recherche scientifique in vitro (RUO).
                </strong>{" "}
                <span className="text-foreground/90">
                  Non recommandé pour toute utilisation hors cadre scientifique, professionnel et de recherche.
                </span>
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap items-center gap-3 sm:mt-9">
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
              <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-border pt-10 sm:mt-14 sm:pt-8">
                {[
                  { k: "≥ 99 %", v: "Pureté HPLC" },
                  { k: "CoA", v: "Pour chaque lot" },
                  { k: "RUO", v: "Recherche uniquement" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-xl font-medium text-foreground sm:text-2xl">{s.k}</dt>
                    <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Featured molecule card */}
          <Reveal delay={120}>
            <div className="relative">
              <HologramOrnament />
              <FeaturedCard featured={featured} />
            </div>
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
      <section className="container-prose py-20 sm:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                — Catalogue
              </div>
              <h2 className="mt-3 font-display text-[26px] font-normal leading-[1.15] tracking-tight sm:mt-2 sm:text-4xl sm:font-medium">
                Réactifs sélectionnés pour la recherche
              </h2>
            </div>
            <Link to="/produits" className="link-underline font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
              Tout voir →
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ QUALITY BENTO ============ */}
      <section className="border-y border-border bg-surface">
        <div className="container-prose py-20 sm:py-24">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Notre laboratoire
            </div>
            <h2 className="mt-3 max-w-2xl font-display text-[26px] font-normal leading-[1.15] tracking-tight text-balance sm:mt-2 sm:text-4xl sm:font-medium">
              Un protocole qualité reproductible, lot après lot.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:mt-12 sm:gap-4 md:grid-cols-6">
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
              t="Traçabilité de lot"
              d="Numéro de lot unique, archive de 5 ans, documentation auditable à la demande."
              tag="QMS"
            />
            <QualityCard
              className="md:col-span-2"
              k="04"
              t="Conditionnement stérile"
              d="Lyophilisation sous atmosphère contrôlée."
              tag="LYO"
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

      {/* ============ RUO REMINDER with lab background ============ */}
      <section className="relative overflow-hidden border-t border-border">
        <img
          src={labBg}
          alt=""
          aria-hidden
          width={1920}
          height={1080}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-[oklch(0.18_0.08_245/88%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/60" />
        <div className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_6s_ease-in-out_infinite]" />

        <div className="container-prose relative py-20 sm:py-32">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/80 backdrop-blur">
                <span className="size-1.5 rounded-full bg-accent" />
                Research Use Only
              </div>
              <h2 className="mt-6 font-display text-[26px] font-normal leading-[1.15] tracking-tight text-balance text-white sm:mt-5 sm:text-4xl sm:font-medium lg:text-5xl">
                Avis réglementaire — Research Use Only (RUO)
              </h2>
              <p className="mt-7 text-[15px] leading-[1.75] text-white/75 sm:mt-6 sm:leading-relaxed">
                Les produits commercialisés par Peptinium Labs sont des{" "}
                <strong className="text-white">réactifs chimiques destinés à la recherche scientifique in vitro</strong>{" "}
                en environnement de laboratoire contrôlé. Ils ne sont pas destinés ni adaptés à un
                usage vétérinaire, diagnostique, thérapeutique, alimentaire ou cosmétique.
                Toute manipulation doit être effectuée par un personnel qualifié, dans le respect
                des bonnes pratiques de laboratoire et des réglementations en vigueur.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

function SideOrnaments() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 left-0 right-0 z-0 hidden xl:block">
      {/* Left rail */}
      <div className="absolute left-0 top-0 h-full w-[max(0px,calc((100vw-1240px)/2))]">
        <div className="absolute inset-y-0 right-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="absolute right-6 top-1/4 size-3 rounded-full border border-accent/40 [animation:float_5s_ease-in-out_infinite]" />
        <div className="absolute right-10 top-1/2 size-1.5 rounded-full bg-accent/60 [animation:pulse-ring_3s_ease-in-out_infinite]" />
        <div className="absolute right-4 top-2/3 size-12 rounded-full border border-dashed border-accent/25 [animation:spin_30s_linear_infinite]" />
        <div className="absolute right-2 bottom-1/4 rotate-90 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 origin-bottom-right whitespace-nowrap">
          ◆ Lot QC-2026.06 · HPLC ≥ 99 %
        </div>
      </div>
      {/* Right rail */}
      <div className="absolute right-0 top-0 h-full w-[max(0px,calc((100vw-1240px)/2))]">
        <div className="absolute inset-y-0 left-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="absolute left-4 top-1/3 size-16 rounded-full border border-accent/20 [animation:spin_45s_linear_infinite_reverse]">
          <div className="absolute inset-2 rounded-full border border-dashed border-accent/30" />
        </div>
        <div className="absolute left-10 top-2/3 size-2 rounded-full bg-accent/50 [animation:float_4s_ease-in-out_infinite]" />
        <div className="absolute left-6 bottom-1/3 size-6 rounded-sm border border-border [animation:float_6s_ease-in-out_infinite] rotate-45" />
        <div className="absolute left-2 top-1/4 -rotate-90 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 origin-top-left whitespace-nowrap">
          MS · CoA · ISO ◆
        </div>
      </div>
    </div>
  );
}

const specsMarquee = [
  "Retatrutide 10 mg",
  "Retatrutide 20 mg",
  "GHK-Cu 50 mg",
  "GHK-Cu 100 mg",
  "AHK-Cu 100 mg",
  "BPC-157 10 mg",
  "CJC-1295 + Ipamorelin 5 mg + 5 mg",
  "Semax 10 mg",
  "Melanotan I 10 mg",
  "Melanotan II 10 mg",
  "KLOW 80 mg",
  "NAD+ 1000 mg",
  "Tésamoréline 5 mg",
  "Eau bactériostatique 30 mL",
];

function HologramOrnament() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-40 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
    >
      <div className="relative grid size-24 place-items-center">

        {/* outer rotating ring */}
        <div className="absolute inset-0 rounded-full border border-accent/30 [animation:spin_18s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-dashed border-accent/40 [animation:spin_12s_linear_infinite_reverse]" />
        {/* glow */}
        <div className="absolute inset-4 rounded-full bg-accent/15 blur-2xl [animation:pulse_3s_ease-in-out_infinite]" />
        {/* hologram orb */}
        <div className="relative size-16 rounded-full bg-gradient-to-br from-accent/40 via-accent/10 to-transparent [animation:float_4s_ease-in-out_infinite] shadow-[0_0_40px_oklch(0.7_0.18_220/40%)]">
          <div className="absolute inset-0 grid place-items-center">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="17" r="14" stroke="currentColor" className="text-accent" strokeWidth="1" strokeDasharray="3 4" />
              <path d="M11 8h12v3l-4 6 4 6v3H11v-3l4-6-4-6V8Z" stroke="currentColor" className="text-accent" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {/* scan beam */}
        <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_3s_ease-in-out_infinite]" />
      </div>
      <div className="mt-1 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-accent/80">
        ◇ Lab-grade ◇
      </div>
    </div>
  );
}

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

      <div className="grid gap-5 p-6 sm:grid-cols-[160px_1fr] sm:items-center sm:p-7">
        <div className="relative mx-auto aspect-[2/3] w-36 overflow-hidden rounded-[18px] border border-border bg-surface sm:mx-0">
          <ProductVisual
            product={featured}
            dosage={featured.variants[0]?.dosage}
            alt={`Flacon ${featured.name} — Research Use Only`}
            className="size-full"
            imageClassName="size-full object-cover"
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
                {formatPrice(Math.min(...featured.variants.map((v) => v.price)))}
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
