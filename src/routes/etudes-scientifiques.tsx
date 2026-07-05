import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductVisual } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";

export const Route = createFileRoute("/etudes-scientifiques")({
  head: () => ({
    meta: [
      { title: "Études scientifiques — Références PubMed · Peptinium Labs" },
      {
        name: "description",
        content:
          "Bibliographie scientifique référencée sur PubMed et PMC pour chaque peptide de recherche du catalogue Peptinium Labs.",
      },
      { property: "og:url", content: "/etudes-scientifiques" },
    ],
    links: [{ rel: "canonical", href: "/etudes-scientifiques" }],
  }),
  component: StudiesPage,
});

const ORDER = [
  "retatrutide", "ghk-cu", "cjc-1295-ipamorelin", "semax", "ahk-cu",
  "bpc-157", "mt-1", "mt-2", "klow", "nad-plus", "tesamoreline",
];

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 26%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 26%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 16%, transparent) 0%, transparent 78%)";

function StudiesPage() {
  const sorted = [...products]
    .filter((p) => p.references.length > 0)
    .sort((a, b) => {
      const ai = ORDER.indexOf(a.slug);
      const bi = ORDER.indexOf(b.slug);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  const totalRefs = sorted.reduce((n, p) => n + p.references.length, 0);

  return (
    <SiteLayout>
      <div style={{ background: "#07060c" }} className="text-white">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: SWEEPS }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }} />

          <div className="relative mx-auto max-w-[1400px] px-6 pt-28 pb-20 lg:px-10 sm:pt-36 sm:pb-28">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
                <span className="inline-block size-1.5 rounded-full bg-white/90" />
                Bibliographie · PubMed · PMC · JAMA
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-10 max-w-5xl text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-[104px] sm:leading-[0.94]">
                Études de{" "}
                <span className="italic font-serif font-light" style={{ background: "linear-gradient(120deg, var(--brand-cyan), var(--brand-violet), var(--brand-magenta))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  référence
                </span>{" "}
                par molécule.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
                <p className="text-[18px] leading-[1.55] text-white/80 sm:text-[22px]">
                  Chaque réactif du catalogue est documenté par une sélection de publications
                  indexées sur PubMed / PMC ou éditées par les grandes revues internationales.
                  Fournies à titre <span className="text-white">documentaire exclusivement</span>.
                </p>
                <div className="grid grid-cols-2 gap-6 self-end border-t border-white/15 pt-6">
                  <div>
                    <div className="font-display text-[28px] font-semibold text-white sm:text-[36px]">{sorted.length}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">Molécules documentées</div>
                  </div>
                  <div>
                    <div className="font-display text-[28px] font-semibold text-white sm:text-[36px]">{totalRefs}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">Références indexées</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ Liste éditoriale ============ */}
        <section className="relative border-t border-white/10">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-28">
            <div className="space-y-20 sm:space-y-28">
              {sorted.map((p, idx) => (
                <Reveal key={p.slug} delay={idx * 30}>
                  <article className="grid gap-10 border-t border-white/10 pt-14 md:grid-cols-[280px_1fr] md:gap-16 sm:pt-20">
                    {/* Left column: numéro + fiole */}
                    <div className="flex flex-col gap-6">
                      <div className="flex items-baseline gap-4">
                        <span className="font-display text-[64px] font-extralight leading-none text-white/25 sm:text-[80px]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">{p.category}</div>
                          <div className="mt-1 font-mono text-[10px] text-white/70">Pureté {p.purity}</div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--brand-violet) 22%, transparent), transparent 70%)" }} />
                        <ProductVisual
                          product={p}
                          dosage={p.variants[0]?.dosage}
                          alt={`Flacon ${p.name}`}
                          className="relative aspect-[3/4] w-full"
                          imageClassName="size-full object-cover"
                        />
                      </div>
                      <Link
                        to="/produits/$slug"
                        params={{ slug: p.slug }}
                        className="group inline-flex items-center justify-between gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:border-white/60"
                      >
                        Voir la fiche
                        <span className="grid size-6 place-items-center rounded-full bg-white/10 text-white transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </div>

                    {/* Right column: titre + refs */}
                    <div className="min-w-0">
                      <h2 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.025em] text-white sm:text-[56px]">
                        {p.name}
                      </h2>

                      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
                        {p.references.map((r, i) => (
                          <li key={r.url} className="group flex flex-wrap items-center justify-between gap-6 py-5">
                            <div className="min-w-0 flex-1">
                              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
                                Réf. {String(i + 1).padStart(2, "0")} · {r.source}
                              </div>
                              <div className="mt-2 truncate font-display text-[18px] font-medium text-white sm:text-[22px]">
                                {r.id}
                              </div>
                            </div>
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white/60"
                            >
                              Consulter sur {r.source}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                                <path d="M1 5h8m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                              </svg>
                            </a>
                          </li>
                        ))}
                      </ul>

                      {p.slug === "klow" && (
                        <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[12.5px] italic leading-relaxed text-white/60">
                          KLOW est une co-formulation de GHK-Cu + BPC-157 + TB-500 + KPV.
                          Les références correspondent aux études individuelles des composants actifs
                          (cicatrisation, anti-inflammation, remodelage matriciel).
                        </p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="mt-24 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center backdrop-blur-sm sm:px-10 sm:py-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">Sources</div>
              <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-[1.65] text-white/70">
                NIH · National Library of Medicine · PubMed · PubMed Central (PMC) · JAMA Network.
                Liens directs vérifiés vers les publications originales.
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
