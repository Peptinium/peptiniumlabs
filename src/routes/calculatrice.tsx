import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";

export const Route = createFileRoute("/calculatrice")({
  head: () => ({
    meta: [
      { title: "Calculatrice de dilution — Aetherion Labs" },
      {
        name: "description",
        content:
          "Outil de calcul de reconstitution et de dilution pour réactifs peptidiques lyophilisés en laboratoire. Usage recherche uniquement (RUO).",
      },
      { property: "og:url", content: "/calculatrice" },
    ],
    links: [{ rel: "canonical", href: "/calculatrice" }],
  }),
  component: CalcPage,
});

function CalcPage() {
  const [mg, setMg] = useState(10);
  const [ml, setMl] = useState(2);
  const [aliquotUl, setAliquotUl] = useState(100);

  const concMgPerMl = useMemo(() => (ml > 0 ? mg / ml : 0), [mg, ml]);
  const concUgPerUl = concMgPerMl; // mg/mL = µg/µL
  const massPerAliquotUg = useMemo(() => concUgPerUl * aliquotUl, [concUgPerUl, aliquotUl]);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-14">
          <RuoBadge />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Calculatrice de dilution
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Outil de calcul pour la reconstitution et la fractionnement de peptides lyophilisés
            dans un cadre de protocole de recherche in vitro.{" "}
            <strong className="text-foreground">Aucune indication d'usage humain.</strong>
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-md border border-border bg-card p-6">
            <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
              Paramètres d'entrée
            </div>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">Reconstitution du flacon</h2>

            <Field
              label="Masse de peptide lyophilisé"
              suffix="mg"
              value={mg}
              onChange={setMg}
              step={0.5}
            />
            <Field
              label="Volume de solvant ajouté"
              suffix="mL"
              value={ml}
              onChange={setMl}
              step={0.1}
            />
            <Field
              label="Volume d'aliquote prélevé"
              suffix="µL"
              value={aliquotUl}
              onChange={setAliquotUl}
              step={10}
            />

            <p className="mt-6 rounded-sm bg-surface p-3 text-xs leading-relaxed text-muted-foreground">
              Solvant recommandé pour la majorité des peptides lyophilisés : eau bactériostatique
              stérile (BAC) de qualité laboratoire. Toujours valider la solubilité dans votre
              système expérimental.
            </p>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border p-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-medical">
                Résultats — protocole labo
              </div>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Concentrations calculées</h2>
            </div>
            <dl className="divide-y divide-border">
              <Row k="Concentration finale" v={`${fmt(concMgPerMl)} mg/mL`} />
              <Row k="Équivalent" v={`${fmt(concUgPerUl)} µg/µL`} />
              <Row k="Masse par aliquote" v={`${fmt(massPerAliquotUg)} µg`} />
              <Row
                k="Nb. d'aliquotes / flacon"
                v={`${aliquotUl > 0 ? Math.floor((ml * 1000) / aliquotUl) : 0}`}
              />
            </dl>
            <div className="border-t border-border p-6">
              <div className="rounded-sm border border-warning/40 bg-warning/5 p-3 text-xs leading-relaxed text-foreground/80">
                <strong className="text-warning">Avertissement RUO :</strong> ces calculs sont
                fournis comme outil d'aide à la préparation de solutions pour expérimentation
                in vitro. Ils ne constituent pas un protocole posologique humain.
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  suffix,
  value,
  onChange,
  step,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
}) {
  return (
    <label className="mt-5 block">
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-center rounded-sm border border-border bg-background focus-within:border-medical">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={0}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
        />
        <span className="px-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <dt className="text-sm text-muted-foreground">{k}</dt>
      <dd className="font-mono text-base font-semibold text-foreground">{v}</dd>
    </div>
  );
}

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 3 });
}
