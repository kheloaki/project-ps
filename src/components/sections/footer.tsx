"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0a1a1f] via-[#0d2a33] to-[#10869c] border-t border-white/10 pt-[80px] pb-[40px] font-sans">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-[30px]">
          {/* Column 1: Legal & Policies */}
          <div className="flex flex-col">
            <h2 className="text-[16px] font-semibold mb-6 text-white leading-[1.2]">
              Legal & Policies
            </h2>
            <nav className="flex flex-col space-y-3">
              <a href="/pages/privacy-policy" className="text-[14px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity">
                Privacy Policy
              </a>
              <a href="/pages/refund-policy" className="text-[14px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity">
                Refund Policy
              </a>
              <a href="/pages/shipping-policy" className="text-[14px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity">
                Shipping Policy
              </a>
              <a href="/pages/terms-of-service" className="text-[14px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity">
                Terms of Service
              </a>
              <a href="/pages/privacy-policy-1" className="text-[14px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity">
                Privacy Policy
              </a>
              <a href="/pages/about-us" className="text-[14px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity">
                About Us
              </a>
            </nav>
          </div>

          {/* Column 2: Support */}
          <div className="flex flex-col">
            <h2 className="text-[16px] font-semibold mb-6 text-white leading-[1.2]">
              Support
            </h2>
            <nav className="flex flex-col space-y-3">
              <a href="/pages/contact" className="text-[14px] text-white opacity-80 hover:opacity-100 hover:underline transition-opacity">
                Contact Information
              </a>
            </nav>
          </div>

          {/* Column 3: Newsletter */}
          <div className="flex flex-col">
            <h2 className="text-[16px] font-semibold mb-6 text-white leading-[1.2]">
              We send tasty emails
            </h2>
            <form 
              className="relative border-b border-white/30 pb-2 mt-2 group" 
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent border-none outline-none text-[14px] text-white placeholder:text-white/60 pr-8 focus:ring-0"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 cursor-pointer text-white"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="mt-[60px] pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[12px] text-white/70">
          <div className="flex items-center">
            <span>© 2024 peptidesskin</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 opacity-80 hover:opacity-100">
              <span className="w-4 h-4 rounded-full bg-gray-300 inline-block align-middle overflow-hidden">
                <svg viewBox="0 0 16 16" className="w-full h-full"><circle cx="8" cy="8" r="8" fill="#666" /></svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;