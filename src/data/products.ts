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
    | "Reconstitution";
  featured?: boolean;
  shortDescription: string;
  researchSummary: string;
  detailedEffects: string;
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

const RUO_DISCLAIMER =
  "Ces données sont issues de la littérature scientifique et sont fournies à titre strictement informatif dans un cadre de recherche. Ce produit n'est pas destiné à un usage vétérinaire, diagnostique ou thérapeutique et n'est pas recommandé pour un usage hors d'un cadre scientifique, professionnel et de recherche.";

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
    detailedEffects:
      "Dans les études cliniques de phase 1 et 2 (NEJM 2023, PMID 37366315), le Retatrutide a démontré une activation simultanée des trois récepteurs incrétines GLP-1R, GIP-R et GCG-R. Cette triple agonisme entraîne une augmentation de la sécrétion d'insuline glucose-dépendante par les cellules β pancréatiques, une suppression du glucagon, un ralentissement de la vidange gastrique et une activation de la dépense énergétique via les récepteurs du glucagon hépatiques. Au niveau hormonal, les travaux observent une modulation de l'axe entéro-insulaire, une baisse de la leptine circulante et une diminution de l'HbA1c dans les cohortes étudiées. Au niveau corporel, les études rapportent une perte pondérale dose-dépendante (jusqu'à −24 % à 48 semaines à 12 mg/sem), une réduction du tissu adipeux viscéral mesurée par IRM, et une amélioration des marqueurs hépatiques (réduction de la stéatose hépatique non alcoolique). " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Les travaux de Pickart et Margolina (PMC6073405) ont montré que le GHK-Cu module l'expression de plus de 4 000 gènes humains, principalement liés à la réparation tissulaire, l'angiogenèse et la réponse anti-inflammatoire. In vitro, le tripeptide stimule la prolifération des fibroblastes dermiques, augmente la synthèse de collagène de type I, d'élastine, de glycosaminoglycanes et de décorine. Il favorise l'expression de SOD2 et active la voie Nrf2 antioxydante. Au niveau cellulaire, les études décrivent une modulation des cytokines pro-inflammatoires (TNF-α, IL-6 à la baisse) et une stimulation du VEGF favorisant la formation de microvaisseaux. Des effets sur la cicatrisation et la pigmentation des follicules pileux ont également été documentés dans des modèles dermatologiques in vitro. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Les études sur l'Ipamorelin (Raun et al., 1998, PMID 10373343) ont caractérisé un agoniste sélectif du récepteur GHS-R1a induisant une libération pulsatile de GH par les cellules somatotropes hypophysaires, sans élévation significative de la prolactine, de l'ACTH, du cortisol ou de la FSH/LH. Le CJC-1295 (sans DAC) est un analogue de la GHRH stabilisé qui se lie au GHRH-R et amplifie l'amplitude des pulses de GH. La combinaison étudiée in vitro et dans des modèles précliniques génère un effet synergique sur la sécrétion de GH, avec en aval une élévation de l'IGF-1 hépatique. Les études hormonales montrent un maintien du rythme pulsatile physiologique de la GH, contrairement à une administration directe de GH exogène. Les effets observés dans la littérature incluent une augmentation de la masse maigre, une modulation de la lipolyse via la signalisation β-adrénergique adipocytaire, et une amélioration des marqueurs de turnover osseux. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Le Semax est un heptapeptide dérivé du fragment ACTH(4-10) sans activité corticotrope. Les études (PMID 16996699, 16635254) ont mis en évidence une augmentation rapide de l'expression du BDNF (Brain-Derived Neurotrophic Factor) et du NGF (Nerve Growth Factor) dans l'hippocampe et le cortex frontal de modèles murins, ainsi qu'une modulation des récepteurs TrkA/TrkB. Au niveau hormonal, contrairement aux fragments ACTH(1-24), le Semax ne stimule pas l'axe HPA et n'élève pas le cortisol. Les travaux décrivent une modulation des systèmes dopaminergique, sérotoninergique et cholinergique, une augmentation de l'enképhaline endogène et une réduction du stress oxydatif neuronal. Sur le plan fonctionnel, les études observent une amélioration des performances mnésiques et attentionnelles dans des modèles d'ischémie cérébrale et d'AVC, ainsi qu'un effet neuroprotecteur via l'inhibition de l'apoptose neuronale médiée par BAX. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "L'AHK-Cu (Ala-His-Lys cuivre) est un tripeptide-cuivre dérivé de la même famille que le GHK-Cu. Les études in vitro (PMID 17703734, PMC8332470) ont montré une stimulation marquée du VEGF par les cellules de la papille dermique, soutenant l'angiogenèse péri-folliculaire. Le complexe augmente la prolifération des kératinocytes et des fibroblastes dermiques, allonge la phase anagène du cycle pileux et module l'expression de la TGF-β2 (inhibiteur de la croissance pileuse). Au niveau biochimique, les travaux décrivent une activation de la lysyl-oxydase, enzyme cuivre-dépendante essentielle au cross-linking du collagène et de l'élastine. Aucun effet hormonal systémique n'a été documenté dans les modèles in vitro. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Le BPC-157 (Body Protection Compound) est un pentadécapeptide isolé du suc gastrique humain. Les études (PMID 30915550, PMC6271067, PMC8275860) décrivent une activation de la voie VEGFR2 → AKT → eNOS conduisant à une angiogenèse accélérée. Au niveau cellulaire, le peptide stimule la migration des fibroblastes, accélère la formation du tissu de granulation et favorise la régénération tendineuse et musculaire via l'expression de la FAK (Focal Adhesion Kinase) et de la paxilline. Les modèles précliniques montrent une modulation de l'axe NO (oxyde nitrique), une upregulation des récepteurs à la sérotonine et à la dopamine dans le système nerveux entérique, et une cytoprotection gastro-intestinale via la stabilisation des jonctions serrées. Aucune modification significative des hormones systémiques (cortisol, GH, IGF-1) n'a été rapportée. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Le Melanotan I (afamelanotide) est un analogue de l'α-MSH (alpha-melanocyte stimulating hormone) avec une sélectivité marquée pour le récepteur MC1R. Les études (PMID 15262693, PMID 9113347, PMC11664455) montrent que l'activation du MC1R sur les mélanocytes stimule l'adénylate cyclase, augmente l'AMPc et active la voie MITF → tyrosinase, principal enzyme limitant de la mélanogenèse. La conséquence est une production accrue d'eumélanine (pigment photoprotecteur) plutôt que de phéomélanine. Au niveau hormonal, contrairement aux ligands non sélectifs, le MT-I présente une affinité réduite pour MC3R/MC4R, limitant les effets sur l'appétit ou la fonction sexuelle. Les travaux cliniques ont documenté une réduction des dommages UV-induits dans des protocoles de photoprotection sur des pathologies cutanées rares (protoporphyrie érythropoïétique). " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Le Melanotan II est un analogue cyclique non sélectif de l'α-MSH qui active MC1R, MC3R, MC4R et MC5R. Au niveau hormonal et neurobiologique, les études (PMID 8637402, PMID 15262693) ont caractérisé une stimulation de la mélanogenèse via MC1R (pigmentation), ainsi qu'une activation des voies hypothalamiques MC3R/MC4R impliquées dans la régulation de l'appétit (effet anorexigène documenté), de la dépense énergétique, et de la fonction érectile (via les neurones pro-opiomélanocortinergiques modulant l'oxyde nitrique au niveau paraventriculaire). L'activation MC4R modifie la sécrétion de leptine et la signalisation de la satiété. Les effets observés dans les modèles précliniques incluent une augmentation de l'eumélanine, une réduction de la prise alimentaire et une stimulation des comportements sexuels chez les rongeurs. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Le KLOW combine quatre peptides aux mécanismes complémentaires : GHK-Cu (remodelage matriciel, expression de >4 000 gènes pro-régénération), BPC-157 (angiogenèse VEGFR2/eNOS, migration des fibroblastes), TB-500 (fragment de la thymosine β4 : séquestration de la G-actine, migration des cellules souches endothéliales, modulation de la PINCH-ILK-α-parvin) et KPV (tripeptide C-terminal de l'α-MSH : inhibition de NF-κB, réduction des cytokines pro-inflammatoires IL-1β, TNF-α et IL-6). L'ensemble est étudié in vitro pour son potentiel synergique sur les modèles de cicatrisation, d'inflammation chronique et de réparation tissulaire combinée. Aucun effet hormonal systémique direct n'est documenté pour ce blend. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "Le NAD+ (Nicotinamide Adénine Dinucléotide) est un cofacteur essentiel des réactions d'oxydoréduction cellulaires et le substrat obligatoire des sirtuines (SIRT1-7), des PARPs (Poly-ADP-ribose polymérases) et des CD38. Les études (PMC10692436, PMC9512238, PMID 37971292) décrivent une diminution progressive des niveaux intracellulaires de NAD+ avec l'âge, corrélée à un déclin de la fonction mitochondriale et de la réparation de l'ADN. L'élévation des niveaux de NAD+ in vitro restaure l'activité de SIRT3 (déacétylation des protéines mitochondriales), améliore la β-oxydation des acides gras et stimule la biogenèse mitochondriale via la voie PGC-1α. Au niveau hormonal, les études décrivent une amélioration de la sensibilité à l'insuline et une modulation du métabolisme du tryptophane via la voie de kynurénine. Les effets observés incluent une réduction des marqueurs de sénescence cellulaire (p16, p21) et une augmentation de l'autophagie. " +
      RUO_DISCLAIMER,
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
    detailedEffects:
      "La Tésamoréline est un analogue stabilisé de la GHRH humaine (1-44) protégé contre la dégradation par la DPP-IV grâce à un groupement trans-3-hexenoyl en N-terminal. Les études (PMID 20554713, PMID 18690162, JAMA fullarticle/1889139) ont montré que la Tésamoréline se lie au récepteur GHRH-R des cellules somatotropes hypophysaires, activant la voie Gαs → AMPc → PKA et stimulant la libération pulsatile physiologique de GH endogène. En aval, l'IGF-1 hépatique augmente. Au niveau corporel, les travaux cliniques (population VIH avec lipodystrophie) ont documenté une réduction sélective et significative du tissu adipeux viscéral (−18 % en 26 semaines), sans perte de tissu sous-cutané ni effet majeur sur la glycémie ou la sensibilité à l'insuline. Les études décrivent également une modulation favorable des marqueurs lipidiques (triglycérides à la baisse). " +
      RUO_DISCLAIMER,
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
    category: "Reconstitution",
    shortDescription:
      "Solvant de reconstitution stérile à 0,9 % d'alcool benzylique — usage exclusivement laboratoire.",
    researchSummary:
      "Solvant de reconstitution pour peptides lyophilisés en laboratoire. Conservation prolongée des solutions reconstituées grâce à l'alcool benzylique.",
    detailedEffects:
      "L'eau bactériostatique est une eau stérile USP additionnée de 0,9 % d'alcool benzylique, agent bactériostatique qui inhibe la croissance de la majorité des micro-organismes courants. Ce solvant est utilisé en laboratoire pour la reconstitution de peptides lyophilisés et permet la conservation des solutions reconstituées en chaîne du froid jusqu'à 28 jours selon le composé. Aucun effet pharmacologique propre n'est attendu. " +
      RUO_DISCLAIMER,
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
