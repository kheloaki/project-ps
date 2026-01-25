import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
