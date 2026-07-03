import { Link } from "@tanstack/react-router";
import avantAsset from "@/assets/vial/RT_AVANT_TRANSPARENT.png.asset.json";

export function Hero() {
  return (
    <>
      <MobileHero />
      <DesktopHero />
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
            "radial-gradient(50% 40% at 50% 0%, color-mix(in oklab, var(--brand-violet) 5%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Grid overlay removed for premium Apple-like feel */}

      {/* Beam sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
      />

      <div className="container-prose relative flex flex-col items-center px-5 pt-20 pb-8 text-center lg:pt-32 lg:pb-6">
        {/* Pill removed */}

        {/* Title */}
        <h1 className="mt-5 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-balance text-[oklch(0.15_0.02_270)] sm:text-[60px] lg:mt-8 lg:text-[92px] lg:leading-[0.95]">
          <span className="shimmer-text block">L'Avenir de la</span>
          <span className="shimmer-text block">Précision Moléculaire.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-2xl text-[16px] leading-[1.55] text-[oklch(0.35_0.02_270)] lg:mt-7 lg:text-[17px] lg:leading-[1.7]">
          Peptides synthétiques haute pureté, contrôlés par HPLC. L'exigence du
          laboratoire, pensée pour le chercheur.
        </p>

        {/* CTAs — Mobile (solid, high contrast) */}
        <div className="mt-7 flex w-full flex-col items-stretch gap-3 lg:hidden">
          <Link
            to="/produits"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_-16px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)]"
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[oklch(0.18_0.02_270)]/25 bg-white px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.22em] text-[oklch(0.18_0.02_270)] shadow-[0_10px_30px_-14px_color-mix(in_oklab,var(--brand-violet)_45%,transparent)]"
          >
            Tester vos fioles
          </Link>
        </div>

        {/* CTAs — Desktop (glass) */}
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

function MobileHero() {
  return (
    <section className="mobile-experience relative isolate overflow-hidden bg-[oklch(0.985_0.005_260)] text-[oklch(0.18_0.02_270)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(90% 55% at 50% 0%, color-mix(in oklab, var(--brand-cyan) 18%, transparent) 0%, transparent 70%), radial-gradient(75% 55% at 50% 62%, color-mix(in oklab, var(--brand-violet) 24%, transparent) 0%, transparent 68%), linear-gradient(180deg, oklch(0.995 0.003 260) 0%, oklch(0.97 0.012 260) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-0"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 z-10 h-px w-2/3 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_6s_ease-in-out_infinite]"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[440px] flex-col px-5 pb-6 pt-6 text-center">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.18_0.02_270)]/12 bg-white/82 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[oklch(0.26_0.03_270)] shadow-[0_10px_30px_-22px_color-mix(in_oklab,var(--brand-violet)_55%,transparent)] backdrop-blur-md">
            <span className="size-1.5 animate-pulse rounded-full bg-[oklch(0.55_0.24_296)]" />
            Recherche avancée
          </div>

          <h1 className="mt-4 font-display text-[38px] font-semibold leading-[0.98] tracking-[-0.035em] text-[oklch(0.15_0.02_270)]">
            <span className="shimmer-text block">L'Avenir</span>
            <span className="shimmer-text block">de la Précision</span>
            <span className="shimmer-text block">Moléculaire.</span>
          </h1>

          <p className="mt-4 max-w-[340px] text-[15px] font-medium leading-[1.5] text-[oklch(0.31_0.025_270)]">
            Peptides haute pureté contrôlés par HPLC, pour recherche laboratoire.
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

        <div className="relative mx-auto mt-5 h-[260px] w-full max-w-[320px] shrink-0">
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
          <img
            src={avantAsset.url}
            alt="Flacon Peptinium Retatrutide — pureté 99%"
            draggable={false}
            className="mx-auto h-full w-auto object-contain drop-shadow-[0_28px_42px_color-mix(in_oklab,var(--brand-violet)_30%,transparent)] [animation:float_6s_ease-in-out_infinite]"
          />
        </div>

        {/* Inline hero stats */}
        <div className="relative mt-6 flex items-center justify-between gap-2 border-t border-[oklch(0.18_0.02_270)]/12 pt-5 text-left">
          {[
            { k: "≥ 99%", v: "Pureté HPLC" },
            { k: "CoA", v: "Par lot" },
            { k: "RUO", v: "Recherche" },
            { k: "24 h", v: "Expédition" },
          ].map((t, i) => (
            <div key={t.k} className={`flex-1 ${i > 0 ? "border-l border-[oklch(0.18_0.02_270)]/10 pl-2" : ""}`}>
              <div className="font-display text-[15px] font-semibold leading-none tracking-tight text-[oklch(0.15_0.02_270)]">
                {t.k}
              </div>
              <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[oklch(0.42_0.02_270)]">
                {t.v}
              </div>
            </div>
          ))}
        </div>
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
