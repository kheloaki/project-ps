import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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
    
    // Fetch product with FAQs - try Prisma first, fallback to raw SQL
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { variants: true },
      });
      if (product) {
        // Parse FAQs if it's a string
        if ((product as any).faqs && typeof (product as any).faqs === 'string') {
          try {
            (product as any).faqs = JSON.parse((product as any).faqs);
          } catch (e) {
            (product as any).faqs = null;
          }
        }
        return NextResponse.json(product);
      }
    } catch (error) {
      console.log('Prisma query failed, using raw SQL fallback');
    }
    
    // Fallback: Use raw SQL
    const rawProduct = await prisma.$queryRaw<Array<any>>(
      Prisma.sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`
    );
    
    if (!rawProduct || rawProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const fetchedProduct = rawProduct[0];
    
    // Parse FAQs if it's a string (PostgreSQL returns JSON as string sometimes)
    if (fetchedProduct.faqs) {
      if (typeof fetchedProduct.faqs === 'string') {
        try {
          fetchedProduct.faqs = JSON.parse(fetchedProduct.faqs);
        } catch (e) {
          fetchedProduct.faqs = null;
        }
      }
    } else {
      fetchedProduct.faqs = null;
    }
    
    // Get variants
    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
    });
    
    return NextResponse.json({
      ...fetchedProduct,
      variants,
    });
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
    console.log('Received update request body:', JSON.stringify(body, null, 2));
    
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
      faqs = [],
      images = [],
      variants = [],
    } = body;
    
    console.log('Extracted FAQs from request:', faqs, 'Type:', typeof faqs, 'IsArray:', Array.isArray(faqs), 'Length:', Array.isArray(faqs) ? faqs.length : 'N/A');

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

    // Prepare update data (without isPopular and faqs to avoid Prisma client issues)
    const updateData: any = {
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
    };

    // Update product with new variants
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        variants: true,
      },
    });

    // Update isPopular and FAQs separately using raw SQL (workaround for old Prisma client)
    try {
      console.log('Updating product fields:', { isPopular, faqs, faqsType: typeof faqs, faqsIsArray: Array.isArray(faqs) });

      // Build update queries separately for better error handling
      if (isPopular !== undefined) {
        await prisma.$executeRaw`
          UPDATE products 
          SET "isPopular" = ${Boolean(isPopular)}
          WHERE id = ${id}
        `;
        console.log('Updated isPopular:', Boolean(isPopular));
      }

      if (faqs !== undefined) {
        if (Array.isArray(faqs) && faqs.length > 0) {
          const faqsToSave = faqs.filter(faq => faq && faq.question && faq.answer && faq.question.trim() && faq.answer.trim());
          if (faqsToSave.length > 0) {
            const faqsJson = JSON.stringify(faqsToSave);
            // Use $executeRawUnsafe for JSON casting
            await prisma.$executeRawUnsafe(
              `UPDATE products SET "faqs" = $1::jsonb WHERE id = $2`,
              faqsJson,
              id
            );
            console.log('Saved FAQs:', faqsToSave.length, 'items', faqsToSave);
          } else {
            await prisma.$executeRaw`
              UPDATE products 
              SET "faqs" = NULL
              WHERE id = ${id}
            `;
            console.log('No valid FAQs to save (all filtered out), set to NULL');
          }
        } else {
          await prisma.$executeRaw`
            UPDATE products 
            SET "faqs" = NULL
            WHERE id = ${id}
          `;
          console.log('FAQs is not an array or is empty, set to NULL');
        }
      }
      
      // Re-fetch product to include updated fields using raw SQL to get FAQs
      const rawProduct = await prisma.$queryRaw<Array<any>>(
        Prisma.sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`
      );
      
      if (rawProduct && rawProduct.length > 0) {
        const productData = rawProduct[0];
        console.log('Fetched product FAQs (raw):', productData.faqs, 'type:', typeof productData.faqs);
        
        // Parse FAQs if it's a string (PostgreSQL returns JSON as string sometimes)
        if (productData.faqs) {
          if (typeof productData.faqs === 'string') {
            try {
              productData.faqs = JSON.parse(productData.faqs);
              console.log('Parsed FAQs from string:', productData.faqs);
            } catch (e) {
              console.error('Error parsing FAQs:', e);
              productData.faqs = null;
            }
          }
        } else {
          productData.faqs = null;
        }
        
        // Get variants
        const variants = await prisma.productVariant.findMany({
          where: { productId: id },
        });
        
        console.log('Returning product with FAQs:', productData.faqs);
        return NextResponse.json({
          ...productData,
          variants,
        });
      }
    } catch (error) {
      console.error('Error updating product fields:', error);
      // Continue even if update fails - return the product without the updated fields
    }

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

