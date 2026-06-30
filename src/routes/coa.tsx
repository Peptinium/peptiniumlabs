import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { coaCatalog } from "@/data/coa-catalog";

export const Route = createFileRoute("/coa")({
  head: () => ({
    meta: [
      { title: "Certificats d'Analyse (CoA) — Pureté HPLC ≥ 99 % · Peptinium Labs" },
      {
        name: "description",
        content:
          "Tous les Certificats d'Analyse Janoshik de nos peptides de recherche. Vérification HPLC indépendante, clé de vérification publique sur janoshik.com.",
      },
      { property: "og:title", content: "Certificats d'Analyse — Peptinium Labs" },
      { property: "og:description", content: "Téléchargez les CoA Janoshik (HPLC ≥ 99 %) de chaque peptide." },
      { property: "og:url", content: "/coa" },
    ],
    links: [{ rel: "canonical", href: "/coa" }],
  }),
  component: CoaPage,
});

function CoaPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Transparence laboratoire
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-5xl">
              Certificats d'Analyse <span className="brand-gradient-text">HPLC ≥ 99 %</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Chaque lot de Peptinium Labs est testé indépendamment par{" "}
              <a href="https://janoshik.com" target="_blank" rel="noreferrer" className="underline">
                Janoshik Analytical
              </a>
              . Téléchargez le CoA ci-dessous et vérifiez la clé directement sur leur site.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-prose py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coaCatalog.map((c) => (
            <article
              key={c.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/40 hover:shadow-lg"
            >
              <a href={c.src} target="_blank" rel="noreferrer" className="block bg-surface">
                <img
                  src={c.src}
                  alt={`Certificat d'analyse ${c.name} ${c.dosage}`}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-contain p-4 transition-transform group-hover:scale-[1.02]"
                />
              </a>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-lg font-medium">{c.name}</h2>
                  <span className="font-mono text-xs text-muted-foreground">{c.dosage}</span>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{c.purity}</p>
                {c.notes && <p className="text-xs text-muted-foreground">{c.notes}</p>}
                <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-[11px]">
                  <dt className="text-muted-foreground">Tâche</dt>
                  <dd className="text-right font-mono">{c.taskNumber}</dd>
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="text-right font-mono">{c.date}</dd>
                  <dt className="text-muted-foreground">Clé</dt>
                  <dd className="text-right font-mono">{c.verifyKey}</dd>
                </dl>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={c.src}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-full bg-foreground px-3 py-2 text-center text-xs font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Voir le PDF
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard?.writeText(c.verifyKey);
                      } catch {}
                      window.open("https://janoshik.com/verification/", "_blank", "noreferrer");
                    }}
                    title={`Clé ${c.verifyKey} copiée — collez-la sur Janoshik`}
                    className="rounded-full border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                  >
                    Vérifier
                  </button>
                </div>
                {c.productSlug && (
                  <Link
                    to="/produits/$slug"
                    params={{ slug: c.productSlug }}
                    className="mt-1 text-center text-[11px] text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Voir le produit →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
