export function RuoBanner() {
  return (
    <div className="border-b border-warning/30 bg-warning/5">
      <div className="container-prose flex items-center justify-center gap-2 py-1.5 text-center text-[11px] font-medium uppercase tracking-wider text-warning sm:text-xs">
        <span aria-hidden>⚠</span>
        <span>
          Produits destinés exclusivement à la recherche scientifique en laboratoire — Research
          Use Only (RUO). Non destinés à un usage humain, vétérinaire ou alimentaire.
        </span>
      </div>
    </div>
  );
}
