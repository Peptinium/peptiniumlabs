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

      <div className="container-prose py-6">
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
          {tabs.map((t) => {
            const active = isActive(t.to, t.exact);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm ${
                  active
                    ? "bg-accent text-accent-foreground"
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
