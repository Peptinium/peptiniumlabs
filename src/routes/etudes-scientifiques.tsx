import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductVisual } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";

export const Route = createFileRoute("/etudes-scientifiques")({
  head: () => ({
    meta: [
      { title: "Bibliographie — Références PubMed & PMC · Peptinium Labs" },
      {
        name: "description",
        content:
          "Bibliographie scientifique référencée sur PubMed, PMC et JAMA pour chaque peptide de recherche du catalogue Peptinium Labs. Recherche par molécule ou mot-clé.",
      },
      { property: "og:title", content: "Bibliographie scientifique — Peptinium Labs" },
      { property: "og:description", content: "Références PubMed & PMC par molécule, filtrables." },
      { property: "og:url", content: "/etudes-scientifiques" },
    ],
    links: [{ rel: "canonical", href: "/etudes-scientifiques" }],
  }),
  component: StudiesPage,
});

const ORDER = [
  "retatrutide", "ghk-cu", "cjc-1295-ipamorelin", "semax", "ahk-cu",
  "bpc-157", "mt-1", "mt-2", "klow", "nad-plus", "tesamoreline",
  "dsip", "epithalon", "kpv", "mots-c", "oxytocin", "pt-141",
  "selank", "snap-8", "tb-500",
];

// Date de dernière vérification des liens (mettre à jour à chaque contrôle)
const LAST_CHECKED = "8 juillet 2026";

// Mots-clés associés à chaque molécule pour la recherche par thème
const KEYWORDS: Record<string, string[]> = {
  retatrutide: ["GLP-1", "GIP", "glucagon", "stéatose hépatique", "métabolisme", "obésité"],
  "ghk-cu": ["cuivre", "cicatrisation", "expression génique", "SNC", "GHK"],
  "cjc-1295-ipamorelin": ["GH", "hormone de croissance", "sécrétagogue", "IGF-1"],
  semax: ["BDNF", "AVC", "neurotrophines", "amyloïde", "cognition"],
  "ahk-cu": ["tripeptide cuivre", "peau"],
  "bpc-157": ["cicatrisation", "tendon", "ligament", "myotendineux"],
  "mt-1": ["mélanocortine", "pigmentation", "photosensibilité", "acné"],
  "mt-2": ["mélanocortine", "érection", "NO", "désir sexuel"],
  klow: ["cicatrisation", "GHK-Cu", "BPC-157", "TB-500", "KPV", "co-formulation"],
  "nad-plus": ["NMN", "nicotinamide riboside", "longévité", "anti-âge", "métabolisme"],
  tesamoreline: ["GHRH", "lipodystrophie", "VIH", "composition corporelle"],
  dsip: ["sommeil", "insomnie", "delta"],
  epithalon: ["télomérase", "AEDG", "pinéale", "longévité"],
  kpv: ["α-MSH", "anti-inflammatoire", "antimicrobien"],
  "mots-c": ["mitochondrie", "exercice", "métabolisme musculaire"],
  oxytocin: ["cognition sociale", "attachement", "schizophrénie"],
  "pt-141": ["bremelanotide", "désir sexuel", "mélanocortine"],
  selank: ["anxiolytique", "BDNF", "mémoire", "diazépam"],
  "snap-8": ["cosmétique", "peau"],
  "tb-500": ["thymosine β4", "cicatrisation", "cardioprotection"],
};

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 26%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 26%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 16%, transparent) 0%, transparent 78%)";

