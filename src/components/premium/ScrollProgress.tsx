import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const h = doc.scrollHeight - doc.clientHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      style={{ background: "transparent" }}
    >
      <div
        className="h-full origin-left"
        style={{
          width: "100%",
          transform: `scaleX(${p})`,
          transition: "transform 120ms cubic-bezier(0.16,1,0.3,1)",
          background:
            "linear-gradient(90deg, var(--brand-cyan), var(--brand-blue), var(--brand-violet), var(--brand-magenta))",
          boxShadow:
            "0 0 12px color-mix(in oklab, var(--brand-violet) 55%, transparent)",
        }}
      />
    </div>
  );
}
