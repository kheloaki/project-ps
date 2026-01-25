"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CollectionFilters = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    return (
      <div
        ref={containerRef}
        className="sticky top-[48px] z-40 w-full border-b border-[#E5E5E5] bg-[#0B0E13] text-white"
      >
      <div className="mx-auto flex h-[50px] max-w-[1440px] items-center justify-between px-6">
        {/* Left Side: Filter Dropdowns */}
        <div className="flex items-center space-x-8">
          {/* Availability Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("availability")}
              className="flex items-center space-x-2 py-2 text-[12px] font-normal uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
            >
              <span>Availability</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === "availability" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "availability" && (
              <div className="absolute left-0 top-full min-w-[200px] border border-[#E5E5E5] bg-white p-5 text-black shadow-lg">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="in-stock"
                      className="h-4 w-4 border-[#E5E5E5] accent-[#118199]"
                    />
                    <label htmlFor="in-stock" className="text-[14px]">In stock</label>
                  </li>
                  <li className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="out-of-stock"
                      className="h-4 w-4 border-[#E5E5E5] accent-[#118199]"
                    />
                    <label htmlFor="out-of-stock" className="text-[14px]">Out of stock</label>
                  </li>
                </ul>
                <div className="mt-5 border-t border-[#E5E5E5] pt-4">
                  <button className="text-[12px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70">
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("price")}
              className="flex items-center space-x-2 py-2 text-[12px] font-normal uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
            >
              <span>Price</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === "price" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "price" && (
              <div className="absolute left-0 top-full min-w-[280px] border border-[#E5E5E5] bg-white p-5 text-black shadow-lg">
                <div className="mb-4 text-[12px] text-[#666666]">The highest price is $319.00</div>
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px]">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full border border-[#E5E5E5] py-2 pl-7 pr-3 text-[14px] outline-none focus:border-[#118199]"
                    />
                  </div>
                  <span className="text-[14px] text-[#666666]">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px]">$</span>
                    <input
                      type="number"
                      placeholder="319.00"
                      className="w-full border border-[#E5E5E5] py-2 pl-7 pr-3 text-[14px] outline-none focus:border-[#118199]"
                    />
                  </div>
                </div>
                <div className="mt-5 border-t border-[#E5E5E5] pt-4">
                  <button className="text-[12px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70">
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Results & Sort */}
        <div className="flex items-center space-x-6">
          <span className="text-[12px] font-normal opacity-60">18 products</span>
          
          <div className="relative">
            <button
              onClick={() => toggleDropdown("sort")}
              className="flex items-center space-x-2 py-2 text-[12px] font-normal uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
            >
              <span>Sort by</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === "sort" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "sort" && (
              <div className="absolute right-0 top-full min-w-[200px] border border-[#E5E5E5] bg-white text-black shadow-lg">
                <ul className="py-2">
                  {["Featured", "Best selling", "Alphabetically, A-Z", "Alphabetically, Z-A", "Price, low to high", "Price, high to low", "Date, old to new", "Date, new to old"].map((item) => (
                    <li key={item}>
                      <button className="w-full px-5 py-2 text-left text-[14px] transition-colors hover:bg-[#F3F3F3]">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionFilters;