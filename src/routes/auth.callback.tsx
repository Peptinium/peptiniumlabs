import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session) navigate({ to: "/mon-compte" });
    });
    // Fallback if session already present
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) navigate({ to: "/mon-compte" });
    });
    const timeout = setTimeout(() => {
      if (!cancelled) navigate({ to: "/auth" });
    }, 4000);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.data.subscription.unsubscribe();
    };
  }, [navigate]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
      Connexion en cours…
    </div>
  );
}
