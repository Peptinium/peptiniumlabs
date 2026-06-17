import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { RuoBadge } from "@/components/RuoBadge";

export const Route = createFileRoute("/calculatrice")({
  head: () => ({
    meta: [
      { title: "Calculatrice de reconstitution de peptide — Aetherion Labs" },
      {
        name: "description",
        content:
          "Calculatrice de dilution pour peptides lyophilisés. Saisie en mg ou µg. Usage recherche uniquement.",
      },
      { property: "og:url", content: "/calculatrice" },
    ],
    links: [{ rel: "canonical", href: "/calculatrice" }],
  }),
  component: CalcPage,
});

type Unit = "mg" | "mcg";

function CalcPage() {
  const [peptideValue, setPeptideValue] = useState<string>("");
  const [peptideUnit, setPeptideUnit] = useState<Unit>("mg");
  const [waterMl, setWaterMl] = useState<string>("");
  const [doseValue, setDoseValue] = useState<string>("");
  const [doseUnit, setDoseUnit] = useState<Unit>("mcg");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const peptideMg =
      (parseFloat(peptideValue) || 0) * (peptideUnit === "mg" ? 1 : 0.001);
    const water = parseFloat(waterMl) || 0;
    const doseMg =
      (parseFloat(doseValue) || 0) * (doseUnit === "mg" ? 1 : 0.001);
    const conc = water > 0 ? peptideMg / water : 0; // mg/mL
    const volumeMl = conc > 0 ? doseMg / conc : 0;
    const volumeUl = volumeMl * 1000;
    const units = volumeMl * 100; // seringue insuline U-100
    const dosesPerVial = doseMg > 0 ? peptideMg / doseMg : 0;
    return { peptideMg, doseMg, conc, volumeMl, volumeUl, units, dosesPerVial };
  }, [peptideValue, peptideUnit, waterMl, doseValue, doseUnit]);

  const valid =
    result.peptideMg > 0 && parseFloat(waterMl) > 0 && result.doseMg > 0;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-prose py-14">
          <RuoBadge />
          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Calculatrice de reconstitution
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Calcul du volume à prélever après reconstitution d'un flacon de peptide
            lyophilisé avec de l'eau bactériostatique. Saisie en milligrammes (mg)
            ou microgrammes (µg).{" "}
            <strong className="text-foreground">
              Usage recherche in vitro uniquement.
            </strong>
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <h2 className="font-display text-xl font-medium tracking-tight text-accent sm:text-2xl">
                Calculatrice de reconstitution de peptide
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Renseignez les valeurs. Vous pouvez basculer entre mg et µg.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              <UnitField
                label="Quantité de peptide dans le flacon"
                value={peptideValue}
                onChange={setPeptideValue}
                unit={peptideUnit}
                onUnitChange={setPeptideUnit}
                placeholder="ex. 10 ou 10000"
              />

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Eau bactériostatique <span className="text-muted-foreground">(mL)</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step={0.1}
                  min={0}
                  value={waterMl}
                  onChange={(e) => setWaterMl(e.target.value)}
                  placeholder="ex. 2"
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                />
              </div>

              <UnitField
                label="Dose souhaitée par injection"
                value={doseValue}
                onChange={setDoseValue}
                unit={doseUnit}
                onUnitChange={setDoseUnit}
                placeholder="ex. 0,25 ou 250"
              />
            </div>

            <button
              onClick={() => setSubmitted(true)}
              disabled={!valid}
              className="mt-7 w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Calculer
            </button>

            {submitted && valid && (
              <div className="mt-7 space-y-4">
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Volume à prélever
                  </div>
                  <div className="mt-2 flex items-baseline justify-center gap-2">
                    <span className="font-display text-4xl font-medium text-accent sm:text-5xl">
                      {fmt(result.units, 1)}
                    </span>
                    <span className="font-mono text-sm uppercase tracking-[0.18em] text-foreground/70">
                      unités
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    sur seringue à insuline U-100 (1 mL = 100 unités)
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
                    <span>
                      = <span className="text-foreground">{fmt(result.volumeMl, 3)} mL</span>
                    </span>
                    <span>
                      = <span className="text-foreground">{fmt(result.volumeUl, 1)} µL</span>
                    </span>
                  </div>
                </div>

                <dl className="divide-y divide-border rounded-xl border border-border bg-background">
                  <Row
                    k="Concentration finale"
                    v={`${fmt(result.conc, 3)} mg/mL`}
                  />
                  <Row
                    k="Dose par injection"
                    v={`${fmt(result.doseMg, 4)} mg · ${fmt(result.doseMg * 1000, 1)} µg`}
                  />
                  <Row
                    k="Doses par flacon"
                    v={`≈ ${fmt(result.dosesPerVial, 1)} prises`}
                  />
                </dl>

                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3.5 text-xs leading-relaxed text-foreground/80">
                  <strong className="text-warning">Avertissement :</strong> calcul
                  fourni pour la préparation d'aliquotes en cadre de recherche in
                  vitro. Ne constitue pas un protocole posologique humain.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function UnitField({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: Unit;
  onUnitChange: (u: Unit) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="mt-1.5 flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          step={unit === "mg" ? 0.1 : 10}
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-border">
          {(["mg", "mcg"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onUnitChange(u)}
              className={`px-3.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                unit === u
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:bg-surface"
              }`}
            >
              {u === "mcg" ? "µg" : "mg"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-sm text-muted-foreground">{k}</dt>
      <dd className="font-mono text-sm font-medium text-foreground">{v}</dd>
    </div>
  );
}

function fmt(n: number, digits = 3) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("fr-FR", { maximumFractionDigits: digits });
}
