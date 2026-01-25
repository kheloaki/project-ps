"use client";

import { CartButton } from './cart-button';

export function CartButtonWrapper() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <CartButton className="bg-[#8A773E] hover:bg-[#6B5E2F] text-white shadow-lg rounded-full w-14 h-14" />
    </div>
  );
}

