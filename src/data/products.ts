export type BulkTier = { minQty: number; discountPct: number; label?: string };
export type Variant = {
  dosage: string;
  price: number;
  promoPrice?: number;
  bulkTiers?: BulkTier[];
  soldOut?: boolean;
  lowStock?: boolean;
};

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
  hidden?: boolean;
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


export const minPrice = (p: Product) => {
  const usable = p.variants.filter((v) => !v.soldOut);
  const list = (usable.length ? usable : p.variants).map((v) => v.promoPrice ?? v.price);
  return Math.min(...list);
};
export const defaultVariant = (p: Product) => p.variants.find((v) => !v.soldOut) ?? p.variants[0];
export const hasPromo = (p: Product) => p.variants.some((v) => !v.soldOut && v.promoPrice != null);

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
      { dosage: "5 mg", price: 54.0, soldOut: true },
      {
        dosage: "10 mg",
        price: 99.0,
        promoPrice: 89.0,
        bulkTiers: [
          { minQty: 3, discountPct: 10.1, label: "Pack ×3" },
          { minQty: 6, discountPct: 14.14, label: "Pack ×6" },
        ],
      },
      { dosage: "20 mg", price: 149.0 },
      { dosage: "30 mg", price: 199.0 },
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
    references: [pmc("PMC11271400"), pubmed("41216380"), pubmed("41090431")],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    cas: "89030-95-5",
    molecularFormula: "C14H22CuN6O4",
    molecularWeight: "402.92 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [
      { dosage: "50 mg", price: 49.0 },
      { dosage: "100 mg", price: 79.0 },
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
    references: [pubmed("29986520"), pmc("PMC5332963"), pmc("PMC5295439")],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    cas: "863288-34-0 / 170851-70-4",
    molecularFormula: "C152H252N44O42 / C38H49N9O5",
    molecularWeight: "3367.9 / 711.9 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "5 mg + 5 mg", price: 64.0 }],
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
    references: [pubmed("9349622"), pubmed("10372741"), pubmed("19289567")],
  },
  {
    slug: "semax",
    name: "Semax",
    cas: "80714-61-0",
    molecularFormula: "C37H51N9O10S",
    molecularWeight: "813.92 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "5 mg", price: 44.0 }],
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
    references: [pubmed("29798983"), pmc("PMC11498467"), pmc("PMC8855339")],
  },
  {
    slug: "ahk-cu",
    name: "AHK-Cu",
    cas: "147658-05-9",
    molecularFormula: "C16H25CuN7O3",
    molecularWeight: "427.0 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [
      { dosage: "50 mg", price: 49.0 },
      { dosage: "100 mg", price: 79.0 },
    ],
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
    references: [pubmed("17703734")],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    cas: "137525-51-0",
    molecularFormula: "C62H98N16O22",
    molecularWeight: "1419.5 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "15 mg", price: 64.0 }],
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
    references: [pubmed("20225319"), pubmed("34829776"), pubmed("16583442")],
  },
  {
    slug: "mt-1",
    name: "Melanotan I",
    cas: "75921-69-6",
    molecularFormula: "C78H111N21O19",
    molecularWeight: "1646.85 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 59.0 }],
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
    references: [pubmed("22845050"), pubmed("19656325")],
  },
  {
    slug: "mt-2",
    name: "Melanotan II",
    cas: "121062-08-6",
    molecularFormula: "C50H69N15O9",
    molecularWeight: "1024.18 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 59.0 }],
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
    references: [pubmed("9679884"), pubmed("11739247"), pubmed("17584134")],
  },
  {
    slug: "klow",
    name: "KLOW",
    cas: "Mélange — multi-CAS",
    molecularFormula: "GHK-Cu + BPC-157 + TB-500 + KPV",
    molecularWeight: "—",
    purity: "≥ 99.0 % (HPLC, par composant)",
    variants: [{ dosage: "80 mg", price: 159.0 }],
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
    references: [pubmed("29986520"), pubmed("20225319"), pubmed("10469335")],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    cas: "53-84-9",
    molecularFormula: "C21H27N7O14P2",
    molecularWeight: "663.43 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "1000 mg", price: 109.0 }],
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
    references: [pmc("PMC10721522"), pmc("PMC6611812"), pmc("PMC8932245")],
  },
  {
    slug: "tesamoreline",
    name: "Tesamorelin",
    cas: "218949-48-5",
    molecularFormula: "C221H366N72O67S",
    molecularWeight: "5135.8 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 109.0 }],
    category: "Croissance",
    shortDescription:
      "Analogue stabilisé du GHRH — outil de référence pour la caractérisation in vitro du récepteur GHRH-R.",
    researchSummary:
      "Peptide synthétique utilisé comme outil pharmacologique pour l'étude in vitro de la signalisation GHRH-R sur lignées hypophysaires.",
    detailedEffects:
      "La Tesamorelin est un analogue stabilisé de la GHRH humaine (1-44) protégé contre la dégradation par la DPP-IV grâce à un groupement trans-3-hexenoyl en N-terminal. Les études (PMID 20554713, PMID 18690162, JAMA fullarticle/1889139) ont montré que la Tesamorelin se lie au récepteur GHRH-R des cellules somatotropes hypophysaires, activant la voie Gαs → AMPc → PKA et stimulant la libération pulsatile physiologique de GH endogène. En aval, l'IGF-1 hépatique augmente. Au niveau corporel, les travaux cliniques (population VIH avec lipodystrophie) ont documenté une réduction sélective et significative du tissu adipeux viscéral (−18 % en 26 semaines), sans perte de tissu sous-cutané ni effet majeur sur la glycémie ou la sensibilité à l'insuline. Les études décrivent également une modulation favorable des marqueurs lipidiques (triglycérides à la baisse). " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("22050344"), pmc("PMC9947601"), pubmed("41545261")],
  },
  {
    slug: "eau-bacteriostatique",
    name: "Eau bactériostatique",
    cas: "7732-18-5 (H₂O) + 0,9 % alcool benzylique",
    molecularFormula: "H₂O + C7H8O",
    molecularWeight: "—",
    purity: "USP grade",
    variants: [{ dosage: "10 mL", price: 9.9 }],
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
  {
    slug: "dsip",
    name: "DSIP",
    cas: "62568-57-4",
    molecularFormula: "C35H48N10O15",
    molecularWeight: "848.81 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 44.0 }],
    category: "Cognitif",
    shortDescription:
      "Delta Sleep-Inducing Peptide — nonapeptide étudié in vitro pour ses effets sur les rythmes circadiens et le stress oxydatif.",
    researchSummary:
      "Nonapeptide endogène utilisé comme outil de recherche in vitro pour la caractérisation de la modulation du sommeil delta et des réponses au stress.",
    detailedEffects:
      "Le DSIP (Delta Sleep-Inducing Peptide) est un nonapeptide isolé du sang de lapin en sommeil delta induit. Les études (PMID 6087901, PMID 6504737) décrivent une modulation des ondes EEG delta dans des modèles précliniques, une atténuation de la libération de somatostatine et une stimulation modeste de la GH. Au niveau hormonal, les travaux observent une réduction du cortisol basal, une normalisation de l'axe HPA en condition de stress chronique et une augmentation transitoire de la LH. In vitro, le DSIP montre des propriétés antioxydantes (réduction de la peroxydation lipidique, augmentation de la SOD et de la catalase). Des effets neuroprotecteurs et anti-nociceptifs ont également été documentés. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("6895513"), pubmed("1299794"), pubmed("6145137")],
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    cas: "307297-39-8",
    molecularFormula: "C14H22N4O9",
    molecularWeight: "390.35 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 44.0 }],
    category: "Anti-âge",
    shortDescription:
      "Tétrapeptide (Ala-Glu-Asp-Gly) — outil de recherche in vitro sur l'activité télomérase et la sénescence cellulaire.",
    researchSummary:
      "Peptide synthétique utilisé comme outil expérimental pour l'étude in vitro de l'expression de la télomérase (hTERT) et de la pinéale.",
    detailedEffects:
      "L'Epithalon (Epitalon) est un tétrapeptide synthétique inspiré de l'Epithalamine pinéale. Les études (PMID 12937682, PMID 14708087) décrivent une stimulation de l'expression de la sous-unité catalytique de la télomérase (hTERT) et un allongement des télomères dans des cultures de fibroblastes humains. Au niveau hormonal, les travaux observent une normalisation du rythme circadien de la mélatonine, une restauration partielle de la fonction pinéale sénescente et une modulation de l'axe gonadotrope chez le rat âgé. Des effets sur la sénescence cellulaire (réduction de p21, β-galactosidase associée à la sénescence) et une activité antioxydante ont également été rapportés in vitro. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("29124531"), pmc("PMC12411320"), pubmed("40141333")],
  },
  {
    slug: "kpv",
    name: "KPV",
    cas: "67727-97-3",
    molecularFormula: "C19H26N4O4",
    molecularWeight: "390.43 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 44.0 }],
    category: "Réparation",
    shortDescription:
      "Tripeptide C-terminal de l'α-MSH (Lys-Pro-Val) — outil d'étude in vitro de la voie NF-κB.",
    researchSummary:
      "Tripeptide utilisé comme outil expérimental pour l'inhibition de la voie pro-inflammatoire NF-κB dans les modèles cellulaires.",
    detailedEffects:
      "Le KPV est le tripeptide C-terminal de l'α-MSH (résidus 11-13). Contrairement à l'α-MSH entière, il ne présente pas d'affinité significative pour les récepteurs mélanocortines et agit principalement en intracellulaire. Les études (PMID 18789754, PMC2241650) décrivent une inhibition de la voie NF-κB par interaction avec les sous-unités p65/p50, conduisant à une réduction de la production des cytokines pro-inflammatoires IL-1β, TNF-α, IL-6 et IL-8. In vitro, le KPV diminue la chimiotaxie des neutrophiles et la phosphorylation de l'IκB. Des effets antimicrobiens directs et une modulation de la barrière épithéliale intestinale (renforcement des jonctions serrées) ont également été documentés. Aucun effet hormonal n'est rapporté. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("12750433"), pubmed("17934097"), pubmed("10670585")],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    cas: "1627580-64-6",
    molecularFormula: "C82H133N21O22S2",
    molecularWeight: "1820.2 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 69.0 }],
    category: "Anti-âge",
    shortDescription:
      "Peptide mitochondrial codé par l'ADN mitochondrial (16S rRNA) — outil d'étude in vitro du métabolisme AMPK / glucose.",
    researchSummary:
      "Peptide d'origine mitochondriale utilisé comme outil de recherche in vitro pour la voie AMPK et la sensibilité à l'insuline.",
    detailedEffects:
      "Le MOTS-c (Mitochondrial Open Reading frame of the Twelve S rRNA-c) est un peptide de 16 acides aminés codé par l'ARN ribosomal 12S mitochondrial. Les études (PMID 25738459, PMC4753972) décrivent une activation de la voie AMPK indépendante du ratio AMP/ATP, conduisant à une augmentation de la capture du glucose musculaire, une stimulation de la β-oxydation des acides gras et une inhibition de la lipogenèse hépatique. Au niveau hormonal, les travaux observent une amélioration de la sensibilité à l'insuline, une réduction de l'hyperglycémie induite par un régime hypercalorique et une modulation de l'axe folate-méthionine via la voie AICAR. Une translocation nucléaire du MOTS-c en condition de stress métabolique régule l'expression de gènes de réponse antioxydante. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("27216708"), pubmed("34520826"), pmc("PMC8376922")],
  },
  {
    slug: "oxytocin",
    name: "Oxytocine",
    cas: "50-56-6",
    molecularFormula: "C43H66N12O12S2",
    molecularWeight: "1007.19 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 49.0 }],
    category: "Cognitif",
    shortDescription:
      "Nonapeptide cyclique — outil de référence pour l'étude in vitro du récepteur OXTR.",
    researchSummary:
      "Hormone neurohypophysaire utilisée comme ligand de référence dans la caractérisation in vitro du récepteur ocytocine.",
    detailedEffects:
      "L'ocytocine est un nonapeptide cyclique synthétisé par les noyaux paraventriculaire et supraoptique de l'hypothalamus. Les études (PMID 21750565, PMC3656338) décrivent une activation du récepteur OXTR couplé à Gαq, conduisant à une mobilisation du calcium intracellulaire via la voie PLC/IP3. Au niveau hormonal et comportemental, les travaux documentent une modulation des comportements sociaux et affiliatifs, une réduction de l'amygdale en réponse au stress social, une diminution du cortisol et une modulation de la sérotonine et de la dopamine. Sur le plan périphérique, l'OXTR est présent dans l'utérus, les glandes mammaires et les ostéoclastes ; in vitro, l'ocytocine module le remodelage osseux et la prolifération des cellules β pancréatiques. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pmc("PMC7951958"), pmc("PMC5474129"), pmc("PMC3936960")],
  },
  {
    slug: "pt-141",
    name: "PT-141",
    cas: "189691-06-3",
    molecularFormula: "C50H68N14O10",
    molecularWeight: "1025.18 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 54.0 }],
    category: "Mélanocortine",
    shortDescription:
      "Bremelanotide — analogue sélectif MC4R/MC3R, outil d'étude in vitro de l'axe mélanocortinergique central.",
    researchSummary:
      "Heptapeptide cyclique utilisé comme outil pharmacologique pour la signalisation MC4R sur les neurones hypothalamiques.",
    detailedEffects:
      "Le PT-141 (Bremelanotide) est un heptapeptide cyclique dérivé du Melanotan II avec une sélectivité accrue pour les récepteurs MC4R et MC3R, et une affinité réduite pour MC1R (donc effet pigmentaire minimal). Les études (PMID 18684229, PMC5310636) caractérisent une activation des neurones pro-opiomélanocortinergiques du noyau paraventriculaire hypothalamique, modulant la libération centrale d'oxyde nitrique et de dopamine. Au niveau hormonal, contrairement aux composés vasoactifs, le PT-141 agit par voie centrale sans modifier significativement la pression artérielle systémique aux doses pharmacologiques. Les travaux décrivent une stimulation du comportement copulatoire dans des modèles précliniques et un effet sur la satiété via la voie MC4R-leptine. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("31599840"), pmc("PMC6819023"), pmc("PMC8788464")],
  },
  {
    slug: "selank",
    name: "Selank",
    cas: "129954-34-3",
    molecularFormula: "C33H57N11O9",
    molecularWeight: "751.88 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "5 mg", price: 44.0 }],
    category: "Cognitif",
    shortDescription:
      "Heptapeptide analogue de la tuftsine — outil d'étude in vitro des voies GABAergique et anxiolytique.",
    researchSummary:
      "Peptide synthétique russe utilisé comme outil expérimental pour la modulation de l'expression du BDNF et du système GABA.",
    detailedEffects:
      "Le Selank est un heptapeptide synthétique dérivé de la tuftsine (Thr-Lys-Pro-Arg) stabilisée par l'ajout du tripeptide Pro-Gly-Pro. Les études (PMID 26228446, PMID 21390649) décrivent une modulation de l'expression hippocampique du BDNF et du NGF, ainsi qu'une potentialisation de la transmission GABAergique sans affinité directe pour le récepteur GABA-A (contrairement aux benzodiazépines). Au niveau hormonal, les travaux observent une réduction modérée du cortisol en condition de stress aigu, une modulation de la sérotonine et de la noradrénaline, et une augmentation de l'enképhaline endogène. Des effets anxiolytiques sans sédation, antidépresseurs et immunomodulateurs (modulation IL-6 et IFN-α) sont documentés dans des modèles précliniques et études cliniques russes. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("31625062"), pmc("PMC5322660")],
  },
  {
    slug: "snap-8",
    name: "SNAP-8",
    cas: "868844-74-0",
    molecularFormula: "C40H67N11O13",
    molecularWeight: "910.03 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "10 mg", price: 49.0 }],
    category: "Réparation",
    shortDescription:
      "Octapeptide-mimétique du domaine N-terminal de la SNAP-25 — outil d'étude in vitro du complexe SNARE.",
    researchSummary:
      "Peptide synthétique utilisé comme outil de recherche in vitro pour la modulation de l'exocytose neuronale et du complexe SNARE.",
    detailedEffects:
      "Le SNAP-8 est un octapeptide mimétique du domaine N-terminal de la protéine SNAP-25, composante essentielle du complexe SNARE qui régule la fusion des vésicules synaptiques avec la membrane présynaptique. Les études in vitro (PMID 16641057) décrivent une compétition partielle avec la SNAP-25 endogène, réduisant la formation du complexe SNARE et atténuant la libération calcium-dépendante des neurotransmetteurs. Au niveau cutané, les modèles précliniques rapportent une réduction transitoire des contractions musculaires faciales (effet myorelaxant local) sans diffusion systémique. Aucun effet hormonal n'a été documenté. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("16641057")],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    cas: "77591-33-4",
    molecularFormula: "C212H350N56O78S",
    molecularWeight: "4963.4 g/mol",
    purity: "≥ 99.0 % (HPLC)",
    variants: [{ dosage: "5 mg", price: 54.0 }],
    category: "Réparation",
    shortDescription:
      "Fragment synthétique de la Thymosine β4 — outil d'étude in vitro de la migration cellulaire et de l'angiogenèse.",
    researchSummary:
      "Peptide synthétique correspondant à un fragment actif de la Thymosine β4, utilisé pour l'étude in vitro de la séquestration de la G-actine.",
    detailedEffects:
      "Le TB-500 reproduit la séquence active de la Thymosine β4 (Tβ4), peptide endogène impliqué dans la régulation du cytosquelette d'actine. Les études (PMID 22315649, PMC3679553) décrivent une séquestration de la G-actine, modulant la polymérisation en F-actine et favorisant la migration cellulaire (kératinocytes, cellules endothéliales, cellules souches). Au niveau angiogénique, le TB-500 stimule la formation de tubes capillaires par les HUVEC et active la voie PINCH-ILK-α-parvin. Les modèles précliniques décrivent une accélération de la cicatrisation cutanée, cardiaque et tendineuse, ainsi qu'une modulation des cytokines pro-inflammatoires. Aucun effet hormonal direct n'est rapporté. " +
      RUO_DISCLAIMER,
    storage: "Lyophilisé : −20 °C. Reconstitué : 2–8 °C.",
    reconstitution: "Eau bactériostatique stérile.",
    references: [pubmed("10469335"), pubmed("17600280")],
  },
  {
    slug: "eau-bacteriostatique-3ml-offerte",
    name: "Eau bactériostatique 3 mL",
    cas: "7732-18-5 (H₂O) + 0,9 % alcool benzylique",
    molecularFormula: "H₂O + C7H8O",
    molecularWeight: "—",
    purity: "USP grade",
    variants: [{ dosage: "3 mL", price: 4.90 }],
    category: "Reconstitution",
    hidden: true,
    shortDescription:
      "Solvant de reconstitution stérile 3 mL — offert avec la première commande de Retatrutide 10/20/30 mg (à vie), puis 4,90 €.",
    researchSummary:
      "Solvant de reconstitution offert à la première commande, pour peptides lyophilisés en laboratoire.",
    detailedEffects:
      "Eau bactériostatique stérile USP additionnée de 0,9 % d'alcool benzylique. Offerte à la première commande d'un client (à vie) contenant du Retatrutide 10 mg, 20 mg ou 30 mg. Ajoutée automatiquement à 4,90 € pour les commandes suivantes. " +
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
    items: ["Retatrutide 10 mg", "Tesamorelin 10 mg", "Eau bactériostatique 30 mL"],
    price: 207.9,
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
