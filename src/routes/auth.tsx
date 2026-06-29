import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion admin — Peptinium Labs" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e: any) {
      setError(e?.message ?? "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="container-prose flex min-h-[60vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 sm:p-8">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Espace administrateur
            </div>
            <h1 className="mt-2 font-display text-2xl font-medium">
              {mode === "signin" ? "Connexion" : "Créer un compte admin"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Accès réservé à la gestion des commandes et du stock.
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {loading
                ? "Connexion…"
                : mode === "signin"
                  ? "Se connecter"
                  : "Créer le compte"}
            </button>

            <div className="relative my-2 text-center">
              <span className="bg-card px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                ou
              </span>
            </div>

            <button
              type="button"
              onClick={async () => {
                setError(null);
                const result = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin + "/admin",
                });
                if (result.error) {
                  setError(result.error.message ?? "Erreur Google");
                  return;
                }
                if (result.redirected) return;
                navigate({ to: "/admin" });
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              {mode === "signin"
                ? "Premier accès ? Créer un compte admin"
                : "Déjà un compte ? Se connecter"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
