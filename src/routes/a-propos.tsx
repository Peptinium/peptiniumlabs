import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { FlaskConical, ShieldCheck, Beaker, FileCheck2 } from "lucide-react";


import labQuality from "@/assets/about/lab-quality.jpg";
import labLogistics from "@/assets/about/lab-logistics.jpg";
import labPromise from "@/assets/about/lab-promise.jpg";

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
      { title: "Laboratoire — Preuves de pureté Janoshik · Peptinium Labs" },
      {
        name: "description",
        content:
          "Peptinium Labs : preuves de pureté Janoshik (HPLC ≥ 99 %) pour chaque peptide de recherche. Vérification indépendante disponible sur janoshik.com.",
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
  { name: "Retatrutide", dosage: "10 mg", taskNumber: "#109022", purity: "99.169 % / 99.161 %", verifyKey: "132C6ASFNB4V", date: "19 FEB 2026", src: coaRetatrutide.url },
  { name: "GHK-Cu", dosage: "50 mg", taskNumber: "#65331", purity: "99.886 %", verifyKey: "KYB39ZQFJ7DV", date: "18 MAY 2025", src: coaGhkCu.url },
  { name: "CJC-1295 + Ipamorelin", dosage: "5 mg + 5 mg", taskNumber: "#66682", purity: "Identité confirmée (5.22 + 5.74 mg)", verifyKey: "MR9RWZYIM5PV", date: "05 JUN 2025", src: coaCjcIpa.url },
  { name: "Semax", dosage: "10 mg", taskNumber: "#64097", purity: "99.059 %", verifyKey: "JQLUTEGCJBSK", date: "06 MAY 2025", src: coaSemax.url },
  { name: "BPC-157", dosage: "10 mg", taskNumber: "#65332", purity: "99.527 % / 99.573 %", verifyKey: "189HGA1Y94Y7", date: "19 MAY 2025", src: coaBpc157.url },
  { name: "Melanotan I", dosage: "10 mg", taskNumber: "#75760", purity: "99.762 % / 99.571 %", verifyKey: "TDM8D15H11BE", date: "22 AUG 2025", src: coaMt1.url },
  { name: "Melanotan II", dosage: "10 mg", taskNumber: "#75881", purity: "99.948 % / 99.969 %", verifyKey: "TVB3I71FDGV6", date: "22 AUG 2025", src: coaMt2.url },
  { name: "KLOW", dosage: "80 mg", taskNumber: "#66683", purity: "Multi-peptide blend confirmé", verifyKey: "1J45T6SPTB6Q", date: "05 JUN 2025", src: coaKlow.url, notes: "TB-500 · BPC-157 · GHK-Cu · KPV" },
  { name: "NAD+", dosage: "1000 mg", taskNumber: "#75743", purity: "Quantification 973.33 / 992.04 mg", verifyKey: "36MY3SF38LNW", date: "20 AUG 2025", src: coaNad.url },
  { name: "Tesamorelin", dosage: "10 mg", taskNumber: "#77839", purity: "99.209 % / 99.305 %", verifyKey: "HR5QHQXCUSEX", date: "09 SEP 2025", src: coaTesa.url },
];

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 26%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 26%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 16%, transparent) 0%, transparent 78%)";

