"use client";

import Image from 'next/image';

/**
 * BlogFeaturedImage component clones the large featured image section
 * displaying peptide vials with Peptides Skin branding.
 * Reference assets and computed styles for pixel-perfect accuracy.
 */
export default function BlogFeaturedImage() {
  const featuredImageSrc = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/reta-peptide-peptideskin-2.webp";
  const altText = "Three Peptides Skin vials: RETA (Retatrutide) 30 MG, another peptide, and bacteriostatic water";

  return (
    <div className="w-full flex justify-center">
      {/* 
          Container constraints: "page-width-narrow" 
          Based on the high-level design, main blog content is centered and narrow.
          The narrow container is typically around 800px-1000px for blog reading.
          The layout structure shows 'blog-post-featured-image' block inside a content wrapper.
      */}
      <div className="w-full max-w-[1200px] px-6 lg:px-12 mx-auto">
        <div 
          className="blog-post-featured-image blog-post-featured-image--height-fit"
          style={{
            marginTop: '2rem',
            marginBottom: '3rem',
          }}
        >
          <div className="relative overflow-hidden w-full h-auto">
            <Image
              src={featuredImageSrc}
              alt={altText}
              width={1536}
              height={1024}
              priority
              className="w-full h-auto block object-cover border-style"
              style={{
                border: '1px solid #E0E0E0', // Visual effects requirement
                borderRadius: '0px', // Clinical/Industrial look
              }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Replicating specific spacing and styles from the original theme */
        .page-width-narrow {
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .border-style {
          border: 1px solid var(--color-border, #e0e0e0);
        }

        .blog-post-featured-image {
          position: relative;
          display: block;
        }

        .blog-post-featured-image__image {
          max-width: 100%;
          height: auto;
        }

        /* Subtle hover effect mentioned in class names of original body */
        .card-hover-effect-subtle-zoom img:hover {
          transition: transform 0.5s ease;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}