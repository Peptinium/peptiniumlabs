import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact laboratoire — Peptinium Labs" },
      {
        name: "description",
        content:
          "Contactez l'équipe Peptinium Labs pour un devis recherche, une documentation technique ou une demande de Certificat d'Analyse (CoA).",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-14">
          <RuoBadge />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Contact — Service recherche & devis laboratoire
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Notre équipe répond aux demandes émanant de laboratoires, CRO et institutions de
            recherche : devis, Certificats d'Analyse, MSDS, documentation technique.
          </p>
        </div>
      </section>

      <section className="container-prose grid gap-10 py-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-medical">Coordonnées</div>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Service clientèle laboratoire</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Email</dt>
              <dd>research@peptinium-labs.com</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Devis & CoA</dt>
              <dd>quote@peptinium-labs.com</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Horaires</dt>
              <dd>Lun–Ven · 9h00–18h00 CET</dd>
            </div>
          </dl>
          <div className="mt-8 rounded-sm border border-warning/40 bg-warning/5 p-4 text-xs leading-relaxed text-foreground/80">
            <strong className="text-warning">Avis RUO :</strong> les commandes ne sont acceptées
            qu'auprès d'entités de recherche identifiées. Aucune demande à finalité humaine,
            vétérinaire ou thérapeutique ne sera traitée.
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-md border border-border bg-card p-6"
        >
          {sent ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-medical/10 text-medical">
                ✓
              </div>
              <h3 className="mt-4 text-lg font-semibold">Demande transmise</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Notre équipe vous répondra sous 24h ouvrées.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nom du chercheur" />
                <Input label="Laboratoire / Institution" />
                <Input label="Email professionnel" type="email" />
                <Input label="Téléphone" />
              </div>
              <label className="mt-4 block">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Nature de la demande
                </div>
                <select className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:border-medical focus:outline-none">
                  <option>Devis catalogue</option>
                  <option>Demande de CoA / MSDS</option>
                  <option>Pack recherche sur-mesure</option>
                  <option>Documentation technique</option>
                </select>
              </label>
              <label className="mt-4 block">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Détail du protocole / produits
                </div>
                <textarea
                  rows={5}
                  className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:border-medical focus:outline-none"
                  placeholder="Référence(s) du catalogue, quantités, type de recherche in vitro..."
                />
              </label>
              <label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" required className="mt-0.5" />
                <span>
                  Je certifie représenter une entité de recherche et utiliser les produits
                  commandés <strong className="text-foreground">exclusivement pour la recherche
                  scientifique en laboratoire (RUO)</strong>.
                </span>
              </label>
              <button className="mt-6 w-full rounded-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Envoyer la demande
              </button>
            </>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <input
        type={type}
        className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:border-medical focus:outline-none"
      />
    </label>
  );
}
