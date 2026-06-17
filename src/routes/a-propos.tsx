import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";
import { Reveal } from "@/components/Reveal";

import coaRetatrutide from "@/assets/coa/coa-retatrutide-10mg.jpg.asset.json";
import coaGhkCu from "@/assets/coa/coa-ghk-cu.jpg.asset.json";
import coaCjcIpa from "@/assets/coa/coa-cjc-1295-ipamorelin.jpg.asset.json";
import coaSemax from "@/assets/coa/coa-semax.jpg.asset.json";
import coaBpc157 from "@/assets/coa/coa-bpc-157.jpg.asset.json";
import coaMt1 from "@/assets/coa/coa-mt-1.jpg.asset.json";
import coaMt2 from "@/assets/coa/coa-mt-2.jpg.asset.json";
import coaKlow from "@/assets/coa/coa-klow.jpg.asset.json";
import coaNad from "@/assets/coa/coa-nad-plus.jpg.asset.json";
import coaTesa from "@/assets/coa/coa-tesamoreline.jpg.asset.json";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "Laboratoire — Preuves de pureté Janoshik · Aetherion Labs" },
      {
        name: "description",
        content:
          "Aetherion Labs : preuves de pureté Janoshik (HPLC ≥ 99 %) pour chaque peptide de recherche. Vérification indépendante disponible sur janoshik.com.",
      },
      { property: "og:url", content: "/a-propos" },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: AboutPage,
});

type CoaItem = {
  name: string;
  dosage: string;
  taskNumber: string;
  purity: string;
  verifyKey: string;
  date: string;
  src: string;
  notes?: string;
};

