import { useEffect, useState } from "react";

const KEY = "aetherion_ruo_ack_v1";

export function RuoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (!window.localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const accept = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-md border border-border bg-card shadow-xl">
        <div className="ruo-stripe border-b border-warning/30 px-5 py-2 text-center font-mono text-[11px] font-semibold uppercase tracking-wider text-warning">
          ⚠ Research Use Only — RUO
        </div>
        <div className="px-6 py-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Avis avant accès au catalogue
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Les produits proposés par <strong className="text-foreground">Aetherion Labs</strong>{" "}
            sont des réactifs chimiques de qualité recherche, destinés{" "}
            <strong className="text-foreground">
              exclusivement à un usage de recherche scientifique en laboratoire
            </strong>{" "}
            (Research Use Only).
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[
              "Non destinés à un usage humain, vétérinaire, diagnostique ou thérapeutique.",
              "Non destinés à la consommation, l'ingestion ou l'injection.",
              "Manipulation réservée à un personnel qualifié, en environnement contrôlé.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-warning" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            En accédant au site, vous certifiez être un chercheur, un professionnel de laboratoire
            ou une entité de recherche, et vous engagez à respecter cette destination.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <a
              href="https://www.google.com"
              className="rounded-sm border border-border px-4 py-2 text-center text-sm text-foreground/80 hover:bg-surface"
            >
              Je refuse, quitter
            </a>
            <button
              onClick={accept}
              className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              J'accepte — usage recherche uniquement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
