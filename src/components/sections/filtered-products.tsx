"use client";

import React, { useState, useMemo } from "react";
import ProductFilter from "./product-filter";
import productsData from "@/data/products.json";
import { CometCard } from "@/components/ui/comet-card";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

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
  category?: string;
  variants?: Variant[];
}

function parsePrice(priceString: string): number {
  const match = priceString.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const link = product.link || `/products/${product.handle || product.id}`;
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const defaultVariant = product.variants && product.variants.length > 0 
    ? product.variants[0] 
    : { id: `${product.id}-default`, title: 'Default', price: product.price };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      variantId: defaultVariant.id,
      title: product.title,
      variantTitle: defaultVariant.title !== 'Default' ? defaultVariant.title : undefined,
      price: parsePrice(defaultVariant.price),
      image: product.image,
      handle: product.handle || product.id,
    });
  };

  return (
    <div className="p-4">
      <CometCard rotateDepth={10} translateDepth={10} className="h-full">
        <div className="flex flex-col group bg-white border border-[#e5e5e5] rounded-[16px] overflow-hidden h-full hover:border-[#8A773E] transition-colors duration-300">
          <Link 
            href={link} 
            className="block flex-1"
          >
            <div className="block overflow-hidden bg-[#f3f3f3] aspect-square relative">
              <div className="w-full h-full flex items-center justify-center p-2 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="px-4 py-3 flex flex-col gap-1 bg-white">
              <h3 className="product-title m-0 leading-tight truncate text-[14px] font-medium text-[#121212] uppercase tracking-wide">
                {product.title}
              </h3>
              <span className="price-label leading-tight text-[13px] text-[#121212] opacity-60">
                {hasMultipleVariants && "FROM "}
                {product.price}
              </span>
            </div>
          </Link>
          <div className="px-4 pb-3">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8A773E] hover:bg-[#6B5E2F] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </CometCard>
    </div>
  );
};

export default function FilteredProducts() {
  const [filters, setFilters] = useState<{
    categories: string[];
    priceRange: [number, number] | null;
  }>({ categories: [], priceRange: null });

  const categories = useMemo(() => {
    const cats = new Set<string>();
    productsData.forEach((product: any) => {
      if (product.category) {
        const mainCategory = product.category.split(">").pop()?.trim() || product.category;
        cats.add(mainCategory);
      }
    });
    return Array.from(cats).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...productsData] as Product[];

    if (filters.categories.length > 0) {
      products = products.filter((product: any) => {
        if (!product.category) return false;
        const mainCategory = product.category.split(">").pop()?.trim() || product.category;
        return filters.categories.includes(mainCategory);
      });
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      products = products.filter((product) => {
        const price = parsePrice(product.price);
        return price >= min && price <= max;
      });
    }

    return products;
  }, [filters]);

  return (
    <>
      <ProductFilter onFilterChange={setFilters} categories={categories} />
      <section id="ResultsList" className="bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1400px] mx-auto border-l border-[#e5e5e5]">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="text-lg">No products found matching your filters.</p>
              <p className="text-sm mt-2">Try adjusting your filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {[...Array(filteredProducts.length % 5 === 0 ? 0 : 5 - (filteredProducts.length % 5))].map((_, i) => (
                <div
                  key={`spacer-${i}`}
                  className="hidden xl:block min-h-[300px]"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
