import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { ExternalLink, MapPin, Clock, Wallet, Beaker, PackageCheck, FileCheck2, Send } from "lucide-react";

export const Route = createFileRoute("/tester-fioles")({
  head: () => ({
    meta: [
      { title: "Comparateur des laboratoires d'analyse peptides — Janoshik, ChemRx, Colmaric · Peptinium" },
      {
        name: "description",
        content:
          "Comparez les 3 laboratoires indépendants qui analysent vos fioles de peptides de recherche : Janoshik (UE), ChemRx et Colmaric (US). Tarifs, délais, méthodes analytiques et procédure d'envoi.",
      },
      { property: "og:title", content: "Comparateur des laboratoires d'analyse — Peptinium Labs" },
      { property: "og:description", content: "Janoshik · ChemRx · Colmaric — trois labos indépendants comparés côte à côte." },
      { property: "og:url", content: "/tester-fioles" },
    ],
    links: [{ rel: "canonical", href: "/tester-fioles" }],
  }),
  component: TestVialsPage,
});

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 22%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 22%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 0%, transparent 78%)";

const GRADIENT =
  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)";

type Lab = {
  key: "janoshik" | "chemrx" | "colmaric";
  name: string;
  region: string;
  flag: string;
  url: string;
  positioning: string;
  priceMin: number;
  priceMax: number;
  priceNote: string;
  turnaround: string;
  methods: string[];
  pros: string[];
  cons: string[];
  verdict: string;
  recommended?: boolean;
  accent: string;
};

const labs: Lab[] = [
  {
    key: "janoshik",
    name: "Janoshik Analytical",
    region: "Prague · Union Européenne",
    flag: "🇨🇿",
    url: "https://www.janoshik.com/",
    positioning: "Le gold standard européen",
    priceMin: 215,
    priceMax: 360,
    priceNote: "USD par test · BPC-157 ≈ 215 · GLP-1 ≈ 360",
    turnaround: "5–10 jours ouvrés",
    methods: ["HPLC-UV phase inverse", "Spectrométrie de masse", "Quantification gravimétrique", "Endotoxines (option)"],
    pros: [
      "Clé de vérification publique sur chaque CoA",
      "Rapports les plus complets du marché",
      "Envoi intra-UE : pas de douane",
    ],
    cons: [
      "Tarifs plus élevés",
      "Files d'attente en périodes de pic",
    ],
    verdict: "Le choix par défaut si vous êtes en Europe. Les CoA sont ceux que la communauté prend pour référence.",
    recommended: true,
    accent: "var(--brand-violet)",
  },
  {
    key: "chemrx",
    name: "ChemRx Analytical",
    region: "Floride · États-Unis",
    flag: "🇺🇸",
    url: "https://chemrx.com/",
    positioning: "Le meilleur rapport qualité/prix",
    priceMin: 129,
    priceMax: 238,
    priceNote: "USD · souvent gratuit sur peptides courants",
    turnaround: "7–14 jours ouvrés",
    methods: ["HPLC", "LC-MS", "Endotoxines (option)", "Stérilité (option)"],
    pros: [
      "Tarifs très accessibles",
      "Analyses gratuites récurrentes",
      "Suivi de commande en ligne",
    ],
    cons: [
      "Douane + délais si envoi UE→US",
      "Rapports moins normalisés que Janoshik",
    ],
    verdict: "Idéal pour multiplier les analyses sans exploser le budget, surtout si vous êtes déjà aux USA.",
    accent: "var(--brand-cyan)",
  },
  {
    key: "colmaric",
    name: "Colmaric Analyticals",
    region: "États-Unis",
    flag: "🇺🇸",
    url: "https://colmaric.com/",
    positioning: "Le panel analytique le plus large",
    priceMin: 60,
    priceMax: 110,
    priceNote: "USD par échantillon selon panel",
    turnaround: "10–15 jours ouvrés",
    methods: ["HPLC", "Spectrométrie de masse", "Quantification", "Bioburden / endotoxines"],
    pros: [
      "Prix d'entrée les plus bas",
      "Panel microbio disponible",
      "Bon pour multi-tests groupés",
    ],
    cons: [
      "Délais un peu plus longs",
      "Moins connu de la communauté",
    ],
    verdict: "Pour un contrôle qualité étendu (contaminants microbiens) sur un même échantillon.",
    accent: "var(--brand-magenta)",
  },
];

