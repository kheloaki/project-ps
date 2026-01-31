import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@prisma/client';

/**
 * Get all blog posts (only published)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: {
      status: 'published',
    },
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Get a blog post by slug (only published)
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return prisma.blogPost.findFirst({
    where: { 
      slug,
      status: 'published',
    },
  });
}

/**
 * Get blog posts by category (only published)
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: {
      category: {
        equals: category,
        mode: 'insensitive',
      },
      status: 'published',
    },
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Get recent blog posts (only published)
 */
export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: {
      status: 'published',
    },
    take: limit,
    orderBy: {
      date: 'desc',
    },
  });
}

