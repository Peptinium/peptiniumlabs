import { Link } from "@tanstack/react-router";
import avantAsset from "@/assets/vial/RT_AVANT.png.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.09_0.02_270)] text-[oklch(0.97_0.01_240)]">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--brand-violet) 22%, transparent) 0%, transparent 65%), radial-gradient(50% 40% at 15% 30%, color-mix(in oklab, var(--brand-cyan) 14%, transparent) 0%, transparent 60%), radial-gradient(50% 40% at 85% 40%, color-mix(in oklab, var(--brand-magenta) 12%, transparent) 0%, transparent 60%)",
        }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.9 0.02 260 / 60%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.9 0.02 260 / 60%) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
        }}
      />
      {/* Beam sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.85_0.15_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
      />

      <div className="container-prose relative flex flex-col items-center px-5 pt-24 pb-6 text-center sm:pt-28 lg:pt-32">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/80 backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-[oklch(0.75_0.18_296)]" />
          Recherche avancée
        </div>

        {/* Title */}
        <h1 className="mt-8 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.035em] text-balance text-white sm:text-[72px] lg:text-[92px]">
          <span className="block">L'Avenir de la</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, oklch(0.78 0.15 200) 0%, oklch(0.68 0.19 260) 30%, oklch(0.62 0.26 296) 60%, oklch(0.72 0.25 0) 100%)",
            }}
          >
            Précision Moléculaire.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-7 max-w-2xl text-[15px] leading-[1.7] text-white/65 sm:text-[17px]">
          Peptides synthétiques haute pureté, contrôlés par HPLC et livrés avec
          Certificat d'Analyse. L'exigence du laboratoire, pensée pour le
          chercheur.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/produits"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[oklch(0.15_0.02_270)] shadow-[0_20px_50px_-16px_oklch(0.98_0_0/0.35)] transition-transform hover:-translate-y-0.5"
          >
            Explorer le catalogue
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/tester-fioles"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/90 backdrop-blur transition-colors hover:border-white/30 hover:bg-white/[0.08]"
          >
            Tester vos fioles
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
      {/* Halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 group-hover:h-[95%] group-hover:w-[95%]"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-violet) 45%, transparent) 0%, color-mix(in oklab, var(--brand-blue) 20%, transparent) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "vial-glow 5s ease-in-out infinite",
        }}
      />
      {/* Floor reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-16 bottom-6 h-10 rounded-[50%] blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0 0 0 / 0.55) 0%, transparent 70%)",
        }}
      />
      {/* Image */}
      <div className="relative mx-auto aspect-[2/3] w-full max-w-[420px] overflow-visible">
        <img
          src={avantAsset.url}
          alt="Flacon Peptinium Retatrutide — pureté 99%"
          draggable={false}
          className="size-full origin-center object-contain drop-shadow-[0_40px_60px_oklch(0.05_0.02_270/0.6)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [animation:float_6s_ease-in-out_infinite] group-hover:scale-[1.08]"
        />
        {/* Sheen sweep on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.15) 50%, transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </div>
  );
}
