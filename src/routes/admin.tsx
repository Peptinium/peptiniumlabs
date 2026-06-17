import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Package,
  CreditCard,
  Warehouse,
  Users,
  HeadphonesIcon,
  Globe,
  Home,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems = [
  { to: "/admin/commandes" as const, label: "Commandes", icon: Package },
  { to: "/admin/paiements" as const, label: "Paiements", icon: CreditCard },
  { to: "/admin/stocks" as const, label: "Stocks", icon: Warehouse },
  { to: "/admin/clients" as const, label: "Clients", icon: Users },
  { to: "/admin/sav" as const, label: "SAV", icon: HeadphonesIcon },
];

function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/admin" && currentPath === "/admin") return true;
    return currentPath.startsWith(path) && path !== "/admin";
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Home className="size-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">Aetherion</h1>
            <span className="text-[10px] text-muted-foreground">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-accent/20">
            <span className="text-xs font-bold text-accent">A</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
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
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
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

          {/* Site Web — bouton distinct à droite */}
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
