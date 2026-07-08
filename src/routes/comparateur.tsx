import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { products, minPrice, formatPrice, type Product } from "@/data/products";

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
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50 [animation:grid-drift_24s_linear_infinite]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,var(--background)_85%)]" />
        <div className="container-prose relative py-14">
          <RuoBadge />
          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            <span className="shimmer-text" data-shimmer="Comparateur de peptides">
              Comparateur de peptides
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Sélectionnez jusqu'à trois peptides pour comparer leur catégorie, leur formule, le
            nombre de références scientifiques et leur tarif d'entrée. Outil de comparaison
            documentaire, à usage recherche exclusivement.
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        {/* Selectors */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SLOTS }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-border/60 bg-surface/40 p-4">
              <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Peptide {idx + 1}
              </label>
              <select
                value={selected[idx] ?? ""}
                onChange={(e) => setSlot(idx, e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground/40"
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

        {/* Comparison grid */}
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-[13px]">
            <thead>
              <tr>
                <th className="w-40 border-b border-border/60 py-3 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
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

        <p className="mt-8 text-[12px] leading-relaxed text-muted-foreground">
          Les comparaisons présentées sont fournies à titre documentaire. Elles ne constituent en
          aucun cas une recommandation d'usage ou une équivalence thérapeutique.
        </p>
      </section>
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
