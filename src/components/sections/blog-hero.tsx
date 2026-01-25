import React from 'react';
import Image from 'next/image';

/**
 * BlogHero Section component
 * Cloned based on provided design instructions, HTML structure, and visuals.
 * Specifically targets the featured blog post at the top of the news page.
 */
const BlogHero = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto max-w-[1200px] px-[20px] pt-[80px] pb-0">
        {/* Main Page Heading */}
        <h1 className="text-[48px] font-medium leading-[1.1] tracking-[-0.01em] mb-[2rem] text-[#121212]">
          News
        </h1>

        {/* Featured Post Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-[30px] items-start mb-[80px]">
          {/* Left: Large landscape image */}
          <div className="relative overflow-hidden rounded-[4px] border border-[#e2e2e2] group">
            <a 
              href="/blogs/news/bpc-157-potential-interactions-with-angiogenesis-inflammation-signaling-and-tissue-repair-pathways"
              className="block"
            >
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/bpc-157-research-hero-peptidesskin-com-1600x900-2.webp"
                alt="Stylized research graphic showing a BPC-157 peptide vial with a molecular diagram and an abstract vascular network background."
                width={1168}
                height={627}
                className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.05]"
                priority
              />
            </a>
          </div>

          {/* Right: Text Block */}
          <div className="flex flex-col justify-start">
            <a 
              href="/blogs/news/bpc-157-potential-interactions-with-angiogenesis-inflammation-signaling-and-tissue-repair-pathways"
              className="no-underline group"
            >
              <h2 className="text-[32px] font-medium leading-[1.2] text-[#121212] mb-[1.5rem] hover:text-[#108a9f] transition-colors duration-200">
                BPC-157: Potential Interactions with Angiogenesis, Inflammation Signaling, and Tissue Repair Pathways.
              </h2>
            </a>

            <div className="text-[16px] leading-[1.6] text-[#121212] mb-[1rem]">
              <p>
                BPC-157 is widely discussed in preclinical research for its potential links to vascular signaling, inflammation readouts, and tissue remodeling models. This page summarizes key pathways, assays, and limitations for research...
              </p>
              
              <a 
                href="/blogs/news/bpc-157-potential-interactions-with-angiogenesis-inflammation-signaling-and-tissue-repair-pathways"
                className="text-[14px] text-[#d0312d] font-normal no-underline hover:underline inline-block mt-[0.5rem]"
              >
                Read more...
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;