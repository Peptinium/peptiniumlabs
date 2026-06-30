import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

function isSafePath(p: string | undefined): p is string {
  return !!p && p.startsWith("/") && !p.startsWith("//");
}

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/callback" });
  const redirectTo = isSafePath(search.redirect) ? search.redirect : "/mon-compte";
  useEffect(() => {
    let cancelled = false;
    const finish = () => navigate({ to: redirectTo });
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session) finish();
    });
    // Fallback if session already present
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) finish();
    });
    const timeout = setTimeout(() => {
      if (!cancelled) navigate({ to: "/auth", search: { redirect: redirectTo } });
    }, 4000);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.data.subscription.unsubscribe();
    };
  }, [navigate, redirectTo]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
      Connexion en cours…
    </div>
  );
}
