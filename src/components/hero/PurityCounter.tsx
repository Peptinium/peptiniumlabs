import { useEffect, useState } from "react";

/**
 * Badge de pureté avec compteur animé de 0 à la valeur cible.
 */
export function PurityCounter({ target = 99.2 }: { target?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.18_0.02_270)]/12 bg-white/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[oklch(0.26_0.03_270)] shadow-[0_10px_30px_-22px_color-mix(in_oklab,var(--brand-violet)_55%,transparent)] backdrop-blur-md">
      <span className="size-1.5 animate-pulse rounded-full bg-[oklch(0.62_0.16_155)]" />
      HPLC · Pureté <span className="tabular-nums font-semibold text-[oklch(0.15_0.02_270)]">{value.toFixed(1)}%</span>
    </div>
  );
}
