"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductFAQsProps {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export default function ProductFAQs({ faqs }: ProductFAQsProps) {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-16 border-t border-[#e0e0e0]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="mb-8">
          <h2 className="text-[28px] md:text-[32px] font-semibold leading-[1.1] uppercase tracking-[0.1em] font-display text-[#121212] mb-4 text-center">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-[800px] mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border-b border-[#e0e0e0]"
              >
                <AccordionTrigger className="text-left text-[16px] md:text-[18px] font-semibold uppercase text-[#121212] hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-[#616161] leading-relaxed pb-6">
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

