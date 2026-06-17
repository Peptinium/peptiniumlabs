import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-surface">
      <div className="ruo-stripe border-b border-warning/20">
        <div className="container-prose py-3.5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-warning">
          ⚠ Pour motif de recherche uniquement — Pas pour consommation humaine, vétérinaire ou thérapeutique
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
            { to: "/tester-fioles", label: "Tester ses fioles" },
          ]}
        />
        <FooterCol
          title="Laboratoire"
          links={[
            { to: "/a-propos", label: "À propos" },
            { to: "/contact", label: "Contact" },
            { to: "/support", label: "Support / SAV" },
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
          </ul>
        </div>
      </div>
      <div className="border-t border-border bg-background">
        <div className="container-prose py-10">
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              — Clause de non-responsabilité
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              En effectuant un achat sur <strong className="text-foreground">Aetherion-lab.com</strong>,
              vous reconnaissez et acceptez les conditions suivantes :
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Utilisation réservée à la recherche :</strong> Tous nos produits sont exclusivement vendus à des fins de recherche. Ils ne sont pas destinés à un usage humain, ni à des applications thérapeutiques, diagnostiques ou cliniques.</li>
              <li><strong className="text-foreground">Absence de caractère médical :</strong> Aucun des produits présentés sur notre site n'est un dispositif médical, et ils ne doivent pas être présentés ou utilisés comme tels.</li>
              <li><strong className="text-foreground">Conformité et responsabilité :</strong> L'acheteur est seul responsable du respect de l'ensemble des lois et réglementations applicables. Aetherion-lab.com ne saurait être tenu responsable en cas d'utilisation inappropriée des produits ou de tout préjudice qui en découlerait.</li>
              <li><strong className="text-foreground">Non-retour :</strong> En raison de la nature des produits que nous commercialisons, nous n'acceptons aucun retour.</li>
            </ul>
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              Votre achat implique que vous avez pris connaissance et que vous acceptez ces conditions.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-prose flex flex-col gap-2 py-5 text-[11px] text-muted-foreground sm:flex-row sm:justify-between">
          <div>© {new Date().getFullYear()} Aetherion-lab.com — Tous droits réservés.</div>
          <div className="font-mono uppercase tracking-[0.2em]">
            Réservé à la recherche · HPLC ≥ 98 %
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
