import React from 'react';

const ResearchCTA = () => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="container max-w-[1200px] mx-auto space-y-8">
        {/* Main CTA Block */}
        <div className="bg-[#f3f4f6] rounded-[16px] p-10 md:p-14 text-center shadow-sm max-w-[800px] mx-auto border border-border">
          <h2 className="text-[28px] font-bold text-black mb-4 tracking-tight leading-tight">
            NEED HIGH-PURITY PEPTIDES FOR YOUR RESEARCH?
          </h2>
          <p className="text-[16px] text-gray-600 mb-8 max-w-[600px] mx-auto leading-relaxed">
            Ensure your experimental data is accurate with our third-party tested, {'>'}99% purity peptides. Certificates of Analysis available.
          </p>
          <a
            href="/collections/all"
            className="inline-block bg-[#1b7e40] hover:bg-[#156332] text-white font-semibold px-10 py-4 rounded-[4px] transition-colors duration-200 uppercase text-[15px] tracking-wide"
          >
            Browse Our Research Catalog
          </a>
        </div>

        {/* Red Disclaimer Box */}
        <div className="max-w-[800px] mx-auto bg-[#fee2e2] border border-[#fecaca] rounded-[8px] p-5 text-left">
          <p className="text-[12.5px] leading-[1.6] text-[#991b1b]">
            <span className="font-bold">Disclaimer: For Research Use Only.</span> This tool is provided for informational and laboratory convenience purposes only. All calculations should be verified by a qualified laboratory professional. The products sold by Peptides Skin are strictly for in-vitro research and are not for human or veterinary use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResearchCTA;