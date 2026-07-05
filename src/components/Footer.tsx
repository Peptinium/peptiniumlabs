import { Link } from "@tanstack/react-router";
import peptiniumLogo from "@/assets/brand/peptinium-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background lg:mt-40">
      {/* RUO stripe */}
      <div className="border-b border-warning/15 bg-warning/[0.04]">
        <div className="mx-auto max-w-[1400px] px-6 py-3.5 text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-warning/90 lg:px-10">
          ⚠ Pour motif de recherche uniquement — Pas pour usage vétérinaire, diagnostique ou thérapeutique
        </div>
      </div>

      {/* Editorial main block */}
      <div className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-10 lg:pt-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Left — brand + newsletter */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border/70">
                <img
                  src={peptiniumLogo.url}
                  alt="Peptinium Labs"
                  width={40}
                  height={40}
                  draggable={false}
                  className="size-full object-cover"
                />
              </span>
              <span className="font-display text-[18px] font-medium tracking-[-0.01em]">
                <span className="brand-gradient-text font-semibold">Peptinium</span>
                <span className="ml-1 text-muted-foreground/80">Labs</span>
              </span>
            </div>
            <p className="mt-8 max-w-md text-[16px] leading-[1.65] text-muted-foreground">
              Réactifs peptidiques de qualité recherche pour laboratoires
              académiques, CRO et instituts. Pureté HPLC vérifiée, traçabilité
              complète, lot après lot.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              QC Lab actif — lots audités quotidiennement
            </div>
          </div>

          {/* Right — link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:gap-8">
            <FooterCol
              title="Catalogue"
              links={[
                { to: "/produits", label: "Toutes les références" },
                { to: "/calculatrice", label: "Calculatrice" },
                { to: "/tester-fioles", label: "Tester ses fioles" },
                { to: "/coa", label: "Certificats d'analyse" },
              ]}
            />
            <FooterCol
              title="Laboratoire"
              links={[
                { to: "/a-propos", label: "À propos" },
                { to: "/etudes-scientifiques", label: "Études" },
                { to: "/blog", label: "Journal" },
                { to: "/contact", label: "Contact" },
              ]}
            />
            <FooterCol
              title="Support"
              links={[
                { to: "/support", label: "SAV" },
                { to: "/mentions-legales", label: "Mentions légales" },
                { to: "/cgv", label: "CGV" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="mx-auto mt-24 max-w-[1400px] overflow-hidden px-6 lg:mt-32 lg:px-10">
        <div className="border-t border-border/50 pt-10">
          <div
            className="select-none whitespace-nowrap font-display text-[18vw] font-semibold leading-[0.85] tracking-[-0.05em] brand-gradient-text lg:text-[15vw]"
            aria-hidden
          >
            Peptinium.
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div>
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] brand-gradient-text">
                — Clause de non-responsabilité
              </div>
              <p className="mt-5 max-w-sm text-[14px] leading-[1.65] text-muted-foreground">
                En effectuant un achat sur{" "}
                <strong className="text-foreground">peptinium.com</strong>, vous
                reconnaissez et acceptez les conditions ci-contre.
              </p>
            </div>
            <ul className="space-y-4 text-[13px] leading-[1.7] text-muted-foreground">
              <li>
                <strong className="text-foreground">Utilisation réservée à la recherche.</strong>{" "}
                Tous nos produits sont exclusivement vendus à des fins de
                recherche. Ils ne sont pas destinés à un usage vétérinaire,
                diagnostique, thérapeutique ou clinique.
              </li>
              <li>
                <strong className="text-foreground">Absence de caractère médical.</strong>{" "}
                Aucun produit présenté n'est un dispositif médical, et ne doit
                pas être présenté ou utilisé comme tel.
              </li>
              <li>
                <strong className="text-foreground">Conformité et responsabilité.</strong>{" "}
                L'acheteur est seul responsable du respect de l'ensemble des
                lois et réglementations applicables.
              </li>
              <li>
                <strong className="text-foreground">Non-retour.</strong> En
                raison de la nature des produits commercialisés, nous
                n'acceptons aucun retour.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>© {new Date().getFullYear()} peptinium.com — Tous droits réservés</div>
          <div className="tracking-[0.28em]">Réservé à la recherche · HPLC ≥ 99 %</div>
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
    <div>
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground">
        {title}
      </div>
      <ul className="mt-6 space-y-3.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="group inline-flex items-center gap-2 text-[14px] leading-[1.3] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="h-px w-3 bg-border transition-all group-hover:w-5 group-hover:bg-foreground" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
