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
  const [error, setError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string>("/mon-compte");
  useEffect(() => {
    let cancelled = false;

    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
    const type = url.searchParams.get("type") || hashParams.get("type");
    const isRecovery = type === "recovery" || search.redirect === "/reset-password";

    // Recovery: hop straight to /reset-password (keep the hash so supabase
    // can consume the recovery token there and emit PASSWORD_RECOVERY).
    if (isRecovery) {
      window.location.replace(`/reset-password${window.location.hash || ""}`);
      return;
    }

    const target = isSafePath(search.redirect) ? search.redirect : "/mon-compte";
    setRedirectTo(target);
    const finish = () => navigate({ to: target, replace: true });

    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled && session) finish();
    });

    const completeCallback = async () => {
      const { data: existing } = await supabase.auth.getSession();
      if (existing.session) {
        finish();
        return;
      }

      const code = url.searchParams.get("code") || hashParams.get("code");
      const tokenHash = url.searchParams.get("token_hash") || hashParams.get("token_hash");

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } catch {
          // Broker may have already consumed the code; rely on onAuthStateChange.
        }
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

    completeCallback().catch((e: any) => {
      if (!cancelled) setError(e?.message ?? "Lien de confirmation invalide ou expiré.");
    });

    // Fallback: if no session after 10s, surface a retry button (do not bounce back to /auth).
    const timeout = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled && !data.session) {
        setError("La session n'a pas pu être établie. Réessayez la connexion.");
      }
    }, 10000);
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
