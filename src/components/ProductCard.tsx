import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { RuoBadge } from "./RuoBadge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produits/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col rounded-md border border-border bg-card transition-all hover:border-medical/50 hover:shadow-sm"
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-t-md bg-surface">
        <VialIllustration label={product.name} />
        <div className="absolute left-3 top-3">
          <RuoBadge compact />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.category}
            </div>
            <h3 className="mt-0.5 text-base font-semibold tracking-tight group-hover:text-medical">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold">{product.price} €</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.dosage}
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span className="font-mono">Pureté {product.purity.replace("≥ ", "≥")}</span>
          <span className="font-mono text-medical">Voir fiche →</span>
        </div>
      </div>
    </Link>
  );
}

export function VialIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 200 160" className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="vial" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.99 0 0)" />
          <stop offset="100%" stopColor="oklch(0.95 0.01 240)" />
        </linearGradient>
      </defs>
      <rect width="200" height="160" fill="url(#vial)" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          x2="200"
          y1={i * 22 + 4}
          y2={i * 22 + 4}
          stroke="oklch(0.93 0.005 240)"
          strokeWidth="0.5"
        />
      ))}
      <g transform="translate(70 22)">
        <rect x="10" y="0" width="40" height="10" rx="2" fill="oklch(0.55 0.04 240)" />
        <rect x="6" y="10" width="48" height="6" fill="oklch(0.7 0.02 240)" />
        <path
          d="M10 16 H50 V100 a18 18 0 0 1 -18 18 H28 a18 18 0 0 1 -18 -18 Z"
          fill="oklch(0.99 0 0)"
          stroke="oklch(0.85 0.01 240)"
          strokeWidth="1.2"
        />
        <path
          d="M10 70 H50 V100 a18 18 0 0 1 -18 18 H28 a18 18 0 0 1 -18 -18 Z"
          fill="oklch(0.92 0.04 195 / 60%)"
        />
        <rect x="13" y="40" width="34" height="22" fill="oklch(1 0 0)" stroke="oklch(0.88 0.01 240)" />
        <text
          x="30"
          y="54"
          textAnchor="middle"
          fontSize="6"
          fontFamily="ui-monospace, monospace"
          fill="oklch(0.32 0.06 235)"
          fontWeight="600"
        >
          {label.slice(0, 14).toUpperCase()}
        </text>
        <text
          x="30"
          y="60"
          textAnchor="middle"
          fontSize="3.5"
          fontFamily="ui-monospace, monospace"
          fill="oklch(0.5 0.02 240)"
        >
          RUO — Lyophilized
        </text>
      </g>
    </svg>
  );
}
