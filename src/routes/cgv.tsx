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
            <h2 className="text-base font-semibold text-foreground">Article 1 – Objet et champ d'application</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :
            </p>
            <p className="mt-2">
              <strong>Le vendeur :</strong> Aetherion-lab.com – Micro-entreprise<br />
              Adresse : 75017 Paris<br />
              SIRET : 102 457 652 00018<br />
              N° TVA : Non applicable – franchise en base (article 293 B du CGI)
            </p>
            <p className="mt-2">
              <strong>Le client :</strong> professionnel ou particulier passant commande pour motif de recherche sur le site Aetherion-lab.com.
            </p>
            <p className="mt-2">
              Le site propose à la vente des produits chimiques et réactifs destinés exclusivement à la recherche scientifique en laboratoire (usage in vitro uniquement). Toute commande implique l'acceptation sans réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 2 – Produits – Usage strictement réservé</h2>
            <p>
              Les produits vendus sont strictement destinés à un usage de recherche en laboratoire (Research Use Only – RUO). Ils ne sont ni des médicaments, ni des compléments alimentaires, ni des produits destinés à un usage vétérinaire, diagnostique ou thérapeutique.
            </p>
            <p className="mt-2">
              Le client déclare et garantit qu'il utilise les produits exclusivement dans le cadre de travaux de recherche, d'études ou d'analyses en laboratoire, que ce soit pour son compte ou pour le compte d'une entreprise, d'un organisme de recherche ou d'une institution académique.
            </p>
            <p className="mt-2">
              Le vendeur décline toute responsabilité en cas d'utilisation autre que celle expressément prévue (recherche in vitro), et notamment en cas d'administration à des animaux, d'utilisation thérapeutique, cosmétique ou alimentaire.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 3 – Commande et acceptation</h2>
            <p>
              Le client déclare avoir pris connaissance et accepté les présentes CGV avant de valider sa commande.
            </p>
            <p className="mt-2">
              Toute commande est ferme et définitive dès validation du paiement. Le vendeur se réserve le droit de refuser toute commande s'il a un doute sur l'usage réel qui sera fait des produits.
            </p>
            <p className="mt-2">
              L'acceptation des CGV est matérialisée par le cochement de la case « J'accepte les conditions générales de vente » avant la validation du paiement.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 4 – Prix et paiement</h2>
            <p>
              Les prix sont indiqués en euros toutes taxes comprises (TTC). La TVA n'est pas applicable – franchise en base (article 293 B du CGI).
            </p>
            <p className="mt-2">
              Le paiement est exigible immédiatement à la commande et s'effectue par les moyens de paiement proposés sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 5 – Livraison</h2>
            <p>
              Les produits sont expédiés dans un emballage neutre et discret, sans mention du contenu à l'extérieur du colis.
            </p>
            <p className="mt-2">
              Les délais de livraison sont donnés à titre indicatif. Le client est seul responsable du respect des réglementations locales applicables à l'importation et à l'utilisation des produits.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 6 – Droit de rétractation</h2>
            <p>
              Conformément à l'article L.221-18 du Code de la consommation, le client dispose d'un droit de rétractation de 14 jours à compter de la réception des produits.
            </p>
            <p className="mt-2">
              Toutefois, conformément à l'article L.221-28 du Code de la consommation, ce droit ne peut être exercé pour les produits ayant été ouverts, reconstitués ou dont le conditionnement scellé a été altéré après livraison, pour des raisons de sécurité et de protection de la santé. En conséquence, aucun retour ni remboursement ne sera accepté pour tout produit dont le conditionnement scellé a été ouvert.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 7 – Garantie et responsabilité</h2>
            <p>
              Les produits sont vendus en l'état, sans aucune garantie d'usage particulier. Le vendeur ne pourra en aucun cas être tenu responsable de l'utilisation qui sera faite des produits par le client.
            </p>
            <p className="mt-2">
              Le client assume l'entière responsabilité de l'usage qu'il fait des produits, y compris en cas de mauvaise utilisation, d'erreur de manipulation ou d'usage non conforme à leur destination (recherche in vitro).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 8 – Usage strictement réservé – Engagement du client</h2>
            <p>
              Le client s'engage expressément à n'utiliser les produits que dans un cadre de recherche scientifique en laboratoire.
            </p>
            <p className="mt-2">
              Toute utilisation animale, thérapeutique, diagnostique, cosmétique ou autre est strictement interdite et relève de la seule responsabilité du client.
            </p>
            <p className="mt-2">
              Le vendeur se réserve le droit de refuser toute commande s'il a un doute sur l'usage réel qui sera fait des produits.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 9 – Données personnelles</h2>
            <p>
              Les données collectées sont traitées conformément au RGPD. Elles ne sont utilisées que pour le traitement des commandes et la relation client.
            </p>
            <p className="mt-2">
              Le client dispose d'un droit d'accès, de rectification et d'opposition qu'il peut exercer par email à l'adresse indiquée sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 10 – Preuve et conservation des contrats</h2>
            <p>
              Le fait de cocher la case « J'accepte les conditions générales de vente » avant la validation du paiement constitue une acceptation irrévocable et sans réserve des présentes.
            </p>
            <p className="mt-2">
              Les contrats sont archivés par le vendeur. Conformément à la réglementation, le client peut accéder à ses factures depuis son espace client.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">Article 11 – Loi applicable et juridiction</h2>
            <p>
              Les présentes CGV sont soumises au droit français.
            </p>
            <p className="mt-2">
              En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.
            </p>
            <p className="mt-2">
              Ces CGV sont valables pour toute commande passée sur le Aetherion-lab.com.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  ),
});
