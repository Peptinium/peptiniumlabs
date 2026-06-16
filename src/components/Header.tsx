import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/produits", label: "Catalogue" },
  { to: "/packs", label: "Packs recherche" },
  { to: "/etudes-scientifiques", label: "Études" },
  { to: "/calculatrice", label: "Calculatrice" },
  { to: "/a-propos", label: "Laboratoire" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-prose flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-sm bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 3v6l-5 9a3 3 0 0 0 2.6 4.5h10.8A3 3 0 0 0 20 18l-5-9V3" />
              <path d="M8 3h8" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Aetherion Labs</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Research-grade peptides
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-foreground/75 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden rounded-sm bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Demander un devis
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-sm border border-border lg:hidden"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
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
                className="border-b border-border/60 py-3 text-sm text-foreground/80 last:border-0"
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
