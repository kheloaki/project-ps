"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Variant {
  id: string;
  title: string;
  price: string;
  image?: string;
}

interface StickyAddToCartProps {
  product: {
    id?: string;
    handle?: string;
    title: string;
    price: string;
    image: string;
    variants?: Variant[];
  };
  selectedVariant?: Variant;
}

function parsePrice(priceString: string): number {
  const match = priceString.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export default function StickyAddToCart({ product, selectedVariant: propSelectedVariant }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addItem } = useCart();
  
  const [internalSelectedVariant, setInternalSelectedVariant] = useState<Variant>(
    product.variants && product.variants.length > 0 
      ? product.variants[0] 
      : { id: "default", title: "Default", price: product.price }
  );

  const selectedVariant = propSelectedVariant || internalSelectedVariant;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: product.id || "default",
      variantId: selectedVariant.id,
      title: product.title,
      variantTitle: selectedVariant.title !== "Default" && selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
      price: parsePrice(selectedVariant.price),
      image: selectedVariant.image || product.image,
      handle: product.handle || product.id || "default",
    });
    
    toast.success(
      <div className="flex items-center justify-between gap-4 w-full">
        <span className="font-medium">Added to cart!</span>
        <Link 
          href="/cart" 
          className="flex items-center gap-1 bg-[#12b3b0] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#0e9996] transition-colors"
        >
          View Cart <ArrowRight className="w-4 h-4" />
        </Link>
      </div>,
      {
        duration: 5000,
      }
    );
  };

  return (
    <>
      {/* Mobile Sticky Bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-zinc-200 p-4 transition-transform duration-300 md:hidden",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 flex-shrink-0 bg-zinc-50 rounded overflow-hidden">
            <Image
              src={selectedVariant.image || product.image}
              alt={product.title}
              fill
              className="object-contain p-1"
            />
          </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold uppercase truncate">
                {product.title}
              </h3>
              <p className="text-xs text-zinc-600">
                {selectedVariant.title !== "Default Title" ? `${selectedVariant.title} - ` : ""}{selectedVariant.price}
              </p>
            </div>

<Button onClick={handleAddToCart} className="uppercase tracking-widest text-[10px] font-bold h-10 px-4 bg-black text-white hover:bg-zinc-800 rounded-none">
              Add to Cart
            </Button>
        </div>
      </div>

      {/* Desktop Sticky Sidebar Button/Card */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-[60] hidden md:block transition-all duration-500",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-white border border-zinc-200 p-4 shadow-xl rounded-none w-[240px] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 bg-zinc-50 overflow-hidden border border-zinc-100">
              <Image
                src={selectedVariant.image || product.image}
                alt={product.title}
                fill
                className="object-contain p-1"
              />
            </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[10px] font-bold uppercase truncate leading-tight">
                  {product.title}
                </h3>
                <p className="text-sm font-medium text-black">
                  {selectedVariant.title !== "Default Title" ? `${selectedVariant.title} - ` : ""}{selectedVariant.price}
                </p>
              </div>

          </div>
<Button onClick={handleAddToCart} className="w-full bg-black text-white h-10 uppercase tracking-widest text-[10px] font-bold hover:bg-zinc-800 transition-colors rounded-none">
              Add to Cart
            </Button>
        </div>
      </div>
    </>
  );
}
