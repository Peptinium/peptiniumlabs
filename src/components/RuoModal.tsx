import { useEffect, useState } from "react";

const KEY = "aetherion_ruo_ack_v1";

export function RuoModal() {
  const [open, setOpen] = useState(false);

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

  const accept = () => {
    try { window.localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 backdrop-blur-md sm:items-center"
         style={{ animation: "fade-in 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        style={{ animation: "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="relative overflow-hidden border-b border-border bg-foreground text-background">
          <div className="relative z-10 flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-background/80">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              Pré-accès laboratoire
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              RUO
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-30 grid-bg" />
        </div>
        <div className="px-7 py-7">
          <h2 className="font-display text-xl font-medium tracking-tight">
            Confirmation d'usage recherche
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Les produits proposés par <strong className="text-foreground">Aetherion Labs</strong> sont
            des réactifs chimiques destinés{" "}
            <strong className="text-foreground">
              exclusivement à un usage de recherche scientifique en laboratoire
            </strong>{" "}
            (Research Use Only).
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            {[
              "Non destinés à un usage humain, vétérinaire, diagnostique ou thérapeutique.",
              "Non destinés à la consommation, l'ingestion ou l'injection.",
              "Manipulation réservée à un personnel qualifié, en environnement contrôlé.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">
            En accédant au site, vous certifiez être un chercheur, un professionnel de laboratoire
            ou une entité de recherche, et vous engagez à respecter cette destination.
          </p>
          <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <a
              href="https://www.google.com"
              className="rounded-full border border-border px-5 py-2.5 text-center text-sm text-foreground/70 transition-colors hover:bg-surface"
            >
              Je refuse
            </a>
            <button
              onClick={accept}
              className="group relative overflow-hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <span className="relative z-10">J'accepte — usage recherche uniquement</span>
              <span className="absolute inset-y-0 left-0 w-12 -translate-x-full bg-accent/40 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
