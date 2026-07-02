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

      <div className="container-prose relative flex flex-col items-center px-5 pt-24 pb-6 text-center sm:pt-28 lg:pt-32">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.18_0.02_270)]/10 bg-white/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[oklch(0.30_0.03_270)] shadow-[0_1px_0_oklch(1_0_0)] backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-[oklch(0.55_0.24_296)]" />
          Recherche avancée
        </div>

        {/* Title */}
        <h1 className="mt-8 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.035em] text-balance text-[oklch(0.15_0.02_270)] sm:text-[72px] lg:text-[92px]">
          <span className="shimmer-text block">L'Avenir de la</span>
          <span className="shimmer-text block">Précision Moléculaire.</span>
        </h1>


        {/* Subtitle */}
        <p className="mt-7 max-w-2xl text-[15px] leading-[1.7] text-[oklch(0.35_0.02_270)] sm:text-[17px]">
          Peptides synthétiques haute pureté, contrôlés par HPLC et livrés avec
          Certificat d'Analyse. L'exigence du laboratoire, pensée pour le
          chercheur.
        </p>


        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/produits"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[oklch(0.18_0.02_270)] shadow-[0_20px_50px_-18px_color-mix(in_oklab,var(--brand-violet)_55%,transparent)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:shadow-[0_28px_70px_-20px_color-mix(in_oklab,var(--brand-violet)_75%,transparent)]"
            style={{
              backgroundImage:
                "linear-gradient(120deg, color-mix(in oklab, var(--brand-cyan) 22%, white) 0%, color-mix(in oklab, var(--brand-blue) 20%, white) 40%, color-mix(in oklab, var(--brand-violet) 22%, white) 70%, color-mix(in oklab, var(--brand-magenta) 20%, white) 100%)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.55) 50%, transparent 60%)",
              }}
            />
            <span className="relative">Explorer le catalogue</span>
            <span className="relative transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/tester-fioles"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/50 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[oklch(0.22_0.02_270)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/80"
            style={{
              backgroundImage:
                "linear-gradient(120deg, color-mix(in oklab, var(--brand-cyan) 12%, white) 0%, color-mix(in oklab, var(--brand-violet) 12%, white) 60%, color-mix(in oklab, var(--brand-magenta) 12%, white) 100%)",
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
