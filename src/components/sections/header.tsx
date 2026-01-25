'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, useUser } from '@clerk/nextjs';
import { AuthUserButton } from '@/components/auth';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { CartButton } from '@/components/cart/cart-button';
import { SearchModal } from '@/components/search/search-modal';

const Header = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Check admin status from API (includes environment variable check)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded || !isSignedIn) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        setIsAdmin(data.isAdmin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        // Fallback to client-side check
        const clientCheck = user?.publicMetadata?.role === 'admin' || 
                           user?.publicMetadata?.isAdmin === true;
        setIsAdmin(clientCheck);
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user]);

  return (
    <header className="sticky top-0 z-[50] w-full bg-white border-b border-[#e2e2e2]">
      <div className="container px-[20px] md:px-[40px] h-[140px] flex items-center justify-between">
        {/* Left: Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-[20px] flex-1">
          <a href="/" className="nav-item whitespace-nowrap">
            Home
          </a>
          <a href="/collections/all" className="nav-item whitespace-nowrap">
            Catalog
          </a>
          <a href="/pages/contact" className="nav-item whitespace-nowrap">
            Contact
          </a>
          <a href="/pages/peptide-calculator" className="nav-item whitespace-nowrap">
            Peptide Calculator
          </a>
          <a href="https://peptidesskin.com/blogs/news" className="nav-item whitespace-nowrap">
            blogs/news
          </a>
          {isLoaded && isSignedIn && isAdmin && (
            <Link href="/admin" className="nav-item whitespace-nowrap">
              Admin
            </Link>
          )}
        </nav>

        {/* Mobile Menu Trigger (Left on Mobile) */}
        <div className="lg:hidden flex-1 flex items-center">
          <button className="p-2 -ml-2" aria-label="Menu">
            <Menu className="w-[24px] h-[24px]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center items-center flex-shrink-0">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl md:text-3xl font-bold text-[#8A773E] tracking-tight">
              Peptides Skin
            </h1>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-end flex-1 space-x-[15px] md:space-x-[20px]">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-1 hover:opacity-70 transition-opacity" 
            aria-label="Search"
          >
            <Search className="w-[24px] h-[24px]" strokeWidth={1.5} />
          </button>
          
          {isLoaded && (
            isSignedIn ? (
              <div className="hidden md:block">
                <AuthUserButton />
              </div>
            ) : (
              <Link 
                href="/sign-in" 
                className="p-1 hover:opacity-70 transition-opacity hidden md:block" 
                aria-label="Sign In"
              >
                <User className="w-[24px] h-[24px]" strokeWidth={1.5} />
              </Link>
            )
          )}

          <CartButton className="p-1" />
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      <style jsx global>{`
        .nav-item {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #121212;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .nav-item:hover {
          opacity: 0.7;
        }
        @media (max-width: 1024px) {
          .container {
            height: 110px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;