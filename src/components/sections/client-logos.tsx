import React from 'react';
import Image from 'next/image';

/**
 * ClientLogos component
 * 
 * Features a horizontal grid of diagnostic/medical brand logos 
 * housed within rounded white card containers with soft shadows.
 * This section sits just below the hero slider as shown in the screenshots.
 */
const ClientLogos = () => {
  const logos = [
    {
      id: "medical-solutions",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/client-global-01-17.png",
      alt: "The Medical Solutions"
    },
    {
      id: "protect",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/client-global-02-19.png",
      alt: "Protect Yourself"
    },
    {
      id: "medical-health",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/client-global-03-21.png",
      alt: "Medical Health & Support"
    },
    {
      id: "doctory",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/client-global-04-23.png",
      alt: "Doctory"
    },
    {
      id: "health-care",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/client-global-05-25.png",
      alt: "Health Care"
    },
    {
      id: "hospital",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-xcare-demo-pbminfotech-com/assets/images/client-global-01-17.png", // Reusing for grid completion if 6th missing
      alt: "Hospital Healthcare"
    }
  ];

  return (
    <section className="relative z-10 -mt-[70px] pb-12 w-full">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[30px]">
          {logos.map((logo, index) => (
            <div 
              key={`${logo.id}-${index}`}
              className="bg-white rounded-[30px] flex items-center justify-center h-[140px] px-8 transition-all duration-300 ease-in-out hover:shadow-[0_15px_45px_rgba(6,26,75,0.08)] group"
              style={{
                boxShadow: "0 15px 45px rgba(6, 26, 75, 0.05)"
              }}
            >
              <div className="relative w-full h-[60px] filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;