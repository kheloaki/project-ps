"use client";

import React from 'react';
import Image from 'next/image';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  isFeatured?: boolean;
}

interface BlogGridMainProps {
  posts: BlogPost[];
}

const BlogCard = ({ post }: { post: BlogPost }) => {
  const isFeatured = post.isFeatured;
  const link = `/blogs/news/${post.slug}`;

  return (
    <div className={`group mb-8 ${isFeatured ? 'col-span-1 md:col-span-3 lg:col-span-3 flex flex-col md:flex-row gap-8' : 'col-span-1'}`}>
      <figure 
        className={`relative overflow-hidden border border-[#e5e5e5] ${isFeatured ? 'md:w-[65%]' : 'w-full'}`}
        {...((post as any).imageCaption && { 'data-image-caption': (post as any).imageCaption })}
        {...((post as any).seoFilename && { 'data-seo-filename': (post as any).seoFilename })}
      >
        <a href={link} className="block aspect-[16/9]">
          <Image
            src={post.image}
            alt={post.alt || post.title}
            title={post.title}
            fill
            className="object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
            data-image-alt={post.alt || post.title}
            data-image-title={post.title}
            {...((post as any).imageCaption && { 'data-image-caption': (post as any).imageCaption })}
            {...((post as any).seoFilename && { 'data-seo-filename': (post as any).seoFilename })}
          />
        </a>
      </figure>
      <div className={`${isFeatured ? 'md:w-[35%] flex flex-col justify-start' : 'mt-[15px]'}`}>
        <a href={link} className="block decoration-0">
          <h3 className="text-[20px] font-semibold leading-[1.3] uppercase mb-2.5 mt-0 tracking-tight text-black">
            {post.title}
          </h3>
        </a>
        <p className="text-[14px] leading-[1.6] text-[#757575] mb-4">
          {post.excerpt.length > 200 ? post.excerpt.substring(0, 200) + '...' : post.excerpt}
          <a href={link} className="ml-1 text-[#d11a2a] hover:underline whitespace-nowrap">
            Read more...
          </a>
        </p>
      </div>
    </div>
  );
};

export default function BlogGridMain({ posts }: BlogGridMainProps) {
  const blogPosts: BlogPost[] = posts.map((post, index) => ({
    ...post,
    isFeatured: index === 0,
  }));

  const featuredPost = blogPosts.find(p => p.isFeatured);
  const coreGridPosts = blogPosts.filter(p => !p.isFeatured);

  const row1 = coreGridPosts.slice(0, 2);
  const remaining = coreGridPosts.slice(2);

  return (
    <section className="bg-white py-[60px]">
      <div className="container px-[40px] max-w-[1400px] mx-auto">
        <h1 className="text-[48px] font-semibold leading-[1.1] uppercase tracking-[-0.02em] mb-12 text-black border-b border-[#e5e5e5] pb-8">
          News
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {featuredPost && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
              <BlogCard post={featuredPost} />
            </div>
          )}

          <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-[30px] lg:col-start-1">
             {row1.map((post, idx) => (
               <BlogCard key={idx} post={post} />
             ))}
          </div>
          <div className="hidden lg:block"></div>

          {remaining.map((post, idx) => (
            <BlogCard key={idx} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
