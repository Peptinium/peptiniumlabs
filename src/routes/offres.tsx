import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { products, formatPrice } from "@/data/products";
import { Sparkles, Package, Crown, Gift, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/offres")({
  head: () => ({
    meta: [
      { title: "Offres spéciales & Peptinium Club — Packs quantité, promos et fidélité" },
      {
        name: "description",
        content:
          "Retatrutide 10 mg à 99 € (au lieu de 109 €), packs quantité −7 % dès 3 flacons, −12 % dès 6, et programme fidélité Peptinium Club en 4 paliers.",
      },
      { property: "og:title", content: "Offres spéciales — Peptinium Labs" },
      { property: "og:description", content: "Promo Retatrutide, packs quantité et programme fidélité Peptinium Club." },
      { property: "og:url", content: "/offres" },
    ],
    links: [{ rel: "canonical", href: "/offres" }],
  }),
  component: OffresPage,
});

const GRADIENT =
  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)";

const TIERS = [
  {
    key: "bronze",
    name: "Bronze",
    range: "0 – 500 €",
    perks: ["3 % crédit sur chaque commande", "CoA HPLC systématique", "Accès prioritaire au support"],
    accent: "oklch(0.72 0.12 60)",
    icon: Sparkles,
  },
  {
    key: "argent",
    name: "Argent",
    range: "500 – 1 500 €",
    perks: ["5 % crédit permanent", "Livraison offerte à vie", "Notification lots à l'avance"],
    accent: "oklch(0.80 0.02 260)",
    icon: ShieldCheck,
  },
  {
    key: "or",
    name: "Or",
    range: "1 500 – 3 000 €",
    perks: ["8 % crédit permanent", "Eau bactériostatique offerte à vie", "Support prioritaire dédié"],
    accent: "oklch(0.82 0.15 90)",
    icon: Crown,
    highlighted: true,
  },
  {
    key: "platine",
    name: "Platine",
    range: "3 000 € et +",
    perks: ["10 % crédit permanent", "Accès en avant-première aux nouveaux lots", "Interlocuteur unique labo", "Cadeau surprise annuel"],
    accent: "oklch(0.78 0.10 230)",
    icon: Gift,
  },
];

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
                Offres spéciales — En cours
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-5xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[88px] sm:leading-[0.94]"
                data-shimmer="Économisez plus. Recherchez mieux."
              >
                Économisez plus. Recherchez mieux.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-3xl text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                Promo du jour, packs quantité dégressifs et programme fidélité <span className="text-foreground">Peptinium Club</span>.
                Toutes les offres sont cumulables avec les CoA HPLC systématiques.
              </p>
            </Reveal>
          </div>
        </section>

        {/* PROMO DU JOUR */}
        {reta && reta10?.promoPrice != null && (
          <section className="relative border-t border-border">
            <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 sm:py-24">
              <Reveal>
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Promo en cours</span>
                <h2 className="shimmer-text mt-3 max-w-3xl text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px]" data-shimmer="Retatrutide 10 mg à −10 €.">
                  Retatrutide 10 mg à −10 €.
                </h2>
              </Reveal>

              <Reveal delay={120}>
                <article
                  className="relative mt-10 overflow-hidden rounded-[24px] border border-transparent p-[1px]"
                  style={{ background: GRADIENT }}
                >
                  <div className="grid gap-8 rounded-[23px] bg-card p-8 sm:grid-cols-[1.2fr_1fr] sm:p-12">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                        Prix promotionnel
                      </div>
                      <div className="mt-3 flex items-baseline gap-4">
                        <span
                          className="font-display text-[64px] font-semibold leading-none tracking-[-0.03em]"
                          style={{
                            backgroundImage: GRADIENT,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {formatPrice(reta10.promoPrice)}
                        </span>
                        <span className="font-mono text-[18px] text-muted-foreground line-through">
                          {formatPrice(reta10.price)}
                        </span>
                      </div>
                      <p className="mt-6 max-w-md text-[15px] leading-[1.65] text-muted-foreground">
                        Retatrutide 10 mg — triple agoniste GLP-1 / GIP / Glucagon. Pureté HPLC ≥ 99,1 %,
                        CoA Janoshik joint à chaque lot. Offre valable pour une durée limitée sur les commandes
                        à l'unité.
                      </p>
                      <Link
                        to="/produits/$slug"
                        params={{ slug: "retatrutide" }}
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-background transition-transform hover:-translate-y-0.5"
                      >
                        Commander →
                      </Link>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background p-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        Ce qui reste inclus
                      </div>
                      <ul className="mt-4 space-y-3 text-[14px] text-foreground/85">
                        {["CoA HPLC ≥ 99,1 % par lot", "Vérification indépendante Janoshik", "Expédition sous 24 h ouvrées", "Emballage discret et sécurisé"].map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            </div>
          </section>
        )}

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
                  Barème dégressif sur le Retatrutide 10 mg, appliqué directement sur le prix promo à {formatPrice(reta10.promoPrice ?? reta10.price)}. Cumulable avec la promo du jour.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {(() => {
                  const bulkBase = reta10.promoPrice ?? reta10.price;
                  const rows = [
                    {
                      qty: 1,
                      discount: 0,
                      label: "À l'unité",
                      unit: bulkBase,
                      note: reta10.promoPrice != null ? "Promo du jour" : "Prix de référence",
                    },
                    ...reta10.bulkTiers.map((t) => ({
                      qty: t.minQty,
                      discount: t.discountPct,
                      label: `Pack ×${t.minQty}`,
                      unit: Math.round(bulkBase * (1 - t.discountPct / 100) * 100) / 100,
                      note: `−${t.discountPct} % appliqué automatiquement sur le prix promo`,
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
                                style={
                                  row.discount > 0
                                    ? { backgroundImage: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }
                                    : { color: "var(--foreground)" }
                                }
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

        {/* PROGRAMME FIDÉLITÉ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-28">
            <Reveal>
              <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Peptinium Club</span>
              <h2 className="shimmer-text mt-3 max-w-3xl text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px]" data-shimmer="Un programme fidélité pensé pour les laboratoires réguliers.">
                Un programme fidélité pensé pour les laboratoires réguliers.
              </h2>
              <p className="mt-6 max-w-3xl text-[15px] leading-[1.7] text-muted-foreground">
                Chaque euro dépensé est cumulé sur votre compte. Vous montez de palier automatiquement,
                sans démarche. Les avantages sont permanents, cumulables avec les promos et les packs quantité,
                et convertibles en crédit sur vos prochaines commandes.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {TIERS.map((t, i) => (
                <Reveal key={t.key} delay={i * 70}>
                  <article
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 transition-all ${
                      t.highlighted
                        ? "border-transparent p-[1px]"
                        : "border-border bg-card hover:border-foreground/50"
                    }`}
                    style={t.highlighted ? { background: GRADIENT } : undefined}
                  >
                    <div className={`flex h-full flex-col ${t.highlighted ? "rounded-[15px] bg-card p-8" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span
                          className="grid size-10 place-items-center rounded-full border border-border/70 bg-background"
                          style={{ color: t.accent }}
                        >
                          <t.icon className="size-5" strokeWidth={1.6} />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                          {t.range}
                        </span>
                      </div>
                      <h3
                        className="mt-6 font-display text-[28px] font-semibold leading-none tracking-[-0.02em]"
                        style={t.highlighted ? { backgroundImage: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : { color: "var(--foreground)" }}
                      >
                        {t.name}
                      </h3>
                      <ul className="mt-6 space-y-2.5 text-[13px] leading-[1.55] text-muted-foreground">
                        {t.perks.map((p) => (
                          <li key={p} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: t.accent }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-14 rounded-2xl border border-border/70 bg-card p-6 sm:p-10">
                <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">— Comment ça marche</div>
                    <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.7] text-foreground/85">
                      Créez un compte, passez vos commandes normalement. Le cumul et le passage de palier
                      sont automatiques. Le crédit acquis est visible dans votre espace client et se déduit
                      directement au panier lors de vos prochaines commandes.
                    </p>
                  </div>
                  <Link
                    to="/auth"
                    search={{ redirect: "/mon-compte" }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-background transition-transform hover:-translate-y-0.5"
                  >
                    Créer mon compte
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
