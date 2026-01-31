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
      isPopular = false,
      tags = [],
      faqs = [],
      images = [],
      imageMetadata = [],
      variants = [],
    } = body;

    // Validate required fields
    if (!handle || !title || !price || !image || !description || !category) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            handle: !handle,
            title: !title,
            price: !price,
            image: !image,
            description: !description,
            category: !category,
          }
        },
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

    // Prepare create data (without isPopular, tags, and faqs to avoid Prisma client issues)
    const createData: any = {
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
      tags: Array.isArray(tags) ? tags.filter((tag: string) => tag && tag.trim()) : [] as string[],
      variants: {
        create: variants.map((variant: any) => ({
          title: variant.title,
          price: variant.price,
          sku: variant.sku || null,
          image: variant.image || null,
        })),
      },
    };

    // Create product with variants
    const product = await prisma.product.create({
      data: createData,
      include: {
        variants: true,
      },
    });

    // Update isPopular and FAQs separately using raw SQL (workaround for old Prisma client)
    if (product.id) {
      try {
        const updates: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (isPopular !== undefined) {
          updates.push(`"isPopular" = $${paramIndex}`);
          params.push(Boolean(isPopular));
          paramIndex++;
        }

        if (faqs !== undefined) {
          updates.push(`"faqs" = $${paramIndex}`);
          if (Array.isArray(faqs) && faqs.length > 0) {
            params.push(JSON.stringify(faqs));
          } else {
            params.push(null);
          }
          paramIndex++;
        }

        if (imageMetadata !== undefined) {
          updates.push(`"imageMetadata" = $${paramIndex}`);
          if (Array.isArray(imageMetadata) && imageMetadata.length > 0) {
            params.push(JSON.stringify(imageMetadata));
          } else {
            params.push(null);
          }
          paramIndex++;
        }

        if (updates.length > 0) {
          const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
          await prisma.$executeRawUnsafe(query, ...params, product.id);
          
          // Re-fetch product to include updated fields
          const updatedProduct = await prisma.product.findUnique({
            where: { id: product.id },
            include: { variants: true },
          });
          if (updatedProduct) {
            return NextResponse.json(updatedProduct, { status: 201 });
          }
        }
      } catch (error) {
        console.error('Error updating product fields:', error);
        // Continue even if update fails
      }
    }

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

