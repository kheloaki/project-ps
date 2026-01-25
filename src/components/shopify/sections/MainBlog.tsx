"use client";

import React from 'react';
import Image from 'next/image';
import { blogPosts } from '@/data/blog-posts';

interface MainBlogProps {
  settings: {
    color_scheme?: string;
    padding_block_start?: number;
    padding_block_end?: number;
  };
}

export function MainBlog({ settings }: MainBlogProps) {
  return (
    <section 
      className="py-16 md:py-24 bg-[#f5f5f5]"
      style={{
        paddingTop: settings.padding_block_start ? `${settings.padding_block_start}px` : undefined,
        paddingBottom: settings.padding_block_end ? `${settings.padding_block_end}px` : undefined,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-[32px] md:text-[48px] font-bold text-black uppercase tracking-tight">
            News & Research
          </h1>
          <p className="text-[14px] text-[#666666] mt-4 max-w-2xl">
            Latest news, scientific research, and updates from Peptides Skin. Explore our clinical-grade peptide studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="group bg-white border border-[#e0e0e0] flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <a href={`/blogs/news/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                  {post.category}
                </div>
              </a>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="text-[11px] font-medium text-[#666666] uppercase tracking-widest mb-3">
                  {post.date}
                </div>
                <h2 className="text-[18px] font-bold text-black leading-tight mb-4 group-hover:text-[#666666] transition-colors">
                  <a href={`/blogs/news/${post.slug}`}>{post.title}</a>
                </h2>
                <p className="text-[13px] text-[#666666] line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>
                <a 
                  href={`/blogs/news/${post.slug}`} 
                  className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-black pb-1 w-fit hover:opacity-70 transition-opacity"
                >
                  Read More
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
