import type { Product, ProductVariant, Collection, BlogPost, Order, OrderItem } from '@prisma/client';

// Product types
export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export type ProductWithCollections = Product & {
  collections: Array<{
    collection: Collection;
  }>;
};

// Collection types
export type CollectionWithProducts = Collection & {
  products: ProductWithVariants[];
};

// Order types
export type OrderWithItems = Order & {
  items: OrderItem[];
};

// API Response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

