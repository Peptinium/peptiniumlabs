import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="ruo-stripe border-b border-warning/20">
        <div className="container-prose py-4 text-center text-xs font-medium uppercase tracking-wider text-warning">
          ⚠ Research Use Only — Produits strictement réservés à la recherche scientifique en
          laboratoire. Toute utilisation humaine, animale, diagnostique ou thérapeutique est
          formellement interdite.
        </div>
      </div>
      <div className="container-prose grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-sm bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 3v6l-5 9a3 3 0 0 0 2.6 4.5h10.8A3 3 0 0 0 20 18l-5-9V3" />
                <path d="M8 3h8" />
              </svg>
            </span>
            <div className="text-sm font-semibold">Aetherion Labs</div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Fournisseur de réactifs peptidiques de qualité recherche pour laboratoires académiques,
            CRO et instituts publics. Tous nos composés sont validés par HPLC et spectrométrie de
            masse, et livrés avec leur Certificat d'Analyse (CoA).
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
            Catalogue
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/produits" className="hover:text-foreground">Tous les produits</Link></li>
            <li><Link to="/packs" className="hover:text-foreground">Packs recherche</Link></li>
            <li><Link to="/calculatrice" className="hover:text-foreground">Calculatrice de dosage</Link></li>
            <li><Link to="/etudes-scientifiques" className="hover:text-foreground">Études scientifiques</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
            Laboratoire
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/a-propos" className="hover:text-foreground">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/mentions-legales" className="hover:text-foreground">Mentions légales</Link></li>
            <li><Link to="/cgv" className="hover:text-foreground">CGV</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-prose flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <div>© {new Date().getFullYear()} Aetherion Labs — Tous droits réservés.</div>
          <div className="font-mono uppercase tracking-wider">RUO · ISO-friendly QC · HPLC ≥ 98 %</div>
        </div>
      </div>
    </footer>
  );
}
