import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
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
        <h1 className="text-2xl font-semibold">Produit introuvable</h1>
        <Link to="/produits" className="mt-4 inline-block text-medical hover:underline">
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
      <div className="container-prose py-10">
        <nav className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/produits" className="hover:text-foreground">Catalogue</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* Visual */}
          <div className="rounded-md border border-border bg-surface">
            <div className="relative aspect-[5/4] overflow-hidden rounded-t-md">
              <VialIllustration label={product.name} />
              <div className="absolute left-4 top-4"><RuoBadge /></div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-card font-mono text-[11px]">
              {[
                { k: "Pureté", v: product.purity },
                { k: "Forme", v: "Lyophilisé" },
                { k: "Conditionnement", v: product.dosage },
              ].map((m) => (
                <div key={m.k} className="p-3 text-center">
                  <div className="uppercase tracking-wider text-muted-foreground">{m.k}</div>
                  <div className="mt-1 font-medium text-foreground">{m.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <RuoBadge />
            <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-medical">
              {product.category}
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-border py-5 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">N° CAS</dt>
                <dd className="font-mono">{product.cas}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Masse molaire</dt>
                <dd className="font-mono">{product.molecularWeight}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Formule</dt>
                <dd className="font-mono break-all">{product.molecularFormula}</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Tarif laboratoire — flacon unique
                </div>
                <div className="text-3xl font-semibold">{product.price} €</div>
              </div>
              <button className="rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Demander un devis labo
              </button>
            </div>

            <div className="mt-6 rounded-md border border-warning/40 bg-warning/5 p-4 text-xs leading-relaxed text-foreground/80">
              <strong className="block text-warning">
                Pour usage de recherche scientifique en laboratoire uniquement — Research Use Only (RUO).
              </strong>
              Non destiné à un usage humain, vétérinaire, diagnostique ou thérapeutique. Aucune
              indication d'utilisation in vivo. Manipulation par personnel qualifié exclusivement.
            </div>
          </div>
        </div>

        {/* Detail blocks */}
        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          <Block title="Contexte de recherche" mono="01">
            <p>{product.researchSummary}</p>
          </Block>
          <Block title="Conservation" mono="02">
            <p>{product.storage}</p>
          </Block>
          <Block title="Reconstitution (labo)" mono="03">
            <p>{product.reconstitution}</p>
            <Link to="/calculatrice" className="mt-3 inline-block font-mono text-[11px] uppercase tracking-wider text-medical hover:underline">
              → Calculatrice de dilution
            </Link>
          </Block>
        </div>

        {/* References */}
        <div className="mt-16">
          <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
            Références scientifiques
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Littérature PubMed</h2>
          <ul className="mt-6 divide-y divide-border rounded-md border border-border bg-card">
            {product.references.map((r) => (
              <li key={r.pmid} className="p-5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {r.journal} · {r.year} · PMID {r.pmid}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">{r.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{r.authors}</div>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block font-mono text-[11px] uppercase tracking-wider text-medical hover:underline"
                >
                  Voir sur PubMed →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SiteLayout>
  );
}

function Block({ title, mono, children }: { title: string; mono: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-5">
      <div className="font-mono text-[11px] uppercase tracking-wider text-medical">— {mono}</div>
      <h3 className="mt-1 text-base font-semibold tracking-tight">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
