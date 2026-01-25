import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { getProductById } from '@/lib/db/products';

/**
 * GET /api/admin/products/[id]
 * Get a product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    
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

/**
 * PUT /api/admin/products/[id]
 * Update a product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = await params;
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if handle is being changed and if new handle already exists
    if (handle !== existingProduct.handle) {
      const handleExists = await prisma.product.findUnique({
        where: { handle },
      });

      if (handleExists) {
        return NextResponse.json(
          { error: 'Product with this handle already exists' },
          { status: 400 }
        );
      }
    }

    // Delete existing variants
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    // Update product with new variants
    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    
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

