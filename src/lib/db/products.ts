import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { Product, ProductVariant } from '@prisma/client';

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

/**
 * Get all products with their variants
 */
export async function getAllProducts(): Promise<ProductWithVariants[]> {
  return prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get a product by handle
 */
/**
 * Get a product by handle
 */
export async function getProductByHandle(handle: string): Promise<ProductWithVariants | null> {
  // Always use raw SQL to ensure FAQs are included (works in both dev and production)
  // This bypasses Prisma client caching issues in production
  // Explicitly select faqs as text to ensure proper type handling
  const rawProduct = await prisma.$queryRaw<Array<any>>(
    Prisma.sql`SELECT *, "faqs"::text as faqs_text FROM products WHERE handle = ${handle} LIMIT 1`
  );
  
  if (!rawProduct || rawProduct.length === 0) {
    return null;
  }
  
  const productData = rawProduct[0];
  
  // Use faqs_text if available (from explicit cast), otherwise use faqs
  const faqsRaw = productData.faqs_text || productData.faqs;
  
  // Parse FAQs - PostgreSQL JSONB can be returned as string, object, or array
  try {
    if (faqsRaw === null || faqsRaw === undefined) {
      productData.faqs = null;
    } else if (typeof faqsRaw === 'string') {
      // If it's a string, try to parse it
      try {
        const parsed = JSON.parse(faqsRaw);
        productData.faqs = Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        console.error('Error parsing FAQs from string:', e, 'Raw value:', faqsRaw);
        productData.faqs = null;
      }
    } else if (Array.isArray(faqsRaw)) {
      // Already an array, validate it
      productData.faqs = faqsRaw.length > 0 ? faqsRaw : null;
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
    where: { productId: productData.id },
  });
  
  return {
    ...productData,
    variants,
  } as ProductWithVariants;
}

/**
 * Get a product by ID
 */
export async function getProductById(id: string): Promise<ProductWithVariants | null> {
  return prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
    },
  });
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<ProductWithVariants[]> {
  return prisma.product.findMany({
    where: {
      category: {
        contains: category,
        mode: 'insensitive',
      },
    },
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Search products
 * Searches across title, handle, description, bodyHtml, seoTitle, seoDescription, and category
 */
export async function searchProducts(query: string): Promise<ProductWithVariants[]> {
  const searchTerm = query.trim();
  
  if (!searchTerm) {
    return [];
  }

  return prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { handle: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { bodyHtml: { contains: searchTerm, mode: 'insensitive' } },
        { seoTitle: { contains: searchTerm, mode: 'insensitive' } },
        { seoDescription: { contains: searchTerm, mode: 'insensitive' } },
        { category: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get products with price range filter
 */
export async function getProductsByPriceRange(
  min: number,
  max: number
): Promise<ProductWithVariants[]> {
  // Note: This is a simplified version. In production, you'd want to parse
  // the price string and store it as a numeric value in the database
  const allProducts = await getAllProducts();
  
  return allProducts.filter((product) => {
    const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    return price >= min && price <= max;
  });
}

