# Peptinium Labs

Application web full-stack construite avec **TanStack Start** (React 19 + Vite 7), hébergée sur **Lovable Cloud**.

## Stack technique

- **Frontend** : React 19, TanStack Router, TanStack Query, Tailwind CSS v4, shadcn/ui (Radix)
- **Backend** : TanStack Server Functions (`createServerFn`), Supabase (Lovable Cloud)
- **Build** : Vite 7, TypeScript strict, Bun
- **Paiement** : PeptidePay + paiement crypto direct (BTC / USDC Polygon / LTC)

## Prérequis

- [Bun](https://bun.sh/) installé (version recommandée : latest stable)
- Compte Lovable avec accès au projet connecté
- Secrets configurés dans l'environnement (voir section "Secrets")

## Installation

```bash
git clone https://github.com/Peptinium/peptinium.git
cd peptinium
bun install
```

## Scripts

```bash
bun dev          # Démarre le serveur de développement
bun build        # Build de production
bun build:dev    # Build en mode développement
bun preview      # Prévisualise le build local
bun lint         # Linte le projet avec ESLint
bun format       # Formate le projet avec Prettier
```

## Structure du projet

```
peptiniumlabs/
├── src/              # Code source React + server functions
│   ├── components/   # Composants React réutilisables
│   ├── hooks/        # Hooks personnalisés
│   ├── integrations/ # Intégrations Supabase / email / webhooks
│   ├── lib/          # Utilitaires et helpers
│   ├── routes/       # Routes TanStack Router
│   └── styles.css    # Tokens Tailwind CSS v4
├── public/           # Assets statiques publics
├── supabase/         # Migrations, seed, functions
├── .lovable/         # Plan, design system et mémoire du projet
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Configuration des secrets

Les secrets suivants sont nécessaires pour le fonctionnement complet de l'application. **Ne les commit jamais** dans le repo — ils sont gérés côté Lovable Cloud (Production) ou dans un fichier `.env` local (Développement).

### Secrets obligatoires

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL de l'instance Lovable Cloud Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publique Supabase (anon) |
| `WALLET_BTC` | Adresse de réception Bitcoin |
| `WALLET_USDC_POLYGON` | Adresse de réception Polygon (0x...) |
| `WALLET_LTC` | Adresse de réception Litecoin |
| `PEPTIDEPAY_SECRET` | Clé secrète pour les webhooks PeptidePay |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Clés pour les notifications push web |

### En développement local

Copier le fichier `.env` fourni et le remplir avec les bonnes valeurs :

```bash
cp .env .env.local
```

> **Attention** : le fichier `.env` du repo Lovable ne contient que les clés publiques Supabase. Les secrets sensibles ne sont pas exportés via GitHub.

## Déploiement

### Lovable (recommandé pour le développement)

1. Pousse les modifications sur GitHub (`main`).
2. Lovable synchronise automatiquement le code.
3. Clique sur **Publish** dans l'interface Lovable pour déployer en production.

### Auto-hébergement (Vercel, Cloudflare Pages, etc.)

1. Connecter le repo GitHub à la plateforme d'hébergement.
2. Configurer les variables d'environnement listées ci-dessus.
3. Définir la commande de build : `bun run build`.
4. Pointer le domaine personnalisé (`peptinium.com`) en dernier.

Pour plus de détails, consulter le guide de migration interne : `peptinium-migration-guide.txt` (si présent) ou la documentation Lovable.

## Notes importantes pour l'export GitHub

- Le repo GitHub contient **tout le code source**.
- Le repo GitHub **ne contient pas** : les données de la base de données, les secrets sensibles, ni les fichiers `.asset.json` (assets Lovable CDN).
- Pour exporter la base de données : Lovable Cloud → Advanced settings → Export data.
- Pour les assets : ils doivent être re-téléchargés depuis le CDN Lovable avant de basculer définitivement d'hébergement.

## License

Propriétaire — Peptinium Labs.
