import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Package, User, Mail, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/mon-compte")({
  head: () => ({
    meta: [
      { title: "Mon compte — Peptinium Labs" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MonCompteLayout,
});

const tabs = [
  { to: "/mon-compte" as const, label: "Commandes", icon: Package, exact: true },
  { to: "/mon-compte/profil" as const, label: "Profil", icon: User },
  { to: "/mon-compte/contact" as const, label: "Contact", icon: Mail },
];

function MonCompteLayout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const path = loc.pathname.replace(/\/$/, "");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid) return;
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (!cancelled) setIsAdmin(!!role);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <SiteLayout showRuoModal={false}>
      <div className="border-b border-border bg-surface">
        <div className="container-prose py-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            — Espace client
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-medium">Mon compte</h1>
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition-all hover:bg-accent/20"
                >
                  <ShieldCheck className="size-3.5" />
                  Espace admin
                </Link>
              )}
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/" });
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:border-accent"
              >
                <LogOut className="size-3.5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-prose py-6">
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
          {tabs.map((t) => {
            const active = isActive(t.to, t.exact);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                style={active ? { background: "var(--gradient-brand)" } : undefined}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm ${
                  active
                    ? "text-white shadow-[0_6px_20px_-8px_color-mix(in_oklab,var(--brand-violet)_60%,transparent)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {t.label}
              </Link>
            );
          })}
        </div>
        <Outlet />
      </div>
    </SiteLayout>
  );
}
