import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/produits")({
  head: () => ({
    meta: [
      { title: "Catalogue — Peptides de recherche RUO · Aetherion Labs" },
      {
        name: "description",
        content:
          "Catalogue complet de peptides synthétiques de qualité recherche : GLP-1/GIP, axe somatotrope, réparation, mélanocortines. HPLC ≥ 98 %. RUO uniquement.",
      },
      { property: "og:title", content: "Catalogue — Aetherion Labs" },
      { property: "og:url", content: "/produits" },
    ],
    links: [{ rel: "canonical", href: "/produits" }],
  }),
  component: CatalogPage,
});

const categories = ["Toutes", "GLP-1/GIP", "Croissance", "Cognitif", "Réparation", "Mélanocortine"] as const;

function CatalogPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Toutes");
  const list = useMemo(
    () => (cat === "Toutes" ? products : products.filter((p) => p.category === cat)),
    [cat],
  );
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-14">
          <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
            Catalogue · {products.length} référence(s)
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Peptides synthétiques — qualité recherche
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tous nos composés sont validés par HPLC et spectrométrie de masse, conditionnés en
            flacons stériles et livrés avec leur Certificat d'Analyse. Réactifs destinés
            <strong className="text-foreground"> exclusivement à la recherche scientifique en laboratoire</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  cat === c
                    ? "border-medical bg-medical text-medical-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="container-prose py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
