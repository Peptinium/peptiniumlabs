export function RuoBadge({
  compact = false,
  variant = "default",
}: {
  compact?: boolean;
  variant?: "default" | "ghost" | "solid";
}) {
  const base =
    "ruo-badge group relative inline-flex items-center gap-2 overflow-hidden rounded-full font-mono uppercase tracking-[0.18em] text-center transition-colors";
  const sizing = compact ? "px-3 py-1 text-[8.5px]" : "px-3.5 py-1.5 text-[9.5px]";
  const styles =
    variant === "solid"
      ? "bg-foreground text-background"
      : variant === "ghost"
        ? "border border-border bg-background/70 backdrop-blur text-foreground/80"
        : "border border-warning/70 bg-warning/15 text-warning";

  return (
    <span className={`${base} ${sizing} ${styles}`}>
      <span className="relative grid size-1.5 shrink-0 place-items-center">
        <span className="absolute inset-0 animate-[pulse-ring_2.6s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-current opacity-50" />
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
      <span className="relative z-10 font-semibold">
        Pour motif de recherche uniquement
      </span>
      <span aria-hidden className="ruo-badge-shine" />
    </span>
  );
}
