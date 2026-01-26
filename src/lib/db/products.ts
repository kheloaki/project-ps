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
  // Try Prisma query first (should work if Prisma client is updated)
  try {
    const product = await prisma.product.findUnique({
      where: { handle },
      include: {
        variants: true,
      },
    });
    
    if (product) {
      // Parse FAQs if it's a string
      if ((product as any).faqs) {
        if (typeof (product as any).faqs === 'string') {
          try {
            (product as any).faqs = JSON.parse((product as any).faqs);
          } catch (e) {
            (product as any).faqs = null;
          }
        }
      }
      return product as ProductWithVariants;
    }
  } catch (error) {
    // Fallback to raw SQL if Prisma query fails
    console.log('Prisma query failed, using raw SQL fallback');
  }
  
  // Fallback: Use raw SQL to ensure FAQs JSON field is properly returned
  const rawProduct = await prisma.$queryRaw<Array<any>>(
    Prisma.sql`SELECT * FROM products WHERE handle = ${handle} LIMIT 1`
  );
  
  if (!rawProduct || rawProduct.length === 0) {
    return null;
  }
  
  const productData = rawProduct[0];
  
  // Parse FAQs if it's a string (PostgreSQL returns JSON as string sometimes)
  if (productData.faqs) {
    if (typeof productData.faqs === 'string') {
      try {
        productData.faqs = JSON.parse(productData.faqs);
      } catch (e) {
        productData.faqs = null;
      }
    }
  } else {
    productData.faqs = null;
  }
  
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

