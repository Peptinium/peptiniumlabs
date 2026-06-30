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
    slug: "peptides-recherche-histoire-science",
    title: "Peptides de recherche : histoire, science et place actuelle dans la littérature",
    excerpt:
      "Des premiers travaux d'Emil Fischer à la synthèse en phase solide de Merrifield : panorama scientifique des peptides utilisés en recherche fondamentale.",
    description:
      "Histoire et science des peptides de recherche : synthèse Fmoc/SPPS, classes moléculaires étudiées, place dans la littérature scientifique contemporaine. Vue d'ensemble éditoriale, sans protocole.",
    date: "2026-06-18",
    readMinutes: 7,
    category: "Science",
    tags: ["peptides", "histoire", "SPPS", "Merrifield", "recherche fondamentale"],
    body: `Les peptides occupent aujourd'hui une place centrale dans la recherche biomédicale fondamentale. Comprendre **comment cette famille de molécules est devenue un objet d'étude majeur** éclaire les usages contemporains en laboratoire — et la rigueur attendue autour de chaque lot analytique.

## Aux origines : Emil Fischer et la liaison peptidique
À la fin du XIXᵉ siècle, le chimiste allemand **Emil Fischer** (Prix Nobel 1902) caractérise pour la première fois la **liaison peptidique** comme structure répétitive reliant les acides aminés. Cette intuition fonde la chimie des protéines moderne et ouvre la voie à un siècle de travaux sur les séquences courtes — les *peptides* — qui constituent l'unité fonctionnelle de très nombreuses molécules biologiques.

## La révolution Merrifield (1963)
La véritable rupture intervient en **1963**, lorsque **Bruce Merrifield** publie la méthode de **synthèse peptidique en phase solide** (SPPS – *Solid-Phase Peptide Synthesis*). Le principe : ancrer le premier acide aminé sur une résine, puis ajouter les suivants un à un, avec lavages successifs. Ce travail vaut à Merrifield le **Prix Nobel de chimie en 1984**.

Aujourd'hui, la SPPS — dans ses variantes **Fmoc** et **Boc** — reste la méthode dominante. Elle permet la production de peptides courts (jusqu'à environ 50 résidus) avec une **pureté élevée**, prérequis indispensable à toute exploitation analytique.

## Les grandes familles de peptides étudiés
La littérature scientifique distingue plusieurs classes structurelles fréquemment rencontrées dans les publications académiques :

- **Peptides de signalisation** : courtes séquences impliquées dans des cascades cellulaires (réparation tissulaire, communication endocrine).
- **Mélanocortines** : famille incluant les analogues d'α-MSH étudiés notamment pour la pigmentation cutanée et la régulation de l'appétit dans la littérature animale.
- **Peptides à pont disulfure** : structures stabilisées par liaisons S–S (étudiées par exemple en neurosciences fondamentales).
- **Analogues du GLP-1 et incrétines** : objet d'une littérature pharmacologique très active depuis les années 2000.
- **Sécrétagogues de la GH** : libérateurs étudiés dans la physiologie de l'axe somatotrope.

Pour chacune de ces familles, des **bases de données publiques** comme PubMed, ChEMBL ou UniProt référencent des centaines à des milliers de publications évaluées par les pairs.

## Pourquoi la pureté analytique est devenue centrale
Un peptide n'est exploitable scientifiquement que si **son identité et sa pureté sont documentées**. Deux techniques sont aujourd'hui standards :

- la **HPLC en phase inverse**, qui quantifie le pic principal par rapport aux impuretés ;
- la **spectrométrie de masse (MS)**, qui confirme la **masse molaire mesurée** et donc l'identité de la séquence.

Sans ce double contrôle, aucune conclusion analytique n'est défendable. C'est la raison pour laquelle les laboratoires sérieux publient un **Certificat d'Analyse (CoA)** par lot — et non un document générique. Vous pouvez consulter [nos CoA publics](/coa) pour voir à quoi ressemble une documentation analytique conforme.

## Un cadre strictement "research use only"
Tous les peptides référencés sur Peptinium Labs sont distribués **à des fins exclusives de recherche scientifique** (*Research Use Only*). Ce cadre, partagé par la majorité des fournisseurs académiques internationaux (Sigma-Aldrich, Bachem, Tocris…), exclut tout usage humain ou vétérinaire. Il garantit que les molécules sont mises à disposition d'un public de chercheurs, étudiants en master/doctorat ou laboratoires privés, dans un environnement contrôlé.

## Lectures complémentaires
- [Comprendre la pureté HPLC ≥ 99 % et la lecture d'un CoA](/blog/purete-hplc-comprendre-certificat-analyse)
- [Stabilité et chaîne du froid en laboratoire](/blog/stockage-conservation-peptides-laboratoire)
- [Nos études scientifiques de référence](/etudes-scientifiques)
`,
  },
  {
    slug: "purete-hplc-comprendre-certificat-analyse",
    title: "Pureté HPLC ≥ 99 % : comment interpréter un Certificat d'Analyse",
    excerpt:
      "Chromatographie, spectrométrie de masse, clé de vérification indépendante : ce que démontre réellement un CoA Janoshik et pourquoi cela compte.",
    description:
      "Article de fond sur la lecture d'un Certificat d'Analyse HPLC : chromatogramme, masse molaire mesurée, quantification, validation indépendante. Contenu éditorial pour la recherche peptidique.",
    date: "2026-06-10",
    readMinutes: 8,
    category: "Science",
    tags: ["HPLC", "CoA", "Janoshik", "pureté", "spectrométrie de masse"],
    body: `Un **Certificat d'Analyse (CoA)** est le document central qui accompagne tout peptide de recherche. Sans lui, aucune donnée expérimentale n'est défendable. Cet article explique ce qu'un CoA démontre réellement — et ce qu'il ne démontre pas.

## Qu'est-ce qu'un CoA ?
Un Certificat d'Analyse est un rapport produit par un **laboratoire analytique tiers et indépendant** du fournisseur. Il atteste de l'identité chimique, de la pureté et de la quantification d'un **lot précis** — pas d'un produit générique. En recherche peptidique européenne, **Janoshik Analytical** (République tchèque) est devenu la référence partagée par la plupart des fournisseurs sérieux.

## La clé de vérification : le seul rempart contre la falsification
Chaque CoA Janoshik porte une **clé alphanumérique unique** (par exemple `KYB39ZQFJ7DV`). Cette clé permet de récupérer le rapport original directement sur [janoshik.com](https://janoshik.com).

> Sans cette validation croisée, un PDF de CoA n'a **aucune valeur scientifique**. Il est trivial de retoucher un document — la clé indépendante est la seule preuve que le rapport n'a pas été modifié.

## Le chromatogramme HPLC : ce que dit vraiment "99 %"
La **chromatographie liquide haute performance** (HPLC) sépare les composants d'un échantillon selon leur affinité pour une phase stationnaire. Pour un peptide pur, on observe :

- un **pic principal** très majoritaire ;
- une **ligne de base stable**, sans dérive ;
- l'absence de pics secondaires significatifs.

La mention **"≥ 99,0 % HPLC"** signifie que l'aire intégrée du pic principal représente au moins 99 % de l'aire totale détectée par le système. Les **<1 % restants** correspondent à des impuretés résiduelles : peptides tronqués (synthèse incomplète), sels, traces de solvants. En dessous de 99 %, les impuretés peuvent biaiser une étude de pharmacocinétique ou de réceptologie au point de la rendre ininterprétable.

## La spectrométrie de masse (MS) : confirmer l'identité
La HPLC mesure la **pureté**, mais pas l'**identité**. C'est le rôle de la **spectrométrie de masse**.

Le spectromètre ionise la molécule et mesure son rapport masse/charge. La **masse molaire mesurée** doit correspondre à la **masse théorique** calculée à partir de la séquence, généralement à **± 1 Da** près. Un écart plus important indique :

- une séquence erronée ;
- une modification post-synthèse (acétylation, oxydation) ;
- une contamination par un peptide proche.

C'est cette double validation HPLC + MS qui rend un CoA scientifiquement recevable.

## La quantification : combien de peptide réellement dans le flacon
Le CoA indique également la **masse réelle** contenue dans le flacon. Pour un produit annoncé à 10 mg, on attend typiquement une quantification comprise entre **9,7 et 10,3 mg**. Ce contrôle évite les sous-dosages qui faussent toute exploitation analytique en aval.

## Pourquoi un CoA "par lot" et non générique
Chaque synthèse est un évènement chimique singulier. Deux lots du même peptide, produits sur la même chaîne, **ne sont jamais strictement identiques** : pureté à 99,2 % versus 99,7 %, quantification à 9,9 mg versus 10,1 mg. Un CoA générique, présenté comme valable pour tous les lots, est par construction **non conforme aux standards analytiques**.

Tous les peptides Peptinium Labs sont caractérisés **lot par lot**. Vous pouvez consulter quelques [exemples publics de CoA](/coa) pour voir à quoi ressemble une documentation conforme.

## Au-delà du CoA : ce qu'il ne dit pas
Un CoA atteste de l'identité et de la pureté chimique à la sortie de synthèse. Il **ne dit rien** :

- de la stabilité de la molécule dans le temps (qui dépend du stockage) ;
- des effets biologiques (qui relèvent de la littérature scientifique publiée) ;
- de la conformité réglementaire à un usage autre que la recherche.

Pour comprendre la stabilité et la conservation, voir notre article sur la [chaîne du froid en laboratoire](/blog/stockage-conservation-peptides-laboratoire).

## Pour aller plus loin
- [Histoire et science des peptides de recherche](/blog/peptides-recherche-histoire-science)
- [Études scientifiques de référence](/etudes-scientifiques)
- [Catalogue complet et CoA associés](/produits)
`,
  },
  {
    slug: "stockage-conservation-peptides-laboratoire",
    title: "Stabilité et chaîne du froid : la science de la conservation des peptides",
    excerpt:
      "Pourquoi un peptide lyophilisé reste stable des mois alors qu'une solution se dégrade en semaines. Une lecture physico-chimique de la conservation.",
    description:
      "Article éditorial sur la physico-chimie de la stabilité peptidique : hydrolyse, oxydation, photodégradation, transition vitreuse du lyophilisat. Pour comprendre la chaîne du froid laboratoire.",
    date: "2026-06-02",
    readMinutes: 6,
    category: "Science",
    tags: ["stabilité", "stockage", "chaîne du froid", "lyophilisation"],
    body: `Pourquoi un peptide lyophilisé conservé à **-20 °C** reste stable plusieurs années, alors qu'une solution aqueuse du même peptide se dégrade en quelques semaines ? La réponse est entièrement physico-chimique — et comprendre ces mécanismes éclaire les choix de stockage en laboratoire.

## La liaison peptidique : robuste mais hydrolysable
La liaison peptidique (–CO–NH–) est intrinsèquement **stable** en l'absence d'eau. C'est ce qui explique la conservation longue durée des protéines fossiles ou des peptides lyophilisés. En présence d'eau, en revanche, elle subit une **hydrolyse lente**, accélérée par :

- la **température** (cinétique d'Arrhenius : la vitesse double environ tous les 10 °C) ;
- les **pH extrêmes** (acide fort ou base forte) ;
- la **présence de protéases résiduelles** (contamination).

C'est cette sensibilité à l'eau qui explique l'usage massif de la **lyophilisation** dans la conservation peptidique.

## Lyophilisation : la transition vitreuse comme bouclier
Le procédé de lyophilisation (*freeze-drying*) sublime l'eau d'une solution congelée, laissant un solide poreux à très faible teneur en eau résiduelle (< 1 %). Le peptide se retrouve emprisonné dans une **matrice amorphe** sous son point de transition vitreuse (Tg) — un état physico-chimique où la mobilité moléculaire est quasi nulle.

Conséquences :
- pas d'eau libre = pas d'hydrolyse ;
- pas de mobilité = pas de réarrangement conformationnel ;
- pas d'oxygène dissous = oxydation très ralentie.

C'est pourquoi un peptide lyophilisé bien stocké conserve son intégrité **24 mois ou plus** à -20 °C.

## Les trois ennemis principaux d'une solution reconstituée
Une fois remis en solution aqueuse, le peptide redevient vulnérable à trois mécanismes :

### 1. L'hydrolyse
La liaison peptidique se rompt progressivement. La cinétique reste lente à 2–8 °C mais devient sensible au-delà de quelques semaines.

### 2. L'oxydation
Les acides aminés soufrés (**méthionine, cystéine**) et le tryptophane sont particulièrement sensibles à l'oxygène dissous. Les peptides à **pont disulfure** (Oxytocin, Selank, GHK-Cu) peuvent perdre leur conformation active par rupture S–S.

### 3. La photodégradation
Le tryptophane, la tyrosine et certaines structures chromophores (mélanocortines : MT-1, MT-2, PT-141) absorbent dans le proche UV et le visible. Une exposition lumineuse prolongée induit des photoproduits inactifs. C'est la raison de l'usage de **flacons ambrés** pour cette classe de molécules.

## Pourquoi ne jamais re-congeler une solution
Chaque cycle **gel/dégel** d'une solution peptidique provoque :

- la formation de cristaux de glace qui désorganisent la structure ;
- un stress osmotique local sur la molécule ;
- des changements de pH locaux liés à la cristallisation différentielle des tampons.

Le résultat cumulé est une **perte d'activité analytique mesurable** dès le second cycle. C'est pourquoi la pratique laboratoire standard est : *lyophilisé à -20 °C, reconstitué à 2–8 °C, jamais re-congelé*.

## Les standards de durée de conservation publiés
Les standards admis dans la littérature pharmacologique et confirmés par les fiches techniques des fournisseurs académiques internationaux (Sigma-Aldrich, Bachem, Tocris) donnent un ordre de grandeur :

- **Lyophilisé, -20 °C** : 24 mois minimum, souvent davantage.
- **Lyophilisé, 2–8 °C** : 12 mois si le flacon reste scellé.
- **Lyophilisé, température ambiante** : toléré pour le transport (5–7 jours).
- **Solution reconstituée en eau bactériostatique, 2–8 °C, à l'abri de la lumière** : 21 à 28 jours selon la classe peptidique.
- **Solution en eau pour préparation injectable (WFI) sans conservateur** : 24 à 72 heures.

Ces durées sont des **références bibliographiques**, pas des recommandations d'usage.

## Indicateurs visuels de dégradation
Une solution dégradée présente fréquemment :

- une **coloration** jaune ou brune (oxydation, réaction de Maillard sur les peptides riches en lysine) ;
- un **précipité** au fond du flacon (agrégation) ;
- une **opalescence** ou turbidité persistante ;
- une **mousse stable** après agitation douce (dénaturation conformationnelle).

Dans ces cas, le peptide n'est plus exploitable analytiquement, indépendamment de la pureté initiale documentée par le CoA.

## Pour aller plus loin
- [Histoire et science des peptides de recherche](/blog/peptides-recherche-histoire-science)
- [Lire un Certificat d'Analyse HPLC](/blog/purete-hplc-comprendre-certificat-analyse)
- [Catalogue analytique complet](/produits)
`,
  },
];

export const findArticle = (slug: string) => blogArticles.find((a) => a.slug === slug);
