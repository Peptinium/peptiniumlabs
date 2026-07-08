import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import peptiniumLogo from "@/assets/brand/peptinium-logo.png.asset.json";

type NavLeaf = { to: string; label: string; description?: string };
type NavItem = { label: string; to?: string; children?: NavLeaf[] };

const nav: NavItem[] = [
  { to: "/produits", label: "Catalogue" },
  { to: "/a-propos", label: "Le laboratoire" },
  {
    label: "Recherche",
    children: [
      { to: "/blog", label: "Journal", description: "Articles & analyses" },
      { to: "/etudes-scientifiques", label: "Bibliographie", description: "Références PubMed / PMC" },
    ],
  },
  {
    label: "Outils labo",
    children: [
      { to: "/calculatrice", label: "Calculatrice", description: "Doses & reconstitution" },
      { to: "/tester-fioles", label: "Tester ses fioles", description: "Contrôle qualité" },
      { to: "/comparateur", label: "Comparateur", description: "Jusqu'à 3 peptides côte à côte" },
      { to: "/quiz", label: "Quiz labo", description: "Objectif → peptides pertinents" },
      { to: "/lot", label: "Traçabilité de lot", description: "N° de lot → CoA Janoshik" },
    ],
  },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-2xl"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[70px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        {/* Left — brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-[17px] font-medium tracking-[-0.01em] text-foreground">
            <span className="logo-gradient-text font-semibold">Peptinium</span>
            <span className="ml-1 text-muted-foreground/85">Labs</span>
          </span>
        </Link>

        {/* Center — editorial nav */}
        <nav className="desktop-flex items-center gap-9">
          {nav.map((n) =>
            n.children ? (
              <div
                key={n.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenMenu(n.label);
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openMenu === n.label}
                  className="group relative inline-flex items-center gap-1 text-[15px] font-medium text-foreground/75 transition-colors hover:text-foreground"
                >
                  {n.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${openMenu === n.label ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                </button>
                {openMenu === n.label && (
                  <div
                    className="absolute left-1/2 top-full z-50 mt-3 w-[300px] -translate-x-1/2 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur-xl"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <ul className="flex flex-col">
                      {n.children.map((c) => (
                        <li key={c.to}>
                          <Link
                            to={c.to}
                            onClick={() => setOpenMenu(null)}
                            className="block rounded-xl px-4 py-3 transition-colors hover:bg-surface"
                          >
                            <div className="text-[14px] font-medium text-foreground">{c.label}</div>
                            {c.description && (
                              <div className="mt-0.5 text-[12px] text-muted-foreground">
                                {c.description}
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={n.to}
                to={n.to!}
                className="group relative text-[15px] font-medium text-foreground/75 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ),
          )}
        </nav>

        {/* Right — round icon buttons */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              aria-label="Espace admin"
              className="hidden h-10 items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 text-[13px] font-medium text-accent transition-all hover:bg-accent/20 sm:inline-flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l9 4.5v6c0 5-3.5 8.5-9 9.5-5.5-1-9-4.5-9-9.5v-6L12 2z" />
              </svg>
              Admin
            </Link>
          )}
          <AccountPill isLoggedIn={isLoggedIn} />
          <Link
            to="/panier"
            aria-label="Panier"
            className="group relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-[13px] font-medium text-foreground transition-all hover:bg-surface"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h13l-1.5 9a2 2 0 0 1-2 1.7H9a2 2 0 0 1-2-1.7L5 4H2" />
              <circle cx="10" cy="21" r="1.3" />
              <circle cx="17" cy="21" r="1.3" />
            </svg>
            Panier
            {count > 0 && (
              <span className="grid min-w-[20px] place-items-center rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-semibold text-background">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mobile-grid ml-1 size-10 place-items-center rounded-full bg-surface text-foreground/80"
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
            {nav.map((n) =>
              n.children ? (
                <div key={n.label} className="border-b border-border/40 last:border-0">
                  <button
                    type="button"
                    onClick={() => setMobileSub(mobileSub === n.label ? null : n.label)}
                    className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-foreground/85"
                  >
                    <span>{n.label}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-transform ${mobileSub === n.label ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {mobileSub === n.label && (
                    <div className="pb-3 pl-3">
                      {n.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => {
                            setOpen(false);
                            setMobileSub(null);
                          }}
                          className="block py-2.5 text-[14px] text-muted-foreground"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={n.to}
                  to={n.to!}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/40 py-4 text-[15px] font-medium text-foreground/85 last:border-0"
                >
                  {n.label}
                </Link>
              ),
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2.5 text-[14px] font-semibold text-accent"
              >
                Espace admin
              </Link>
            )}
            <Link
              to={isLoggedIn ? "/mon-compte" : "/auth"}
              search={isLoggedIn ? undefined : { redirect: "/mon-compte" }}
              onClick={() => setOpen(false)}
              className="mt-2 py-3 text-[14px] font-medium text-accent"
            >
              {isLoggedIn ? "Mon compte" : "Connexion / Créer un compte"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


function AccountPill({ isLoggedIn }: { isLoggedIn: boolean }) {
  const cls =
    "inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-[13px] font-medium text-foreground transition-all hover:bg-surface";
  const icon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  if (isLoggedIn) {
    return (
      <Link to="/mon-compte" aria-label="Mon compte" className={cls}>
        {icon}
        Compte
      </Link>
    );
  }
  return (
    <Link to="/auth" search={{ redirect: "/mon-compte" }} aria-label="Se connecter" className={cls}>
      {icon}
      Compte
    </Link>
  );
}

function Logo() {
  return (
    <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border/70">
      <img
        src={peptiniumLogo.url}
        alt="Peptinium Labs"
        width={40}
        height={40}
        draggable={false}
        className="size-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full group-hover:transition-transform group-hover:duration-700" />
    </span>
  );
}
