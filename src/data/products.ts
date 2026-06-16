export type Product = {
  slug: string;
  name: string;
  cas?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  purity: string;
  dosage: string; // mg per vial
  price: number;
  category: "GLP-1/GIP" | "Croissance" | "Cognitif" | "Réparation" | "Mélanocortine";
  featured?: boolean;
  shortDescription: string;
  researchSummary: string;
  storage: string;
  reconstitution: string;
  references: { title: string; authors: string; journal: string; year: number; pmid: string }[];
};

export const products: Product[] = [
  {
    slug: "retatrutide",
    name: "Retatrutide",
    cas: "2381089-83-2",
    molecularFormula: "C221H343N51O66",
    molecularWeight: "4731.4 g/mol",
    purity: "≥ 99.1 % (HPLC)",
    dosage: "10 mg / flacon",
    price: 189,
    category: "GLP-1/GIP",
    featured: true,
    shortDescription:
      "Triple agoniste des récepteurs GLP-1 / GIP / Glucagon — réactif de référence pour la recherche in vitro sur le métabolisme énergétique.",
    researchSummary:
      "Le Retatrutide (LY3437943) est un peptide synthétique étudié in vitro pour son activité simultanée sur les récepteurs GLP-1, GIP et du glucagon. Utilisé exclusivement comme réactif de recherche pour caractériser la signalisation des récepteurs couplés aux protéines G dans des modèles cellulaires.",
    storage: "Lyophilisé : −20 °C, à l'abri de la lumière. Reconstitué : 2–8 °C, ≤ 28 jours.",
    reconstitution: "Reconstituer avec de l'eau bactériostatique stérile. Solution claire et incolore.",
    references: [
      {
        title:
          "Triple Hormone Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial",
        authors: "Jastreboff AM, et al.",
        journal: "N Engl J Med",
        year: 2023,
        pmid: "37366315",
      },
      {
        title:
          "Retatrutide, a GIP, GLP-1 and glucagon receptor agonist, in adults with type 2 diabetes",
        authors: "Rosenstock J, et al.",
        journal: "The Lancet",
        year: 2023,
        pmid: "37356446",
      },
    ],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    cas: "2023788-19-2",
    molecularFormula: "C225H348N48O68",
    molecularWeight: "4813.5 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    dosage: "10 mg / flacon",
    price: 149,
    category: "GLP-1/GIP",
    shortDescription:
      "Co-agoniste GLP-1 / GIP — réactif de référence pour l'étude in vitro de la signalisation incrétine.",
    researchSummary:
      "Peptide synthétique double agoniste utilisé comme outil pharmacologique de référence dans la caractérisation des voies GLP-1R et GIPR sur lignées cellulaires.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile, agitation douce.",
    references: [
      {
        title: "Tirzepatide Once Weekly for the Treatment of Obesity",
        authors: "Jastreboff AM, et al.",
        journal: "N Engl J Med",
        year: 2022,
        pmid: "35658024",
      },
    ],
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    cas: "910463-68-2",
    molecularFormula: "C187H291N45O59",
    molecularWeight: "4113.6 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    dosage: "5 mg / flacon",
    price: 99,
    category: "GLP-1/GIP",
    shortDescription:
      "Agoniste sélectif du récepteur GLP-1 — référence pour les études comparatives in vitro de signalisation incrétine.",
    researchSummary:
      "Peptide synthétique acylé étudié in vitro comme ligand de référence du GLP-1R.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [
      {
        title:
          "Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes",
        authors: "Lincoff AM, et al.",
        journal: "N Engl J Med",
        year: 2023,
        pmid: "37952131",
      },
    ],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    cas: "137525-51-0",
    molecularFormula: "C62H98N16O22",
    molecularWeight: "1419.5 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    dosage: "5 mg / flacon",
    price: 49,
    category: "Réparation",
    shortDescription:
      "Pentadécapeptide étudié in vitro pour ses effets sur les modèles cellulaires de réparation tissulaire.",
    researchSummary:
      "Fragment peptidique synthétique utilisé comme outil de recherche dans les essais in vitro d'angiogenèse et de migration cellulaire.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [
      {
        title:
          "Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract",
        authors: "Sikiric P, et al.",
        journal: "Curr Pharm Des",
        year: 2011,
        pmid: "21443487",
      },
    ],
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin β4 Fragment)",
    cas: "77591-33-4",
    molecularFormula: "C212H350N56O78S",
    molecularWeight: "4963.4 g/mol",
    purity: "≥ 98.5 % (HPLC)",
    dosage: "5 mg / flacon",
    price: 59,
    category: "Réparation",
    shortDescription:
      "Fragment synthétique de la thymosine β4 — réactif pour l'étude in vitro des dynamiques de l'actine.",
    researchSummary:
      "Peptide utilisé comme outil expérimental dans les essais de polymérisation de l'actine et de migration cellulaire.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [
      {
        title: "Thymosin beta-4 activates integrin-linked kinase",
        authors: "Bock-Marquette I, et al.",
        journal: "Nature",
        year: 2004,
        pmid: "15229603",
      },
    ],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    cas: "170851-70-4",
    molecularFormula: "C38H49N9O5",
    molecularWeight: "711.85 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    dosage: "5 mg / flacon",
    price: 39,
    category: "Croissance",
    shortDescription:
      "Pentapeptide synthétique sécrétagogue — outil de recherche pour l'étude in vitro du récepteur GHS-R1a.",
    researchSummary:
      "Peptide utilisé comme ligand de référence dans la caractérisation du récepteur de la ghréline (GHS-R1a).",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [
      {
        title:
          "Ipamorelin, the first selective growth hormone secretagogue",
        authors: "Raun K, et al.",
        journal: "Eur J Endocrinol",
        year: 1998,
        pmid: "9849822",
      },
    ],
  },
  {
    slug: "cjc-1295-dac",
    name: "CJC-1295 DAC",
    cas: "863288-34-0",
    molecularFormula: "C165H269N47O46",
    molecularWeight: "3647.2 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    dosage: "5 mg / flacon",
    price: 65,
    category: "Croissance",
    shortDescription:
      "Analogue synthétique GHRH avec DAC — réactif pour l'étude in vitro du récepteur GHRH.",
    researchSummary:
      "Peptide modifié utilisé comme outil de recherche dans la caractérisation pharmacocinétique des analogues GHRH.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [
      {
        title:
          "A long-acting growth hormone-releasing factor analog (CJC-1295)",
        authors: "Teichman SL, et al.",
        journal: "J Clin Endocrinol Metab",
        year: 2006,
        pmid: "16384850",
      },
    ],
  },
  {
    slug: "selank",
    name: "Selank",
    cas: "129954-34-3",
    molecularFormula: "C33H57N11O9",
    molecularWeight: "751.87 g/mol",
    purity: "≥ 98.5 % (HPLC)",
    dosage: "5 mg / flacon",
    price: 45,
    category: "Cognitif",
    shortDescription:
      "Heptapeptide synthétique — outil d'étude in vitro des récepteurs GABAergiques.",
    researchSummary:
      "Peptide utilisé comme réactif de recherche pour l'étude des modulateurs peptidergiques in vitro.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [
      {
        title:
          "Selank, a peptide analogue of tuftsin: effect on cytokine balance",
        authors: "Kolomin T, et al.",
        journal: "Bull Exp Biol Med",
        year: 2013,
        pmid: "24319698",
      },
    ],
  },
  {
    slug: "melanotan-2",
    name: "Melanotan II",
    cas: "121062-08-6",
    molecularFormula: "C50H69N15O9",
    molecularWeight: "1024.18 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    dosage: "10 mg / flacon",
    price: 39,
    category: "Mélanocortine",
    shortDescription:
      "Analogue synthétique α-MSH — réactif pour l'étude in vitro des récepteurs MC1R / MC4R.",
    researchSummary:
      "Peptide utilisé comme ligand de référence dans la caractérisation des récepteurs mélanocortines.",
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [
      {
        title:
          "Melanocortin receptors and their accessory proteins",
        authors: "Cone RD",
        journal: "Mol Cell Endocrinol",
        year: 2000,
        pmid: "10867796",
      },
    ],
  },
];

export const packs = [
  {
    slug: "pack-metabolisme-recherche",
    name: "Pack Recherche — Métabolisme",
    description:
      "Ensemble de réactifs pour l'étude comparative in vitro des récepteurs GLP-1, GIP et glucagon.",
    items: ["Retatrutide 10 mg", "Tirzepatide 10 mg", "Semaglutide 5 mg"],
    price: 399,
    saving: 38,
  },
  {
    slug: "pack-reparation-cellulaire",
    name: "Pack Recherche — Réparation cellulaire",
    description:
      "Réactifs sélectionnés pour les protocoles in vitro d'étude de la migration cellulaire et de la dynamique de l'actine.",
    items: ["BPC-157 5 mg", "TB-500 5 mg"],
    price: 89,
    saving: 19,
  },
  {
    slug: "pack-axe-somatotrope",
    name: "Pack Recherche — Axe somatotrope",
    description:
      "Outils pour la caractérisation in vitro des récepteurs GHS-R1a et GHRH.",
    items: ["Ipamorelin 5 mg", "CJC-1295 DAC 5 mg"],
    price: 89,
    saving: 15,
  },
];
