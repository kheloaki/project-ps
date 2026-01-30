import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/db/blog';

/**
 * GET /api/blogs/[slug]
 * Get a blog post by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Transform to match expected format
    const transformedPost = {
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
    };

    return NextResponse.json({ post: transformedPost });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

