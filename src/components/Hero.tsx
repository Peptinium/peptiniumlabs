import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const lastScrollRef = useRef(-1);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const totalHeight = rect.height - viewportHeight;
        const scrolled = -rect.top;
        const raw = Math.max(0, Math.min(1, scrolled / totalHeight));
        if (raw !== lastScrollRef.current) {
          lastScrollRef.current = raw;
          setProgress(raw);
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const p = clamp01;
  const stage = (threshold: number) => p(progress / threshold);

  const glow = stage(0.12);
  const glass = stage(0.22);
  const powder = stage(0.35);
  const cap = stage(0.5);
  const label = stage(0.65);
  const text = stage(0.8);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-background">
        {/* Atmospheric background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.62_0.14_260/0.18)_0%,transparent_70%)] blur-3xl"
            style={{ opacity: 0.6 + glow * 0.4 }}
          />
          <div className="absolute bottom-0 left-1/2 h-[500px] w-full max-w-4xl -translate-x-1/2 bg-gradient-to-t from-cyan-200/25 via-blue-100/20 to-transparent" />
          <div className="absolute left-1/4 top-1/3 h-2 w-2 rounded-full bg-blue-500/40 blur-[2px]" />
          <div className="absolute bottom-1/4 right-1/3 h-3 w-3 rounded-full bg-purple-500/35 blur-[3px]" />
          <div className="absolute right-1/4 top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-500/55 blur-[1px]" />
        </div>

        {/* Central vial assembly */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          <div className="relative flex flex-col items-center">
            {/* Vial halo */}
            <div
              className="pointer-events-none absolute -inset-16 z-0 rounded-full bg-[radial-gradient(circle,oklch(0.62_0.16_260/0.28)_0%,transparent_70%)] blur-2xl"
              style={{ opacity: 0.6 + glow * 0.4 }}
            />

            <div
              className="relative z-10 flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - glass) * 20}px) scale(${0.94 + glass * 0.06})`,
                transition: "transform 0.3s ease-out",
                filter: "drop-shadow(0 32px 70px oklch(0.50 0.09 260 / 0.28))",
              }}
            >
              <svg
                width="260"
                height="420"
                viewBox="0 0 220 360"
              >
                <defs>
                  <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
                    <stop offset="50%" stopColor="rgba(240,246,255,0.75)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.88)" />
                  </linearGradient>
                  <linearGradient id="glassInner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.94 0.02 250 / 0.35)" />
                    <stop offset="100%" stopColor="oklch(0.92 0.03 250 / 0.45)" />
                  </linearGradient>
                  <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="40%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="60%" stopColor="rgba(255,255,255,0.45)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                  <linearGradient id="capSilver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="40%" stopColor="#f8fafc" />
                    <stop offset="60%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  <linearGradient id="powderGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="70%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.92)" />
                  </linearGradient>
                  <linearGradient id="labelBrand" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>

                {/* Vial shadow */}
                <ellipse
                  cx="110"
                  cy="340"
                  rx="60"
                  ry="8"
                  fill="oklch(0.45 0.06 260 / 0.3)"
                  style={{ opacity: glass }}
                />

                {/* Glass body */}
                <g style={{ transition: "opacity 0.4s ease" }}>
                  <path
                    d="M70 110 L70 300 Q70 330 110 330 Q150 330 150 300 L150 110 Z"
                    fill="url(#glassInner)"
                    stroke="oklch(0.60 0.04 250 / 0.5)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M70 110 L70 300 Q70 330 110 330 Q150 330 150 300 L150 110 Z"
                    fill="url(#glassBody)"
                    stroke="oklch(0.65 0.03 250 / 0.6)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M80 120 L80 290 Q80 310 110 310 Q140 310 140 290 L140 120 Z"
                    fill="url(#glassShine)"
                    opacity="0.9"
                  />
                  <path
                    d="M72 115 L72 300 Q72 325 110 325 Q148 325 148 300 L148 115 Z"
                    fill="none"
                    stroke="oklch(0.55 0.04 250 / 0.28)"
                    strokeWidth="1"
                  />
                </g>

                {/* Lyophilized powder */}
                <g
                  style={{
                    transform: `translateY(${(1 - powder) * 30}px)`,
                    transition: "transform 0.4s ease",
                  }}
                >
                  <path
                    d="M75 300 Q75 315 110 318 Q145 315 145 300 L145 290 Q110 300 75 290 Z"
                    fill="url(#powderGrad)"
                    stroke="oklch(0.80 0.02 250 / 0.25)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M78 292 Q110 300 142 292 Q140 305 110 308 Q80 305 78 292 Z"
                    fill="rgba(255,255,255,0.98)"
                  />
                </g>

                {/* Crimp cap */}
                <g
                  style={{
                    transform: `translateY(${(1 - cap) * -50}px)`,
                    transition: "transform 0.4s ease",
                  }}
                >
                  <rect x="68" y="100" width="84" height="12" rx="2" fill="#94a3b8" />
                  <rect x="70" y="85" width="80" height="20" rx="3" fill="url(#capSilver)" />
                  <rect x="70" y="80" width="80" height="8" rx="2" fill="#f1f5f9" />
                  <ellipse cx="110" cy="80" rx="40" ry="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="80" y="86" width="20" height="1" rx="0.5" fill="rgba(255,255,255,0.8)" />
                  <rect x="120" y="86" width="10" height="1" rx="0.5" fill="rgba(255,255,255,0.4)" />
                </g>

                {/* Premium label */}
                <g
                  style={{
                    transform: `translateX(${(1 - label) * -120}px)`,
                    transition: "transform 0.5s ease",
                  }}
                >
                  <rect x="55" y="165" width="110" height="80" rx="4" fill="white" stroke="oklch(0.75 0.02 240)" strokeWidth="1" />
                  <text x="110" y="185" textAnchor="middle" fontSize="8" fill="#475569" fontFamily="sans-serif" letterSpacing="2">
                    PEPTINIUM LABS
                  </text>
                  <rect x="90" y="192" width="40" height="2" rx="1" fill="url(#labelBrand)" />
                  <text x="110" y="215" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
                    PEPTIDE
                  </text>
                  <text x="110" y="232" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="sans-serif" letterSpacing="1">
                    RESEARCH USE ONLY
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Headline section */}
          <div
            className="relative z-20 mt-14 text-center"
            style={{
              transform: `translateY(${(1 - text) * 40}px)`,
              transition: "transform 0.5s ease",
            }}
          >
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Engineering{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_oklch(0.62_0.14_260/0.18)]">
                Cellular Precision
              </span>
            </h1>
            <div className="mt-6 flex items-center justify-center gap-4 font-mono text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
              <span>Pure Formulation</span>
              <div className="h-1 w-1 rounded-full bg-primary/60" />
              <span>Clinical Grade</span>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/produits"
                className="group relative overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:shadow-[0_0_30px_oklch(0.55_0.12_260/0.18)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explorer le catalogue
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </Link>
              <Link
                to="/etudes-scientifiques"
                className="rounded-full border border-border bg-surface px-8 py-4 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-surface-2 hover:border-primary/30"
              >
                Bibliographie PubMed
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: 1 - progress * 2.5 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll to assemble</span>
          <div className="h-12 w-px bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
