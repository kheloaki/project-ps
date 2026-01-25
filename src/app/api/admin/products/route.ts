import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin();

    const body = await request.json();
    const {
      handle,
      title,
      price,
      image,
      description,
      bodyHtml,
      seoTitle,
      seoDescription,
      category,
      coaImageUrl,
      images = [],
      variants = [],
    } = body;

    // Validate required fields
    if (!handle || !title || !price || !image || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if handle already exists
    const existingProduct = await prisma.product.findUnique({
      where: { handle },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this handle already exists' },
        { status: 400 }
      );
    }

    // Create product with variants
    const product = await prisma.product.create({
      data: {
        handle,
        title,
        price,
        image,
        images: Array.isArray(images) ? images : [] as string[],
        description,
        bodyHtml: bodyHtml || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        category,
        coaImageUrl: coaImageUrl || null,
        variants: {
          create: variants.map((variant: any) => ({
            title: variant.title,
            price: variant.price,
            sku: variant.sku || null,
            image: variant.image || null,
          })),
        },
      } as any, // Type assertion to handle images array field
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
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

