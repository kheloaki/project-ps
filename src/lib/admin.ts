import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }

  const user = await currentUser();
  
  // Check admin role in Clerk metadata
  const isAdmin = 
    user?.publicMetadata?.role === 'admin' || 
    user?.publicMetadata?.isAdmin === true ||
    process.env.ADMIN_USER_IDS?.split(',').includes(userId);

  return !!isAdmin;
}

/**
 * Require admin access (throws if not admin)
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Get admin user IDs from environment
 */
export function getAdminUserIds(): string[] {
  return process.env.ADMIN_USER_IDS?.split(',').filter(Boolean) || [];
}

