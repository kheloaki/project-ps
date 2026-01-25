import HeroSection from "@/components/sections/hero";
import PopularPeptides from "@/components/sections/popular-peptides";
import FilteredProducts from "@/components/sections/filtered-products";
import LatestNews from "@/components/sections/latest-news";
import NewsletterSection from "@/components/sections/newsletter";
import FAQsSection from "@/components/sections/faqs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peptides Skin - High-Purity Research Peptides & Bulk Synthesis",
  description: "Peptides Skin is a leading supplier of high-purity research peptides, offering B2B bulk synthesis and global shipping for biotechnology laboratories.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <PopularPeptides />
        <FilteredProducts />
        <LatestNews />
        <NewsletterSection />
        <FAQsSection />
      </main>
    </div>
  );
}
