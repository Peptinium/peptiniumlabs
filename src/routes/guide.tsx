import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import {
  Calculator,
  Scale,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const SITE_URL = "https://peptinium.com";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Guide — Calculatrice, comparateur, études · Peptinium Labs" },
      {
        name: "description",
        content:
          "Toutes les ressources Peptinium Labs réunies : calculatrice de reconstitution, comparateur de peptides, bibliographie PubMed, process de fabrication, contrôle de fioles, FAQ.",
      },
      { property: "og:title", content: "Guide Peptinium Labs — Outils & ressources" },
      {
        property: "og:description",
        content:
          "Calculatrice, comparateur, études scientifiques, process de fabrication, contrôle qualité, FAQ. Tout ce qu'il faut pour la recherche.",
      },
      { property: "og:url", content: `${SITE_URL}/guide` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/guide` }],
  }),
  component: GuidePage,
});

const tools = [
  {
    to: "/calculatrice",
    Icon: Calculator,
    tag: "Outil",
    title: "Calculatrice de reconstitution",
    desc: "Volumes de solvant, doses par graduation, unités U-100. Précis, instantané.",
  },
  {
    to: "/comparateur",
    Icon: Scale,
    tag: "Outil",
    title: "Comparateur de peptides",
    desc: "Confrontez jusqu'à 3 molécules : indications, dosages, mécanismes, prix.",
  },
  {
    to: "/etudes-scientifiques",
    Icon: BookOpen,
    tag: "Références",
    title: "Bibliographie scientifique",
    desc: "Sélection d'études PubMed / PMC / JAMA pour chaque peptide du catalogue.",
  },
  {
    to: "/process-fabrication",
    Icon: FlaskConical,
    tag: "Laboratoire",
    title: "Process de fabrication",
    desc: "SPPS, purification HPLC, contrôles qualité. Comment un peptide arrive en fiole.",
  },
  {
    to: "/tester-fioles",
    Icon: ShieldCheck,
    tag: "Contrôle",
    title: "Tester ses fioles",
    desc: "Protocoles de vérification physique et chimique avant reconstitution.",
  },
  {
    to: "/faq",
    Icon: HelpCircle,
    tag: "Réponses",
    title: "FAQ — Questions fréquentes",
    desc: "Livraison, conservation, dosage, paiement, cadre RUO. Réponses courtes et claires.",
  },
] as const;

function GuidePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60 bg-background">
        <div className="container-prose relative px-5 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <Reveal>
            <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
              — Guide
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-[18ch] text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[76px] lg:text-[92px] lg:leading-[0.96]">
              Tout ce qu'il faut, <span className="logo-gradient-text italic font-light">au même endroit</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-[17px] leading-[1.6] text-muted-foreground">
              Outils de reconstitution, comparateur, bibliographie, process de fabrication,
              contrôle qualité et réponses. Six ressources pour cadrer votre recherche —
              sans jamais quitter Peptinium.
            </p>
          </Reveal>
        </div>
      </section>

      {/* GRID */}
      <section className="container-prose px-5 py-16 lg:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <Reveal key={t.to} delay={i * 60} className="h-full">
              <Link
                to={t.to}
                className="hover-lift group relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-xl border border-border bg-surface">
                    <t.Icon className="size-5 text-foreground/80" strokeWidth={1.6} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    {t.tag}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold leading-[1.15] tracking-tight text-foreground">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] text-muted-foreground">
                    {t.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70 group-hover:text-accent">
                  Ouvrir
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
