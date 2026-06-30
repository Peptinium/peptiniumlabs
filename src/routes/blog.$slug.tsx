import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { findArticle, blogArticles } from "@/data/blog-articles";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = findArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Article · Peptinium Labs" }] };
    return {
      meta: [
        { title: `${a.title} · Peptinium Labs` },
        { name: "description", content: a.description },
        { name: "keywords", content: a.tags.join(", ") },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${a.slug}` },
        { property: "article:published_time", content: a.date },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blog/${a.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.description,
            datePublished: a.date,
            author: { "@type": "Organization", name: "Peptinium Labs" },
            publisher: { "@type": "Organization", name: "Peptinium Labs" },
          }),
        },
      ],
    };
  },
  errorComponent: () => (
    <SiteLayout>
      <div className="container-prose py-24 text-center">
        <p>Une erreur est survenue.</p>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-prose py-24 text-center">
        <h1 className="font-display text-3xl">Article introuvable</h1>
        <Link to="/blog" className="mt-4 inline-block text-accent">← Retour au blog</Link>
      </div>
    </SiteLayout>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const other = blogArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <SiteLayout>
      <article className="container-prose max-w-3xl py-14">
        <Link to="/blog" className="text-xs text-muted-foreground hover:text-accent">← Carnet</Link>
        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-accent">{article.category}</span>
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <span>· {article.readMinutes} min de lecture</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>

        <div className="prose-article mt-10">
          {renderMarkdown(article.body)}
        </div>

        {other.length > 0 && (
          <aside className="mt-16 border-t border-border pt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">À lire ensuite</p>
            <ul className="mt-3 space-y-2">
              {other.map((a) => (
                <li key={a.slug}>
                  <Link to="/blog/$slug" params={{ slug: a.slug }} className="text-sm font-medium hover:text-accent">
                    → {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </SiteLayout>
  );
}

function renderMarkdown(md: string) {
  const blocks = md.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 font-display text-2xl font-medium tracking-tight">
          {block.slice(3)}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-8 font-display text-xl font-medium tracking-tight">
          {block.slice(4)}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split(/\n- /).map((it) => it.replace(/^- /, ""));
      return (
        <ul key={i} className="my-4 list-disc space-y-1.5 pl-6 text-[15px] leading-relaxed text-foreground/85">
          {items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="my-4 text-[15px] leading-relaxed text-foreground/85"
        dangerouslySetInnerHTML={{ __html: inline(block) }}
      />
    );
  });
}

function inline(s: string) {
  return s
    .replace(/`([^`]+)`/g, '<code class="font-mono text-[13px] bg-surface px-1.5 py-0.5 rounded">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent underline underline-offset-2">$1</a>');
}
