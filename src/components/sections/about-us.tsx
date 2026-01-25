"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Stethoscope, UserRound } from 'lucide-react';

/**
 * AboutUsSection Component
 * 
 * Clones the 'Why Choose Us' section with pixel-perfect accuracy.
 * Features:
 * - Large image of a smiling doctor with rounded corners (30px).
 * - Overlapping badge for '15 Years of Experience'.
 * - Content area with descriptive text and service highlights using icons.
 */
const AboutUsSection = () => {
  return (
    <section className="bg-white section-padding overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[100px]">
          
            {/* Left Column: Image Area */}
            <div className="relative w-full lg:w-1/2">
              <div className="relative z-10">
                <div className="rounded-[30px] overflow-hidden border-[15px] border-white card-shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1532187875605-2fe358a77e82?q=80&w=2070&auto=format&fit=crop"
                    alt="Peptide synthesis laboratory"
                    width={540}
                    height={640}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                {/* Overlapping Badge: 10 Years of Excellence */}
                <div className="absolute -bottom-8 -left-4 md:-left-8 z-20">
                  <div className="bg-[#4079cf] text-white p-6 md:p-8 rounded-[25px] flex items-center gap-4 card-shadow min-w-[240px]">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <UserRound size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-white text-2xl font-bold leading-tight">10+ Years</h3>
                      <p className="text-white/90 text-sm font-semibold uppercase tracking-wider">in Peptide Synthesis</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Decorative Element */}
              <div className="absolute top-[-20px] left-[-20px] w-full h-full bg-[#f4f8fb] rounded-[30px] -z-10 hidden md:block"></div>
            </div>

            {/* Right Column: Content Area */}
            <div className="w-full lg:w-1/2 pt-10 lg:pt-0">
              <div className="mb-6">
                  <span className="inline-block bg-[#f4f8fb] text-[#4079cf] text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full mb-4">
                    Why Choose Peptides Skin?
                  </span>
                <h2 className="text-[#061a4b] text-[36px] md:text-[48px] font-bold leading-[1.1] mb-6">
                  Precision synthesis for global biotech leaders
                </h2>
                <p className="text-[#556078] text-[17px] leading-[1.8] mb-10 max-w-[540px]">
                  We specialize in the custom synthesis of high-purity peptides for research and development. Our state-of-the-art facility ensures batch-to-batch consistency and technical support that powers breakthrough discoveries.
                </p>
              </div>

              {/* Service Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Custom Synthesis */}
                <div className="flex items-start gap-4">
                  <div className="bg-[#f4f8fb] p-4 rounded-2xl flex-shrink-0">
                    <Stethoscope className="text-[#4079cf]" size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[#061a4b] text-[20px] font-bold mb-2">99% Purity</h3>
                    <p className="text-[#556078] text-[15px] leading-relaxed">
                      Every batch undergoes rigorous HPLC and MS analysis to guarantee maximum purity.
                    </p>
                  </div>
                </div>

                {/* Bulk Supply */}
                <div className="flex items-start gap-4">
                  <div className="bg-[#f4f8fb] p-4 rounded-2xl flex-shrink-0">
                    <UserRound className="text-[#4079cf]" size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[#061a4b] text-[20px] font-bold mb-2">B2B Bulk Supply</h3>
                    <p className="text-[#556078] text-[15px] leading-relaxed">
                      Scalable manufacturing capabilities from milligrams to multi-kilogram quantities.
                    </p>
                  </div>
                </div>
              </div>

            {/* CTA Button */}
            <a 
              href="#" 
              className="group inline-flex items-center gap-2 bg-transparent border-2 border-[#e5eaf4] text-[#061a4b] hover:bg-[#061a4b] hover:text-white hover:border-[#061a4b] transition-all duration-300 rounded-full py-3.5 px-8 text-[14px] font-bold uppercase tracking-wider"
            >
              Know More
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </div>
      </div>

    </section>
  );
};

export default AboutUsSection;
