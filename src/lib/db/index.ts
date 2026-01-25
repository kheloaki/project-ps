// Central export point for all database utilities
export * from './products';
export * from './collections';
export * from './blog';

// Re-export Prisma client for convenience
export { prisma, disconnectPrisma } from '@/lib/prisma';

