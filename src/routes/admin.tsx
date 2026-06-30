import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  CreditCard,
  Warehouse,
  Users,
  HeadphonesIcon,
  Globe,
  Home,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { amIAdmin, claimAdminIfNone } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminLayout,
});

const navItems = [
  { to: "/admin" as const, label: "Commandes", icon: Package },
  { to: "/admin/paiements" as const, label: "Paiements", icon: CreditCard },
  { to: "/admin/stocks" as const, label: "Stocks", icon: Warehouse },
  { to: "/admin/clients" as const, label: "Clients", icon: Users },
  { to: "/admin/sav" as const, label: "SAV", icon: HeadphonesIcon },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [authState, setAuthState] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await amIAdmin();
        if (cancelled) return;
        setAuthState(res?.isAdmin ? "ok" : "denied");
      } catch {
        if (!cancelled) setAuthState("denied");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/admin" && currentPath === "/admin") return true;
    return currentPath.startsWith(path) && path !== "/admin";
  };

  if (authState === "checking") {
    return (
      <div className="dark flex h-[100dvh] items-center justify-center bg-background text-sm text-muted-foreground">
        Vérification de l'accès…
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="dark flex h-[100dvh] items-center justify-center bg-background px-4">

        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center">
          <h2 className="font-display text-lg font-medium">Accès administrateur</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ce compte n'a pas encore les droits d'administration. Si aucun admin
            n'existe encore sur le projet, vous pouvez revendiquer le rôle ici.
          </p>
          <button
            onClick={async () => {
              try {
                const res = await claimAdminIfNone();
                if (res?.isAdmin) {
                  setAuthState("ok");
                } else {
                  alert("Un autre administrateur existe déjà sur ce projet.");
                }
              } catch (e: any) {
                alert(e?.message ?? "Erreur");
              }
            }}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Devenir administrateur
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
          >
            <LogOut className="size-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark flex h-[100dvh] flex-col bg-background text-foreground">

      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Home className="size-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">Peptinium</h1>
            <span className="text-[10px] text-muted-foreground">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface"
            aria-label="Retour au site"
          >
            <Globe className="size-3.5" />
            <span>Site</span>
          </Link>
          <div className="flex size-8 items-center justify-center rounded-full bg-accent/20">
            <span className="text-xs font-bold text-accent">A</span>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-surface"
            aria-label="Se déconnecter"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="shrink-0 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                    active ? "bg-primary/15" : "bg-transparent"
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-medium leading-none tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <Link
            to="/admin/site-web"
            className={`flex flex-col items-center gap-0.5 px-2 py-2 transition-colors ${
              isActive("/admin/site-web")
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                isActive("/admin/site-web") ? "bg-accent/15" : "bg-transparent"
              }`}
            >
              <Globe
                className="size-[18px]"
                strokeWidth={isActive("/admin/site-web") ? 2.5 : 2}
              />
            </div>
            <span className="text-[9px] font-medium leading-none tracking-tight">
              Site Web
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
