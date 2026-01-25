"use client";

import React, { useState, useEffect } from "react";

/**
 * AgeGateModal Component
 * 
 * A mandatory age verification overlay for the website.
 * Features a semi-transparent dark overlay and a central white card.
 * Interactivity: 
 * - "Enter" button hides the modal and persists the state.
 * - "Leave" button redirects the user away from the site.
 */
export default function AgeGateModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already verified their age
    const isVerified = localStorage.getItem("age-verified");
    if (!isVerified) {
      setIsVisible(true);
      // Lock scrolling when modal is open
      document.body.classList.add("overflow-hidden");
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("age-verified", "true");
    setIsVisible(false);
    document.body.classList.remove("overflow-hidden");
  };

  const handleLeave = () => {
    // Redirect to a safe search page or previous page
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div 
        className="bg-white p-[48px] max-w-[600px] w-[90%] text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] flex flex-col items-center"
        role="dialog"
        aria-modal="true"
      >
        <h2 
          className="text-[28px] font-bold uppercase mb-[1.5rem] tracking-[0.02em] leading-tight text-[#121212]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          IMPORTANT — RESEARCH USE ONLY
        </h2>
        
        <p className="text-[16px] leading-[1.5] text-[#616161] mb-[2rem] max-w-[500px]">
          Products on this website are for <span className="font-bold text-[#121212]">legitimate laboratory research use only</span> and are <span className="font-bold text-[#121212]">not for human consumption</span>. By continuing, you confirm you are <span className="font-bold text-[#121212]">21 years or older</span>. If you are under <span className="font-bold text-[#121212]">21 years</span>, please leave this site.
        </p>

        <div className="w-full space-y-[12px]">
          <button
            onClick={handleEnter}
            className="w-full py-[16px] px-[20px] font-semibold uppercase tracking-[0.05em] text-[14px] bg-[#8A773E] text-white transition-colors hover:bg-[#6B5E2F] cursor-pointer"
          >
            I am 21+ years — Enter
          </button>
          
          <button
            onClick={handleLeave}
            className="w-full py-[16px] px-[20px] font-semibold uppercase tracking-[0.05em] text-[14px] bg-[#0f172a] text-white transition-colors hover:bg-black cursor-pointer"
          >
            I am under 21 years — Leave
          </button>
        </div>
      </div>
    </div>
  );
}