function AboutPage() {
  return (
    <SiteLayout>
      <div className="bg-background text-foreground">
        {/* ============ HERO magazine ============ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: SWEEPS }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }} />

          <div className="relative mx-auto max-w-[1400px] px-6 pt-28 pb-24 lg:px-10 sm:pt-36 sm:pb-32">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-muted" />
                Peptinium Labs · Édition n°01
                <span className="hidden sm:inline">— Sunday, July 5, 2026</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="shimmer-text mt-10 max-w-5xl text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[104px] sm:leading-[0.94]" data-shimmer="La science, sans compromis.">
                La science, sans compromis.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
                <p className="text-[18px] leading-[1.55] text-muted-foreground sm:text-[22px]">
                  Peptinium Labs fournit des peptides synthétiques de qualité recherche à des
                  équipes académiques, des CRO et des instituts publics. Notre engagement tient
                  en une phrase : <span className="text-foreground">chaque flacon est traçable, vérifié, auditable</span>.
                </p>
                <div className="grid grid-cols-3 gap-6 self-end border-t border-border pt-6">
                  {[
                    { k: "≥ 99 %", l: "Pureté HPLC" },
                    { k: "100 %", l: "Lots tracés" },
                    { k: "24 h", l: "Expédition" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="font-display text-[28px] font-semibold text-foreground sm:text-[36px]">{s.k}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>


        {/* ============ Qualité & normes — image + texte ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 sm:py-32">
            <Reveal>
              <div className="flex flex-col">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Qualité &amp; normes</span>
                <h2 className="shimmer-text mt-4 text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px]" data-shimmer="Chaque lot testé, vérifié, documenté.">
                  Chaque lot testé, vérifié, documenté.
                </h2>
                <div className="mt-8 space-y-5 text-[15.5px] leading-[1.7] text-muted-foreground">
                  <p>
                    Nos partenaires de fabrication opèrent en environnement contrôlé et suivent des
                    protocoles de synthèse stricts. Chaque composé est soumis à un contrôle interne,
                    puis à une <span className="text-foreground">contre-analyse indépendante</span> par un
                    laboratoire tiers accrédité.
                  </p>
                  <p>
                    Pour maintenir une qualité constante dans le temps, nous ré-échantillonnons nos
                    références selon un cycle semestriel. Les certificats disponibles sur cette page
                    datent tous de <span className="text-foreground">moins de six mois</span>.
                  </p>
                </div>
                <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
                  {[
                    { k: "Intégrité", v: "Partenaires audités, sourcing tracé." },
                    { k: "Pureté", v: "Tests par lot, identité et stabilité." },
                    { k: "Transparence", v: "CoA récents, vérifiables en ligne." },
                  ].map((s) => (
                    <div key={s.k}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">{s.k}</dt>
                      <dd className="mt-2 text-[13px] leading-[1.55] text-muted-foreground">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-[28px] border border-border">
                <img
                  src={labQuality}
                  alt="Analyse HPLC — chargement d'un flacon de peptide sur un passeur d'échantillons"
                  width={1600}
                  height={1200}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 4 piliers ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 sm:py-32">
            <Reveal>
              <div className="flex flex-col gap-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Notre méthode</span>
                <h2 className="shimmer-text max-w-3xl text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[56px] sm:leading-[1.02]" data-shimmer="Quatre piliers, zéro raccourci.">
                  Quatre piliers, zéro raccourci.
                </h2>
              </div>

            </Reveal>

            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-muted md:grid-cols-2">
              {[
                { Icon: FlaskConical, n: "01", t: "Synthèse SPPS Fmoc auditée", d: "Partenaires GMP-friendly sélectionnés sur audit qualité annuel. Synthèse en phase solide, purification par HPLC préparative." },
                { Icon: ShieldCheck, n: "02", t: "CoA Janoshik indépendant", d: "Chaque lot analysé par HPLC en phase inverse et spectrométrie de masse. Certificat consultable en ligne, clé de vérification publique." },
                { Icon: Beaker, n: "03", t: "Conditionnement laboratoire", d: "Flacons verre borosilicate type I, sertissage aluminium, lyophilisation sous atmosphère contrôlée, étiquetage normalisé lot + péremption." },
                { Icon: FileCheck2, n: "04", t: "Engagement RUO strict", d: "Vente réservée aux chercheurs, laboratoires, CRO et institutions. Aucun usage vétérinaire, diagnostique ou thérapeutique promu." },
              ].map((p) => (
                <Reveal key={p.n}>
                  <div className="group relative flex flex-col gap-6 p-10 sm:p-12" style={{ background: "var(--card)" }}>
                    <div className="flex items-center justify-between">
                      <p.Icon className="size-6 text-muted-foreground" strokeWidth={1.4} />
                      <span className="block font-mono text-[11px] uppercase tracking-[0.28em] text-accent">{p.n}</span>
                    </div>
                    <h3 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.015em] text-foreground sm:text-[28px]">{p.t}</h3>
                    <p className="max-w-lg text-[14.5px] leading-[1.65] text-muted-foreground">{p.d}</p>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "radial-gradient(60% 60% at 80% 20%, color-mix(in oklab, var(--brand-violet) 20%, transparent), transparent 70%)" }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Confiance & conformité ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:px-10 sm:py-32">
            <Reveal>
              <div className="overflow-hidden rounded-[28px] border border-border">
                <img
                  src={labLogistics}
                  alt="Préparation d'un envoi Peptinium — flacons, notice et emballage isotherme"
                  width={1600}
                  height={1024}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col justify-center">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Confiance &amp; conformité</span>
                <h2 className="shimmer-text mt-4 text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[52px]" data-shimmer="Un partenaire fiable pour la recherche.">
                  Un partenaire fiable pour la recherche.
                </h2>
                <div className="mt-8 space-y-5 text-[15.5px] leading-[1.7] text-muted-foreground">
                  <p>
                    Peptinium Labs opère dans un cadre strict de conformité européenne. Nos produits
                    sont fournis <span className="text-foreground">exclusivement à des fins de recherche
                    en laboratoire</span> : équipes académiques, CRO, instituts publics et industriels.
                  </p>
                  <p>
                    Paiements sécurisés par carte via des prestataires PCI-DSS, facturation
                    professionnelle, adresses de livraison institutionnelles vérifiées. Aucun usage
                    diagnostique, thérapeutique ou vétérinaire n'est promu ni toléré.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ Expérience & opérations ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 sm:py-32">
            <Reveal>
              <div className="flex flex-col justify-center">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Expérience &amp; opérations</span>
                <h2 className="shimmer-text mt-4 text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[52px]" data-shimmer="Commande simple, expédition maîtrisée.">
                  Commande simple, expédition maîtrisée.
                </h2>
                <div className="mt-8 space-y-5 text-[15.5px] leading-[1.7] text-muted-foreground">
                  <p>
                    Du sourcing à l'envoi, chaque étape est standardisée pour la précision et la
                    sécurité. Commandes passées avant 14 h expédiées <span className="text-foreground">le jour même</span>,
                    suivi complet jusqu'à la livraison en Europe.
                  </p>
                  <p>
                    Emballage discret, protection thermique adaptée aux composés sensibles,
                    documentation lot par lot glissée dans chaque colis. Un interlocuteur unique
                    reste joignable si vous avez besoin d'un protocole ou d'un CoA archivé.
                  </p>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
                  {[
                    { k: "24 h", v: "Expédition ouvrée" },
                    { k: "EU + UK", v: "Zones desservies" },
                    { k: "Suivi", v: "Bout-en-bout" },
                  ].map((s) => (
                    <div key={s.k}>
                      <div className="font-display text-[24px] font-semibold text-foreground sm:text-[30px]">{s.k}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-[28px] border border-border bg-muted">
                <img
                  src={labPromise}
                  alt="Flacon de peptide lyophilisé — packaging premium Peptinium"
                  width={1200}
                  height={1504}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ Janoshik — grand feature ============ */}
        <section className="relative overflow-hidden border-t border-border">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: "radial-gradient(45% 40% at 15% 20%, color-mix(in oklab, var(--brand-cyan) 22%, transparent) 0%, transparent 70%), radial-gradient(50% 45% at 90% 90%, color-mix(in oklab, var(--brand-magenta) 22%, transparent) 0%, transparent 70%)" }} />

          <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 sm:py-32">
            <Reveal>
              <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Preuves</span>
                  <h2 className="shimmer-text mt-4 text-[40px] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[64px]" data-shimmer="Vérifié par Janoshik Analytical.">
                    Vérifié par Janoshik Analytical.
                  </h2>
                </div>
                <div className="space-y-4 text-[15.5px] leading-[1.7] text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Janoshik Analytical</strong> est un laboratoire européen indépendant basé à Prague,
                    spécialisé dans l'analyse quantitative et qualitative de peptides par HPLC et
                    spectrométrie de masse.
                  </p>
                  <p>
                    Chacune des fioles ci-dessous a été testée par Janoshik. Vous pouvez consulter
                    les rapports en taille réelle et <strong className="text-foreground">vérifier vous-même l'authenticité</strong> de chaque
                    rapport directement sur{" "}
                    <a href="https://www.janoshik.com/" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">janoshik.com</a>{" "}
                    en saisissant la clé unique fournie sur le CoA.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* COA grid */}
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coas.map((c, i) => (
                <Reveal key={c.taskNumber} delay={i * 40}>
                  <a
                    href={c.src}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card backdrop-blur-sm transition-all hover:border-white/30 hover:bg-card"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-white">
                      <img src={c.src} alt={`Rapport Janoshik — ${c.name} ${c.dosage}`} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-background backdrop-blur">
                        <span className="size-1 rounded-full" style={{ background: "var(--brand-cyan)" }} /> Vérifié
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-[16px] font-semibold tracking-tight text-foreground">{c.name}</h3>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.dosage}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Tâche</div>
                          <div className="mt-0.5 font-mono text-muted-foreground">{c.taskNumber}</div>
                        </div>
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Analyse</div>
                          <div className="mt-0.5 font-mono text-muted-foreground">{c.date}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Pureté</div>
                          <div className="mt-0.5 text-muted-foreground">{c.purity}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Clé</div>
                          <div className="mt-0.5 font-mono text-[11px] tracking-[0.12em] text-foreground">{c.verifyKey}</div>
                        </div>
                      </div>
                      {c.notes ? <div className="text-[11px] italic text-muted-foreground">{c.notes}</div> : null}
                      <div className="mt-2 inline-flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <span>Voir le rapport</span>
                        <span className="text-foreground transition-transform group-hover:translate-x-0.5">Agrandir →</span>
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            {/* How to verify */}
            <div className="mt-16 rounded-2xl border border-border bg-card p-8 backdrop-blur-sm sm:p-12">
              <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">— Guide</span>
                  <h3 className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[32px]">
                    Comment vérifier un rapport ?
                  </h3>
                </div>
                <ol className="space-y-6">
                  {[
                    ["01", <>Rendez-vous sur{" "}<a href="https://www.janoshik.com/" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">janoshik.com</a>.</>],
                    ["02", <>Saisissez la clé unique figurant sur le CoA (ex. <span className="font-mono text-foreground">132C6ASFNB4V</span>).</>],
                    ["03", "Le portail affiche le rapport original signé : identité, pureté HPLC et quantification."],
                  ].map(([n, body]) => (
                    <li key={n as string} className="flex gap-6 border-t border-border pt-6 first:border-t-0 first:pt-0">
                      <span className="font-display text-[36px] font-extralight leading-none text-muted-foreground">{n as string}</span>
                      <p className="pt-1 text-[15px] leading-[1.6] text-muted-foreground">{body as React.ReactNode}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
