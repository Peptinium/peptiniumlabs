import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import vialAsset from "@/assets/vial/RT_AVANT_TRANSPARENT.png.asset.json";
import penAsset from "@/assets/hero/peptinium-pen.png.asset.json";
import pillAsset from "@/assets/hero/peptinium-pill.png.asset.json";
import { useRevealBlur } from "@/hooks/useScrollBlur";

/**
 * Editorial hero inspired by Vela — massive serif headline,
 * floating trio (vial + pen + pill), pill CTAs, uppercase micro-labels.
 * Kept Peptinium brand DA (cyan → violet → magenta) as accents only.
 */
export function HeroVela() {
  useRevealBlur();
  return (
    <section className="relative overflow-hidden bg-background">

      {/* Ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 30%, color-mix(in oklab, var(--brand-violet) 10%, transparent) 0%, transparent 65%), radial-gradient(45% 45% at 15% 80%, color-mix(in oklab, var(--brand-cyan) 8%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Beam sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
      />

      <div className="container-prose relative grid gap-10 px-5 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-6 lg:pt-28 lg:pb-32">
        {/* LEFT — copy */}
        <div className="relative z-10 flex flex-col text-left">
          <span className="brand-gradient-text font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
            La plus haute qualité
          </span>

          <h1 className="mt-6 text-[54px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[76px] lg:text-[104px] lg:leading-[0.94]">
            Le leader
            <br />
            européen
            <br />
            <span className="brand-gradient-text">des peptides</span>
          </h1>

          <p className="mt-7 max-w-md text-[16px] leading-[1.6] text-muted-foreground lg:text-[17px]">
            Découvrez notre gamme de peptides rigoureusement testés, fabriqués
            selon des protocoles de laboratoire stricts et préparés pour des
            résultats de recherche optimaux.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/produits"
              className="group inline-flex items-center gap-3 rounded-full px-7 py-4 font-sans text-[14px] font-medium text-white shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_color-mix(in_oklab,var(--brand-violet)_85%,transparent)]"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)",
              }}
            >
              Catalogue
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0.5"
              >
                <ArrowRight className="size-3.5" strokeWidth={2.2} />
              </span>
            </Link>

            <Link
              to="/etudes-scientifiques"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/25 bg-transparent px-7 py-4 font-sans text-[14px] font-medium text-foreground transition-all hover:border-foreground/60 hover:bg-foreground/[0.03]"
            >
              Découvrir la science
            </Link>
          </div>

          <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Réservé à la recherche
          </div>
        </div>

        {/* RIGHT — trio (vial + pen + pill) */}
        <div className="relative mx-auto flex h-[420px] w-full max-w-[560px] items-center justify-center lg:h-[620px]">
          {/* Soft aurora halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-8 -z-10 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, color-mix(in oklab, var(--brand-cyan) 30%, transparent) 0%, color-mix(in oklab, var(--brand-blue) 22%, transparent) 25%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 55%, color-mix(in oklab, var(--brand-magenta) 24%, transparent) 78%, color-mix(in oklab, var(--brand-cyan) 30%, transparent) 100%)",
              filter: "blur(70px)",
              animation: "vial-glow 6s ease-in-out infinite",
            }}
          />

          {/* Pen — behind, top-right, tilted */}
          <img
            src={penAsset.url}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute right-2 top-4 h-[78%] w-auto rotate-[24deg] object-contain drop-shadow-[0_24px_32px_color-mix(in_oklab,var(--brand-blue)_18%,transparent)] [animation:float_9s_ease-in-out_infinite] lg:right-6 lg:top-2"
          />

          {/* Vial — main, centered */}
          <img
            src={vialAsset.url}
            alt="Flacon Peptinium — peptide de recherche pureté ≥ 99 %"
            draggable={false}
            className="relative z-10 h-full w-auto object-contain drop-shadow-[0_36px_50px_color-mix(in_oklab,var(--brand-violet)_28%,transparent)] [animation:float_6s_ease-in-out_infinite]"
          />

          {/* Pill — foreground, bottom-right */}
          <img
            src={pillAsset.url}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute -bottom-2 right-8 z-20 h-[32%] w-auto object-contain drop-shadow-[0_16px_24px_color-mix(in_oklab,var(--brand-magenta)_25%,transparent)] [animation:float_5s_ease-in-out_infinite_0.8s] lg:right-14 lg:h-[36%]"
          />
        </div>
      </div>

      {/* Lab tests strip */}
      <LabTestsStrip />
    </section>
  );
}

function LabTestsStrip() {
  const tests = [
    { k: "HPLC", v: "Analyse pureté" },
    { k: "Endotoxine", v: "Dosage LAL" },
    { k: "TYMC", v: "Test levures" },
    { k: "TAMC", v: "Test bactéries" },
    { k: "Métaux lourds", v: "Dépistage ICP" },
  ];
  return (
    <div className="relative border-t border-border/60 bg-surface/40 backdrop-blur-sm">
      <div className="container-prose flex flex-wrap items-center gap-x-12 gap-y-7 px-5 py-8">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[
              "oklch(0.62 0.15 200)",
              "oklch(0.55 0.20 280)",
              "oklch(0.62 0.25 350)",
            ].map((bg, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-full border-2 border-background font-serif text-[13px] font-medium text-white"
                style={{ background: bg }}
              >
                {["S", "M", "Dr"][i]}
              </span>
            ))}
            <span className="ml-2 grid h-6 place-items-center rounded-full bg-success/20 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-success">
              New
            </span>
          </div>
          <span className="font-sans text-[15px] font-medium text-foreground">
            Tests de laboratoire avancés
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-5">
          {tests.map((t) => (
            <div key={t.k} className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-lg border border-border bg-background text-muted-foreground"
              >
                <LabIcon name={t.k} />
              </span>
              <div className="leading-tight">
                <div className="font-sans text-[15px] font-semibold text-foreground">
                  {t.k}
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t.v}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}

function LabIcon({ name }: { name: string }) {
  const s = "size-4";
  switch (name) {
    case "HPLC":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={s}>
          <path d="M3 20V5m0 15h18M6 16l3-4 3 2 4-6 3 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Endotoxine":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={s}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="16" r="3" />
          <path d="M10.5 10.5l3 3" />
        </svg>
      );
    case "TYMC":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={s}>
          <ellipse cx="8" cy="10" rx="3" ry="4" transform="rotate(-30 8 10)" />
          <ellipse cx="16" cy="14" rx="3" ry="4" transform="rotate(-30 16 14)" />
        </svg>
      );
    case "TAMC":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={s}>
          <circle cx="12" cy="12" r="2" />
          <circle cx="6" cy="7" r="1.5" />
          <circle cx="18" cy="7" r="1.5" />
          <circle cx="6" cy="17" r="1.5" />
          <circle cx="18" cy="17" r="1.5" />
        </svg>
      );
    case "Métaux lourds":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={s}>
          <path d="M8 3h8l-2 5h2l-4 7-4-7h2z" strokeLinejoin="round" />
          <path d="M9 20h6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
