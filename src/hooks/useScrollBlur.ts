import { useEffect } from "react";

/**
 * Vela-style reveal blur: any element with `data-reveal-blur` enters the
 * viewport blurred + slightly offset, then transitions sharp when visible.
 * Idempotent — safe to mount on multiple pages.
 */
export function useRevealBlur() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal-blur]");
    if (!targets.length) return;

    if (reduce) {
      targets.forEach((el) => el.setAttribute("data-reveal-blur", "in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-reveal-blur", "in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
