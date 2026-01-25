import React from 'react';
import Image from 'next/image';

/**
 * ProductSidebarFeatures Component
 * Clones the left sidebar elements: Podcast widget, Reviews badge, and Research warning box.
 * Responsive: Stacks under hero on mobile, side-by-side on desktop.
 */
const ProductSidebarFeatures = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Podcast Widget Section */}
      <div className="mt-6">
        <div className="flex w-full min-w-0 flex-col items-stretch rounded-2xl overflow-hidden bg-gradient-to-r from-[#EFF5FF] to-[#DBE9FE] lg:flex-col">
          {/* Podcast Header/Banner Card */}
          <div className="relative z-20 flex min-h-[110px] w-full flex-col items-end justify-between overflow-hidden bg-gradient-to-l from-[#1E2B60] to-[#374C9A] py-3 pl-6 pr-4 md:pl-8 md:pr-6 lg:pl-9">
            <Image
              alt="podcast man"
              width={154}
              height={125}
              className="absolute bottom-0 left-0 object-contain"
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-powerpeptides-com/assets/images/images_13.png"
            />
            <div className="flex flex-col items-end text-right">
              <p className="text-lg font-semibold text-white leading-tight">Peptides. Deep Dive</p>
              <p className="text-[10px] uppercase tracking-wider text-[#8DAFDE] font-medium">Research-based Podcast</p>
            </div>
            <button className="text-xs text-[#D3E4FD] underline decoration-[#D3E4FD]/40 hover:text-white transition-colors cursor-pointer text-right">
              Join / Log in for all episodes
            </button>
          </div>

          {/* Podcast Episode List */}
          <div className="flex w-full flex-col justify-center gap-1 px-4 pb-4 pt-3 lg:pl-4">
            {/* Episode 1 (Locked) */}
            <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-4 py-1.5">
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-[15px] font-medium text-[#9DA4AE]">BPC-I57</p>
                <div className="flex h-fit flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#DC6803] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight text-white leading-none">
                    Members only
                  </span>
                  <button className="text-left text-[11px] text-[#008080] underline decoration-[#008080]/30 hover:text-[#056769] transition-colors cursor-pointer">
                    Join / Log in to listen
                  </button>
                </div>
              </div>
              <div className="flex h-[32px] w-[92px] items-center justify-center gap-1 rounded-lg bg-[#F4F7FC] px-3 py-1.5 opacity-60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DA4AE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <p className="text-xs font-semibold text-[#9DA4AE]">Listen</p>
              </div>
            </div>

            {/* Episode 2 (Available) */}
            <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-4 py-1.5">
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-[15px] font-medium text-[#11181C]">Introduction to Peptides</p>
                <p className="truncate text-[11px] font-normal text-[#4B5563]">How peptides work</p>
              </div>
              <button className="group flex h-[32px] w-[92px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#2E4086] px-3 py-1.5 text-[#2E4086] transition-all hover:bg-[#2E4086] hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="group-hover:fill-white">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <p className="text-xs font-semibold">Listen</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews.io Rating Badge */}
      <div className="mt-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#F4F7FC] px-4 py-3 text-sm text-[#4B5563]">
          <a 
            href="https://www.reviews.io/company-reviews/store/powerpeptides.com" 
            className="shrink-0 block hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image 
              alt="Reviews.io Logo" 
              width={155} 
              height={35} 
              className="w-[105px] lg:w-[130px]" 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-powerpeptides-com/assets/images/images_12.png" 
            />
          </a>
          <div className="flex flex-wrap items-center gap-x-1">
            <div className="flex gap-0.5 text-[#FFB400]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <div className="ml-1 text-[13px] text-[#4B5563]">
              Rated <span className="font-bold">4.8/5</span> by <span className="font-bold">540</span> verified customers
            </div>
          </div>
        </div>
      </div>

      {/* Laboratory Research Warning Box */}
      <div className="mb-8">
        <div className="my-6">
          <div className="flex gap-3 rounded-2xl bg-[#F5F5F5] p-5 border border-[#E5E7EB]">
            <div className="shrink-0 mt-0.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <p className="text-[14px] font-semibold leading-snug text-[#4B5563]">
              This product is intended solely for use as a research chemical in vitro and laboratory experimentation by licensed, qualified professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSidebarFeatures;

