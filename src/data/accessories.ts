import packEssentielImg from "@/assets/products/pack-essentiel.png.asset.json";
import packPremiumImg from "@/assets/products/pack-premium.png.asset.json";
import syringesX5Img from "@/assets/products/seringues-x5.png.asset.json";
import syringesX10Img from "@/assets/products/seringues-x10.png.asset.json";
import syringesX20Img from "@/assets/products/seringues-x20.png.asset.json";
import padsX10Img from "@/assets/products/tampons-x10.png.asset.json";
import padsX20Img from "@/assets/products/tampons-x20.png.asset.json";

export type AccessoryFamily = "Pack" | "Seringues" | "Antiseptique";
export type AccessoryBadge = "Recommandé" | "Meilleure valeur" | "Best-seller" | "Premium";

export type Accessory = {
  slug: string;
  name: string;
  shortName: string;
  family: AccessoryFamily;
  variantLabel: string;
  variantGroup?: string;
  priceEUR: number;
  originalPriceEUR?: number;
  description: string;
  specs: { label: string; value: string }[];
  imageUrl: string;
  badge?: AccessoryBadge;
  variantDefault?: boolean;
};

const SYRINGE_DESC =
  "Seringues de recherche 0,5 ml — 30G × 8 mm\n\nLes seringues graduées 0,5 ml équipées d'une aiguille 30G × 8 mm sont des consommables couramment utilisés pour les travaux de recherche nécessitant la manipulation de très faibles volumes de liquide avec un niveau élevé de précision.\n\nGrâce à leur graduation fine et à leur faible volume nominal, elles permettent un contrôle précis des quantités prélevées lors des opérations de préparation, dilution, transfert ou échantillonnage. L'aiguille 30G offre un diamètre particulièrement fin, adapté aux manipulations nécessitant un prélèvement précis à travers des septums ou bouchons compatibles.\n\nChaque seringue est fournie stérile et emballée individuellement afin de préserver son intégrité jusqu'à son utilisation.\n\nCaractéristiques\n\n• Capacité : 0,5 ml\n• Aiguille : 30G × 8 mm\n• Graduation de précision\n• Emballage individuel stérile\n• Usage unique";

const PADS_DESC =
  "Tampons alcoolisés 70 % — Conditionnement individuel\n\nLes tampons alcoolisés imprégnés d'isopropanol 70 % constituent un accessoire essentiel pour les manipulations de recherche impliquant des flacons, contenants et matériels de laboratoire. Ils permettent le nettoyage rapide des surfaces de travail, bouchons de flacons, septums et autres éléments manipulés au cours des procédures de recherche.\n\nChaque tampon est emballé individuellement afin de préserver son intégrité jusqu'à son utilisation.\n\nCaractéristiques\n\n• Tampons imprégnés d'alcool isopropylique 70 %\n• Conditionnement individuel\n• Usage unique\n• Format compact et facile à transporter";

