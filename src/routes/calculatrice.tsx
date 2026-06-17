import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";

export const Route = createFileRoute("/calculatrice")({
  head: () => ({
    meta: [
      { title: "Calculatrice de dilution — peptidesfr.com" },
      {
        name: "description",
        content:
          "Outil de calcul de reconstitution de peptides lyophilisés en laboratoire. Usage recherche uniquement.",
      },
      { property: "og:url", content: "/calculatrice" },
    ],
    links: [{ rel: "canonical", href: "/calculatrice" }],
  }),
  component: CalcPage,
});

type DoseUnit = "mg" | "mcg";

function CalcPage() {
  const [peptideMg, setPeptideMg] = useState<number>(10);
  const [waterMl, setWaterMl] = useState<number>(2);
  const [doseValue, setDoseValue] = useState<number>(500);
  const [doseUnit, setDoseUnit] = useState<DoseUnit>("mcg");
  const [result, setResult] = useState<null | {
    concMgPerMl: number;
    doseMg: number;
    volumeMl: number;
    volumeUl: number;
    unitsOn100: number;
  }>(null);

  const compute = () => {
    const conc = waterMl > 0 ? peptideMg / waterMl : 0; // mg/mL
    const doseMg = doseUnit === "mg" ? doseValue : doseValue / 1000;
    const volumeMl = conc > 0 ? doseMg / conc : 0;
    const volumeUl = volumeMl * 1000;
    const unitsOn100 = volumeUl; // 1 unit (insuline U-100) = 10 µL ; convertion ci-dessous
    setResult({
      concMgPerMl: conc,
      doseMg,
      volumeMl,
      volumeUl,
      unitsOn100: volumeUl / 10, // unités sur seringue insuline U-100
    });
  };

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-14">
          <RuoBadge />
          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Calculatrice de dilution
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Outil de calcul pour la reconstitution d'un flacon de peptide lyophilisé et
            la préparation d'aliquotes en cadre de recherche in vitro.{" "}
            <strong className="text-foreground">Aucune indication d'usage humain.</strong>
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Inputs */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Reconstitution du flacon
            </div>
            <h2 className="mt-2 font-display text-lg font-medium tracking-tight">
              Paramètres
            </h2>

            <div className="mt-6 space-y-5">
              <Field
                label="Poids du peptide"
                suffix="mg"
                value={peptideMg}
                onChange={setPeptideMg}
                step={0.5}
              />
              <Field
                label="Quantité d'eau bactériostatique"
                suffix="mL"
                value={waterMl}
                onChange={setWaterMl}
                step={0.1}
              />

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Dosage souhaité
                </div>
                <div className="mt-2 flex items-stretch overflow-hidden rounded-lg border border-border bg-background focus-within:border-foreground">
                  <input
                    type="number"
                    inputMode="decimal"
                    step={doseUnit === "mg" ? 0.1 : 10}
                    min={0}
                    value={doseValue}
                    onChange={(e) => setDoseValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                  />
                  <div className="flex shrink-0 border-l border-border">
                    {(["mcg", "mg"] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setDoseUnit(u)}
                        type="button"
                        className={`px-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                          doseUnit === u
                            ? "bg-foreground text-background"
                            : "bg-card text-muted-foreground hover:bg-surface"
                        }`}
                      >
                        {u === "mcg" ? "µg" : u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={compute}
              className="group relative mt-7 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <span className="relative z-10">Calculer</span>
              <span className="absolute inset-y-0 left-0 w-12 -translate-x-full bg-accent/40 blur-md transition-transform duration-700 group-hover:translate-x-[460%]" />
            </button>
          </div>

          {/* Results */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-6 sm:p-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                — Résultat du calcul
              </div>
              <h2 className="mt-2 font-display text-lg font-medium tracking-tight">
                Volume à prélever
              </h2>
            </div>

            {result ? (
              <>
                {/* HERO RESULT — Unités seringue insuline */}
                <div className="border-b border-border bg-accent/5 px-6 py-7 sm:px-7">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Prélever
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-medium tracking-tight text-accent">
                      {fmt(result.unitsOn100, 1)}
                    </span>
                    <span className="font-mono text-sm uppercase tracking-[0.18em] text-foreground/70">
                      unités
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    sur une seringue à insuline graduée U-100 (1 mL = 100 unités)
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted-foreground">
                    <span>= <span className="text-foreground">{fmt(result.volumeMl, 3)} mL</span></span>
                    <span>= <span className="text-foreground">{fmt(result.volumeUl, 1)} µL</span></span>
                  </div>
                </div>
                <dl className="divide-y divide-border">
                  <Row k="Concentration finale" v={`${fmt(result.concMgPerMl)} mg / mL`} />
                  <Row
                    k="Dose par injection"
                    v={`${fmt(result.doseMg, 4)} mg · ${fmt(result.doseMg * 1000, 1)} µg`}
                  />
                  <Row
                    k="Doses par flacon"
                    v={`≈ ${fmt(result.volumeMl > 0 ? waterMl / result.volumeMl : 0, 1)} prises`}
                  />
                </dl>
                <div className="border-t border-border p-6 sm:p-7">
                  <div className="rounded-lg border border-warning/40 bg-warning/5 p-4 text-xs leading-relaxed text-foreground/80">
                    <strong className="text-warning">Avertissement :</strong> calcul fourni
                    pour la préparation d'aliquotes en cadre de recherche in vitro. Ne
                    constitue pas un protocole posologique humain.
                  </div>
                </div>
              </>

            ) : (
              <div className="p-7 text-sm text-muted-foreground">
                Renseignez les paramètres et cliquez sur{" "}
                <strong className="text-foreground">Calculer</strong> pour obtenir le
                volume à prélever.
              </div>
            )}
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
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-center rounded-lg border border-border bg-background focus-within:border-foreground">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={0}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
        />
        <span className="px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function Row({ k, v, highlight = false }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 py-4 ${highlight ? "bg-accent/5" : ""}`}>
      <dt className="text-sm text-muted-foreground">{k}</dt>
      <dd className={`font-mono text-base font-medium ${highlight ? "text-accent" : "text-foreground"}`}>
        {v}
      </dd>
    </div>
  );
}

function fmt(n: number, digits = 3) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("fr-FR", { maximumFractionDigits: digits });
}
