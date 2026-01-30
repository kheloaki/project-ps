import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * GET /api/admin/blog
 * Get all blog posts
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    const blogPosts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ posts: blogPosts });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blog
 * Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      slug,
      title,
      excerpt,
      content,
      image,
      alt,
      imageCaption,
      seoFilename,
      category,
      date,
      publishedDate,
      status = 'draft',
      metaTitle,
      metaDescription,
      ogImage,
      canonicalUrl,
      keywords,
      tags = [],
      faqs = [],
    } = body;

    // Validate required fields
    if (!slug || !title || !excerpt || !content || !image || !category) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            slug: !slug,
            title: !title,
            excerpt: !excerpt,
            content: !content,
            image: !image,
            category: !category,
          }
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'Blog post with this slug already exists' },
        { status: 400 }
      );
    }

    // Create blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        image,
        alt: alt || null,
        imageCaption: imageCaption || null,
        seoFilename: seoFilename || null,
        category,
        date: date ? new Date(date) : new Date(),
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        status: status || 'draft',
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        keywords: keywords || null,
        tags: Array.isArray(tags) ? tags : [],
        faqs: Array.isArray(faqs) && faqs.length > 0 ? faqs : null,
      },
    });

    return NextResponse.json({ post: blogPost }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

