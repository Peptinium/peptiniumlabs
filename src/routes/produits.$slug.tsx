import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/data/products";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";
import { ProductVisual } from "@/components/ProductCard";
import { products, formatPrice } from "@/data/products";

// CoA images
import coaRetatrutide from "@/assets/coa/coa-retatrutide-10mg.jpg.asset.json";
import coaGhkCu from "@/assets/coa/coa-ghk-cu.jpg.asset.json";
import coaCjc from "@/assets/coa/coa-cjc-1295-ipamorelin.jpg.asset.json";
import coaSemax from "@/assets/coa/coa-semax.jpg.asset.json";
import coaBpc from "@/assets/coa/coa-bpc-157.jpg.asset.json";
import coaMt1 from "@/assets/coa/coa-mt-1.jpg.asset.json";
import coaMt2 from "@/assets/coa/coa-mt-2.jpg.asset.json";
import coaKlow from "@/assets/coa/coa-klow.jpg.asset.json";
import coaNad from "@/assets/coa/coa-nad-plus.jpg.asset.json";
import coaTesa from "@/assets/coa/coa-tesamoreline.jpg.asset.json";

const SOLVENT_PRICE = 5.99;

const COA_MAP: Record<string, string> = {
  retatrutide: coaRetatrutide.url,
  "ghk-cu": coaGhkCu.url,
  "cjc-1295-ipamorelin": coaCjc.url,
  semax: coaSemax.url,
  "bpc-157": coaBpc.url,
  "mt-1": coaMt1.url,
  "mt-2": coaMt2.url,
  klow: coaKlow.url,
  "nad-plus": coaNad.url,
  tesamoreline: coaTesa.url,
};

