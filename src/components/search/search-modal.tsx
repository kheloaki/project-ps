'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  handle: string;
  variants?: Array<{ id: string; title: string; price: string }>;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularKeywords = ['bpc-157', 'beta', 'cjc-1295', 'tesamorelin'];

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  // Fetch popular products on mount
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=6');
        const data = await response.json();
        setPopularProducts(data.products?.slice(0, 6) || []);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };
    fetchPopularProducts();
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Search products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultVariant = product.variants && product.variants.length > 0 
      ? product.variants[0] 
      : { id: `${product.id}-default`, title: 'Default', price: product.price };

    addItem({
      id: product.id,
      variantId: defaultVariant.id,
      title: product.title,
      variantTitle: defaultVariant.title !== 'Default' ? defaultVariant.title : undefined,
      price: parseFloat(defaultVariant.price.replace(/[^0-9.]/g, '')) || 0,
      image: product.image,
      handle: product.handle,
    });
  };

  const parsePrice = (priceString: string): number => {
    const match = priceString.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="max-w-4xl w-full p-0 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A773E] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!searchQuery ? (
            <>
              {/* Popular Keywords */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Peptides */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Peptides</h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-4">
                    {popularProducts.map((product) => {
                      const defaultVariant = product.variants && product.variants.length > 0 
                        ? product.variants[0] 
                        : { id: `${product.id}-default`, title: 'Default', price: product.price };
                      
                      return (
                        <div
                          key={product.id}
                          className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <Link href={`/products/${product.handle}`} className="block">
                            <div className="aspect-square bg-gray-100 p-4">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                                {product.title}
                              </h3>
                              <p className="text-lg font-bold text-gray-900 mb-3">
                                {product.price}
                              </p>
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                className="w-full bg-[#8A773E] hover:bg-[#6B5E2F] text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                              </button>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search Results */}
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Searching...</p>
                </div>
              ) : products.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Search Results ({products.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => {
                      const defaultVariant = product.variants && product.variants.length > 0 
                        ? product.variants[0] 
                        : { id: `${product.id}-default`, title: 'Default', price: product.price };
                      
                      return (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <Link href={`/products/${product.handle}`} className="block">
                            <div className="aspect-square bg-gray-100 p-4">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                                {product.title}
                              </h3>
                              <p className="text-lg font-bold text-gray-900 mb-3">
                                {product.price}
                              </p>
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                className="w-full bg-[#8A773E] hover:bg-[#6B5E2F] text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                              </button>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

