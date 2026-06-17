import { Link } from "@tanstack/react-router";
import { minPrice, formatPrice, type Product } from "@/data/products";
import { RuoBadge } from "./RuoBadge";
import retatrutide10mg from "@/assets/products/retatrutide-10mg.png.asset.json";
import retatrutide20mg from "@/assets/products/retatrutide-20mg.png.asset.json";
import cjc1295Ipamorelin from "@/assets/products/cjc-1295-ipamorelin.png.asset.json";
import semax10mg from "@/assets/products/semax-10mg.png.asset.json";
import mt110mg from "@/assets/products/mt-1-10mg.png.asset.json";
import mt210mg from "@/assets/products/mt-2-10mg.png.asset.json";
import ghkCu50mg from "@/assets/products/ghk-cu-50mg.png.asset.json";
import tesamoreline5mg from "@/assets/products/tesamoreline-5mg.png.asset.json";
import nadPlus1000mg from "@/assets/products/nad-plus-1000mg.png.asset.json";
import klow80mg from "@/assets/products/klow-80mg.png.asset.json";
import ahkCu100mg from "@/assets/products/ahk-cu-100mg.png.asset.json";
import bpc15710mg from "@/assets/products/bpc-157-10mg.png.asset.json";
import eauBac from "@/assets/products/eau-bacteriostatique.png.asset.json";

type ProductVisualProps = {
  product: Pick<Product, "slug" | "name">;
  dosage?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  loading?: "lazy" | "eager";
};

export function ProductCard({ product }: { product: Product }) {
  const hasMultiple = product.variants.length > 1;
  const price = minPrice(product);

  return (
    <Link
      to="/produits/$slug"
      params={{ slug: product.slug }}
      className="hover-lift group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[2/3] overflow-hidden border-b border-border bg-surface">
        <ProductVisual
          product={product}
          dosage={product.variants[0]?.dosage}
          alt={`Flacon ${product.name} — Research Use Only`}
          className="size-full"
          imageClassName="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute left-3 top-3">
          <RuoBadge compact />
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-background/70 bg-background/84 px-2.5 py-1 font-display text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
          {hasMultiple ? <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">dès </span> : null}
          {formatPrice(price)}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/35 via-background/8 to-transparent" />
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
          <div className="text-right font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            {hasMultiple
              ? product.variants.map((v) => v.dosage).join(" · ")
              : product.variants[0].dosage}
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

export function ProductVisual({
  product,
  dosage,
  alt,
  className = "",
  imageClassName = "",
  loading = "lazy",
}: ProductVisualProps) {
  const src = getProductImageUrl(product.slug, dosage);

  if (src) {
    return (
      <div className={`overflow-hidden rounded-[18px] ${className}`}>
        <img
          src={src}
          alt={alt ?? `Flacon ${product.name} — Research Use Only`}
          className={imageClassName || "size-full object-cover"}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-[18px] bg-surface ${className}`}>
      <FallbackVialIllustration label={product.name} />
    </div>
  );
}

function getProductImageUrl(slug: Product["slug"], dosage?: string) {
  switch (slug) {
    case "retatrutide":
      return dosage?.includes("20") ? retatrutide20mg.url : retatrutide10mg.url;
    case "ghk-cu":
      return ghkCu50mg.url;
    case "ahk-cu":
      return ahkCu100mg.url;
    case "bpc-157":
      return bpc15710mg.url;
    case "cjc-1295-ipamorelin":
      return cjc1295Ipamorelin.url;
    case "semax":
      return semax10mg.url;
    case "mt-1":
      return mt110mg.url;
    case "mt-2":
      return mt210mg.url;
    case "tesamoreline":
      return tesamoreline5mg.url;
    case "nad-plus":
      return nadPlus1000mg.url;
    case "klow":
      return klow80mg.url;
    case "eau-bacteriostatique":
      return eauBac.url;
    default:
      return null;
  }
}

function FallbackVialIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 200 160" className="size-full">
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
        <rect x="8" y="0" width="44" height="10" rx="1.5" fill="oklch(0.32 0.04 245)" />
        <rect x="4" y="10" width="52" height="7" fill="oklch(0.55 0.03 245)" />
        <rect x="4" y="10" width="52" height="2" fill="oklch(0.7 0.02 245)" />
        <path
          d="M8 17 H52 V108 a18 18 0 0 1 -18 18 H26 a18 18 0 0 1 -18 -18 Z"
          fill="url(#vialGlass)"
          stroke="oklch(0.85 0.01 240)"
          strokeWidth="1"
        />
        <path
          d="M8 72 H52 V108 a18 18 0 0 1 -18 18 H26 a18 18 0 0 1 -18 -18 Z"
          fill="url(#vialLiquid)"
        />
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
        <ellipse cx="30" cy="72" rx="22" ry="2" fill="oklch(1 0 0 / 60%)" />
        <rect x="13" y="20" width="3" height="85" rx="1.5" fill="oklch(1 0 0 / 60%)" />
      </g>
    </svg>
  );
}
