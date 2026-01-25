"use client";

import React from 'react';

const MarqueeSection = () => {
  const marqueeItems = [
    "PEPTIDES SKIN",
    "SECURE CHECKOUT",
    "24/7 SUPPORT",
    "FAST DELIVERY"
  ];

  // We repeat the items multiple times to ensure a seamless infinite scroll across all screen sizes
  const repeatedContent = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="relative overflow-hidden bg-[#0F172A] py-4 md:py-6 border-y border-[#1E293B]">
      <div className="flex whitespace-nowrap">
        {/* First marquee track */}
        <div className="flex animate-marquee shrink-0 items-center">
          {repeatedContent.map((item, index) => (
            <div 
              key={`marquee-1-${index}`} 
              className="flex items-center px-6 md:px-12"
            >
              <span className="text-[#EAB308] font-display text-lg md:text-2xl font-semibold uppercase tracking-wider">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Second marquee track for seamless loop */}
        <div className="flex animate-marquee shrink-0 items-center">
          {repeatedContent.map((item, index) => (
            <div 
              key={`marquee-2-${index}`} 
              className="flex items-center px-6 md:px-12"
            >
              <span className="text-[#EAB308] font-display text-lg md:text-2xl font-semibold uppercase tracking-wider">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MarqueeSection;
