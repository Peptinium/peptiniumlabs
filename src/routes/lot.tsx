import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { coaCatalog, type CoaItem } from "@/data/coa-catalog";

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
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50 [animation:grid-drift_24s_linear_infinite]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,var(--background)_85%)]" />
        <div className="container-prose relative py-14">
          <RuoBadge />
          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            <span className="shimmer-text" data-shimmer="Traçabilité des lots">
              Traçabilité des lots
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Entrez un numéro de lot Janoshik (ex. <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[12px]">#75760</code>),
            une clé de vérification (<code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[12px]">TDM8D15H11BE</code>)
            ou le nom d'un peptide pour retrouver le certificat d'analyse correspondant.
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="rounded-2xl border border-border/60 bg-surface/40 p-5"
        >
          <label htmlFor="lot" className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            N° de lot / Clé Janoshik / Nom du peptide
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="lot"
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSubmitted(false);
              }}
              placeholder="ex. #75760, TDM8D15H11BE, Retatrutide"
              className="flex-1 rounded-lg border border-border bg-background px-4 py-3 font-mono text-[14px] text-foreground outline-none focus:border-foreground/40"
            />
            <button
              type="submit"
              disabled={q.trim().length === 0}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[13px] font-medium text-background transition-opacity disabled:opacity-40"
            >
              Rechercher le CoA
            </button>
          </div>
        </form>

        {/* Results */}
        {submitted && (
          <div className="mt-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </div>
            {results.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-border/60 bg-surface/40 p-6 text-[14px] text-muted-foreground">
                Aucun lot trouvé pour cette recherche. Vérifiez le numéro ou consultez tous nos
                lots ci-dessous.
              </div>
            ) : (
              <ul className="mt-5 grid gap-4">
                {results.map((c) => (
                  <CoaCard key={c.slug} c={c} highlight />
                ))}
              </ul>
            )}
          </div>
        )}

        {/* All lots — transparency */}
        <div className="mt-16">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                — Transparence totale
              </div>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
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
      </section>
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
