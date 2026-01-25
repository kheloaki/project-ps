"use client";

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Eye } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "BPC-157 (10mg)",
    price: 45.00,
    oldPrice: 55.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    category: "Research Peptides"
  },
  {
    id: 2,
    name: "TB-500 (5mg)",
    price: 38.50,
    oldPrice: null,
    rating: 5,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2050&auto=format&fit=crop",
    category: "Synthesis"
  },
  {
    id: 3,
    name: "Semaglutide (5mg)",
    price: 85.00,
    oldPrice: 110.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop",
    category: "Analytical"
  },
  {
    id: 4,
    name: "Melanotan II (10mg)",
    price: 32.00,
    oldPrice: 40.00,
    rating: 4,
    image: "https://images.unsplash.com/photo-1579154273155-709841804169?q=80&w=2070&auto=format&fit=crop",
    category: "Research Peptides"
  }
];

export default function ProductsSection() {
  return (
    <section className="bg-brand-light section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 text-[12px] font-semibold tracking-wider text-primary uppercase bg-white rounded-full shadow-sm">
            B2B Catalog
          </div>
          <h2 className="text-brand-navy text-[48px] font-bold tracking-tight">
            Premium Peptide Inventory
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-[30px] overflow-hidden border border-border/50 hover:shadow-medical transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-muted/30">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-navy hover:bg-primary hover:text-white transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-navy hover:bg-primary hover:text-white transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Sale Badge */}
                {product.oldPrice && (
                  <div className="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                    Sale
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 text-center">
                <div className="text-[11px] font-bold text-brand-slate uppercase tracking-widest mb-2">
                  {product.category}
                </div>
                <h3 className="text-[18px] font-bold text-brand-navy mb-3 hover:text-primary cursor-pointer transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex justify-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} 
                    />
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-center gap-2">
                  {product.oldPrice && (
                    <span className="text-[14px] text-brand-slate line-through opacity-60">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-[18px] font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a href="#" className="btn-pill bg-brand-navy text-white hover:bg-primary">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
