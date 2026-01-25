"use client";

import React from 'react';
import Image from 'next/image';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="bg-white section-padding font-sans">
      <div className="container overflow-visible">
        <div className="flex flex-col lg:flex-row items-stretch gap-[30px]">
          {/* Left Column: Doctor Image */}
          <div className="w-full lg:w-1/2 relative h-[400px] lg:h-auto min-h-[500px]">
            <div className="relative w-full h-full rounded-[30px] overflow-hidden">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/service-new-img-03-840x1000-29.jpg"
                alt="Healthcare Professional"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right Column: Content Block */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="bg-[#f4f8fb] rounded-[30px] p-[40px] md:p-[60px] h-full flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="inline-block bg-white text-[#4079cf] text-[12px] font-bold uppercase tracking-[0.05em] px-[15px] py-[6px] rounded-full mb-[25px]">
                  Testimonial
                </span>
                <h2 className="text-[32px] md:text-[48px] font-bold text-[#061a4b] leading-[1.2] mb-[35px]">
                  What patients say about our treatment
                </h2>

                <div className="mb-[30px]">
                  <Quote className="w-[45px] h-[45px] text-[#4079cf] rotate-180 mb-[25px]" fill="currentColor" />
                  <p className="text-[17px] md:text-[20px] leading-[1.7] text-[#556078] italic font-medium">
                    I would recommend practitioners at this center to everyone! They are great to work with and are excellemt trainers. Thank you all!
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[40px]">
                {/* Patient Profile & Controls */}
                <div className="flex items-center justify-between border-b border-[#e5eaf4] pb-[40px]">
                  <div className="flex items-center gap-[15px]">
                    <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/service-new-img-03-840x1000-29.jpg"
                        alt="Jane Brown"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#061a4b]">Jane Brown</h3>
                      <p className="text-[14px] text-[#556078]">Satisfied Client</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-[10px]">
                    <button className="w-[45px] h-[45px] rounded-lg border border-[#e5eaf4] flex items-center justify-center text-[#061a4b] hover:bg-[#4079cf] hover:text-white transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-[45px] h-[45px] rounded-lg border border-[#e5eaf4] flex items-center justify-center text-[#061a4b] hover:bg-[#4079cf] hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Counter Element */}
                <div className="flex items-center gap-[20px]">
                  <div className="flex items-baseline">
                    <span className="text-outline text-[60px] md:text-[80px] font-bold leading-none opacity-100 select-none">
                      460
                    </span>
                    <span className="text-[#4079cf] text-[40px] md:text-[50px] font-bold leading-none">+</span>
                  </div>
                  <p className="text-[13px] md:text-[14px] font-semibold text-[#556078] uppercase tracking-wider max-w-[180px]">
                    Professional and Experienced staff ready to help you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;
