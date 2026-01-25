'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
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

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularKeywords = ['bpc-157', 'beta', 'cjc-1295', 'tesamorelin'];

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
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

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Search Bar */}
        <div className="py-4 border-b border-gray-200">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-14 py-4 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A773E] focus:border-transparent"
            />
            <button
              onClick={onClose}
              className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto py-6">
          {!searchQuery ? (
            <>
              {/* Popular Keywords */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Keywords</h2>
                <div className="flex flex-wrap gap-3">
                  {popularKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-base font-medium text-gray-700 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Peptides */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Peptides</h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-6 pb-4">
                    {popularProducts.map((product) => {
                      const defaultVariant = product.variants && product.variants.length > 0 
                        ? product.variants[0] 
                        : { id: `${product.id}-default`, title: 'Default', price: product.price };
                      
                      return (
                        <div
                          key={product.id}
                          className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <Link href={`/products/${product.handle}`} className="block">
                            <div className="aspect-square bg-gray-100 p-4">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="p-5">
                              <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">
                                {product.title}
                              </h3>
                              <p className="text-xl font-bold text-gray-900 mb-3">
                                {product.price}
                              </p>
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                className="w-full bg-[#8A773E] hover:bg-[#6B5E2F] text-white py-3 rounded-lg text-base font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="w-5 h-5" />
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
                  <p className="text-gray-500 text-lg">Searching...</p>
                </div>
              ) : products.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Search Results ({products.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <div className="p-5">
                              <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">
                                {product.title}
                              </h3>
                              <p className="text-xl font-bold text-gray-900 mb-3">
                                {product.price}
                              </p>
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                className="w-full bg-[#8A773E] hover:bg-[#6B5E2F] text-white py-3 rounded-lg text-base font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="w-5 h-5" />
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
                  <p className="text-gray-500 text-lg">No products found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

