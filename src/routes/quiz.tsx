import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { products, minPrice, formatPrice, type Product } from "@/data/products";

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
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50 [animation:grid-drift_24s_linear_infinite]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,var(--background)_85%)]" />
        <div className="container-prose relative py-14">
          <RuoBadge />
          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            <span className="shimmer-text" data-shimmer="Quiz labo">Quiz labo</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Sélectionnez un ou plusieurs axes de recherche. Nous vous suggérons les peptides du
            catalogue correspondant à ces objectifs, triés par volume de littérature référencée.
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="rounded-2xl border border-border/60 bg-surface/40 p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Étape 1 · Objectifs de recherche
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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

          <div className="mt-6 flex flex-wrap items-center gap-3">
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

        {submitted && (
          <div className="mt-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Étape 2 · {suggestions.length} suggestion{suggestions.length > 1 ? "s" : ""}
            </div>
            {suggestions.length === 0 ? (
              <p className="mt-5 text-[14px] text-muted-foreground">
                Aucun peptide du catalogue ne correspond à cet objectif pour l'instant.
              </p>
            ) : (
              <ul className="mt-5 grid gap-3">
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
        )}

        <p className="mt-10 text-[12px] leading-relaxed text-muted-foreground">
          Suggestions générées uniquement à partir des catégories du catalogue. Elles ne
          constituent pas un avis scientifique ni une recommandation d'usage. Réservé à la
          recherche.
        </p>
      </section>
    </SiteLayout>
  );
}
