import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";
import labBg from "@/assets/lab-bg-ruo.jpg";


export const Route = createFileRoute("/tester-fioles")({
  head: () => ({
    meta: [
      { title: "Tester ses fioles de recherche — Janoshik, Fínnrick, Trustpoint · Peptinium Labs" },
      {
        name: "description",
        content:
          "Guide complet pour faire analyser ses fioles de peptides de recherche par les laboratoires indépendants : Janoshik Analytical (UE), Fínnrick (US), Trustpoint Labs. Procédure d'envoi, coûts, vérification HPLC.",
      },
      { property: "og:title", content: "Tester ses fioles de recherche — Peptinium Labs" },
      { property: "og:url", content: "/tester-fioles" },
    ],
    links: [{ rel: "canonical", href: "/tester-fioles" }],
  }),
  component: TestVialsPage,
});

type Lab = {
  name: string;
  country: string;
  url: string;
  contactEmail?: string;
  shipTo: string;
  pricing: string;
  turnaround: string;
  methods: string[];
  notes: string;
  highlight?: boolean;
};

const labs: Lab[] = [
  {
    name: "Janoshik Analytical",
    country: "Prague, République tchèque (UE)",
    url: "https://www.janoshik.com/",
    contactEmail: "info@janoshik.com",
    shipTo:
      "Janoshik Analytical s.r.o. — adresse complète communiquée après commande sur janoshik.com.",
    pricing: "≈ 215–360 USD par test selon le peptide. Ex. BPC-157 ≈ 215 USD · GLP-1 (Retatrutide, Tirzépatide) ≈ 360 USD · option endotoxines ≈ 120–180 USD.",
    turnaround: "5–10 jours ouvrés après réception du colis",
    methods: ["HPLC-UV en phase inverse", "Spectrométrie de masse (MS)", "Quantification gravimétrique", "Endotoxines (option)"],
    notes:
      "Référence européenne, considérée comme gold standard par la communauté de recherche pour la complétude des analyses. Chaque rapport est associé à une clé unique de vérification consultable publiquement sur janoshik.com pour authentifier l'origine du CoA. Plus complet et plus cher que la moyenne, mais plébiscité pour la fiabilité des résultats.",
    highlight: true,
  },
  {
    name: "Fínnrick Laboratories",
    country: "Floride, États-Unis",
    url: "https://finnrick.com/",
    contactEmail: "support@finnrick.com",
    shipTo:
      "Fínnrick Labs — adresse postale fournie lors de la création d'un compte sur finnrick.com.",
    pricing: "≈ 129–238 USD par produit selon le panel. Ex. KLOW ≈ 199 USD · option endotoxines ≈ 110 USD. Souvent gratuit ou moins cher sur les peptides courants.",
    turnaround: "7–14 jours ouvrés après réception",
    methods: ["HPLC", "LC-MS", "Endotoxines (option)", "Tests de stérilité (option)"],
    notes:
      "Laboratoire américain reconnu pour son rapport qualité/prix : tarifs accessibles, analyses parfois offertes sur les peptides courants, suivi de commande en ligne et packs multi-fioles. Pensez aux frais et délais de douane si envoi depuis l'Europe.",
  },
  {
    name: "Trustpoint Analytical",
    country: "États-Unis",
    url: "https://trustpointlabs.com/",
    contactEmail: "info@trustpointlabs.com",
    shipTo:
      "Trustpoint Labs — adresse confirmée après création d'un dossier d'analyse sur trustpointlabs.com.",
    pricing: "≈ 60–110 USD par échantillon selon le panel demandé",
    turnaround: "10–15 jours ouvrés",
    methods: ["HPLC", "Spectrométrie de masse", "Quantification", "Bioburden / endotoxines (option)"],
    notes:
      "Trustpoint propose des analyses étendues (pureté, identification, quantification, contaminants microbiens). Particulièrement utile pour les laboratoires nécessitant un panel complet sur un même échantillon.",
  },
];


