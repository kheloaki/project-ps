"use client";

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import Link from 'next/link';

interface BacWaterProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
}

interface BacWaterCrossSellProps {
  onClose: () => void;
  onAddToCart: () => void;
}

const BacWaterCrossSell = ({ onClose, onAddToCart }: BacWaterCrossSellProps) => {
  const [bacWaterProduct, setBacWaterProduct] = useState<BacWaterProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchBacWater = async () => {
      try {
        // Search for bac water products
        const response = await fetch('/api/products?search=bac water');
        if (response.ok) {
          const data = await response.json();
          // Handle both { products: [...] } and [...] response formats
          const products = Array.isArray(data) ? data : (data.products || []);
          // Find the first bac water product
          const bacWater = products.find((p: any) => 
            p.title.toLowerCase().includes('bac water') || 
            p.handle.toLowerCase().includes('bac-water') ||
            p.title.toLowerCase().includes('bacteriostatic water')
          );
          
          if (bacWater) {
            setBacWaterProduct({
              id: bacWater.id,
              handle: bacWater.handle,
              title: bacWater.title,
              price: bacWater.price,
              image: bacWater.image,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching bac water:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBacWater();
  }, []);

  const handleAddBacWater = () => {
    if (!bacWaterProduct) return;

    const price = parseFloat(bacWaterProduct.price.replace(/[^0-9.]/g, ''));
    
    addItem({
      id: bacWaterProduct.id,
      variantId: bacWaterProduct.id, // Use product ID as variant ID if no variants
      title: bacWaterProduct.title,
      price: price,
      image: bacWaterProduct.image,
      handle: bacWaterProduct.handle,
    }, 1);

    onAddToCart();
  };

  const isBacWaterInCart = items.some(item => 
    item.title.toLowerCase().includes('bac water') ||
    item.handle?.toLowerCase().includes('bac-water')
  );

  if (loading) {
    return null;
  }

  if (!bacWaterProduct || isBacWaterInCart) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4 mx-auto">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Don't forget BAC Water!
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-6">
            Peptides require bacteriostatic water for reconstitution. Add BAC Water to your cart to complete your order.
          </p>

          {/* Product Card */}
          {bacWaterProduct && (
            <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={bacWaterProduct.image}
                    alt={bacWaterProduct.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {bacWaterProduct.title}
                  </h4>
                  <p className="text-lg font-bold text-[#8A773E]">
                    {bacWaterProduct.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddBacWater}
              className="flex-1 flex items-center justify-center gap-2 bg-[#8A773E] hover:bg-[#6B5E2F] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Add BAC Water to Cart
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              No Thanks
            </button>
          </div>

          {/* View Product Link */}
          {bacWaterProduct && (
            <Link
              href={`/products/${bacWaterProduct.handle}`}
              onClick={onClose}
              className="block text-center text-sm text-[#8A773E] hover:text-[#6B5E2F] mt-4 underline"
            >
              View Product Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacWaterCrossSell;

