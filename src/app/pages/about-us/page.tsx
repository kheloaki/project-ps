import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Peptides Skin",
  description: "Learn about Peptides Skin's mission to provide high-purity research-grade peptides to the global scientific community.",
  alternates: {
    canonical: "/pages/about-us",
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white pt-[48px]">
      <main className="pb-[90px]">
        <div className="container mx-auto px-5 max-w-[900px]">
          <div className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-[36px] md:text-[48px] font-bold text-black leading-tight mb-4">
              About Peptides Skin
            </h1>
            <p className="text-[16px] text-[#11819B] font-medium tracking-wider uppercase">
              Precision Synthesis for Global Research
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
            <section>
              <h2 className="text-[24px] font-bold text-black mb-4">Our Mission</h2>
              <p>
                At Peptides Skin, our mission is to empower the global scientific community by providing high-purity, research-grade peptides of the highest quality. We understand that the integrity of your research depends on the precision of your materials. That's why we specialize in the synthesis and distribution of complex peptides, ensuring that every batch meets rigorous analytical standards.
              </p>
            </section>

            <section>
              <h2 className="text-[24px] font-bold text-black mb-4">Quality Without Compromise</h2>
              <p>
                Quality is the cornerstone of our operations. Every peptide in our catalog undergoes comprehensive testing, including <strong>High-Performance Liquid Chromatography (HPLC)</strong> and <strong>Mass Spectrometry (MS)</strong>. We guarantee a purity level of ≥99% for our research materials, documented through detailed Certificates of Analysis (COA) that accompany every order.
              </p>
              <p>
                Our synthesis processes are optimized for stability, bioactivity, and reproducibility, allowing researchers to focus on their data without worrying about contaminants or batch-to-batch variability.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-lg border border-gray-100">
              <h2 className="text-[24px] font-bold text-black mb-4">B2B Solutions & Bulk Synthesis</h2>
              <p>
                Peptides Skin is a premier B2B supplier. We serve academic institutions, private biotechnology firms, and independent laboratories worldwide. Whether you require standard catalog items or custom bulk synthesis, our team is equipped to handle orders of all scales with the same level of precision and dedicated support.
              </p>
            </section>

            <section>
              <h2 className="text-[24px] font-bold text-black mb-4">Strict Research Compliance</h2>
              <p>
                We are committed to the highest ethical and regulatory standards in the industry. All products supplied by Peptides Skin are strictly for <strong>in vitro laboratory research</strong>. They are not intended for human or veterinary use, and we strictly enforce compliance with all local and international regulations regarding the distribution of research chemicals.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