function TestVialsPage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute -top-px left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_5s_ease-in-out_infinite]" />
        <div className="container-prose relative py-20">
          <Reveal>
            <RuoBadge />
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
              <span className="shimmer-text" data-shimmer="Tester ses fioles de recherche">Tester ses fioles de recherche</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
              Une démarche de recherche rigoureuse impose la vérification analytique des réactifs
              utilisés. Cette page recense les principaux laboratoires indépendants qui acceptent
              de tester les fioles de peptides à des fins de recherche — identification, pureté
              HPLC et quantification — afin que chaque chercheur puisse vérifier l'authenticité
              et la composition de ses échantillons avant tout protocole expérimental.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-warning">
              ⚠ Démarche réservée aux chercheurs et professionnels — Cadre RUO strict
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROCEDURE */}
      <section className="container-prose py-20">
        <Reveal>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            — Procédure générale
          </div>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Comment envoyer une fiole à analyser
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              k: "01",
              t: "Choisir le laboratoire",
              d: "Sélectionnez un laboratoire indépendant en fonction de votre localisation, du panel analytique souhaité (identification, pureté, quantification) et du budget. Janoshik est privilégié en Europe ; Fínnrick et Trustpoint aux États-Unis.",
            },
            {
              k: "02",
              t: "Créer une commande d'analyse",
              d: "Sur le site du laboratoire, créez un compte de recherche, sélectionnez le test (HPLC + MS, par exemple), payez en ligne et recevez l'adresse de réception ainsi qu'un numéro de tâche à inscrire sur le colis.",
            },
            {
              k: "03",
              t: "Préparer et expédier",
              d: "Conditionnez la fiole lyophilisée dans un emballage rigide, joignez le formulaire d'accompagnement émis par le laboratoire et expédiez en courrier suivi. La fiole non reconstituée traverse parfaitement les délais postaux internationaux.",
            },
            {
              k: "04",
              t: "Recevoir le rapport (CoA)",
              d: "Sous 5 à 15 jours ouvrés, le laboratoire émet un Certificat d'Analyse signé, contenant pureté HPLC, masse moléculaire mesurée et clé de vérification publique. Le rapport peut être contre-vérifié sur le portail du laboratoire.",
            },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 60}>
              <div className="hover-lift relative flex h-full flex-col rounded-xl border border-border bg-card p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">— {s.k}</div>
                <h3 className="mt-3 font-display text-base font-medium tracking-tight">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LABS */}
      <section className="border-y border-border bg-surface">
        <div className="container-prose py-20">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Laboratoires recommandés
            </div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Laboratoires indépendants d'analyse de peptides
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Chacun de ces laboratoires est indépendant d'Peptinium Labs. Les informations
              ci-dessous sont fournies à titre indicatif — tarifs et délais peuvent évoluer ;
              référez-vous aux sites officiels pour les conditions à jour.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {labs.map((lab, i) => (
              <Reveal key={lab.name} delay={i * 70}>
                <div
                  className={`hover-lift relative flex h-full flex-col gap-5 rounded-2xl border bg-card p-7 ${
                    lab.highlight ? "border-accent/40 ring-1 ring-accent/20" : "border-border"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                        {lab.country}
                      </div>
                      <h3 className="mt-1.5 font-display text-2xl font-medium tracking-tight">
                        {lab.name}
                      </h3>
                    </div>
                    {lab.highlight && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                        <span className="size-1 rounded-full bg-accent" /> Recommandé UE
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-foreground/85">{lab.notes}</p>

                  <dl className="grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        Tarif indicatif
                      </dt>
                      <dd className="mt-1 text-foreground">{lab.pricing}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        Délai
                      </dt>
                      <dd className="mt-1 text-foreground">{lab.turnaround}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        Méthodes analytiques
                      </dt>
                      <dd className="mt-1 flex flex-wrap gap-1.5">
                        {lab.methods.map((m) => (
                          <span
                            key={m}
                            className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                          >
                            {m}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        Expédition
                      </dt>
                      <dd className="mt-1 text-foreground">{lab.shipTo}</dd>
                    </div>
                    {lab.contactEmail && lab.contactEmail !== "—" && (
                      <div className="sm:col-span-2">
                        <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                          Contact
                        </dt>
                        <dd className="mt-1 font-mono text-foreground">{lab.contactEmail}</dd>
                      </div>
                    )}
                  </dl>

                  <a
                    href={lab.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between gap-2 rounded-full border border-border bg-background px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-all hover:border-accent hover:bg-accent/5"
                  >
                    Visiter {lab.name}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RUO REMINDER */}
      <section
        className="relative overflow-hidden border-t border-border"
        style={{
          backgroundImage: `linear-gradient(135deg, oklch(0.97 0.01 245 / 0.92), oklch(0.95 0.015 250 / 0.96)), url(${labBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pointer-events-none absolute -top-px left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_6s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] grid-bg" />
        <div className="container-prose relative py-24">
          <Reveal>
            <RuoBadge variant="ghost" />
            <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Tester pour la <span className="shimmer-text" data-shimmer="recherche">recherche</span> — pas pour la consommation
            </h2>
            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
              La vérification analytique d'une fiole s'inscrit dans une démarche scientifique
              rigoureuse de contrôle qualité des réactifs de recherche. Elle ne valide en aucun
              cas une utilisation vétérinaire, diagnostique ou thérapeutique. Les
              peptides commercialisés par Peptinium Labs sont strictement destinés à la recherche
              scientifique in vitro et à un usage exclusivement professionnel et de laboratoire.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["HPLC ≥ 99 %", "MS · CoA par lot", "ISO 9001", "RUO strict"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

    </SiteLayout>
  );
}
