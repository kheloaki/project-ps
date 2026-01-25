"use client";

import React from 'react';

export function FooterUtilities({ settings }: any) {
  return (
    <div className="bg-[#f7f7f7] border-t border-[#e0e0e0] py-8">
      <div className="container px-6 max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center text-[12px] text-[#666666]">
        <p>© 2026 Peptides Skin. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <div className="w-10 h-6 bg-[#e0e0e0] rounded-sm opacity-50"></div>
          <div className="w-10 h-6 bg-[#e0e0e0] rounded-sm opacity-50"></div>
          <div className="w-10 h-6 bg-[#e0e0e0] rounded-sm opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
