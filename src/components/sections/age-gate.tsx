"use client";

import React, { useState, useEffect } from "react";

/**
 * AgeGate Component
 * 
 * A pixel-perfect implementation of the mandatory age verification modal.
 */
export function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already verified their age (persists across sessions)
    const isVerified = localStorage.getItem("age-verified");
    if (!isVerified) {
      setIsVisible(true);
      // Add class to body to prevent scrolling when modal is open
      document.body.classList.add("overflow-hidden");
    }
  }, []);

  const handleEnter = () => {
    // Store in localStorage so it persists across browser sessions
    localStorage.setItem("age-verified", "true");
    setIsVisible(false);
    document.body.classList.remove("overflow-hidden");
  };

  const handleLeave = () => {
    // Standard practice for "Leave" buttons is to redirect to a safe site
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white w-full max-w-[540px] rounded-[8px] p-8 md:p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <h2 
          className="text-[20px] md:text-[24px] font-semibold text-[#000000] uppercase tracking-[0.05em] mb-6 leading-tight"
        >
          IMPORTANT — RESEARCH USE ONLY
        </h2>
        
        <p className="text-[14px] md:text-[16px] text-[#000000] leading-[1.6] mb-10">
          Products on this website are for <span className="font-bold">legitimate laboratory research use only</span> and are <span className="font-bold">not for human consumption</span>. By continuing, you confirm you are <span className="font-bold text-teal-clinical">21 years or older</span>. If you are under <span className="font-bold">21 years</span>, please leave this site.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleEnter}
            className="w-full bg-[#11819B] hover:bg-[#0e6d83] text-white py-[14px] px-8 rounded-[8px] text-[14px] font-medium uppercase tracking-[0.1em] transition-colors duration-200"
          >
            I am 21+ years — Enter
          </button>
          
          <button
            onClick={handleLeave}
            className="w-full bg-[#0F172A] hover:bg-[#1e293b] text-white py-[14px] px-8 rounded-[8px] text-[14px] font-medium uppercase tracking-[0.1em] transition-colors duration-200"
          >
            I am under 21 years — Leave
          </button>
        </div>
      </div>
    </div>
  );
}
