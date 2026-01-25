import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated user (server-side)
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  return user;
}

/**
 * Get the current user ID (server-side)
 */
export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication (server-side)
 * Throws an error if user is not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

