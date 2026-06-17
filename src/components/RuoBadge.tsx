export function RuoBadge({
  compact = false,
  variant = "default",
}: {
  compact?: boolean;
  variant?: "default" | "ghost" | "solid";
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-[0.14em]";
  const sizing = compact ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]";
  const styles =
    variant === "solid"
      ? "bg-foreground text-background"
      : variant === "ghost"
        ? "border border-border bg-background/60 backdrop-blur text-foreground/70"
        : "border border-warning/40 bg-warning/8 text-warning";

  return (
    <span className={`${base} ${sizing} ${styles}`}>
      <span className="relative grid size-1.5 place-items-center">
        <span className="absolute inset-0 animate-[pulse-ring_2.6s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-current opacity-50" />
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
      RUO · Research Use Only
    </span>
  );
}
