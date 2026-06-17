import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-surface">
      <div className="ruo-stripe border-b border-warning/20">
        <div className="container-prose py-3.5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-warning">
          ⚠ Research Use Only — Réservé à la recherche scientifique en laboratoire · Aucun usage
          humain, vétérinaire ou thérapeutique
        </div>
      </div>
      <div className="container-prose grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-foreground text-background">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 3v6.5L4.2 17.2A3 3 0 0 0 6.7 22h10.6a3 3 0 0 0 2.5-4.8L15 9.5V3" />
                <path d="M8.5 3h7" />
              </svg>
            </span>
            <div className="font-display text-base font-medium">
              Aetherion <span className="text-accent">Labs</span>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Fournisseur de réactifs peptidiques de qualité recherche pour laboratoires académiques,
            CRO et instituts. Validation HPLC et spectrométrie de masse, Certificat d'Analyse
            (CoA) systématique.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            QC Lab actif — lots audités quotidiennement
          </div>
        </div>

        <FooterCol
          title="Catalogue"
          links={[
            { to: "/produits", label: "Toutes les références" },
            { to: "/calculatrice", label: "Calculatrice de dilution" },
            { to: "/etudes-scientifiques", label: "Bibliographie PubMed" },
          ]}
        />
        <FooterCol
          title="Laboratoire"
          links={[
            { to: "/a-propos", label: "À propos" },
            { to: "/contact", label: "Contact" },
            { to: "/mentions-legales", label: "Mentions légales" },
            { to: "/cgv", label: "CGV" },
          ]}
        />
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
            Qualité
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><Tick /> HPLC en phase inverse ≥ 98 %</li>
            <li className="flex items-center gap-2"><Tick /> Spectrométrie de masse (MS)</li>
            <li className="flex items-center gap-2"><Tick /> CoA fourni avec chaque lot</li>
            <li className="flex items-center gap-2"><Tick /> Flacons verre type I borosilicate</li>
            <li className="flex items-center gap-2"><Tick /> Chaîne du froid −20 °C</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-prose flex flex-col gap-2 py-5 text-[11px] text-muted-foreground sm:flex-row sm:justify-between">
          <div>© {new Date().getFullYear()} Aetherion Labs — Tous droits réservés.</div>
          <div className="font-mono uppercase tracking-[0.2em]">
            RUO · ISO-friendly QC · HPLC ≥ 98 %
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div className="md:col-span-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5 text-xs">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="link-underline text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tick() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="text-accent">
      <path d="M1 5l2.5 2.5L9 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
