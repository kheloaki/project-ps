/**
 * Utility functions for Clerk webhook handling
 */

import { prisma } from '@/lib/prisma';

export interface ClerkUserData {
  id: string;
  email_addresses: Array<{ id: string; email_address: string }>;
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  created_at: number;
  updated_at: number;
}

/**
 * Get or create user profile from Clerk user data
 */
export async function syncUserProfile(data: ClerkUserData) {
  const primaryEmail = data.email_addresses?.find(
    (email) => email.id === data.primary_email_address_id
  )?.email_address || data.email_addresses?.[0]?.email_address || null;

  return prisma.userProfile.upsert({
    where: { clerkUserId: data.id },
    update: {
      email: primaryEmail,
      firstName: data.first_name || null,
      lastName: data.last_name || null,
      imageUrl: data.image_url || null,
      updatedAt: new Date(data.updated_at * 1000),
    },
    create: {
      clerkUserId: data.id,
      email: primaryEmail,
      firstName: data.first_name || null,
      lastName: data.last_name || null,
      imageUrl: data.image_url || null,
      createdAt: new Date(data.created_at * 1000),
    },
  });
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(clerkUserId: string) {
  try {
    await prisma.userProfile.delete({
      where: { clerkUserId },
    });
  } catch (error: any) {
    // User might not exist, which is fine
    if (error.code !== 'P2025') {
      throw error;
    }
  }
}