export const Route = createFileRoute("/produits/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const SITE = "https://aetherion-lab.com";
    const p = loaderData?.product;
    const dosages = p?.variants.map((v) => v.dosage).join(" / ");
    const minP = p ? Math.min(...p.variants.map((v) => v.price)) : 0;
    const kw = p
      ? [
          p.name, `acheter ${p.name}`, `${p.name} France`, `${p.name} prix`,
          `${p.name} ${dosages}`, `${p.name} HPLC`, `${p.name} CoA`,
          `${p.name} peptide`, `${p.name} recherche`, `${p.name} RUO`,
          p.cas ? `${p.name} CAS ${p.cas}` : "",
          "peptides de recherche", "peptides France", p.category,
        ].filter(Boolean).join(", ")
      : "";
    return {
      meta: [
        { title: p ? `${p.name} ${dosages} — Acheter peptide de recherche HPLC ≥ 98 % · Aetherion Labs` : "Produit · Aetherion Labs" },
        {
          name: "description",
          content: p
            ? `Achetez ${p.name} (CAS ${p.cas ?? "—"}) — peptide de recherche, pureté ${p.purity}, dosages ${dosages}, livré avec Certificat d'Analyse. ${p.shortDescription} RUO uniquement.`
            : "Fiche produit Aetherion Labs.",
        },
        { name: "keywords", content: kw },
        { property: "og:title", content: p ? `${p.name} ${dosages} — Aetherion Labs` : "Aetherion Labs" },
        {
          property: "og:description",
          content: p ? `${p.shortDescription} Pureté ${p.purity}. CoA fourni. RUO.` : "",
        },
        { property: "og:url", content: `${SITE}/produits/${params.slug}` },
        { property: "og:type", content: "product" },
        { name: "twitter:title", content: p ? `${p.name} — Aetherion Labs` : "Aetherion Labs" },
        { name: "twitter:description", content: p?.shortDescription ?? "" },
      ],
      links: [{ rel: "canonical", href: `${SITE}/produits/${params.slug}` }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.name,
                description: p.shortDescription,
                category: p.category,
                sku: p.slug,
                brand: { "@type": "Brand", name: "Aetherion Labs" },
                ...(p.cas ? { additionalProperty: [{ "@type": "PropertyValue", name: "CAS", value: p.cas }] } : {}),
                offers: {
                  "@type": "AggregateOffer",
                  priceCurrency: "EUR",
                  lowPrice: minP.toFixed(2),
                  offerCount: p.variants.length,
                  availability: "https://schema.org/InStock",
                  url: `${SITE}/produits/${params.slug}`,
                },
              }),
            },
          ]
        : [],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-prose py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Produit introuvable</h1>
        <Link to="/produits" className="mt-4 inline-block text-accent hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [variantIdx, setVariantIdx] = useState(0);
  const [withSolvent, setWithSolvent] = useState(false);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState<0 | 1>(0); // 0 = vial, 1 = CoA
  const variant = product.variants[variantIdx];
  const hasMultiple = product.variants.length > 1;
  const coaUrl = COA_MAP[product.slug];
  const slides: ("vial" | "coa")[] = coaUrl ? ["vial", "coa"] : ["vial"];

  const unit = variant.price + (withSolvent ? SOLVENT_PRICE : 0);
  const total = unit * qty;

  const nextSlide = () => setSlide((s) => ((s + 1) % slides.length) as 0 | 1);
  const prevSlide = () => setSlide((s) => ((s - 1 + slides.length) % slides.length) as 0 | 1);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="container-prose py-6">
          <nav className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Accueil</Link>
            <span className="mx-2 text-border">/</span>
            <Link to="/produits" className="hover:text-foreground">Catalogue</Link>
            <span className="mx-2 text-border">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-prose py-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* Visual gallery */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex justify-center px-4 pt-4 pb-2">
                <RuoBadge />
              </div>
              <div className="relative mx-auto aspect-[2/3] max-w-[460px] overflow-hidden p-3 sm:p-4">
                {slides[slide] === "vial" ? (
                  <ProductVisual
                    product={product}
                    dosage={variant.dosage}
                    alt={`Flacon ${product.name} ${variant.dosage} — Research Use Only`}
                    className="size-full"
                    imageClassName="size-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="size-full overflow-hidden rounded-[18px] bg-white">
                    <img
                      src={coaUrl}
                      alt={`Certificat d'analyse ${product.name} — Janoshik Analytical`}
                      className="size-full object-cover"
                      loading="eager"
                    />
                  </div>
                )}
                <div className="absolute right-7 top-7 rounded-full border border-background/70 bg-background/86 px-3 py-1.5 font-display text-base font-medium text-foreground shadow-sm backdrop-blur-sm">
                  {formatPrice(variant.price)}
                </div>

                {/* Arrows */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      aria-label="Image précédente"
                      className="absolute left-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full border border-border bg-background/85 backdrop-blur hover:bg-background"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Image suivante"
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full border border-border bg-background/85 backdrop-blur hover:bg-background"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="m5 2 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </>
                )}

                <div className="pointer-events-none absolute -bottom-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_5s_ease-in-out_infinite]" />

                {/* Dots */}
                {slides.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlide(i as 0 | 1)}
                        aria-label={i === 0 ? "Voir le flacon" : "Voir le CoA"}
                        className={`size-1.5 rounded-full transition-all ${
                          i === slide ? "w-5 bg-accent" : "bg-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-card">
                {[
                  { k: "Pureté", v: product.purity },
                  { k: "Forme", v: "Lyophilisé" },
                  { k: "Flacon", v: variant.dosage },
                ].map((m) => (
                  <div key={m.k} className="p-4 text-center">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{m.k}</div>
                    <div className="mt-1.5 font-display text-sm font-medium text-foreground">{m.v}</div>
                  </div>
                ))}
              </div>
              {coaUrl && (
                <button
                  onClick={() => setSlide(slide === 0 ? 1 : 0)}
                  className="block w-full border-t border-border bg-background px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-colors hover:bg-surface"
                >
                  {slide === 0 ? "→ Voir le test de pureté (CoA Janoshik)" : "← Revenir au flacon"}
                </button>
              )}
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={100}>
            <div>
              <RuoBadge />
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                — {product.category}
              </div>
              <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Composé de recherche lyophilisé{product.cas ? ` · CAS ${product.cas}` : ""}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              {/* Variant selector — large pills */}
              <div className="mt-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Format du flacon
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {product.variants.map((v, i) => {
                    const active = i === variantIdx;
                    return (
                      <button
                        key={v.dosage}
                        onClick={() => setVariantIdx(i)}
                        disabled={!hasMultiple}
                        className={`relative rounded-xl border px-4 py-4 text-center transition-all ${
                          active
                            ? "border-accent bg-accent/10 ring-1 ring-accent"
                            : "border-border bg-card hover:border-foreground/60"
                        }`}
                      >
                        {active && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.22em] text-background">
                            Standard
                          </span>
                        )}
                        <div className="font-display text-base font-medium uppercase">{v.dosage}</div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {formatPrice(v.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Solvent toggle */}
              <div className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="grid size-11 place-items-center rounded-lg border border-border bg-surface text-accent">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2c2.5 4 5 6.5 5 10a5 5 0 1 1-10 0c0-3.5 2.5-6 5-10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[15px] font-medium">Solvant de reconstitution</span>
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.22em] text-accent">
                      Recommandé
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Eau bactériostatique · 10 mL USP
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[11px] font-medium text-accent">+{formatPrice(SOLVENT_PRICE)}</div>
                  <button
                    role="switch"
                    aria-checked={withSolvent}
                    onClick={() => setWithSolvent((v) => !v)}
                    className={`mt-1 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      withSolvent ? "bg-accent" : "bg-border"
                    }`}
                  >
                    <span
                      className={`inline-block size-5 transform rounded-full bg-background shadow transition-transform ${
                        withSolvent ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Qty + total */}
              <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
                <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Diminuer la quantité"
                    className="grid size-8 place-items-center rounded-md hover:bg-surface"
                  >−</button>
                  <span className="min-w-[2ch] text-center font-display text-base font-medium">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    aria-label="Augmenter la quantité"
                    className="grid size-8 place-items-center rounded-md hover:bg-surface"
                  >+</button>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Total</div>
                  <div className="font-display text-3xl font-medium">{formatPrice(total)}</div>
                </div>
              </div>

              <div className="mt-5">
                <AddToCartButton
                  slug={product.slug}
                  productName={product.name}
                  dosage={variant.dosage}
                  price={variant.price}
                  qty={qty}
                  withSolvent={withSolvent}
                />
              </div>

              <div className="mt-6 rounded-xl border border-warning/40 bg-warning/5 p-5 text-xs leading-relaxed text-foreground/80">
                <strong className="block font-mono uppercase tracking-[0.15em] text-warning">
                  Research Use Only — Usage laboratoire exclusif
                </strong>
                <p className="mt-2">
                  Non destiné à un usage humain, vétérinaire, diagnostique ou thérapeutique.
                  Aucune indication d'utilisation in vivo. Manipulation par personnel qualifié exclusivement.
                </p>
              </div>

              {/* Technical data */}
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-border bg-card p-5 text-sm">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">N° CAS</dt>
                  <dd className="mt-1 font-mono text-foreground">{product.cas ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Masse molaire</dt>
                  <dd className="mt-1 font-mono text-foreground">{product.molecularWeight ?? "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Formule moléculaire</dt>
                  <dd className="mt-1 font-mono text-xs break-all text-foreground">{product.molecularFormula ?? "—"}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>

        {/* Detailed scientific effects */}
        <Reveal>
          <div className="mt-20 rounded-2xl border border-border bg-card p-6 sm:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Données scientifiques détaillées
            </div>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
              Effets documentés dans la littérature
            </h2>
            <p className="mt-5 text-[14px] leading-[1.75] text-foreground/85 whitespace-pre-line">
              {product.detailedEffects}
            </p>
          </div>
        </Reveal>

        {/* Detail blocks */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {[
            { mono: "01", title: "Contexte de recherche", body: product.researchSummary },
            { mono: "02", title: "Conservation", body: product.storage },
            { mono: "03", title: "Reconstitution (labo)", body: product.reconstitution, link: true },
          ].map((b, i) => (
            <Reveal key={b.mono} delay={i * 80}>
              <div className="hover-lift rounded-xl border border-border bg-card p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">— {b.mono}</div>
                <h3 className="mt-2 font-display text-lg font-medium tracking-tight">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                {b.link && (
                  <Link to="/calculatrice" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-accent link-underline">
                    → Calculatrice de dilution
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* References */}
        {product.references.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">— Bibliographie</div>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight">Références PubMed</h2>
            </Reveal>
            <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {product.references.map((r, i) => (
                <Reveal key={r.url} delay={i * 70}>
                  <li className="group flex items-center justify-between gap-6 p-6 transition-colors hover:bg-surface">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {r.source} · Référence n°{i + 1}
                      </div>
                      <div className="mt-1.5 font-display text-base font-medium text-foreground">{r.id}</div>
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent transition-all hover:border-accent hover:bg-accent/5"
                    >
                      Consulter sur {r.source} →
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function AddToCartButton({
  slug,
  productName,
  dosage,
  price,
  qty,
  withSolvent,
}: {
  slug: string;
  productName: string;
  dosage: string;
  price: number;
  qty: number;
  withSolvent: boolean;
}) {
  const { add, setEau, eauQty, peptideCount } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        add({ slug, name: productName, dosage, price }, qty);
        if (withSolvent) {
          // ensure at least one eau per peptide added (capped to total peptides after add)
          const targetEau = Math.min(eauQty + qty, peptideCount + qty);
          setEau(targetEau);
        }
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2200);
      }}
      aria-label={`Ajouter ${productName} ${dosage} au panier`}
      className="group relative w-full overflow-hidden rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent/90"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {added ? "Ajouté au panier ✓" : "Ajouter à la commande"}
      </span>
      <span className="absolute inset-y-0 left-0 w-14 -translate-x-full bg-background/40 blur-md transition-transform duration-700 group-hover:translate-x-[860%]" />
    </button>
  );
}
