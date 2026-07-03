import { useEffect, useRef } from "react";

/**
 * Ambient halo that softly follows the cursor with easing.
 * Absolutely positioned inside a `relative` parent.
 */
export function MouseHalo({
  className = "",
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.3 });
  const current = useRef({ x: 0.5, y: 0.3 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      el.style.setProperty("--mx", `${current.current.x * 100}%`);
      el.style.setProperty("--my", `${current.current.y * 100}%`);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      target.current.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      target.current.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    };

    parent.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const c = Math.min(1, Math.max(0, intensity));

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        // @ts-expect-error CSS var
        "--mx": "50%",
        "--my": "30%",
        background: `
          radial-gradient(38% 42% at var(--mx) var(--my), color-mix(in oklab, var(--brand-violet) ${22 * c}%, transparent) 0%, transparent 65%),
          radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--brand-violet) ${12 * c}%, transparent) 0%, transparent 65%),
          radial-gradient(50% 40% at 12% 25%, color-mix(in oklab, var(--brand-cyan) ${14 * c}%, transparent) 0%, transparent 60%),
          radial-gradient(50% 40% at 88% 35%, color-mix(in oklab, var(--brand-magenta) ${12 * c}%, transparent) 0%, transparent 60%)
        `,
      }}
    />
  );
}
