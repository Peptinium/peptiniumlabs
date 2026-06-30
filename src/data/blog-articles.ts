export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  readMinutes: number;
  category: "Science" | "Méthodologie" | "Pratique";
  tags: string[];
  /** Markdown-lite content (paragraphs + ## headings + - bullets). */
  body: string;
};

export const blogArticles: BlogArticle[] = [
  {
    slug: "reconstitution-peptides-eau-bacteriostatique",
    title: "Reconstitution d'un peptide lyophilisé : guide pas-à-pas avec eau bactériostatique",
    excerpt:
      "Volume de solvant, technique d'injection dans le flacon, stabilité après reconstitution : la procédure laboratoire complète.",
    description:
      "Méthode de reconstitution d'un peptide lyophilisé avec eau bactériostatique 0.9 % alcool benzylique. Calcul du volume, technique en goutte-à-goutte, conservation.",
    date: "2026-06-18",
    readMinutes: 6,
    category: "Méthodologie",
    tags: ["reconstitution", "eau bactériostatique", "stabilité"],
    body: `La reconstitution d'un peptide lyophilisé est l'étape la plus sous-estimée du protocole de recherche. Une mauvaise pratique peut dénaturer la molécule en quelques secondes.

## 1. Choisir le bon solvant
Pour la majorité des peptides courants (BPC-157, Tesamorelin, GHK-Cu, Melanotan II, Semax), **l'eau bactériostatique** (eau stérile + 0.9 % d'alcool benzylique) est le solvant standard. Elle assure :
- une stabilité de 21 à 28 jours à 2–8 °C après reconstitution
- une inhibition de la croissance bactérienne
- une compatibilité avec la majorité des séquences peptidiques

L'eau pour préparation injectable (WFI) sans conservateur réduit la stabilité à 24–72 h.

## 2. Calculer le volume
La règle pratique :
\`Volume (mL) = quantité totale (mg) / concentration cible (mg/mL)\`

Exemple : un flacon de BPC-157 5 mg reconstitué avec 2 mL d'eau bactériostatique donne 2.5 mg/mL, soit 250 µg par 100 µL.

Notre [calculatrice de dosage](/calculatrice) fait le calcul instantanément.

## 3. Technique d'injection dans le flacon
- Retirer le solvant avec une seringue stérile
- Incliner le flacon de peptide à 45°
- Injecter le solvant **le long de la paroi**, en goutte-à-goutte lent
- Ne **jamais** projeter directement sur le lyophilisat
- Faire tourner doucement (swirl) — ne pas agiter, la mousse dénature

## 4. Conservation
Une fois reconstitué :
- 2–8 °C au réfrigérateur, à l'abri de la lumière
- Ne pas congeler une solution reconstituée (cycles de gel/dégel = perte d'activité)
- Sortir uniquement le temps du prélèvement

## 5. Signaux d'alerte
Une solution trouble, jaunie, ou avec dépôt après reconstitution indique une dégradation. Le peptide est alors inutilisable pour la recherche analytique.
`,
  },
  {
    slug: "purete-hplc-comprendre-certificat-analyse",
    title: "Pureté HPLC ≥ 99 % : comment lire un Certificat d'Analyse Janoshik",
    excerpt:
      "Tâche, clé de vérification, masse molaire mesurée, intégration des pics : déchiffrer un CoA peptide ligne par ligne.",
    description:
      "Guide complet pour interpréter un Certificat d'Analyse HPLC d'un peptide de recherche. Lecture du chromatogramme, validation de la masse molaire par MS.",
    date: "2026-06-10",
    readMinutes: 7,
    category: "Science",
    tags: ["HPLC", "CoA", "Janoshik", "pureté"],
    body: `Un Certificat d'Analyse (CoA) n'a de valeur que s'il provient d'un laboratoire **indépendant**. Janoshik Analytical est la référence dans la recherche peptidique européenne.

## Les 4 éléments à vérifier

### 1. La clé de vérification
Chaque CoA porte une **clé alphanumérique unique** (ex. KYB39ZQFJ7DV). Saisissez-la sur [janoshik.com](https://janoshik.com) — le rapport original s'affiche. Sans cette validation croisée, le CoA n'a aucune valeur.

### 2. Le chromatogramme HPLC
La pureté ≥ 99 % signifie que le **pic principal** intègre à plus de 99 % de la surface totale détectée. Vérifiez :
- l'absence de pics secondaires significatifs (> 0.5 %)
- une ligne de base stable
- la résolution entre pics adjacents

### 3. La masse molaire mesurée (MS)
Le spectromètre de masse confirme l'identité de la molécule. La masse mesurée doit être à ± 1 Da de la masse théorique.

### 4. La quantification
Pour un flacon annoncé à 10 mg, la quantification réelle (typiquement 9.7–10.3 mg) confirme le dosage. Voir nos [CoA publics](/coa) pour exemples concrets.

## Pourquoi 99 % et pas 95 %

Sous 99 %, les impuretés résiduelles (peptides tronqués, sels, solvants de synthèse) faussent les résultats analytiques de recherche. Pour des études de pharmacocinétique ou de réceptologie, la pureté HPLC est non-négociable.

## Notre standard
Tous les peptides Peptinium Labs sont testés **lot par lot**, sans exception. Aucune extrapolation entre lots, aucun CoA générique.
`,
  },
  {
    slug: "stockage-conservation-peptides-laboratoire",
    title: "Stockage des peptides : du flacon lyophilisé à la solution reconstituée",
    excerpt:
      "Températures, durées, protection lumière : la chaîne du froid laboratoire qui préserve l'activité moléculaire.",
    description:
      "Bonnes pratiques de stockage des peptides de recherche : lyophilisés à -20 °C, reconstitués à 2-8 °C, durées de conservation par classe.",
    date: "2026-06-02",
    readMinutes: 5,
    category: "Pratique",
    tags: ["stockage", "stabilité", "chaîne du froid"],
    body: `La stabilité d'un peptide dépend autant de sa synthèse que de sa conservation. Quelques règles simples préservent l'activité analytique pendant des mois.

## Avant reconstitution (forme lyophilisée)
- **-20 °C** : conservation optimale, 24 mois minimum
- **2–8 °C** : acceptable jusqu'à 12 mois si le flacon reste scellé
- **Température ambiante** : tolérée pour le transport (5–7 jours max)
- **Dessicateur** : recommandé en cas d'humidité ambiante

Le peptide lyophilisé est **stable** parce qu'il n'y a pas d'eau pour permettre l'hydrolyse des liaisons peptidiques.

## Après reconstitution (solution aqueuse)
- **2–8 °C, à l'abri de la lumière** : 21–28 jours avec eau bactériostatique
- Ne **jamais** congeler une solution reconstituée
- Vérifier la limpidité avant chaque prélèvement

## Classes particulières
- **Mélanocortines (MT-1, MT-2, PT-141)** : photosensibles, flacon ambré obligatoire
- **NAD+** : stabilité réduite, reconstitution juste avant analyse
- **Peptides à pont disulfure (Oxytocin, Selank)** : sensibles à l'oxydation

## Indicateurs visuels de dégradation
- Précipité au fond du flacon
- Coloration jaune/brune
- Mousse persistante après agitation douce

En cas de doute, comparer à un CoA récent — voir nos [Certificats d'Analyse](/coa).
`,
  },
];

export const findArticle = (slug: string) => blogArticles.find((a) => a.slug === slug);
