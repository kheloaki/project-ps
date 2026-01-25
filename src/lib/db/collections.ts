import { prisma } from '@/lib/prisma';
import type { Collection, Product } from '@prisma/client';

export type CollectionWithProducts = Collection & {
  products: (Product & {
    variants: Array<{ id: string; title: string; price: string }>;
  })[];
};

/**
 * Get all collections with their products
 */
export async function getAllCollections(): Promise<CollectionWithProducts[]> {
  return prisma.collection.findMany({
    include: {
      products: {
        include: {
          product: {
            include: {
              variants: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get a collection by handle
 */
export async function getCollectionByHandle(handle: string): Promise<CollectionWithProducts | null> {
  const collection = await prisma.collection.findUnique({
    where: { handle },
    include: {
      products: {
        include: {
          product: {
            include: {
              variants: true,
            },
          },
        },
      },
    },
  });

  if (!collection) return null;

  return {
    ...collection,
    products: collection.products.map((pc) => ({
      ...pc.product,
      variants: pc.product.variants,
    })),
  };
}

