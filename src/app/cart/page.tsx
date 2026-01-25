'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BacWaterCrossSell from '@/components/cross-sell/bac-water-cross-sell';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const [showBacWaterCrossSell, setShowBacWaterCrossSell] = useState(false);

  // Check if cart has non-BAC water products
  const hasNonBacWaterProducts = items.some(item => {
    const title = item.title.toLowerCase();
    const handle = item.handle?.toLowerCase() || '';
    return !title.includes('bac water') && 
           !title.includes('bacteriostatic water') &&
           !handle.includes('bac-water');
  });

  // Check if BAC water is already in cart
  const hasBacWater = items.some(item => {
    const title = item.title.toLowerCase();
    const handle = item.handle?.toLowerCase() || '';
    return title.includes('bac water') || 
           title.includes('bacteriostatic water') ||
           handle.includes('bac-water');
  });

  // Show cross-sell if there are non-BAC water products and no BAC water
  const shouldShowCrossSell = hasNonBacWaterProducts && !hasBacWater && items.length > 0;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#f4f4f4] flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-[#757575]" />
          </div>
          <h1 className="text-2xl font-semibold uppercase tracking-wide mb-3">Your cart is empty</h1>
          <p className="text-[#757575] text-sm mb-8">
            Add research peptides to your cart to continue shopping.
          </p>
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 bg-[#8A773E] text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-[#6B5E2F] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="mb-6">
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 text-sm text-[#8A773E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Shopping Cart</h1>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="text-sm text-gray-600 mb-2">{item.variantTitle}</p>
                    )}
                    <p className="text-lg font-semibold text-[#8A773E] mb-3">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BAC Water Cross-Sell Section */}
            {shouldShowCrossSell && (
              <div className="mt-8 p-6 border-2 border-amber-200 rounded-lg bg-amber-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Don't forget BAC Water!
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Peptides require bacteriostatic water for reconstitution. Add BAC Water to your cart to complete your order.
                    </p>
                    <button
                      onClick={() => setShowBacWaterCrossSell(true)}
                      className="inline-flex items-center gap-2 bg-[#8A773E] hover:bg-[#6B5E2F] text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      Add BAC Water
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="sticky top-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#8A773E]">${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#8A773E] hover:bg-[#6B5E2F] text-white px-6 py-4 rounded-lg font-semibold transition-colors mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/collections/all"
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BAC Water Cross-Sell Modal */}
      {showBacWaterCrossSell && (
        <BacWaterCrossSell
          onClose={() => setShowBacWaterCrossSell(false)}
          onAddToCart={() => setShowBacWaterCrossSell(false)}
        />
      )}
    </div>
  );
}