export const accessories: Accessory[] = [
  {
    slug: "pack-accessoires-essentiel",
    name: "Pack Accessoires Essentiel",
    shortName: "Pack Essentiel",
    family: "Pack",
    variantLabel: "Pack Essentiel",
    priceEUR: 12.9,
    originalPriceEUR: 14.8,
    badge: "Recommandé",
    imageUrl: packEssentielImg.url,
    description:
      "Pack Accessoires Essentiel\n\nLe Pack Accessoires Essentiel rassemble les consommables les plus utilisés pour les travaux de recherche nécessitant la manipulation de faibles volumes et le maintien de bonnes pratiques de laboratoire.\n\nIl comprend 10 seringues graduées 0,5 ml 30G × 8 mm ainsi que 10 tampons alcoolisés 70 % à usage unique, conditionnés individuellement.\n\nContenu du pack\n\n• 10 seringues graduées 0,5 ml — 30G × 8 mm\n• 10 tampons alcoolisés 70 % emballés individuellement\n\nPoints forts\n\n• Consommables de laboratoire à usage unique\n• Conditionnement individuel\n• Format compact et économique\n• Prêt à l'emploi dès réception\n\nRéservé à la recherche scientifique. Non destiné à un usage humain ou vétérinaire.",
    specs: [
      { label: "Contenu", value: "10 seringues + 10 tampons" },
      { label: "Seringues", value: "0,5 ml · 30G · 8 mm" },
      { label: "Antiseptique", value: "Isopropanol 70 %" },
    ],
  },
  {
    slug: "pack-accessoires-premium",
    name: "Pack Accessoires Premium",
    shortName: "Pack Premium",
    family: "Pack",
    variantLabel: "Pack Premium",
    priceEUR: 24.9,
    originalPriceEUR: 33.8,
    badge: "Premium",
    imageUrl: packPremiumImg.url,
    description:
      "Pack Accessoires Premium\n\nLe Pack Accessoires Premium regroupe l'ensemble des consommables essentiels pour les projets de recherche nécessitant des manipulations régulières, des préparations de solutions et des transferts de faibles volumes avec précision.\n\nConçu pour offrir une solution complète et prête à l'emploi, ce pack associe 20 seringues graduées 0,5 ml 30G × 8 mm, 20 tampons alcoolisés 70 % à usage unique ainsi qu'un flacon d'eau bactériostatique 10 ml.\n\nContenu du pack\n\n• 20 seringues graduées 0,5 ml — 30G × 8 mm\n• 20 tampons alcoolisés 70 % emballés individuellement\n• 1 flacon d'eau bactériostatique 10 ml\n\nPoints forts\n\n• Solution complète prête à l'emploi\n• Consommables conditionnés individuellement\n• Manipulation précise des faibles volumes\n• Stock renforcé pour les projets de recherche prolongés\n\nRéservé à la recherche scientifique. Non destiné à un usage humain ou vétérinaire.",
    specs: [
      { label: "Contenu", value: "20 seringues + 20 tampons + 1 BAC water" },
      { label: "Seringues", value: "0,5 ml · 30G · 8 mm" },
      { label: "Solvant", value: "Eau bactériostatique 10 ml" },
    ],
  },
  {
    slug: "seringues-insuline-05ml-30g-8mm-x5",
    name: "Seringues insuline 0,5 ml 30G 8 mm — Pack de 5",
    shortName: "Seringues x5",
    family: "Seringues",
    variantGroup: "syringes",
    variantLabel: "Pack de 5",
    priceEUR: 4.9,
    imageUrl: syringesX5Img.url,
    description: SYRINGE_DESC + "\n\nContenu du pack : 5 seringues graduées 0,5 ml — 30G × 8 mm.",
    specs: [
      { label: "Volume", value: "0,5 ml" },
      { label: "Aiguille", value: "30G · 8 mm" },
      { label: "Quantité", value: "5 unités" },
    ],
  },
  {
    slug: "seringues-insuline-05ml-30g-8mm-x10",
    name: "Seringues insuline 0,5 ml 30G 8 mm — Pack de 10",
    shortName: "Seringues x10",
    family: "Seringues",
    variantGroup: "syringes",
    variantLabel: "Pack de 10",
    variantDefault: true,
    priceEUR: 8.9,
    badge: "Best-seller",
    imageUrl: syringesX10Img.url,
    description: SYRINGE_DESC + "\n\nContenu du pack : 10 seringues graduées 0,5 ml — 30G × 8 mm.",
    specs: [
      { label: "Volume", value: "0,5 ml" },
      { label: "Aiguille", value: "30G · 8 mm" },
      { label: "Quantité", value: "10 unités" },
    ],
  },
  {
    slug: "seringues-insuline-05ml-30g-8mm-x20",
    name: "Seringues insuline 0,5 ml 30G 8 mm — Pack de 20",
    shortName: "Seringues x20",
    family: "Seringues",
    variantGroup: "syringes",
    variantLabel: "Pack de 20",
    priceEUR: 15.9,
    badge: "Meilleure valeur",
    imageUrl: syringesX20Img.url,
    description: SYRINGE_DESC + "\n\nContenu du pack : 20 seringues graduées 0,5 ml — 30G × 8 mm.",
    specs: [
      { label: "Volume", value: "0,5 ml" },
      { label: "Aiguille", value: "30G · 8 mm" },
      { label: "Quantité", value: "20 unités" },
    ],
  },
  {
    slug: "tampons-alcoolises-70-x10",
    name: "Tampons alcoolisés 70 % — Pack de 10",
    shortName: "Tampons x10",
    family: "Antiseptique",
    variantGroup: "alcohol-pads",
    variantLabel: "Pack de 10",
    priceEUR: 3.9,
    imageUrl: padsX10Img.url,
    description: PADS_DESC + "\n\nContenu du pack : 10 tampons alcoolisés 70 % emballés individuellement.",
    specs: [
      { label: "Concentration", value: "Isopropanol 70 %" },
      { label: "Conditionnement", value: "Sachets individuels stériles" },
      { label: "Quantité", value: "10 unités" },
    ],
  },
  {
    slug: "tampons-alcoolises-70-x20",
    name: "Tampons alcoolisés 70 % — Pack de 20",
    shortName: "Tampons x20",
    family: "Antiseptique",
    variantGroup: "alcohol-pads",
    variantLabel: "Pack de 20",
    variantDefault: true,
    priceEUR: 5.9,
    badge: "Meilleure valeur",
    imageUrl: padsX20Img.url,
    description: PADS_DESC + "\n\nContenu du pack : 20 tampons alcoolisés 70 % emballés individuellement.",
    specs: [
      { label: "Concentration", value: "Isopropanol 70 %" },
      { label: "Conditionnement", value: "Sachets individuels stériles" },
      { label: "Quantité", value: "20 unités" },
    ],
  },
];

export const findAccessory = (slug: string) => accessories.find((a) => a.slug === slug);

export const PACK_ESSENTIEL_SLUG = "pack-accessoires-essentiel";
export const PACK_PREMIUM_SLUG = "pack-accessoires-premium";
