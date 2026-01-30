import React from "react";
import { Metadata } from "next";
import { generateBreadcrumbSchema, generateBlogSchema } from "@/lib/schema";
import { getAllBlogPosts } from "@/lib/db/blog";
import BlogGridMain from "@/components/sections/blog-grid-main";

export const metadata: Metadata = {
  title: "News & Research | Peptides Skin",
  description: "Latest news, scientific research, and updates from Peptides Skin. Explore our clinical-grade peptide studies.",
  alternates: {
    canonical: "/blogs/news",
  },
};

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();
  
  // Transform database posts to match the expected format
  const transformedPosts = blogPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    alt: post.alt || post.title,
    imageCaption: (post as any).imageCaption || undefined,
    seoFilename: (post as any).seoFilename || undefined,
    ogImage: (post as any).ogImage || undefined,
    category: post.category,
    date: new Date(post.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase(),
    metaDescription: post.metaDescription || post.excerpt,
    tags: post.tags || [],
    content: post.content,
    faqs: post.faqs as Array<{ question: string; answer: string }> | undefined,
  }));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: 'https://peptidesskin.com' },
    { name: 'News', item: 'https://peptidesskin.com/blogs/news' },
  ]);

  const blogSchema = generateBlogSchema(transformedPosts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="min-h-screen bg-white">
        <main className="pt-[0px]">
          <BlogGridMain posts={transformedPosts} />
        </main>
      </div>
    </>
  );
}
