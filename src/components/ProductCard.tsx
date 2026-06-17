import { Link } from "@tanstack/react-router";
import { minPrice, type Product } from "@/data/products";
import { RuoBadge } from "./RuoBadge";
import retatrutideVial from "@/assets/retatrutide-vial.png.asset.json";

export function ProductCard({ product }: { product: Product }) {
  const hasMultiple = product.variants.length > 1;
  const price = minPrice(product);
  return (
    <Link
      to="/produits/$slug"
      params={{ slug: product.slug }}
      className="hover-lift group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-surface">
        <div className="absolute inset-0 dot-bg opacity-60" />
        <VialIllustration label={product.name} />
        <div className="absolute left-3 top-3">
          <RuoBadge compact />
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-border bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          {product.purity}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {product.category}
            </div>
            <h3 className="mt-1 font-display text-[17px] font-medium tracking-tight text-foreground transition-colors group-hover:text-accent">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-medium">
              {hasMultiple ? <span className="text-[10px] font-normal text-muted-foreground">dès </span> : null}
              {price} €
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {hasMultiple
                ? product.variants.map((v) => v.dosage).join(" · ")
                : product.variants[0].dosage}
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="truncate">
            {hasMultiple ? `${product.variants.length} dosages` : `CAS ${product.cas ?? "—"}`}
          </span>
          <span className="text-accent transition-transform duration-300 group-hover:translate-x-0.5">
            {hasMultiple ? "Choisir →" : "Fiche →"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function VialIllustration({ label }: { label: string }) {
  const isRetatrutide = label.toLowerCase().includes("retatrutide");
  if (isRetatrutide) {
    return (
      <img
        src={retatrutideVial.url}
        alt="Flacon Retatrutide — Research Use Only"
        className="absolute inset-0 size-full object-contain p-4"
        loading="lazy"
      />
    );
  }
  return (
    <svg viewBox="0 0 200 160" className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="vialGlass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 80%)" />
          <stop offset="100%" stopColor="oklch(0.96 0.01 230 / 90%)" />
        </linearGradient>
        <linearGradient id="vialLiquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.09 200 / 70%)" />
          <stop offset="100%" stopColor="oklch(0.7 0.12 200 / 80%)" />
        </linearGradient>
      </defs>
      <g transform="translate(70 18)">
        {/* cap */}
        <rect x="8" y="0" width="44" height="10" rx="1.5" fill="oklch(0.32 0.04 245)" />
        <rect x="4" y="10" width="52" height="7" fill="oklch(0.55 0.03 245)" />
        <rect x="4" y="10" width="52" height="2" fill="oklch(0.7 0.02 245)" />
        {/* glass */}
        <path
          d="M8 17 H52 V108 a18 18 0 0 1 -18 18 H26 a18 18 0 0 1 -18 -18 Z"
          fill="url(#vialGlass)"
          stroke="oklch(0.85 0.01 240)"
          strokeWidth="1"
        />
        {/* liquid */}
        <path
          d="M8 72 H52 V108 a18 18 0 0 1 -18 18 H26 a18 18 0 0 1 -18 -18 Z"
          fill="url(#vialLiquid)"
        />
        {/* label */}
        <rect x="11" y="42" width="38" height="26" fill="oklch(1 0 0)" stroke="oklch(0.88 0.01 240)" />
        <line x1="11" y1="48" x2="49" y2="48" stroke="oklch(0.18 0.04 245)" strokeWidth="0.6" />
        <text
          x="30"
          y="58"
          textAnchor="middle"
          fontSize="6"
          fontFamily="Space Grotesk, sans-serif"
          fill="oklch(0.18 0.04 245)"
          fontWeight="600"
        >
          {label.slice(0, 14).toUpperCase()}
        </text>
        <text
          x="30"
          y="65"
          textAnchor="middle"
          fontSize="3.4"
          fontFamily="JetBrains Mono, monospace"
          fill="oklch(0.5 0.02 240)"
        >
          RUO · LYO
        </text>
        {/* meniscus highlight */}
        <ellipse cx="30" cy="72" rx="22" ry="2" fill="oklch(1 0 0 / 60%)" />
        {/* shine */}
        <rect x="13" y="20" width="3" height="85" rx="1.5" fill="oklch(1 0 0 / 60%)" />
      </g>
    </svg>
  );
}
