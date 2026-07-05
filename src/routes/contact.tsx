import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Clock, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Peptinium Labs" },
      {
        name: "description",
        content:
          "Une question, un devis, un suivi de commande ? Notre équipe répond sous un jour ouvré.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  return (
    <SiteLayout>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-background">
        <div className="container-prose relative px-5 pt-24 pb-14 lg:pt-32 lg:pb-20">
          <Reveal>
            <span className="text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
              — Nous contacter
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-[16ch] text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[76px] lg:text-[96px] lg:leading-[0.94]">
              On est là, <span className="italic font-light">simplement</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-[17px] leading-[1.6] text-muted-foreground">
              Une question sur une commande, un produit, un délai&nbsp;? Écrivez-nous —
              une vraie personne vous répond sous un jour ouvré.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ Contenu ============ */}
      <section className="container-prose grid gap-14 px-5 pb-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:pb-32">
        {/* Colonne infos */}
        <Reveal>
          <div className="flex flex-col gap-10">
            {[
              { Icon: Mail, k: "Email", v: "contact@peptinium.com", s: "Réponse sous 24 h" },
              { Icon: Clock, k: "Horaires", v: "Lun – Ven", s: "9h – 18h CET" },
              { Icon: MapPin, k: "Expédition", v: "Depuis l'Europe", s: "Suivi fourni" },
            ].map(({ Icon, k, v, s }) => (
              <div key={k} className="flex items-start gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
                <Icon className="mt-1 size-5 shrink-0 text-foreground/70" strokeWidth={1.4} />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {k}
                  </div>
                  <div className="mt-1.5 text-[19px] font-medium tracking-tight text-foreground">
                    {v}
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground">{s}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Formulaire — style Vela */}
        <Reveal delay={80}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="rounded-3xl border border-border bg-card p-7 sm:p-10"
          >
            {sent ? (
              <div className="py-16 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-foreground text-background">
                  ✓
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
                  Message envoyé
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Merci — nous revenons vers vous très vite.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2">
                  <VelaField label="Nom" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <VelaField label="Téléphone" optional value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                </div>

                <div className="mt-8">
                  <VelaField label="E-mail" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                </div>

                <div className="mt-8">
                  <VelaField
                    label="Message"
                    required
                    textarea
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={form.message}
                    onChange={(v) => setForm({ ...form, message: v })}
                  />
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Nous répondons sous un jour ouvré
                  </span>
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-background transition-transform hover:-translate-y-0.5"
                  >
                    Envoyer le message
                    <span className="grid size-6 place-items-center rounded-full bg-background/15 transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="size-3" strokeWidth={2.2} />
                    </span>
                  </button>
                </div>
              </>
            )}
          </form>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

function VelaField({
  label,
  type = "text",
  required,
  optional,
  textarea,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  textarea?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/80">
          {label}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/70">
          {required ? "Obligatoire" : optional ? "Facultatif" : ""}
        </span>
      </div>
      {textarea ? (
        <textarea
          required={required}
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full resize-y border-0 border-b border-border bg-transparent px-0 py-2 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none focus:ring-0"
        />
      ) : (
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none focus:ring-0"
        />
      )}
    </label>
  );
}
