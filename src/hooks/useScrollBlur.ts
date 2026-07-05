import { useEffect } from "react";

/**
 * Vela-style scroll blur: elements tagged `data-reveal-blur` are blurred when
 * they enter the viewport from the bottom, and progressively sharpen as they
 * rise toward eye-level (the vertical middle of the viewport). Once past the
 * middle, they stay perfectly sharp. Driven by scroll position via a single
 * rAF loop for smoothness.
 */
export function useRevealBlur() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      document.querySelectorAll<HTMLElement>("[data-reveal-blur]").forEach((el) => {
        el.style.setProperty("--reveal-p", "1");
        el.setAttribute("data-reveal-blur", "in");
      });
      return;
    }

    let targets: HTMLElement[] = [];
    let ticking = false;

    const collect = () => {
      targets = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal-blur]")
      );
    };

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      // "Eye level" ~ 42% down the viewport; below is blurred, above stays sharp.
      const eye = vh * 0.42;
      const start = vh * 0.98; // just above the fold bottom, blur begins here

      for (const el of targets) {
        const rect = el.getBoundingClientRect();
        // Fully off-screen (below or well above) → skip cheap
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        const center = rect.top + rect.height / 2;
        let p: number;
        if (center <= eye) p = 1;
        else if (center >= start) p = 0;
        else p = 1 - (center - eye) / (start - eye);
        // Smooth easing (easeOutCubic)
        const eased = 1 - Math.pow(1 - p, 3);
        el.style.setProperty("--reveal-p", eased.toFixed(3));
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    collect();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const handleRescan = () => {
      collect();
      update();
    };
    window.addEventListener("reveal-blur:rescan", handleRescan);

    // MutationObserver picks up dynamically inserted sections
    const mo = new MutationObserver(() => {
      collect();
      onScroll();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("reveal-blur:rescan", handleRescan);
      mo.disconnect();
    };
  }, []);
}
