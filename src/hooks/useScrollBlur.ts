import { useEffect } from "react";

/**
 * Vela-style momentary scroll blur:
 * blur intensifies with scroll velocity, then relaxes back to 0 when the
 * user stops. Applied via CSS var `--scroll-blur` on <html>.
 */
export function useScrollBlur({ max = 6, decay = 0.82 } = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let blur = 0;
    let raf = 0;
    let active = false;

    const tick = () => {
      blur *= decay;
      if (blur < 0.05) {
        blur = 0;
        root.style.setProperty("--scroll-blur", "0px");
        active = false;
        return;
      }
      root.style.setProperty("--scroll-blur", `${blur.toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const dy = Math.abs(window.scrollY - lastY);
      const velocity = dy / dt; // px per ms
      lastY = window.scrollY;
      lastT = now;

      // Map velocity to blur (cap at max px)
      const target = Math.min(max, velocity * 3.2);
      if (target > blur) blur = target;

      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      root.style.setProperty("--scroll-blur", "0px");
    };
  }, [max, decay]);
}
