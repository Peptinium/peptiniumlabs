import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "CGV — Aetherion Labs" },
      { name: "description", content: "Conditions générales de vente Aetherion Labs." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/cgv" },
    ],
    links: [{ rel: "canonical", href: "/cgv" }],
  }),
  component: () => (
    <SiteLayout>
      <article className="container-prose max-w-3xl py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Conditions Générales de Vente</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">1. Objet</h2>
            <p>
              Les présentes CGV régissent la vente de réactifs chimiques de recherche par
              Aetherion Labs à destination de laboratoires, CRO et institutions de recherche
              identifiés.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">2. Destination — RUO</h2>
            <p>
              L'acheteur reconnaît expressément que les produits sont strictement destinés à un
              usage de recherche scientifique en laboratoire (Research Use Only). Toute autre
              utilisation — notamment humaine, vétérinaire, diagnostique ou thérapeutique — est
              formellement interdite et engage la seule responsabilité de l'acheteur.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">3. Qualité & Certificat d'Analyse</h2>
            <p>
              Chaque lot est livré avec son Certificat d'Analyse (CoA) indiquant la pureté HPLC,
              la validation par spectrométrie de masse, le numéro de lot et la date de
              péremption.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">4. Conservation & responsabilité</h2>
            <p>
              Il appartient à l'acheteur de respecter les conditions de conservation indiquées
              (typiquement −20 °C, à l'abri de la lumière). La responsabilité d'Aetherion Labs ne
              saurait être engagée pour un usage non conforme.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  ),
});
