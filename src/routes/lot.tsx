import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { coaCatalog, type CoaItem } from "@/data/coa-catalog";
import { Search, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/lot")({
  head: () => ({
    meta: [
      { title: "Traçabilité des lots — Retrouver un CoA · Peptinium Labs" },
      {
        name: "description",
        content:
          "Entrez un numéro de lot, une clé Janoshik ou un nom de peptide pour retrouver le certificat d'analyse HPLC correspondant. Transparence totale sur chaque lot.",
      },
      { property: "og:title", content: "Traçabilité des lots — Peptinium Labs" },
      { property: "og:description", content: "N° de lot → CoA Janoshik correspondant." },
      { property: "og:url", content: "/lot" },
    ],
    links: [{ rel: "canonical", href: "/lot" }],
  }),
  component: LotLookupPage,
});

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s#/\-_.]/g, "");
}

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 22%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 22%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 0%, transparent 78%)";

const GRADIENT_BTN =
  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)";

function LotLookupPage() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const query = normalize(q);
  const results = useMemo<CoaItem[]>(() => {
    if (!submitted || !query) return [];
    return coaCatalog.filter((c) => {
      const haystack = normalize(
        [c.taskNumber, c.verifyKey, c.slug, c.name, c.dosage, c.productSlug ?? ""].join(" "),
      );
      return haystack.includes(query);
    });
  }, [submitted, query]);

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
                Outils labo — Traçabilité
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-4xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[80px] sm:leading-[0.96]"
                data-shimmer="Retrouvez chaque lot en une seconde."
              >
                Retrouvez chaque lot en une seconde.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                Entrez un numéro de lot Janoshik, une clé de vérification ou le nom d'un peptide pour
                retrouver le certificat d'analyse correspondant.{" "}
                <span className="text-foreground">Transparence totale sur chaque lot.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ LOOKUP ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
              {/* --- Search --- */}
              <Reveal>
                <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card p-8 shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--brand-violet)_35%,transparent)] sm:p-10">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    aria-hidden
                    style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }}
                  />

                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    — Recherche CoA
                  </span>
                  <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[32px]">
                    Renseignez un identifiant.
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-muted-foreground">
                    Numéro de lot, clé Janoshik ou nom de peptide. La recherche tolère les espaces et la casse.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                    className="mt-9"
                  >
                    <label htmlFor="lot" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      <Search className="size-3.5 text-accent" strokeWidth={1.6} />
                      N° de lot / Clé Janoshik / Nom du peptide
                    </label>
                    <input
                      id="lot"
                      type="search"
                      value={q}
                      onChange={(e) => {
                        setQ(e.target.value);
                        setSubmitted(false);
                      }}
                      placeholder="ex. #75760, TDM8D15H11BE, Retatrutide"
                      className="mt-2 w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-[15px] font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[color-mix(in_oklab,var(--brand-violet)_60%,var(--border))] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-violet)_12%,transparent)]"
                    />
                    <button
                      type="submit"
                      disabled={q.trim().length === 0}
                      className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-opacity disabled:opacity-40"
                    >
                      Rechercher le CoA
                    </button>
                  </form>

                  <div className="mt-8 rounded-[16px] border border-border/70 bg-card/60 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.6} />
                      <p className="text-[12px] leading-[1.6] text-muted-foreground">
                        Chaque lot est testé indépendamment par{" "}
                        <a href="https://janoshik.com" target="_blank" rel="noreferrer" className="text-foreground underline">
                          Janoshik Analytical
                        </a>
                        . La clé de vérification permet de contrôler l'authenticité du CoA directement sur leur site.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* --- Results --- */}
              <Reveal delay={80}>
                <div className="relative overflow-hidden rounded-[28px] border border-transparent p-[1px]" style={{ background: GRADIENT_BTN }}>
                  <div className="relative flex min-h-full flex-col rounded-[27px] bg-card px-6 py-8 sm:px-10 sm:py-10">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-70"
                      aria-hidden
                      style={{
                        background:
                          "radial-gradient(70% 60% at 80% 10%, color-mix(in oklab, var(--brand-violet) 14%, transparent), transparent 70%), radial-gradient(60% 60% at 10% 90%, color-mix(in oklab, var(--brand-cyan) 12%, transparent), transparent 70%)",
                      }}
                    />
                    <div className="relative flex-1">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        <Sparkles className="size-3.5" strokeWidth={1.6} />
                        Résultats de recherche
                      </div>

                      {!submitted ? (
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-[20px] border border-border/70 bg-card/60 p-8 text-center">
                          <Search className="size-8 text-muted-foreground" strokeWidth={1.4} />
                          <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                            Saisissez un identifiant pour afficher les certificats d'analyse correspondants.
                          </p>
                        </div>
                      ) : results.length === 0 ? (
                        <div className="mt-6 rounded-[20px] border border-border/70 bg-card/60 p-6 text-[14px] text-muted-foreground">
                          Aucun lot trouvé pour cette recherche. Vérifiez le numéro ou consultez tous nos lots ci-dessous.
                        </div>
                      ) : (
                        <ul className="mt-6 grid gap-3">
                          {results.map((c) => (
                            <CoaCard key={c.slug} c={c} highlight />
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* --- All lots --- */}
            <Reveal delay={120}>
              <div className="mt-16">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      — Transparence totale
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
                      Tous les lots référencés
                    </h2>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {coaCatalog.length} lots
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                  Chaque lot est testé indépendamment par{" "}
                  <a href="https://janoshik.com" target="_blank" rel="noreferrer" className="text-foreground underline">
                    Janoshik Analytical
                  </a>
                  . La clé de vérification permet de contrôler l'authenticité du CoA directement sur leur site.
                </p>

                <ul className="mt-8 grid gap-3">
                  {coaCatalog.map((c) => (
                    <CoaCard key={c.slug} c={c} />
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function CoaCard({ c, highlight }: { c: CoaItem; highlight?: boolean }) {
  return (
    <li
      className={`overflow-hidden rounded-2xl border bg-card transition-colors ${
        highlight ? "border-accent/50 shadow-sm" : "border-border/60"
      }`}
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <a href={c.src} target="_blank" rel="noreferrer" className="block shrink-0 overflow-hidden rounded-lg bg-surface">
          <img
            src={c.src}
            alt={`CoA ${c.name} ${c.dosage}`}
            loading="lazy"
            className="h-24 w-20 object-cover"
          />
        </a>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="font-display text-[16px] font-medium text-foreground">{c.name}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {c.dosage}
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
            <MetaRow label="Lot" value={c.taskNumber} mono />
            <MetaRow label="Pureté" value={c.purity} />
            <MetaRow label="Date" value={c.date} mono />
            <MetaRow label="Clé Janoshik" value={c.verifyKey} mono />
          </div>
          {c.notes && (
            <div className="mt-2 text-[12px] italic text-muted-foreground">{c.notes}</div>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <a
            href={c.src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-surface"
          >
            Ouvrir le CoA →
          </a>
          {c.productSlug && (
            <Link
              to="/produits/$slug"
              params={{ slug: c.productSlug }}
              className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium text-accent hover:underline"
            >
              Voir la fiche
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-[12px] text-foreground ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
