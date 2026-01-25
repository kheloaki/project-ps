import React from 'react';

const TrustMarquee = () => {
  const trustItems = [
    "PEPTIDES SKIN",
    "SECURE CHECKOUT",
    "24/7 SUPPORT",
    "FAST DELIVERY"
  ];

  // We duplicate the items multiple times to ensure a seamless loop
  // across various screen widths. 
  const displayItems = [...trustItems, ...trustItems, ...trustItems, ...trustItems];

  return (
    <div 
      id="shopify-section-template--20515709190365__marquee_3TgJAJ" 
      className="shopify-section overflow-hidden"
    >
      <div 
        className="relative py-4 md:py-6 bg-[#0B1220]" 
        style={{ backgroundColor: 'var(--color-ticker-bg, #0B1220)' }}
      >
        <div className="flex w-fit animate-marquee whitespace-nowrap">
          {/* First set of items */}
          <div className="flex items-center">
            {displayItems.map((item, index) => (
              <div 
                key={`item-1-${index}`}
                className="flex items-center px-6 md:px-12"
              >
                <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-widest text-[#B59449] font-sans">
                  {item}
                </h3>
              </div>
            ))}
          </div>
          
          {/* Second set of identical items for seamless looping */}
          <div className="flex items-center">
            {displayItems.map((item, index) => (
              <div 
                key={`item-2-${index}`}
                className="flex items-center px-6 md:px-12"
              >
                <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-widest text-[#B59449] font-sans">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TrustMarquee;
