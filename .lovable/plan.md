# Système de paiement crypto direct (sans plateforme tierce)

## Principe

Le client paie directement sur **tes adresses de wallet**. Aucun intermédiaire, 0% de frais plateforme. On détecte automatiquement la transaction entrante grâce aux APIs blockchain publiques (gratuites) et on valide la commande.

## Cryptos supportées

| Crypto | Réseau | API de vérification |
|---|---|---|
| **BTC** | Bitcoin | mempool.space (gratuit, no key) |
| **USDC** | Polygon | PolygonScan (gratuit, no key) |
| **LTC** | Litecoin | SoChain / BlockCypher (gratuit) |

## Fonctionnement (flow client)

1. Client choisit "Crypto" au checkout, puis sélectionne BTC / USDC / LTC
2. On récupère le taux EUR→crypto en temps réel via **CoinGecko** (API gratuite, no key)
3. On génère un **montant unique** (ex: 0.00234517 BTC au lieu de 0.002345) — les derniers chiffres servent d'identifiant pour matcher la transaction à la commande, même si plusieurs clients paient en même temps
4. On affiche : adresse wallet + montant exact + QR code + compte à rebours 20 min (fenêtre où le taux est garanti)
5. Client paie depuis son propre wallet (Metamask, Ledger, Binance, etc.)
6. Un cron backend scanne les transactions entrantes toutes les 60s, matche le montant unique, marque la commande comme payée et déclenche l'email de confirmation
7. Si non payé après 20 min → commande annulée, stock relâché

## Ce que je vais construire

### Backend
- Table `crypto_payments` (order_id, currency, wallet_address, amount_crypto, amount_eur, unique_amount, expires_at, tx_hash, status)
- Server function `createCryptoPayment` : calcule le montant unique, stocke, retourne les infos au client
- Route publique `/api/public/crypto-watcher` : cron qui scanne les 3 blockchains, match les paiements, met à jour les commandes
- Cron pg_cron toutes les 60 secondes qui appelle le watcher

### Frontend
- Option "Crypto (BTC / USDC / LTC)" dans le sélecteur de paiement
- Écran de paiement crypto avec QR code, adresse copiable, montant exact copiable, timer, statut live
- Page auto-refresh qui bascule sur "Paiement confirmé ✓" dès détection

### Secrets à ajouter (par toi)
- `WALLET_BTC` — ton adresse Bitcoin
- `WALLET_USDC_POLYGON` — ton adresse Polygon (0x...)
- `WALLET_LTC` — ton adresse Litecoin

## Points d'attention

- **Confirmations** : je valide dès 1 confirmation pour USDC (rapide, ~5s) et LTC (~2min), et 1 confirmation pour BTC aussi (~10min). Tu peux passer à 2-3 confirmations plus tard si tu veux plus de sécurité contre double-spend, au prix d'une attente plus longue pour le client.
- **Volatilité BTC/LTC** : le taux est figé 20 min. Si le cours bouge fortement pendant que le client paie, tu absorbes l'écart. USDC est stable (1 USDC = 1 USD) donc pas de risque.
- **Pas de remboursement automatique possible** : si un client envoie le mauvais montant ou après expiration, il faut rembourser manuellement depuis ton wallet. Je logge tout pour que ce soit traçable dans l'admin.
- **Anonymat préservé** : aucune KYC, aucune donnée envoyée à un tiers, les seuls "témoins" sont les APIs blockchain publiques (mempool.space etc.) qui ne voient qu'une adresse wallet → une transaction, aucune info client.

## Prêt à démarrer ?

Dis-moi "go" et je commence par créer la table + la structure. Je te demanderai les 3 adresses wallet via un formulaire sécurisé au moment où j'en aurai besoin (pas maintenant, tu peux les préparer tranquille).
