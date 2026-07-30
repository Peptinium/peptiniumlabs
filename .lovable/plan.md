
## Mon avis avant tout

Ce que PTM fait très bien et qu'on doit reprendre :
- **Hauteur de preuve** dès le hero (COA Janoshik cliquable, badge lot certifié)
- **"L'envers du décor"** — humanise énormément, casse l'effet "site fantôme"
- **Témoignages avec photos de colis reçus** — c'est ce qui convertit
- **Marquee du haut** (livraison / pureté / expédition) — signal de sérieux immédiat
- **Regroupement "Avis & Contact"** dans une seule page — simple, moins de dispersion
- **Menu court** : Boutique / Guide / Blog / Avis & Contact — clair, focus achat

Ce qu'on garde de **notre** site (mieux que PTM) :
- Ta DA colorée gradient cyan→magenta (PTM est en noir/blanc/rouge — plus froid)
- Système de packs accessoires + ajout rapide solvant
- Calculatrice, comparateur, COA catalogue
- Auth / compte / panier / paiement crypto déjà en place

Mon verdict : **oui à la refonte Home + Boutique + Guide + Avis&Contact** (regroupés), on garde le reste tel quel.

## Pages touchées

### 1. Home (`src/routes/index.tsx`) — refonte complète
Nouvelle structure verticale :
1. **Marquee défilant** en tout haut : "Livraison offerte dès 100€ ✦ Pureté ≥99% HPLC ✦ Expédié en 24h ✦ Paiement crypto anonyme"
2. **Hero XXL** "Précision. Pureté. Performance." (typo Sora massive, ponctuation en gradient brand) + trio flacons Retatrutide/GHK-Cu/MT-2 à droite
3. **Bloc COA / Preuve indépendante** avec image d'un certificat + lien Janoshik
4. **Meilleures ventes** — 4 cards produits (Retatrutide, Pack CJC+IPA, GHK-Cu, BPC-157)
5. **L'envers du décor** — marquee horizontal d'images labo/coulisses + carrousel témoignages avec photos clients + colis
6. **Packs curatés** — Pack Essentiel / Pack Premium mis en vedette
7. **Communauté** — 2 cartes Telegram / Discord côte à côte
8. **FAQ** accordéon (6 questions)
9. Footer existant

### 2. Boutique (`src/routes/produits.index.tsx`) — refactor visuel
- Header de catégorie épuré style PTM
- Grille produits avec badges pureté + prix barré si promo
- Filtres par catégorie en pills horizontales

### 3. Guide (nouvelle route `src/routes/guide.tsx`)
Regroupe : calculatrice + comparateur + études scientifiques + process fabrication + FAQ étendue, dans une page unique avec ancres.

### 4. Avis & Contact (nouvelle route `src/routes/avis-contact.tsx`)
Regroupe : témoignages complets + formulaire contact + Telegram/Discord + support. Remplace `/contact` et `/support` (redirections).

### 5. Header (`src/components/Header.tsx`)
Menu simplifié : **Boutique · Guide · Blog · Avis & Contact** + panier / compte à droite.

## Contenu généré

Images à générer avec `imagegen` (fast, transparent où pertinent) :
- 6 photos "coulisses" (préparation commande, flacons scellés, ambiance labo — dans tes couleurs)
- 6 avatars clients neutres + 6 photos de colis Peptinium reçus
- 1 image certificat COA stylisée pour la section preuve

## Détails techniques

- **DA verrouillée** : aucun `text-white` / `bg-black` hardcodé, uniquement tokens (`--foreground`, `--gradient-brand`, `logo-gradient-text`, `brand-gradient-cta`)
- **Marquee** : `@keyframes marquee` déjà présent dans `styles.css`, réutilisé
- **FAQ accordéon** : composant `shadcn/ui accordion` déjà installé
- **SEO** : chaque nouvelle route a son `head()` avec title/description/og uniques
- **Anciennes routes** (`/contact`, `/support`, `/calculatrice`, `/comparateur`, `/etudes-scientifiques`, `/process-fabrication`) → conservées mais deviennent des ancres du `/guide` — on met des redirects côté route pour éviter les 404 des liens externes/blog
- **Pas de changement backend** : aucune migration Supabase, aucun serverFn touché, on ne fait que du présentationnel

## Ce que je NE touche PAS

- Panier / auth / paiement / crypto watcher
- Fiches produit détaillées (`produits.$slug.tsx`) — trop de logique métier
- Compte / admin
- Tokens de couleur `src/styles.css`
- Backend, sécurité, RLS

## Ordre d'exécution

1. Générer les visuels coulisses + témoignages + COA
2. Créer `guide.tsx` et `avis-contact.tsx` (regroupent l'existant)
3. Ajouter redirects sur les anciennes routes
4. Simplifier `Header.tsx`
5. Refonte `index.tsx` (marquee + hero + COA + best sellers + coulisses + témoignages + packs + communauté + FAQ)
6. Refactor visuel `produits.index.tsx`
7. Build check

**Estimation :** ~15-20 fichiers créés/modifiés, tout en frontend. Aucun risque de régression backend.
