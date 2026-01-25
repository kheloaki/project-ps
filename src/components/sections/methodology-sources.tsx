import React from 'react';

/**
 * MethodologySources Component
 * 
 * Clones the "METHODOLOGY & SOURCES" dark-themed information box containing 
 * scientific formulas for volume calculation and a numbered list of research references.
 * 
 * This component adheres strictly to the light theme requirement from the prompt 
 * (as in the light theme page uses this dark blue box as a primary contrast element).
 */

const MethodologySources: React.FC = () => {
  return (
    <section 
      className="container mx-auto px-5 mb-[60px]" 
      aria-labelledby="methodology-title"
    >
      <div className="bg-[#132145] rounded-[12px] p-[20px] md:p-[30px] text-white overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]">
        <h2 
          id="methodology-title" 
          className="text-[18px] font-semibold leading-[1.4] uppercase tracking-wider mb-4 border-b border-white/10 pb-3"
        >
          METHODOLOGY &amp; SOURCES
        </h2>

        <div className="space-y-6">
          {/* Scientific Formulas Section */}
          <div className="text-[14px] leading-[1.6] text-white/90">
            <p className="mb-2">
              Volume per dose is computed as: <code className="bg-black/20 px-1 rounded text-accent-yellow">mL = dose (mg) ÷ concentration (mg/mL)</code>. 
              Insulin syringes (U-100) display 100 units per mL, so <code className="bg-black/20 px-1 rounded text-accent-yellow">units = mL × 100</code>.
            </p>
            <p>
              Doses per vial: <code className="bg-black/20 px-1 rounded text-accent-yellow">vial strength (mg) ÷ dose (mg)</code>. 
              Concentration: <code className="bg-black/20 px-1 rounded text-accent-yellow">vial strength (mg) ÷ diluent volume (mL)</code>.
            </p>
          </div>

          {/* Research References List */}
          <ol className="list-decimal list-inside space-y-2.5 text-[13px] leading-[1.5] text-white/80">
            <li className="pl-1">
              U-100 conversion overview (1 mL = 100 units):{' '}
              <a 
                href="#" 
                className="text-[#e9b330] hover:underline transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Defy Medical - How to read an insulin syringe
              </a>
            </li>
            <li className="pl-1">
              Another reference on U-100 units/mL:{' '}
              <a 
                href="#" 
                className="text-[#e9b330] hover:underline transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                PetPlace - U-100 insulin conversion
              </a>
            </li>
            <li className="pl-1">
              Basic concentration (mg/mL) &amp; dilution principles:{' '}
              <a 
                href="#" 
                className="text-[#e9b330] hover:underline transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                PharmaCalculation - Concentration &amp; dilution
              </a>
            </li>
            <li className="pl-1">
              Definition/usage of bacteriostatic water for reconstitution:{' '}
              <a 
                href="#" 
                className="text-[#e9b330] hover:underline transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                PeptideSystems - What is bacteriostatic water?
              </a>
            </li>
            <li className="pl-1">
              Comparable peptide calculators (for parity check only):{' '}
              <a 
                href="#" 
                className="text-[#e9b330] hover:underline transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                PepDraw
              </a>,{' '}
              <a 
                href="#" 
                className="text-[#e9b330] hover:underline transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Jay Campbell
              </a>,{' '}
              <a 
                href="#" 
                className="text-[#e9b330] hover:underline transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                DirectVision Labs
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default MethodologySources;