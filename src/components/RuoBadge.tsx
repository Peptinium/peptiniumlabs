export function RuoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-warning/30 bg-warning/5 px-2 py-0.5 font-mono text-warning ${
        compact ? "text-[10px]" : "text-xs"
      }`}
    >
      <span className="size-1.5 rounded-full bg-warning" aria-hidden />
      RUO — Research Use Only
    </span>
  );
}
