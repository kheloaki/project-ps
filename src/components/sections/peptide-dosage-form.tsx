"use client";

import React, { useState } from "react";

const PeptideDosageForm: React.FC = () => {
  const [vialAmount, setVialAmount] = useState<string>("10");
  const [solventAmount, setSolventAmount] = useState<string>("1");
  const [desiredDose, setDesiredDose] = useState<string>("250");
  const [result, setResult] = useState<string | null>(null);

  const calculateDosage = (e: React.FormEvent) => {
    e.preventDefault();
    const vial = parseFloat(vialAmount);
    const solvent = parseFloat(solventAmount);
    const doseMcg = parseFloat(desiredDose);

    if (vial && solvent && doseMcg) {
      // Concentration in mcg/mL
      const concentration = (vial * 1000) / solvent;
      // Volume to draw in mL
      const volumeToDraw = doseMcg / concentration;
      // Units on a 100-unit syringe
      const units = volumeToDraw * 100;
      setResult(units.toFixed(1));
    }
  };

  return (
    <section className="py-12 px-4 bg-[#F9FAFB]">
      <div className="max-w-[440px] mx-auto bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#E5E7EB] p-6 text-center">
        <h2 className="text-[28px] font-semibold leading-[1.2] text-black mb-6 uppercase tracking-tight">
          PEPTIDE DOSAGE CALCULATOR
        </h2>

        <form onSubmit={calculateDosage} className="space-y-6 text-left">
          {/* Input 1 */}
          <div className="space-y-2">
            <label
              htmlFor="vial-amount"
              className="block text-[14px] font-bold text-black"
            >
              1. Amount of Peptide in Vial (mg):
            </label>
            <input
              id="vial-amount"
              type="number"
              value={vialAmount}
              onChange={(e) => setVialAmount(e.target.value)}
              className="w-full h-[44px] px-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[16px] text-black focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
          </div>

          {/* Input 2 */}
          <div className="space-y-2">
            <label
              htmlFor="solvent-amount"
              className="block text-[14px] font-bold text-black"
            >
              2. Amount of Solvent (ml):
            </label>
            <input
              id="solvent-amount"
              type="number"
              value={solventAmount}
              onChange={(e) => setSolventAmount(e.target.value)}
              className="w-full h-[44px] px-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[16px] text-black focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
          </div>

          {/* Input 3 */}
          <div className="space-y-2">
            <label
              htmlFor="desired-dose"
              className="block text-[14px] font-bold text-black"
            >
              3. Desired Research Dose (mcg):
            </label>
            <input
              id="desired-dose"
              type="number"
              value={desiredDose}
              onChange={(e) => setDesiredDose(e.target.value)}
              className="w-full h-[44px] px-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[16px] text-black focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full h-[48px] bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-md transition-colors duration-200 text-[16px]"
          >
            Calculate Dosage
          </button>
        </form>

        {/* Result Message Area */}
        <div className="mt-6 min-h-[50px] flex items-center justify-center border-l-4 border-[#3b82f6] bg-[#F3F7FF] p-4 text-left">
          <p className="text-[14px] text-[#4b5563] leading-snug">
            {result ? (
              <>
                For a <span className="font-bold text-black">{desiredDose}mcg</span> dose, draw to{" "}
                <span className="font-bold text-black">{result} units</span> on a 100-unit syringe.
              </>
            ) : (
              "Enter your research parameters above to see the result."
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PeptideDosageForm;