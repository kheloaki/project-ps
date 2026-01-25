"use client";

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const bestSellingProducts = [
  {
    id: 5,
    name: "Tirzepatide (10mg)",
    price: 120.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1579154273155-709841804169?q=80&w=2070&auto=format&fit=crop",
    category: "Metabolic Research"
  },
  {
    id: 6,
    name: "Retatrutide (5mg)",
    price: 155.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2050&auto=format&fit=crop",
    category: "Advanced Synthesis"
  },
  {
    id: 7,
    name: "Ipamorelin (5mg)",
    price: 35.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop",
    category: "Growth Factors"
  }
];

export default function BestSellingSection() {
  return (
    <section className="bg-white section-padding border-t border-border/50">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content - Intro */}
          <div className="lg:w-1/3">
            <div className="inline-block px-4 py-1.5 mb-4 text-[12px] font-semibold tracking-wider text-primary uppercase bg-muted rounded-full">
              Best Selling
            </div>
            <h2 className="text-brand-navy text-[42px] font-bold tracking-tight mb-6 leading-tight">
              Most Requested <br />
              Research Compounds
            </h2>
            <p className="text-brand-slate text-[18px] mb-8 max-w-md">
              Trusted by laboratories and research institutions worldwide. Our top-selling peptides are recognized for 99%+ purity and batch consistency.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[24px] font-bold text-brand-navy">2k+</span>
                <span className="text-[12px] font-bold text-brand-slate uppercase tracking-wider">Batches / Month</span>
              </div>
              <div className="w-[1px] h-10 bg-border"></div>
              <div className="flex flex-col">
                <span className="text-[24px] font-bold text-brand-navy">99.9%</span>
                <span className="text-[12px] font-bold text-brand-slate uppercase tracking-wider">Purity Rate</span>
              </div>
            </div>
          </div>

          {/* Right Content - Products Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellingProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative bg-white rounded-[30px] p-6 border border-border hover:shadow-medical transition-all duration-500"
              >
                <div className="relative aspect-square mb-6 overflow-hidden rounded-[20px] bg-muted/20">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                  />
                  <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-brand-slate hover:text-red-500 shadow-sm transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-[18px] font-bold text-brand-navy mb-3 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <div className="flex justify-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-3 h-3 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>

                  <div className="text-[20px] font-bold text-brand-navy mb-5">
                    ${product.price.toFixed(2)}
                  </div>

                  <button className="w-full py-3 px-6 bg-brand-navy text-white text-[13px] font-bold rounded-full hover:bg-primary transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Hot Badge */}
                <div className="absolute top-8 left-8 bg-brand-navy text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase z-10">
                  Hot
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
