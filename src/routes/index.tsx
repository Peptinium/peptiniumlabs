import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard, ProductVisual } from "@/components/ProductCard";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";
import { HeroVela } from "@/components/HeroVela";
import { products, formatPrice } from "@/data/products";
import { ShieldCheck, Fingerprint, Truck, FlaskConical, Plus, Send, MessageCircle, Star } from "lucide-react";

import promoBacWater from "@/assets/promo-bacwater.png";
import coulisses1 from "@/assets/coulisses/coulisses-1.jpg";
import coulisses2 from "@/assets/coulisses/coulisses-2.jpg";
import coulisses3 from "@/assets/coulisses/coulisses-3.jpg";
import coulisses4 from "@/assets/coulisses/coulisses-4.jpg";
import client1Img from "@/assets/testimonials/client-1.jpg";
import client2Img from "@/assets/testimonials/client-2.jpg";
import client3Img from "@/assets/testimonials/client-3.jpg";
import client4Img from "@/assets/testimonials/client-4.jpg";


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
  const visibleProducts = products.filter((p) => !p.hidden);
  const featured = visibleProducts.find((p) => p.featured)!;
  const rest = visibleProducts.filter((p) => !p.featured);
  const bestSellers = rest.slice(0, 4);
  const moreProducts = rest.slice(4, 8);


  return (
    <SiteLayout>
      {/* ============ 1. IMMERSIVE HERO ============ */}
      <HeroVela />


      {/* ============ 2. BEST SELLERS — 4 cards + "Tout voir" pill ============ */}
      <section data-reveal-blur className="mx-auto max-w-[1400px] px-8 pt-24 sm:pt-32">
        <Reveal>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
                Meilleures ventes
              </span>
              <h2 className="mt-5 max-w-3xl shimmer-text text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[64px] sm:leading-[1.02]" data-shimmer="Des peptides de la plus haute qualité.">
                Des peptides de la plus haute qualité.
              </h2>
            </div>
            <Link
              to="/produits"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border/70 bg-card px-5 py-2.5 text-[13px] font-medium text-foreground transition-all hover:border-foreground sm:self-end"
            >
              Tout voir
              <span
                aria-hidden
                className="grid size-6 place-items-center rounded-full brand-gradient-bg text-white transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>


        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
          {[featured, ...bestSellers.slice(0, 3)].map((p, i) => (
            <Reveal key={p.slug} delay={i * 60} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 3. MORE PRODUCTS — 4 cards + centered CTA ============ */}
      <section data-reveal-blur className="mx-auto max-w-[1400px] px-8 pt-16 sm:pt-24">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
          {moreProducts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="mt-14 flex justify-center">
            <Link
              to="/produits"
              className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[14px] font-medium text-white shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_color-mix(in_oklab,var(--brand-violet)_85%,transparent)]"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)",
              }}
            >
              Voir plus de produits
              <span
                aria-hidden
                className="grid size-6 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ 4. Bac Water 3 mL — 5,90 € ============ */}
      <section data-reveal-blur className="px-6 pt-24 sm:pt-32">
        <Reveal>
          <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] border border-border/40 bg-gradient-to-br from-[#eef1ff] via-[#f5f2ff] to-[#fdf2f6]">
            <div className="grid grid-cols-1 items-center gap-8 px-8 py-14 sm:px-16 sm:py-20 md:grid-cols-2">
              <div className="flex flex-col items-start">
                <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
                  Solvant · 3 mL
                </span>
                <h2 className="mt-6 max-w-full break-words text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] shimmer-text sm:max-w-lg sm:text-[52px] sm:leading-[1.0]" data-shimmer="Eau bactériostatique 3 mL à 5,90 € seulement.">
                  Eau bactériostatique 3 mL à 5,90 € seulement.
                </h2>
                <p className="mt-6 max-w-md text-[15px] leading-[1.6] text-[#0f1d3a]/70 sm:text-[16px]">
                  Solvant de reconstitution stérile USP, idéal pour un premier essai — également disponible en flacon 10 mL.
                </p>


                <Link
                  to="/produits"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-white shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)",
                  }}
                >
                  <span className="size-1.5 rounded-full bg-white/90" aria-hidden />
                  Découvrir
                </Link>
              </div>
              <div className="relative flex items-center justify-center md:justify-end">
                <div
                  className="pointer-events-none absolute inset-0 -z-0"
                  style={{
                    background:
                      "radial-gradient(circle at 60% 50%, color-mix(in oklab, var(--brand-violet) 22%, transparent) 0%, transparent 65%)",
                  }}
                  aria-hidden
                />
                <img
                  src={promoBacWater}
                  alt="Flacon d'eau bactériostatique 3 mL Peptinium Labs"

                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="relative z-10 h-auto w-full max-w-[420px] object-contain drop-shadow-[0_30px_60px_rgba(30,20,80,0.18)]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ 5. PLUS QUE LA SCIENCE — clean background ============ */}
      <section
        data-reveal-blur
        className="relative mt-24 overflow-hidden bg-background sm:mt-32"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          aria-hidden
          style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 40%, transparent), transparent)" }}
        />
        <div className="relative mx-auto max-w-[1400px] px-8 py-24 sm:py-32">
          <Reveal>
            <div className="flex flex-col gap-6">
              <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
                — À propos de Peptinium
              </span>

              <h2 className="max-w-4xl shimmer-text text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[80px] sm:leading-[1.0]" data-shimmer="Plus que de la science.">
                Plus que de la science.
              </h2>
            </div>
            <div className="mt-10 h-px w-full bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {[
              {
                Icon: ShieldCheck,
                t: "Le plus haut standard de qualité du marché",
                d: "Nous ne nous contentons pas de la moyenne du secteur. Chaque peptide de notre catalogue est synthétisé à une pureté minimale ≥ 99 %.",
              },
              {
                Icon: Truck,
                t: "Expédition rapide & support dédié",
                d: "Commandes avant 14 h du lundi au vendredi : votre colis quitte nos installations le jour même, entièrement suivi jusqu'à la livraison.",
              },
              {
                Icon: FlaskConical,
                t: "Fabriqué selon les normes GMP",
                d: "Chaque composé est produit dans une installation certifiée, conforme aux protocoles pharmaceutiques les plus stricts.",
              },
              {
                Icon: Fingerprint,
                t: "Traçabilité complète, lot après lot",
                d: "Numéro de lot unique, CoA Janoshik indépendant, documentation auditable en ligne pour chaque flacon expédié.",
              },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 80}>
                <div className="flex flex-col gap-6">
                  <f.Icon className="size-6 text-black/80" strokeWidth={1.4} aria-hidden />
                  <div className="space-y-3">
                    <h3 className="text-[17px] font-semibold leading-[1.2] tracking-[-0.01em] text-black">
                      {f.t}
                    </h3>
                    <p className="text-[13.5px] leading-[1.6] text-black/65">{f.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



      {/* ============ 6. PROTOCOLE 01/02/03 — kept from previous version (better than Vela) ============ */}
      <section data-reveal-blur className="mx-auto max-w-6xl px-8 py-32 sm:py-40">
        <Reveal>
          <div className="mb-20 text-center">
            <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
              Le protocole
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl shimmer-text text-[40px] font-semibold leading-[1.0] tracking-[-0.03em] sm:text-[72px] sm:leading-[0.96]" data-shimmer="Une exigence, lot après lot.">
              Une exigence, lot après lot.
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
              t: "CoA indépendant Janoshik",
              d: "Chaque lot est accompagné d'un CoA Janoshik indépendant : HPLC en phase inverse et spectrométrie de masse. Pureté ≥ 99 %.",
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
                  <h3 className="text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[40px]">
                    {step.t}
                  </h3>
                  <p className="mt-5 text-[17px] leading-[1.6] text-muted-foreground">
                    {step.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 7. FAQ — accordion 2 columns ============ */}
      <section data-reveal-blur className="mx-auto max-w-[1400px] px-8 pb-32 sm:pb-40">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
          <Reveal>
            <div>
              <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
                FAQ
              </span>
              <h2 className="mt-5 shimmer-text text-[40px] font-semibold leading-[1.0] tracking-[-0.03em] sm:text-[56px] sm:leading-[0.98]" data-shimmer="Foire aux questions.">
                Foire aux questions.
              </h2>
              <p className="mt-6 max-w-sm text-[15px] leading-[1.65] text-muted-foreground">
                Vous ne trouvez pas la réponse que vous cherchez ? Parlez à notre équipe.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium text-white shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_color-mix(in_oklab,var(--brand-violet)_85%,transparent)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)",
                  }}
                >
                  Nous contacter
                  <span aria-hidden className="grid size-5 place-items-center rounded-full bg-white/20">→</span>
                </Link>

                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-foreground"
                >
                  Voir toutes les FAQ
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="divide-y divide-border/60 border-y border-border/60">
              {[
                {
                  q: "Que faire si je ne trouve pas un produit dans votre catalogue ?",
                  a: "Contactez-nous directement par e-mail ou via notre formulaire. Nous faisons de notre mieux pour sourcer des peptides spécifiques sur demande et nous vous orienterons vers la meilleure solution disponible dans notre réseau de partenaires audités.",
                },
                {
                  q: "Proposez-vous des remises quantité ?",
                  a: "Oui. Sur le Retatrutide 10 mg : −5 % dès 3 flacons et −10 % dès 6 flacons, appliqués automatiquement au panier. Pour des volumes plus importants ou des commandes récurrentes, contactez-nous.",
                },
                {
                  q: "Que faire si mon colis est endommagé ou manquant ?",
                  a: "Signalez-nous le problème sous 48 h avec photos à l'appui. Nous procédons à un remplacement ou remboursement immédiat après vérification.",
                },
                {
                  q: "Puis-je créer un compte professionnel ?",
                  a: "Oui. Créez votre compte, puis contactez notre équipe pour obtenir le statut « compte laboratoire » avec facturation dédiée et tarifs volume.",
                },
                {
                  q: "Quel est le délai de livraison en France ?",
                  a: "Expédition sous 24 h ouvrées, livraison en 24-48 h en France métropolitaine via transporteur suivi.",
                },
              ].map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>




      {/* ============ FINAL CTA — QUIET ============ */}
      <section data-reveal-blur className="mx-auto max-w-4xl px-8 pb-32 sm:pb-40">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
              Prêt à commander
            </span>
            <h2 className="shimmer-text mt-6 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[68px] sm:leading-[1.02]" data-shimmer="La sérénité du laboratoire, à portée de commande.">
              La sérénité du laboratoire, à portée de commande.
            </h2>

            <p className="mt-7 max-w-lg text-[17px] leading-[1.6] text-muted-foreground">
              Traçabilité complète, expédition sous 24 h, support français.
            </p>
            <Link
              to="/produits"
              className="group mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-[14px] font-medium text-white shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)",
              }}
            >
              Voir le catalogue
              <span aria-hidden className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0.5">→</span>
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
    </SiteLayout>

  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
        <span className="text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-foreground sm:text-[19px]">
          {q}
        </span>
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border border-border/70 text-foreground/70 transition-all group-open:rotate-45 group-open:border-foreground group-open:bg-foreground group-open:text-background"
        >
          <Plus className="size-4" strokeWidth={1.6} />
        </span>
      </summary>
      <p className="mt-4 max-w-2xl pr-14 text-[14.5px] leading-[1.7] text-muted-foreground">
        {a}
      </p>
    </details>
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
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-30px_oklch(0.55_0.06_250/0.18)] transition-shadow hover:shadow-[0_40px_80px_-30px_oklch(0.55_0.06_250/0.24)]"
    >
      {/* header */}
      <div className="relative overflow-hidden border-b border-border bg-surface-2">
        <div className="pointer-events-none absolute inset-0 opacity-20 grid-bg" />
        <div className="relative flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/80 sm:text-[10px] sm:tracking-[0.22em]">
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
