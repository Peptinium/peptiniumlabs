import { Link } from "@tanstack/react-router";
import avantAsset from "@/assets/vial/RT_AVANT_TRANSPARENT.png.asset.json";
import { FloatingMolecules } from "@/components/hero/FloatingMolecules";
import { PurityCounter } from "@/components/hero/PurityCounter";
import { VialParticles } from "@/components/hero/VialParticles";
import { TrustBar } from "@/components/hero/TrustBar";

export function Hero() {
  return (
    <>
      <MobileHero />
      <DesktopHero />
      <TrustBar variant="mobile" />
      <TrustBar variant="desktop" />
    </>
  );
}

function DesktopHero() {
  return (
    <section className="desktop-experience relative overflow-hidden bg-[oklch(0.985_0.005_260)] text-[oklch(0.18_0.02_270)]">
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
      {/* Floating molecules — subtle on desktop */}
      <FloatingMolecules className="opacity-40" />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Beam sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
      />

      <div className="container-prose relative flex flex-col items-center px-5 pt-20 pb-8 text-center lg:pt-32 lg:pb-6">
        <PurityCounter />

        {/* Title */}
        <h1 className="mt-5 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-balance text-[oklch(0.15_0.02_270)] sm:text-[60px] lg:mt-8 lg:text-[92px] lg:leading-[0.95]">
          <span className="shimmer-text block">L'Avenir de la</span>
          <span className="shimmer-text block">Précision Moléculaire.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-[16px] leading-[1.55] text-[oklch(0.35_0.02_270)] lg:mt-7 lg:text-[17px] lg:leading-[1.7]">
          Peptides synthétiques haute pureté, contrôlés par HPLC et livrés avec
          Certificat d'Analyse. L'exigence du laboratoire, pensée pour le
          chercheur.
        </p>

        <div className="mt-10 hidden flex-wrap items-center justify-center gap-3 lg:flex">
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
            <span className="relative">Tester vos fioles</span>
          </Link>
        </div>

        <VialShowcase />
      </div>
    </section>
  );
}

function MobileHero() {
  return (
    <section className="mobile-experience relative isolate overflow-hidden bg-[oklch(0.985_0.005_260)] text-[oklch(0.18_0.02_270)]">
      {/* Ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(90% 55% at 50% 0%, color-mix(in oklab, var(--brand-cyan) 18%, transparent) 0%, transparent 70%), radial-gradient(75% 55% at 50% 62%, color-mix(in oklab, var(--brand-violet) 24%, transparent) 0%, transparent 68%), linear-gradient(180deg, oklch(0.995 0.003 260) 0%, oklch(0.97 0.012 260) 100%)",
        }}
      />
      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.25 0.03 270 / 70%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.25 0.03 270 / 70%) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 16%, black 78%, transparent 100%)",
        }}
      />
      {/* Floating molecules */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <FloatingMolecules />
      </div>
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Beam */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 z-10 h-px w-2/3 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_6s_ease-in-out_infinite]"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[440px] flex-col px-5 pb-6 pt-6 text-center">
        <div className="flex flex-1 flex-col items-center justify-center">
          <PurityCounter />

          <h1 className="mt-4 font-display text-[38px] font-semibold leading-[0.98] tracking-[-0.035em] text-[oklch(0.15_0.02_270)]">
            <span className="shimmer-text block">L'Avenir</span>
            <span className="shimmer-text block">de la Précision</span>
            <span className="shimmer-text block">Moléculaire.</span>
          </h1>

          <p className="mt-4 max-w-[340px] text-[15px] font-medium leading-[1.5] text-[oklch(0.31_0.025_270)]">
            Peptides haute pureté contrôlés par HPLC, livrés avec Certificat d'Analyse.
          </p>

          <div className="mt-5 grid w-full max-w-[320px] gap-2.5">
            <Link
              to="/produits"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--brand-violet)_80%,transparent)]"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, oklch(0.55 0.20 210) 0%, oklch(0.50 0.24 280) 55%, oklch(0.58 0.26 330) 100%)",
              }}
            >
              <span>Explorer le catalogue</span>
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/tester-fioles"
              className="inline-flex items-center justify-center rounded-full border border-[oklch(0.18_0.02_270)]/28 bg-white/95 px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[oklch(0.16_0.025_270)] shadow-[0_14px_32px_-22px_color-mix(in_oklab,var(--brand-violet)_60%,transparent)] backdrop-blur-md"
            >
              Tester vos fioles
            </Link>
          </div>
        </div>

        {/* Vial + halo + particles + ground reflection */}
        <div className="relative mx-auto mt-5 h-[300px] w-full max-w-[320px] shrink-0">
          {/* Outer halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-cyan) 34%, transparent) 0%, color-mix(in oklab, var(--brand-violet) 26%, transparent) 44%, transparent 72%)",
              filter: "blur(48px)",
              animation: "vial-glow 5s ease-in-out infinite",
            }}
          />

          {/* Rising micro-particles (behind vial glass illusion) */}
          <VialParticles />

          {/* Vial image */}
          <img
            src={avantAsset.url}
            alt="Flacon Peptinium Retatrutide — pureté 99%"
            draggable={false}
            className="relative z-20 mx-auto h-[86%] w-auto object-contain drop-shadow-[0_28px_42px_color-mix(in_oklab,var(--brand-violet)_30%,transparent)] [animation:float_6s_ease-in-out_infinite]"
          />

          {/* Ground reflection (mirror) */}
          <img
            src={avantAsset.url}
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute left-1/2 top-[82%] z-10 h-[40%] w-auto -translate-x-1/2 scale-y-[-1] object-contain opacity-25"
            style={{
              maskImage: "linear-gradient(to bottom, black 0%, transparent 65%)",
              filter: "blur(2px)",
            }}
          />
          {/* Floor pool light */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 bottom-2 h-6 rounded-[50%] blur-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-violet) 50%, transparent) 0%, transparent 70%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}


function VialShowcase() {
  return (
    <div className="group relative mt-14 w-full max-w-[520px] sm:mt-16">
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
      {/* Particles inside vial */}
      <VialParticles />
      {/* Vial */}
      <div className="relative mx-auto aspect-[2/3] w-full max-w-[420px] overflow-visible">
        <img
          src={avantAsset.url}
          alt="Flacon Peptinium Retatrutide — pureté 99%"
          draggable={false}
          className="relative z-20 size-full origin-center object-contain drop-shadow-[0_30px_50px_color-mix(in_oklab,var(--brand-violet)_35%,transparent)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [animation:float_6s_ease-in-out_infinite] group-hover:scale-[1.08]"
        />
        {/* Reflet miroir */}
        <img
          src={avantAsset.url}
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-[92%] z-10 h-[45%] w-auto -translate-x-1/2 scale-y-[-1] object-contain opacity-20"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, transparent 60%)",
            filter: "blur(3px)",
          }}
        />
        {/* Sheen sweep on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 -translate-x-full opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
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
