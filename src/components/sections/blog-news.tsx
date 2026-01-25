import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * BlogNewsSection Component
 * 
 * Clones the blog and news section that links to research articles and updates
 * regarding high-purity peptides. Uses the site's typography, grid layouts,
 * and scientific-medical aesthetic as defined in the global design system.
 */

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Science of High-Purity Retatrutide in Research",
    excerpt: "Exploring the experimental applications and pharmacological profile of Retatrutide (LY3437943) in laboratory settings.",
    date: "October 24, 2023",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptidesskin_peptide-reta-2.webp",
    url: "/blogs/news/science-high-purity-reta",
  },
  {
    id: 2,
    title: "Understanding Peptide Reconstitution Protocols",
    excerpt: "Best practices for handling research peptides, including storage temperatures and reconstitution with Bacteriostatic Water.",
    date: "September 12, 2023",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptidesskin_peptide-reta-2.webp",
    url: "/blogs/news/peptide-reconstitution-protocols",
  },
  {
    id: 3,
    title: "BPC-157 and TB-500: Synergistic Research Applications",
    excerpt: "A look into why these two sequences are frequently studied together in tissue repair and musculoskeletal research models.",
    date: "August 05, 2023",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptidesskin_peptide-reta-2.webp",
    url: "/blogs/news/bpc-157-tb-500-synergy",
  }
];

const BlogNewsSection: React.FC = () => {
  return (
    <section 
      id="blog-news-section" 
      className="bg-[#F5F5F5] py-[60px] md:py-[80px] border-t border-[#CCCCCC]"
    >
      <div className="container mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-[#121826] text-[32px] font-bold uppercase tracking-tight leading-tight">
              Research & News
            </h2>
            <div className="h-1 w-12 bg-[#118199] mt-2"></div>
          </div>
          <Link 
            href="/blogs/news" 
            className="text-[12px] font-semibold uppercase tracking-widest text-[#118199] hover:underline transition-all duration-300"
          >
            View all articles
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id} 
              className="group bg-white rounded-lg overflow-hidden border border-[#CCCCCC] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <Link href={post.url} className="block relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
              </Link>

              <div className="p-6 flex flex-col h-full min-h-[220px]">
                <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider mb-2">
                  {post.date}
                </span>
                
                <h3 className="text-[#121826] text-[18px] font-bold uppercase tracking-tight leading-snug mb-3 group-hover:text-[#118199] transition-colors duration-300">
                  <Link href={post.url}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-[#121826]/70 text-[14px] leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                  <Link 
                    href={post.url}
                    className="inline-flex items-center text-[12px] font-bold uppercase tracking-widest text-[#121826] relative overflow-hidden"
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-[#118199]">
                      Read Article
                    </span>
                    <svg 
                      className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Scientific Disclaimer / Footer of Section */}
        <div className="mt-16 pt-8 border-t border-[#CCCCCC]/50 text-center">
          <p className="text-[#737373] text-[12px] italic max-w-2xl mx-auto leading-loose">
            Note: All articles and research updates provided are for informational purposes only. Peptides marketed on this site are intended for laboratory research use only and are not for human consumption or therapeutic use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogNewsSection;