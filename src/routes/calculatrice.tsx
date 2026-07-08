import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { FlaskConical, Droplets, Syringe, Sparkles } from "lucide-react";

export const Route = createFileRoute("/calculatrice")({
  head: () => ({
    meta: [
      { title: "Calculatrice de reconstitution de peptide — Peptinium Labs" },
      {
        name: "description",
        content:
          "Calculatrice de dilution pour peptides lyophilisés reconstitués à l'eau bactériostatique. Volume en unités de seringue U-100, µL et mL. Usage recherche uniquement.",
      },
      { property: "og:title", content: "Calculatrice de reconstitution — Peptinium Labs" },
      { property: "og:description", content: "Calcul du volume à prélever après reconstitution d'un flacon de peptide lyophilisé." },
      { property: "og:url", content: "/calculatrice" },
    ],
    links: [{ rel: "canonical", href: "/calculatrice" }],
  }),
  component: CalcPage,
});

type Unit = "mg" | "mcg";

const SWEEPS =
  "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-magenta) 22%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-cyan) 22%, transparent) 0%, transparent 70%), radial-gradient(70% 55% at 50% 55%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 0%, transparent 78%)";

const GRADIENT_BTN =
  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)";

function CalcPage() {
  const [peptideValue, setPeptideValue] = useState<string>("");
  const [peptideUnit, setPeptideUnit] = useState<Unit>("mg");
  const [waterMl, setWaterMl] = useState<string>("");
  const [doseValue, setDoseValue] = useState<string>("");
  const [doseUnit, setDoseUnit] = useState<Unit>("mg");

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
      <div className="bg-background text-foreground">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: SWEEPS }} />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            aria-hidden
            style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }}
          />

          <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-16 lg:px-10 sm:pt-32 sm:pb-20">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-muted" />
                Outils labo — Reconstitution
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-4xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[80px] sm:leading-[0.96]"
                data-shimmer="Calculez votre dilution en une seconde."
              >
                Calculez votre dilution en une seconde.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-muted-foreground sm:text-[19px]">
                Volume à prélever après reconstitution d'un flacon de peptide lyophilisé
                avec de l'eau bactériostatique. Résultat exprimé en unités de seringue
                insuline U-100, en microlitres et en millilitres.{" "}
                <span className="text-foreground">Usage recherche in vitro uniquement.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ CALCULATOR ============ */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              {/* --- Inputs --- */}
              <Reveal>
                <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card p-8 shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--brand-violet)_35%,transparent)] sm:p-10">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    aria-hidden
                    style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand-violet) 60%, transparent), transparent)" }}
                  />

                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    — Vos paramètres
                  </span>
                  <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[32px]">
                    Renseignez les valeurs.
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-muted-foreground">
                    Basculez librement entre milligrammes et microgrammes selon votre étiquette.
                  </p>

                  <div className="mt-9 space-y-6">
                    <UnitField
                      Icon={FlaskConical}
                      label="Quantité de peptide dans le flacon"
                      value={peptideValue}
                      onChange={setPeptideValue}
                      unit={peptideUnit}
                      onUnitChange={setPeptideUnit}
                      placeholder="ex. 10 ou 10000"
                    />

                    <div>
                      <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <Droplets className="size-3.5 text-accent" strokeWidth={1.6} />
                        Eau bactériostatique <span className="normal-case tracking-normal text-muted-foreground/70">(mL)</span>
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step={0.1}
                        min={0}
                        value={waterMl}
                        onChange={(e) => setWaterMl(e.target.value)}
                        placeholder="ex. 2"
                        className="mt-2 w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-[15px] font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[color-mix(in_oklab,var(--brand-violet)_60%,var(--border))] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-violet)_12%,transparent)]"
                      />
                    </div>

                    <UnitField
                      Icon={Syringe}
                      label="Dose souhaitée par injection"
                      value={doseValue}
                      onChange={setDoseValue}
                      unit={doseUnit}
                      onUnitChange={setDoseUnit}
                      placeholder="ex. 0,25 ou 250"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPeptideValue("");
                      setWaterMl("");
                      setDoseValue("");
                    }}
                    className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ↺ Réinitialiser
                  </button>
                </div>
              </Reveal>

              {/* --- Results --- */}
              <Reveal delay={80}>
                <div className="flex h-full flex-col gap-5">
                  {/* Result hero */}
                  <div
                    className="relative overflow-hidden rounded-[28px] border border-transparent p-[1px]"
                    style={{ background: GRADIENT_BTN }}
                  >
                    <div className="relative flex flex-col rounded-[27px] bg-card px-8 py-10 sm:px-10 sm:py-12">
                      <div
                        className="pointer-events-none absolute inset-0 opacity-70"
                        aria-hidden
                        style={{
                          background:
                            "radial-gradient(70% 60% at 80% 10%, color-mix(in oklab, var(--brand-violet) 14%, transparent), transparent 70%), radial-gradient(60% 60% at 10% 90%, color-mix(in oklab, var(--brand-cyan) 12%, transparent), transparent 70%)",
                        }}
                      />
                      <div className="relative">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                          <Sparkles className="size-3.5" strokeWidth={1.6} />
                          Volume à prélever
                        </div>

                        <div className="mt-6 flex items-baseline gap-3">
                          <span
                            className="font-display text-[72px] font-semibold leading-none tracking-[-0.04em] sm:text-[104px]"
                            style={{
                              backgroundImage: GRADIENT_BTN,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {valid ? fmt(result.units, 1) : "—"}
                          </span>
                          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
                            unités
                          </span>
                        </div>
                        <p className="mt-3 text-[13.5px] leading-[1.55] text-muted-foreground">
                          sur seringue insuline U-100 (1 mL = 100 unités)
                        </p>

                        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          <span>
                            µL <span className="ml-1.5 text-foreground">{valid ? fmt(result.volumeUl, 1) : "—"}</span>
                          </span>
                          <span>
                            mL <span className="ml-1.5 text-foreground">{valid ? fmt(result.volumeMl, 3) : "—"}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-border/70 bg-border sm:grid-cols-3">
                    <MetricCell
                      label="Concentration"
                      value={valid ? `${fmt(result.conc, 3)}` : "—"}
                      unit="mg/mL"
                    />
                    <MetricCell
                      label="Dose / injection"
                      value={valid ? fmt(result.doseMg * 1000, 1) : "—"}
                      unit="mcg"
                    />
                    <MetricCell
                      label="Doses / flacon"
                      value={valid ? `≈ ${fmt(result.dosesPerVial, 1)}` : "—"}
                      unit="prises"
                    />
                  </div>

                  {/* Warning */}
                  <div className="rounded-[20px] border border-border/70 bg-card/60 p-5">
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 inline-block size-1.5 shrink-0 rounded-full"
                        style={{ background: GRADIENT_BTN }}
                        aria-hidden
                      />
                      <p className="text-[13px] leading-[1.65] text-muted-foreground">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
                          Avertissement RUO —{" "}
                        </span>
                        Ces calculs servent à la préparation d'aliquotes en cadre de recherche
                        in vitro. Ils ne constituent en aucun cas un protocole posologique
                        humain ou vétérinaire.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function UnitField({
  Icon,
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  placeholder,
}: {
  Icon: typeof FlaskConical;
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: Unit;
  onUnitChange: (u: Unit) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <Icon className="size-3.5 text-accent" strokeWidth={1.6} />
        {label}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          step={unit === "mg" ? 0.1 : 10}
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-[15px] font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[color-mix(in_oklab,var(--brand-violet)_60%,var(--border))] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-violet)_12%,transparent)]"
        />
        <div className="flex shrink-0 overflow-hidden rounded-xl border border-border/70 bg-background p-1">
          {(["mg", "mcg"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onUnitChange(u)}
              className={`rounded-lg px-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] transition-all ${
                unit === u
                  ? "text-white shadow-[0_8px_24px_-10px_color-mix(in_oklab,var(--brand-violet)_60%,transparent)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                unit === u
                  ? { backgroundImage: GRADIENT_BTN }
                  : undefined
              }
            >
              {u === "mcg" ? "mcg" : "mg"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCell({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex flex-col gap-2 bg-card px-6 py-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-foreground sm:text-[30px]">
          {value}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}

function fmt(n: number, digits = 3) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("fr-FR", { maximumFractionDigits: digits });
}
