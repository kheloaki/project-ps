"use client";

import React, { useState, useEffect } from "react";
import { Info, FlaskConical, Droplet, TestTube2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Peptide Calculator Tool Component
 * Pixel-perfect clone of the Draw & Dose Calculator section.
 * Professional Technical Medical laboratory aesthetic.
 */

export default function PeptideCalculatorTool() {
  // State for calculation parameters
  const [dose, setDose] = useState<number>(0.25);
  const [strength, setStrength] = useState<number>(5);
  const [water, setWater] = useState<number>(0.5);

  // Results calculation
  const concentration = strength / water; // mg/mL
  const drawAmountML = dose / concentration; // mL
  const units = drawAmountML * 100; // Units (assuming U-100 syringe)
  const dosesPerVial = strength / dose;

  // Manual input state (for "Other" options)
  const [showOtherDose, setShowOtherDose] = useState(false);
  const [showOtherStrength, setShowOtherStrength] = useState(false);
  const [showOtherWater, setShowOtherWater] = useState(false);

  const doseOptions = [0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15, 50];
  const strengthOptions = [1, 5, 10, 15, 20, 30, 50, 100];
  const waterOptions = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 5.0];

  return (
    <section className="w-full py-10 md:py-20 bg-white">
      <div className="container mx-auto max-w-[1200px] px-6">
        <p className="text-center text-[#4B5563] mb-12 text-lg font-sans max-w-2xl mx-auto leading-relaxed italic">
          &ldquo;Use our peptide calculator to compute research solution volumes and syringe draw units for laboratory use only.&rdquo;
        </p>

        {/* Main Calculator Frame */}
        <div className="bg-[#0b1e3f] rounded-[16px] p-6 md:p-8 shadow-2xl">
          <h2 className="text-white text-center text-[22px] md:text-[28px] font-semibold tracking-widest mb-8 border-b border-white/10 pb-4">
            DRAW & DOSE CALCULATOR
          </h2>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Card: Dose */}
            <div className="bg-[#cfd8dc] rounded-[12px] p-5 flex flex-col min-h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-[#0b1e3f]/10 px-3 py-1 rounded-full text-[12px] font-semibold text-[#0b1e3f]">
                  <TestTube2 className="w-3.5 h-3.5" />
                  <span>Peptides</span>
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-black mb-1">Dose of Peptide</h3>
              <p className="text-[14px] text-gray-600 mb-6">Select target research dose</p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {doseOptions.map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setDose(val);
                      setShowOtherDose(false);
                    }}
                    className={cn(
                      "py-2.5 px-1 text-center text-[14px] font-medium rounded-[8px] transition-all duration-200 border",
                      dose === val && !showOtherDose
                        ? "bg-[#eab308] border-[#eab308] text-black shadow-sm"
                        : "bg-white border-gray-200 text-black hover:border-[#eab308]"
                    )}
                  >
                    {val}mg
                  </button>
                ))}
                <button
                  onClick={() => setShowOtherDose(true)}
                  className={cn(
                    "py-2.5 px-1 text-center text-[14px] font-medium rounded-[8px] transition-all duration-200 border",
                    showOtherDose
                      ? "bg-[#eab308] border-[#eab308] text-black"
                      : "bg-white border-gray-200 text-black"
                  )}
                >
                  Other
                </button>
              </div>

              {showOtherDose && (
                <div className="mb-4">
                  <label className="text-[12px] font-semibold text-gray-700 block mb-1">Custom dose (mg)</label>
                  <input
                    type="number"
                    value={dose}
                    onChange={(e) => setDose(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0b1e3f]"
                  />
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-400/20">
                <p className="text-[13px] text-gray-700 italic">
                  {dose} mg ≈ {dose * 1000} mcg (μg)
                </p>
              </div>
            </div>

            {/* Card: Strength */}
            <div className="bg-[#cfd8dc] rounded-[12px] p-5 flex flex-col min-h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-[#0b1e3f]/10 px-3 py-1 rounded-full text-[12px] font-semibold text-[#0b1e3f]">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Vial size</span>
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-black mb-1">Peptide Strength</h3>
              <p className="text-[13px] text-gray-600 mb-6 leading-tight">Corresponds with the size of your vial</p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {strengthOptions.map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setStrength(val);
                      setShowOtherStrength(false);
                    }}
                    className={cn(
                      "py-2.5 px-1 text-center text-[14px] font-medium rounded-[8px] transition-all duration-200 border",
                      strength === val && !showOtherStrength
                        ? "bg-[#eab308] border-[#eab308] text-black shadow-sm"
                        : "bg-white border-gray-200 text-black hover:border-[#eab308]"
                    )}
                  >
                    {val}mg
                  </button>
                ))}
                <button
                  onClick={() => setShowOtherStrength(true)}
                  className={cn(
                    "py-2.5 px-1 text-center text-[14px] font-medium rounded-[8px] transition-all duration-200 border",
                    showOtherStrength
                      ? "bg-[#eab308] border-[#eab308] text-black"
                      : "bg-white border-gray-200 text-black"
                  )}
                >
                  Other
                </button>
              </div>

              {showOtherStrength && (
                <div className="mb-4">
                  <label className="text-[12px] font-semibold text-gray-700 block mb-1">Custom strength (mg)</label>
                  <input
                    type="number"
                    value={strength}
                    onChange={(e) => setStrength(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0b1e3f]"
                  />
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-400/20 bg-[#cfd8dc]/50 rounded-b-md">
                <p className="text-[12px] font-bold text-gray-800 mb-1">Common Strengths</p>
                <div className="flex justify-between text-[12px] text-gray-700">
                  <span>BPC-157: 10mg</span>
                  <span>NAD+: 1000mg</span>
                </div>
              </div>
            </div>

            {/* Card: Bacteriostatic Water */}
            <div className="bg-[#cfd8dc] rounded-[12px] p-5 flex flex-col min-h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-[#0b1e3f]/10 px-3 py-1 rounded-full text-[12px] font-semibold text-[#0b1e3f]">
                  <Droplet className="w-3.5 h-3.5" />
                  <span>Solvent</span>
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-black mb-1">Bacteriostatic Water</h3>
              <p className="text-[13px] text-gray-600 mb-6 leading-tight">Determines peptide concentration</p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {waterOptions.map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setWater(val);
                      setShowOtherWater(false);
                    }}
                    className={cn(
                      "py-2.5 px-1 text-center text-[14px] font-medium rounded-[8px] transition-all duration-200 border",
                      water === val && !showOtherWater
                        ? "bg-[#eab308] border-[#eab308] text-black shadow-sm"
                        : "bg-white border-gray-200 text-black hover:border-[#eab308]"
                    )}
                  >
                    {val.toFixed(1)}mL
                  </button>
                ))}
                <button
                  onClick={() => setShowOtherWater(true)}
                  className={cn(
                    "py-2.5 px-1 text-center text-[14px] font-medium rounded-[8px] transition-all duration-200 border",
                    showOtherWater
                      ? "bg-[#eab308] border-[#eab308] text-black"
                      : "bg-white border-gray-200 text-black"
                  )}
                >
                  Other
                </button>
              </div>

              {showOtherWater && (
                <div className="mb-4">
                  <label className="text-[12px] font-semibold text-gray-700 block mb-1">Custom volume (mL)</label>
                  <input
                    type="number"
                    value={water}
                    onChange={(e) => setWater(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0b1e3f]"
                  />
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-400/20 bg-[#cfd8dc]/50 rounded-b-md">
                <p className="text-[12px] font-bold text-gray-800 mb-1">Common Amounts</p>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-gray-700">
                    <span>GLP-1s: 2mL - 3mL</span>
                    <span>Peptides: 3mL</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-700">
                    <span>NAD+: 5mL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="bg-white rounded-[12px] overflow-hidden shadow-inner">
            <div className="bg-[#0b1e3f] text-white py-2 text-center text-[14px] font-bold tracking-[0.2em]">
              RESULT
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-2">PEPTIDE DOSE</span>
                <span className="text-[20px] font-bold text-black">{dose} mg</span>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
                <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-2">DRAW SYRINGE TO</span>
                <span className="text-[28px] font-bold text-[#3B82F6]">{units.toFixed(1)} <span className="text-[16px] font-medium italic">units</span></span>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-2">YOUR VIAL CONTAINS</span>
                <span className="text-[20px] font-bold text-black">{Math.floor(dosesPerVial)} <span className="text-[14px] text-gray-500 font-normal">doses</span></span>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
                <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-2">CONCENTRATION</span>
                <span className="text-[20px] font-bold text-black">{concentration.toFixed(1)} <span className="text-[14px] text-gray-500 font-normal">mg/mL</span></span>
              </div>
            </div>

            {/* Syringe Slider Mockup */}
            <div className="p-8 pb-10 relative">
              <div className="w-full h-8 bg-gray-200 rounded-full relative overflow-hidden flex items-center">
                {/* 100 Unit Marks */}
                <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="h-4 w-[1.5px] bg-gray-400"></div>
                      <span className="text-[9px] mt-1 text-gray-400 font-semibold">{i * 10}</span>
                    </div>
                  ))}
                </div>
                {/* Progress Bar */}
                <div 
                  className="h-full bg-gradient-to-r from-[#3B82F6]/40 to-[#3B82F6] transition-all duration-500"
                  style={{ width: `${Math.min(units, 100)}%` }}
                ></div>
                {/* Thumb Indicator */}
                <div 
                  className="absolute p-0.5 bg-white border-2 border-[#3B82F6] rounded-full shadow-md z-10 -ml-2"
                  style={{ left: `${Math.min(units, 100)}%` }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                </div>
              </div>
              <div 
                className="absolute top-0 text-[12px] font-bold text-[#3B82F6] transition-all duration-500 bg-white px-2 py-0.5 rounded shadow-sm border border-[#3B82F6]/20"
                style={{ left: `calc(${Math.min(units, 100)}% - 20px)` }}
              >
                {units.toFixed(1)}u
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed max-w-4xl mx-auto">
              For research and educational use only. Not medical advice. Not intended for diagnosis, treatment, or dosing calculations. 
              <a href="#" className="underline ml-1 hover:text-white transition-colors">— Methodology & sources</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}