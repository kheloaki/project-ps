import React from 'react';

const CalculationTable = () => {
  const tableData = [
    {
      vial: '10mg Retatrutide',
      solvent: '1 mL',
      targetDose: '1000 mcg',
      concentration: '10,000',
      units: '10',
      doses: '10',
    },
    {
      vial: '5mg Semaglutide',
      solvent: '1 mL',
      targetDose: '250 mcg',
      concentration: '5,000',
      units: '5',
      doses: '20',
    },
    {
      vial: '10mg Tirzepatide',
      solvent: '2 mL',
      targetDose: '500 mcg',
      concentration: '5,000',
      units: '10',
      doses: '20',
    },
    {
      vial: '5mg BPC-157',
      solvent: '1 mL',
      targetDose: '250 mcg',
      concentration: '5,000',
      units: '5',
      doses: '20',
    },
  ];

  return (
    <section className="py-[60px] bg-[#f4f6f8]">
      <div className="container mx-auto px-5 max-w-[1200px]">
        {/* Quick Reference Table Section */}
        <div className="mb-12">
          <h2 className="text-[32px] font-bold uppercase leading-[1.3] mb-4 text-[#000000] font-display">
            QUICK REFERENCE: EXAMPLE CALCULATION TABLE
          </h2>
          <p className="text-[16px] leading-[1.6] text-[#6b7280] mb-8 font-sans">
            Here are some common examples to illustrate how the math works in a research setting:
          </p>

          <div className="overflow-x-auto rounded-[8px] border border-[#d1d5db]">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#000000]">
                  <th className="py-3 px-4 text-left text-[11px] font-bold uppercase text-white tracking-wider border-r border-white/10 font-display">
                    VIAL (MG)
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold uppercase text-white tracking-wider border-r border-white/10 font-display">
                    SOLVENT (ML)
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold uppercase text-white tracking-wider border-r border-white/10 font-display">
                    TARGET DOSE (MCG)
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold uppercase text-white tracking-wider border-r border-white/10 font-display">
                    CONCENTRATION (MCG/ML)
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold uppercase text-white tracking-wider border-r border-white/10 font-display">
                    UNITS TO DRAW
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-bold uppercase text-white tracking-wider font-display">
                    DOSES/VIAL
                  </th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {tableData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'}
                  >
                    <td className="py-4 px-4 border-b border-[#d1d5db] border-r text-[#132145] font-medium">
                      {row.vial}
                    </td>
                    <td className="py-4 px-4 border-b border-[#d1d5db] border-r text-[#6b7280]">
                      {row.solvent}
                    </td>
                    <td className="py-4 px-4 border-b border-[#d1d5db] border-r text-[#6b7280]">
                      {row.targetDose}
                    </td>
                    <td className="py-4 px-4 border-b border-[#d1d5db] border-r text-[#6b7280]">
                      {row.concentration}
                    </td>
                    <td className="py-4 px-4 border-b border-[#d1d5db] border-r text-[#000000] font-bold">
                      {row.units}
                    </td>
                    <td className="py-4 px-4 border-b border-[#d1d5db] text-[#6b7280]">
                      {row.doses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#ffffff] rounded-[12px] p-10 border border-[#d1d5db] shadow-sm text-center mb-8">
          <h3 className="text-[24px] font-bold uppercase text-[#132145] mb-3 font-display">
            NEED HIGH-PURITY PEPTIDES FOR YOUR RESEARCH?
          </h3>
          <p className="text-[16px] text-[#6b7280] mb-8 max-w-[800px] mx-auto font-sans leading-[1.6]">
            Ensure your experimental data is accurate with our third-party tested, &gt;99% purity peptides. 
            Certificates of Analysis available.
          </p>
          <a
            href="/collections/all"
            className="inline-block bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-10 rounded-[6px] transition-colors text-[14px] uppercase tracking-wide"
          >
            Browse Our Research Catalog
          </a>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-[#fee2e2] border border-[#fecaca] rounded-[4px] p-4 text-[#991b1b]">
          <p className="text-[13px] leading-[1.5] font-medium font-sans italic">
            <strong>Disclaimer: For Research Use Only.</strong> This tool is provided for informational and laboratory convenience purposes only. 
            All calculations should be verified by a qualified laboratory professional. The products sold by Peptides Skin are strictly for 
            in-vitro research and are not for human or veterinary use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalculationTable;