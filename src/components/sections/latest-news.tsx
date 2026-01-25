import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';

export default function LatestNews() {
  // Get the 3 most recent blog posts
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="bg-white py-[60px] md:py-[80px] border-t border-[#e0e0e0]">
      <div className="container px-[30px] mx-auto max-w-[1230px]">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] uppercase tracking-[0.1em] font-display text-[#121212] mb-4">
            Latest News
          </h2>
          <Link 
            href="/blogs/news" 
            className="text-[14px] font-medium uppercase tracking-[0.08em] text-[#8A773E] hover:underline"
          >
            View all posts
          </Link>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[40px]">
          {latestPosts.map((post) => (
            <div key={post.slug} className="blog-card group">
              {/* Image Wrapper */}
              <Link href={`/blogs/news/${post.slug}`} className="block overflow-hidden border border-[#e0e0e0] mb-5">
                <div className="relative aspect-[16/9] w-full bg-[#f3f3f3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-600 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="blog-card__content text-center">
                <Link href={`/blogs/news/${post.slug}`} className="block group">
                  <h3 className="text-[20px] font-semibold leading-[1.2] uppercase mb-3 text-[#121212] tracking-normal hover:text-[#8A773E] transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-[14px] text-[#616161] leading-[1.5] mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <Link 
                  href={`/blogs/news/${post.slug}`} 
                  className="inline-block text-[12px] font-normal italic text-[#bf3f3f] hover:underline transition-all"
                >
                  Read more...
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
