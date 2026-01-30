"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface MainBlogPostProps {
  settings: {
    color_scheme?: string;
    padding_block_start?: number;
    padding_block_end?: number;
    gap?: number;
  };
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  imageCaption?: string;
  seoFilename?: string;
  ogImage?: string;
  category: string;
  date: string;
  content: string;
}

export function MainBlogPost({ settings }: MainBlogPostProps) {
  const params = useParams();
  const slug = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p>Loading...</p>
      </div>
    );
  }

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
          <figure 
            className="relative aspect-[16/9] w-full mb-12 overflow-hidden rounded-sm border border-[#e0e0e0]"
            {...(post.imageCaption && { 'data-image-caption': post.imageCaption })}
            {...(post.seoFilename && { 'data-seo-filename': post.seoFilename })}
            {...(post.ogImage && { 'data-og-image': post.ogImage })}
          >
            <div className="relative w-full h-full">
              <Image
                src={post.image}
                alt={post.alt || post.title}
                title={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-w-800px) 100vw, 800px"
                data-image-alt={post.alt || post.title}
                data-image-title={post.title}
                {...(post.imageCaption && { 'data-image-caption': post.imageCaption })}
                {...(post.seoFilename && { 'data-seo-filename': post.seoFilename })}
              />
            </div>
            
            {/* Image Metadata - Visible to Google in HTML */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ImageObject",
                  "url": post.image,
                  "name": post.title,
                  "caption": post.alt || post.title,
                  "description": post.imageCaption || post.alt || post.title,
                })
              }}
            />
            
            {/* Metadata as HTML attributes - visible in page source */}
            <div className="sr-only" itemScope itemType="https://schema.org/ImageObject">
              <meta itemProp="url" content={post.image} />
              <meta itemProp="name" content={post.title} />
              <meta itemProp="caption" content={post.alt || post.title} />
              {post.imageCaption && (
                <meta itemProp="description" content={post.imageCaption} />
              )}
              {post.seoFilename && (
                <meta itemProp="encodingFormat" content={post.seoFilename} />
              )}
            </div>
            
            {/* Visible Caption - Only show if caption exists */}
            {post.imageCaption && (
              <figcaption 
                className="mt-4 text-sm text-gray-600 text-center"
                itemProp="caption"
                dangerouslySetInnerHTML={{ __html: post.imageCaption }}
              />
            )}
          </figure>
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
