"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface ProductFilterProps {
  onFilterChange: (filters: { categories: string[]; priceRange: [number, number] | null }) => void;
  categories: string[];
}

const PRICE_RANGES = [
  { label: "All Prices", value: null },
  { label: "Under $50", value: [0, 50] as [number, number] },
  { label: "$50 - $100", value: [50, 100] as [number, number] },
  { label: "$100 - $150", value: [100, 150] as [number, number] },
  { label: "Over $150", value: [150, 999] as [number, number] },
];

export default function ProductFilter({ onFilterChange, categories }: ProductFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories, priceRange: selectedPriceRange });
  };

  const handlePriceChange = (range: [number, number] | null) => {
    setSelectedPriceRange(range);
    setShowPriceDropdown(false);
    onFilterChange({ categories: selectedCategories, priceRange: range });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    onFilterChange({ categories: [], priceRange: null });
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRange !== null;

  const getPriceLabel = () => {
    if (!selectedPriceRange) return "Price";
    const found = PRICE_RANGES.find(
      (r) => r.value && r.value[0] === selectedPriceRange[0] && r.value[1] === selectedPriceRange[1]
    );
    return found?.label || "Price";
  };

  return (
    <div className="bg-[#8A773E] py-3 px-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#111827]">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wide hidden sm:inline">Filters</span>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowPriceDropdown(false);
              }}
              className="flex items-center gap-2 bg-white/90 hover:bg-white px-3 py-1.5 rounded text-sm font-medium text-[#111827] transition-colors"
            >
              Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 rounded border-gray-300 text-[#12b3b0] focus:ring-[#12b3b0]"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowPriceDropdown(!showPriceDropdown);
                setShowCategoryDropdown(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedPriceRange ? "bg-[#111827] text-white" : "bg-white/90 hover:bg-white text-[#111827]"
              }`}
            >
              {getPriceLabel()}
              <ChevronDown className={`w-4 h-4 transition-transform ${showPriceDropdown ? "rotate-180" : ""}`} />
            </button>
            {showPriceDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]">
                {PRICE_RANGES.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePriceChange(range.value)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      (range.value === null && selectedPriceRange === null) ||
                      (range.value && selectedPriceRange && range.value[0] === selectedPriceRange[0])
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm font-medium text-[#111827] hover:text-[#111827]/70 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
