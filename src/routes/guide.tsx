import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { CalendarClock, Calculator, MessageCircle, Lock, ArrowRight } from "lucide-react";

const SITE_URL = "https://peptinium.com";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Guide — Protocole, calcul de dose, assistant · Peptinium Labs" },
      {
        name: "description",
        content:
          "Trois modules pour cadrer la recherche : calendrier de protocole, calculateur de reconstitution, assistant pratique. Guide de démarrage réservé aux clients Peptinium.",
      },
      { property: "og:title", content: "Guide Peptinium Labs — 3 modules, 1 objectif" },
      {
        property: "og:description",
        content:
          "Choisir un protocole, doser à partir de la fiole, poser une question logistique. Trois outils pour la recherche in vitro.",
      },
      { property: "og:url", content: `${SITE_URL}/guide` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/guide` }],
  }),
  component: GuidePage,
});

const modules = [
  {
    step: "01 · Choisir",
    to: "/calculatrice" as const,
    Icon: CalendarClock,
    tag: "Protocole",
    title: "Calendrier de protocole",
    desc: "Sélectionne une molécule et une date de début, suis la progression semaine par semaine. Schémas issus d'études publiées.",
    cta: "Voir un protocole",
    live: false,
  },
  {
    step: "02 · Doser",
    to: "/calculatrice" as const,
    Icon: Calculator,
    tag: "Reconstitution",
    title: "Calculateur de reconstitution",
    desc: "Une fois le protocole choisi, convertis la dose en unités de seringue à partir des données de ta fiole. Calcul déterministe.",
    cta: "Calculer la dose",
    live: true,
  },
  {
    step: "03 · Demander",
    to: "/avis-contact" as const,
    Icon: MessageCircle,
    tag: "En développement",
    title: "Assistant pratique",
    desc: "Conservation, matériel, livraison : des réponses sourcées depuis notre base de connaissances Peptinium, à tout moment.",
    cta: "Créer un compte",
    live: false,
  },
] as const;

function GuidePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60 bg-background">
        <div className="container-prose relative px-5 pt-24 pb-16 lg:pt-32 lg:pb-20">
          <Reveal>
            <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
              — Guides recherche Peptinium
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-[16ch] text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[76px] lg:text-[92px] lg:leading-[0.96]">
              3 outils. <span className="logo-gradient-text italic font-light">1 objectif.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-muted-foreground">
              Commence par choisir un protocole, puis calcule ta dose à partir de la fiole.
              L'assistant répond aux questions logistiques (conservation, matériel, livraison).
              Aucun conseil médical — uniquement de la mathématique, des données publiques et de la pratique.
            </p>
          </Reveal>
        </div>
      </section>

      {/* LOCKED : Guide de démarrage */}
      <section className="border-b border-border/60 bg-surface/40">
        <div className="container-prose px-5 py-16 lg:py-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 lg:p-12">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                <Lock className="size-3.5" strokeWidth={2} />
                Accès réservé · Première commande requise
              </div>
              <h2 className="mt-6 max-w-[22ch] font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
                Le Guide de démarrage se débloque après ta première commande.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-muted-foreground">
                Réservé aux clients Peptinium. Plus de 5 vidéos pas-à-pas t'attendent à l'intérieur —
                du colis à ta première seringue. Passe ta première commande pour tout débloquer.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/produits"
                  className="brand-gradient-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Voir la boutique
                  <ArrowRight className="size-4" strokeWidth={2} />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface"
                >
                  J'ai déjà un compte
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 MODULES */}
      <section className="container-prose px-5 py-16 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Reveal key={m.step} delay={i * 80} className="h-full">
              <Link
                to={m.to}
                className="hover-lift group relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60">
                    {m.step}
                  </span>
                  {m.live ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                      <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      {m.tag}
                    </span>
                  )}
                </div>

                <div className="grid size-12 place-items-center rounded-xl border border-border bg-surface">
                  <m.Icon className="size-5 text-foreground/80" strokeWidth={1.6} />
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold leading-[1.15] tracking-tight text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.65] text-muted-foreground">
                    {m.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70 group-hover:text-accent">
                  {m.cta}
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-16 text-center text-xs text-muted-foreground">
          Les produits proposés sur ce site sont destinés exclusivement à la recherche scientifique
          in vitro. Aucun usage humain ou vétérinaire.
        </p>
      </section>
    </SiteLayout>
  );
}
