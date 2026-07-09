import { Link } from "@tanstack/react-router";
import { minPrice, formatPrice, hasPromo, type Product } from "@/data/products";
import reta10 from "@/assets/products/Reta_10mg.png.asset.json";
import reta20 from "@/assets/products/Reta_20mg.png.asset.json";
import cjcIpa from "@/assets/products/CJC_1295_IPAMORELIN_5_5mg.png.asset.json";
import semax5 from "@/assets/products/Semax_5mg.png.asset.json";
import mt110 from "@/assets/products/Melanotan_1_10mg.png.asset.json";
import mt210mg from "@/assets/products/Melanotan_2_10mg.png.asset.json";
import ghkCu50 from "@/assets/products/GHK_CU_50mg.png.asset.json";
import ghkCu100 from "@/assets/products/GHK_CU_100mg.png.asset.json";
import tesa10mg from "@/assets/products/Tesamorelin_10mg.png.asset.json";
import nad1000 from "@/assets/products/NAD_1000mg.png.asset.json";
import klow80mg from "@/assets/products/KLOW_80mg.png.asset.json";
import ahkCu50mg from "@/assets/products/AHK_CU_50mg.png.asset.json";
import ahkCu100mg from "@/assets/products/ahk-cu-100mg.png.asset.json";
import bpc15715 from "@/assets/products/BPC_157_15mg.png.asset.json";
import eauBac from "@/assets/products/Eau_bac_10ml.png.asset.json";
import dsip10 from "@/assets/products/DSIP_10mg.png.asset.json";
import epithalon10 from "@/assets/products/Epithalon_10mg.png.asset.json";
import kpv10 from "@/assets/products/KPV_10mg.png.asset.json";
import motsc10 from "@/assets/products/MOTS_C_10_mg.png.asset.json";
import oxytocin10 from "@/assets/products/Oxytocin_10mg.png.asset.json";
import pt14110 from "@/assets/products/PT_141_10mg.png.asset.json";
import selank5 from "@/assets/products/Selank_5mg.png.asset.json";
import snap810 from "@/assets/products/Snap_8_10mg.png.asset.json";
import tb5005 from "@/assets/products/TB_500_5mg.png.asset.json";


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
  const allSoldOut = product.variants.every((v) => v.soldOut);
  const anyLowStock = !allSoldOut && product.variants.some((v) => v.lowStock);


  return (
    <Link
      to="/produits/$slug"
      params={{ slug: product.slug }}
      className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
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
        <div className="absolute right-3 top-3 rounded-full border border-border bg-card/92 px-2.5 py-1 font-display text-sm font-medium shadow-sm backdrop-blur-sm">
          {hasMultiple ? <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">dès </span> : null}
          <span className="text-foreground">
            {formatPrice(price)}
          </span>
        </div>
        {allSoldOut && (
          <div className="absolute left-3 top-3 rounded-full border border-warning/40 bg-warning/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-warning backdrop-blur-sm">
            Rupture de stock
          </div>
        )}
        {!allSoldOut && hasPromo(product) && (
          <div className="absolute left-3 top-3 rounded-full border border-accent/50 bg-accent/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
            Promo
          </div>
        )}
        {anyLowStock && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Stock faible
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/25 via-background/5 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {product.category}
            </div>
            <h3 className="mt-1 truncate font-display text-[15px] font-medium tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-[17px]">
              {product.name}
            </h3>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:text-right">
            {hasMultiple
              ? product.variants.map((v) => v.dosage).join(" · ")
              : product.variants[0].dosage}
          </div>
        </div>
        <p className="line-clamp-2 hidden text-xs leading-relaxed text-muted-foreground sm:block">
          {product.shortDescription}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground sm:mt-3 sm:pt-3 sm:tracking-[0.18em]">
          <span className="truncate">
            {hasMultiple ? `${product.variants.length} dosages` : `CAS ${product.cas ?? "—"}`}
          </span>
          <span className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5">
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
          decoding="async"
          width={800}
          height={1200}
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
      return dosage?.includes("20") ? reta20.url : reta10.url;
    case "ghk-cu":
      return dosage?.includes("100") ? ghkCu100.url : ghkCu50.url;
    case "ahk-cu":
      return dosage?.includes("50") ? ahkCu50mg.url : ahkCu100mg.url;
    case "bpc-157":
      return bpc15715.url;
    case "cjc-1295-ipamorelin":
      return cjcIpa.url;
    case "semax":
      return semax5.url;
    case "mt-1":
      return mt110.url;
    case "mt-2":
      return mt210mg.url;
    case "tesamoreline":
      return tesa10mg.url;
    case "nad-plus":
      return nad1000.url;
    case "klow":
      return klow80mg.url;
    case "eau-bacteriostatique":
      return eauBac.url;
    case "dsip":
      return dsip10.url;
    case "epithalon":
      return epithalon10.url;
    case "kpv":
      return kpv10.url;
    case "mots-c":
      return motsc10.url;
    case "oxytocin":
      return oxytocin10.url;
    case "pt-141":
      return pt14110.url;
    case "selank":
      return selank5.url;
    case "snap-8":
      return snap810.url;
    case "tb-500":
      return tb5005.url;
    default:
      return null;
  }
}

function FallbackVialIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 200 160" className="size-full">
      <defs>
        <linearGradient id="vialGlass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 90%)" />
          <stop offset="100%" stopColor="oklch(0.97 0.01 230 / 95%)" />
        </linearGradient>
        <linearGradient id="vialLiquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.09 200 / 60%)" />
          <stop offset="100%" stopColor="oklch(0.7 0.12 200 / 70%)" />
        </linearGradient>
      </defs>
      <g transform="translate(70 18)">
        <rect x="8" y="0" width="44" height="10" rx="1.5" fill="oklch(0.55 0.03 245)" />
        <rect x="4" y="10" width="52" height="7" fill="oklch(0.75 0.03 245)" />
        <rect x="4" y="10" width="52" height="2" fill="oklch(0.88 0.02 245)" />
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
        <line x1="11" y1="48" x2="49" y2="48" stroke="oklch(0.55 0.03 245)" strokeWidth="0.6" />
        <text
          x="30"
          y="58"
          textAnchor="middle"
          fontSize="6"
          fontFamily="Space Grotesk, sans-serif"
          fill="oklch(0.35 0.04 245)"
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
          fill="oklch(0.55 0.02 240)"
        >
          RUO · LYO
        </text>
        <ellipse cx="30" cy="72" rx="22" ry="2" fill="oklch(1 0 0 / 60%)" />
        <rect x="13" y="20" width="3" height="85" rx="1.5" fill="oklch(1 0 0 / 60%)" />
      </g>
    </svg>
  );
}
