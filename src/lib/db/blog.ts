import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@prisma/client';

/**
 * Get all blog posts (only published)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    
    // Filter to only published posts (case-insensitive)
    // This handles cases where status might be "Published", "PUBLISHED", etc.
    return posts.filter(post => {
      const status = (post as any).status || '';
      return status.toLowerCase().trim() === 'published';
    });
  } catch (error: any) {
    // If status field doesn't exist (old Prisma Client), return all posts
    // This handles the case where Prisma Client wasn't regenerated
    if (error.message?.includes('status') || error.message?.includes('Unknown argument')) {
      console.warn('Status field not available, fetching all posts. Please regenerate Prisma Client.');
      return await prisma.blogPost.findMany({
        orderBy: {
          date: 'desc',
        },
      });
    }
    throw error;
  }
}

/**
 * Get a blog post by slug (only published)
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug },
    });
    
    if (!post) return null;
    
    // Check if post is published (case-insensitive)
    const status = (post as any).status || '';
    if (status.toLowerCase().trim() !== 'published') {
      return null; // Return null for drafts
    }
    
    return post;
  } catch (error: any) {
    // If status field doesn't exist (old Prisma Client), return the post anyway
    if (error.message?.includes('status') || error.message?.includes('Unknown argument')) {
      console.warn('Status field not available, fetching post without status filter. Please regenerate Prisma Client.');
      return await prisma.blogPost.findFirst({
        where: { slug },
      });
    }
    throw error;
  }
}

/**
 * Get blog posts by category (only published)
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
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
    
    // Filter to only published posts (case-insensitive)
    return posts.filter(post => {
      const status = (post as any).status || '';
      return status.toLowerCase().trim() === 'published';
    });
  } catch (error: any) {
    // If status field doesn't exist (old Prisma Client), fallback to category filter only
    if (error.message?.includes('status') || error.message?.includes('Unknown argument')) {
      console.warn('Status field not available, fetching by category without status filter. Please regenerate Prisma Client.');
      return await prisma.blogPost.findMany({
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
    throw error;
  }
}

/**
 * Get recent blog posts (only published)
 */
export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    
    // Filter to only published posts (case-insensitive) and limit
    const published = posts.filter(post => {
      const status = (post as any).status || '';
      return status.toLowerCase().trim() === 'published';
    });
    
    return published.slice(0, limit);
  } catch (error: any) {
    // If status field doesn't exist (old Prisma Client), fallback to all posts
    if (error.message?.includes('status') || error.message?.includes('Unknown argument')) {
      console.warn('Status field not available, fetching all posts. Please regenerate Prisma Client.');
      return await prisma.blogPost.findMany({
        take: limit,
        orderBy: {
          date: 'desc',
        },
      });
    }
    throw error;
  }
}

