"use client";

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { blogPosts } from '@/data/blog-posts';

interface MainBlogPostProps {
  settings: {
    color_scheme?: string;
    padding_block_start?: number;
    padding_block_end?: number;
    gap?: number;
  };
}

export function MainBlogPost({ settings }: MainBlogPostProps) {
  const params = useParams();
  const slug = params.id as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <a href="/blogs/news" className="text-[#8A773E] hover:underline mt-4 block">Back to news</a>
      </div>
    );
  }

  return (
    <article 
      className="bg-white"
      style={{
        paddingTop: settings.padding_block_start ? `${settings.padding_block_start}px` : undefined,
        paddingBottom: settings.padding_block_end ? `${settings.padding_block_end}px` : undefined,
      }}
    >
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="text-[12px] font-bold text-[#666666] uppercase tracking-[0.2em] mb-4">
            {post.category} — {post.date}
          </div>
          <h1 className="text-[32px] md:text-[44px] font-bold text-black leading-tight uppercase tracking-tight mb-8">
            {post.title}
          </h1>
          <div className="relative aspect-[16/9] w-full mb-12 overflow-hidden rounded-sm border border-[#e0e0e0]">
            <Image
              src={post.image}
              alt={post.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-w-800px) 100vw, 800px"
            />
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-bold prose-p:text-[#333333] prose-p:leading-relaxed prose-a:text-black prose-a:font-bold prose-img:rounded-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#e0e0e0] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#666666]">Share:</span>
            <div className="flex gap-3">
              <button className="w-8 h-8 rounded-full border border-[#e0e0e0] flex items-center justify-center hover:bg-black hover:text-white transition-colors">f</button>
              <button className="w-8 h-8 rounded-full border border-[#e0e0e0] flex items-center justify-center hover:bg-black hover:text-white transition-colors">t</button>
              <button className="w-8 h-8 rounded-full border border-[#e0e0e0] flex items-center justify-center hover:bg-black hover:text-white transition-colors">p</button>
            </div>
          </div>
          <a 
            href="/blogs/news" 
            className="text-[12px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 hover:opacity-70 transition-opacity"
          >
            Back to Blog
          </a>
        </footer>
      </div>
    </article>
  );
}
