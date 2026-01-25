"use client";

import React from 'react';
import Image from 'next/image';

const FeaturedBlogPost = () => {
  // Asset path from the provided <assets> tag
  const featuredImage = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/reta-peptide-peptideskin-2.webp";

  return (
    <section className="bg-white py-[60px] md:py-[80px]">
      <div className="container mx-auto px-[30px] max-w-[1240px]">
        {/* Main Header Title as seen in screenshots */}
        <div className="mb-10 text-center">
          <h1 className="text-[48px] font-semibold uppercase leading-[1.1] tracking-[-0.02em] text-[#121212] mb-10">
            News
          </h1>
        </div>

        {/* Featured Blog Post Card - Horizontal on Desktop */}
        <div className="blog-post-card group relative">
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 items-stretch border border-[#e0e0e0]">
            {/* Image Column - Left */}
            <div className="w-full lg:w-[65%] overflow-hidden bg-[#f3f3f3] aspect-[16/9] lg:aspect-auto">
              <a href="/blogs/news/where-to-buy-retatrutide" className="block w-full h-full relative">
                <Image
                  src={featuredImage}
                  alt="Three Peptides Skin vials: RETA (Retatrutide) 30 MG, another peptide, and bacteriostatic water"
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-[1.04]"
                  priority
                />
              </a>
            </div>

            {/* Content Column - Right */}
            <div className="w-full lg:w-[35%] flex flex-col justify-center p-8 lg:p-10 bg-white">
              <a href="/blogs/news/where-to-buy-retatrutide" className="no-underline">
                <h3 className="text-[24px] font-semibold uppercase leading-[1.2] text-[#121212] mb-4 tracking-normal group-hover:text-clinical-teal transition-colors">
                  where to buy retatrutide
                </h3>
              </a>

              <div className="flex flex-col">
                <p className="text-[16px] leading-[1.5] text-[#616161] mb-5">
                  As researchers seek to buy Retatrutide (LY3437943), ensuring quality is critical. This comprehensive guide covers the essential factors: verifying purity with HPLC and COA, understanding its triple-agonist mechanism, and following...
                </p>

                <a 
                  href="/blogs/news/where-to-buy-retatrutide" 
                  className="read-more-link inline-block text-[12px] font-normal italic text-[#bf3f3f] hover:underline transition-all"
                >
                  Read more...
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .blog-post-card {
          /* Using simple global styles as a fallback for specific behavior if needed */
          transition: all 0.3s ease;
        }
        
        @media (max-width: 1023px) {
          .blog-post-card .flex {
            border-bottom: 1px solid #e0e0e0;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedBlogPost;