import coaRetatrutide from "@/assets/coa/coa-retatrutide-10mg.jpg.asset.json";
import coaGhkCu from "@/assets/coa/coa-ghk-cu.jpg.asset.json";
import coaCjcIpa from "@/assets/coa/coa-cjc-1295-ipamorelin.jpg.asset.json";
import coaSemax from "@/assets/coa/coa-semax.jpg.asset.json";
import coaBpc157 from "@/assets/coa/coa-bpc-157.jpg.asset.json";
import coaMt1 from "@/assets/coa/coa-mt-1.jpg.asset.json";
import coaMt2 from "@/assets/coa/coa-mt-2.jpg.asset.json";
import coaKlow from "@/assets/coa/coa-klow.jpg.asset.json";
import coaNad from "@/assets/coa/coa-nad-plus.jpg.asset.json";
import coaTesa from "@/assets/coa/coa-tesamoreline.jpg.asset.json";

export type CoaItem = {
  slug: string;
  productSlug?: string;
  name: string;
  dosage: string;
  taskNumber: string;
  purity: string;
  verifyKey: string;
  date: string;
  src: string;
  notes?: string;
};

export const coaCatalog: CoaItem[] = [
  { slug: "retatrutide-10mg", productSlug: "retatrutide", name: "Retatrutide", dosage: "10 mg", taskNumber: "#109022", purity: "99.169 % / 99.161 %", verifyKey: "132C6ASFNB4V", date: "19 FEB 2026", src: coaRetatrutide.url },
  { slug: "ghk-cu-50mg", productSlug: "ghk-cu", name: "GHK-Cu", dosage: "50 mg", taskNumber: "#65331", purity: "99.886 %", verifyKey: "KYB39ZQFJ7DV", date: "18 MAY 2025", src: coaGhkCu.url },
  { slug: "cjc-1295-ipamorelin", productSlug: "cjc-1295-ipamorelin", name: "CJC-1295 + Ipamorelin", dosage: "5 mg + 5 mg", taskNumber: "#66682", purity: "Identité confirmée (5.22 + 5.74 mg)", verifyKey: "MR9RWZYIM5PV", date: "05 JUN 2025", src: coaCjcIpa.url },
  { slug: "semax-10mg", productSlug: "semax", name: "Semax", dosage: "10 mg", taskNumber: "#64097", purity: "99.059 %", verifyKey: "JQLUTEGCJBSK", date: "06 MAY 2025", src: coaSemax.url },
  { slug: "bpc-157-10mg", productSlug: "bpc-157", name: "BPC-157", dosage: "10 mg", taskNumber: "#65332", purity: "99.527 % / 99.573 %", verifyKey: "189HGA1Y94Y7", date: "19 MAY 2025", src: coaBpc157.url },
  { slug: "mt-1-10mg", productSlug: "mt-1", name: "Melanotan I", dosage: "10 mg", taskNumber: "#75760", purity: "99.762 % / 99.571 %", verifyKey: "TDM8D15H11BE", date: "22 AUG 2025", src: coaMt1.url },
  { slug: "mt-2-10mg", productSlug: "mt-2", name: "Melanotan II", dosage: "10 mg", taskNumber: "#75881", purity: "99.948 % / 99.969 %", verifyKey: "TVB3I71FDGV6", date: "22 AUG 2025", src: coaMt2.url },
  { slug: "klow-80mg", productSlug: "klow", name: "KLOW", dosage: "80 mg", taskNumber: "#66683", purity: "Multi-peptide blend confirmé", verifyKey: "1J45T6SPTB6Q", date: "05 JUN 2025", src: coaKlow.url, notes: "TB-500 · BPC-157 · GHK-Cu · KPV" },
  { slug: "nad-plus-1000mg", productSlug: "nad-plus", name: "NAD+", dosage: "1000 mg", taskNumber: "#75743", purity: "Quantification 973.33 / 992.04 mg", verifyKey: "36MY3SF38LNW", date: "20 AUG 2025", src: coaNad.url },
  { slug: "tesamoreline-10mg", productSlug: "tesamoreline", name: "Tesamorelin", dosage: "10 mg", taskNumber: "#77839", purity: "99.209 % / 99.305 %", verifyKey: "HR5QHQXCUSEX", date: "09 SEP 2025", src: coaTesa.url },
];

export const findCoaForProduct = (productSlug: string) =>
  coaCatalog.find((c) => c.productSlug === productSlug);
