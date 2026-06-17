ns# Interface admin mobile complète

Tout est intégré à l'admin existant sur `/_authenticated/admin`, optimisé mobile (onglets en bas, cartes empilables, tables transformées en listes sur petit écran). Aucune app native — c'est une PWA installable depuis Safari/Chrome ("Ajouter à l'écran d'accueil"), donc utilisable comme une vraie app sur ton téléphone.

## Ce qui est ajouté

### 1. Commandes (existe, enrichi)
- Liste filtrable (statut, recherche par n° de commande / nom / email)
- Détail commande : produits, montants, client, adresse, notes
- Changement de statut : en attente → payée → expédiée → livrée → annulée
- Numéro de suivi colissimo/DHL optionnel

### 2. Validation manuelle des paiements
- Onglet "Paiements à valider" qui liste les commandes `pending` avec virement attendu
- Bouton "Marquer comme payée" → passe en `paid` + horodatage + email automatique de confirmation
- Champ note interne (référence virement, banque, etc.)

### 3. Suivi des stocks (existe, enrichi)
- Édition stock/prix/actif inline (déjà en place)
- Alerte visuelle si stock ≤ seuil bas (configurable par produit)
- Historique des mouvements de stock (vente, ajustement manuel, retour)
- Bouton "Ajuster stock" avec motif

### 4. Génération de factures PDF
- Bouton "Télécharger facture" sur chaque commande payée
- PDF généré côté serveur (pdf-lib, compatible Worker) avec logo Aetherion Labs, infos légales suisses/UE, TVA, mentions RUO
- Numérotation séquentielle annuelle : `FA-2026-0001`
- Stockage du n° de facture sur la commande pour rappel

### 5. Statistiques de ventes & attraction (avec graphiques)
- Onglet "Stats" avec cartes KPI : CA jour/semaine/mois, panier moyen, nb commandes, taux de conversion
- Graphiques (recharts, déjà installé) :
  - Ventes journalières (30 derniers jours)
  - Top produits (bar chart)
  - Sources de trafic & pages vues (tracking interne simple, table `page_views`)
- Sélecteur de période (7j / 30j / 90j / année)

### 6. Gestion des clients
- Onglet "Clients" : liste dérivée des commandes (regroupée par email)
- Détail client : commandes passées, CA total, dernière commande, adresses utilisées
- Note interne par client (allergies info, préférences…)
- Recherche par nom/email/téléphone

### 7. Système de tickets SAV
- Page publique `/support` : formulaire (n° commande + email + message + pièce jointe)
- Onglet admin "Support" : liste des tickets (ouvert / en cours / résolu / fermé)
- Vue conversation : réponses admin ↔ client, notifications email à chaque réponse
- Lien automatique vers la commande concernée

## Détails techniques

**Schéma DB ajouté**
- `invoices` (order_id, number, pdf_path, issued_at, total_eur, vat_eur)
- `stock_movements` (product_id, delta, reason, note, created_by)
- `payments` (order_id, method, amount, validated_at, validated_by, reference)
- `page_views` (path, referrer, session_id, user_agent, country, created_at)
- `support_tickets` (order_id?, email, subject, status, priority)
- `support_messages` (ticket_id, author_role, body, attachment_path)
- `customer_notes` (email, note, updated_by)
- Tous protégés RLS admin-only, écritures via service_role dans server functions

**Server functions** (`src/lib/admin/*.functions.ts`)
- `validatePayment`, `recordStockMovement`, `generateInvoicePdf`, `getStats`, `listCustomers`, `listTickets`, `replyTicket`, `submitTicket` (public)

**PDF**
- Génération via `pdf-lib` (pur JS, compatible Worker), pas de Chromium
- Stocké dans bucket Storage privé `invoices/`, URL signée à la demande

**Tracking de trafic**
- Hook léger dans `__root.tsx` qui POST sur `/api/public/track` (server route), insère dans `page_views` via service role
- Anonymisé : pas d'IP brute stockée, juste pays approximatif via header CF

**Mobile/PWA**
- Manifest + icônes pour installation à l'écran d'accueil
- Layout admin avec navigation par onglets en bas (style app native), responsive

**Emails transactionnels**
- Confirmation paiement, réponse SAV, notification commande expédiée — via Resend (à connecter)

## Phasage suggéré
Je propose de livrer en 2 vagues pour pouvoir tester :
- **Vague 1** : paiements, stock enrichi, factures PDF, clients, layout mobile/PWA
- **Vague 2** : stats avec graphiques + tracking trafic, tickets SAV

## À confirmer avant de coder
1. **Emails sortants** : tu veux que je branche Resend maintenant (il faudra une clé API et un domaine vérifié) ou les emails restent désactivés pour le moment ?
2. **TVA factures** : taux unique 20 % FR, ou multi-pays (FR 20 %, CH 8.1 %, autre UE selon pays client) ?
3. **Phasage** : on fait tout d'un coup ou Vague 1 puis Vague 2 ?
