import { Link } from "@tanstack/react-router";
import { VialTurntable } from "@/components/VialTurntable";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 20% 20%, color-mix(in oklab, var(--brand-cyan) 10%, transparent) 0%, transparent 55%), radial-gradient(70% 60% at 85% 40%, color-mix(in oklab, var(--brand-violet) 12%, transparent) 0%, transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] grid-bg" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
      />

      <div className="container-prose relative grid gap-12 py-20 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-32">
        {/* Copy */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/80 backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Peptides de recherche · Pureté ≥ 99 %
          </div>

          <h1 className="mt-6 font-display text-[46px] font-medium leading-[0.95] tracking-[-0.03em] text-balance sm:text-[68px] lg:text-[84px]">
            <span className="block shimmer-text">Peptinium</span>
            <span className="mt-3 block text-[22px] font-normal leading-[1.15] tracking-tight text-muted-foreground sm:text-[28px] lg:text-[32px]">
              La précision moléculaire, au service de la recherche.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-[15px] leading-[1.75] text-muted-foreground sm:text-base">
            Peptides synthétiques haute pureté, contrôlés par HPLC et livrés
            avec Certificat d'Analyse. Une exigence de laboratoire, une
            expérience pensée pour le chercheur.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/produits"
              className="group inline-flex items-center gap-2 rounded-full brand-gradient-bg px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_-16px_oklch(0.55_0.22_296/0.55)] transition-transform hover:-translate-y-0.5"
            >
              Explorer le catalogue
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              to="/tester-fioles"
              className="link-underline inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/90 hover:border-primary/40"
            >
              Tester vos fioles
            </Link>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { k: "≥ 99 %", v: "Pureté HPLC" },
              { k: "CoA", v: "À chaque lot" },
              { k: "24 h", v: "Expédition" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-xl font-medium tracking-tight sm:text-2xl">{s.k}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Turntable */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[440px]">
            <VialTurntable />
          </div>
        </div>
      </div>
    </section>
  );
}
