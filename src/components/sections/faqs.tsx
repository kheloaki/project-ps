"use client";

import React from 'react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

export default function FAQsSection() {
  return (
    <section className="bg-white py-[60px] md:py-[80px] border-t border-[#e0e0e0]">
      <div className="container px-[30px] mx-auto max-w-[1230px]">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] uppercase tracking-[0.1em] font-display text-[#121212] mb-4">
            Frequently Asked Questions
          </h2>
          <Link 
            href="/pages/faq" 
            className="text-[14px] font-medium uppercase tracking-[0.08em] text-[#8A773E] hover:underline"
          >
            View all FAQs
          </Link>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-[800px] mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#e0e0e0]">
                <AccordionTrigger className="text-left text-[18px] font-semibold uppercase text-[#121212] hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-[#616161] leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

