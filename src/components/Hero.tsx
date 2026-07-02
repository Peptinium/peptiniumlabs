import { Link } from "@tanstack/react-router";
import avantAsset from "@/assets/vial/RT_AVANT_TRANSPARENT.png.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.985_0.005_260)] text-[oklch(0.18_0.02_270)]">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 0%, transparent 65%), radial-gradient(50% 40% at 12% 25%, color-mix(in oklab, var(--brand-cyan) 16%, transparent) 0%, transparent 60%), radial-gradient(50% 40% at 88% 35%, color-mix(in oklab, var(--brand-magenta) 12%, transparent) 0%, transparent 60%)",
        }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.25 0.03 270 / 60%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.25 0.03 270 / 60%) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
        }}
      />
      {/* Beam sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
      />

      <div className="container-prose relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-24 pb-10 text-center lg:min-h-0 lg:justify-start lg:pt-32 lg:pb-6">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.18_0.02_270)]/10 bg-white/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.26em] text-[oklch(0.30_0.03_270)] shadow-[0_1px_0_oklch(1_0_0)] backdrop-blur lg:px-3.5 lg:py-1.5 lg:text-[10px] lg:tracking-[0.28em]">
          <span className="size-1.5 animate-pulse rounded-full bg-[oklch(0.55_0.24_296)]" />
          Recherche avancée
        </div>

        {/* Title */}
        <h1 className="mt-7 font-display text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] text-balance text-[oklch(0.15_0.02_270)] sm:text-[64px] lg:mt-8 lg:text-[92px] lg:leading-[0.95]">
          <span className="shimmer-text block">L'Avenir de la</span>
          <span className="shimmer-text block">Précision Moléculaire.</span>
        </h1>


        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.6] text-[oklch(0.35_0.02_270)] lg:mt-7 lg:text-[17px] lg:leading-[1.7]">
          Peptides synthétiques haute pureté, contrôlés par HPLC et livrés avec
          Certificat d'Analyse. L'exigence du laboratoire, pensée pour le
          chercheur.
        </p>



        {/* CTAs — Mobile (solid, high contrast) */}
        <div className="mt-9 flex w-full flex-col items-stretch gap-3 lg:hidden">
          <Link
            to="/produits"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-4 font-mono text-[13px] uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_-16px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)]"
            style={{
              backgroundImage:
                "linear-gradient(120deg, oklch(0.55 0.20 210) 0%, oklch(0.50 0.24 280) 55%, oklch(0.58 0.26 330) 100%)",
            }}
          >
            <span className="relative">Explorer le catalogue</span>
            <span className="relative">→</span>
          </Link>
          <Link
            to="/tester-fioles"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[oklch(0.18_0.02_270)]/25 bg-white px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[oklch(0.18_0.02_270)] shadow-[0_10px_30px_-14px_color-mix(in_oklab,var(--brand-violet)_45%,transparent)]"
          >
            Tester vos fioles
          </Link>
        </div>

        {/* CTAs — Desktop (glass) */}
        <div className="mt-10 hidden flex-wrap items-center justify-center gap-3 sm:flex">
          <Link
            to="/produits"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white shadow-[0_22px_55px_-18px_color-mix(in_oklab,var(--brand-violet)_75%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_75px_-20px_color-mix(in_oklab,var(--brand-violet)_90%,transparent)]"
            style={{
              backgroundImage:
                "linear-gradient(120deg, oklch(0.58 0.19 210) 0%, oklch(0.52 0.24 280) 55%, oklch(0.60 0.25 330) 100%)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.45) 50%, transparent 60%)",
              }}
            />
            <span className="relative">Explorer le catalogue</span>
            <span className="relative transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/tester-fioles"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[oklch(0.20_0.02_270)]/30 bg-white px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[oklch(0.18_0.02_270)] shadow-[0_14px_40px_-18px_color-mix(in_oklab,var(--brand-violet)_55%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[oklch(0.20_0.02_270)]/55 hover:shadow-[0_22px_55px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, color-mix(in oklab, var(--brand-violet) 20%, transparent) 50%, transparent 60%)",
              }}
            />
            <span className="relative">Tester vos fioles</span>
          </Link>

        </div>


        {/* Vial */}
        <VialShowcase />
      </div>
    </section>
  );
}

function VialShowcase() {
  return (
    <div className="group relative mt-14 w-full max-w-[520px] sm:mt-16">
      {/* Outer soft halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-cyan) 30%, transparent) 0%, color-mix(in oklab, var(--brand-violet) 22%, transparent) 40%, transparent 72%)",
          filter: "blur(80px)",
          animation: "vial-glow 6s ease-in-out infinite",
        }}
      />
      {/* Inner bright halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 group-hover:h-[88%] group-hover:w-[88%]"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-violet) 55%, transparent) 0%, color-mix(in oklab, var(--brand-blue) 30%, transparent) 45%, transparent 72%)",
          filter: "blur(45px)",
          animation: "vial-glow 4.5s ease-in-out infinite",
        }}
      />
      {/* Floor reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-20 bottom-4 h-8 rounded-[50%] blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-violet) 45%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Image */}
      <div className="relative mx-auto aspect-[2/3] w-full max-w-[420px] overflow-visible">
        <img
          src={avantAsset.url}
          alt="Flacon Peptinium Retatrutide — pureté 99%"
          draggable={false}
          className="size-full origin-center object-contain drop-shadow-[0_30px_50px_color-mix(in_oklab,var(--brand-violet)_35%,transparent)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [animation:float_6s_ease-in-out_infinite] group-hover:scale-[1.08]"
        />
        {/* Sheen sweep on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.25) 50%, transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </div>

  );
}
