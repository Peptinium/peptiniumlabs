import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";

const SITE_URL = "https://peptinium.com";

export const Route = createFileRoute("/produits/")({
  head: () => ({
    meta: [
      { title: "Catalogue de peptides — Retatrutide, BPC-157, GHK-Cu, CJC-1295, Semax, Melanotan, NAD+ · Peptinium Labs" },
      {
        name: "description",
        content:
          "Catalogue complet de peptides de recherche : Retatrutide, GHK-Cu, AHK-Cu, CJC-1295/Ipamorelin, Semax, BPC-157, Melanotan I & II, KLOW, NAD+, Tesamorelin, eau bactériostatique. HPLC ≥ 99 %, RUO.",
      },
      { property: "og:title", content: "Catalogue de peptides de recherche — Peptinium Labs" },
      {
        property: "og:description",
        content:
          "Retatrutide, BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Semax, Melanotan, KLOW, NAD+, Tesamorelin. Pureté HPLC ≥ 99 %.",
      },
      { property: "og:url", content: `${SITE_URL}/produits` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/produits` }],
  }),
  component: CatalogPage,
});

const categories = [
  "Tous",
  "GLP-1/GIP",
  "Croissance",
  "Cognitif",
  "Réparation",
  "Mélanocortine",
  "Anti-âge",
  "Reconstitution",
] as const;

function CatalogPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Tous");

  const globalMin = useMemo(
    () => Math.floor(Math.min(...products.map((p) => minPrice(p)))),
    [],
  );
  const globalMax = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => minPrice(p)))),
    [],
  );
  const [maxPrice, setMaxPrice] = useState<number>(globalMax);

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "Tous" || p.category === cat) && minPrice(p) <= maxPrice,
      ),
    [cat, maxPrice],
  );

  const countByCat = useMemo(() => {
    const map: Record<string, number> = { Tous: products.length };
    for (const p of products) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <SiteLayout>
      {/* HERO éditorial */}
      <section className="relative overflow-hidden border-b border-border/60 bg-[oklch(0.97_0.015_270)]">
        <div className="container-prose relative px-5 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70">
              Catalogue <span className="mx-2 opacity-40">·</span> {products.length} sur {products.length}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-8 font-display text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[72px] lg:text-[92px] lg:leading-[0.96]">
              Tous les peptides
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 max-w-[22ch] font-display text-[36px] font-normal leading-[1.05] tracking-[-0.02em] text-muted-foreground sm:max-w-none sm:text-[52px] lg:text-[72px] lg:leading-[1.02]">
              Des peptides de qualité premium pour la recherche.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grille + sidebar filtres */}
      <section className="container-prose px-5 py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          {/* Sidebar filtres */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
              Filtrer par
            </div>

            <div className="mt-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Fourchette de prix
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[12px] text-foreground">
                <span>{formatPrice(globalMin)}</span>
                <span className="mx-2 h-px flex-1 bg-border" />
                <span>{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={globalMin}
                max={globalMax}
                step={1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-4 w-full accent-foreground"
                aria-label="Prix maximum"
              />
              <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>{formatPrice(globalMin)}</span>
                <span>{formatPrice(globalMax)}</span>
              </div>
            </div>

            <div className="mt-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Catégories
              </div>
              <ul className="mt-4 space-y-1">
                {categories.map((c) => {
                  const active = cat === c;
                  return (
                    <li key={c}>
                      <button
                        onClick={() => setCat(c)}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-[15px] transition-colors ${
                          active
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{c}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {countByCat[c] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Grille produits */}
          <div>
            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                Aucun produit ne correspond à vos filtres.
              </div>
            ) : (
              <div
                key={`${cat}-${maxPrice}`}
                className="grid animate-[fade-in_0.5s_ease-out_both] grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3"
              >
                {list.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 40}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
