import React from 'react';
import Image from 'next/image';

interface CoAResourceSectionProps {
  coaImageUrl?: string;
}

/**
 * CoAResourceSection Component
 * Displays the Certificate of Analysis (COA) image and Resource disclaimer sections.
 */
const CoAResourceSection: React.FC<CoAResourceSectionProps> = ({ coaImageUrl }) => {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 border-t border-border mt-8">
      <div className="flex flex-col gap-12">
        
        {/* Certificate of Analysis (COA) Section - only show if image is uploaded */}
        {coaImageUrl && (
          <div className="flex flex-col gap-8 md:gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#09121F] leading-tight mb-6">
                Certificate of Analysis (COA)
              </h2>
            </div>
            <div className="w-full flex justify-center px-4">
              <div className="relative w-full max-w-[1200px] bg-white border-2 border-[#E5E7EB] rounded-lg overflow-hidden shadow-xl group cursor-pointer">
                <a
                  href={coaImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  {/* Display image at natural size - responsive on all devices */}
                  <img
                    src={coaImageUrl}
                    alt="Certificate of Analysis"
                    className="block w-full h-auto"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-[#09121F]/0 group-hover:bg-[#09121F]/5 transition-colors duration-200 pointer-events-none" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Resource Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-32">
          <div className="md:w-1/4">
            <h2 className="text-xl font-semibold text-[#09121F] leading-tight">
              Resource
            </h2>
          </div>
          <div className="md:w-3/4">
            <div className="text-sm md:text-base text-[#4B5563] leading-relaxed max-w-2xl">
              <p>
                All products on this site are for research and development use only. 
                Products are not for human consumption of any kind. 
                The statements made on this website have not been evaluated by the 
                US Food and Drug Administration....{' '}
                <button className="text-[#09121F] font-semibold hover:underline cursor-pointer">
                  more
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoAResourceSection;

