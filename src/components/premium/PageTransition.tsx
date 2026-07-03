import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Apple-style page fade + subtle scale on route change.
 * Keeps the previous frame long enough to cross-fade.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [key, setKey] = useState(pathname);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === key) return;
    setPhase("out");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setKey(pathname);
      setPhase("in");
    }, 220);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pathname, key]);

  return (
    <div
      key={key}
      style={{
        opacity: phase === "in" ? 1 : 0,
        transform: phase === "in" ? "translateY(0) scale(1)" : "translateY(6px) scale(0.995)",
        transition:
          "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 480ms cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
