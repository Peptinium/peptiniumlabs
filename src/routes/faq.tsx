import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { Search, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Toutes vos questions sur nos peptides de recherche · Peptinium Labs" },
      {
        name: "description",
        content:
          "30+ réponses aux questions fréquentes : commande, livraison, paiement crypto/CB, qualité HPLC, CoA, reconstitution, conservation, cadre RUO, programme fidélité Peptinium Club.",
      },
      { property: "og:title", content: "FAQ Peptinium Labs — Réponses aux questions labo" },
      { property: "og:description", content: "Commande, livraison, paiement, qualité, reconstitution, cadre RUO, fidélité." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_DATA.flatMap((section) =>
            section.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          ),
        }),
      },
    ],
  }),
  component: FaqPage,
});

type FaqItem = { q: string; a: string };
type FaqSection = { key: string; label: string; items: FaqItem[] };

// eslint-disable-next-line react-refresh/only-export-components
export const FAQ_DATA: FaqSection[] = [
  {
    key: "commande",
    label: "Commande & livraison",
    items: [
      {
        q: "Combien de temps prend l'expédition d'une commande ?",
        a: "Les commandes payées avant 15 h (heure de Paris) sont préparées le jour même et remises au transporteur sous 24 h ouvrées. La livraison en France métropolitaine prend ensuite 48 à 72 h, en Europe 2 à 5 jours ouvrés.",
      },
      {
        q: "Livrez-vous en dehors de l'Union européenne ?",
        a: "Pas encore. Nous expédions uniquement au sein de l'Union européenne pour le moment. Une ouverture vers d'autres pays (Suisse, Royaume-Uni, États-Unis, Canada, Australie) est à l'étude — le suivi est fourni dès l'expédition pour toutes les commandes UE.",
      },
      {
        q: "L'emballage est-il discret ?",
        a: "Oui. Colis neutre, sans logo ni mention Peptinium Labs à l'extérieur. Les flacons sont soigneusement calés dans un emballage rembourré pour absorber les chocs pendant le transport.",
      },
      {
        q: "Que se passe-t-il si mon colis est perdu ou endommagé ?",
        a: "Contactez le support avec une preuve (photos du colis et des flacons pour un dommage, ou capture du suivi bloqué pour une perte) et nous trouverons une solution adaptée : réexpédition ou remboursement selon le cas. Sans preuve, nous ne pouvons malheureusement pas ouvrir de dossier auprès du transporteur.",
      },

      {
        q: "Puis-je modifier une commande déjà passée ?",
        a: "Oui, tant qu'elle n'a pas été préparée. Contactez le support par email ou via la messagerie de votre espace client — la fenêtre de modification est en général de 2 à 4 heures après paiement.",
      },
    ],
  },
  {
    key: "paiement",
    label: "Paiement",
    items: [
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Carte bancaire (Visa / Mastercard / American Express), virement SEPA, et cryptomonnaies (Bitcoin, USDC sur Polygon, Litecoin). Le paiement crypto est sans intermédiaire et sans frais additionnels.",
      },
      {
        q: "Le paiement crypto est-il sûr et anonyme ?",
        a: "Oui. Vous payez directement sur nos adresses wallet, aucun tiers n'intervient. Aucun KYC n'est demandé. Seule la blockchain publique voit la transaction (adresse → adresse), aucune donnée client n'est transmise.",
      },
      {
        q: "Le prix en crypto est-il figé pendant que je paie ?",
        a: "Oui. À la génération du bon de paiement, le taux EUR → BTC / USDC / LTC est verrouillé pendant 20 minutes via CoinGecko. Au-delà, la commande est annulée et un nouveau bon est généré au taux courant.",
      },
      {
        q: "Quand ma commande est-elle validée ?",
        a: "Dès la première confirmation blockchain — environ 5 secondes pour USDC, 2 minutes pour LTC, 10 minutes pour BTC. Un email automatique de confirmation est envoyé à la validation.",
      },
      {
        q: "Puis-je payer en plusieurs fois ?",
        a: "Non pour le moment. Nous privilégions le paiement direct pour rester sans intermédiaire. Les remises quantité et le programme fidélité Peptinium Club sont là pour amortir les commandes plus importantes.",
      },
    ],
  },
  {
    key: "qualite",
    label: "Qualité & CoA",
    items: [
      {
        q: "Que signifie une pureté HPLC ≥ 99 % ?",
        a: "Que l'aire du pic principal du peptide représente au moins 99 % de l'aire totale détectée par HPLC en phase inverse. Les moins de 1 % restants sont des impuretés résiduelles (peptides tronqués, sels, solvants). C'est le standard analytique attendu en recherche.",
      },
      {
        q: "Qu'est-ce qu'un CoA et pourquoi est-il important ?",
        a: "Un Certificat d'Analyse est un rapport émis par un laboratoire tiers indépendant qui atteste de l'identité, de la pureté et de la quantification d'un lot précis. Il est indispensable pour toute donnée expérimentale défendable.",
      },
      {
        q: "Comment vérifier qu'un CoA n'a pas été retouché ?",
        a: "Chaque CoA Janoshik Analytical porte une clé alphanumérique unique. Vous la saisissez sur janoshik.com pour récupérer le rapport original directement chez le laboratoire. Sans cette vérification croisée, un PDF n'a aucune valeur scientifique.",
      },
      {
        q: "Vos CoA sont-ils par lot ou génériques ?",
        a: "Par lot, systématiquement. Deux synthèses ne sont jamais strictement identiques — pureté à 99,2 % vs 99,7 %, quantification à 9,9 mg vs 10,1 mg. Un CoA générique est par construction non conforme aux standards analytiques.",
      },
      {
        q: "Puis-je faire re-tester une de vos fioles ?",
        a: "Oui, c'est même recommandé. Nous avons publié un comparatif des 3 laboratoires indépendants (Janoshik, ChemRx, Colmaric) avec tarifs, délais et procédure d'envoi. Voir la page \"Tester ses fioles\".",
      },
    ],
  },
  {
    key: "reconstitution",
    label: "Reconstitution & conservation",
    items: [
      {
        q: "Comment reconstituer un peptide lyophilisé ?",
        a: "En laboratoire : introduire l'eau bactériostatique dans le flacon en laissant couler le liquide sur la paroi (jamais directement sur la poudre), puis agiter doucement par rotation. La solution doit être limpide, incolore, sans particules.",
      },
      {
        q: "Combien de temps se conserve un flacon lyophilisé ?",
        a: "24 mois minimum à −20 °C, à l'abri de la lumière. 12 mois à 2–8 °C si le flacon reste scellé. Toléré 5 à 7 jours à température ambiante pour le transport, sans perte d'activité mesurable.",
      },
      {
        q: "Et une solution reconstituée ?",
        a: "21 à 28 jours à 2–8 °C, à l'abri de la lumière, en eau bactériostatique (0,9 % alcool benzylique). Sans conservateur (WFI pure), la stabilité tombe à 24–72 h.",
      },
      {
        q: "Pourquoi ne jamais recongeler une solution reconstituée ?",
        a: "Chaque cycle gel/dégel forme des cristaux de glace qui désorganisent la structure et provoque un stress osmotique local. La perte d'activité analytique est mesurable dès le second cycle.",
      },
      {
        q: "Quels sont les signes visuels d'une solution dégradée ?",
        a: "Coloration jaune ou brune, précipité au fond du flacon, opalescence persistante, mousse stable après agitation. Dans ces cas, le peptide n'est plus exploitable, indépendamment de la pureté initiale.",
      },
    ],
  },
  {
    key: "cadre-legal",
    label: "Cadre légal & RUO",
    items: [
      {
        q: "Qu'est-ce que \"Research Use Only\" (RUO) ?",
        a: "C'est un statut réglementaire qui limite l'usage d'un produit à la recherche scientifique in vitro, en cadre professionnel. Il exclut tout usage humain, vétérinaire, diagnostique ou thérapeutique. Ce cadre est partagé par la majorité des fournisseurs académiques (Sigma-Aldrich, Bachem, Tocris).",
      },
      {
        q: "Est-il légal d'acheter des peptides de recherche en France ?",
        a: "Oui, tant qu'ils sont acquis et utilisés dans un cadre de recherche. Peptinium Labs ne vend pas de médicaments et ne fait aucune allégation thérapeutique. C'est à l'acheteur de garantir la conformité de son usage.",
      },
      {
        q: "Faut-il un statut particulier pour commander ?",
        a: "Non, il n'y a pas de vérification de statut à l'inscription. En cochant les conditions RUO, vous attestez que la commande est destinée à un usage de recherche dans un cadre professionnel.",
      },
      {
        q: "Vos peptides peuvent-ils être utilisés en médecine vétérinaire ?",
        a: "Non. Aucun de nos produits n'est autorisé pour un usage vétérinaire, diagnostique ou thérapeutique — humain ou animal. Le statut RUO l'interdit strictement.",
      },
    ],
  },
  {
    key: "compte-fidelite",
    label: "Compte & Peptinium Club",
    items: [
      {
        q: "Comment fonctionne le programme fidélité Peptinium Club ?",
        a: "Chaque euro dépensé est cumulé sur votre compte. Vous montez de palier automatiquement — Bronze (0-500 €), Argent (500-1500 €), Or (1500-3000 €), Platine (3000 €+) — avec un crédit permanent de 2 à 7 % applicable sur vos prochaines commandes.",
      },
      {
        q: "Les crédits fidélité expirent-ils ?",
        a: "Non. Le crédit accumulé n'a pas de date d'expiration. Vous pouvez l'utiliser en une ou plusieurs fois, sans minimum de commande.",
      },
      {
        q: "Puis-je cumuler la fidélité avec les packs quantité et les promos ?",
        a: "Oui. Les avantages Peptinium Club (crédit, réduction sur la livraison, eau bactériostatique offerte) sont cumulables avec les remises quantité et les promos du jour. C'est le principe même du programme.",
      },

      {
        q: "Comment sont appliquées les remises quantité ?",
        a: "Automatiquement au panier dès que le seuil est atteint. Sur le Retatrutide 10 mg : −7 % dès 3 flacons, −12 % dès 6 flacons. Le barème s'applique sur le prix de référence (99 €), pas sur la promo du jour.",
      },
      {
        q: "Puis-je changer mon adresse de livraison entre deux commandes ?",
        a: "Oui, à tout moment depuis votre espace client, onglet Profil. Vous pouvez enregistrer plusieurs adresses (labo, domicile) et choisir laquelle utiliser au moment du checkout.",
      },
      {
        q: "Comment supprimer mon compte ?",
        a: "Depuis l'onglet Profil de votre espace client, ou en écrivant au support. La suppression est effective sous 48 h et efface l'intégralité des données personnelles (RGPD). Les CoA et factures liés aux commandes passées restent archivés 10 ans pour raisons comptables.",
      },
    ],
  },
];

function FaqPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_DATA;
    return FAQ_DATA.map((s) => ({
      ...s,
      items: s.items.filter((i) => (i.q + " " + i.a).toLowerCase().includes(q)),
    })).filter((s) => s.items.length > 0);
  }, [query]);

  return (
    <SiteLayout>
      <div className="bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 45% at 82% 10%, color-mix(in oklab, var(--brand-cyan) 18%, transparent) 0%, transparent 70%), radial-gradient(50% 55% at 8% 92%, color-mix(in oklab, var(--brand-violet) 18%, transparent) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-14 lg:px-10 sm:pt-32">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                FAQ — Questions fréquentes
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1
                className="shimmer-text mt-8 max-w-5xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-[80px] sm:leading-[0.94]"
                data-shimmer="On répond à tout, sans langue de bois."
              >
                On répond à tout, sans langue de bois.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-10 max-w-2xl">
                <label className="flex items-center gap-3 rounded-full border border-border/70 bg-card px-5 py-3.5 focus-within:border-accent">
                  <Search className="size-4 text-muted-foreground" strokeWidth={1.7} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une question…"
                    className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
                  />
                </label>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-6 py-14 lg:px-10 sm:py-20">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune question ne correspond à « {query} ». Essayez un autre mot-clé.
            </p>
          )}
          <div className="space-y-14">
            {filtered.map((section) => (
              <div key={section.key}>
                <Reveal>
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    — {section.label}
                  </h2>
                  <div className="mt-2 h-px w-full bg-border/70" />
                </Reveal>
                <ul className="mt-6 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card">
                  {section.items.map((item, i) => {
                    const id = `${section.key}-${i}`;
                    const open = openId === id;
                    return (
                      <li key={id}>
                        <button
                          onClick={() => setOpenId(open ? null : id)}
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface"
                        >
                          <span className="font-display text-[16px] font-medium tracking-[-0.01em] text-foreground">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                            strokeWidth={1.7}
                          />
                        </button>
                        {open && (
                          <div className="px-6 pb-6 text-[14.5px] leading-[1.7] text-muted-foreground">
                            {item.a}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
