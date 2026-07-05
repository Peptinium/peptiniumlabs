import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Clock, ShieldCheck } from "lucide-react";
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
      {/* HERO éditorial */}
      <section className="relative overflow-hidden bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 85% 20%, color-mix(in oklab, var(--brand-violet) 10%, transparent) 0%, transparent 65%), radial-gradient(40% 40% at 10% 90%, color-mix(in oklab, var(--brand-cyan) 8%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
        />

        <div className="container-prose relative px-5 pt-20 pb-14 lg:pt-32 lg:pb-20">
          <span className="brand-gradient-text font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
            Nous écrire
          </span>
          <h1 className="mt-6 max-w-[14ch] text-[54px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[76px] lg:text-[104px] lg:leading-[0.94]">
            Parlons de votre{" "}
            <span className="brand-gradient-text">recherche</span>.
          </h1>
          <p className="mt-8 max-w-xl text-[17px] leading-[1.6] text-muted-foreground">
            Devis catalogue, Certificats d'Analyse, MSDS, packs sur mesure —
            notre équipe répond sous 24 h ouvrées aux laboratoires, CRO et
            institutions de recherche.
          </p>
        </div>
      </section>

      {/* Trio de valeurs */}
      <section data-reveal-blur className="border-y border-border/60">
        <div className="container-prose grid gap-10 px-5 py-14 sm:grid-cols-3">
          {[
            { icon: Mail, k: "Email", v: "contact@peptinium.com", s: "Réponse < 24 h" },
            { icon: Clock, k: "Horaires", v: "Lun – Ven", s: "9h00 – 18h00 CET" },
            { icon: ShieldCheck, k: "Cadre", v: "RUO uniquement", s: "Recherche en laboratoire" },
          ].map(({ icon: Icon, k, v, s }) => (
            <div key={k} className="flex flex-col">
              <Icon className="size-5 text-foreground/70" strokeWidth={1.4} />
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {k}
              </div>
              <div className="mt-2 text-[22px] font-semibold tracking-tight text-foreground">
                {v}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire */}
      <section data-reveal-blur className="container-prose grid gap-14 px-5 py-20 lg:grid-cols-[0.9fr_1.3fr] lg:py-28">
        <div className="lg:pt-4">
          <RuoBadge />
          <h2 className="mt-6 text-[36px] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground sm:text-[44px]">
            Une demande précise mérite une réponse précise.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.65] text-muted-foreground">
            Décrivez le protocole, les molécules et les quantités visées.
            Un ingénieur d'application vous recontacte avec un devis, les CoA
            associés et les délais d'expédition.
          </p>

          <div className="mt-10 rounded-2xl border border-warning/30 bg-warning/[0.04] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-warning">
              Avis RUO
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
              Les commandes ne sont acceptées qu'auprès d'entités de
              recherche. Aucune demande à finalité humaine, vétérinaire ou
              thérapeutique n'est traitée.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-9"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
          />
          {sent ? (
            <div className="py-14 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-medical/10 text-medical">
                ✓
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                Demande transmise
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Notre équipe vous répondra sous 24 h ouvrées.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom du chercheur" />
                <Field label="Laboratoire / Institution" />
                <Field label="Email professionnel" type="email" />
                <Field label="Téléphone" />
              </div>

              <label className="mt-5 block">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Nature de la demande
                </div>
                <select className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-foreground/60 focus:outline-none">
                  <option>Devis catalogue</option>
                  <option>Demande de CoA / MSDS</option>
                  <option>Pack recherche sur mesure</option>
                  <option>Documentation technique</option>
                </select>
              </label>

              <label className="mt-5 block">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Détail du protocole / produits
                </div>
                <textarea
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-foreground/60 focus:outline-none"
                  placeholder="Référence(s) du catalogue, quantités, type de recherche in vitro..."
                />
              </label>

              <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input type="checkbox" required className="mt-1" />
                <span>
                  Je certifie représenter une entité de recherche et utiliser
                  les produits commandés{" "}
                  <strong className="text-foreground">
                    exclusivement pour la recherche scientifique en laboratoire (RUO)
                  </strong>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="group mt-7 inline-flex items-center gap-3 rounded-full px-7 py-4 font-sans text-[14px] font-medium text-white shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_color-mix(in_oklab,var(--brand-violet)_85%,transparent)]"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)",
                }}
              >
                Envoyer la demande
                <span
                  aria-hidden
                  className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0.5"
                >
                  <ArrowRight className="size-3.5" strokeWidth={2.2} />
                </span>
              </button>
            </>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <input
        type={type}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-foreground/60 focus:outline-none"
      />
    </label>
  );
}
