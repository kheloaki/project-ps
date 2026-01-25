"use client";

import React from "react";
import Link from "next/link";
import { CometCard } from "@/components/ui/comet-card";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import productsData from "@/data/products.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

// Popular peptides - curated list of well-known products
const popularProductHandles = ['nad', 'sermorelin', 'cagrisema', 'survodutide-10mg', 'tesamorelin-1'];

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

export default function PopularPeptides() {
  // Filter products to only show popular ones
  const popularProducts = (productsData as Product[]).filter((product) =>
    popularProductHandles.includes(product.handle || product.id)
  );

  return (
    <section className="bg-white py-[60px] md:py-[80px] border-t border-[#e0e0e0]">
      <div className="container px-[30px] mx-auto max-w-[1230px]">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] uppercase tracking-[0.1em] font-display text-[#121212] mb-4">
            Popular Peptides
          </h2>
          <p className="text-[16px] text-[#616161] mb-6 max-w-[600px] mx-auto">
            Discover our most sought-after research peptides, trusted by laboratories worldwide for their exceptional purity and quality.
          </p>
          <Link 
            href="/collections/all" 
            className="inline-block text-[14px] font-medium uppercase tracking-[0.08em] text-[#8A773E] hover:underline"
          >
            View all products
          </Link>
        </div>

        {/* Carousel */}
        <div className="max-w-[1400px] mx-auto border-l border-[#e5e5e5] relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {popularProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16 bg-white border-2 border-[#e5e5e5] hover:border-[#8A773E] hover:bg-[#8A773E] hover:text-white shadow-lg" />
            <CarouselNext className="hidden md:flex -right-12 lg:-right-16 bg-white border-2 border-[#e5e5e5] hover:border-[#8A773E] hover:bg-[#8A773E] hover:text-white shadow-lg" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

