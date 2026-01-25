"use client";

import React, { useState } from 'react';
import { Beaker, Syringe, Info } from 'lucide-react';

const PeptideGuideContent = () => {
  const [vialAmount, setVialAmount] = useState<string>('10');
  const [solventAmount, setSolventAmount] = useState<string>('1');
  const [desiredDose, setDesiredDose] = useState<string>('250');
  const [showResult, setShowResult] = useState<boolean>(false);

  const calculateDose = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  const getDoseResult = () => {
    const vial = parseFloat(vialAmount);
    const solvent = parseFloat(solventAmount);
    const doseCg = parseFloat(desiredDose);
    
    if (isNaN(vial) || isNaN(solvent) || isNaN(doseCg) || vial === 0 || solvent === 0) return null;
    
    const concentration = (vial * 1000) / solvent; // mcg/mL
    const volumeToDraw = doseCg / concentration; // mL
    const units = volumeToDraw * 100; // Units (U-100)
    
    return units.toFixed(1);
  };

  return (
    <div className="bg-[#f4f6f8] text-[#000000] font-sans">
      <div className="container mx-auto px-5 py-[60px] max-w-[1200px]">
        {/* PEPTIDE DOSAGE CALCULATOR - SIMPLE FORM */}
        <section className="mb-[80px] flex flex-col items-center">
          <h2 className="text-center text-[32px] font-bold uppercase mb-[30px] tracking-tight">
            PEPTIDE DOSAGE CALCULATOR
          </h2>
          
          <div className="bg-white rounded-[12px] p-[30px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] w-full max-w-[600px] border border-[#d1d5db]">
            <form onSubmit={calculateDose} className="space-y-[20px]">
              <div>
                <label className="block text-[14px] font-semibold mb-2">1. Amount of Peptide in Vial (mg):</label>
                <input 
                  type="text" 
                  value={vialAmount}
                  onChange={(e) => setVialAmount(e.target.value)}
                  className="w-full p-[12px] border border-[#d1d5db] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#132145]"
                />
              </div>
              <div>
                <label className="block text-[14px] font-semibold mb-2">2. Amount of Solvent (ml):</label>
                <input 
                  type="text" 
                  value={solventAmount}
                  onChange={(e) => setSolventAmount(e.target.value)}
                  className="w-full p-[12px] border border-[#d1d5db] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#132145]"
                />
              </div>
              <div>
                <label className="block text-[14px] font-semibold mb-2">3. Desired Research Dose (mcg):</label>
                <input 
                  type="text" 
                  value={desiredDose}
                  onChange={(e) => setDesiredDose(e.target.value)}
                  className="w-full p-[12px] border border-[#d1d5db] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#132145]"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#132145] text-white py-[14px] rounded-[4px] font-semibold uppercase hover:bg-opacity-90 transition-colors"
              >
                Calculate Dosage
              </button>
            </form>

            <div className={`mt-6 p-4 border-l-4 border-[#132145] bg-[#f4f6f8] transition-all ${showResult ? 'opacity-100' : 'opacity-80'}`}>
              <p className="text-[14px] font-medium text-[#132145]">
                {showResult ? (
                  <>Draw syringe to: <span className="font-bold text-[18px] text-[#e9b330]">{getDoseResult()} units</span> on a 1ml U-100 syringe.</>
                ) : (
                  "Enter your research parameters above to see the result."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* EDUCATIONAL CONTENT */}
        <section className="space-y-[40px] max-w-[900px] mx-auto">
          <div>
            <h2 className="text-[32px] font-bold uppercase mb-[20px] leading-[1.2]">
              A COMPREHENSIVE GUIDE TO PEPTIDE CALCULATION FOR RESEARCHERS
            </h2>
            <p className="text-[16px] leading-[1.6] text-[#4b5563]">
              Our free online peptide calculator is a crucial tool for laboratory professionals, designed to ensure accuracy and precision in experimental setups. This guide explains the principles behind peptide reconstitution and dosing for in-vitro research applications.
            </p>
          </div>

          <div>
            <h3 className="text-[24px] font-bold uppercase mb-[20px]">
              THE SCIENCE BEHIND THE CALCULATION
            </h3>
            <p className="text-[16px] leading-[1.6] text-[#4b5563] mb-[15px]">
              Accurate lab work depends on understanding the formulas. Our tool automates standard laboratory math:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4b5563]">
              <li><strong>Concentration (mcg/mL)</strong> = (Vial Mass in mg × 1000) ÷ Solvent Volume in mL</li>
              <li><strong>Volume to Draw (mL)</strong> = Target Dose in mcg ÷ Concentration in mcg/mL</li>
              <li><strong>Units on Syringe</strong> = Volume to Draw in mL × 100</li>
            </ul>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#4b5563]">
              This ensures that every dose in your experiment is consistent and reproducible, which is fundamental for valid scientific data.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-[24px] font-bold uppercase">Advanced Calculations & Specific Peptides</h3>
            
            <div className="space-y-4">
              <h4 className="text-[20px] font-bold uppercase">USING THE PEPTIDE CONCENTRATION CALCULATOR</h4>
              <p className="text-[16px] leading-[1.6] text-[#4b5563]">
                The first step in any protocol is determining the solution's strength. Our tool functions as a peptide concentration calculator by showing you the exact amount of peptide in mcg per ml after reconstitution. This is a critical value for ensuring your experimental results are reproducible.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[20px] font-bold uppercase">USING THE PEPTIDE SYRINGE CALCULATOR</h4>
              <p className="text-[16px] leading-[1.6] text-[#4b5563]">
                Once you know the concentration, you need to measure a precise volume. As a peptide syringe calculator, our tool converts your target microgram dose into the exact number of units to draw on a standard 100-unit/1ml insulin syringe, eliminating guesswork and reducing the risk of error.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[20px] font-bold uppercase">RETATRUTIDE DOSAGE CALCULATOR FOR METABOLIC STUDIES</h4>
              <p className="text-[16px] leading-[1.6] text-[#4b5563]">
                For advanced metabolic research, a precise Retatrutide dosage calculator is indispensable. Given Retatrutide's potency, accuracy is key. For a 10mg vial of our research-grade Retatrutide reconstituted with 1ml of solvent, a 1000mcg (1mg) dose for your experiment would require drawing exactly 10 units.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[20px] font-bold uppercase">SEMAGLUTIDE DOSAGE CALCULATOR FOR GLYCEMIC RESEARCH</h4>
              <p className="text-[16px] leading-[1.6] text-[#4b5563]">
                When studying glycemic control pathways, using a Semaglutide dosage calculator ensures consistency. For a 5mg vial of high-purity Semaglutide mixed with 1ml of bacteriostatic water, a common initial research dose of 250mcg corresponds to 5 units on the syringe.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[20px] font-bold uppercase">TIRZEPATIDE DOSAGE CALCULATOR FOR DUAL-AGONIST RESEARCH</h4>
              <p className="text-[16px] leading-[1.6] text-[#4b5563]">
                When studying dual GIP/GLP-1 receptor agonists, a precise Tirzepatide dosage calculator is essential. For a 10mg vial of Tirzepatide reconstituted with 2ml of bacteriostatic water, a research dose of 500mcg requires drawing 10 units.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[20px] font-bold uppercase">BPC-157 DOSAGE CALCULATOR FOR CELLULAR STUDIES</h4>
              <p className="text-[16px] leading-[1.6] text-[#4b5563]">
                For cellular repair or angiogenesis studies, our tool serves as an effective BPC-157 dosage calculator. A common research dose of 250mcg from a 5mg vial of BPC-157 mixed with 1ml of solvent corresponds to exactly 5 units.
              </p>
            </div>
          </div>
        </section>

        {/* DATA TABLE */}
        <section className="mt-[60px]">
          <h3 className="text-[24px] font-bold uppercase mb-[20px] text-center">
            QUICK REFERENCE: EXAMPLE CALCULATION TABLE
          </h3>
          <p className="text-center text-[#6b7280] text-[14px] mb-6">Here are some common examples to illustrate how the math works in a research setting:</p>
          
          <div className="overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider border-r border-gray-700">VIAL (MG)</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider border-r border-gray-700">SOLVENT (ML)</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider border-r border-gray-700">TARGET DOSE (MCG)</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider border-r border-gray-700">CONCENTRATION (MCG/ML)</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider border-r border-gray-700">UNITS TO DRAW</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider">DOSES/VIAL</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                <tr className="border-b border-[#d1d5db]">
                  <td className="p-4 border-r border-[#d1d5db]">10mg Retatrutide</td>
                  <td className="p-4 border-r border-[#d1d5db]">1 mL</td>
                  <td className="p-4 border-r border-[#d1d5db]">1000 mcg</td>
                  <td className="p-4 border-r border-[#d1d5db]">10,000</td>
                  <td className="p-4 border-r border-[#d1d5db]">10</td>
                  <td className="p-4">10</td>
                </tr>
                <tr className="bg-[#f9fafb] border-b border-[#d1d5db]">
                  <td className="p-4 border-r border-[#d1d5db]">5mg Semaglutide</td>
                  <td className="p-4 border-r border-[#d1d5db]">1 mL</td>
                  <td className="p-4 border-r border-[#d1d5db]">250 mcg</td>
                  <td className="p-4 border-r border-[#d1d5db]">5,000</td>
                  <td className="p-4 border-r border-[#d1d5db]">5</td>
                  <td className="p-4">20</td>
                </tr>
                <tr className="border-b border-[#d1d5db]">
                  <td className="p-4 border-r border-[#d1d5db]">10mg Tirzepatide</td>
                  <td className="p-4 border-r border-[#d1d5db]">2 mL</td>
                  <td className="p-4 border-r border-[#d1d5db]">500 mcg</td>
                  <td className="p-4 border-r border-[#d1d5db]">5,000</td>
                  <td className="p-4 border-r border-[#d1d5db]">10</td>
                  <td className="p-4">20</td>
                </tr>
                <tr className="bg-[#f9fafb] border-b border-[#d1d5db]">
                  <td className="p-4 border-r border-[#d1d5db]">5mg BPC-157</td>
                  <td className="p-4 border-r border-[#d1d5db]">1 mL</td>
                  <td className="p-4 border-r border-[#d1d5db]">250 mcg</td>
                  <td className="p-4 border-r border-[#d1d5db]">5,000</td>
                  <td className="p-4 border-r border-[#d1d5db]">5</td>
                  <td className="p-4">20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA BOX */}
        <section className="mt-[60px] bg-[#f4f6f8] p-[30px] rounded-[12px] border border-[#d1d5db] text-center">
          <h3 className="text-[20px] font-bold uppercase mb-[10px]">NEED HIGH-PURITY PEPTIDES FOR YOUR RESEARCH?</h3>
          <p className="text-[16px] text-[#4b5563] mb-[20px]">
            Ensure your experimental data is accurate with our third-party tested, &gt;99% purity peptides. Certificates of Analysis available.
          </p>
          <a 
            href="/collections/all" 
            className="inline-block bg-[#15803d] text-white px-[32px] py-[12px] rounded-[4px] font-bold uppercase hover:bg-opacity-90 transition-all text-[14px]"
          >
            Browse Our Research Catalog
          </a>
        </section>

        {/* FINAL DISCLAIMER */}
        <div className="mt-[40px] bg-[#fee2e2] border border-[#fecaca] p-4 rounded-[4px]">
          <p className="text-[#991b1b] text-[13px] font-medium leading-[1.4]">
            <strong>Disclaimer: For Research Use Only.</strong> This tool is provided for informational and laboratory convenience purposes only. All calculations should be verified by a qualified laboratory professional. The products sold by Peptides Skin are strictly for in-vitro research and are not for human or veterinary use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeptideGuideContent;
