import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, ArrowRight, Check, Droplets, Syringe } from "lucide-react";

export const Route = createFileRoute("/calculatrice")({
  head: () => ({
    meta: [
      { title: "Calculateur de reconstitution — Peptinium Labs" },
      {
        name: "description",
        content:
          "Calcule précisément combien d'unités tirer sur ta seringue à partir des données de ta fiole. Algorithme déterministe, sans IA, sans conseil médical.",
      },
      { property: "og:title", content: "Calculateur de reconstitution — Peptinium Labs" },
      {
        property: "og:description",
        content:
          "Deux étapes : volume d'eau bactériostatique à injecter, puis unités U-100 à tirer selon la dose.",
      },
    ],
    links: [{ rel: "canonical", href: "/calculatrice" }],
  }),
  component: CalcPage,
});

// Presets typiques (mg/ml recommandé & doses)
const PEPTIDES = [
  { id: "none", label: "Aucun (saisie libre)", mg: 0, water: 0, dose: 0 },
  { id: "reta", label: "Retatrutide", mg: 10, water: 2, dose: 2 },
  { id: "cjc-ipa", label: "CJC-1295 + Ipamorelin", mg: 10, water: 2, dose: 0.3 },
  { id: "bpc-157", label: "BPC-157", mg: 5, water: 2, dose: 0.25 },
  { id: "tb-500", label: "TB-500", mg: 10, water: 2, dose: 2 },
  { id: "ghk-cu", label: "GHK-Cu", mg: 50, water: 3, dose: 2 },
  { id: "mt-2", label: "Melanotan-2", mg: 10, water: 2, dose: 0.5 },
  { id: "semaglutide", label: "Semaglutide", mg: 5, water: 2, dose: 0.25 },
] as const;

const MG_OPTIONS = [5, 10, 15, 20, 30];
const WATER_OPTIONS = [1, 2, 3, 4, 5];

function CalcPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [preset, setPreset] = useState<string>("none");
  const [mg, setMg] = useState<number>(10);
  const [water, setWater] = useState<number>(2);
  const [dose, setDose] = useState<number>(2); // mg

  const applyPreset = (id: string) => {
    setPreset(id);
    const p = PEPTIDES.find((x) => x.id === id);
    if (p && p.mg > 0) {
      setMg(p.mg);
      setWater(p.water);
      setDose(p.dose);
    }
  };

  const concentration = water > 0 ? mg / water : 0; // mg/ml
  const volumeMl = concentration > 0 ? dose / concentration : 0;
  const units = volumeMl * 100; // U-100
  const dosesPerVial = dose > 0 ? mg / dose : 0;

  return (
    <SiteLayout>
      {/* Back link + step header */}
      <section className="border-b border-border/60 bg-background">
        <div className="container-prose px-5 pt-10 pb-4">
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-accent"
          >
            <ArrowLeft className="size-3" strokeWidth={2} /> Retour aux guides
          </Link>
        </div>
        <div className="container-prose px-5 pb-12">
          <Reveal>
            <span className="block text-accent font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
              — Guide recherche · Module 2
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-[18ch] text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-[62px] lg:text-[76px]">
              Calculateur de <span className="logo-gradient-text italic font-light">reconstitution</span>.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-2xl text-[16px] leading-[1.6] text-muted-foreground">
              Calcule précisément combien d'unités tirer sur ta seringue à partir des données
              de ta fiole. Algorithme déterministe, aucune IA, aucune recommandation médicale.
            </p>
          </Reveal>

          {/* Stepper */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-xl">
            {[
              { n: 1 as const, label: "Combien d'eau ajouter ?", Icon: Droplets },
              { n: 2 as const, label: "Combien d'unités tirer ?", Icon: Syringe },
            ].map((s) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <button
                  key={s.n}
                  onClick={() => setStep(s.n)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="grid size-7 place-items-center rounded-full border border-current text-[11px] font-semibold">
                    {done ? <Check className="size-3.5" strokeWidth={2.5} /> : s.n}
                  </span>
                  <span className="flex-1 font-mono text-[11px] uppercase tracking-[0.18em]">
                    {s.label}
                  </span>
                  <s.Icon className="size-4 opacity-70" strokeWidth={1.6} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-surface/40">
        <div className="container-prose grid gap-5 px-5 py-12 lg:grid-cols-2 lg:py-16">
          {/* LEFT — inputs */}
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Étape {step} — {step === 1 ? "Données de la fiole" : "Dose à injecter"}
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              {step === 1 ? "Paramètres de reconstitution" : "Volume à tirer"}
            </h2>

            <div className="mt-8 space-y-8">
              {step === 1 && (
                <>
                  {/* Preset */}
                  <Field label="Peptide (optionnel — pré-remplit les valeurs typiques)">
                    <select
                      value={preset}
                      onChange={(e) => applyPreset(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    >
                      {PEPTIDES.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </Field>

                  {/* mg */}
                  <Field label="Quantité de peptide dans la fiole">
                    <PillGroup
                      options={MG_OPTIONS}
                      value={mg}
                      onChange={setMg}
                      suffix="mg"
                    />
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="number"
                        value={mg}
                        onChange={(e) => setMg(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                      />
                      <span className="font-mono text-xs text-muted-foreground">mg</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Indiquée sur l'étiquette de ta fiole.</p>
                  </Field>

                  {/* water */}
                  <Field label="Volume d'eau bactériostatique">
                    <PillGroup
                      options={WATER_OPTIONS}
                      value={water}
                      onChange={setWater}
                      suffix="ml"
                    />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Dose souhaitée par injection">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.05"
                        value={dose}
                        onChange={(e) => setDose(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                      />
                      <span className="font-mono text-xs text-muted-foreground">mg</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Concentration actuelle : <b>{concentration.toFixed(2)} mg/ml</b> · Fiole {mg} mg / {water} ml.
                    </p>
                  </Field>

                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Volume" value={`${volumeMl.toFixed(2)} ml`} />
                    <Stat label="Unités U-100" value={units.toFixed(1)} highlight />
                    <Stat label="Doses / fiole" value={dosesPerVial.toFixed(1)} />
                  </div>
                </>
              )}
            </div>

            <div className="mt-10 flex justify-between">
              {step === 2 ? (
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface"
                >
                  <ArrowLeft className="size-4" strokeWidth={2} /> Étape 1
                </button>
              ) : <span />}
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  className="brand-gradient-cta ml-auto inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                >
                  Calculer ma dose <ArrowRight className="size-4" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — animated vial / syringe */}
          <div className="rounded-2xl border border-border bg-foreground p-6 text-background lg:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-background/60">
              {step === 1 ? "Volume d'eau recommandé" : "Unités à tirer (U-100)"}
            </div>

            {step === 1 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                <Vial fillRatio={Math.min(1, water / 5)} label={`${mg} mg poudre · ${concentration.toFixed(2)} mg/ml`} />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-[72px] font-semibold leading-none tracking-tight">
                      {water}
                    </span>
                    <span className="text-lg text-background/70">ml</span>
                  </div>
                  <p className="mt-3 max-w-xs text-sm text-background/70">
                    Quantité d'eau bactériostatique à injecter dans la fiole.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1.5 text-xs">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Concentration : <b>{concentration.toFixed(2)} mg/ml</b>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_180px] sm:items-center">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-[72px] font-semibold leading-none tracking-tight">
                      {units.toFixed(1)}
                    </span>
                    <span className="text-lg text-background/70">U</span>
                  </div>
                  <p className="mt-3 max-w-xs text-sm text-background/70">
                    À tirer sur une seringue à insuline U-100 pour délivrer {dose} mg.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    <Badge>{volumeMl.toFixed(2)} ml</Badge>
                    <Badge>{(volumeMl * 1000).toFixed(0)} µL</Badge>
                    <Badge>{dosesPerVial.toFixed(1)} doses/fiole</Badge>
                  </div>
                </div>
                <Syringe100 units={units} />
              </div>
            )}
          </div>
        </div>
        <p className="container-prose px-5 pb-16 text-center text-xs text-muted-foreground">
          Les produits proposés sur ce site sont destinés exclusivement à la recherche scientifique
          in vitro. Aucun usage humain ou vétérinaire.
        </p>
      </section>
    </SiteLayout>
  );
}

// ---------- UI atoms ----------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function PillGroup({
  options,
  value,
  onChange,
  suffix,
}: {
  options: readonly number[];
  value: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:border-foreground/50"
            }`}
          >
            {o} {suffix}
          </button>
        );
      })}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-accent/50 bg-accent/5" : "border-border bg-background"}`}>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-2xl font-semibold tracking-tight ${highlight ? "logo-gradient-text" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-background/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-background/80">
      {children}
    </span>
  );
}

// ---------- Vial illustration ----------
function Vial({ fillRatio, label }: { fillRatio: number; label: string }) {
  const ratio = Math.max(0.05, Math.min(1, fillRatio));
  return (
    <div className="relative mx-auto flex h-56 w-40 flex-col items-center justify-end rounded-xl bg-background/5 p-3">
      {/* cap */}
      <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-col items-center">
        <div className="h-3 w-14 rounded-t-md bg-background/70" />
        <div className="h-2 w-16 rounded-sm bg-background/40" />
      </div>
      {/* body */}
      <div className="relative mt-10 h-40 w-24 overflow-hidden rounded-md border border-background/20 bg-background/[0.04]">
        {/* powder */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-background/30" />
        {/* liquid */}
        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
          style={{
            height: `${20 + ratio * 70}%`,
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--brand-cyan) 55%, transparent) 0%, color-mix(in oklab, var(--brand-violet) 50%, transparent) 100%)",
          }}
        />
        {/* graduations */}
        {[0.2, 0.4, 0.6, 0.8].map((g) => (
          <div key={g} className="absolute right-1 h-px w-3 bg-background/40" style={{ bottom: `${g * 100}%` }}>
            <span className="absolute -top-2 right-4 font-mono text-[8px] text-background/50">
              {Math.round(g * 5)}ml
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 font-mono text-[9px] text-background/60">{label}</div>
    </div>
  );
}

function Syringe100({ units }: { units: number }) {
  const clamped = Math.max(0, Math.min(100, units));
  return (
    <div className="relative mx-auto h-56 w-40">
      <div className="absolute inset-x-0 top-4 mx-auto h-40 w-16 overflow-hidden rounded-sm border border-background/20 bg-background/5">
        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
          style={{
            height: `${clamped}%`,
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--brand-cyan) 55%, transparent) 0%, color-mix(in oklab, var(--brand-magenta) 55%, transparent) 100%)",
          }}
        />
        {[0, 20, 40, 60, 80, 100].map((g) => (
          <div key={g} className="absolute right-1 h-px w-3 bg-background/40" style={{ bottom: `${g}%` }}>
            <span className="absolute -top-2 right-4 font-mono text-[8px] text-background/50">{g}u</span>
          </div>
        ))}
      </div>
      {/* plunger */}
      <div
        className="absolute left-1/2 w-14 -translate-x-1/2 rounded-sm bg-background/60 transition-[top,height] duration-500 ease-out"
        style={{ top: `${16 + (100 - clamped) * 1.6}px`, height: `${clamped * 1.6}px` }}
      />
      <div className="absolute inset-x-0 top-0 mx-auto h-4 w-24 rounded-t bg-background/70" />
      <div className="absolute inset-x-0 bottom-0 mx-auto h-6 w-2 bg-background/70" />
    </div>
  );
}
