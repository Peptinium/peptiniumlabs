import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/produits", label: "Catalogue" },
  { to: "/etudes-scientifiques", label: "Études" },
  { to: "/blog", label: "Blog" },
  { to: "/calculatrice", label: "Calculatrice" },
  { to: "/tester-fioles", label: "Tester ses fioles" },
  { to: "/a-propos", label: "Laboratoire" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let adminTimer: ReturnType<typeof setTimeout> | null = null;

    const loadAdminRole = async (userId: string) => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!cancelled) setIsAdmin(!!roles);
    };

    const scheduleAdminRole = (userId: string) => {
      if (adminTimer) clearTimeout(adminTimer);
      adminTimer = setTimeout(() => {
        void loadAdminRole(userId);
      }, 0);
    };

    const checkInitialSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = error ? null : data.user;
      if (!user) {
        if (!cancelled) {
          setIsAdmin(false);
          setIsLoggedIn(false);
        }
        return;
      }
      if (!cancelled) setIsLoggedIn(true);
      scheduleAdminRole(user.id);
    };
    void checkInitialSession();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id;
      setIsLoggedIn(!!userId);
      setIsAdmin(false);
      if (userId) scheduleAdminRole(userId);
    });
    return () => {
      cancelled = true;
      if (adminTimer) clearTimeout(adminTimer);
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-2xl"
          : "border-b border-transparent bg-background/50"
      }`}
    >
      <div className="container-prose flex h-16 items-center justify-between lg:h-20">
        <Link to="/" className="group flex items-center gap-2 sm:gap-3">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-[16px] font-medium tracking-tight text-foreground sm:text-[17px] lg:text-[18px]">
              <span className="brand-gradient-text font-semibold">Peptinium</span> <span className="text-muted-foreground">Labs</span>
            </div>
            <div className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:block lg:text-[10px]">
              Peptide de Recherche
            </div>
          </div>
        </Link>

        <nav className="desktop-flex items-center gap-8">
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
          {isAdmin && (
            <Link
              to="/admin"
              aria-label="Espace admin"
              className="hidden items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition-all hover:bg-accent/20 sm:inline-flex lg:px-3.5 lg:py-2.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l9 4.5v6c0 5-3.5 8.5-9 9.5-5.5-1-9-4.5-9-9.5v-6L12 2z" />
              </svg>
              <span>Admin</span>
            </Link>
          )}
          <AccountLink isLoggedIn={isLoggedIn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lg:h-4 lg:w-4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:inline">{isLoggedIn ? "Compte" : "Connexion"}</span>
          </AccountLink>
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
            className="mobile-grid size-9 place-items-center rounded-full border border-border"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-block border-t border-border bg-background">
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
            <Link
              to={isLoggedIn ? "/mon-compte" : "/auth"}
              search={isLoggedIn ? undefined : { redirect: "/mon-compte" }}
              onClick={() => setOpen(false)}
              className="py-3.5 text-sm font-medium text-accent"
            >
              {isLoggedIn ? "Mon compte" : "Connexion / Créer un compte"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function AccountLink({ isLoggedIn, children }: { isLoggedIn: boolean; children: ReactNode }) {
  const className = "inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-xs font-medium text-foreground transition-all hover:border-accent hover:text-accent sm:size-auto sm:gap-2 sm:px-3.5 sm:py-2 lg:px-4 lg:py-2.5 lg:text-sm";
  if (isLoggedIn) {
    return (
      <Link to="/mon-compte" aria-label="Mon compte" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/auth" search={{ redirect: "/mon-compte" }} aria-label="Se connecter" className={className}>
      {children}
    </Link>
  );
}

function Logo() {
  return (
    <span className="relative grid size-11 place-items-center overflow-hidden rounded-full bg-background ring-1 ring-border lg:size-9">
      <svg viewBox="0 0 40 40" className="size-8 lg:size-7" fill="none" aria-hidden>
        <defs>
          <linearGradient id="pep-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.81 0.13 200)" />
            <stop offset="40%" stopColor="oklch(0.61 0.18 260)" />
            <stop offset="75%" stopColor="oklch(0.50 0.26 296)" />
            <stop offset="100%" stopColor="oklch(0.65 0.24 0)" />
          </linearGradient>
        </defs>
        <path
          d="M13 8h9.5a7.5 7.5 0 0 1 0 15H17v9h-4V8Zm4 4v7h5.5a3.5 3.5 0 0 0 0-7H17Z"
          fill="url(#pep-grad)"
        />
        <circle cx="10" cy="14" r="1.6" fill="url(#pep-grad)" opacity="0.85" />
        <circle cx="7.5" cy="20" r="1.1" fill="url(#pep-grad)" opacity="0.7" />
        <circle cx="30" cy="29" r="1.2" fill="url(#pep-grad)" opacity="0.75" />
      </svg>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full group-hover:transition-transform group-hover:duration-700" />
    </span>
  );
}
