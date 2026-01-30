"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import ProductImageGallery from "@/components/ui/product-image-gallery";

interface ImageMetadata {
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
}

interface ProductHeroProps {
  product?: {
    id: string;
    handle: string;
    title: string;
    price: string;
    image: string;
    description?: string;
    variants?: Array<{ id: string; title: string; price: string }>;
    images?: string[];
    imageMetadata?: ImageMetadata[];
  };
}

const ProductHero = ({ product }: ProductHeroProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Use actual variants from product, or default to main product
  const variants = React.useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants;
    }
    // If no variants, create a default one from the main product
    return [{ id: product?.id || '', title: 'Default', price: product?.price || '0' }];
  }, [product?.variants, product?.id, product?.price]);
  
  const [selectedVariant, setSelectedVariant] = useState(() => {
    return variants[0] || { id: product?.id || '', title: 'Default', price: product?.price || '0' };
  });

  // Update selected variant when variants change
  useEffect(() => {
    if (variants.length > 0 && variants[0]) {
      const currentVariant = variants.find(v => v.id === selectedVariant.id);
      if (!currentVariant) {
        setSelectedVariant(variants[0]);
      }
    }
  }, [variants]);

  const basePrice = parseFloat(selectedVariant.price.replace(/[^0-9.]/g, ''));
  const productTitle = product?.title || 'Regenerative Peptide Serum (BPC-I57)';
  const productImage = product?.image || 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-peptidesskin-com/assets/images/bpc-157tb-500-bpc-157tb-500-10mg-4.png';
  const productHandle = product?.handle || 'bpc-i57';
  const productId = product?.id || 'bpc-i57';
  
  // Prepare images array: use product.images if available, otherwise use the main image
  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : [productImage];

  const handleAddToCart = () => {
    addItem({
      id: productId,
      variantId: selectedVariant.id,
      title: productTitle,
      variantTitle: selectedVariant.title,
      price: basePrice,
      image: productImage,
      handle: productHandle,
    }, quantity);
  };

  return (
    <section className="container mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
        {/* Left: Product Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <ProductImageGallery 
            images={productImages} 
            productTitle={productTitle}
            imageMetadata={product?.imageMetadata}
          />
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl md:text-[32px] font-semibold text-[#09121F] leading-tight mb-2 uppercase tracking-tight">{productTitle}</h1>

          <div className="text-2xl font-bold text-[#09121F] mb-6">${basePrice.toFixed(2)}</div>

          <div className="space-y-6">
            {/* Variant Selector - Show if variants exist (even if only one) */}
            {variants && variants.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#09121F]">Size:</label>
                <div className="flex flex-wrap gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedVariant.id === variant.id
                          ? "border-[#8A773E] bg-white text-[#8A773E] shadow-[0_0_0_1px_#8A773E]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-28">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-12 rounded-xl border border-gray-200 bg-[#f4f7fc] px-4 appearance-none text-sm font-medium text-[#09121F] focus:ring-2 focus:ring-[#8A773E] outline-none"
                >
                  {[1, 2, 3, 4, 5, 10, 20].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#09121F] pointer-events-none" />
              </div>
              <button 
                onClick={handleAddToCart}
                className="w-full flex-1 h-12 bg-[#8A773E] hover:bg-[#6B5E2F] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to cart
              </button>
            </div>

            {/* Short Description - appears after Add to Cart button */}
            {product?.description && (
              <div className="pt-2">
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Trust Markers */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                <Truck className="w-4 h-4 text-[#8A773E]" />
                <span>Ships <span className="font-bold">Monday</span> morning if ordered within <span className="font-bold">2 hrs 20 min.</span></span>
              </div>
                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                  <Truck className="w-4 h-4 text-[#8A773E]" />
                  <span>Free shipping on orders $150+</span>
                </div>
              <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                <ShieldCheck className="w-4 h-4 text-[#8A773E]" />
                <span className="font-bold text-[#8A773E] underline cursor-pointer">Third party tested</span>
              </div>
            </div>



          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;

