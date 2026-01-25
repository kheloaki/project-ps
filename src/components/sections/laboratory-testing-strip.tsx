import React from 'react';
import Image from 'next/image';

const LaboratoryTestingStrip = () => {
  const testingItems = [
    {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-powerpeptides-com/assets/svgs/hpls-testing-14.svg",
      label: "HPLC",
      subLabel: "Testing"
    },
    {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-powerpeptides-com/assets/svgs/endotoxin-assay-15.svg",
      label: "Endotoxin",
      subLabel: "Assay"
    },
    {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-powerpeptides-com/assets/svgs/tymc-test-16.svg",
      label: "TYMC",
      subLabel: "Test"
    },
    {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-powerpeptides-com/assets/svgs/tamc-test-17.svg",
      label: "TAMC",
      subLabel: "Test"
    },
    {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1dbae3aa-02e7-40b3-be9c-7301eb41335f-powerpeptides-com/assets/svgs/heavy-metal-screening-18.svg",
      label: "Heavy Metal",
      subLabel: "Screening"
    }
  ];

  return (
    <div className="w-full border-y border-[#E5E7EB] bg-[#F4F7FC]">
      <div className="container mx-auto flex items-stretch py-3 md:py-4">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          
          {/* Header Section with User Avatars and Title */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0 px-2 lg:px-0">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white shadow-sm md:h-8 md:w-8"
                >
                  <Image 
                    src={`/images/membership/join-modal/avatar-${i}.png`} 
                    alt={`Expert ${i}`}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <h2 className="text-sm font-semibold text-[#09121F] md:text-lg">
              Advanced Laboratory Testing
            </h2>
          </div>

          {/* Icons Grid Section */}
          <div className="scrollbar-hide flex flex-nowrap items-center gap-2 overflow-x-auto px-2 lg:px-0 lg:gap-4">
            {testingItems.map((item, index) => (
              <div 
                key={index}
                className="flex min-w-[100px] items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white p-1.5 shadow-sm transition-colors hover:border-[#8A773E]/30 md:min-w-[124px] md:p-2"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#F4F7FC] md:h-10 md:w-10">
                  <Image 
                    src={item.icon} 
                    alt={`${item.label} Icon`}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain md:h-7 md:w-7"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold text-[#09121F] md:text-[11px] uppercase tracking-tight">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[#4B5563] md:text-[11px]">
                    {item.subLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LaboratoryTestingStrip;

