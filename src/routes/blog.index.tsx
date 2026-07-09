import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { blogArticles } from "@/data/blog-articles";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog Peptinium Labs — Recherche peptidique, HPLC, méthodologie analytique" },
      {
        name: "description",
        content:
          "Articles laboratoire Peptinium classés par catégorie : science des peptides, méthodologie HPLC, lecture d'un CoA, stabilité et conservation en laboratoire.",
      },
      { property: "og:title", content: "Blog laboratoire — Peptinium Labs" },
      { property: "og:description", content: "Guides méthodologiques et science peptidique — organisés par catégories." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const sorted = useMemo(
    () => [...blogArticles].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );
  const categories = useMemo(() => {
    const set = new Set<string>();
    sorted.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [sorted]);

  const [active, setActive] = useState<string>("all");

  const featured = sorted[0];
  const rest = sorted.slice(1);

  const filtered = active === "all" ? rest : rest.filter((a) => a.category === active);
  const grouped = useMemo(() => {
    const map: Record<string, typeof rest> = {};
    filtered.forEach((a) => {
      (map[a.category] ??= []).push(a);
    });
    return map;
  }, [filtered]);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="container-prose relative py-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Journal laboratoire</p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-5xl">
              <span className="journal-title-sweep" aria-label="Le Carnet Peptinium">
                <span className="journal-title-sweep__base">Le Carnet Peptinium</span>
                <span className="journal-title-sweep__light" aria-hidden="true">Le Carnet Peptinium</span>
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Méthodologie analytique, histoire scientifique et lecture des certificats.
              Filtrez par catégorie pour aller droit au sujet qui vous intéresse.
            </p>
          </Reveal>

          {/* Category filter pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[{ key: "all", label: "Toutes les catégories" }, ...categories.map((c) => ({ key: c, label: c }))].map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  active === c.key
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured article */}
      {featured && active === "all" && (
        <section className="container-prose pt-14">
          <Reveal>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              — À la une
            </div>
            <article className="mt-4 overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-accent">{featured.category}</span>
                <time dateTime={featured.date}>
                  {new Date(featured.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </time>
                <span>· {featured.readMinutes} min</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                <Link to="/blog/$slug" params={{ slug: featured.slug }} className="hover:text-accent">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-[1.7] text-muted-foreground">{featured.excerpt}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-background hover:-translate-y-0.5 transition-transform"
              >
                Lire l'article →
              </Link>
            </article>
          </Reveal>
        </section>
      )}

      {/* Grouped by category */}
      <section className="container-prose space-y-14 py-14">
        {Object.entries(grouped).map(([cat, arts]) => (
          <div key={cat}>
            <Reveal>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— {cat}</h2>
              <div className="mt-2 h-px w-full bg-border/70" />
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {arts.map((a) => (
                <article
                  key={a.slug}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-accent">{a.category}</span>
                    <time dateTime={a.date}>
                      {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                    <span>· {a.readMinutes} min</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-medium leading-snug tracking-tight">
                    <Link to="/blog/$slug" params={{ slug: a.slug }} className="hover:text-accent">
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: a.slug }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent"
                  >
                    Lire l'article →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
