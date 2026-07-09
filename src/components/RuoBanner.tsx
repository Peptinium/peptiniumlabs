export function RuoBanner() {
  const items = [
    "Pureté HPLC ≥ 99 %",
    "CoA Janoshik par lot",
    "Stockage lyophilisé stable",
    "Expédition sous 24 h depuis l'UE",
    "Réactifs de recherche — RUO",
    "Traçabilité N° de lot complète",
    "Paiement sécurisé & discret",
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[var(--brand-blue)]" />
      <div className="absolute inset-0 bg-ink/35" />
      <div className="relative flex animate-[marquee_38s_linear_infinite] whitespace-nowrap py-2">
        {loop.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white"
          >
            <span className="relative flex size-2 items-center justify-center rounded-full bg-white shadow-[0_0_8px_var(--brand-cyan),0_0_16px_var(--brand-violet)]">
              <span className="absolute inset-0 rounded-full bg-white/80 animate-ping" />
            </span>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
