import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "Laboratoire — À propos · Aetherion Labs" },
      {
        name: "description",
        content:
          "Aetherion Labs : fournisseur de réactifs peptidiques de qualité recherche pour laboratoires académiques et CRO. Contrôle qualité HPLC, CoA systématique.",
      },
      { property: "og:url", content: "/a-propos" },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-16">
          <RuoBadge />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Aetherion Labs — Laboratoire fournisseur de réactifs de recherche
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Aetherion Labs est un fournisseur spécialisé dans la mise à disposition de peptides
            synthétiques destinés à la recherche scientifique en laboratoire. Nos réactifs sont
            utilisés par des équipes académiques, des CRO et des instituts publics pour la
            caractérisation pharmacologique in vitro.
          </p>
        </div>
      </section>

      <section className="container-prose py-16">
        <div className="grid gap-10 md:grid-cols-2">
          {[
            {
              t: "Contrôle qualité analytique",
              d: "Chaque lot est analysé par HPLC en phase inverse (pureté ≥ 98 %) et par spectrométrie de masse pour validation d'identité. Le Certificat d'Analyse (CoA) est joint à chaque expédition.",
            },
            {
              t: "Synthèse & sourcing",
              d: "Nos peptides sont synthétisés en phase solide (SPPS Fmoc) par des partenaires GMP-friendly audités. Chaque lot est tracé du brut jusqu'au flacon final.",
            },
            {
              t: "Conditionnement laboratoire",
              d: "Flacons en verre borosilicate type I, sertissage aluminium, lyophilisation sous atmosphère contrôlée. Étiquetage normalisé incluant numéro de lot et date de péremption.",
            },
            {
              t: "Engagement RUO",
              d: "Nous ne commercialisons nos produits qu'à des chercheurs, laboratoires, CRO ou institutions reconnues. Aucun usage humain, vétérinaire ou diagnostique n'est promu ou supporté.",
            },
          ].map((b) => (
            <div key={b.t} className="border-l border-medical/40 pl-5">
              <h2 className="text-lg font-semibold tracking-tight">{b.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
