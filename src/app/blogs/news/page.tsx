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
  let blogPosts;
  try {
    blogPosts = await getAllBlogPosts();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback to empty array if database is unavailable during build
    blogPosts = [];
  }
  
  // Transform database posts to match the expected format
  const transformedPosts = blogPosts.map(post => {
    // Safely format date
    let formattedDate = '';
    try {
      if (post.date) {
        formattedDate = new Date(post.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }).toUpperCase();
      }
    } catch (error) {
      console.error('Error formatting date for post:', post.slug, error);
      formattedDate = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).toUpperCase();
    }

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      alt: post.alt || post.title,
      imageCaption: (post as any).imageCaption || undefined,
      seoFilename: (post as any).seoFilename || undefined,
      ogImage: (post as any).ogImage || undefined,
      category: post.category,
      date: formattedDate,
      metaDescription: post.metaDescription || post.excerpt,
      tags: post.tags || [],
      content: post.content,
      faqs: post.faqs as Array<{ question: string; answer: string }> | undefined,
    };
  });

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
