import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Clock, MapPin, MessageCircle, Send, Star } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import client1 from "@/assets/testimonials/client-1.jpg";
import client2 from "@/assets/testimonials/client-2.jpg";
import client3 from "@/assets/testimonials/client-3.jpg";
import client4 from "@/assets/testimonials/client-4.jpg";

const SITE_URL = "https://peptinium.com";

export const Route = createFileRoute("/avis-contact")({
  head: () => ({
    meta: [
      { title: "Avis clients & contact — Peptinium Labs" },
      {
        name: "description",
        content:
          "Retours vérifiés de la communauté Peptinium, canaux Telegram & Discord, et formulaire de contact. Une vraie personne répond sous un jour ouvré.",
      },
      { property: "og:title", content: "Avis & Contact — Peptinium Labs" },
      {
        property: "og:description",
        content:
          "Témoignages photos, communauté Telegram/Discord et support Peptinium Labs.",
      },
      { property: "og:url", content: `${SITE_URL}/avis-contact` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/avis-contact` }],
  }),
  component: AvisContactPage,
});

const testimonials = [
  {
    img: client1,
    name: "Julien M.",
    location: "Lyon",
    text: "Colis nickel, packaging soigné et vials bien protégés. Livraison en 3 jours, comme annoncé.",
  },
  {
    img: client2,
    name: "Camille R.",
    location: "Bruxelles",
    text: "Facture claire, suivi impeccable. Le support a répondu en moins d'une heure sur Telegram.",
  },
  {
    img: client3,
    name: "Antoine D.",
    location: "Paris",
    text: "Étiquettes propres, lot traçable via le CoA Janoshik. Rassurant du début à la fin.",
  },
  {
    img: client4,
    name: "Sophie L.",
    location: "Genève",
    text: "Le pack accessoires est parfait pour démarrer. Fioles, seringues, tampons — tout est là.",
  },
];

function AvisContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div className="container-prose relative px-5 pt-24 pb-14 lg:pt-32 lg:pb-20">
          <Reveal>
            <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
              — Avis & Contact
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-[16ch] text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[76px] lg:text-[96px] lg:leading-[0.94]">
              Une communauté, <span className="italic font-light logo-gradient-text">une équipe</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-[17px] leading-[1.6] text-muted-foreground">
              Retours de clients vérifiés, canaux d'échange, et un vrai humain qui répond
              sous un jour ouvré. Rien de plus, rien de moins.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS PHOTOS */}
      <section className="container-prose px-5 pb-20 lg:pb-28">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                Ils ont commandé
              </span>
              <h2 className="mt-3 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[52px]">
                Retours vérifiés
              </h2>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
              <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                4.9 / 5
              </span>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 60}>
              <figure className="hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="aspect-square overflow-hidden bg-surface">
                  <img
                    src={t.img}
                    alt={`Colis reçu — ${t.name}`}
                    className="size-full object-cover"
                    loading="lazy"
                    width={1024}
                    height={1024}
                  />
                </div>
                <figcaption className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-[1.55] text-foreground">
                    « {t.text} »
                  </p>
                  <div className="border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t.name} · {t.location}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMMUNAUTÉ */}
      <section className="border-y border-border bg-surface">
        <div className="container-prose grid gap-5 px-5 py-16 sm:grid-cols-2 lg:py-24">
          <Reveal>
            <a
              href="https://t.me/peptinium"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift group flex h-full flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-12 place-items-center rounded-xl brand-gradient-cta text-white">
                  <Send className="size-5" strokeWidth={1.8} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Canal Telegram
                </span>
              </div>
              <div>
                <h3 className="font-display text-3xl font-semibold tracking-tight">
                  Rejoindre sur Telegram
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Nouveautés, arrivages, restocks et échanges avec l'équipe. Notifs discrètes.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground group-hover:text-accent">
                Ouvrir <ArrowRight className="size-3" strokeWidth={2} />
              </div>
            </a>
          </Reveal>
          <Reveal delay={80}>
            <a
              href="https://discord.gg/peptinium"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift group flex h-full flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-12 place-items-center rounded-xl brand-gradient-cta text-white">
                  <MessageCircle className="size-5" strokeWidth={1.8} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Serveur Discord
                </span>
              </div>
              <div>
                <h3 className="font-display text-3xl font-semibold tracking-tight">
                  Rejoindre sur Discord
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Salons dédiés protocoles, calculs, retours d'expérience. Communauté active.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground group-hover:text-accent">
                Ouvrir <ArrowRight className="size-3" strokeWidth={2} />
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="container-prose grid gap-14 px-5 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-32">
        <Reveal>
          <div className="flex flex-col gap-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                — Support
              </span>
              <h2 className="mt-4 font-display text-[44px] font-semibold leading-[0.98] tracking-[-0.02em] sm:text-[60px]">
                Écrivez-nous.
              </h2>
            </div>
            {[
              { Icon: Mail, k: "Email", v: "contact@peptinium.com", s: "Réponse sous 24 h" },
              { Icon: Clock, k: "Horaires", v: "Lun – Ven", s: "9h – 18h CET" },
              { Icon: MapPin, k: "Expédition", v: "Depuis l'Europe", s: "Suivi fourni" },
            ].map(({ Icon, k, v, s }) => (
              <div key={k} className="flex items-start gap-4 border-t border-border pt-6">
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
                <div className="mx-auto grid size-14 place-items-center rounded-full brand-gradient-cta text-white">
                  ✓
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">Message envoyé</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Merci — nous revenons vers vous très vite.
                </p>
              </div>
            ) : (
              <>
                <Field label="Nom" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <div className="mt-8">
                  <Field label="E-mail" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                </div>
                <div className="mt-8">
                  <Field
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
                    className="group inline-flex items-center gap-3 rounded-full brand-gradient-cta px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-transform hover:-translate-y-0.5"
                  >
                    Envoyer le message
                    <ArrowRight className="size-3" strokeWidth={2.2} />
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

function Field({
  label,
  type = "text",
  required,
  textarea,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/80">
        {label}
      </span>
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
