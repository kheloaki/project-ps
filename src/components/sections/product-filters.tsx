"use client";

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

/**
 * ProductFilters Component
 * 
 * A horizontal filter bar containing dropdown accordions for Availability and Price.
 * Replicates the exact styling from the provided dark navy filter bar in the design system.
 */

const ProductFilters = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="w-full bg-[#0B1321] text-white sticky top-[48px] z-40">
      <div className="max-w-[1400px] mx-auto px-8 h-[50px] flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Availability Filter */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('availability')}
              className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-normal hover:opacity-80 transition-opacity"
            >
              <span>Availability</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'availability' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'availability' && (
              <div className="absolute top-full left-0 mt-0 w-64 bg-white text-[#121212] border border-[#E5E5E5] shadow-lg z-50">
                <div className="p-5">
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 border border-[#E5E5E5] rounded-sm group-hover:border-[#1282A2]">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-3 h-3 bg-[#1282A2] scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <span className="text-[13px]">In stock</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 border border-[#E5E5E5] rounded-sm group-hover:border-[#1282A2]">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-3 h-3 bg-[#1282A2] scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <span className="text-[13px]">Out of stock</span>
                    </label>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                    <button className="text-[12px] underline font-medium hover:text-[#1282A2]">Clear</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('price')}
              className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-normal hover:opacity-80 transition-opacity"
            >
              <span>Price</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-0 w-64 bg-white text-[#121212] border border-[#E5E5E5] shadow-lg z-50">
                <div className="p-5">
                  <div className="text-[12px] text-[#737373] mb-4">The highest price is $319.00</div>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px]">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full pl-6 pr-3 py-2 border border-[#E5E5E5] text-[13px] focus:outline-none focus:border-[#1282A2]"
                      />
                    </div>
                    <span className="text-[13px] text-[#737373]">to</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px]">$</span>
                      <input
                        type="number"
                        placeholder="319.00"
                        className="w-full pl-6 pr-3 py-2 border border-[#E5E5E5] text-[13px] focus:outline-none focus:border-[#1282A2]"
                      />
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                    <button className="text-[12px] underline font-medium hover:text-[#1282A2]">Clear</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[11px] text-[#737373] uppercase tracking-wider">19 items</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider">Sort by:</span>
            <select className="bg-transparent text-[11px] uppercase tracking-wider border-none focus:ring-0 cursor-pointer">
              <option className="text-black" value="featured">Featured</option>
              <option className="text-black" value="best-selling">Best Selling</option>
              <option className="text-black" value="price-low">Price: Low to High</option>
              <option className="text-black" value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backdrop for closing dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default ProductFilters;