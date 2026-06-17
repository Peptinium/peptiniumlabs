import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const nav = [
  { to: "/produits", label: "Catalogue" },
  { to: "/etudes-scientifiques", label: "Études" },
  { to: "/calculatrice", label: "Calculatrice" },
  { to: "/tester-fioles", label: "Tester ses fioles" },
  { to: "/a-propos", label: "Laboratoire" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background/0"
      }`}
    >
      <div className="container-prose flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-medium tracking-tight">
              Aetherion <span className="text-accent">Labs</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Research-grade peptides
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-underline text-[13px] text-foreground/70 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="group relative hidden overflow-hidden rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-all hover:bg-foreground/90 sm:inline-flex"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Devis labo
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5h8m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="absolute inset-y-0 left-0 w-12 -translate-x-full bg-accent/40 blur-md transition-transform duration-700 group-hover:translate-x-[280%]" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-border lg:hidden"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-prose flex flex-col py-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3.5 text-sm text-foreground/80 last:border-0"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-foreground text-background">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 3v6.5L4.2 17.2A3 3 0 0 0 6.7 22h10.6a3 3 0 0 0 2.5-4.8L15 9.5V3" />
        <path d="M8.5 3h7" />
        <circle cx="13.5" cy="15" r="0.8" fill="currentColor" />
        <circle cx="10.5" cy="18" r="0.6" fill="currentColor" />
      </svg>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/40 to-transparent group-hover:translate-x-full group-hover:transition-transform group-hover:duration-700" />
    </span>
  );
}
