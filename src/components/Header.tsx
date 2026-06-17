import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

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
  const { count } = useCart();

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
      <div className="container-prose flex h-16 items-center justify-between lg:h-20">
        <Link to="/" className="group flex items-center gap-3">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-medium tracking-tight lg:text-[18px]">
              Aetherion <span className="text-accent">Labs</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground lg:text-[10px]">
              Peptide de Recherche
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-underline text-[15px] font-medium text-foreground/70 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/panier"
            aria-label="Panier"
            className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-all hover:border-accent hover:text-accent lg:px-4 lg:py-2.5 lg:text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lg:h-4 lg:w-4">
              <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h9.7a2 2 0 0 0 2-1.6L23 8H6" />
              <circle cx="10" cy="21" r="1.4" />
              <circle cx="18" cy="21" r="1.4" />
            </svg>
            <span className="hidden sm:inline">Panier</span>
            {count > 0 && (
              <span className="ml-0.5 grid min-w-[18px] place-items-center rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold text-background">
                {count}
              </span>
            )}
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
