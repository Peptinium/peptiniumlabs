import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";
import { VialIllustration } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/produits/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    return {
      meta: [
        { title: `${p?.name ?? "Produit"} — Réactif de recherche RUO · Aetherion Labs` },
        {
          name: "description",
          content: p
            ? `${p.name} (CAS ${p.cas}), pureté ${p.purity}, ${p.dosage}. Réactif destiné exclusivement à la recherche scientifique en laboratoire (RUO).`
            : "Fiche produit Aetherion Labs.",
        },
        { property: "og:title", content: `${p?.name} — Aetherion Labs` },
        { property: "og:url", content: `/produits/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/produits/${params.slug}` }],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-prose py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Produit introuvable</h1>
        <Link to="/produits" className="mt-4 inline-block text-accent hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="container-prose py-6">
          <nav className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Accueil</Link>
            <span className="mx-2 text-border">/</span>
            <Link to="/produits" className="hover:text-foreground">Catalogue</Link>
            <span className="mx-2 text-border">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-prose py-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* Visual */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="relative aspect-[5/4] overflow-hidden">
                <div className="absolute inset-0 dot-bg opacity-60" />
                <VialIllustration label={product.name} />
                <div className="absolute left-4 top-4"><RuoBadge /></div>
                <div className="pointer-events-none absolute -bottom-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_5s_ease-in-out_infinite]" />
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-card">
                {[
                  { k: "Pureté", v: product.purity },
                  { k: "Forme", v: "Lyophilisé" },
                  { k: "Flacon", v: product.dosage },
                ].map((m) => (
                  <div key={m.k} className="p-4 text-center">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{m.k}</div>
                    <div className="mt-1.5 font-display text-sm font-medium text-foreground">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={100}>
            <div>
              <RuoBadge />
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                — {product.category}
              </div>
              <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-6 text-sm">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">N° CAS</dt>
                  <dd className="mt-1 font-mono text-foreground">{product.cas}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Masse molaire</dt>
                  <dd className="mt-1 font-mono text-foreground">{product.molecularWeight}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Formule moléculaire</dt>
                  <dd className="mt-1 font-mono text-xs break-all text-foreground">{product.molecularFormula}</dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    Tarif laboratoire — flacon unique
                  </div>
                  <div className="mt-1 font-display text-4xl font-medium">{product.price} €</div>
                </div>
                <button className="group relative overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                  <span className="relative z-10 flex items-center gap-2">
                    Demander un devis labo
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="absolute inset-y-0 left-0 w-14 -translate-x-full bg-accent/40 blur-md transition-transform duration-700 group-hover:translate-x-[460%]" />
                </button>
              </div>

              <div className="mt-7 rounded-xl border border-warning/40 bg-warning/5 p-5 text-xs leading-relaxed text-foreground/80">
                <strong className="block font-mono uppercase tracking-[0.15em] text-warning">
                  Research Use Only — Usage laboratoire exclusif
                </strong>
                <p className="mt-2">
                  Non destiné à un usage humain, vétérinaire, diagnostique ou thérapeutique.
                  Aucune indication d'utilisation in vivo. Manipulation par personnel qualifié
                  exclusivement.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Detail blocks */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {[
            { mono: "01", title: "Contexte de recherche", body: product.researchSummary },
            { mono: "02", title: "Conservation", body: product.storage },
            { mono: "03", title: "Reconstitution (labo)", body: product.reconstitution, link: true },
          ].map((b, i) => (
            <Reveal key={b.mono} delay={i * 80}>
              <div className="hover-lift rounded-xl border border-border bg-card p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">— {b.mono}</div>
                <h3 className="mt-2 font-display text-lg font-medium tracking-tight">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                {b.link && (
                  <Link to="/calculatrice" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-accent link-underline">
                    → Calculatrice de dilution
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* References */}
        <div className="mt-20">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">— Bibliographie</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight">Références PubMed</h2>
          </Reveal>
          <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {product.references.map((r: typeof product.references[number], i: number) => (
              <Reveal key={r.pmid} delay={i * 70}>
                <li className="group flex items-start justify-between gap-6 p-6 transition-colors hover:bg-surface">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {r.journal} · {r.year} · PMID {r.pmid}
                    </div>
                    <div className="mt-1.5 font-display text-base font-medium text-foreground">{r.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{r.authors}</div>
                  </div>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-accent transition-transform group-hover:translate-x-0.5"
                  >
                    PubMed →
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </SiteLayout>
  );
}
