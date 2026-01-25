"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Beaker, FlaskConical, Droplet } from "lucide-react";

const DoseOptions = [0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15, 50];
const StrengthOptions = [1, 5, 10, 15, 20, 30, 50, 100];
const BWOptions = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 5.0];

export default function PeptideCalculatorMain() {
  const [dose, setDose] = useState<number>(0.25);
  const [strength, setStrength] = useState<number>(5);
  const [bw, setBw] = useState<number>(0.5);

  const [activeOther, setActiveOther] = useState<{
    dose: boolean;
    strength: boolean;
    bw: boolean;
  }>({ dose: false, strength: false, bw: false });

  const [customInputs, setCustomInputs] = useState({
    dose: "0.25",
    strength: "5",
    bw: "0.5",
  });

  // Calculations
  const results = useMemo(() => {
    const d = dose || 0;
    const s = strength || 0;
    const w = bw || 0;

    if (s === 0 || w === 0) return { units: 0, doses: 0, concentration: 0 };

    const concentration = s / w; // mg per mL
    const mlPerDose = d / concentration;
    const unitsPerDose = mlPerDose * 100; // U-100 syringe
    const dosesPerVial = s / d;

    return {
      units: Number(unitsPerDose.toFixed(2)),
      doses: Math.floor(dosesPerVial),
      concentration: Number(concentration.toFixed(2)),
    };
  }, [dose, strength, bw]);

  const handleChipClick = (
    type: "dose" | "strength" | "bw",
    val: number | "Other"
  ) => {
    if (val === "Other") {
      setActiveOther((prev) => ({ ...prev, [type]: true }));
    } else {
      setActiveOther((prev) => ({ ...prev, [type]: false }));
      if (type === "dose") setDose(val);
      if (type === "strength") setStrength(val);
      if (type === "bw") setBw(val);
    }
  };

  const handleInputChange = (
    type: "dose" | "strength" | "bw",
    val: string
  ) => {
    setCustomInputs((prev) => ({ ...prev, [type]: val }));
    const num = parseFloat(val);
    if (!isNaN(num)) {
      if (type === "dose") setDose(num);
      if (type === "strength") setStrength(num);
      if (type === "bw") setBw(num);
    }
  };

  return (
    <section className="w-full bg-[#f4f6f8] py-10 px-5 font-sans" aria-label="Peptide Calculator">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-center text-[16px] text-[#6b7280] mb-8 italic">
          “Use our peptide calculator to compute research solution volumes and syringe draw units for laboratory use only.”.
        </p>

        <div className="bg-[#132145] rounded-[12px] p-6 lg:p-8 shadow-xl overflow-hidden border border-[#132145]">
          <h3 className="text-[20px] font-bold text-white tracking-widest text-center mb-6 uppercase border-b border-white/10 pb-4">
            DRAW & DOSE CALCULATOR
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* DOSE OF PEPTIDE */}
            <div className="bg-white rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-[#f4f6f8] px-2 py-1 rounded-[4px] border border-[#d1d5db]">
                   <Beaker className="w-3 h-3 text-[#132145]" />
                   <span className="text-[10px] font-bold text-[#132145] uppercase tracking-tighter">Peptides</span>
                </div>
                <h4 className="text-[16px] font-bold text-[#000000] uppercase">Dose of Peptide</h4>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {DoseOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChipClick("dose", opt)}
                    className={`px-3 py-1.5 text-[13px] font-medium border rounded-[4px] transition-all duration-200 min-w-[55px] ${
                      !activeOther.dose && dose === opt
                        ? "bg-[#e9b330] border-[#e9b330] text-black"
                        : "bg-white border-[#d1d5db] text-[#132145] hover:border-[#132145]"
                    }`}
                  >
                    {opt}mg
                  </button>
                ))}
                <button
                  onClick={() => handleChipClick("dose", "Other")}
                  className={`px-3 py-1.5 text-[13px] font-medium border rounded-[4px] transition-all duration-200 min-w-[55px] ${
                    activeOther.dose
                      ? "bg-[#e9b330] border-[#e9b330] text-black"
                      : "bg-white border-[#d1d5db] text-[#132145] hover:border-[#132145]"
                  }`}
                >
                  Other
                </button>
              </div>

              {activeOther.dose && (
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Custom dose (mg)</label>
                  <input
                    type="number"
                    value={customInputs.dose}
                    onChange={(e) => handleInputChange("dose", e.target.value)}
                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:ring-1 focus:ring-[#132145]"
                  />
                </div>
              )}
              <p className="text-[12px] text-[#6b7280] font-medium mt-2">
                {dose} mg ≈ {Math.round(dose * 1000)} mcg (μg)
              </p>
            </div>

            {/* PEPTIDE STRENGTH */}
            <div className="bg-white rounded-[8px] p-5 shadow-sm flex flex-col">
              <div className="flex flex-col mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 bg-[#f4f6f8] px-2 py-1 rounded-[4px] border border-[#d1d5db]">
                    <FlaskConical className="w-3 h-3 text-[#132145]" />
                    <span className="text-[10px] font-bold text-[#132145] uppercase tracking-tighter">Vial size</span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#000000] uppercase">Peptide Strength</h4>
                </div>
                <p className="text-[11px] text-[#6b7280]">corresponds with the size of your vial</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {StrengthOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChipClick("strength", opt)}
                    className={`px-3 py-1.5 text-[13px] font-medium border rounded-[4px] transition-all duration-200 min-w-[55px] ${
                      !activeOther.strength && strength === opt
                        ? "bg-[#e9b330] border-[#e9b330] text-black"
                        : "bg-white border-[#d1d5db] text-[#132145] hover:border-[#132145]"
                    }`}
                  >
                    {opt}mg
                  </button>
                ))}
                <button
                  onClick={() => handleChipClick("strength", "Other")}
                  className={`px-3 py-1.5 text-[13px] font-medium border rounded-[4px] transition-all duration-200 min-w-[55px] ${
                    activeOther.strength
                      ? "bg-[#e9b330] border-[#e9b330] text-black"
                      : "bg-white border-[#d1d5db] text-[#132145] hover:border-[#132145]"
                  }`}
                >
                  Other
                </button>
              </div>

              {activeOther.strength && (
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Custom strength (mg)</label>
                  <input
                    type="number"
                    value={customInputs.strength}
                    onChange={(e) => handleInputChange("strength", e.target.value)}
                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:ring-1 focus:ring-[#132145]"
                  />
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold text-[#132145] block mb-1">Common Strengths</span>
                <div className="text-[12px] text-[#6b7280]">
                  <p><strong>BPC-157:</strong> 10mg</p>
                  <p><strong>NAD+:</strong> 1000mg</p>
                </div>
              </div>
            </div>

            {/* BACTERIOSTATIC WATER */}
            <div className="bg-white rounded-[8px] p-5 shadow-sm flex flex-col">
              <div className="flex flex-col mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 bg-[#f4f6f8] px-2 py-1 rounded-[4px] border border-[#d1d5db]">
                    <Droplet className="w-3 h-3 text-[#132145]" />
                    <span className="text-[10px] font-bold text-[#132145] uppercase tracking-tighter">Bacteriostatic Water</span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#000000] uppercase">Bacteriostatic Water</h4>
                </div>
                <p className="text-[11px] text-[#6b7280]">determines peptide concentration</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {BWOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChipClick("bw", opt)}
                    className={`px-3 py-1.5 text-[13px] font-medium border rounded-[4px] transition-all duration-200 min-w-[55px] ${
                      !activeOther.bw && bw === opt
                        ? "bg-[#e9b330] border-[#e9b330] text-black"
                        : "bg-white border-[#d1d5db] text-[#132145] hover:border-[#132145]"
                    }`}
                  >
                    {opt.toFixed(1)}mL
                  </button>
                ))}
                <button
                  onClick={() => handleChipClick("bw", "Other")}
                  className={`px-3 py-1.5 text-[13px] font-medium border rounded-[4px] transition-all duration-200 min-w-[55px] ${
                    activeOther.bw
                      ? "bg-[#e9b330] border-[#e9b330] text-black"
                      : "bg-white border-[#d1d5db] text-[#132145] hover:border-[#132145]"
                  }`}
                >
                  Other
                </button>
              </div>

              {activeOther.bw && (
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Custom volume (mL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customInputs.bw}
                    onChange={(e) => handleInputChange("bw", e.target.value)}
                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:ring-1 focus:ring-[#132145]"
                  />
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold text-[#132145] block mb-1">Common Amounts</span>
                <div className="text-[12px] text-[#6b7280]">
                  <p><strong>GLP-1s:</strong> 2mL – 3mL</p>
                  <p><strong>Peptides:</strong> 3mL</p>
                  <p><strong>NAD+:</strong> 5mL</p>
                </div>
              </div>
            </div>
          </div>

          {/* RESULT PANEL */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h4 className="text-center text-[18px] font-bold text-white uppercase tracking-widest mb-6 underline underline-offset-8 decoration-[#e9b330]">
              Result
            </h4>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#000000]/30 border border-white/5 rounded-[6px] p-4 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Peptide Dose</div>
                <div className="text-[22px] font-bold text-white">{dose} mg</div>
              </div>
              <div className="bg-[#000000]/30 border border-[#e9b330]/40 rounded-[6px] p-4 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 transition-colors group-hover:text-[#e9b330]">Draw Syringe To</div>
                <div className="text-[22px] font-bold text-[#e9b330]">{results.units} units</div>
              </div>
              <div className="bg-[#000000]/30 border border-white/5 rounded-[6px] p-4 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Your Vial Contains</div>
                <div className="text-[22px] font-bold text-white">{results.doses} doses</div>
              </div>
              <div className="bg-[#000000]/30 border border-white/5 rounded-[6px] p-4 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Concentration</div>
                <div className="text-[22px] font-bold text-white">{results.concentration} mg/mL</div>
              </div>
            </div>

            {/* SYRINGE STALE GRAPHIC */}
            <div className="mt-10 mb-2 px-4">
              <div className="relative h-[40px] flex items-end">
                {/* Ruler Ticks */}
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/20"></div>
                {Array.from({ length: 11 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${i * 10}%` }}
                  >
                    <span className="text-[10px] text-gray-400 mb-1">{i * 10}</span>
                    <div className="w-[1px] h-[8px] bg-white/30"></div>
                  </div>
                ))}

                {/* Units Marker / Indicator */}
                <div 
                  className="absolute bottom-0 h-[10px] bg-[#e9b330] rounded-t-[2px] transition-all duration-300 shadow-[0_-2px_6px_rgba(233,179,48,0.4)]"
                  style={{ left: '0%', width: `${Math.min(results.units, 100)}%` }}
                ></div>
                
                {/* Pointer Icon */}
                <div 
                  className="absolute -top-1 transition-all duration-300"
                  style={{ left: `calc(${Math.min(results.units, 100)}% - 8px)` }}
                >
                  <Droplet className="w-4 h-4 text-[#e9b330] fill-[#e9b330]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[12px] text-[#6b7280]">
          For research and educational use only. Not medical advice. Not intended for diagnosis, treatment, or dosing calculations. —{" "}
          <a href="#" className="underline hover:text-[#e9b330] transition-colors">Methodology & sources</a>
        </p>
      </div>
    </section>
  );
}