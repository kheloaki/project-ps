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
    
    // Always use raw SQL to ensure FAQs are included (works in both dev and production)
    // This bypasses Prisma client caching issues in production
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
    
    // Parse FAQs - PostgreSQL JSONB can be returned as string, object, or array
    try {
      if (fetchedProduct.faqs === null || fetchedProduct.faqs === undefined) {
        fetchedProduct.faqs = null;
      } else if (typeof fetchedProduct.faqs === 'string') {
        // If it's a string, try to parse it
        try {
          const parsed = JSON.parse(fetchedProduct.faqs);
          fetchedProduct.faqs = Array.isArray(parsed) ? parsed : null;
        } catch (e) {
          console.error('Error parsing FAQs from string:', e, 'Raw value:', fetchedProduct.faqs);
          fetchedProduct.faqs = null;
        }
      } else if (Array.isArray(fetchedProduct.faqs)) {
        // Already an array, validate it
        fetchedProduct.faqs = fetchedProduct.faqs.length > 0 ? fetchedProduct.faqs : null;
      } else if (typeof fetchedProduct.faqs === 'object') {
        // Might be a JSON object
        if (Array.isArray(fetchedProduct.faqs)) {
          fetchedProduct.faqs = fetchedProduct.faqs.length > 0 ? fetchedProduct.faqs : null;
        } else {
          console.warn('FAQs is an object but not an array:', fetchedProduct.faqs);
          fetchedProduct.faqs = null;
        }
      } else {
        console.warn('Unexpected FAQs type:', typeof fetchedProduct.faqs, fetchedProduct.faqs);
        fetchedProduct.faqs = null;
      }
    } catch (error) {
      console.error('Error processing FAQs:', error, 'Raw value:', fetchedProduct.faqs);
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
      // Explicitly select faqs as jsonb to ensure proper type handling
      const rawProduct = await prisma.$queryRaw<Array<any>>(
        Prisma.sql`SELECT *, "faqs"::text as faqs_text FROM products WHERE id = ${id} LIMIT 1`
      );
      
      if (rawProduct && rawProduct.length > 0) {
        const productData = rawProduct[0];
        
        // Use faqs_text if available (from explicit cast), otherwise use faqs
        const faqsRaw = productData.faqs_text || productData.faqs;
        console.log('Fetched product FAQs (raw):', faqsRaw, 'type:', typeof faqsRaw);
        console.log('Fetched product FAQs (original):', productData.faqs, 'type:', typeof productData.faqs);
        
        // Parse FAQs - PostgreSQL JSONB can be returned as string, object, or array
        try {
          if (faqsRaw === null || faqsRaw === undefined) {
            productData.faqs = null;
          } else if (typeof faqsRaw === 'string') {
            // If it's a string, try to parse it
            try {
              const parsed = JSON.parse(faqsRaw);
              productData.faqs = Array.isArray(parsed) ? parsed : null;
              console.log('Parsed FAQs from string:', productData.faqs);
            } catch (e) {
              console.error('Error parsing FAQs from string:', e, 'Raw value:', faqsRaw);
              productData.faqs = null;
            }
          } else if (Array.isArray(faqsRaw)) {
            // Already an array, validate it
            productData.faqs = faqsRaw.length > 0 ? faqsRaw : null;
            console.log('FAQs is already an array:', productData.faqs);
          } else if (typeof faqsRaw === 'object') {
            // Might be a JSON object
            if (Array.isArray(faqsRaw)) {
              productData.faqs = faqsRaw.length > 0 ? faqsRaw : null;
            } else {
              console.warn('FAQs is an object but not an array:', faqsRaw);
              productData.faqs = null;
            }
          } else {
            console.warn('Unexpected FAQs type:', typeof faqsRaw, faqsRaw);
            productData.faqs = null;
          }
        } catch (error) {
          console.error('Error processing FAQs:', error, 'Raw value:', faqsRaw);
          productData.faqs = null;
        }
        
        // Remove the temporary faqs_text field
        delete productData.faqs_text;
        
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

