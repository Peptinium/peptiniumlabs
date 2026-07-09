import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { products, minPrice, formatPrice, type Product } from "@/data/products";
import { FlaskConical, HelpCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz labo — Trouver le peptide adapté à votre recherche | Peptinium Labs" },
      {
        name: "description",
        content:
          "Quiz court : indiquez votre objectif de recherche et découvrez les peptides pertinents dans notre catalogue. Usage recherche uniquement.",
      },
      { property: "og:title", content: "Quiz labo — Peptinium Labs" },
      { property: "og:description", content: "Objectif de recherche → suggestions de peptides." },
      { property: "og:url", content: "/quiz" },
    ],
    links: [{ rel: "canonical", href: "/quiz" }],
  }),
  component: QuizPage,
});

type Goal = {
  id: string;
  label: string;
  description: string;
  categories: Product["category"][];
  keywords?: string[];
};

const GOALS: Goal[] = [
  {
    id: "metabolique",
    label: "Métabolisme énergétique",
    description: "Étude in vitro de la signalisation incrétine, glucose, lipides.",
    categories: ["GLP-1/GIP"],
  },
  {
    id: "reparation",
    label: "Réparation tissulaire",
    description: "Cicatrisation, tendons, matrice extracellulaire.",
    categories: ["Réparation"],
  },
  {
    id: "cognitif",
    label: "Fonctions cognitives",
    description: "Neurotrophines, mémoire, plasticité.",
    categories: ["Cognitif"],
  },
  {
    id: "longevite",
    label: "Longévité / anti-âge",
    description: "Précurseurs NAD+, télomérase, glande pinéale.",
    categories: ["Anti-âge"],
  },
  {
    id: "croissance",
    label: "Axe croissance",
    description: "Sécrétagogues GH, IGF-1, composition corporelle.",
    categories: ["Croissance"],
  },
  {
    id: "melanocortine",
    label: "Système mélanocortine",
    description: "Pigmentation, comportement sexuel, appétit.",
    categories: ["Mélanocortine"],
  },
];

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 22%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 22%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 0%, transparent 78%)";

const GRADIENT_BTN =
  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)";

function QuizPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const suggestions = useMemo(() => {
    if (!submitted || selected.length === 0) return [];
    const cats = new Set(
      GOALS.filter((g) => selected.includes(g.id)).flatMap((g) => g.categories),
    );
    return products
      .filter((p) => !p.hidden && cats.has(p.category))
      .sort((a, b) => b.references.length - a.references.length);
  }, [submitted, selected]);

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

          <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-16 lg:px-10 sm:pt-32 sm:pb-20">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-muted" />
                Outils labo — Quiz
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-4xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[80px] sm:leading-[0.96]"
                data-shimmer="Trouvez le peptide adapté."
              >
                Trouvez le peptide adapté.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                Sélectionnez un ou plusieurs axes de recherche. Nous vous suggérons les peptides du
                catalogue correspondant à ces objectifs, triés par volume de littérature référencée.{" "}
                <span className="text-foreground">Usage recherche in vitro uniquement.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ QUIZ ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
              {/* --- Inputs --- */}
              <Reveal>
                <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card p-8 shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--brand-violet)_35%,transparent)] sm:p-10">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    aria-hidden
                    style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }}
                  />

                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    — Étape 1 · Objectifs
                  </span>
                  <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[32px]">
                    Quelle est votre ligne de recherche ?
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-muted-foreground">
                    Vous pouvez choisir plusieurs axes pour affiner les suggestions.
                  </p>

                  <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {GOALS.map((g) => {
                      const active = selected.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => toggle(g.id)}
                          className={`rounded-xl border p-4 text-left transition-all ${
                            active
                              ? "border-foreground/70 bg-background shadow-sm"
                              : "border-border/60 bg-background/60 hover:border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-[14px] font-medium text-foreground">{g.label}</div>
                            <div
                              className={`grid size-5 place-items-center rounded-full border ${
                                active ? "border-foreground bg-foreground text-background" : "border-border"
                              }`}
                            >
                              {active && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M5 12l5 5L20 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="mt-1.5 text-[12px] text-muted-foreground">{g.description}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmitted(true)}
                      disabled={selected.length === 0}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-opacity disabled:opacity-40"
                    >
                      Voir les peptides suggérés
                    </button>
                    {submitted && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelected([]);
                          setSubmitted(false);
                        }}
                        className="text-[12px] font-medium text-muted-foreground hover:text-foreground"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* --- Results --- */}
              <Reveal delay={80}>
                <div className="relative overflow-hidden rounded-[28px] border border-transparent p-[1px]" style={{ background: GRADIENT_BTN }}>
                  <div className="relative flex min-h-full flex-col rounded-[27px] bg-card px-6 py-8 sm:px-10 sm:py-10">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-70"
                      aria-hidden
                      style={{
                        background:
                          "radial-gradient(70% 60% at 80% 10%, color-mix(in oklab, var(--brand-violet) 14%, transparent), transparent 70%), radial-gradient(60% 60% at 10% 90%, color-mix(in oklab, var(--brand-cyan) 12%, transparent), transparent 70%)",
                      }}
                    />
                    <div className="relative flex-1">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        <Sparkles className="size-3.5" strokeWidth={1.6} />
                        Étape 2 · Suggestions
                      </div>

                      {!submitted ? (
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-[20px] border border-border/70 bg-card/60 p-8 text-center">
                          <HelpCircle className="size-8 text-muted-foreground" strokeWidth={1.4} />
                          <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                            Sélectionnez au moins un objectif de recherche pour obtenir des suggestions de peptides.
                          </p>
                        </div>
                      ) : suggestions.length === 0 ? (
                        <p className="mt-8 text-[14px] text-muted-foreground">
                          Aucun peptide du catalogue ne correspond à cet objectif pour l'instant.
                        </p>
                      ) : (
                        <ul className="mt-6 grid gap-3">
                          {suggestions.map((p) => (
                            <li key={p.slug}>
                              <Link
                                to="/produits/$slug"
                                params={{ slug: p.slug }}
                                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface/40 p-5 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <div className="font-display text-[17px] font-medium text-foreground">
                                    {p.name}
                                  </div>
                                  <div className="mt-1 text-[12px] text-muted-foreground">
                                    {p.shortDescription}
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    <span className="rounded-full border border-border/60 bg-background px-2 py-0.5">
                                      {p.category}
                                    </span>
                                    <span className="rounded-full border border-border/60 bg-background px-2 py-0.5">
                                      {p.references.length} réf.
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    à partir de
                                  </div>
                                  <div className="mt-1 font-display text-[18px] font-semibold text-foreground">
                                    {formatPrice(minPrice(p))}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* --- Disclaimer --- */}
            <Reveal delay={120}>
              <div className="mt-10 rounded-[20px] border border-border/70 bg-card/60 p-5">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1 inline-block size-1.5 shrink-0 rounded-full"
                    style={{ background: GRADIENT_BTN }}
                    aria-hidden
                  />
                  <p className="text-[13px] leading-[1.65] text-muted-foreground">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
                      Avertissement RUO —{" "}
                    </span>
                    Suggestions générées uniquement à partir des catégories du catalogue. Elles ne
                    constituent pas un avis scientifique ni une recommandation d'usage. Réservé à la
                    recherche.
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
