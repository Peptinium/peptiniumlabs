const items = [
  { label: "HPLC ≥ 99%", icon: "▲" },
  { label: "CoA fourni", icon: "◆" },
  { label: "Expédition 48h", icon: "→" },
  { label: "Paiement sécurisé", icon: "●" },
];

export function TrustBar({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <div className="mobile-experience border-y border-[oklch(0.18_0.02_270)]/8 bg-white/60 backdrop-blur-md">
        <div className="mx-auto grid max-w-[440px] grid-cols-2 gap-x-4 gap-y-2.5 px-5 py-4">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[oklch(0.30_0.03_270)]">
              <span className="text-[oklch(0.50_0.26_296)]">{it.icon}</span>
              <span>{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="desktop-experience border-y border-[oklch(0.18_0.02_270)]/8 bg-white/60 backdrop-blur-md">
      <div className="container-prose flex items-center justify-center gap-10 py-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[oklch(0.30_0.03_270)]">
            <span className="text-[oklch(0.50_0.26_296)]">{it.icon}</span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
