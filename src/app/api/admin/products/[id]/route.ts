import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireAdmin } from '@/lib/admin';

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
    
    // Always use raw SQL to ensure FAQs and imageMetadata are included (works in both dev and production)
    const rawProduct = await prisma.$queryRaw<Array<any>>(
      Prisma.sql`SELECT *, "faqs"::text as faqs_text, "imageMetadata"::text as imageMetadata_text FROM products WHERE id = ${id} LIMIT 1`
    );
    
    if (!rawProduct || rawProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const fetchedProduct = rawProduct[0];
    const faqsRaw = fetchedProduct.faqs_text || fetchedProduct.faqs;
    
    // Parse FAQs - PostgreSQL JSONB can be returned as string, object, or array
    try {
      if (faqsRaw === null || faqsRaw === undefined) {
        fetchedProduct.faqs = null;
      } else if (typeof faqsRaw === 'string') {
        try {
          const parsed = JSON.parse(faqsRaw);
          fetchedProduct.faqs = Array.isArray(parsed) ? parsed : null;
        } catch (e) {
          console.error('Error parsing FAQs from string:', e);
          fetchedProduct.faqs = null;
        }
      } else if (Array.isArray(faqsRaw)) {
        fetchedProduct.faqs = faqsRaw.length > 0 ? faqsRaw : null;
      } else if (typeof faqsRaw === 'object' && Array.isArray(faqsRaw)) {
        fetchedProduct.faqs = faqsRaw.length > 0 ? faqsRaw : null;
      } else {
        fetchedProduct.faqs = null;
      }
    } catch (error) {
      console.error('Error processing FAQs:', error);
      fetchedProduct.faqs = null;
    }
    
    delete fetchedProduct.faqs_text;
    
    // Parse imageMetadata - PostgreSQL JSONB can be returned as string, object, or array
    const imageMetadataRaw = fetchedProduct.imageMetadata_text || fetchedProduct.imageMetadata;
    try {
      if (imageMetadataRaw === null || imageMetadataRaw === undefined) {
        fetchedProduct.imageMetadata = null;
      } else if (typeof imageMetadataRaw === 'string') {
        try {
          const parsed = JSON.parse(imageMetadataRaw);
          fetchedProduct.imageMetadata = Array.isArray(parsed) ? parsed : null;
        } catch (e) {
          console.error('Error parsing imageMetadata from string:', e);
          fetchedProduct.imageMetadata = null;
        }
      } else if (Array.isArray(imageMetadataRaw)) {
        fetchedProduct.imageMetadata = imageMetadataRaw.length > 0 ? imageMetadataRaw : null;
      } else {
        fetchedProduct.imageMetadata = null;
      }
    } catch (error) {
      console.error('Error processing imageMetadata:', error);
      fetchedProduct.imageMetadata = null;
    }
    
    delete fetchedProduct.imageMetadata_text;
    
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
      if (isPopular !== undefined) {
        await prisma.$executeRaw`
          UPDATE products 
          SET "isPopular" = ${Boolean(isPopular)}
          WHERE id = ${id}
        `;
      }

      if (faqs !== undefined) {
        if (Array.isArray(faqs) && faqs.length > 0) {
          const faqsToSave = faqs.filter(faq => faq && faq.question && faq.answer && faq.question.trim() && faq.answer.trim());
          if (faqsToSave.length > 0) {
            const faqsJson = JSON.stringify(faqsToSave);
            await prisma.$executeRawUnsafe(
              `UPDATE products SET "faqs" = $1::jsonb WHERE id = $2`,
              faqsJson,
              id
            );
          } else {
            await prisma.$executeRaw`
              UPDATE products 
              SET "faqs" = NULL
              WHERE id = ${id}
            `;
          }
        } else {
          await prisma.$executeRaw`
            UPDATE products 
            SET "faqs" = NULL
            WHERE id = ${id}
          `;
        }
      }

      // Update imageMetadata separately using raw SQL
      if (imageMetadata !== undefined) {
        if (Array.isArray(imageMetadata) && imageMetadata.length > 0) {
          const imageMetadataJson = JSON.stringify(imageMetadata);
          await prisma.$executeRawUnsafe(
            `UPDATE products SET "imageMetadata" = $1::jsonb WHERE id = $2`,
            imageMetadataJson,
            id
          );
        } else {
          await prisma.$executeRaw`
            UPDATE products 
            SET "imageMetadata" = NULL
            WHERE id = ${id}
          `;
        }
      }
      
      // Re-fetch product to include updated fields using raw SQL
      const rawProduct = await prisma.$queryRaw<Array<any>>(
        Prisma.sql`SELECT *, "faqs"::text as faqs_text, "imageMetadata"::text as imageMetadata_text FROM products WHERE id = ${id} LIMIT 1`
      );
      
      if (rawProduct && rawProduct.length > 0) {
        const productData = rawProduct[0];
        const faqsRaw = productData.faqs_text || productData.faqs;
        
        // Parse FAQs - PostgreSQL JSONB can be returned as string, object, or array
        try {
          if (faqsRaw === null || faqsRaw === undefined) {
            productData.faqs = null;
          } else if (typeof faqsRaw === 'string') {
            try {
              const parsed = JSON.parse(faqsRaw);
              productData.faqs = Array.isArray(parsed) ? parsed : null;
            } catch (e) {
              console.error('Error parsing FAQs from string:', e);
              productData.faqs = null;
            }
          } else if (Array.isArray(faqsRaw)) {
            productData.faqs = faqsRaw.length > 0 ? faqsRaw : null;
          } else if (typeof faqsRaw === 'object' && Array.isArray(faqsRaw)) {
            productData.faqs = faqsRaw.length > 0 ? faqsRaw : null;
          } else {
            productData.faqs = null;
          }
        } catch (error) {
          console.error('Error processing FAQs:', error);
          productData.faqs = null;
        }
        
        delete productData.faqs_text;
        
        // Parse imageMetadata - PostgreSQL JSONB can be returned as string, object, or array
        const imageMetadataRaw = productData.imageMetadata_text || productData.imageMetadata;
        try {
          if (imageMetadataRaw === null || imageMetadataRaw === undefined) {
            productData.imageMetadata = null;
          } else if (typeof imageMetadataRaw === 'string') {
            try {
              const parsed = JSON.parse(imageMetadataRaw);
              productData.imageMetadata = Array.isArray(parsed) ? parsed : null;
            } catch (e) {
              console.error('Error parsing imageMetadata from string:', e);
              productData.imageMetadata = null;
            }
          } else if (Array.isArray(imageMetadataRaw)) {
            productData.imageMetadata = imageMetadataRaw.length > 0 ? imageMetadataRaw : null;
          } else {
            productData.imageMetadata = null;
          }
        } catch (error) {
          console.error('Error processing imageMetadata:', error);
          productData.imageMetadata = null;
        }
        
        delete productData.imageMetadata_text;
        
        const variants = await prisma.productVariant.findMany({
          where: { productId: id },
        });
        
        return NextResponse.json({
          ...productData,
          variants,
        });
      }
    } catch (error) {
      console.error('Error updating product fields:', error);
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

