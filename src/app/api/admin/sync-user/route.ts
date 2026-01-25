import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getCurrentUser } from '@/lib/clerk';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/sync-user
 * Manually sync current user to database
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get primary email
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress || user.emailAddresses[0]?.emailAddress || null;

    // Sync to database
    const userProfile = await prisma.userProfile.upsert({
      where: { clerkUserId: user.id },
      update: {
        email: primaryEmail,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
        updatedAt: new Date(),
      },
      create: {
        clerkUserId: user.id,
        email: primaryEmail,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
        createdAt: new Date(user.createdAt),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
      },
    });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync user' },
      { status: 500 }
    );
  }
}

