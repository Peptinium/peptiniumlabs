import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Peptinium Labs — Réactifs peptidiques de recherche (RUO)" },
      {
        name: "description",
        content:
          "Peptinium Labs : peptides synthétiques de qualité recherche, pureté ≥ 99 % HPLC, livrés avec CoA. Réservés strictement à la recherche scientifique en laboratoire (RUO).",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:site_name", content: "Peptinium Labs" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Peptinium Labs — Réactifs peptidiques de recherche (RUO)" },
      {
        property: "og:description",
        content:
          "Peptides synthétiques HPLC ≥ 99 % pour laboratoires de recherche. Research Use Only.",
      },
      { property: "og:url", content: "https://peptinium.com" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Peptinium Labs — Réactifs peptidiques de recherche (RUO)" },
      { name: "twitter:description", content: "Peptides synthétiques HPLC ≥ 99 % pour laboratoires de recherche. Research Use Only." },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Peptinium Labs" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9ed2c78-d213-45e4-b7a8-2716d2a14945/id-preview-7681a0b9--ea176868-e777-4e2b-ab6f-cbfa2298cd94.lovable.app-1782775198357.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9ed2c78-d213-45e4-b7a8-2716d2a14945/id-preview-7681a0b9--ea176868-e777-4e2b-ab6f-cbfa2298cd94.lovable.app-1782775198357.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://peptinium.com" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon-64.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192x192.png" },
      { rel: "apple-touch-icon", href: "/icon-192x192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <PageViewTracker />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </QueryClientProvider>
  );
}

function PageViewTracker() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const KEY = "ae_sid";
    let sid = sessionStorage.getItem(KEY);
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(KEY, sid);
    }
    let lastPath = "";
    const send = (path: string) => {
      if (path === lastPath) return;
      if (path.startsWith("/admin") || path.startsWith("/auth") || path.startsWith("/api/")) return;
      lastPath = path;
      const ref = lastPath === path ? "" : document.referrer;
      fetch("/api/public/track", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          path,
          referrer: ref || null,
          sessionId: sid,
        }),
      }).catch(() => {});
    };
    send(window.location.pathname);
    const unsub = router.subscribe("onResolved", (e) => {
      send(e.toLocation.pathname);
    });
    return () => unsub();
  }, [router]);
  return null;
}

