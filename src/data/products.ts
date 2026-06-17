export type Variant = { dosage: string; price: number };

export type Product = {
  slug: string;
  name: string;
  cas?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  purity: string;
  variants: Variant[];
  category:
    | "GLP-1/GIP"
    | "Croissance"
    | "Cognitif"
    | "Réparation"
    | "Mélanocortine"
    | "Anti-âge"
    | "Consommables";
  featured?: boolean;
  shortDescription: string;
  researchSummary: string;
  storage: string;
  reconstitution: string;
  references: Reference[];
};

export type Reference = { url: string; source: "PubMed" | "PMC" | "JAMA"; id: string };

const pubmed = (id: string): Reference => ({ url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`, source: "PubMed", id: `PMID ${id}` });
const pmc = (id: string): Reference => ({ url: `https://pmc.ncbi.nlm.nih.gov/articles/${id}/`, source: "PMC", id });
const ext = (url: string, source: "JAMA", id: string): Reference => ({ url, source, id });

export const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const defaultVariant = (p: Product) => p.variants[0];

export const formatPrice = (n: number) =>
  `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export const products: Product[] = [
  {
    slug: "retatrutide",
    name: "Retatrutide",
    cas: "2381089-83-2",
    molecularFormula: "C221H343N51O66",
    molecularWeight: "4731.4 g/mol",
    purity: "≥ 99.1 % (HPLC)",
    variants: [
      { dosage: "10 mg", price: 64.99 },
      { dosage: "20 mg", price: 109.99 },
    ],
    category: "GLP-1/GIP",
    featured: true,
    shortDescription:
      "Triple agoniste GLP-1 / GIP / Glucagon — réactif de référence pour la recherche in vitro sur le métabolisme énergétique.",
    researchSummary:
      "Le Retatrutide (LY3437943) est un peptide synthétique étudié in vitro pour son activité simultanée sur les récepteurs GLP-1, GIP et du glucagon. Utilisé exclusivement comme réactif de recherche pour caractériser la signalisation des récepteurs couplés aux protéines G dans des modèles cellulaires.",
    storage: "Lyophilisé : −20 °C, à l'abri de la lumière. Reconstitué : 2–8 °C, ≤ 28 jours.",
    reconstitution: "Reconstituer avec de l'eau bactériostatique stérile. Solution claire et incolore.",
    references: [pubmed("40291085"), pubmed("37366315"), pubmed("40609566")],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    cas: "89030-95-5",
    molecularFormula: "C14H22CuN6O4",
    molecularWeight: "402.92 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [
      { dosage: "50 mg", price: 44.99 },
      { dosage: "100 mg", price: 59.99 },
    ],
    category: "Réparation",
    shortDescription:
      "Tripeptide-cuivre (Gly-His-Lys-Cu²⁺) — réactif de référence pour les études in vitro de remodelage matriciel.",
    researchSummary:
      "Le GHK-Cu est un complexe peptide-cuivre endogène utilisé comme outil de recherche in vitro pour l'étude des fibroblastes, de la synthèse du collagène et de l'expression génique liée à la régénération.",
    storage: "Lyophilisé : −20 °C, à l'abri de la lumière. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pmc("PMC6073405"), pubmed("18644225"), pubmed("35083444")],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    cas: "863288-34-0 / 170851-70-4",
    molecularFormula: "C152H252N44O42 / C38H49N9O5",
    molecularWeight: "3367.9 / 711.9 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "5 mg + 5 mg", price: 59.99 }],
    category: "Croissance",
    shortDescription:
      "Combinaison analogue GHRH (CJC-1295 no-DAC) + agoniste GHS-R1a (Ipamorelin) — outil de référence pour l'étude in vitro de l'axe somatotrope.",
    researchSummary:
      "Co-conditionnement d'un analogue GHRH (CJC-1295 sans DAC) et d'un pentapeptide sécrétagogue (Ipamorelin) utilisé comme outil pharmacologique pour caractériser la signalisation conjointe GHRH-R / GHS-R1a sur lignées cellulaires.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Reconstitution séparée recommandée à l'eau bactériostatique stérile.",
    references: [pubmed("16352683"), pubmed("10373343"), pubmed("17018654")],
  },
  {
    slug: "semax",
    name: "Semax",
    cas: "80714-61-0",
    molecularFormula: "C37H51N9O10S",
    molecularWeight: "813.92 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 54.99 }],
    category: "Cognitif",
    shortDescription:
      "Heptapeptide synthétique dérivé de l'ACTH(4-10) — outil de recherche in vitro sur les voies neurotrophiques.",
    researchSummary:
      "Peptide nootropique étudié in vitro pour son effet sur l'expression du BDNF et du NGF dans des modèles neuronaux.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("16996699"), pubmed("41479572"), pubmed("16635254")],
  },
  {
    slug: "ahk-cu",
    name: "AHK-Cu",
    cas: "147658-05-9",
    molecularFormula: "C16H25CuN7O3",
    molecularWeight: "427.0 g/mol",
    purity: "≥ 98.5 % (HPLC)",
    variants: [{ dosage: "100 mg", price: 49.99 }],
    category: "Réparation",
    shortDescription:
      "Complexe tripeptide-cuivre (Ala-His-Lys-Cu²⁺) — outil de recherche in vitro sur les follicules pileux et la matrice extracellulaire.",
    researchSummary:
      "Analogue cuivré utilisé comme outil expérimental dans les essais de prolifération de cellules dermiques et de modulation de la VEGF in vitro.",
    storage: "Lyophilisé : −20 °C, à l'abri de la lumière. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("17703734"), pmc("PMC8332470"), pmc("PMC6073405")],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    cas: "137525-51-0",
    molecularFormula: "C62H98N16O22",
    molecularWeight: "1419.5 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 59.99 }],
    category: "Réparation",
    shortDescription:
      "Pentadécapeptide étudié in vitro pour ses effets sur les modèles cellulaires de réparation tissulaire.",
    researchSummary:
      "Fragment peptidique synthétique utilisé comme outil de recherche dans les essais in vitro d'angiogenèse et de migration cellulaire.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("30915550"), pmc("PMC6271067"), pmc("PMC8275860")],
  },
  {
    slug: "mt-1",
    name: "Melanotan I",
    cas: "75921-69-6",
    molecularFormula: "C78H111N21O19",
    molecularWeight: "1646.85 g/mol",
    purity: "≥ 98.5 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 49.99 }],
    category: "Mélanocortine",
    shortDescription:
      "Analogue synthétique α-MSH (afamelanotide) — outil d'étude in vitro du récepteur MC1R.",
    researchSummary:
      "Peptide utilisé comme ligand de référence pour la caractérisation du récepteur mélanocortine 1 sur cellules pigmentaires.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("15262693"), pubmed("9113347"), pmc("PMC11664455")],
  },
  {
    slug: "mt-2",
    name: "Melanotan II",
    cas: "121062-08-6",
    molecularFormula: "C50H69N15O9",
    molecularWeight: "1024.18 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 54.99 }],
    category: "Mélanocortine",
    shortDescription:
      "Analogue synthétique α-MSH — réactif pour l'étude in vitro des récepteurs MC1R / MC4R.",
    researchSummary:
      "Peptide utilisé comme ligand non sélectif de référence dans la caractérisation des récepteurs mélanocortines.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("8637402"), pubmed("15262693")],
  },
  {
    slug: "klow",
    name: "KLOW",
    cas: "Mélange — multi-CAS",
    molecularFormula: "GHK-Cu + BPC-157 + TB-500 + KPV",
    molecularWeight: "—",
    purity: "≥ 98.0 % (HPLC, par composant)",
    variants: [{ dosage: "80 mg", price: 159.99 }],
    category: "Réparation",
    shortDescription:
      "Blend de quatre peptides (GHK-Cu, BPC-157, TB-500, KPV) — outil de recherche in vitro pour les protocoles de réparation tissulaire combinée.",
    researchSummary:
      "Co-formulation utilisée comme outil expérimental pour étudier les effets combinés in vitro sur la migration cellulaire, l'angiogenèse et la modulation inflammatoire.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C, ≤ 14 jours.",
    reconstitution: "Eau bactériostatique stérile, agitation douce.",
    references: [pmc("PMC6073405"), pubmed("30915550"), pmc("PMC6271067")],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    cas: "53-84-9",
    molecularFormula: "C21H27N7O14P2",
    molecularWeight: "663.43 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "1000 mg", price: 89.99 }],
    category: "Anti-âge",
    shortDescription:
      "Nicotinamide Adénine Dinucléotide — cofacteur de référence pour l'étude in vitro du métabolisme énergétique cellulaire.",
    researchSummary:
      "Coenzyme central des réactions redox utilisé comme outil de recherche in vitro pour l'étude des sirtuines et du métabolisme mitochondrial.",
    storage: "Lyophilisé : −20 °C, à l'abri de la lumière. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pmc("PMC10692436"), pmc("PMC9512238"), pubmed("37971292")],
  },
  {
    slug: "tesamoreline",
    name: "Tésamoréline",
    cas: "218949-48-5",
    molecularFormula: "C221H366N72O67S",
    molecularWeight: "5135.8 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "5 mg", price: 79.99 }],
    category: "Croissance",
    shortDescription:
      "Analogue stabilisé du GHRH — outil de référence pour la caractérisation in vitro du récepteur GHRH-R.",
    researchSummary:
      "Peptide synthétique utilisé comme outil pharmacologique pour l'étude in vitro de la signalisation GHRH-R sur lignées hypophysaires.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("20554713"), pubmed("18690162"), ext("https://jamanetwork.com/journals/jama/fullarticle/1889139", "JAMA", "JAMA · fullarticle/1889139")],
  },
  {
    slug: "eau-bacteriostatique",
    name: "Eau bactériostatique",
    cas: "7732-18-5 (H₂O) + 0,9 % alcool benzylique",
    molecularFormula: "H₂O + C7H8O",
    molecularWeight: "—",
    purity: "USP grade",
    variants: [{ dosage: "30 mL", price: 5.99 }],
    category: "Consommables",
    shortDescription:
      "Solvant de reconstitution stérile à 0,9 % d'alcool benzylique — usage exclusivement laboratoire.",
    researchSummary:
      "Solvant de reconstitution pour peptides lyophilisés en laboratoire. Conservation prolongée des solutions reconstituées grâce à l'alcool benzylique.",
    storage: "Température ambiante (15–25 °C), à l'abri de la lumière.",
    reconstitution: "Prêt à l'emploi — prélever avec une seringue stérile.",
    references: [],
  },
];

export const packs = [
  {
    slug: "pack-metabolisme-recherche",
    name: "Pack Recherche — Métabolisme",
    description:
      "Ensemble de réactifs pour l'étude in vitro des récepteurs incrétines et de l'axe somatotrope.",
    items: ["Retatrutide 10 mg", "Tésamoréline 5 mg", "Eau bactériostatique 30 mL"],
    price: 144.99,
    saving: 12,
  },
  {
    slug: "pack-reparation-cellulaire",
    name: "Pack Recherche — Réparation cellulaire",
    description:
      "Réactifs sélectionnés pour les protocoles in vitro d'étude de la migration cellulaire et du remodelage matriciel.",
    items: ["BPC-157 10 mg", "GHK-Cu 50 mg", "Eau bactériostatique 30 mL"],
    price: 104.99,
    saving: 10,
  },
  {
    slug: "pack-axe-somatotrope",
    name: "Pack Recherche — Axe somatotrope",
    description:
      "Outils pour la caractérisation in vitro des récepteurs GHS-R1a et GHRH.",
    items: ["CJC-1295 + Ipamorelin (5 mg + 5 mg)", "Eau bactériostatique 30 mL"],
    price: 61.99,
    saving: 7,
  },
];
