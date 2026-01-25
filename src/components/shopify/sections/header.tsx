'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@clerk/nextjs';
import { AuthUserButton } from '@/components/auth';
import { SearchBar } from '@/components/search/search-bar';

type HeaderProps = {
  settings: {
    logo_url?: string;
    logo_position?: 'left' | 'center';
  };
};

export function Header({ settings }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Section: Mobile Menu + Logo + Navigation */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-black hover:opacity-70 transition-opacity flex items-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center" aria-label="Peptides Skin">
              <Image
                src="https://zhi52hg7v8.ufs.sh/f/2Om2Ppf6miXTIVq60fpIcLdCPi3wSmxB28OjsUetZKkE0aYn"
                alt="Peptides Skin"
                width={300}
                height={100}
                className="h-20 lg:h-24 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation - Same line as logo */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity leading-none"
              >
                Home
              </Link>
              <Link
                href="/collections/all"
                className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity leading-none"
              >
                Catalog
              </Link>
              <Link
                href="/pages/contact"
                className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity leading-none"
              >
                Contact
              </Link>
              <Link
                href="/pages/peptide-calculator"
                className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity leading-none"
              >
                Calculator
              </Link>
              <Link
                href="/blogs/news"
                className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity leading-none"
              >
                News
              </Link>
            </nav>
          </div>

          {/* Center Section: Search Bar - Hidden when SearchBar is open */}
          {!isSearchOpen && (
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Right Section: Icons - Same line */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2 text-black hover:opacity-70 transition-opacity"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* User/Account */}
            {isLoaded && (
              isSignedIn ? (
                <div className="hidden sm:block">
                  <AuthUserButton />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="p-2 text-black hidden sm:block hover:opacity-70 transition-opacity"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5 lg:w-[18px] lg:h-[18px]" strokeWidth={1.5} />
                </Link>
              )
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-black relative hover:opacity-70 transition-opacity"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 lg:w-[18px] lg:h-[18px]" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#12b3b0] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-black/10 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
              >
                Home
              </Link>
              <Link
                href="/collections/all"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
              >
                Catalog
              </Link>
              <Link
                href="/pages/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
              >
                Contact
              </Link>
              <Link
                href="/pages/peptide-calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
              >
                Calculator
              </Link>
              <Link
                href="/blogs/news"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
              >
                News
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <SearchBar 
        isOpen={isSearchOpen} 
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        initialQuery={searchQuery}
      />
    </header>
  );
}