function StudiesPage() {
  const [q, setQ] = useState("");

  const sorted = useMemo(
    () =>
      [...products]
        .filter((p) => p.references.length > 0)
        .sort((a, b) => {
          const ai = ORDER.indexOf(a.slug);
          const bi = ORDER.indexOf(b.slug);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        }),
    [],
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return sorted;
    return sorted.filter((p) => {
      const hay = [
        p.name,
        p.slug,
        p.category,
        ...(KEYWORDS[p.slug] ?? []),
        ...p.references.map((r) => r.id),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q, sorted]);

  const totalRefs = sorted.reduce((n, p) => n + p.references.length, 0);

  return (
    <SiteLayout>
      <div className="bg-background text-foreground">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: SWEEPS }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }} />

          <div className="relative mx-auto max-w-[1400px] px-6 pt-28 pb-20 lg:px-10 sm:pt-36 sm:pb-28">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-muted" />
                Bibliographie · PubMed · PMC · JAMA
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="shimmer-text mt-10 max-w-5xl text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[104px] sm:leading-[0.94]" data-shimmer="Études de référence par molécule.">
                Études de référence par molécule.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
                <p className="text-[18px] leading-[1.55] text-muted-foreground sm:text-[22px]">
                  Chaque réactif du catalogue est documenté par une sélection de publications
                  indexées sur PubMed / PMC ou éditées par les grandes revues internationales.
                  Fournies à titre <span className="text-foreground">documentaire exclusivement</span>.
                </p>
                <div className="grid grid-cols-2 gap-6 self-end border-t border-border pt-6">
                  <div>
                    <div className="font-display text-[28px] font-semibold text-foreground sm:text-[36px]">{sorted.length}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Molécules documentées</div>
                  </div>
                  <div>
                    <div className="font-display text-[28px] font-semibold text-foreground sm:text-[36px]">{totalRefs}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Références indexées</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Search input */}
            <Reveal delay={220}>
              <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <svg
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher une molécule ou un mot-clé (GLP-1, BDNF, cicatrisation…)"
                    className="w-full rounded-full border border-border bg-background/70 py-3 pl-11 pr-4 text-[14px] text-foreground outline-none backdrop-blur transition-colors focus:border-foreground/50"
                  />
                </div>
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="rounded-full border border-border bg-background/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
                  >
                    Effacer
                  </button>
                )}
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:whitespace-nowrap">
                  Liens vérifiés le {LAST_CHECKED}
                </div>
              </div>
              {q && (
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {filtered.length} molécule{filtered.length > 1 ? "s" : ""} correspondante{filtered.length > 1 ? "s" : ""}
                </div>
              )}
            </Reveal>
          </div>
        </section>

        {/* ============ Liste éditoriale ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-28">
            {filtered.length === 0 ? (
              <p className="py-24 text-center text-[14px] text-muted-foreground">
                Aucune molécule ne correspond à cette recherche.
              </p>
            ) : (
              <div className="space-y-20 sm:space-y-28">
                {filtered.map((p, idx) => (
                  <Reveal key={p.slug} delay={idx * 30}>
                    <article className="grid gap-10 border-t border-border pt-14 md:grid-cols-[280px_1fr] md:gap-16 sm:pt-20">
                      {/* Left column: numéro + fiole */}
                      <div className="flex flex-col gap-6">
                        <div className="flex items-baseline gap-4">
                          <span className="font-display text-[64px] font-extralight leading-none text-muted-foreground sm:text-[80px]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{p.category}</div>
                            <div className="mt-1 font-mono text-[10px] text-muted-foreground">Pureté {p.purity}</div>
                          </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
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
                          className="group inline-flex items-center justify-between gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-white/60"
                        >
                          Voir la fiche
                          <span className="grid size-6 place-items-center rounded-full bg-muted text-foreground transition-transform group-hover:translate-x-0.5">→</span>
                        </Link>
                      </div>

                      {/* Right column: titre + refs */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                          <h2 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.025em] text-foreground sm:text-[56px]">
                            {p.name}
                          </h2>
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                            Vérifié le {LAST_CHECKED}
                          </span>
                        </div>

                        {KEYWORDS[p.slug] && KEYWORDS[p.slug]!.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {KEYWORDS[p.slug]!.map((k) => (
                              <button
                                key={k}
                                type="button"
                                onClick={() => setQ(k)}
                                className="rounded-full border border-border/60 bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                              >
                                {k}
                              </button>
                            ))}
                          </div>
                        )}

                        <ul className="mt-8 divide-y divide-border border-y border-border">
                          {p.references.map((r, i) => (
                            <li key={r.url} className="group flex flex-wrap items-center justify-between gap-6 py-5">
                              <div className="min-w-0 flex-1">
                                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                                  Réf. {String(i + 1).padStart(2, "0")} · {r.source}
                                </div>
                                <div className="mt-2 truncate font-display text-[18px] font-medium text-foreground sm:text-[22px]">
                                  {r.id}
                                </div>
                              </div>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-white/60"
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
                          <p className="mt-6 rounded-xl border border-border bg-card px-5 py-4 text-[12.5px] italic leading-relaxed text-muted-foreground">
                            KLOW est une co-formulation de GHK-Cu + BPC-157 + TB-500 + KPV.
                            Les références correspondent aux études individuelles des composants actifs
                            (cicatrisation, anti-inflammation, remodelage matriciel).
                          </p>
                        )}
                        {(p.slug === "ahk-cu" || p.slug === "snap-8") && (
                          <p className="mt-6 rounded-xl border border-border bg-card px-5 py-4 text-[12.5px] italic leading-relaxed text-muted-foreground">
                            Littérature indépendante restreinte pour cette molécule. Une seule
                            étude dédiée solide est actuellement référencée ; la recherche
                            complémentaire porte sur les tripeptides apparentés.
                          </p>
                        )}
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}

            <div className="mt-24 rounded-2xl border border-border bg-card px-6 py-8 text-center backdrop-blur-sm sm:px-10 sm:py-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Sources</div>
              <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-[1.65] text-muted-foreground">
                NIH · National Library of Medicine · PubMed · PubMed Central (PMC) · JAMA Network.
                Liens directs vérifiés le {LAST_CHECKED}.
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
