export function RuoBanner() {
  const items = [
    "Research Use Only",
    "Réactifs de laboratoire",
    "Non destiné à un usage vétérinaire, diagnostique ou thérapeutique",
    "HPLC ≥ 99 %",
    "CoA par lot",
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-surface-2">
      <div className="flex animate-[marquee_38s_linear_infinite] whitespace-nowrap py-1.5">
        {loop.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80"
          >
            <span className="size-1 rounded-full bg-accent" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
