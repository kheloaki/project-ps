"use client";

import React, { useState, useEffect } from "react";

/**
 * AgeVerificationModal component
 * 
 * Pixel-perfect clone of the age gate modal specified in the design instructions.
 * Uses Tailwind CSS and follows the high-level design system for colors, 
 * typography, and effects like backdrop blur.
 */
export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age (persists across sessions)
    const isVerified = localStorage.getItem("age-verified");
    if (!isVerified) {
      setIsOpen(true);
      // Add class to body to prevent scrolling when modal is open
      document.body.classList.add("gate-open");
    }
  }, []);

  const handleConfirm = () => {
    // Store in localStorage so it persists across browser sessions
    localStorage.setItem("age-verified", "true");
    setIsOpen(false);
    document.body.classList.remove("gate-open");
  };

  const handleLeave = () => {
    // Standard behavior for "Leave" is typically redirecting to Google or closing current tab
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121212cc] backdrop-blur-[6px] transition-all duration-300">
      <div 
        className="relative w-[90%] max-w-[640px] rounded-[4px] bg-white p-[48px] text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] md:p-[60px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
      >
        <h2 
          id="age-gate-title"
          className="mb-6 text-[24px] font-bold uppercase tracking-[0.05em] text-[#121212] leading-[1.2]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          IMPORTANT — RESEARCH USE ONLY
        </h2>
        
        <div className="mb-8 text-center text-[16px] leading-[1.6] text-[#121212]">
          <p className="mb-0">
            Products on this website are for <span className="font-bold">legitimate laboratory research use only</span> and are <span className="font-bold">not for human consumption</span>. By continuing, you confirm you are <span className="font-bold">21 years or older</span>. If you are under <span className="font-bold">21 years</span>, please leave this site.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className="w-full rounded-[4px] bg-[#108a9f] py-[16px] px-[32px] text-[14px] font-[600] uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#0d7688]"
          >
            I am 21+ years — Enter
          </button>
          
          <button
            onClick={handleLeave}
            className="w-full rounded-[4px] bg-[#1a1c23] py-[16px] px-[32px] text-[14px] font-[600] uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#000000]"
          >
            I am under 21 years — Leave
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* Prevent body scroll when gate is open */
        body.gate-open {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}