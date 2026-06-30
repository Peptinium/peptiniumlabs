import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";

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
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const finish = () => navigate({ to: redirectTo, replace: true });

    const completeCallback = async () => {
      const url = new URL(window.location.href);
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      const code = url.searchParams.get("code") || hashParams.get("code");
      const tokenHash = url.searchParams.get("token_hash") || hashParams.get("token_hash");
      const type = url.searchParams.get("type") || hashParams.get("type");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      } else if (tokenHash && type) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        });
        if (verifyError) throw verifyError;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) finish();
    };

    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled && session) finish();
    });

    completeCallback().catch((e: any) => {
      if (!cancelled) setError(e?.message ?? "Lien de confirmation invalide ou expiré.");
    });

    const timeout = setTimeout(() => {
      if (!cancelled) navigate({ to: "/auth", search: { redirect: redirectTo } });
    }, 6000);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.data.subscription.unsubscribe();
    };
  }, [navigate, redirectTo]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-muted-foreground">
      <div className="max-w-md rounded-xl border border-border bg-card p-6 text-center">
        {error ? (
          <>
            <h1 className="font-display text-lg font-medium text-foreground">Lien impossible à valider</h1>
            <p className="mt-2 text-xs leading-relaxed">{error}</p>
            <button
              onClick={() => navigate({ to: "/auth", search: { redirect: redirectTo } })}
              className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground"
            >
              Retour à la connexion
            </button>
          </>
        ) : (
          "Connexion en cours…"
        )}
      </div>
    </div>
  );
}
