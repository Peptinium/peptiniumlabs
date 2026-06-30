import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Connexion — Peptinium Labs" },
      { name: "description", content: "Connectez-vous pour suivre vos commandes et vos tickets SAV." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function isSafePath(p: string | undefined): p is string {
  return !!p && p.startsWith("/") && !p.startsWith("//");
}

const authFormSchema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(72),
});

const signupFormSchema = authFormSchema
  .extend({ confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas.",
  });

function authMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (lower.includes("email not confirmed")) {
    return "Votre email n'est pas encore confirmé. Ouvrez le mail Peptinium Labs reçu après l'inscription.";
  }
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "Un compte existe déjà avec cette adresse. Connectez-vous ou utilisez Google.";
  }
  if (lower.includes("signup is disabled")) {
    return "La création de compte est temporairement indisponible. Réessayez dans quelques minutes.";
  }
  return message || "Erreur d'authentification";
}

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const redirectTo = isSafePath(search.redirect) ? search.redirect : "/";

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === "forgot") {
        const parsed = z.object({ email: z.string().trim().email("Adresse email invalide").max(255) }).parse({ email });
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.email, {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent("/reset-password")}`,
        });
        if (error) throw error;
        setNotice(
          "Email de réinitialisation envoyé. Cliquez sur le lien Peptinium Labs reçu (vérifiez vos spams) pour définir un nouveau mot de passe.",
        );
        return;
      }
      if (mode === "signup") {
        const parsed = signupFormSchema.parse({ email, password, confirmPassword });
        const { data, error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: redirectTo });
          return;
        }
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setError("Un compte existe déjà avec cette adresse. Connectez-vous, ou utilisez « Mot de passe oublié ».");
          setMode("signin");
          setPassword("");
          setConfirmPassword("");
          return;
        }
        setPassword("");
        setConfirmPassword("");
        setNotice(
          "Compte créé. Un email Peptinium Labs vient d'être envoyé : cliquez sur « Confirmer mon email » pour activer votre compte. Pensez à vérifier vos spams.",
        );
        return;
      }
      const parsed = authFormSchema.parse({ email, password });
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parsed.email,
        password: parsed.password,
      });
      if (error) throw error;
      if (!data.session) throw new Error("Connexion incomplète, réessayez dans quelques secondes.");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Session en cours d'activation, réessayez dans quelques secondes.");
      }
      navigate({ to: redirectTo });
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0]?.message ?? "Vérifiez les informations saisies.");
      } else {
        setError(authMessage(e?.message ?? "Erreur d'authentification"));
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <SiteLayout showRuoModal={false}>
      <section className="container-prose flex min-h-[60vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 sm:p-8">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Espace client
            </div>
            <h1 className="mt-2 font-display text-2xl font-medium">
              {mode === "signin" ? "Connexion" : mode === "signup" ? "Créer un compte" : "Mot de passe oublié"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "forgot"
                ? "Recevez un lien pour définir un nouveau mot de passe."
                : "Suivez vos commandes, factures et tickets SAV."}
            </p>
          </div>

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="auth-email" className="text-xs font-medium text-foreground">Email</label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password" className="text-xs font-medium text-foreground">Mot de passe</label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); setError(null); setNotice(null); }}
                      className="text-[11px] text-accent hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
            )}
            {mode === "signup" && (
              <div>
                <label htmlFor="auth-password-confirm" className="text-xs font-medium text-foreground">Confirmer le mot de passe</label>
                <input
                  id="auth-password-confirm"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                {error}
              </div>
            )}
            {notice && (
              <div className="rounded-lg border border-success/40 bg-success/5 p-3 text-xs text-success">
                {notice}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {loading
                ? "…"
                : mode === "signin"
                ? "Se connecter"
                : mode === "signup"
                ? "Créer le compte"
                : "Envoyer le lien"}
            </button>

            {mode !== "forgot" && (
              <>
                <div className="relative my-2 text-center">
                  <span className="bg-card px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    ou
                  </span>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setNotice(null);
                    setLoading(true);
                    try {
                      const result = await lovable.auth.signInWithOAuth("google", {
                        redirect_uri: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
                      });
                      if (result.error) {
                        setError(result.error.message ?? "Erreur Google");
                        setLoading(false);
                        return;
                      }
                      if (result.redirected) return;
                      const { data } = await supabase.auth.getUser();
                      if (data.user) navigate({ to: redirectTo });
                      else setError("Connexion Google incomplète, réessayez dans quelques secondes.");
                    } catch (e: any) {
                      setError(authMessage(e?.message ?? "Erreur Google"));
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted disabled:opacity-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continuer avec Google
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setNotice(null);
                setConfirmPassword("");
              }}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              {mode === "forgot"
                ? "← Retour à la connexion"
                : mode === "signin"
                ? "Pas encore de compte ? Créer un compte"
                : "Déjà un compte ? Se connecter"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
