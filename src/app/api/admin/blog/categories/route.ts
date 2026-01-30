import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * GET /api/admin/blog/categories
 * Get all blog categories
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    let categories: Array<{ name: string }> = [];
    
    // Try to get categories from BlogCategory model
    try {
      categories = await (prisma as any).blogCategory.findMany({
        orderBy: {
          name: 'asc',
        },
        select: {
          name: true,
        },
      });
    } catch (modelError: any) {
      // If BlogCategory model doesn't exist yet, continue with post categories only
      console.log('BlogCategory model not available, using post categories only:', modelError.message);
    }

    // Also get unique categories from existing posts (for backward compatibility)
    let postCategories: Array<{ category: string }> = [];
    try {
      postCategories = await prisma.blogPost.findMany({
        select: {
          category: true,
        },
        distinct: ['category'],
      });
    } catch (error) {
      console.error('Error fetching post categories:', error);
    }

    const postCategoryList = postCategories.map(c => c.category).filter(Boolean);
    
    // Combine and deduplicate
    const allCategories = [
      ...categories.map(c => c.name),
      ...postCategoryList.filter(c => !categories.some(bc => bc.name === c))
    ].filter(Boolean).sort();

    return NextResponse.json({ categories: allCategories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blog/categories
 * Create a new blog category
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Use type assertion to access blogCategory (in case types haven't been regenerated)
    const blogCategoryModel = (prisma as any).blogCategory;
    
    if (!blogCategoryModel) {
      return NextResponse.json(
        { error: 'BlogCategory model is not available. Please restart the server after running: npx prisma generate' },
        { status: 503 }
      );
    }

    // Check if category already exists
    const existing = await blogCategoryModel.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    const category = await blogCategoryModel.create({
      data: {
        name: name.trim(),
        slug,
        description: description || null,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 400 }
      );
    }
    
    // Handle case where model doesn't exist
    if (error.message?.includes('blogCategory') || error.message?.includes('undefined')) {
      return NextResponse.json(
        { error: 'BlogCategory model is not available. Please restart the server after running: npx prisma generate' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

