import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard, ProductVisual } from "@/components/ProductCard";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/Hero";
import { Vial3D } from "@/components/Vial3D";

import { products, formatPrice } from "@/data/products";
import labBg from "@/assets/lab-bg-ruo.jpg";

const SITE_URL = "https://peptinium.com";
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
  "Tesamorelin", "tesamorelin",
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
          "Achetez vos peptides de recherche en France : Retatrutide, Tirzepatide, Semaglutide, BPC-157, GHK-Cu, AHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan I/II, KLOW, NAD+, Tesamorelin. Pureté HPLC ≥ 99 %, livraison rapide. RUO.",
      },
      { name: "keywords", content: ALL_PEPTIDES_KEYWORDS },
      { property: "og:title", content: "Peptinium Labs — Peptides de recherche (Retatrutide, BPC-157, GHK-Cu, CJC-1295…)" },
      {
        property: "og:description",
        content:
          "Peptides synthétiques HPLC ≥ 99 % : Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tesamorelin.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Peptinium Labs — Peptides de recherche RUO" },
      { name: "twitter:description", content: "Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tesamorelin. HPLC ≥ 99 %." },
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
            "Fournisseur français de peptides synthétiques de qualité recherche (RUO) : Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tesamorelin.",
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
      <MobileHome featured={featured} rest={rest} />

      <div className="desktop-experience">
      {/* ============ IMMERSIVE HERO ============ */}
      <Hero />

      {/* ============ QUIET TRUST ROW ============ */}
      <section className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-10 gap-y-4 px-8 py-8">
          {[
            { k: "HPLC ≥ 99 %", v: "Pureté vérifiée" },
            { k: "CoA", v: "Consultables en ligne" },
            { k: "RUO", v: "Recherche uniquement" },
            { k: "Expédition 24 h", v: "Depuis la France" },
          ].map((t) => (
            <div key={t.k} className="flex flex-col">
              <span className="font-display text-[15px] font-medium tracking-tight text-foreground">{t.k}</span>
              <span className="mt-1 text-[12px] text-muted-foreground">{t.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCT — MAGNIFIED ============ */}
      <section className="mx-auto max-w-6xl px-8 py-32 sm:py-40">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Produit phare</span>
            <h2 className="mt-6 max-w-3xl font-display text-5xl font-light leading-[1.05] tracking-tighter text-foreground sm:text-7xl">
              Sculpté pour la{" "}
              <span className="bg-gradient-to-r from-[var(--brand-cyan)] via-[var(--brand-blue)] via-[var(--brand-violet)] to-[var(--brand-magenta)] bg-clip-text font-medium text-transparent">
                recherche.
              </span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-16">
            <FeaturedCard featured={featured} />
          </div>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-14 max-w-xl text-center text-lg font-light leading-relaxed text-muted-foreground">
            Pureté HPLC vérifiée, conditionnement stérile, traçabilité complète.
            L'exigence du laboratoire, sans compromis.
          </p>
        </Reveal>
      </section>

      {/* ============ AIRY PILLARS ============ */}
      <section className="mx-auto max-w-7xl px-8 pb-32 sm:pb-40">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          {[
            {
              t: "Pureté vérifiée",
              d: "Chaque lot est analysé par HPLC en phase inverse et validé par spectrométrie de masse.",
              c: "var(--brand-cyan)",
            },
            {
              t: "Traçabilité totale",
              d: "Numéro de lot unique, documentation auditable sur demande, CoA consultable en ligne pour chaque flacon.",
              c: "var(--brand-violet)",
            },
            {
              t: "Support recherche",
              d: "MSDS, protocoles labo et conseils de reconstitution. Un interlocuteur qui parle votre langage.",
              c: "var(--brand-magenta)",
            },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div className="flex flex-col gap-8 p-2">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <div className="size-4 rounded-full" style={{ backgroundColor: p.c }} />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-normal tracking-tight text-foreground">{p.t}</h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CATALOG — AIRY ============ */}
      <section className="mx-auto max-w-7xl px-8 pb-32 sm:pb-40">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">La collection</span>
              <h2 className="mt-4 font-display text-4xl font-light leading-[1.05] tracking-tighter text-foreground sm:text-5xl">
                Réactifs sélectionnés<br className="hidden sm:block" /> pour la recherche.
              </h2>
            </div>
            <Link
              to="/produits"
              className="inline-flex items-center gap-2 font-display text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              Tout voir <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ QUALITY — APPLE-STYLE PROCESS ============ */}
      <section className="mx-auto max-w-6xl px-8 pb-32 sm:pb-40">
        <Reveal>
          <div className="mb-20 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Le protocole</span>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tighter text-foreground sm:text-6xl">
              Une exigence,{" "}
              <span className="bg-gradient-to-r from-[var(--brand-cyan)] via-[var(--brand-blue)] via-[var(--brand-violet)] to-[var(--brand-magenta)] bg-clip-text font-medium text-transparent">
                lot après lot.
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="space-y-24 sm:space-y-32">
          {[
            {
              n: "01",
              t: "Synthèse SPPS Fmoc",
              d: "Partenaires audités, synthèse en phase solide selon les standards les plus stricts. Rien n'est laissé au hasard.",
              c: "var(--brand-cyan)",
            },
            {
              n: "02",
              t: "Contrôle HPLC & MS",
              d: "Chaque lot analysé par chromatographie en phase inverse, identité validée par spectrométrie de masse. Pureté ≥ 99 %.",
              c: "var(--brand-violet)",
            },
            {
              n: "03",
              t: "Certificat d'analyse",
              d: "CoA consultable en ligne avec clé de vérification publique. Traçabilité complète, documentation auditable.",
              c: "var(--brand-magenta)",
            },
          ].map((step, i) => (
            <Reveal key={step.n} delay={i * 80}>
              <div className="grid items-start gap-8 sm:grid-cols-[auto_1fr] sm:gap-16">
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-display text-[80px] font-extralight leading-none tracking-tighter sm:text-[120px]"
                    style={{
                      background: `linear-gradient(180deg, ${step.c} 0%, color-mix(in oklab, ${step.c} 20%, transparent) 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {step.n}
                  </span>
                </div>
                <div className="max-w-xl pt-4 sm:pt-8">
                  <h3 className="font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                    {step.t}
                  </h3>
                  <p className="mt-5 text-lg font-light leading-relaxed text-muted-foreground">
                    {step.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ============ FINAL CTA — QUIET ============ */}
      <section className="mx-auto max-w-4xl px-8 pb-32 sm:pb-40">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Prêt à commander</span>
            <h2 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tighter text-foreground sm:text-6xl">
              La sérénité du laboratoire,{" "}
              <span className="bg-gradient-to-r from-[var(--brand-cyan)] via-[var(--brand-blue)] via-[var(--brand-violet)] to-[var(--brand-magenta)] bg-clip-text font-medium text-transparent">
                à portée de commande.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-muted-foreground">
              Traçabilité complète, expédition sous 24 h, support français.
            </p>
            <Link
              to="/produits"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 font-display text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              Voir le catalogue
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ RUO REMINDER — QUIET ============ */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-3xl px-8 py-24 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/80">
              <span className="size-1.5 rounded-full bg-accent" />
              Research Use Only
            </div>
            <h2 className="mt-8 font-display text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl">
              Avis réglementaire — RUO
            </h2>
            <p className="mt-6 text-[15px] leading-[1.75] text-muted-foreground">
              Les produits commercialisés par Peptinium Labs sont des{" "}
              <strong className="font-medium text-foreground">réactifs chimiques destinés à la recherche scientifique in vitro</strong>{" "}
              en environnement de laboratoire contrôlé. Ils ne sont pas destinés ni adaptés à un
              usage vétérinaire, diagnostique, thérapeutique, alimentaire ou cosmétique.
            </p>
          </Reveal>
        </div>
      </section>
      </div>
    </SiteLayout>
  );
}

function MobileHome({ featured, rest }: { featured: typeof products[number]; rest: typeof products }) {
  const mobileProducts = [featured, ...rest].slice(0, 5);

  return (
    <div className="mobile-experience">
      <Hero />


      <section className="px-5 py-12">
        <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          — Sélection laboratoire
        </div>
        <h2 className="mt-3 max-w-[620px] font-display text-[32px] font-semibold leading-[1.05] tracking-tight text-foreground">
          Réactifs haute pureté prêts pour vos protocoles.
        </h2>
        <div className="mt-7 grid gap-4">
          {mobileProducts.map((product) => (
            <MobileProductCard key={product.slug} product={product} />
          ))}
        </div>
        <Link
          to="/produits"
          className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full brand-gradient-bg px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_44px_-18px_oklch(0.55_0.22_296/0.58)]"
        >
          Voir tout le catalogue →
        </Link>
      </section>

      <section className="border-y border-border bg-surface px-5 py-12">
        <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          — Pourquoi Peptinium
        </div>
        <h2 className="mt-3 font-display text-[30px] font-semibold leading-[1.08] tracking-tight text-foreground">
          Une exigence de laboratoire, pensée pour le chercheur.
        </h2>
        <div className="mt-7 space-y-3">
          {[
            ["01", "Pureté vérifiée", "HPLC en phase inverse et validation par spectrométrie de masse."],
            ["02", "Traçabilité totale", "Numéro de lot, documentation auditable et CoA disponible pour chaque flacon."],
            ["03", "Support recherche", "MSDS, protocoles labo et conseils de reconstitution sur demande."],
          ].map(([n, title, body]) => (
            <div key={n} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">— {n}</div>
              <h3 className="mt-3 font-display text-[22px] font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_24px_58px_-32px_oklch(0.55_0.06_250/0.24)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(90% 80% at 100% 0%, color-mix(in oklab, var(--brand-violet) 16%, transparent) 0%, transparent 60%), radial-gradient(90% 80% at 0% 100%, color-mix(in oklab, var(--brand-cyan) 14%, transparent) 0%, transparent 65%)",
            }}
          />
          <div className="relative">
            <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
              — Prêt à commander
            </div>
             <h2 className="mt-3 font-display text-[28px] font-semibold leading-[1.08] tracking-tight text-foreground">
              Passez commande avec la sérénité du labo.
            </h2>
            <p className="mt-4 text-[16px] leading-[1.55] text-muted-foreground">
              Certificat d'Analyse, traçabilité complète et expédition rapide.
            </p>
            <Link
              to="/produits"
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full brand-gradient-bg px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Explorer les peptides →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface px-5 py-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/80">
          <span className="size-2 rounded-full bg-accent" />
          Research Use Only
        </div>
        <h2 className="mt-5 font-display text-[26px] font-semibold leading-[1.1] tracking-tight text-foreground">
          Avis réglementaire RUO
        </h2>
        <p className="mt-4 text-[15px] leading-[1.65] text-muted-foreground">
          Les produits Peptinium Labs sont des réactifs chimiques destinés exclusivement à la recherche scientifique in vitro en laboratoire contrôlé.
        </p>
      </section>
    </div>
  );
}

function MobileProductCard({ product }: { product: typeof products[number] }) {
  const hasMultiple = product.variants.length > 1;
  const price = Math.min(...product.variants.map((v) => v.price));

  return (
    <Link
      to="/produits/$slug"
      params={{ slug: product.slug }}
      className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
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
      </div>
      <div className="flex min-w-0 flex-col py-1">
        <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
          {product.category}
        </div>
        <h3 className="mt-1 font-display text-[19px] font-semibold leading-[1.15] tracking-tight text-foreground">
          {product.name}
        </h3>
        <div className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
          {hasMultiple ? product.variants.map((v) => v.dosage).join(" · ") : product.variants[0].dosage}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Dès
            </div>
            <div className="font-display text-[22px] font-semibold leading-none text-foreground">
              {formatPrice(price)}
            </div>
          </div>
          <span className="shrink-0 font-mono text-[12px] uppercase tracking-[0.12em] text-accent">
            Fiche →
          </span>
        </div>
      </div>
    </Link>
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
  "Tesamorelin 10 mg",
  "Eau bactériostatique 30 mL",
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
            <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
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
      className="group relative block overflow-hidden rounded-[40px] border border-border bg-card shadow-[0_40px_100px_-40px_oklch(0.55_0.06_250/0.22)] transition-shadow duration-700 hover:shadow-[0_60px_140px_-40px_oklch(0.55_0.06_250/0.32)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 25% 40%, color-mix(in oklab, var(--brand-cyan) 14%, transparent) 0%, transparent 60%), radial-gradient(50% 60% at 80% 70%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 0%, transparent 65%)",
        }}
      />

      <div className="relative grid gap-8 p-8 sm:grid-cols-[1.1fr_1fr] sm:items-center sm:gap-4 sm:p-14">
        {/* 3D Vial */}
        <div className="relative h-[380px] w-full sm:h-[520px]">
          <Vial3D className="absolute inset-0" />
        </div>

        {/* Text */}
        <div className="relative">
          <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Produit phare
          </div>
          <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tighter text-foreground transition-colors group-hover:text-accent sm:text-6xl">
            {featured.name}
          </h2>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            CAS {featured.cas} · {featured.molecularWeight}
          </p>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-muted-foreground sm:text-base">
            {featured.shortDescription}
          </p>
          <div className="mt-10 flex items-end justify-between border-t border-border/60 pt-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                À partir de
              </div>
              <div className="mt-1 font-display text-3xl font-light tracking-tight text-foreground">
                {formatPrice(Math.min(...featured.variants.map((v) => v.price)))}
              </div>
            </div>
            <span className="inline-flex items-center gap-2 font-display text-sm font-medium text-foreground transition-transform duration-500 group-hover:translate-x-1">
              Voir la fiche <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

