export function RuoBanner() {
  const items = [
    "Pureté HPLC ≥ 99 %",
    "CoA Janoshik par lot",
    "Chaîne du froid contrôlée",
    "Expédition sous 24 h depuis l'UE",
    "Réactifs de recherche — RUO",
    "Traçabilité N° de lot complète",
    "Paiement sécurisé & discret",
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-border bg-ink">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,var(--brand-cyan),var(--brand-blue),var(--brand-violet),var(--brand-magenta))]" />
      <div className="relative flex animate-[marquee_38s_linear_infinite] whitespace-nowrap py-1.5">
        {loop.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90"
          >
            <span className="size-1.5 rounded-full bg-[linear-gradient(135deg,var(--brand-cyan),var(--brand-blue),var(--brand-violet),var(--brand-magenta))]" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
