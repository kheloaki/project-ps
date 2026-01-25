"use client";

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface ProductDetailsProps {
  product?: {
    title?: string;
    bodyHtml?: string;
    description?: string;
    coaImageUrl?: string;
  };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [parsed, setParsed] = useState<{
    characteristics: Array<{ label: string; value: string }>;
    researchUsage: string;
    areasOfStudy: Array<{ title: string; text: string }>;
    summary: string;
    references: Array<{ text: string; link: string }>;
    hasStructuredData: boolean;
  }>({
    characteristics: [],
    researchUsage: '',
    areasOfStudy: [],
    summary: '',
    references: [],
    hasStructuredData: false,
  });

  // Parse bodyHtml to extract structured data (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined' || !product?.bodyHtml) {
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(product.bodyHtml, 'text/html');
      
      // Extract characteristics from table
      const characteristics: Array<{ label: string; value: string }> = [];
      const charTable = doc.querySelector('h2')?.textContent?.includes('Characteristics') 
        ? doc.querySelector('table')
        : null;
      if (charTable) {
        const rows = charTable.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const label = cells[0].textContent?.trim() || '';
            const value = cells[1].textContent?.trim() || '';
            if (label && value) {
              characteristics.push({ label, value });
            }
          }
        });
      }

      // Extract research usage
      let researchUsage = '';
      const researchHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
        h2.textContent?.toLowerCase().includes('used in research')
      );
      if (researchHeading) {
        const nextP = researchHeading.nextElementSibling;
        if (nextP && nextP.tagName === 'P') {
          researchUsage = nextP.textContent?.trim() || '';
        }
      }

      // Extract areas of study
      const areasOfStudy: Array<{ title: string; text: string }> = [];
      const areasHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
        h2.textContent?.toLowerCase().includes('areas of study')
      );
      if (areasHeading) {
        const nextUl = areasHeading.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
          const items = nextUl.querySelectorAll('li');
          items.forEach(item => {
            const text = item.textContent?.trim() || '';
            const strong = item.querySelector('strong');
            const title = strong?.textContent?.trim() || '';
            const itemText = text.replace(title, '').trim();
            if (itemText) {
              areasOfStudy.push({ title, text: itemText });
            }
          });
        }
      }

      // Extract summary
      let summary = '';
      const summaryHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
        h2.textContent?.toLowerCase().includes('summary')
      );
      if (summaryHeading) {
        const nextP = summaryHeading.nextElementSibling;
        if (nextP && nextP.tagName === 'P') {
          summary = nextP.textContent?.trim() || '';
        }
      }

      // Extract references
      const references: Array<{ text: string; link: string }> = [];
      const refHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
        h2.textContent?.toLowerCase().includes('references')
      );
      if (refHeading) {
        const nextOl = refHeading.nextElementSibling;
        if (nextOl && nextOl.tagName === 'OL') {
          const items = nextOl.querySelectorAll('li');
          items.forEach(item => {
            const link = item.querySelector('a');
            const text = link?.textContent?.trim() || item.textContent?.trim() || '';
            const href = link?.getAttribute('href') || '#';
            if (text) {
              references.push({ text, link: href });
            }
          });
        }
      }

      const hasStructuredData = characteristics.length > 0 || 
                                 researchUsage.length > 0 || 
                                 areasOfStudy.length > 0 || 
                                 summary.length > 0 || 
                                 references.length > 0;

      setParsed({
        characteristics,
        researchUsage,
        areasOfStudy,
        summary,
        references,
        hasStructuredData,
      });
    } catch (error) {
      console.error('Error parsing HTML:', error);
      setParsed({
        characteristics: [],
        researchUsage: '',
        areasOfStudy: [],
        summary: '',
        references: [],
        hasStructuredData: false,
      });
    }
  }, [product?.bodyHtml]);

  // Only use parsed data - no hardcoded fallbacks
  const characteristics = parsed.characteristics;
  const researchUsageText = parsed.researchUsage;
  const areasOfStudy = parsed.areasOfStudy;
  const summaryText = parsed.summary;
  const references = parsed.references;

  const productTitle = product?.title || 'BPC-I57';

  // Only show nav items for sections that have content
  const navItems: string[] = [];
  if (product?.bodyHtml) navItems.push('Full description');
  if (characteristics.length > 0) navItems.push('Characteristics');
  if (researchUsageText) navItems.push(`How is ${productTitle} Used in Research?`);
  if (areasOfStudy.length > 0) navItems.push('Areas of Study');
  if (summaryText) navItems.push('Summary');
  if (references.length > 0) navItems.push('References');
  if (product?.coaImageUrl) navItems.push('Certificate of Analysis (COA)');
  navItems.push('Resource');

  return (
    <div className="w-full bg-white">
      {/* Sticky Sub-nav */}
      <div className="sticky top-16 z-30 hidden border-b border-gray-100 bg-white/80 backdrop-blur-md lg:block">
        <div className="container flex h-14 items-center gap-8 overflow-x-auto">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="whitespace-nowrap text-sm font-medium text-[#09121F] transition-colors hover:text-[#8A773E]"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

        <div className="container py-8 lg:py-16">
          <div className="space-y-16">
            {/* Full Description Section */}
            {product?.bodyHtml && (
              <section id="full-description" className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
                <h3 className="text-xl font-semibold text-[#09121F]">Full description</h3>
                <div 
                  className="text-sm leading-relaxed text-[#4B5563] lg:text-base space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.bodyHtml }}
                />
              </section>
            )}

            {/* Characteristics Section */}
            {characteristics.length > 0 && (
              <section id="characteristics" className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
                <h3 className="text-xl font-semibold text-[#09121F]">Characteristics</h3>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {characteristics.map((item, idx) => (
                        <tr key={item.label || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F4F7FC]'}>
                          <td className="w-1/3 px-6 py-4 font-medium text-[#4B5563]">{item.label}</td>
                          <td className="px-6 py-4 text-[#4B5563]">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* How is it Used in Research? Section */}
            {researchUsageText && (
              <section id="how-is-it-used-in-research?" className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
                <h3 className="text-xl font-semibold text-[#09121F]">How is {productTitle} Used in Research?</h3>
                <div className="space-y-4 text-sm leading-relaxed text-[#4B5563] lg:text-base">
                  <p>{researchUsageText}</p>
                </div>
              </section>
            )}

            {/* Areas of Study Section */}
            {areasOfStudy.length > 0 && (
              <section id="areas-of-study" className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
                <h3 className="text-xl font-semibold text-[#09121F]">Areas of Study</h3>
                <div className="space-y-6">
                  {areasOfStudy.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                        <Check className="h-5 w-5 text-[#8A773E]" strokeWidth={3} />
                      </div>
                      <p className="text-sm leading-relaxed text-[#4B5563] lg:text-base">
                        {item.title && <span className="font-semibold text-[#09121F]">{item.title} </span>}
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Summary Section */}
            {summaryText && (
              <section id="summary" className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
                <h3 className="text-xl font-semibold text-[#09121F]">Summary</h3>
                <p className="text-sm leading-relaxed text-[#4B5563] lg:text-base">
                  {summaryText}
                </p>
              </section>
            )}

            {/* References Section */}
            {references.length > 0 && (
              <section id="references" className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-12 lg:grid-cols-[280px_1fr] lg:gap-12">
                <h3 className="text-xl font-semibold text-[#09121F]">References</h3>
                <ul className="space-y-4">
                  {references.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <a
                        href={item.link}
                        className="text-sm text-[#8A773E] underline underline-offset-4 transition-colors hover:text-[#6B5E2F] lg:text-base"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>
        </div>
    </div>
  );
};

export default ProductDetails;
