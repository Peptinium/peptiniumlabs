import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { FlaskConical, Scissors, Filter, Snowflake, TestTube2, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/process-fabrication")({
  head: () => ({
    meta: [
      { title: "Process de fabrication — Synthèse SPPS, purification HPLC & contrôle qualité · Peptinium" },
      {
        name: "description",
        content:
          "Comment nos partenaires labo fabriquent chaque peptide : synthèse SPPS Fmoc, clivage, purification HPLC préparative ≥ 99 %, lyophilisation, contrôle HPLC-UV / LC-MS, conditionnement stérile.",
      },
      { property: "og:title", content: "Process de fabrication — Peptinium Labs" },
      { property: "og:description", content: "SPPS Fmoc, HPLC ≥ 99 %, LC-MS, endotoxines. Le process réel derrière chaque flacon." },
      { property: "og:url", content: "/process-fabrication" },
    ],
    links: [{ rel: "canonical", href: "/process-fabrication" }],
  }),
  component: ProcessPage,
});

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 20%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 20%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 12%, transparent) 0%, transparent 78%)";

const STEPS = [
  {
    Icon: FlaskConical,
    title: "Synthèse en phase solide (SPPS Fmoc)",
    d: "La chaîne peptidique est assemblée un acide aminé à la fois sur une résine polymère, selon la méthode Merrifield (Nobel 1984) en chimie Fmoc. Chaque couplage est suivi d'un lavage en excès de solvant. Le rendement dépasse 99,5 % par cycle, ce qui est indispensable pour des séquences longues comme le Retatrutide (39 résidus).",
    detail: "≥ 99,5 %/cycle · résines Wang / Rink Amide",
  },
  {
    Icon: Scissors,
    title: "Clivage & déprotection",
    d: "Une fois la séquence complète, le peptide brut est décroché de la résine à l'aide d'un cocktail TFA (acide trifluoroacétique) qui retire simultanément les groupes protecteurs des chaînes latérales. La solution obtenue contient le peptide et les impuretés de synthèse (peptides tronqués, sels, résidus de scavenger).",
    detail: "TFA / EDT / TIS / H₂O · 2–3 h",
  },
  {
    Icon: Filter,
    title: "Purification HPLC préparative",
    d: "Le peptide brut passe sur une colonne C18 en phase inverse, sous gradient eau / acétonitrile + 0,1 % TFA. Les fractions sont collectées et analysées par HPLC analytique. Seules celles présentant une pureté ≥ 99 % sont retenues et regroupées. Cette étape est le vrai différenciateur qualitatif entre fournisseurs.",
    detail: "Colonne C18 · gradient ACN/H₂O + 0,1 % TFA",
  },
  {
    Icon: Snowflake,
    title: "Lyophilisation sous vide",
    d: "Les fractions pures sont congelées à −80 °C puis lyophilisées sous vide poussé. L'eau sublime directement, laissant un solide amorphe poreux stable plusieurs années à −20 °C. Le lyophilisat est pesé au 0,1 mg près pour garantir le dosage annoncé sur le flacon.",
    detail: "≤ 0,05 mbar · résiduel H₂O < 1 %",
  },
  {
    Icon: TestTube2,
    title: "Contrôle qualité analytique",
    d: "Chaque lot est analysé indépendamment par HPLC-UV (pureté), LC-MS haute résolution (identité, masse molaire ± 1 Da) et, sur demande, dosage endotoxines LAL et bioburden. Le rapport est signé et une clé de vérification unique est générée pour chaque CoA Janoshik.",
    detail: "HPLC-UV · LC-MS · LAL (option)",
  },
  {
    Icon: PackageCheck,
    title: "Conditionnement stérile & traçabilité",
    d: "Le peptide est réparti sous flux laminaire ISO 5 dans des flacons ambrés stériles, bouché caoutchouc bromobutyle, serti aluminium. Chaque flacon reçoit un numéro de lot unique, gravé et imprimé, qui donne accès au CoA via notre page de traçabilité.",
    detail: "Flacons ISO 5 · lot unique + CoA lié",
  },
];

function ProcessPage() {
  return (
    <SiteLayout>
      <div className="bg-background text-foreground">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: SWEEPS }} />
          <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-16 lg:px-10 sm:pt-32 sm:pb-24">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                Process de fabrication — Partenaires labo
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-5xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[88px] sm:leading-[0.94]"
                data-shimmer="Comment vos peptides sont fabriqués."
              >
                Comment vos peptides sont fabriqués.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-3xl text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                Nos peptides sont synthétisés en Europe par des laboratoires GMP-friendly certifiés,
                selon un protocole industriel identique à celui des grands fournisseurs académiques
                (Bachem, Sigma-Aldrich, Tocris). Voici les <span className="text-foreground">6 étapes clés</span>,
                sans marketing.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-28">
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px sm:block"
                style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--brand-cyan) 60%, transparent), color-mix(in oklab, var(--brand-violet) 60%, transparent) 50%, color-mix(in oklab, var(--brand-magenta) 60%, transparent))" }}
              />
              <ol className="space-y-12 sm:space-y-16">
                {STEPS.map((s, i) => (
                  <Reveal key={s.title} delay={i * 60}>
                    <li className="relative flex flex-col gap-5 sm:flex-row sm:gap-8">
                      <div className="flex shrink-0 items-start gap-4">
                        <div
                          className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-border/70 bg-background text-foreground"
                          style={{ boxShadow: "0 8px 24px -10px color-mix(in oklab, var(--brand-violet) 40%, transparent)" }}
                        >
                          <s.Icon className="size-5" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                            Étape {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                            {s.detail}
                          </span>
                        </div>
                        <h3 className="mt-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[30px]">
                          {s.title}
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

        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 sm:py-20">
            <Reveal>
              <div className="relative overflow-hidden rounded-[24px] border border-border/70 bg-card p-8 sm:p-12">
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  aria-hidden
                  style={{
                    background:
                      "radial-gradient(60% 60% at 90% 10%, color-mix(in oklab, var(--brand-magenta) 14%, transparent), transparent 70%), radial-gradient(60% 60% at 10% 90%, color-mix(in oklab, var(--brand-cyan) 12%, transparent), transparent 70%)",
                  }}
                />
                <div className="relative">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Traçabilité</span>
                  <h2 className="mt-3 max-w-3xl text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[38px]">
                    De la résine au flacon — chaque lot est <span style={{ backgroundImage: "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>identifiable</span>.
                  </h2>
                  <p className="mt-5 max-w-3xl text-[14.5px] leading-[1.7] text-muted-foreground">
                    Chaque flacon porte un numéro de lot unique. Ce numéro pointe vers un CoA Janoshik
                    Analytical vérifiable indépendamment via une clé publique. Aucun peptide n'est expédié
                    sans avoir passé les 6 étapes, sans exception.
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
