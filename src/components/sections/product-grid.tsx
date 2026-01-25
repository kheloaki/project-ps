import React from 'react';
import Image from 'next/image';
import productsData from "@/data/products.json";

interface Variant {
  id: string;
  title: string;
  price: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  handle?: string;
  link?: string;
  variants?: Variant[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const link = product.link || `/products/${product.handle || product.id}`;
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  
  return (
    <div className="flex flex-col group cursor-pointer border-r border-b border-[#e5e5e5]">
      <a href={link} className="block overflow-hidden bg-[#f3f3f3] aspect-square relative">
        <div className="w-full h-full flex items-center justify-center p-8 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </a>
      <div className="px-4 py-3 flex flex-col gap-1">
        <h3 className="product-title m-0 leading-tight truncate text-[14px] font-medium text-[#121212] uppercase tracking-wide">
          {product.title}
        </h3>
        <span className="price-label leading-tight text-[13px] text-[#121212] opacity-60">
          {hasMultipleVariants && "FROM "}
          {product.price}
        </span>
      </div>
    </div>
  );
};

export default function ProductGrid({ products = productsData }: { products?: any[] }) {
  const displayProducts = products || productsData;

  return (
    <section id="ResultsList" className="bg-white border-t border-[#e5e5e5]">
      <div className="max-w-[1400px] mx-auto border-l border-[#e5e5e5]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Empty spacer blocks to complete the grid visually if needed */}
          {[...Array(displayProducts.length % 5 === 0 ? 0 : 5 - (displayProducts.length % 5))].map((_, i) => (
            <div 
              key={`spacer-${i}`} 
              className="hidden xl:block bg-white border-r border-b border-[#e5e5e5] min-h-[300px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}