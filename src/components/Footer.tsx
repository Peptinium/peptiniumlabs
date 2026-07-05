import { Link } from "@tanstack/react-router";
import peptiniumLogo from "@/assets/brand/peptinium-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 bg-surface lg:mt-32">
      {/* RUO stripe */}
      <div className="border-b border-warning/15 bg-warning/[0.04]">
        <div className="mx-auto max-w-[1400px] px-6 py-3.5 text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-warning/90 lg:px-10">
          ⚠ Pour motif de recherche uniquement — Pas pour usage vétérinaire, diagnostique ou thérapeutique
        </div>
      </div>

      {/* Main editorial block */}
      <div className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-10 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.9fr_1fr_1fr] lg:gap-12">
          {/* Left — brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border/70">
                <img
                  src={peptiniumLogo.url}
                  alt="Peptinium Labs"
                  width={44}
                  height={44}
                  draggable={false}
                  className="size-full object-cover"
                />
              </span>
              <span className="font-display text-[18px] font-medium tracking-[-0.01em]">
                <span className="brand-gradient-text font-semibold">Peptinium</span>
                <span className="ml-1 text-muted-foreground/85">Labs</span>
              </span>
            </Link>
          </div>

          <FooterCol
            title="Boutique"
            links={[
              { to: "/", label: "Accueil" },
              { to: "/produits", label: "Boutique" },
              { to: "/a-propos", label: "À propos" },
              { to: "/blog", label: "Journal" },
              { to: "/contact", label: "Contact" },
            ]}
          />

          <FooterCol
            title="Mentions légales"
            links={[
              { to: "/mentions-legales", label: "Politique de confidentialité" },
              { to: "/cgv", label: "Conditions générales" },
              { to: "/support", label: "Politique d'expédition" },
              { to: "/coa", label: "Certificats d'analyse" },
            ]}
          />

          {/* Right — quality signals */}
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground">
              Adresse
            </div>
            <address className="mt-5 not-italic text-[14px] leading-[1.7] text-muted-foreground">
              Peptinium Labs
              <br />
              France · Europe
            </address>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              Réservé à la recherche
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QualityBadge label="Pureté 99%" sub="HPLC" />
              <QualityBadge label="Made in EU" sub="UE" />
              <QualityBadge label="3rd party" sub="Vérifié" />
              <QualityBadge label="Analyse" sub="Avancée" />
            </div>
          </div>
        </div>
      </div>

      {/* Divider + bottom bar */}
      <div className="mx-auto mt-20 max-w-[1400px] px-6 lg:px-10">
        <div className="border-t border-border/60 py-6">
          <div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <div>© {new Date().getFullYear()} Peptinium Labs — Tous droits réservés</div>
            <Link to="/mentions-legales" className="hover:text-foreground">
              Gestion des cookies
            </Link>
            <div className="tracking-[0.28em]">
              Qualité pharmaceutique · Testé en laboratoire · Normes GMP
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer paragraphs — full width, subtle */}
      <div className="mx-auto max-w-[1400px] px-6 pb-14 lg:px-10">
        <div className="border-t border-border/60 pt-8">
          <p className="text-[12px] leading-[1.7] text-muted-foreground">
            <strong className="text-foreground">Réservé à la recherche — Avis important.</strong>{" "}
            Tous les produits listés et vendus par Peptinium Labs sont strictement destinés à la
            recherche en laboratoire — en particulier aux études in vitro. Ils ne sont pas
            destinés à la consommation humaine ou animale, ni à une utilisation dans les aliments,
            les médicaments, les cosmétiques, les dispositifs médicaux ou les procédures
            diagnostiques.
          </p>
          <p className="mt-4 text-[12px] leading-[1.7] text-muted-foreground">
            <strong className="text-foreground">Dosage — Important.</strong> Les informations et
            le matériel fournis sur ce site sont uniquement destinés à des fins éducatives et
            informatives. La présence d'un produit sur ce site ne constitue pas une licence
            d'utilisation de ce produit d'une manière susceptible d'enfreindre des brevets ou de
            violer les lois applicables.
          </p>
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
      <ul className="mt-5 space-y-3.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[14px] leading-[1.4] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QualityBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      className="grid size-14 place-items-center rounded-full text-center text-[8px] font-semibold leading-[1.1] text-background"
      style={{ background: "var(--gradient-brand)" }}
      title={`${label} — ${sub}`}
    >
      <div>
        <div className="font-mono uppercase tracking-[0.08em]">{label.split(" ")[0]}</div>
        <div className="font-mono text-[7px] opacity-80">{sub}</div>
      </div>
    </div>
  );
}
