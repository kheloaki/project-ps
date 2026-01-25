import React from 'react';

const CalculationReferenceTable = () => {
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
    <section className="py-16 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h2 className="text-[28px] font-semibold leading-[1.2] text-black mb-4 uppercase tracking-tight">
            QUICK REFERENCE: EXAMPLE CALCULATION TABLE
          </h2>
          <p className="text-[16px] text-[#4b5563] font-normal leading-[1.6]">
            Here are some common examples to illustrate how the math works in a research setting:
          </p>
        </div>

        <div className="overflow-x-auto ring-1 ring-gray-200 rounded-lg">
          <table className="w-full border-collapse bg-white text-left text-sm">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 font-bold text-[14px] uppercase tracking-wider border-r border-gray-800">
                  VIAL (MG)
                </th>
                <th className="p-4 font-bold text-[14px] uppercase tracking-wider border-r border-gray-800">
                  SOLVENT (ML)
                </th>
                <th className="p-4 font-bold text-[14px] uppercase tracking-wider border-r border-gray-800">
                  TARGET DOSE (MCG)
                </th>
                <th className="p-4 font-bold text-[14px] uppercase tracking-wider border-r border-gray-800">
                  CONCENTRATION (MCG/ML)
                </th>
                <th className="p-4 font-bold text-[14px] uppercase tracking-wider border-r border-gray-800">
                  UNITS TO DRAW
                </th>
                <th className="p-4 font-bold text-[14px] uppercase tracking-wider">
                  DOSES/VIAL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr 
                  key={index} 
                  className={index % 2 === 1 ? 'bg-[#f9fafb]' : 'bg-white'}
                >
                  <td className="p-4 text-[14px] font-medium text-black border-r border-gray-100 italic">
                    {row.vial}
                  </td>
                  <td className="p-4 text-[14px] text-gray-700 border-r border-gray-100">
                    {row.solvent}
                  </td>
                  <td className="p-4 text-[14px] text-gray-700 border-r border-gray-100">
                    {row.targetDose}
                  </td>
                  <td className="p-4 text-[14px] text-gray-700 border-r border-gray-100">
                    {row.concentration}
                  </td>
                  <td className="p-4 text-[14px] text-gray-700 border-r border-gray-100 font-semibold">
                    {row.units}
                  </td>
                  <td className="p-4 text-[14px] text-gray-700">
                    {row.doses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Call to Action Box - Integrating as per layout preservation */}
        <div className="mt-12 p-8 bg-[#f3f4f6] rounded-xl text-center border border-gray-200">
          <h3 className="text-[20px] font-bold text-black mb-3">
            NEED HIGH-PURITY PEPTIDES FOR YOUR RESEARCH?
          </h3>
          <p className="text-[14px] text-gray-600 mb-6 max-w-2xl mx-auto">
            Ensure your experimental data is accurate with our third-party tested, &gt;99% purity peptides. Certificates of Analysis available.
          </p>
          <a 
            href="/collections/all" 
            className="inline-block bg-[#059669] hover:bg-[#047857] text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 uppercase text-sm tracking-wide"
          >
            Browse Our Research Catalog
          </a>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-8 p-4 bg-[#fee2e2] rounded-md border border-[#fecaca]">
          <p className="text-[12px] leading-[1.6] text-[#991b1b] font-medium">
            <strong>Disclaimer: For Research Use Only.</strong> This tool is provided for informational and laboratory convenience purposes only. All calculations should be verified by a qualified laboratory professional. The products sold by Peptides Skin are strictly for in-vitro research and are not for human or veterinary use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalculationReferenceTable;