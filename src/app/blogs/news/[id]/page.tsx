import React from 'react';
import { Metadata } from 'next';
import { SectionRenderer } from "@/components/shopify/SectionRenderer";
import articleTemplate from "@/data/shopify/templates/article.json";
import { blogPosts } from '@/data/blog-posts';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find((p) => p.slug === id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
      title: `${post.title} | Peptides Skin`,
      description: post.metaDescription || post.excerpt,
      keywords: (post as any).tags?.join(", "),
      alternates: {
        canonical: `/blogs/news/${id}`,
      },
      openGraph: {
        title: post.title,
        description: post.metaDescription || post.excerpt,
        url: `/blogs/news/${id}`,
        siteName: 'Peptides Skin',
        images: [
          {
            url: post.image,
            width: 1200,
            height: 630,
            alt: post.alt,
          },
        ],
        type: 'article',
        publishedTime: post.date,
        section: post.category,
        tags: (post as any).tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription || post.excerpt,
        images: [post.image],
      },
    };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.slug === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5]">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <a href="/blogs/news" className="text-[#0e83a4] hover:underline">Return to News</a>
      </div>
    );
  }

  const articleSchema = generateArticleSchema(post);
  const faqSchema = post.faqs ? generateFAQSchema(post.faqs) : null;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: 'https://peptidesskin.com' },
    { name: 'News', item: 'https://peptidesskin.com/blogs/news' },
    { name: post.title, item: `https://peptidesskin.com/blogs/news/${id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-white">
        <main>
          <SectionRenderer template={articleTemplate as any} />
        </main>
      </div>
    </>
  );
}

