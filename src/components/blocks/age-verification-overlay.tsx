"use client";

import React, { useState, useEffect } from 'react';

/**
 * AgeVerificationOverlay Component
 * 
 * Clones the "IMPORTANT – RESEARCH USE ONLY" age verification modal pop-up.
 * Features a dark semi-transparent backdrop, a centered white modal,
 * and dual confirmation buttons (teal and dark navy).
 */
const AgeVerificationOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already verified their age in this session
    const isVerified = sessionStorage.getItem('age-verified');
    if (!isVerified) {
      setIsVisible(true);
      // Disable scrolling on the body while modal is open
      document.body.classList.add('overflow-hidden');
    }
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem('age-verified', 'true');
    setIsVisible(false);
    document.body.classList.remove('overflow-hidden');
  };

  const handleExit = () => {
    // Standard behavior for "Leave": Redirect to a safe site or close
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
    >
      <div 
        className="bg-white max-w-[600px] w-full p-10 md:p-12 text-center animate-in fade-in zoom-in duration-300"
        style={{ borderRadius: '0px' }}
      >
        <h2 
          className="uppercase tracking-tight mb-4"
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '20px', 
            fontWeight: '800',
            lineHeight: '1.2',
            color: '#000000'
          }}
        >
          IMPORTANT – RESEARCH USE ONLY
        </h2>
        
        <p 
          className="mb-8"
          style={{ 
            fontFamily: 'var(--font-sans)', 
            fontSize: '14px', 
            lineHeight: '1.6',
            color: '#000000'
          }}
        >
          Products on this website are for <span className="font-bold text-black">legitimate laboratory research use only</span> and are <span className="font-bold text-black">not for human consumption</span>. By continuing, you confirm you are <span className="font-bold text-black">21 years or older</span>. If you are under <span className="font-bold text-black">21 years</span>, please leave this site.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className="w-full py-[14px] text-white flex items-center justify-center transition-all duration-200"
            style={{ 
              backgroundColor: '#118199', // Teal color from design
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'none',
              borderRadius: '6px' // Visual match to screenshot buttons
            }}
          >
            I am 21+ years — Enter
          </button>
          
          <button
            onClick={handleExit}
            className="w-full py-[14px] text-white flex items-center justify-center transition-all duration-200"
            style={{ 
              backgroundColor: '#0b0e13', // Dark navy from design
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'none',
              borderRadius: '6px'
            }}
          >
            I am under 21 years — Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationOverlay;