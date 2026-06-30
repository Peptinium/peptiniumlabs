import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — Peptinium Labs" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Les mots de passe ne correspondent pas.",
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setHasSession(!!data.session);
    });
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setHasSession(!!session);
    });
    return () => {
      cancelled = true;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const parsed = schema.parse({ password, confirm });
      const { error } = await supabase.auth.updateUser({ password: parsed.password });
      if (error) throw error;
      setNotice("Mot de passe mis à jour. Redirection…");
      setTimeout(() => navigate({ to: "/" }), 1200);
    } catch (e: any) {
      if (e instanceof z.ZodError) setError(e.errors[0]?.message ?? "Erreur");
      else setError(e?.message ?? "Impossible de mettre à jour le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout showRuoModal={false}>
      <section className="container-prose flex min-h-[60vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 sm:p-8">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">— Sécurité</div>
            <h1 className="mt-2 font-display text-2xl font-medium">Nouveau mot de passe</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Choisissez un mot de passe d'au moins 6 caractères.
            </p>
          </div>

          {hasSession === false ? (
            <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
              Lien invalide ou expiré. Demandez un nouveau lien depuis « Mot de passe oublié ».
              <button
                onClick={() => navigate({ to: "/auth" })}
                className="mt-3 block w-full rounded-lg bg-accent px-4 py-2 text-center text-xs font-medium text-accent-foreground"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="rp-pw" className="text-xs font-medium text-foreground">Nouveau mot de passe</label>
                <input
                  id="rp-pw"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="rp-pw2" className="text-xs font-medium text-foreground">Confirmer</label>
                <input
                  id="rp-pw2"
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">{error}</div>
              )}
              {notice && (
                <div className="rounded-lg border border-success/40 bg-success/5 p-3 text-xs text-success">{notice}</div>
              )}
              <button
                type="submit"
                disabled={loading || hasSession === null}
                className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {loading ? "Mise à jour…" : "Définir le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
