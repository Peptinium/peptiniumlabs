import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Global blur-reveal effect:
 *  - On every route change, animates the <main> content with a quick blur→sharp fade-in.
 *  - Observes structural elements (sections, cards, headings, images, articles) and
 *    fades them from blurred to sharp when they scroll into view.
 * Skipped on /admin and /auth routes to keep the back-office snappy.
 */
export function useBlurReveal() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isExcluded = (path: string) =>
      path.startsWith("/admin") || path.startsWith("/auth");

    const SELECTOR = [
      "main section",
      "main article",
      "main .reveal",
      "main [data-reveal]",
      "main h1",
      "main h2",
      "main h3",
      "main > div > img",
    ].join(",");

    let observer: IntersectionObserver | null = null;

    const setup = () => {
      const path = window.location.pathname;
      if (isExcluded(path)) return;

      // Page-level blur-in on the main container
      const main = document.querySelector("main");
      if (main) {
        main.classList.remove("page-blur-in");
        // Force reflow to restart animation
        void (main as HTMLElement).offsetWidth;
        main.classList.add("page-blur-in");
      }

      // Cleanup any previous observer
      observer?.disconnect();

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );

      // Slight delay so route content has mounted
      requestAnimationFrame(() => {
        const nodes = document.querySelectorAll<HTMLElement>(SELECTOR);
        nodes.forEach((el) => {
          if (el.dataset.blurRevealSkip === "true") return;
          el.classList.add("blur-reveal");
          observer?.observe(el);
        });
      });
    };

    setup();
    const unsub = router.subscribe("onResolved", () => {
      // Wait a tick for new DOM
      setTimeout(setup, 20);
    });

    return () => {
      unsub();
      observer?.disconnect();
    };
  }, [router]);
}
