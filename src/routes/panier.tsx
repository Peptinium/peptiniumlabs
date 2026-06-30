import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { placeOrder } from "@/lib/orders.functions";
import { getMyProfile } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — Peptinium Labs" },
      { name: "description", content: "Finalisez votre commande de réactifs peptidiques de recherche." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PanierPage,
});

type Step = "livraison" | "paiement" | "virement" | "confirmation";
type PayMethod = "bank" | "card" | "crypto";

const PROMO_CODE = "WELCOME10";
const PROMO_RATE = 0.10;

function PanierPage() {
  const cart = useCart();
  const submitOrderFn = useServerFn(placeOrder);
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
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("bank");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState(false);
  const [researchAcceptedAt, setResearchAcceptedAt] = useState<string | null>(null);
  const [cgvAcceptedAt, setCgvAcceptedAt] = useState<string | null>(null);
  const fetchProfile = useServerFn(getMyProfile);

  // Prefill shipping from profile when user is authenticated
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      try {
        const res = await fetchProfile();
        if (cancelled) return;
        setShipping((prev) => ({
          email: prev.email || res.email || "",
          firstName: prev.firstName || res.profile?.first_name || "",
          lastName: prev.lastName || res.profile?.last_name || "",
          mobile: prev.mobile || res.profile?.phone || "",
          address: prev.address || res.profile?.address_line || "",
          address2: prev.address2 || res.profile?.address_line2 || "",
          postal: prev.postal || res.profile?.postal_code || "",
          city: prev.city || res.profile?.city || "",
          country: prev.country || res.profile?.country || "France",
        }));
      } catch {
        // ignore prefill errors
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  const isEmpty = cart.items.length === 0 || cart.count === 0;

  const subtotal = Number.isFinite(cart.subtotal) ? cart.subtotal : 0;
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
  const discount = promoApplied ? subtotal * PROMO_RATE : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleConfirmPaiement = async () => {
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const methodLabel =
        paymentMethod === "card"
          ? "Carte bancaire (lien différé)"
          : paymentMethod === "crypto"
            ? "Crypto (Bitcoin)"
            : "Virement bancaire";
      const consentNote =
        `[Méthode : ${methodLabel}]\n` +
        `[Certification RUO acceptée le ${researchAcceptedAt ?? new Date().toISOString()}]\n` +
        `[CGV acceptées le ${cgvAcceptedAt ?? new Date().toISOString()}]` +
        (promoApplied ? `\n[Code promo ${PROMO_CODE} appliqué : −${(PROMO_RATE * 100).toFixed(0)} %]` : "");
      const res = await submitOrderFn({
        data: {
          shipping: {
            email: shipping.email,
            firstName: shipping.firstName,
            lastName: shipping.lastName,
            phone: shipping.mobile || null,
            address: shipping.address,
            address2: shipping.address2 || null,
            postal: shipping.postal,
            city: shipping.city,
            country: shipping.country,
            notes: consentNote,
          },
          items: cart.items.map((it) => ({
            slug: it.slug,
            name: `${it.name} ${it.dosage}`.trim(),
            quantity: it.qty,
            unitPrice: it.price,
          })),
          shippingFee,
          paymentMethod,
        },
      });
      setOrderRef(res.orderNumber);
      setStep("virement");
    } catch (e: any) {
      setSubmitError(e?.message ?? "Erreur lors de l'enregistrement de la commande");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="container-prose flex items-center gap-2 py-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Peptinium</Link>
          <span className="text-border">›</span>
          <span className="text-foreground">Panier</span>
        </div>
      </div>

      <div className="container-prose py-10 sm:py-14">
        {step !== "confirmation" && step !== "virement" && (
          <Stepper step={step} />
        )}

        {isEmpty && step !== "confirmation" ? (
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
              discount={discount}
              total={total}
              promoApplied={promoApplied}
              onApplyPromo={(code) => {
                if (code.trim().toUpperCase() === PROMO_CODE) {
                  setPromoApplied(true);
                  return true;
                }
                return false;
              }}
              onRemovePromo={() => setPromoApplied(false)}
              editable
            />
          </div>
        ) : step === "paiement" ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <PaiementBlock
              shipping={shipping}
              onBack={() => setStep("livraison")}
              onConfirm={handleConfirmPaiement}
              submitting={submitting}
              error={submitError}
              researchAcceptedAt={researchAcceptedAt}
              setResearchAcceptedAt={setResearchAcceptedAt}
              cgvAcceptedAt={cgvAcceptedAt}
              setCgvAcceptedAt={setCgvAcceptedAt}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <Recap
              cart={cart}
              subtotal={subtotal}
              shipping={shippingFee}
              discount={discount}
              total={total}
              promoApplied={promoApplied}
              collapsed
            />
          </div>
        ) : step === "virement" ? (
          <VirementBlock
            total={total}
            orderRef={orderRef}
            paymentMethod={paymentMethod}
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
            paymentMethod={paymentMethod}
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
  submitting = false,
  error = null,
  researchAcceptedAt,
  setResearchAcceptedAt,
  cgvAcceptedAt,
  setCgvAcceptedAt,
  paymentMethod,
  setPaymentMethod,
}: {
  shipping: any;
  onBack: () => void;
  onConfirm: () => void | Promise<void>;
  submitting?: boolean;
  error?: string | null;
  researchAcceptedAt: string | null;
  setResearchAcceptedAt: (v: string | null) => void;
  cgvAcceptedAt: string | null;
  setCgvAcceptedAt: (v: string | null) => void;
  paymentMethod: PayMethod;
  setPaymentMethod: (v: PayMethod) => void;
}) {
  const acceptedResearch = !!researchAcceptedAt;
  const acceptedCgv = !!cgvAcceptedAt;
  const [cgvOpen, setCgvOpen] = useState(false);
  const fmtTs = (iso: string) =>
    new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" });

  const methods: Array<{
    id: PayMethod;
    title: string;
    icon: React.ReactNode;
    lines: React.ReactNode[];
  }> = [
    {
      id: "bank",
      title: "Virement Bancaire",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-7M15 21v-7"/></svg>
      ),
      lines: [
        <>Coordonnées IBAN envoyées par email après validation.</>,
        <><strong className="text-foreground">Délai d'envoi : sous 24 h.</strong> Expédition à réception des fonds.</>,
      ],
    },
    {
      id: "card",
      title: "Carte Bancaire (lien sécurisé)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/></svg>
      ),
      lines: [
        <>Lien de paiement carte bancaire sécurisé envoyé par email après validation.</>,
        <><strong className="text-foreground">Délai d'envoi : sous 24 h.</strong> Paiement instantané ensuite.</>,
      ],
    },
    {
      id: "crypto",
      title: "Crypto — Bitcoin (BTC)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893L7.116 11.15m6.224-6.91-1.5 8.508m-3.776-.066-1.5 8.509m6.526-15.85L8.34 4.244m6.224 6.91L8.34 4.243"/></svg>
      ),
      lines: [
        <>Adresse BTC unique envoyée par email après validation.</>,
        <><strong className="text-foreground">Délai d'envoi : sous 24 h.</strong> Expédition après confirmation on-chain.</>,
      ],
    },
  ];

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
        <div className="space-y-3">
          {methods.map((m) => {
            const active = paymentMethod === m.id;
            return (
              <label
                key={m.id}
                className={`block cursor-pointer rounded-2xl border p-5 transition-all ${
                  active ? "border-accent ring-1 ring-accent bg-accent/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-5 place-items-center rounded-full border-2 ${active ? "border-accent" : "border-border"}`}>
                    <span className={`size-2.5 rounded-full ${active ? "bg-accent" : ""}`} />
                  </span>
                  <span className="flex items-center gap-2 font-display text-base font-medium">
                    {m.title}
                    {m.icon}
                  </span>
                </div>
                <div className="mt-3 space-y-1 pl-8 text-sm text-muted-foreground">
                  {m.lines.map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </div>
                <input
                  type="radio"
                  name="method"
                  checked={active}
                  onChange={() => setPaymentMethod(m.id)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs text-foreground">
          <svg width="14" height="14" className="mt-0.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <span>Tous nos paiements sont <strong>traités manuellement sous 24 h</strong> pour garantir la confidentialité et la sécurité de votre commande.</span>
        </div>
      </div>


      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-surface/60 p-3.5 text-xs text-muted-foreground">
        <svg width="14" height="14" className="mt-0.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <span><strong className="text-foreground">Transaction sécurisée :</strong> votre paiement est traité avec discrétion par notre partenaire financier certifié.</span>
      </div>

      <div className={`rounded-2xl border p-4 ${acceptedResearch ? "border-success/50 bg-success/5" : "border-border bg-card"}`}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acceptedResearch}
            onChange={(e) => setResearchAcceptedAt(e.target.checked ? new Date().toISOString() : null)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[color:var(--color-accent)]"
          />
          <span className="text-sm text-foreground">
            Je certifie acheter ces composés <strong>exclusivement à des fins de recherche scientifique en laboratoire</strong> (Research Use Only) et m'engage à ne les destiner à <strong>aucun usage humain ou animal</strong>.
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {acceptedResearch
                ? `✓ Certifié le ${fmtTs(researchAcceptedAt!)}`
                : "Certification horodatée et conservée comme preuve"}
            </span>
          </span>
        </label>
      </div>

      <div className={`rounded-2xl border p-4 ${acceptedCgv ? "border-success/50 bg-success/5" : "border-border bg-card"}`}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acceptedCgv}
            onChange={(e) => setCgvAcceptedAt(e.target.checked ? new Date().toISOString() : null)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[color:var(--color-accent)]"
          />
          <span className="text-sm text-foreground">
            J'ai lu et j'accepte les{" "}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setCgvOpen((o) => !o); }}
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              Conditions Générales de Vente
            </button>
            {" "}ci-dessous.
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {acceptedCgv
                ? `✓ Accepté le ${fmtTs(cgvAcceptedAt!)}`
                : "Acceptation horodatée et conservée comme preuve"}
            </span>
          </span>
        </label>
        {cgvOpen && (
          <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
            <CgvFullText />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={!acceptedCgv || !acceptedResearch || submitting}
        className="group relative w-full overflow-hidden rounded-xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6"/></svg>
          {submitting ? "Enregistrement…" : "Confirmer la commande"}
        </span>
      </button>

    </div>
  );
}

function CgvFullText() {
  const sections: { h: string; p: string }[] = [
    { h: "Article 1 – Objet et champ d'application", p: "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre le vendeur Peptinium – Micro-entreprise, 75017 Paris, SIRET 102 457 652 00018, TVA non applicable – franchise en base (article 293 B du CGI), et le client professionnel de recherche en laboratoire. Le site propose à la vente des produits chimiques et réactifs destinés exclusivement à la recherche scientifique en laboratoire (usage in vitro uniquement). Toute commande implique l'acceptation sans réserve des présentes CGV." },
    { h: "Article 2 – Produits – Usage strictement réservé", p: "Les produits vendus sont strictement destinés à un usage de recherche en laboratoire (Research Use Only – RUO). Ils ne sont ni des médicaments, ni des compléments alimentaires, ni des produits destinés à un usage vétérinaire, diagnostique ou thérapeutique. Le client déclare et garantit qu'il utilise les produits exclusivement dans le cadre de travaux de recherche, d'études ou d'analyses en laboratoire. Le vendeur décline toute responsabilité en cas d'utilisation autre que celle expressément prévue (recherche in vitro), notamment en cas d'administration à des animaux, d'utilisation thérapeutique, cosmétique ou alimentaire." },
    { h: "Article 3 – Commande et acceptation", p: "Le client déclare avoir pris connaissance et accepté les présentes CGV avant de valider sa commande. Toute commande est ferme et définitive dès validation du paiement. Le vendeur se réserve le droit de refuser toute commande s'il a un doute sur l'usage réel qui sera fait des produits. L'acceptation des CGV est matérialisée par le cochement de la case « J'accepte les conditions générales de vente » avant la validation du paiement." },
    { h: "Article 4 – Prix et paiement", p: "Les prix sont indiqués en euros toutes taxes comprises (TTC). La TVA n'est pas applicable – franchise en base (article 293 B du CGI). Le paiement est exigible immédiatement à la commande et s'effectue par les moyens de paiement proposés sur le site." },
    { h: "Article 5 – Livraison", p: "Les produits sont expédiés dans un emballage neutre et discret, sans mention du contenu à l'extérieur du colis. Les délais de livraison (48 à 72h ouvrées) sont donnés à titre indicatif. Le client est seul responsable du respect des réglementations locales applicables à l'importation et à l'utilisation des produits." },
    { h: "Article 6 – Droit de rétractation", p: "Conformément à l'article L.221-18 du Code de la consommation, le client dispose d'un droit de rétractation de 14 jours à compter de la réception des produits. Toutefois, conformément à l'article L.221-28, ce droit ne peut être exercé pour les produits ayant été ouverts, reconstitués ou dont le conditionnement scellé a été altéré après livraison. Aucun retour ni remboursement ne sera accepté pour tout produit dont le conditionnement scellé a été ouvert." },
    { h: "Article 7 – Garantie et responsabilité", p: "Les produits sont vendus en l'état, sans aucune garantie d'usage particulier. Le vendeur ne pourra en aucun cas être tenu responsable de l'utilisation qui sera faite des produits par le client. Le client assume l'entière responsabilité de l'usage qu'il fait des produits, y compris en cas de mauvaise utilisation, d'erreur de manipulation ou d'usage non conforme à leur destination (recherche in vitro)." },
    { h: "Article 8 – Usage strictement réservé – Engagement du client", p: "Le client s'engage expressément à n'utiliser les produits que dans un cadre de recherche scientifique en laboratoire. Toute utilisation animale, thérapeutique, diagnostique ou cosmétique n'est pas promue et relève de la seule responsabilité du client. Le vendeur se réserve le droit de refuser toute commande s'il a un doute sur l'usage réel qui sera fait des produits." },
    { h: "Article 9 – Données personnelles", p: "Les données collectées sont traitées conformément au RGPD. Elles ne sont utilisées que pour le traitement des commandes et la relation client. Le client dispose d'un droit d'accès, de rectification et d'opposition qu'il peut exercer par email à l'adresse indiquée sur le site." },
    { h: "Article 10 – Preuve et conservation des contrats", p: "Le fait de cocher la case « J'accepte les conditions générales de vente » avant la validation du paiement constitue une acceptation irrévocable et sans réserve des présentes. Les contrats sont archivés par le vendeur." },
    { h: "Article 11 – Loi applicable et juridiction", p: "Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents. Ces CGV sont valables pour toute commande passée sur le site peptidesfr.com." },
  ];
  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <div key={s.h}>
          <div className="font-display text-[13px] font-semibold text-foreground">{s.h}</div>
          <p className="mt-1">{s.p}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────── RECAP ───────────────────────────
function Recap({
  cart,
  subtotal,
  shipping,
  discount = 0,
  total,
  promoApplied = false,
  onApplyPromo,
  onRemovePromo,
  editable = false,
  collapsed = false,
}: {
  cart: ReturnType<typeof useCart>;
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  promoApplied?: boolean;
  onApplyPromo?: (code: string) => boolean;
  onRemovePromo?: () => void;
  editable?: boolean;
  collapsed?: boolean;
}) {
  const [open, setOpen] = useState(!collapsed);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
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
          {cart.items
            // Hide water row only when at least one peptide is in the cart —
            // in that case water is managed by the dedicated "Solvant" panel below.
            .filter((it) => !(it.slug === EAU_SLUG && cart.peptideCount > 0))
            .map((it) => (
              <CartLine key={itemKey(it.slug, it.dosage)} item={it} editable={editable} />
            ))}

          {editable && cart.peptideCount > 0 && (
            <SolventLine />
          )}
        </div>
      )}


      {editable && (
        <div className="rounded-2xl border border-border bg-card p-4">
          {promoApplied ? (
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-success">
                ✓ {PROMO_CODE} appliqué (−{(PROMO_RATE * 100).toFixed(0)} %)
              </span>
              <button
                type="button"
                onClick={() => { onRemovePromo?.(); setPromoInput(""); setPromoError(null); }}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive"
              >
                Retirer
              </button>
            </div>
          ) : !promoOpen ? (
            <button
              type="button"
              onClick={() => setPromoOpen(true)}
              className="block w-full text-left font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
            >
              Saisir un code de réduction
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPromoError(null);
                const ok = onApplyPromo?.(promoInput) ?? false;
                if (!ok) setPromoError("Code promo invalide.");
              }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Code de réduction"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm uppercase tracking-wider outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-background hover:bg-accent/90"
                >
                  Appliquer
                </button>
              </div>
              {promoError && <div className="text-xs text-destructive">{promoError}</div>}
            </form>
          )}
        </div>
      )}

      <div className="space-y-1.5 rounded-2xl border border-border bg-card p-5 text-sm">
        <Row label="Sous-total" value={formatPrice(subtotal)} />
        {discount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>Remise {PROMO_CODE}</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <Row label="Livraison 48-72h" value={shipping === 0 ? "Gratuit" : formatPrice(shipping)} />
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

// ─────────────────────────── CONFIRMATION DE COMMANDE (post-checkout) ───────
function VirementBlock({
  total,
  orderRef,
  paymentMethod,
  cart,
  subtotal,
  shippingFee,
  onSignaled,
}: {
  total: number;
  orderRef: string;
  paymentMethod: PayMethod;
  cart: ReturnType<typeof useCart>;
  subtotal: number;
  shippingFee: number;
  onSignaled: () => void;
}) {
  const config = (() => {
    if (paymentMethod === "card") {
      return {
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M2 10h20" />
          </svg>
        ),
        title: "Votre lien de paiement arrive",
        intro: "Vous recevrez sous 24 h par email un lien sécurisé pour régler par carte bancaire.",
        boxTitle: "En attente du lien de paiement",
        boxText: "Notre équipe valide votre commande, puis vous envoie un lien de paiement carte bancaire sécurisé à l'adresse email indiquée. Le délai d'envoi est généralement de quelques heures (max 24 h ouvrées).",
        cta: "J'ai compris, je patiente",
      };
    }
    if (paymentMethod === "crypto") {
      return {
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893L7.116 11.15m6.224-6.91-1.5 8.508m-3.776-.066-1.5 8.509m6.526-15.85L8.34 4.244m6.224 6.91L8.34 4.243m-.225 1.281L4 4.808" />
          </svg>
        ),
        title: "Adresse de paiement crypto",
        intro: "Vous recevrez sous 24 h par email l'adresse Bitcoin de réception pour régler votre commande.",
        boxTitle: "En attente de l'adresse Bitcoin",
        boxText: "Notre équipe valide votre commande et vous envoie l'adresse BTC unique à utiliser. Le délai d'envoi est généralement de quelques heures (max 24 h ouvrées).",
        cta: "J'ai compris, je patiente",
      };
    }
    return {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6" />
        </svg>
      ),
      title: "Coordonnées de virement",
      intro: "Effectuez le virement bancaire ci-dessous pour confirmer votre commande.",
      boxTitle: "Coordonnées bancaires",
      boxText: "Vous recevrez sous 24 h par email les coordonnées bancaires (IBAN/BIC) pour effectuer votre virement. Notre équipe valide manuellement chaque commande avant envoi.",
      cta: "J'ai compris, j'attends les coordonnées",
    };
  })();

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full border border-border bg-card text-accent">
          {config.icon}
        </div>
        <h1 className="mt-4 font-display text-3xl font-medium">Commande enregistrée</h1>
        <p className="mt-2 text-sm text-muted-foreground">{config.intro}</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Référence commande</div>
          <div className="mt-1 font-mono text-base font-semibold tracking-wide text-foreground">{orderRef}</div>
        </div>
        <div className="border-b border-border p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Montant</div>
          <div className="mt-1 font-display text-xl font-semibold">{formatPrice(total).replace(" €", "")} EUR</div>
        </div>
        <div className="border-b border-border bg-accent/5 p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">{config.boxTitle}</div>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{config.boxText}</p>
        </div>

        <div className="bg-surface p-5">
          <button
            onClick={onSignaled}
            className="group relative w-full overflow-hidden rounded-xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-accent/90"
          >
            <span className="inline-flex items-center justify-center gap-2">✓ {config.cta}</span>
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            Vous pouvez suivre l'état de votre commande dans votre espace client.
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
              <span className="text-foreground">{it.slug === EAU_SLUG ? "Solvant (Eau bactériostatique)" : it.name}</span> <span className="font-mono text-xs">×{it.qty}</span>
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
  paymentMethod,
  onDone,
}: {
  total: number;
  orderRef: string;
  cart: ReturnType<typeof useCart>;
  subtotal: number;
  shippingFee: number;
  paymentMethod: PayMethod;
  onDone: () => void;
}) {
  // Snapshot once at mount, BEFORE cart.clear() runs in effect below.
  // useState initializer is guaranteed to run exactly once even under StrictMode.
  const [snap] = useState(() => ({
    items: cart.items.map((i) => ({ ...i })),
    total,
    subtotal,
    shippingFee,
  }));
  const cleared = useRef(false);
  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const COPY: Record<PayMethod, { title: string; intro: string; boxTitle: string; boxText: string }> = {
    bank: {
      title: "Virement signalé",
      intro: "Paiement signalé, en attente de vérification par nos équipes. Votre commande sera expédiée dès réception des fonds (48 à 72h ouvrées).",
      boxTitle: "Virement signalé avec succès",
      boxText: "Notre équipe vérifie la réception des fonds. Vous recevrez un email d'expédition sous 48 à 72h ouvrées.",
    },
    card: {
      title: "Commande enregistrée",
      intro: "Votre commande est bien enregistrée. Vous recevrez sous 24 h ouvrées un email contenant le lien de paiement carte bancaire sécurisé.",
      boxTitle: "Lien de paiement en cours d'envoi",
      boxText: "Notre équipe vous transmet votre lien de paiement personnalisé à l'adresse email indiquée. Une fois réglé, vous recevrez la confirmation et le suivi.",
    },
    crypto: {
      title: "Commande enregistrée",
      intro: "Votre commande est bien enregistrée. Vous recevrez sous 24 h ouvrées un email avec l'adresse Bitcoin à utiliser pour le règlement.",
      boxTitle: "Adresse BTC en cours d'envoi",
      boxText: "Notre équipe vous transmet une adresse BTC unique dédiée à votre commande. Vous pourrez ensuite régler depuis votre wallet préféré.",
    },
  };
  const c = COPY[paymentMethod];

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 12 5 5L20 7"/></svg>
      </div>
      <h1 className="mt-4 font-display text-3xl font-medium">{c.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.intro}</p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/40 bg-success/5 p-4 text-left">
        <svg width="20" height="20" className="mt-0.5 shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>
        <div>
          <div className="font-display text-sm font-semibold text-success">{c.boxTitle}</div>
          <p className="mt-1 text-xs text-muted-foreground">{c.boxText}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-accent"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em]">Résumé de la commande</h3>
        </div>
        <div className="mt-4 space-y-1.5 text-sm">
          {snap.items.map((it) => (
            <div key={itemKey(it.slug, it.dosage)} className="flex justify-between text-muted-foreground">
              <span>
                <span className="text-foreground">{it.slug === EAU_SLUG ? "Solvant (Eau bactériostatique)" : it.name}</span> <span className="font-mono text-xs">×{it.qty}</span>
              </span>
              <span className="text-foreground">{formatPrice(it.price * it.qty).replace(" €", " EUR")}</span>
            </div>
          ))}
          <div className="flex justify-between text-muted-foreground">
            <span>Livraison</span>
            <span className="text-foreground">{snap.shippingFee === 0 ? "Gratuit" : formatPrice(snap.shippingFee).replace(" €", " EUR")}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3">
            <span className="font-semibold">Total</span>
            <span className="font-display text-base font-semibold">{formatPrice(snap.total).replace(" €", " EUR")}</span>
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
