import React from 'react';
import Image from 'next/image';

const CollectionHero = ({ title = "Research Peptides" }: { title?: string }) => {
  // Using the specific asset URL provided in the assets list
  const backgroundImage = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptide-skin-tirz-cagri-reta-sema-10-2.webp";

  return (
    <section className="relative w-full overflow-hidden bg-[#0b1321]">
        {/* Background Image Container */}
        <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      
      {/* Decorative Gradient Fade to Bottom (Optional, for transition to product grid) */}
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </section>
  );
};

export default CollectionHero;