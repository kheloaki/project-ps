import React from 'react';
import { Metadata } from 'next';
import { SectionRenderer } from "@/components/shopify/SectionRenderer";
import articleTemplate from "@/data/shopify/templates/article.json";
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/db/blog';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    id: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPostBySlug(id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Use ogImage if available, otherwise use cover image
  const imageUrl = post.ogImage || post.image;
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://peptidesskin.com${imageUrl}`;

  return {
      title: `${post.title} | Peptides Skin`,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags?.join(", "),
      alternates: {
        canonical: `https://peptidesskin.com/blogs/news/${id}`,
      },
      openGraph: {
        title: post.title,
        description: post.metaDescription || post.excerpt,
        url: `https://peptidesskin.com/blogs/news/${id}`,
        siteName: 'Peptides Skin',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: post.alt || post.title,
          },
        ],
        type: 'article',
        publishedTime: post.publishedDate ? new Date(post.publishedDate).toISOString() : new Date(post.date).toISOString(),
        section: post.category,
        tags: post.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription || post.excerpt,
        images: [fullImageUrl],
      },
    };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbPost = await getBlogPostBySlug(id);

  if (!dbPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5]">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <a href="/blogs/news" className="text-[#0e83a4] hover:underline">Return to News</a>
      </div>
    );
  }

  // Transform database post to match expected format
  const post = {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    image: dbPost.image,
    ogImage: dbPost.ogImage || dbPost.image, // Use ogImage if available
    alt: dbPost.alt || dbPost.title,
    category: dbPost.category,
    date: new Date(dbPost.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase(),
    publishedDate: dbPost.publishedDate,
    metaDescription: dbPost.metaDescription || dbPost.excerpt,
    tags: dbPost.tags || [],
    content: dbPost.content,
    faqs: dbPost.faqs as Array<{ question: string; answer: string }> | undefined,
  };

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

