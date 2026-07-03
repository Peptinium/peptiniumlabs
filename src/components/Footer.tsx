import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface lg:mt-32">
      <div className="ruo-stripe border-b border-warning/10">
        <div className="container-prose py-4 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-warning lg:py-3.5 lg:text-[10px] lg:tracking-[0.22em]">
          ⚠ Pour motif de recherche uniquement — Pas pour usage vétérinaire, diagnostique ou thérapeutique
        </div>
      </div>
      <div className="container-prose grid gap-9 py-10 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-card ring-1 ring-border lg:size-9">
              <svg viewBox="0 0 40 40" className="size-8 lg:size-7" fill="none" aria-hidden>
                <defs>
                  <linearGradient id="pep-footer-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.14 200)" />
                    <stop offset="40%" stopColor="oklch(0.62 0.18 260)" />
                    <stop offset="75%" stopColor="oklch(0.52 0.25 296)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.24 0)" />
                  </linearGradient>
                </defs>
                <path d="M13 8h9.5a7.5 7.5 0 0 1 0 15H17v9h-4V8Zm4 4v7h5.5a3.5 3.5 0 0 0 0-7H17Z" fill="url(#pep-footer-grad)" />
              </svg>
            </span>
            <div className="font-display text-xl font-medium lg:text-base">
              <span className="brand-gradient-text font-semibold">Peptinium</span> <span className="text-muted-foreground">Labs</span>
            </div>
          </div>
          <p className="mt-5 max-w-md text-[16px] leading-[1.6] text-muted-foreground lg:text-sm lg:leading-relaxed">
            Fournisseur de réactifs peptidiques de qualité recherche pour laboratoires académiques,
            CRO et instituts. Validation HPLC et spectrométrie de masse, Certificat d'Analyse
            (CoA) systématique.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.13em] text-muted-foreground lg:px-3 lg:py-1.5 lg:text-[10px] lg:tracking-[0.18em]">
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
            { to: "/coa", label: "Certificats d'analyse (CoA)" },
          ]}
        />
        <FooterCol
          title="Laboratoire"
          links={[
            { to: "/a-propos", label: "À propos" },
            { to: "/blog", label: "Blog & ressources" },
            { to: "/contact", label: "Contact" },
            { to: "/support", label: "Support / SAV" },
            { to: "/mentions-legales", label: "Mentions légales" },
            { to: "/cgv", label: "CGV" },
          ]}
        />
        <div className="lg:col-span-3">
          <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-foreground lg:text-[10px] lg:tracking-[0.22em]">
            Qualité
          </div>
          <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground lg:space-y-2.5 lg:text-xs">
            <li className="flex items-center gap-2"><Tick /> HPLC en phase inverse ≥ 99 %</li>
            <li className="flex items-center gap-2"><Tick /> Spectrométrie de masse (MS)</li>
            <li className="flex items-center gap-2"><Tick /> CoA fourni avec chaque lot</li>
            <li className="flex items-center gap-2"><Tick /> Flacons verre type I borosilicate</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border bg-background">
        <div className="container-prose py-8 lg:py-10">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-primary lg:text-[10px] lg:tracking-[0.22em]">
              — Clause de non-responsabilité
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground lg:text-[12px]">
              En effectuant un achat sur <strong className="text-foreground">peptinium.com</strong>,
              vous reconnaissez et acceptez les conditions suivantes :
            </p>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-muted-foreground lg:space-y-2 lg:text-[12px]">
              <li><strong className="text-foreground">Utilisation réservée à la recherche :</strong> Tous nos produits sont exclusivement vendus à des fins de recherche. Ils ne sont pas destinés à un usage vétérinaire, diagnostique, thérapeutique ou clinique.</li>
              <li><strong className="text-foreground">Absence de caractère médical :</strong> Aucun des produits présentés sur notre site n'est un dispositif médical, et ils ne doivent pas être présentés ou utilisés comme tels.</li>
              <li><strong className="text-foreground">Conformité et responsabilité :</strong> L'acheteur est seul responsable du respect de l'ensemble des lois et réglementations applicables. peptinium.com ne saurait être tenu responsable en cas d'utilisation inappropriée des produits ou de tout préjudice qui en découlerait.</li>
              <li><strong className="text-foreground">Non-retour :</strong> En raison de la nature des produits que nous commercialisons, nous n'acceptons aucun retour.</li>
            </ul>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground lg:text-[12px]">
              Votre achat implique que vous avez pris connaissance et que vous acceptez ces conditions.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-prose flex flex-col gap-2 py-5 text-[13px] leading-relaxed text-muted-foreground sm:flex-row sm:justify-between lg:text-[11px]">
          <div>© {new Date().getFullYear()} peptinium.com — Tous droits réservés.</div>
          <div className="font-mono uppercase tracking-[0.14em] lg:tracking-[0.2em]">
            Réservé à la recherche · HPLC ≥ 99 %
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
    <div className="lg:col-span-2">
      <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-foreground lg:text-[10px] lg:tracking-[0.22em]">
        {title}
      </div>
      <ul className="mt-4 space-y-3 text-[15px] lg:space-y-2.5 lg:text-xs">
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
