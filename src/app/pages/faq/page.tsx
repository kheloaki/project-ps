import React from "react";
import { Metadata } from "next";
import { generateFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Peptides Skin",
  description: "Find answers to common questions about our research peptides, storage, quality standards, and shipping policies.",
  alternates: {
    canonical: "/pages/faq",
  },
};

const faqs = [
  {
    question: "ARE YOUR PRODUCTS FOR HUMAN CONSUMPTION?",
    answer: "No. All products sold on Peptides Skin are strictly for LABORATORY RESEARCH USE ONLY. They are not intended for human or animal consumption, diagnostic, or therapeutic use."
  },
  {
    question: "HOW SHOULD I STORE MY PEPTIDES?",
    answer: "Peptides should be stored in a cool, dry place away from direct sunlight. For long-term storage, we recommend keeping them in a refrigerator at 2-8 degrees C or a freezer at -20 degrees C."
  },
  {
    question: "DO YOU PROVIDE CERTIFICATES OF ANALYSIS (COA)?",
    answer: "Yes, we provide third-party COAs for every batch of our peptides to ensure the highest purity and quality for your research."
  },
  {
    question: "HOW LONG DOES SHIPPING TAKE?",
    answer: "Orders are typically processed within 1-2 business days. Shipping times vary by location, but standard domestic shipping usually takes 3-5 business days."
  }
];

export default function FAQ() {
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-white pt-[48px]">
        <main className="container mx-auto max-w-[800px] px-5 py-20">
          <h1 className="text-3xl font-bold mb-10 uppercase tracking-tight text-[#111827]">Frequently Asked Questions</h1>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-bold text-[#111827] uppercase mb-3">{faq.question}</h3>
                <p className="text-[#4b5563] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
