import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { products } from "@/data/products";

export const Route = createFileRoute("/etudes-scientifiques")({
  head: () => ({
    meta: [
      { title: "Études scientifiques — Références PubMed · Aetherion Labs" },
      {
        name: "description",
        content:
          "Bibliographie scientifique référencée sur PubMed pour chaque peptide de recherche du catalogue Aetherion Labs.",
      },
      { property: "og:url", content: "/etudes-scientifiques" },
    ],
    links: [{ rel: "canonical", href: "/etudes-scientifiques" }],
  }),
  component: StudiesPage,
});

function StudiesPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-14">
          <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
            Bibliographie
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Études scientifiques de référence
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Les références ci-dessous sont fournies à titre documentaire pour caractériser nos
            réactifs de recherche. Elles ne constituent en aucun cas une indication d'usage
            humain, thérapeutique ou diagnostique. Sources : NIH / PubMed.
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="space-y-12">
          {(() => {
            const order = ["retatrutide", "ghk-cu", "cjc-1295-ipamorelin"];
            const sorted = [...products]
              .filter((p) => p.references.length > 0)
              .sort((a, b) => {
                const ai = order.indexOf(a.slug);
                const bi = order.indexOf(b.slug);
                if (ai !== -1 && bi !== -1) return ai - bi;
                if (ai !== -1) return -1;
                if (bi !== -1) return 1;
                return 0;
              });
            return sorted;
          })().map((p) => (
            <div key={p.slug} className="border-t border-border pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
                    {p.category}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">{p.name}</h2>
                </div>
                <Link
                  to="/produits/$slug"
                  params={{ slug: p.slug }}
                  className="font-mono text-[11px] uppercase tracking-wider text-medical hover:underline"
                >
                  Fiche produit →
                </Link>
              </div>
              <ul className="mt-5 divide-y divide-border rounded-md border border-border bg-card">
                {p.references.map((r) => (
                  <li key={r.pmid} className="p-5">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {r.journal} · {r.year} · PMID {r.pmid}
                    </div>
                    <div className="mt-1 text-sm font-medium">{r.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{r.authors}</div>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block font-mono text-[11px] uppercase tracking-wider text-medical hover:underline"
                    >
                      Consulter sur PubMed →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
