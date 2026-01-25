"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import BacWaterCrossSell from '@/components/cross-sell/bac-water-cross-sell';

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-gray-200">
          <SheetTitle className="text-xl font-semibold text-gray-900">
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-600 mb-6">Add items to your cart to continue shopping</p>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                      {item.title}
                    </h3>
                    {item.variantTitle && (
                      <p className="text-xs text-gray-600 mb-2">{item.variantTitle}</p>
                    )}
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BAC Water Cross-Sell Section */}
          {shouldShowCrossSell && (
            <div className="mt-4 p-4 border-2 border-amber-200 rounded-lg bg-amber-50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Don't forget BAC Water!
                  </h4>
                  <p className="text-xs text-gray-700 mb-3">
                    Peptides require bacteriostatic water for reconstitution.
                  </p>
                  <button
                    onClick={() => setShowBacWaterCrossSell(true)}
                    className="w-full text-xs bg-[#8A773E] hover:bg-[#6B5E2F] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add BAC Water
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="px-6 py-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between w-full text-lg font-semibold">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
            <Button
              asChild
              className="w-full bg-[#8A773E] hover:bg-[#6B5E2F] text-white h-12"
              onClick={() => onOpenChange(false)}
            >
              <Link href="/cart" className="flex items-center justify-center gap-2">
                View Cart
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Continue Shopping
            </Button>
          </SheetFooter>
        )}
      </SheetContent>

      {/* BAC Water Cross-Sell Modal */}
      {showBacWaterCrossSell && (
        <BacWaterCrossSell
          onClose={() => setShowBacWaterCrossSell(false)}
          onAddToCart={() => setShowBacWaterCrossSell(false)}
        />
      )}
    </Sheet>
  );
}

