import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Peptides Skin",
  description: "Read our terms of service including our strict research-only policy and usage guidelines for our products and website.",
  alternates: {
    canonical: "/policies/terms-of-service",
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white pt-[48px]">
      <main className="container mx-auto max-w-[800px] px-5 py-20">
        <h1 className="text-3xl font-bold mb-10 uppercase tracking-tight text-[#111827]">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-[#4b5563] space-y-6">
          <p>Last updated: January 11, 2026</p>
          <h2 className="text-xl font-semibold text-[#111827] uppercase">1. Terms</h2>
          <p>By accessing this website, you are agreeing to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on Peptides Skin website for personal, non-commercial transitory viewing only.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">3. Research Use Only</h2>
          <p>The products provided by Peptides Skin are for LABORATORY RESEARCH USE ONLY. They are not for human consumption, animal consumption, or any other use.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">4. Disclaimer</h2>
          <p>The materials on Peptides Skin website are provided on an as is basis. Peptides Skin makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </div>
      </main>
    </div>
  );
}
