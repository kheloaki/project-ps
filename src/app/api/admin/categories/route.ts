import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * GET /api/admin/categories
 * Get all unique categories from products
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin();

    let products = [];
    
    try {
      products = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ categories: [] });
    }

    // Get unique categories (both full paths and last segment)
    const fullCategories = Array.from(new Set(products.map((p) => p.category))).sort();
    const lastSegments = Array.from(
      new Set(products.map((p) => p.category.split('>').pop()?.trim() || p.category))
    ).sort();

    // Combine and deduplicate
    const allCategories = Array.from(new Set([...fullCategories, ...lastSegments])).sort();

    return NextResponse.json({ categories: allCategories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

