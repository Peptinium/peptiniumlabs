import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { products, minPrice, formatPrice, type Product } from "@/data/products";
import { GitCompare, Scale, Sparkles } from "lucide-react";

export const Route = createFileRoute("/comparateur")({
  head: () => ({
    meta: [
      { title: "Comparateur de peptides — Peptinium Labs" },
      {
        name: "description",
        content:
          "Comparez jusqu'à 3 peptides côte à côte : catégorie, formule, nombre de références PubMed, prix. Usage recherche uniquement.",
      },
      { property: "og:title", content: "Comparateur de peptides — Peptinium Labs" },
      { property: "og:description", content: "Trois peptides côte à côte : catégorie, formule, références, prix." },
      { property: "og:url", content: "/comparateur" },
    ],
    links: [{ rel: "canonical", href: "/comparateur" }],
  }),
  component: ComparatorPage,
});

const SLOTS = 3;

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 22%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 22%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 0%, transparent 78%)";

const GRADIENT_BTN =
  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)";

function ComparatorPage() {
  const available = useMemo(() => products.filter((p) => !p.hidden), []);
  const [selected, setSelected] = useState<(string | null)[]>([
    available[0]?.slug ?? null,
    available[1]?.slug ?? null,
    null,
  ]);

  const setSlot = (idx: number, slug: string) => {
    setSelected((s) => s.map((v, i) => (i === idx ? (slug || null) : v)));
  };

  const items: (Product | null)[] = selected.map(
    (slug) => available.find((p) => p.slug === slug) ?? null,
  );

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
                Outils labo — Comparaison
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-4xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[80px] sm:leading-[0.96]"
                data-shimmer="Comparez jusqu'à 3 peptides."
              >
                Comparez jusqu'à 3 peptides.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                Sélectionnez jusqu'à trois peptides pour comparer leur catégorie, leur formule, le
                nombre de références scientifiques et leur tarif d'entrée.{" "}
                <span className="text-foreground">Usage recherche in vitro uniquement.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ COMPARATOR ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
              {/* --- Inputs --- */}
              <Reveal>
                <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card p-8 shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--brand-violet)_35%,transparent)] sm:p-10">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    aria-hidden
                    style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }}
                  />

                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    — Votre sélection
                  </span>
                  <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[32px]">
                    Choisissez les peptides.
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-muted-foreground">
                    Jusqu'à trois emplacements. Laissez un emplacement vide pour ne comparer que deux peptides.
                  </p>

                  <div className="mt-9 space-y-5">
                    {Array.from({ length: SLOTS }).map((_, idx) => (
                      <div key={idx}>
                        <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          <Scale className="size-3.5 text-accent" strokeWidth={1.6} />
                          Peptide {idx + 1}
                        </label>
                        <select
                          value={selected[idx] ?? ""}
                          onChange={(e) => setSlot(idx, e.target.value)}
                          className="mt-2 w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-[15px] font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[color-mix(in_oklab,var(--brand-violet)_60%,var(--border))] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-violet)_12%,transparent)]"
                        >
                          <option value="">— Aucun —</option>
                          {available.map((p) => (
                            <option key={p.slug} value={p.slug}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelected([null, null, null])}
                    className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ↺ Réinitialiser
                  </button>
                </div>
              </Reveal>

              {/* --- Results --- */}
              <Reveal delay={80}>
                <div className="relative overflow-hidden rounded-[28px] border border-transparent p-[1px]" style={{ background: GRADIENT_BTN }}>
                  <div className="relative flex flex-col rounded-[27px] bg-card px-6 py-8 sm:px-10 sm:py-10">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-70"
                      aria-hidden
                      style={{
                        background:
                          "radial-gradient(70% 60% at 80% 10%, color-mix(in oklab, var(--brand-violet) 14%, transparent), transparent 70%), radial-gradient(60% 60% at 10% 90%, color-mix(in oklab, var(--brand-cyan) 12%, transparent), transparent 70%)",
                      }}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        <GitCompare className="size-3.5" strokeWidth={1.6} />
                        Tableau comparatif
                      </div>

                      <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[540px] border-separate border-spacing-0 text-[13px]">
                          <thead>
                            <tr>
                              <th className="w-36 border-b border-border/60 py-3 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                                Critère
                              </th>
                              {items.map((p, i) => (
                                <th
                                  key={i}
                                  className="border-b border-border/60 py-3 text-left font-display text-[16px] font-medium text-foreground"
                                >
                                  {p ? p.name : <span className="text-muted-foreground/60">—</span>}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <Row label="Catégorie" values={items.map((p) => p?.category)} />
                            <Row label="Formule" values={items.map((p) => p?.molecularFormula)} mono />
                            <Row label="Masse moléculaire" values={items.map((p) => p?.molecularWeight)} mono />
                            <Row
                              label="Références scientifiques"
                              values={items.map((p) =>
                                p ? `${p.references.length} publication${p.references.length > 1 ? "s" : ""}` : undefined,
                              )}
                            />
                            <Row
                              label="Dosages disponibles"
                              values={items.map((p) => p?.variants.map((v) => v.dosage).join(" · "))}
                            />
                            <Row
                              label="Prix d'entrée"
                              values={items.map((p) => (p ? formatPrice(minPrice(p)) : undefined))}
                              strong
                            />
                            <tr>
                              <td className="border-b border-border/60 py-4 align-top font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                                Fiche produit
                              </td>
                              {items.map((p, i) => (
                                <td key={i} className="border-b border-border/60 py-4 align-top">
                                  {p ? (
                                    <Link
                                      to="/produits/$slug"
                                      params={{ slug: p.slug }}
                                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-surface"
                                    >
                                      Voir la fiche →
                                    </Link>
                                  ) : (
                                    <span className="text-muted-foreground/50">—</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
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
                    Les comparaisons présentées sont fournies à titre documentaire. Elles ne constituent en
                    aucun cas une recommandation d'usage ou une équivalence thérapeutique.
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

function Row({
  label,
  values,
  mono,
  strong,
}: {
  label: string;
  values: (string | undefined)[];
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <tr>
      <td className="border-b border-border/60 py-4 align-top font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`border-b border-border/60 py-4 align-top text-foreground ${
            mono ? "font-mono text-[12px]" : ""
          } ${strong ? "font-semibold" : ""}`}
        >
          {v ?? <span className="text-muted-foreground/50">—</span>}
        </td>
      ))}
    </tr>
  );
}
