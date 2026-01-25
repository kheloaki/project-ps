"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { MoveUpRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  image: string;
  link: string;
}

const services: ServiceItem[] = [
  {
    id: 1,
    title: "Custom Synthesis",
    image: "https://images.unsplash.com/photo-1579154273155-709841804169?q=80&w=2070&auto=format&fit=crop",
    link: "/service/custom-synthesis",
  },
  {
    id: 2,
    title: "GMP Manufacturing",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2050&auto=format&fit=crop",
    link: "/service/gmp-manufacturing",
  },
  {
    id: 3,
    title: "Quality Control",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop",
    link: "/service/quality-control",
  },
  {
    id: 4,
    title: "Bulk Supply",
    image: "https://images.unsplash.com/photo-1532187875605-2fe358a77e82?q=80&w=2070&auto=format&fit=crop",
    link: "/service/bulk-supply",
  },
  {
    id: 5,
    title: "Analytical Testing",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    link: "/service/analytical-testing",
  },
];

export default function ServicesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 3 : scrollLeft + clientWidth / 3;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-[110px] overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-[600px]">
            <span className="uppercase tracking-[0.05em] text-[#4079cf] font-semibold text-[14px] bg-[#f4f8fb] px-4 py-1 rounded-full inline-block mb-4">
              Our Capabilities
            </span>
            <h2 className="text-[#061a4b] text-[48px] font-bold leading-[1.2] mb-0">
              World-class facilities for <br className="hidden md:block" /> advanced peptide synthesis
            </h2>
          </div>

          <div className="flex items-center gap-[60px]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => scroll("left")}
                className="w-[45px] h-[45px] border border-[#e5eaf4] rounded-lg flex items-center justify-center text-[#061a4b] hover:bg-[#4079cf] hover:text-white transition-all duration-300 group"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-[45px] h-[45px] border border-[#e5eaf4] rounded-lg flex items-center justify-center text-[#061a4b] hover:bg-[#4079cf] hover:text-white transition-all duration-300 group"
                aria-label="Next service"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
               <div className="text-right">
                  <div className="text-[60px] font-bold text-outline leading-none">99.9%</div>
                  <p className="text-[13px] text-[#556078] leading-tight max-w-[150px] mt-2">
                    Minimum purity level guaranteed for all research compounds
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Carousel / Multi-Column Grid */}
        <div 
          ref={scrollRef}
          className="flex gap-[30px] overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service) => (
            <div 
              key={service.id} 
              className="min-w-full sm:min-w-[calc(50%-15px)] lg:min-w-[calc(25%-22.5px)] group snap-start"
            >
              <a href={service.link} className="block relative h-[480px] rounded-[30px] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061a4bCC] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                  <h3 className="text-white text-[24px] font-bold m-0 group-hover:translate-x-2 transition-transform duration-300">
                    {service.title}
                  </h3>
                  <div className="w-[50px] h-[50px] bg-[#061a4b] ring-[10px] ring-white/10 rounded-full flex items-center justify-center text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                    <MoveUpRight className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="mt-16 relative">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee-text gap-8 text-[120px] font-bold text-outline select-none opacity-10">
            <span>SYNTHESIS + PURITY + B2B + LYOPHILIZATION + RESEARCH +</span>
            <span>SYNTHESIS + PURITY + B2B + LYOPHILIZATION + RESEARCH +</span>
          </div>
        </div>
      </div>

    </section>
  );
}
