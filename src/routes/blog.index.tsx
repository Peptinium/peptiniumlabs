import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { blogArticles } from "@/data/blog-articles";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog Peptinium Labs — Recherche peptidique, méthodologie HPLC, reconstitution" },
      {
        name: "description",
        content:
          "Articles laboratoire Peptinium : reconstitution peptides, lecture d'un CoA HPLC, stockage, méthodologie de recherche.",
      },
      { property: "og:title", content: "Blog laboratoire — Peptinium Labs" },
      { property: "og:description", content: "Guides méthodologiques et science peptidique pour la recherche." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const sorted = [...blogArticles].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Journal laboratoire</p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-5xl">
              Le <span className="brand-gradient-text">Carnet</span> Peptinium
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Méthodologie, protocoles, lecture analytique. Des articles pensés pour la pratique de la recherche peptidique.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-prose py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((a) => (
            <article
              key={a.slug}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/40 hover:shadow-lg"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-accent">{a.category}</span>
                <time dateTime={a.date}>{new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time>
                <span>· {a.readMinutes} min</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-medium leading-snug tracking-tight">
                <Link to="/blog/$slug" params={{ slug: a.slug }} className="hover:text-accent">
                  {a.title}
                </Link>
              </h2>
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
      </section>
    </SiteLayout>
  );
}
