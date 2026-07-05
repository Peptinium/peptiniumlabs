import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import peptiniumLogo from "@/assets/brand/peptinium-logo.png.asset.json";

const nav = [
  { to: "/produits", label: "Catalogue" },
  { to: "/etudes-scientifiques", label: "Études" },
  { to: "/blog", label: "Journal" },
  { to: "/calculatrice", label: "Calculatrice" },
  { to: "/tester-fioles", label: "Tester" },
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
          ? "border-b border-border/60 bg-background/80 backdrop-blur-2xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:h-[72px] lg:px-10">
        {/* Left — brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-foreground lg:text-[16px]">
            <span className="brand-gradient-text font-semibold">Peptinium</span>
            <span className="ml-1 text-muted-foreground/80">Labs</span>
          </span>
        </Link>

        {/* Center — editorial nav */}
        <nav className="desktop-flex absolute left-1/2 -translate-x-1/2 items-center gap-9">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="group relative font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-1.5 lg:gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              aria-label="Espace admin"
              className="hidden items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent transition-all hover:bg-accent/20 sm:inline-flex"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l9 4.5v6c0 5-3.5 8.5-9 9.5-5.5-1-9-4.5-9-9.5v-6L12 2z" />
              </svg>
              Admin
            </Link>
          )}
          <AccountLink isLoggedIn={isLoggedIn} />
          <Link
            to="/panier"
            aria-label="Panier"
            className="group relative inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-background transition-transform hover:scale-[1.03] lg:px-5 lg:py-2.5"
          >
            <span className="hidden sm:inline">Panier</span>
            <span className="grid min-w-[18px] place-items-center rounded-full bg-background/20 px-1.5 py-0.5 text-[10px] tabular-nums">
              {count}
            </span>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mobile-grid ml-1 size-9 place-items-center rounded-full border border-border/70 text-foreground/80"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-block border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1400px] flex-col px-6 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/80 last:border-0"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent"
              >
                Espace admin
              </Link>
            )}
            <Link
              to={isLoggedIn ? "/mon-compte" : "/auth"}
              search={isLoggedIn ? undefined : { redirect: "/mon-compte" }}
              onClick={() => setOpen(false)}
              className="mt-2 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent"
            >
              {isLoggedIn ? "Mon compte" : "Connexion / Créer un compte"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function AccountLink({ isLoggedIn }: { isLoggedIn: boolean }) {
  const className =
    "inline-flex size-9 items-center justify-center rounded-full border border-border/70 text-foreground/70 transition-all hover:border-foreground hover:text-foreground";
  const icon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  if (isLoggedIn) {
    return (
      <Link to="/mon-compte" aria-label="Mon compte" className={className}>
        {icon}
      </Link>
    );
  }
  return (
    <Link to="/auth" search={{ redirect: "/mon-compte" }} aria-label="Se connecter" className={className}>
      {icon}
    </Link>
  );
}

function Logo() {
  return (
    <span className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border/70">
      <img
        src={peptiniumLogo.url}
        alt="Peptinium Labs"
        width={36}
        height={36}
        draggable={false}
        className="size-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full group-hover:transition-transform group-hover:duration-700" />
    </span>
  );
}
