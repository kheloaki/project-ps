'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, ShoppingBag } from 'lucide-react';
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
  const [isCompact, setIsCompact] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/10 relative">
      <div
        className={[
          'max-w-[1200px] mx-auto px-6 flex items-center justify-between transition-all duration-300',
          isCompact ? 'h-[40px]' : 'h-[40px] lg:h-[52px]',
        ].join(' ')}
      >
        {/* Left */}
        <div className={`flex-1 flex items-center ${settings.logo_position === 'left' ? 'order-2' : 'order-1'}`}>
          <button className="lg:hidden p-2 -ml-2 text-black" aria-label="Menu">
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <nav className="hidden lg:flex items-center gap-x-6">
            <Link
              href="/"
              className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70"
            >
              Home
            </Link>
            <Link
              href="/collections/all"
              className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70"
            >
              Catalog
            </Link>
            <Link
              href="/pages/contact"
              className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70"
            >
              Contact
            </Link>
            <Link
              href="/pages/peptide-calculator"
              className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70"
            >
              Calculator
            </Link>
            <Link
              href="/blogs/news"
              className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70"
            >
              News
            </Link>
          </nav>
        </div>

        {/* Logo */}
        <div className="order-2 flex justify-center">
          <Link href="/" className="block" aria-label="Peptides Skin">
            <div 
              className={[
                "relative transition-all duration-300",
                isCompact ? "w-[28px] h-[28px]" : "w-[28px] h-[28px] lg:w-[40px] lg:h-[40px]"
              ].join(' ')}
            >
              <Image
                src={settings.logo_url || "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptidesskin-peptide-logo_1-1.webp"}
                alt="Peptides Skin Logo"
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 40px, 28px"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-end gap-x-2 lg:gap-x-4 order-3">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-black hover:opacity-70 transition-opacity" 
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5 lg:w-[18px] lg:h-[18px]" strokeWidth={1.5} />
          </button>
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
                <User className="w-4.5 h-4.5 lg:w-[18px] lg:h-[18px]" strokeWidth={1.5} />
              </Link>
            )
          )}
          <Link href="/cart" className="p-2 -mr-2 text-black relative" aria-label="Cart">
            <ShoppingBag className="w-4.5 h-4.5 lg:w-[18px] lg:h-[18px]" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#12b3b0] text-white text-[9px] font-bold flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search Bar - Inline in Header */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
