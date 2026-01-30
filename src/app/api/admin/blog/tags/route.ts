import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * GET /api/admin/blog/tags
 * Get all unique blog tags
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const posts = await prisma.blogPost.findMany({
      select: {
        tags: true,
      },
    });

    // Flatten and get unique tags
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).filter(Boolean);

    return NextResponse.json({ tags: uniqueTags });
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

