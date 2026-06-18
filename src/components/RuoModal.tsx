import { useEffect, useState } from "react";

const KEY = "aetherion_ruo_ack_v2";

export function RuoModal() {
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(false);
  const [research, setResearch] = useState(false);
  const [noHealth, setNoHealth] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (!window.localStorage.getItem(KEY)) {
        const t = setTimeout(() => setOpen(true), 350);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const canAccept = age && research && noHealth;

  const accept = () => {
    if (!canAccept) return;
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/55 p-4 backdrop-blur-md sm:items-center"
      style={{ animation: "fade-in 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        style={{ animation: "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="relative overflow-hidden border-b border-border bg-foreground text-background">
          <div className="relative z-10 flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-background/80">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              Vérification d'accès — Laboratoire
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              Recherche uniquement
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-30 grid-bg" />
        </div>
        <div className="px-7 py-7">
          <h2 className="font-display text-xl font-medium tracking-tight">
            Certification d'usage recherche
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Avant d'accéder au site, merci de confirmer les points suivants. Les produits de{" "}
            <strong className="text-foreground">aetherion-lab.com</strong> sont des réactifs
            chimiques destinés exclusivement à la recherche scientifique en laboratoire.
          </p>

          <div className="mt-6 space-y-3">
            <Check
              checked={age}
              onChange={setAge}
              label="Je certifie avoir plus de 18 ans et être un professionnel, chercheur ou membre d'une entité de recherche."
            />
            <Check
              checked={research}
              onChange={setResearch}
              label="Je certifie utiliser ces peptides uniquement à des fins de recherche scientifique in vitro, sans usage vétérinaire ou thérapeutique."
            />
            <Check
              checked={noHealth}
              onChange={setNoHealth}
              label="Je comprends qu'aucune recommandation de santé n'est formulée : les peptides vendus sont strictement destinés à la recherche et ne sont approuvés par aucun organisme de santé (ANSM, EMA, FDA, etc.)."
            />
          </div>

          <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <a
              href="https://www.google.com"
              className="rounded-full border border-border px-5 py-2.5 text-center text-sm text-foreground/70 transition-colors hover:bg-surface"
            >
              Je refuse
            </a>
            <button
              onClick={accept}
              disabled={!canAccept}
              className={`group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-background transition-all ${
                canAccept
                  ? "bg-foreground hover:bg-foreground/90"
                  : "cursor-not-allowed bg-foreground/40"
              }`}
            >
              <span className="relative z-10">J'accepte et j'entre</span>
              {canAccept && (
                <span className="absolute inset-y-0 left-0 w-12 -translate-x-full bg-accent/40 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-3.5 transition-colors hover:border-accent/50">
      <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute size-4 cursor-pointer opacity-0"
        />
        <span
          className={`size-4 rounded border transition-all ${
            checked ? "border-foreground bg-foreground" : "border-border bg-background"
          }`}
        />
        {checked && (
          <svg
            viewBox="0 0 12 12"
            className="absolute size-3 text-background"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 6.5 5 9.5 10 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-xs leading-relaxed text-foreground/85">{label}</span>
    </label>
  );
}
