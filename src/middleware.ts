import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/collections(.*)',
  '/products(.*)',
  '/blogs(.*)',
  '/pages(.*)',
  '/policies(.*)',
  '/cart(.*)', // Cart page is public (no login required)
  '/checkout(.*)',
  '/api/webhooks(.*)', // Webhooks are public (they use their own authentication)
  '/api/uploadthing(.*)', // UploadThing callbacks are public (they use their own authentication)
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Admin routes are protected by the layout, not middleware
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect routes that are not public
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Auto-sync user to database when they sign in (if authenticated)
  const { userId } = await auth();
  if (userId && !request.nextUrl.pathname.startsWith('/api')) {
    try {
      const clerk = await import('@clerk/nextjs/server').then(m => m.clerkClient());
      const user = await clerk.users.getUser(userId);
      
      if (user) {
        const primaryEmail = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
        )?.emailAddress || user.emailAddresses[0]?.emailAddress || null;

        await prisma.userProfile.upsert({
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
      }
    } catch (error) {
      // Silently fail - don't block requests if sync fails
      console.error('Auto-sync user error:', error);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
