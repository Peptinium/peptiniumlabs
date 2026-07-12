import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { products, formatPrice } from "@/data/products";
import { Sparkles, Package } from "lucide-react";

export const Route = createFileRoute("/offres")({
  head: () => ({
    meta: [
      { title: "Offres & remises quantité — Retatrutide 10 mg · Peptinium Labs" },
      {
        name: "description",
        content:
          "Remises quantité automatiques sur le Retatrutide 10 mg : −5 % dès 3 flacons, −10 % dès 6 flacons. Appliquées directement au panier.",
      },
      { property: "og:title", content: "Remises quantité — Peptinium Labs" },
      { property: "og:description", content: "−5 % dès 3 flacons, −10 % dès 6 flacons sur le Retatrutide 10 mg." },
      { property: "og:url", content: "/offres" },
    ],
    links: [{ rel: "canonical", href: "/offres" }],
  }),
  component: OffresPage,
});

const GRADIENT =
  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)";

function OffresPage() {
  const reta = products.find((p) => p.slug === "retatrutide");
  const reta10 = reta?.variants.find((v) => v.dosage === "10 mg");

  return (
    <SiteLayout>
      <div className="bg-background text-foreground">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 20%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 20%, transparent) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-16 lg:px-10 sm:pt-32 sm:pb-24">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                Remises quantité — En cours
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-5xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[88px] sm:leading-[0.94]"
                data-shimmer="Achetez plus, payez moins."
              >
                Achetez plus, payez moins.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-3xl text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                Barème de remises quantité appliqué automatiquement au panier sur le Retatrutide 10 mg.
                Aucun code, aucun palier à activer.
              </p>
            </Reveal>
          </div>
        </section>

        {/* PACKS QUANTITÉ */}
        {reta10?.bulkTiers && (
          <section className="relative border-t border-border">
            <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 sm:py-24">
              <Reveal>
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Packs quantité</span>
                <h2 className="shimmer-text mt-3 max-w-3xl text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px]" data-shimmer="Achetez en gros, payez moins cher.">
                  Achetez en gros, payez moins cher.
                </h2>
                <p className="mt-6 max-w-3xl text-[15px] leading-[1.7] text-muted-foreground">
                  Barème dégressif sur le Retatrutide 10 mg, appliqué directement sur le prix de référence à {formatPrice(reta10.price)}.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {(() => {
                  const bulkBase = reta10.price;
                  const rows = [
                    {
                      qty: 1,
                      discount: 0,
                      label: "À l'unité",
                      unit: bulkBase,
                      note: "Prix de référence",
                    },
                    ...reta10.bulkTiers.map((t) => ({
                      qty: t.minQty,
                      discount: t.discountPct,
                      label: `Pack ×${t.minQty}`,
                      unit: Math.round(bulkBase * (1 - t.discountPct / 100) * 100) / 100,
                      note: `−${t.discountPct} % appliqué automatiquement au panier`,
                    })),
                  ];
                  const maxDiscount = Math.max(...rows.map((r) => r.discount));
                  return rows.map((row, i) => {
                    const isRecommended = row.discount > 0 && row.discount === maxDiscount;
                    return (
                    <Reveal key={row.qty} delay={i * 80} className="h-full">
                      <div className="relative h-full">
                        {isRecommended && (
                          <>
                            <div
                              aria-hidden
                              className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] opacity-60 blur-2xl"
                              style={{ background: GRADIENT }}
                            />
                            <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
                              <span
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg"
                                style={{ background: GRADIENT }}
                              >
                                <Sparkles className="size-3" strokeWidth={2} />
                                Le plus populaire
                              </span>
                            </div>
                          </>
                        )}
                        <article
                          className="hover-lift relative flex h-full flex-col overflow-hidden rounded-2xl p-[1px]"
                          style={{ background: GRADIENT }}
                        >
                          <div
                            className={`flex h-full flex-col rounded-[15px] p-8 ${
                              isRecommended ? "bg-card shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--brand-violet)_55%,transparent)]" : "bg-card"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                                <Package className="size-3.5" strokeWidth={1.6} />
                                {row.label}
                              </div>
                              {row.discount > 0 && (
                                <span
                                  className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white"
                                  style={{ background: GRADIENT }}
                                >
                                  −{row.discount}%
                                </span>
                              )}
                            </div>
                            <div className="mt-6 flex items-baseline gap-2">
                              <span
                                className="font-display text-[44px] font-semibold leading-none tracking-[-0.02em]"
                                style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}

                              >
                                {formatPrice(row.unit)}
                              </span>
                              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                / flacon
                              </span>
                            </div>
                            {row.discount > 0 && (
                              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                <span className="line-through">{formatPrice(bulkBase)}</span> · Économie {formatPrice((bulkBase - row.unit) * row.qty)}
                              </div>
                            )}
                            <div className="mt-6 border-t border-border/70 pt-5 text-[13px] text-muted-foreground">
                              {row.note}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Total pack</span>
                              <span className="font-display text-[20px] font-semibold text-foreground">{formatPrice(row.unit * row.qty)}</span>
                            </div>
                            <Link
                              to="/produits/$slug"
                              params={{ slug: "retatrutide" }}
                              className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] transition-transform hover:-translate-y-0.5 ${
                                row.discount > 0 ? "text-white" : "border border-border bg-background text-foreground"
                              }`}
                              style={row.discount > 0 ? { background: GRADIENT } : undefined}
                            >
                              {row.discount > 0 ? `Commander le pack ×${row.qty}` : "Commander à l'unité"}
                            </Link>
                          </div>
                        </article>
                      </div>
                    </Reveal>
                    );
                  });

                })()}
              </div>

            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
