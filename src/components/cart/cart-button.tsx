"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export function CartButton({ className, variant = "ghost" }: CartButtonProps) {
  const { itemCount, openCart } = useCart();

  return (
    <Button
      variant={variant}
      onClick={openCart}
      className={cn("relative", className)}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#8A773E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
}

