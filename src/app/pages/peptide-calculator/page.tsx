import { Metadata } from "next";
import PeptideCalculatorMain from "@/components/sections/peptide-calculator-main";
import MethodologySources from "@/components/sections/methodology-sources";
import PeptideGuideContent from "@/components/sections/peptide-guide-content";

export const metadata: Metadata = {
  title: "Peptide Reconstitution Calculator | Peptides Skin",
  description: "Accurate peptide reconstitution calculator for research. Calculate volume, concentration, and dosage for your laboratory studies.",
  alternates: {
    canonical: "/pages/peptide-calculator",
  },
};

export default function PeptideCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] pt-[48px]">
      <PeptideCalculatorMain />
      <MethodologySources />
      <PeptideGuideContent />
    </main>
  );
}