const coas: CoaItem[] = [
  {
    name: "Retatrutide",
    dosage: "10 mg",
    taskNumber: "#109022",
    purity: "99.169 % / 99.161 %",
    verifyKey: "132C6ASFNB4V",
    date: "19 FEB 2026",
    src: coaRetatrutide.url,
  },
  {
    name: "GHK-Cu",
    dosage: "50 mg",
    taskNumber: "#65331",
    purity: "99.886 %",
    verifyKey: "KYB39ZQFJ7DV",
    date: "18 MAY 2025",
    src: coaGhkCu.url,
  },
  {
    name: "CJC-1295 + Ipamorelin",
    dosage: "5 mg + 5 mg",
    taskNumber: "#66682",
    purity: "Identité confirmée (5.22 + 5.74 mg)",
    verifyKey: "MR9RWZYIM5PV",
    date: "05 JUN 2025",
    src: coaCjcIpa.url,
  },
  {
    name: "Semax",
    dosage: "10 mg",
    taskNumber: "#64097",
    purity: "99.059 %",
    verifyKey: "JQLUTEGCJBSK",
    date: "06 MAY 2025",
    src: coaSemax.url,
  },
  {
    name: "BPC-157",
    dosage: "10 mg",
    taskNumber: "#65332",
    purity: "99.527 % / 99.573 %",
    verifyKey: "189HGA1Y94Y7",
    date: "19 MAY 2025",
    src: coaBpc157.url,
  },
  {
    name: "Melanotan I",
    dosage: "10 mg",
    taskNumber: "#75760",
    purity: "99.762 % / 99.571 %",
    verifyKey: "TDM8D15H11BE",
    date: "22 AUG 2025",
    src: coaMt1.url,
  },
  {
    name: "Melanotan II",
    dosage: "10 mg",
    taskNumber: "#75881",
    purity: "99.948 % / 99.969 %",
    verifyKey: "TVB3I71FDGV6",
    date: "22 AUG 2025",
    src: coaMt2.url,
  },
  {
    name: "KLOW",
    dosage: "80 mg",
    taskNumber: "#66683",
    purity: "Multi-peptide blend confirmé",
    verifyKey: "1J45T6SPTB6Q",
    date: "05 JUN 2025",
    src: coaKlow.url,
    notes: "TB-500 · BPC-157 · GHK-Cu · KPV",
  },
  {
    name: "NAD+",
    dosage: "1000 mg",
    taskNumber: "#75743",
    purity: "Quantification 973.33 / 992.04 mg",
    verifyKey: "36MY3SF38LNW",
    date: "20 AUG 2025",
    src: coaNad.url,
  },
  {
    name: "Tésamoréline",
    dosage: "5 mg",
    taskNumber: "#77839",
    purity: "99.209 % / 99.305 %",
    verifyKey: "HR5QHQXCUSEX",
    date: "09 SEP 2025",
    src: coaTesa.url,
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="container-prose relative py-20">
          <Reveal>
            <RuoBadge />
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Laboratoire Aetherion — <span className="shimmer-text">transparence analytique</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Aetherion Labs est un fournisseur spécialisé dans la mise à disposition de peptides
              synthétiques destinés à la recherche scientifique en laboratoire. Nos réactifs sont
              utilisés par des équipes académiques, des CRO et des instituts publics pour la
              caractérisation pharmacologique in vitro.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="container-prose py-20">
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
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 60}>
              <div className="border-l border-accent/40 pl-5">
                <h2 className="text-lg font-semibold tracking-tight">{b.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ JANOSHIK COA SECTION ============ */}
      <section className="relative border-y border-border bg-surface">
        <div className="container-prose py-20">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                <span className="size-1.5 rounded-full bg-accent" /> Preuves de pureté
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Janoshik Analytical · Prague, Tchéquie
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Vérification indépendante par Janoshik Analytical
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-5 max-w-4xl space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Janoshik Analytical</strong> est un laboratoire
                européen indépendant situé à Prague (République tchèque), spécialisé dans
                l'analyse quantitative et qualitative de peptides par HPLC et spectrométrie de
                masse. C'est l'une des références internationales pour la vérification de pureté
                des réactifs de recherche.
              </p>
              <p>
                Chacune des fioles ci-dessous a été testée par Janoshik. Vous pouvez consulter
                les rapports en taille réelle, et — fait important — <strong className="text-foreground">vérifier vous-mêmes l'authenticité de chaque
                rapport</strong> directement sur{" "}
                <a
                  href="https://www.janoshik.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-accent underline-offset-4 hover:underline"
                >
                  janoshik.com
                </a>{" "}
                en saisissant la clé unique fournie sur chaque CoA.
              </p>
              <p>
                Cette transparence permet aux chercheurs, laboratoires et professionnels
                acquérant nos réactifs RUO de garantir l'identité et la pureté du lot reçu, et de
                conduire leurs travaux expérimentaux sur une base analytique vérifiable de manière
                indépendante.
              </p>
            </div>
          </Reveal>

          {/* COA grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coas.map((c, i) => (
              <Reveal key={c.taskNumber} delay={i * 40}>
                <a
                  href={c.src}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-[0_12px_40px_-16px_oklch(0.7_0.12_200/40%)]"
                >
                  <div className="relative overflow-hidden border-b border-border bg-white">
                    <img
                      src={c.src}
                      alt={`Rapport Janoshik — ${c.name} ${c.dosage}`}
                      loading="lazy"
                      className="aspect-[3/4] w-full bg-white object-contain object-top p-2 transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-white/95 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-accent shadow-sm backdrop-blur">
                      <span className="size-1 rounded-full bg-accent" /> Vérifié Janoshik
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-accent">
                        {c.name}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {c.dosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      <div>
                        <div className="text-[9px] text-accent">Tâche</div>
                        <div className="mt-0.5 text-foreground">{c.taskNumber}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-accent">Analyse</div>
                        <div className="mt-0.5 text-foreground">{c.date}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[9px] text-accent">Pureté / Quantification</div>
                        <div className="mt-0.5 normal-case tracking-normal text-foreground">
                          {c.purity}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[9px] text-accent">Clé de vérification</div>
                        <div className="mt-0.5 font-mono text-[11px] tracking-[0.12em] text-foreground">
                          {c.verifyKey}
                        </div>
                      </div>
                    </div>
                    {c.notes ? (
                      <div className="mt-1 text-[11px] italic text-muted-foreground">{c.notes}</div>
                    ) : null}
                    <div className="mt-3 inline-flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span>Voir le rapport</span>
                      <span className="text-accent transition-transform group-hover:translate-x-0.5">
                        Agrandir →
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Vérifier un lot
            </div>
            <h3 className="mt-2 font-display text-xl font-medium tracking-tight">
              Comment vérifier un rapport Janoshik ?
            </h3>
            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-mono text-[11px] text-accent">01 ·</span> Rendez-vous sur{" "}
                <a
                  href="https://www.janoshik.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-accent hover:underline"
                >
                  janoshik.com
                </a>
                .
              </li>
              <li>
                <span className="font-mono text-[11px] text-accent">02 ·</span> Saisissez la clé
                unique de vérification figurant sur le CoA (par ex. <span className="font-mono text-foreground">132C6ASFNB4V</span>).
              </li>
              <li>
                <span className="font-mono text-[11px] text-accent">03 ·</span> Le portail Janoshik
                affiche le rapport original signé : identité, pureté HPLC et quantification.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
