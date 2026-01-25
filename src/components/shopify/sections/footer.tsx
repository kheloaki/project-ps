"use client";

import React from 'react';
import { MoveRight } from 'lucide-react';

interface FooterProps {
  settings: {
    color_scheme?: string;
    section_width?: string;
    padding_block_start?: number;
    padding_block_end?: number;
  };
  blocks?: Array<{
    id: string;
    type: string;
    settings: Record<string, any>;
  }>;
}

export function Footer({ settings, blocks }: FooterProps) {
  // Mocking the structure based on typical Shopify footer usage
  const legalLinks = [
    { label: 'Privacy Policy', href: '/policies/privacy-policy' },
    { label: 'Refund Policy', href: '/policies/refund-policy' },
    { label: 'Shipping Policy', href: '/policies/shipping-policy' },
    { label: 'Terms of Service', href: '/policies/terms-of-service' },
    { label: 'About Us', href: '/pages/about-us' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#0a1a1f] via-[#0d2a33] to-[#10869c] pt-[80px] pb-[40px] border-t border-white/10">
      <div className="container px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Legal & Policies */}
          <div>
            <h3 className="text-[14px] font-bold uppercase tracking-tight mb-6 text-white">
              LEGAL & POLICIES
            </h3>
            <nav className="flex flex-col space-y-2">
              {legalLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="text-[13px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[14px] font-bold uppercase tracking-tight mb-6 text-white">
              SUPPORT
            </h3>
            <p className="text-[13px] text-white opacity-80">
              Contact Information<br />
              Email: support@peptidesskin.com
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[14px] font-bold uppercase tracking-tight mb-6 text-white">
              WE SEND TASTY EMAILS
            </h3>
            <form className="relative mt-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full text-[14px] text-white border-none border-b border-white/30 bg-transparent pb-2 outline-none focus:border-white transition-colors placeholder:text-white/60"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-2 text-white hover:opacity-80 transition-opacity"
                aria-label="Subscribe"
              >
                <MoveRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
