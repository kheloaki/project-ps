import React from 'react';
import Image from 'next/image';

const BlogGridTop = () => {
  const blogs = [
    {
      title: 'where to buy retatrutide',
      excerpt:
        'As researchers seek to buy Retatrutide (LY3437943), ensuring quality is critical. This comprehensive guide covers the essential factors: verifying purity with HPLC and COA, understanding its triple-agonist mechanism, and following...',
      image:
        'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/reta-peptide-peptideskin-3.webp',
      alt: 'Three Peptides Skin vials: RETA (Retatrutide) 30 MG, another peptide, and bacteriostatic water',
      link: '/blogs/news/where-to-buy-retatrutide',
    },
    {
      title: 'Buy Peptides Safely in the USA',
      excerpt:
        'Investigational research peptide targeting GLP-1, GIP, and glucagon pathways. For laboratory research use only.',
      image:
        'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/photorealistic-image-of-a-modern--clean-laboratory-4.webp',
      alt: 'A researcher in a sterile lab carefully inspects a vial of research-grade peptides, a critical step to buy peptides safely in the USA.',
      link: '/blogs/news/buy-peptides-safely-in-the-usa',
    },
  ];

  return (
    <section className="bg-white py-[30px]">
      <div className="container px-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
          {blogs.map((blog, index) => (
            <div key={index} className="blog-card group flex flex-col cursor-pointer">
              {/* Image Container */}
              <div className="blog-card-img-wrapper relative overflow-hidden aspect-[16/9] border border-[#e5e5e5]">
                <a href={blog.link} className="block w-full h-full">
                  <Image
                    src={blog.image}
                    alt={blog.alt}
                    fill
                    className="blog-card-img object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </a>
              </div>

              {/* Content Container */}
              <div className="flex flex-col pt-[15px] pb-[10px]">
                <a href={blog.link} className="no-underline">
                  <h3 className="text-[20px] font-semibold leading-[1.3] uppercase text-black m-0 mb-[10px] tracking-tight">
                    {blog.title}
                  </h3>
                </a>

                <div className="blog-post-card__content-text text-[14px] leading-[1.6] text-[#757575] font-normal">
                  {blog.excerpt}{' '}
                  <a
                    href={blog.link}
                    className="text-[#d11a2a] no-underline hover:underline transition-opacity duration-200"
                  >
                    Read more...
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogGridTop;