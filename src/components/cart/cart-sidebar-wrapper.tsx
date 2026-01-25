"use client";

import React from 'react';
import { CartSidebar } from './cart-sidebar';
import { useCart } from '@/hooks/use-cart';

export function CartSidebarWrapper() {
  const { isOpen, openCart, closeCart } = useCart();

  return <CartSidebar open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()} />;
}

