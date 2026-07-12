import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { RuoBadge } from "@/components/RuoBadge";
import { useCart } from "@/lib/cart";
import { accessories, findAccessory, type Accessory } from "@/data/accessories";
import { formatPrice } from "@/data/products";

const SITE = "https://peptinium.com";

export const Route = createFileRoute("/accessoires/$slug")({
  loader: ({ params }) => {
    const accessory = findAccessory(params.slug);
    if (!accessory) throw notFound();
    return { accessory };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.accessory;
    return {
      meta: [
        { title: a ? `${a.name} — Accessoire laboratoire · Peptinium Labs` : "Accessoire · Peptinium Labs" },
        {
          name: "description",
          content: a
            ? `${a.name} — ${a.variantLabel}. Consommable stérile de recherche, conditionnement individuel. ${formatPrice(a.priceEUR)}.`
            : "Fiche accessoire Peptinium Labs.",
        },
        { property: "og:title", content: a ? `${a.name} — Peptinium Labs` : "Peptinium Labs" },
        { property: "og:description", content: a?.name ?? "" },
        { property: "og:url", content: `${SITE}/accessoires/${params.slug}` },
        { property: "og:image", content: a?.imageUrl ?? "" },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: `${SITE}/accessoires/${params.slug}` }],
    };
  },
  component: AccessoryPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-prose py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Accessoire introuvable</h1>
        <Link to="/accessoires" className="mt-4 inline-block text-accent hover:underline">
          ← Retour aux accessoires
        </Link>
      </div>
    </SiteLayout>
  ),
});

function AccessoryPage() {
  const { accessory } = Route.useLoaderData() as { accessory: Accessory };
  const [qty, setQty] = useState(1);
  const total = accessory.priceEUR * qty;

  // Variants (same variantGroup)
  const variantGroup = accessory.variantGroup
    ? accessories.filter((a) => a.variantGroup === accessory.variantGroup)
    : [];

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-background">
        <div className="container-prose relative px-5 py-6">
          <nav className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Accueil</Link>
            <span className="mx-2 text-border">/</span>
            <Link to="/accessoires" className="hover:text-foreground">Accessoires</Link>
            <span className="mx-2 text-border">/</span>
            <span className="text-foreground">{accessory.name}</span>
          </nav>
        </div>
      </section>

      <div className="container-prose py-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex justify-center px-4 pt-4 pb-2">
                <RuoBadge />
              </div>
              <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden p-3 sm:p-4">
                <img
                  src={accessory.imageUrl}
                  alt={accessory.name}
                  className="size-full rounded-[18px] object-cover"
                  loading="eager"
                />
                <div className="absolute right-7 top-7 flex items-center gap-1.5 rounded-full border border-background/70 bg-background/86 px-3 py-1.5 font-display text-base font-medium text-foreground shadow-sm backdrop-blur-sm">
                  {accessory.originalPriceEUR && (
                    <span className="font-mono text-[10px] text-muted-foreground line-through">
                      {formatPrice(accessory.originalPriceEUR)}
                    </span>
                  )}
                  <span>{formatPrice(accessory.priceEUR)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-card">
                {accessory.specs.slice(0, 3).map((m) => (
                  <div key={m.label} className="p-4 text-center">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{m.label}</div>
                    <div className="mt-1.5 font-display text-sm font-medium text-foreground">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <RuoBadge />
              <div className="mt-5 text-accent font-mono text-[10px] font-semibold uppercase tracking-[0.28em]">
                {accessory.family}
              </div>
              <h1 className="mt-3 text-[38px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[52px]">
                {accessory.name}
              </h1>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.65] text-muted-foreground">
                {accessory.description}
              </p>

              {variantGroup.length > 1 && (
                <div className="mt-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Choisir un format
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {variantGroup.map((v) => {
                      const active = v.slug === accessory.slug;
                      return (
                        <Link
                          key={v.slug}
                          to="/accessoires/$slug"
                          params={{ slug: v.slug }}
                          className={`rounded-xl border px-3 py-3 text-center transition-all ${
                            active
                              ? "border-accent bg-accent/10 ring-1 ring-accent"
                              : "border-border bg-card hover:border-foreground/60"
                          }`}
                        >
                          <div className="font-display text-sm font-medium">{v.variantLabel}</div>
                          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {formatPrice(v.priceEUR)}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
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
                <AddAccessoryButton accessory={accessory} qty={qty} />
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-border bg-card p-5 text-sm">
                {accessory.specs.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</dt>
                    <dd className="mt-1 font-mono text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </SiteLayout>
  );
}

function AddAccessoryButton({ accessory, qty }: { accessory: Accessory; qty: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        add(
          {
            slug: accessory.slug,
            name: accessory.name,
            dosage: accessory.variantLabel,
            price: accessory.priceEUR,
          },
          qty,
        );
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2200);
      }}
      aria-label={`Ajouter ${accessory.name} au panier`}
      className="group relative w-full overflow-hidden rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent/90"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {added ? "Ajouté au panier ✓" : "Ajouter à la commande"}
      </span>
    </button>
  );
}
