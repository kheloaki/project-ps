import React from 'react';
import Image from 'next/image';

const CompanyTrustBadges = () => {
  const features = [
    {
      title: "Unparalleled Purity",
      description: "Our proprietary processes and meticulous sourcing of premium materials ensure that every peptide we offer meets the most stringent skincare standards.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#8A773E" stroke="#8A773E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      title: "Independently Verified",
      description: "Every product undergoes extensive testing, both in-house and through independent, third-party laboratories.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#8A773E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7V8M12 16V17M7 12H8M16 12H17" stroke="#8A773E" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "Fast Shipping & Support",
      description: "We provide fast and reliable shipping, using the best couriers and premium packaging to ensure your skincare peptides arrive promptly and in optimal condition.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#8A773E" stroke="#8A773E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container px-4 md:px-6">
        {/* Header Text */}
          <div className="mx-auto max-w-[800px] text-center mb-12">
            <h2 className="text-[20px] md:text-[24px] lg:text-[32px] font-semibold text-[#09121F] mb-4 leading-tight">
              Your Trusted Source for Premium Skincare Peptides
            </h2>
            <p className="text-[14px] md:text-[16px] text-slate-600 leading-[1.6]">
              PeptidesSkin™ is your premier destination for high-quality skincare peptides. We are dedicated to advancing skin science, providing the purest peptides that help professionals and enthusiasts achieve remarkable skincare results.
            </p>
          </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1240px] mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#F8FAFC] rounded-[16px] p-6 md:p-8 flex flex-col items-start shadow-clinical border border-transparent hover:border-[#F1F5F9] transition-all duration-300"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                {feature.icon}
              </div>
              <h3 className="text-[18px] font-semibold text-[#09121F] mb-3">
                {feature.title}
              </h3>
              <p className="text-[14px] text-slate-600 leading-[1.5]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Section Visual Context (Optional Divider) */}
      <div className="mt-16 border-t border-[#F1F5F9] w-full"></div>
    </section>
  );
};

export default CompanyTrustBadges;