function TestVialsPage() {
  return (
    <SiteLayout>
      <div className="bg-background text-foreground">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: SWEEPS }} />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            aria-hidden
            style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }}
          />

          <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-16 lg:px-10 sm:pt-32 sm:pb-24">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-muted" />
                Outils labo — Analyse indépendante
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-5xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[88px] sm:leading-[0.94]"
                data-shimmer="Comparez 3 laboratoires. Choisissez le vôtre."
              >
                Comparez 3 laboratoires. Choisissez le vôtre.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
                <p className="text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                  Faire re-tester une fiole par un laboratoire indépendant est la seule manière
                  d'authentifier un lot. On liste ici les trois labos qui comptent dans la
                  communauté — <span className="text-foreground">Janoshik, ChemRx, Colmaric</span> —
                  avec leurs tarifs, délais et spécialités, sans langue de bois.
                </p>
                <div className="flex flex-wrap items-end gap-3 self-end">
                  {["3 laboratoires", "60–360 USD", "5–15 jours"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/70 bg-card px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ COMPARATIF — 3 colonnes stacked cards ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-24">
            <Reveal>
              <div className="mb-14 flex flex-col gap-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Côte à côte</span>
                <h2 className="shimmer-text max-w-3xl text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px]" data-shimmer="Le comparatif honnête.">
                  Le comparatif honnête.
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-5">
              {labs.map((lab, i) => (
                <Reveal key={lab.key} delay={i * 80}>
                  <article
                    className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-transparent p-[1px]"
                    style={{ background: GRADIENT }}
                  >
                    <div className="relative flex h-full flex-col gap-6 rounded-[23px] bg-card p-8">
                      {lab.recommended && (
                        <span
                          className="absolute right-6 top-6 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white"
                          style={{ background: GRADIENT }}
                        >
                          Recommandé UE
                        </span>
                      )}

                      {/* Header */}
                      <header>
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                          <MapPin className="size-3.5" strokeWidth={1.6} />
                          {lab.region}
                        </div>
                        <h3
                          className="mt-3 font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground"
                          style={{
                            backgroundImage: lab.recommended ? GRADIENT : undefined,
                            WebkitBackgroundClip: lab.recommended ? "text" : undefined,
                            WebkitTextFillColor: lab.recommended ? "transparent" : undefined,
                            backgroundClip: lab.recommended ? "text" : undefined,
                          }}
                        >
                          {lab.name}
                        </h3>
                        <p className="mt-2 text-[13.5px] text-muted-foreground">
                          {lab.positioning}
                        </p>
                      </header>

                      {/* Price + delay */}
                      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-background p-4">
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                            <Wallet className="size-3" strokeWidth={1.6} />
                            Prix
                          </div>
                          <div className="mt-1.5 font-display text-[22px] font-semibold leading-none tracking-[-0.02em] text-foreground">
                            {lab.priceMin}–{lab.priceMax}
                            <span className="ml-1 text-[12px] font-mono uppercase tracking-[0.18em] text-muted-foreground">USD</span>
                          </div>
                          <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{lab.priceNote}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                            <Clock className="size-3" strokeWidth={1.6} />
                            Délai
                          </div>
                          <div className="mt-1.5 font-display text-[16px] font-medium leading-tight text-foreground">
                            {lab.turnaround}
                          </div>
                        </div>
                      </div>

                      {/* Methods */}
                      <div>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                          <Beaker className="size-3.5" strokeWidth={1.6} />
                          Méthodes
                        </div>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {lab.methods.map((m) => (
                            <li
                              key={m}
                              className="rounded-full border border-border/70 bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                            >
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pros / Cons */}
                      <div className="grid grid-cols-2 gap-4 border-y border-border py-5">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">+ Points forts</div>
                          <ul className="mt-2 space-y-1.5 text-[12.5px] leading-[1.5] text-muted-foreground">
                            {lab.pros.map((p) => (
                              <li key={p} className="flex gap-1.5"><span style={{ color: lab.accent }}>◆</span>{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">− À noter</div>
                          <ul className="mt-2 space-y-1.5 text-[12.5px] leading-[1.5] text-muted-foreground">
                            {lab.cons.map((c) => (
                              <li key={c} className="flex gap-1.5"><span className="text-muted-foreground/60">◇</span>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Verdict */}
                      <p className="text-[13.5px] leading-[1.6] text-foreground/85">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Verdict — </span>
                        {lab.verdict}
                      </p>

                      {/* CTA */}
                      <a
                        href={lab.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-auto inline-flex items-center justify-between gap-2 rounded-full border border-border/70 bg-background px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground transition-all hover:border-foreground"
                      >
                        Visiter le site
                        <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.6} />
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TIMELINE PROCEDURE ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-28">
            <Reveal>
              <div className="mb-14 flex flex-col gap-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— La procédure, étape par étape</span>
                <h2 className="shimmer-text max-w-3xl text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px]" data-shimmer="Envoyer une fiole en 4 étapes.">
                  Envoyer une fiole en 4 étapes.
                </h2>
              </div>
            </Reveal>

            <div className="relative">
              {/* Vertical connecting line on desktop */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px sm:block"
                style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--brand-cyan) 60%, transparent), color-mix(in oklab, var(--brand-violet) 60%, transparent) 50%, color-mix(in oklab, var(--brand-magenta) 60%, transparent))" }}
              />

              <ol className="space-y-10 sm:space-y-14">
                {[
                  { Icon: Beaker, t: "Choisir le laboratoire", d: "Selon votre pays (Janoshik en UE, ChemRx / Colmaric aux US), votre budget et le panel analytique voulu — pureté seule, ou pureté + endotoxines, etc." },
                  { Icon: FileCheck2, t: "Créer la commande d'analyse", d: "Sur le site du labo choisi, créez un compte de recherche, sélectionnez le test, payez en ligne. Vous recevez l'adresse d'expédition et un numéro de tâche à inscrire sur le colis." },
                  { Icon: Send, t: "Préparer et expédier", d: "Fiole lyophilisée dans un emballage rigide, formulaire d'accompagnement joint, courrier suivi. Une fiole non reconstituée voyage sans problème à l'international." },
                  { Icon: PackageCheck, t: "Recevoir le CoA", d: "Sous 5–15 jours ouvrés, Certificat d'Analyse signé avec pureté HPLC, masse mesurée et clé de vérification publique. Le rapport se contre-vérifie directement sur le portail du labo." },
                ].map((s, i) => (
                  <Reveal key={s.t} delay={i * 70}>
                    <li className="relative flex flex-col gap-5 sm:flex-row sm:gap-8 sm:pl-0">
                      <div className="flex shrink-0 items-start gap-4">
                        <div
                          className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-border/70 bg-background text-foreground"
                          style={{ boxShadow: "0 8px 24px -10px color-mix(in oklab, var(--brand-violet) 40%, transparent)" }}
                        >
                          <s.Icon className="size-5" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                            Étape {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="mt-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[30px]">
                          {s.t}
                        </h3>
                        <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-muted-foreground">{s.d}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ============ RUO reminder ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 sm:py-20">
            <Reveal>
              <div
                className="relative overflow-hidden rounded-[24px] border border-border/70 bg-card p-8 sm:p-12"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  aria-hidden
                  style={{
                    background:
                      "radial-gradient(60% 60% at 90% 10%, color-mix(in oklab, var(--brand-magenta) 14%, transparent), transparent 70%), radial-gradient(60% 60% at 10% 90%, color-mix(in oklab, var(--brand-cyan) 12%, transparent), transparent 70%)",
                  }}
                />
                <div className="relative">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Rappel RUO</span>
                  <h2 className="mt-3 max-w-3xl text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[38px]">
                    Vérifier, c'est de la <span style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>science</span>. Pas une validation d'usage.
                  </h2>
                  <p className="mt-5 max-w-3xl text-[14.5px] leading-[1.7] text-muted-foreground">
                    Faire tester une fiole s'inscrit dans le contrôle qualité des réactifs de
                    recherche. Le CoA obtenu ne valide en aucun cas une utilisation vétérinaire,
                    diagnostique ou thérapeutique. Les peptides Peptinium Labs sont réservés à la
                    recherche scientifique in vitro, en cadre exclusivement professionnel.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
