import React from "react";
import { Metadata } from "next";
import { generateBreadcrumbSchema, generateBlogSchema } from "@/lib/schema";
import { blogPosts } from "@/data/blog-posts";
import BlogHero from "@/components/sections/blog-hero";
import BlogGridTop from "@/components/sections/blog-grid-top";
import BlogGridMain from "@/components/sections/blog-grid-main";
import BlogGridBottom from "@/components/sections/blog-grid-bottom";

export const metadata: Metadata = {
  title: "News & Research | Peptides Skin",
  description: "Latest news, scientific research, and updates from Peptides Skin. Explore our clinical-grade peptide studies.",
  alternates: {
    canonical: "/blogs/news",
  },
};

export default function BlogPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: 'https://peptidesskin.com' },
    { name: 'News', item: 'https://peptidesskin.com/blogs/news' },
  ]);

  const blogSchema = generateBlogSchema(blogPosts);

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
          <BlogGridMain />
        </main>
      </div>
    </>
  );
}
