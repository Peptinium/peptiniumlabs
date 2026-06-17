import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import {
  useCart,
  itemKey,
  EAU_SLUG,
  EAU_PRICE,
  EAU_DOSAGE,
  SHIPPING,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/cart";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — Aetherion Labs" },
      { name: "description", content: "Finalisez votre commande de réactifs peptidiques de recherche." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PanierPage,
});

type Step = "livraison" | "paiement" | "virement" | "confirmation";

const BANK = {
  beneficiary: "Aetherion",
  iban: "FR76 1695 8000 0144 9142 5679 871",
  bic: "QNTOFRP1XXX",
};

function genOrderRef() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `ATH-${n}`;
}

function PanierPage() {
  const cart = useCart();
  const [step, setStep] = useState<Step>("livraison");
  const [shipping, setShipping] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    address2: "",
    postal: "",
    city: "",
    country: "France",
  });
  const [orderRef, setOrderRef] = useState<string>("");

  // generate order ref once we move past livraison
  useEffect(() => {
    if (step !== "livraison" && !orderRef) setOrderRef(genOrderRef());
  }, [step, orderRef]);

  const isEmpty = cart.items.length === 0;
  const motif = orderRef
    ? `${orderRef} ${shipping.firstName} ${shipping.lastName}`.trim()
    : "";

  const subtotal = cart.subtotal;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING;
  const total = subtotal + shippingFee;

  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="container-prose flex items-center gap-2 py-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Aetherion</Link>
          <span className="text-border">›</span>
          <span className="text-foreground">Panier</span>
        </div>
      </div>

      <div className="container-prose py-10 sm:py-14">
        {step !== "confirmation" && step !== "virement" && (
          <Stepper step={step} />
        )}

        {isEmpty && step === "livraison" ? (
          <EmptyCart />
        ) : step === "livraison" ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <LivraisonForm
              value={shipping}
              onChange={setShipping}
              onSubmit={() => setStep("paiement")}
            />
            <Recap
              cart={cart}
              subtotal={subtotal}
              shipping={shippingFee}
              total={total}
              editable
            />
          </div>
        ) : step === "paiement" ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <PaiementBlock
              shipping={shipping}
              onBack={() => setStep("livraison")}
              onConfirm={() => setStep("virement")}
            />
            <Recap
              cart={cart}
              subtotal={subtotal}
              shipping={shippingFee}
              total={total}
              collapsed
            />
          </div>
        ) : step === "virement" ? (
          <VirementBlock
            total={total}
            orderRef={orderRef}
            motif={motif}
            cart={cart}
            subtotal={subtotal}
            shippingFee={shippingFee}
            onSignaled={() => setStep("confirmation")}
          />
        ) : (
          <ConfirmationBlock
            total={total}
            orderRef={orderRef}
            cart={cart}
            subtotal={subtotal}
            shippingFee={shippingFee}
            onDone={() => cart.clear()}
          />
        )}
      </div>
    </SiteLayout>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { id: "livraison", n: 1, label: "Livraison" },
    { id: "paiement", n: 2, label: "Paiement" },
  ] as const;
  return (
    <div className="mx-auto mb-10 flex max-w-md items-center justify-center gap-4">
      {items.map((it, idx) => {
        const active = step === it.id;
        const done = step === "paiement" && it.id === "livraison";
        return (
          <div key={it.id} className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`grid size-7 place-items-center rounded-full border text-[11px] font-medium ${
                  done
                    ? "border-success bg-success/15 text-success"
                    : active
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? "✓" : it.n}
              </span>
              <span
                className={`text-sm ${active || done ? "text-foreground" : "text-muted-foreground"}`}
              >
                {it.label}
              </span>
            </div>
            {idx === 0 && <div className="h-px w-12 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full border border-border bg-surface text-accent">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h9.7a2 2 0 0 0 2-1.6L23 8H6" />
          <circle cx="10" cy="21" r="1.4" />
          <circle cx="18" cy="21" r="1.4" />
        </svg>
      </div>
      <h1 className="mt-5 font-display text-2xl font-medium">Votre panier est vide</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Découvrez nos réactifs peptidiques de qualité recherche.
      </p>
      <Link
        to="/produits"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-background hover:bg-accent/90"
      >
        Voir le catalogue
      </Link>
    </div>
  );
}

// ─────────────────────────── LIVRAISON ───────────────────────────
function LivraisonForm({
  value,
  onChange,
  onSubmit,
}: {
  value: ReturnType<typeof Object>;
  onChange: (v: any) => void;
  onSubmit: () => void;
}) {
  const v = value as any;
  const required = v.email && v.firstName && v.lastName && v.mobile && v.address && v.postal && v.city;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (required) onSubmit();
      }}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-accent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </span>
        <h2 className="font-display text-base font-semibold uppercase tracking-[0.12em]">Informations de livraison</h2>
      </div>

      <div className="mt-6 space-y-3">
        <Field icon="mail" placeholder="Email * (pour le suivi de commande)" type="email" value={v.email} onChange={(x) => onChange({ ...v, email: x })} />
        <div className="grid grid-cols-2 gap-3">
          <Field icon="user" placeholder="Prénom *" value={v.firstName} onChange={(x) => onChange({ ...v, firstName: x })} />
          <Field icon={null} placeholder="Nom *" value={v.lastName} onChange={(x) => onChange({ ...v, lastName: x })} />
        </div>
        <Field icon="phone" placeholder="Mobile * (pour le suivi de commande)" value={v.mobile} onChange={(x) => onChange({ ...v, mobile: x })} />
        <Field icon="pin" placeholder="Adresse * (Numéro, Rue)" value={v.address} onChange={(x) => onChange({ ...v, address: x })} />
        <Field icon={null} placeholder="Complément d'adresse (Appartement, Étage, Code...)" value={v.address2} onChange={(x) => onChange({ ...v, address2: x })} />
        <div className="grid grid-cols-2 gap-3">
          <Field icon={null} placeholder="Code Postal *" value={v.postal} onChange={(x) => onChange({ ...v, postal: x })} />
          <Field icon={null} placeholder="Ville *" value={v.city} onChange={(x) => onChange({ ...v, city: x })} />
        </div>
        <Field icon={null} placeholder="Pays" value={v.country} onChange={(x) => onChange({ ...v, country: x })} />
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-border bg-surface/60 p-3.5 text-xs text-muted-foreground">
        <svg width="14" height="14" className="mt-0.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"/></svg>
        <span><strong className="text-foreground">Envoi 100% neutre.</strong> Vos données sont chiffrées (SSL) et protégées. Anonymat garanti.</span>
      </div>

      <button
        type="submit"
        disabled={!required}
        className="mt-6 group relative w-full overflow-hidden rounded-xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="inline-flex items-center justify-center gap-2">
          Continuer <span aria-hidden>→</span>
        </span>
      </button>

      <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        🔒 Paiement Sécurisé · Anonymat Garanti
      </div>
    </form>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: "mail" | "user" | "phone" | "pin" | null;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const Icon = () => {
    if (!icon) return null;
    const common = "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground";
    if (icon === "mail")
      return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    if (icon === "user")
      return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>;
    if (icon === "phone")
      return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M22 17v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.7 4a2 2 0 0 1-.6 1.9L7.5 11a16 16 0 0 0 6 6l1.4-1.6a2 2 0 0 1 1.9-.6l4 .7A2 2 0 0 1 22 17Z"/></svg>;
    return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>;
  };
  return (
    <div className="relative">
      <Icon />
      <input
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-border bg-background py-3 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition-colors focus:border-accent ${icon ? "pl-10 pr-3.5" : "px-3.5"}`}
      />
    </div>
  );
}

// ─────────────────────────── PAIEMENT ───────────────────────────
function PaiementBlock({
  shipping,
  onBack,
  onConfirm,
}: {
  shipping: any;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [method, setMethod] = useState<"bank">("bank");
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-success/40 bg-success/5 p-4">
        <svg width="22" height="22" className="mt-0.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>
        <div className="flex-1">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Expédier à</div>
          <div className="mt-0.5 font-display text-base font-medium text-foreground">
            {shipping.firstName} {shipping.lastName}
          </div>
          <div className="text-sm text-muted-foreground">
            {shipping.address}{shipping.address2 ? `, ${shipping.address2}` : ""}, {shipping.postal} {shipping.city}, {shipping.country}
          </div>
        </div>
        <button onClick={onBack} className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:underline">
          ✎ Modifier
        </button>
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-semibold">Sélectionnez votre mode de paiement</h2>
        <label
          className={`block cursor-pointer rounded-2xl border p-5 transition-all ${
            method === "bank" ? "border-accent ring-1 ring-accent bg-accent/5" : "border-border bg-card"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`grid size-5 place-items-center rounded-full border-2 ${
                method === "bank" ? "border-accent" : "border-border"
              }`}
            >
              <span className={`size-2.5 rounded-full ${method === "bank" ? "bg-accent" : ""}`} />
            </span>
            <span className="flex items-center gap-2 font-display text-base font-medium">
              Virement Bancaire
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-7M15 21v-7"/></svg>
            </span>
          </div>
          <div className="mt-3 space-y-1 pl-8 text-sm text-muted-foreground">
            <div>Transférez les fonds depuis votre banque.</div>
            <div><strong className="text-foreground">Délai : 24 à 48h ouvrées.</strong> Expédition à réception.</div>
          </div>
          <input type="radio" name="method" checked readOnly className="sr-only" />
        </label>

        <div className="mt-3 rounded-2xl border border-border bg-card/50 p-5 opacity-60">
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-full border-2 border-border" />
            <span className="font-display text-base font-medium text-muted-foreground">Carte Bancaire / Apple Pay</span>
            <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-warning">
              Indisponible
            </span>
          </div>
          <div className="mt-2 pl-8 text-xs text-warning/90">
            Option temporairement indisponible. Veuillez privilégier le Virement Bancaire pour valider votre commande aujourd'hui.
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-surface/60 p-3.5 text-xs text-muted-foreground">
        <svg width="14" height="14" className="mt-0.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <span><strong className="text-foreground">Transaction sécurisée :</strong> votre paiement est traité avec discrétion par notre partenaire financier certifié.</span>
      </div>

      <button
        onClick={onConfirm}
        className="group relative w-full overflow-hidden rounded-xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent/90"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6"/></svg>
          Confirmer la commande
        </span>
      </button>
    </div>
  );
}

// ─────────────────────────── RECAP ───────────────────────────
function Recap({
  cart,
  subtotal,
  shipping,
  total,
  editable = false,
  collapsed = false,
}: {
  cart: ReturnType<typeof useCart>;
  subtotal: number;
  shipping: number;
  total: number;
  editable?: boolean;
  collapsed?: boolean;
}) {
  const [open, setOpen] = useState(!collapsed);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <aside className="space-y-4">
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-accent"><path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h9.7a2 2 0 0 0 2-1.6L23 8H6"/></svg>
        <h2 className="font-display text-base font-semibold uppercase tracking-[0.12em]">Récapitulatif</h2>
        {collapsed && (
          <button onClick={() => setOpen((o) => !o)} className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:underline">
            {open ? "Masquer" : `Voir le détail (${cart.count} article${cart.count > 1 ? "s" : ""})`}
          </button>
        )}
      </div>

      {editable && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-accent"><path d="M3 7h13l3 4v6h-3M3 7v10h3M16 17H9"/><circle cx="7" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>
            {remaining > 0 ? (
              <span className="text-muted-foreground">
                Plus que <span className="font-semibold text-foreground">{formatPrice(remaining)}</span> pour la livraison gratuite
              </span>
            ) : (
              <span className="text-success">Livraison gratuite débloquée ✓</span>
            )}
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {open && (
        <div className="space-y-3">
          {cart.items.map((it) => (
            <CartLine key={itemKey(it.slug, it.dosage)} item={it} editable={editable} />
          ))}

          {editable && cart.peptideCount > 0 && (
            <SolventLine />
          )}
        </div>
      )}

      <button className="block w-full text-left font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline">
        Saisir un code de réduction
      </button>

      <div className="space-y-1.5 rounded-2xl border border-border bg-card p-5 text-sm">
        <Row label="Sous-total" value={formatPrice(subtotal)} />
        <Row label="Livraison 48h" value={shipping === 0 ? "Gratuit" : formatPrice(shipping)} />
        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
          <span className="font-display text-base font-semibold uppercase tracking-[0.12em]">Total</span>
          <span className="font-display text-2xl font-medium text-accent">{formatPrice(total)}</span>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function CartLine({ item, editable }: { item: ReturnType<typeof useCart>["items"][number]; editable: boolean }) {
  const cart = useCart();
  const key = itemKey(item.slug, item.dosage);
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-border bg-surface text-accent">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M7 6h10v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6Z"/><path d="M9 11h6M9 15h6"/></svg>
        </div>
        <div className="flex-1">
          <div className="font-display text-[15px] font-medium">{item.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item.dosage}</div>
          {editable && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1 text-sm">
              <button aria-label="-" onClick={() => cart.setQty(key, item.qty - 1)} className="grid size-6 place-items-center hover:bg-surface rounded">−</button>
              <span className="min-w-[1.5ch] text-center font-medium">{item.qty}</span>
              <button aria-label="+" onClick={() => cart.setQty(key, item.qty + 1)} className="grid size-6 place-items-center hover:bg-surface rounded">+</button>
            </div>
          )}
        </div>
        <div className="text-right">
          {editable && (
            <button
              aria-label="Retirer"
              onClick={() => cart.remove(key)}
              className="ml-auto block text-muted-foreground transition-colors hover:text-destructive"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/></svg>
            </button>
          )}
          <div className="mt-2 font-display text-base font-medium text-accent">{formatPrice(item.price * item.qty)}</div>
          {!editable && <div className="font-mono text-[10px] text-muted-foreground">× {item.qty}</div>}
        </div>
      </div>
    </div>
  );
}

function SolventLine() {
  const cart = useCart();
  const allowed = cart.peptideCount;
  const current = cart.eauQty;
  const has = current > 0;
  const fullPrice = formatPrice(EAU_PRICE * Math.max(1, current));
  return (
    <div className={`rounded-2xl border p-4 transition-all ${has ? "border-accent/40 bg-accent/5" : "border-dashed border-accent/40 bg-surface/40"}`}>
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-border bg-surface text-accent">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 2c2.5 4 5 6.5 5 10a5 5 0 1 1-10 0c0-3.5 2.5-6 5-10Z"/></svg>
        </div>
        <div className="flex-1">
          <div className="font-display text-[15px] font-medium">{has ? "Solvant ajouté" : "Ajouter le Solvant"}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Eau Bactériostatique {EAU_DOSAGE} · 1 flacon / peptide (max {allowed})
          </div>
        </div>
        {!has ? (
          <button
            onClick={() => cart.setEau(allowed)}
            className="rounded-full bg-accent px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-background hover:bg-accent/90"
          >
            +{formatPrice(EAU_PRICE * allowed)}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-sm">
              <button aria-label="-" onClick={() => cart.setEau(current - 1)} className="grid size-6 place-items-center hover:bg-surface rounded">−</button>
              <span className="min-w-[1.5ch] text-center font-medium">{current}</span>
              <button aria-label="+" onClick={() => cart.setEau(current + 1)} disabled={current >= allowed} className="grid size-6 place-items-center rounded hover:bg-surface disabled:opacity-40">+</button>
            </div>
            <span className="font-display text-sm font-medium text-accent">{fullPrice}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── VIREMENT ───────────────────────────
function VirementBlock({
  total,
  orderRef,
  motif,
  cart,
  subtotal,
  shippingFee,
  onSignaled,
}: {
  total: number;
  orderRef: string;
  motif: string;
  cart: ReturnType<typeof useCart>;
  subtotal: number;
  shippingFee: number;
  onSignaled: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full border border-border bg-card text-accent">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6"/></svg>
        </div>
        <h1 className="mt-4 font-display text-3xl font-medium">Action requise</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Effectuez le virement bancaire ci-dessous pour confirmer votre commande.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <CopyRow label="Bénéficiaire" value={BANK.beneficiary} />
        <CopyRow label="IBAN" value={BANK.iban} mono />
        <CopyRow label="BIC / SWIFT" value={BANK.bic} mono />
        <CopyRow label="Motif (obligatoire)" value={motif || orderRef} mono highlight />
        <div className="border-t border-border p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Montant</div>
          <div className="mt-1 font-display text-xl font-semibold">{formatPrice(total).replace(" €", "")} EUR</div>
        </div>

        <div className="border-t border-border bg-surface p-5">
          <button
            onClick={onSignaled}
            className="group relative w-full overflow-hidden rounded-xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-accent/90"
          >
            <span className="inline-flex items-center justify-center gap-2">
              ✓ Je confirme avoir effectué le virement
            </span>
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            Votre commande sera expédiée dès réception des fonds (délai habituel 24 à 48h ouvrées).
            Utilisez uniquement le numéro de commande comme motif de virement.
          </p>
        </div>
      </div>

      <OrderSummary orderRef={orderRef} cart={cart} subtotal={subtotal} shippingFee={shippingFee} total={total} />
    </div>
  );
}

function CopyRow({ label, value, mono = false, highlight = false }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`flex items-start justify-between gap-4 border-b border-border p-5 ${highlight ? "bg-accent/5" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <div className={`mt-1 break-all text-foreground ${mono ? "font-mono text-[15px] font-semibold tracking-wide" : "font-display text-base font-medium"}`}>{value}</div>
      </div>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
        aria-label="Copier"
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-accent"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        )}
      </button>
    </div>
  );
}

function OrderSummary({
  orderRef,
  cart,
  subtotal,
  shippingFee,
  total,
}: {
  orderRef: string;
  cart: ReturnType<typeof useCart>;
  subtotal: number;
  shippingFee: number;
  total: number;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-accent"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em]">Résumé de la commande</h3>
      </div>
      <div className="mt-4 space-y-1.5 text-sm">
        {cart.items.map((it) => (
          <div key={itemKey(it.slug, it.dosage)} className="flex justify-between text-muted-foreground">
            <span>
              <span className="text-foreground">{it.name}</span> <span className="font-mono text-xs">×{it.qty}</span>
            </span>
            <span className="text-foreground">{formatPrice(it.price * it.qty).replace(" €", " EUR")}</span>
          </div>
        ))}
        <div className="flex justify-between text-muted-foreground">
          <span>Livraison</span>
          <span className="text-foreground">{(shippingFee === 0 ? "Gratuit" : formatPrice(shippingFee).replace(" €", " EUR"))}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3">
          <span className="font-semibold">Total</span>
          <span className="font-display text-base font-semibold">{formatPrice(total).replace(" €", " EUR")}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Commande</span>
          <span className="font-mono font-semibold text-foreground">{orderRef}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── CONFIRMATION ───────────────────────────
function ConfirmationBlock({
  total,
  orderRef,
  cart,
  subtotal,
  shippingFee,
  onDone,
}: {
  total: number;
  orderRef: string;
  cart: ReturnType<typeof useCart>;
  subtotal: number;
  shippingFee: number;
  onDone: () => void;
}) {
  // Snapshot before clearing
  const snapshot = useMemo(() => cart.items.map((i) => ({ ...i })), []);
  useEffect(() => {
    onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 12 5 5L20 7"/></svg>
      </div>
      <h1 className="mt-4 font-display text-3xl font-medium">Virement signalé</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Paiement signalé, en attente de vérification par nos équipes. Votre commande sera expédiée dès réception des fonds (24 à 48h ouvrées).
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/40 bg-success/5 p-4 text-left">
        <svg width="20" height="20" className="mt-0.5 shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>
        <div>
          <div className="font-display text-sm font-semibold text-success">Virement signalé avec succès</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Notre équipe vérifie la réception des fonds. Vous recevrez un email d'expédition sous 24 à 48h ouvrées.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-accent"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em]">Résumé de la commande</h3>
        </div>
        <div className="mt-4 space-y-1.5 text-sm">
          {snapshot.map((it) => (
            <div key={itemKey(it.slug, it.dosage)} className="flex justify-between text-muted-foreground">
              <span>
                <span className="text-foreground">{it.name}</span> <span className="font-mono text-xs">×{it.qty}</span>
              </span>
              <span className="text-foreground">{formatPrice(it.price * it.qty).replace(" €", " EUR")}</span>
            </div>
          ))}
          <div className="flex justify-between text-muted-foreground">
            <span>Livraison</span>
            <span className="text-foreground">{shippingFee === 0 ? "Gratuit" : formatPrice(shippingFee).replace(" €", " EUR")}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3">
            <span className="font-semibold">Total</span>
            <span className="font-display text-base font-semibold">{formatPrice(total).replace(" €", " EUR")}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>Commande</span>
            <span className="font-mono font-semibold text-foreground">{orderRef}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Link to="/" className="block font-display text-sm font-medium text-accent hover:underline">
          Retour à l'accueil →
        </Link>
      </div>
    </div>
  );
}
