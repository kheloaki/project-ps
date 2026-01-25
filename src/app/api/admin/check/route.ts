import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * GET /api/admin/check
 * Check if current user is an admin
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false });
    }

    const user = await currentUser();
    
    // Check admin role in Clerk metadata or environment variable
    const isAdmin = 
      user?.publicMetadata?.role === 'admin' || 
      user?.publicMetadata?.isAdmin === true ||
      process.env.ADMIN_USER_IDS?.split(',').includes(userId);

    return NextResponse.json({ isAdmin: !!isAdmin });
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false });
  }
}

