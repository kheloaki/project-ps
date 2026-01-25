"use client";

import React from "react";

const MarqueeSection = () => {
  const items = [
    "PEPTIDES SKIN",
    "SECURE CHECKOUT",
    "24/7 SUPPORT",
    "FAST DELIVERY",
  ];

  // We duplicate the items several times to ensure the marquee spans the width
  // and loops seamlessly. The animation 'marquee' is defined in globals.css.
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden bg-[#ffc72c] py-4 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex shrink-0 items-center">
          {repeatedItems.map((item, index) => (
            <div
              key={`marquee-1-${index}`}
              className="flex items-center px-8 md:px-12"
            >
              <h3 className="text-[#111827] text-[16px] md:text-[18px] font-bold uppercase tracking-[0.05em] leading-tight">
                {item}
              </h3>
            </div>
          ))}
        </div>
        {/* Secondary set for seamless loop */}
        <div className="flex shrink-0 items-center">
          {repeatedItems.map((item, index) => (
            <div
              key={`marquee-2-${index}`}
              className="flex items-center px-8 md:px-12"
            >
              <h3 className="text-[#111827] text-[16px] md:text-[18px] font-bold uppercase tracking-[0.05em] leading-tight">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeSection;