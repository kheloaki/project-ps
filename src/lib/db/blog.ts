import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@prisma/client';

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Get a blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: {
      category: {
        equals: category,
        mode: 'insensitive',
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    take: limit,
    orderBy: {
      date: 'desc',
    },
  });
}

