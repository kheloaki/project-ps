/**
 * Migration script to import all existing images into the Media table
 * 
 * This script:
 * 1. Finds all image URLs from Products, BlogPosts, ProductVariants, Collections, HeroImages
 * 2. Extracts metadata where available
 * 3. Creates Media entries for each unique image URL
 * 4. Handles duplicates gracefully using upsert
 * 
 * Run with: npx tsx scripts/migrate-images-to-media.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ImageInfo {
  url: string;
  filename?: string;
  title?: string | null;
  alt?: string | null;
  caption?: string | null;
  description?: string | null;
  seoFilename?: string | null;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  mimeType?: string | null;
}

// Extract filename from URL
function extractFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'image';
    // Remove query parameters if any
    return filename.split('?')[0];
  } catch {
    // If URL parsing fails, try to extract from string
    const parts = url.split('/');
    const filename = parts[parts.length - 1] || 'image';
    return filename.split('?')[0];
  }
}

// Check if URL is a valid image URL
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === '') return false;
  
  // Skip data URLs and placeholder images
  if (url.startsWith('data:') || url.includes('placeholder') || url.includes('via.placeholder.com')) {
    return false;
  }
  
  // Check if it looks like an image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('image') || 
         lowerUrl.includes('img');
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Media table...\n');

  const imageMap = new Map<string, ImageInfo>();
  let totalFound = 0;
  let skipped = 0;

  try {
    // 1. Products - main image and images array
    console.log('📦 Processing Products...');
    const products = await (prisma as any).product.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        images: true,
        imageMetadata: true,
        coaImageUrl: true,
      },
    });

    for (const product of products) {
      // Main product image
      if (isValidImageUrl(product.image)) {
        totalFound++;
        const existing = imageMap.get(product.image);
        const metadata = Array.isArray(product.imageMetadata) 
          ? product.imageMetadata.find((m: any) => m.url === product.image) 
          : null;
        
        imageMap.set(product.image, {
          url: product.image,
          filename: extractFilename(product.image),
          title: existing?.title || metadata?.title || product.title || null,
          alt: existing?.alt || metadata?.alt || null,
          caption: existing?.caption || metadata?.caption || null,
          description: existing?.description || metadata?.description || null,
          seoFilename: existing?.seoFilename || metadata?.seoFilename || null,
        });
      }

      // Product images array
      if (Array.isArray(product.images)) {
        for (const imgUrl of product.images) {
          if (isValidImageUrl(imgUrl)) {
            totalFound++;
            if (!imageMap.has(imgUrl)) {
              const metadata = Array.isArray(product.imageMetadata) 
                ? product.imageMetadata.find((m: any) => m.url === imgUrl) 
                : null;
              
              imageMap.set(imgUrl, {
                url: imgUrl,
                filename: extractFilename(imgUrl),
                title: metadata?.title || null,
                alt: metadata?.alt || null,
                caption: metadata?.caption || null,
                description: metadata?.description || null,
                seoFilename: metadata?.seoFilename || null,
              });
            }
          }
        }
      }

      // COA image
      if (isValidImageUrl(product.coaImageUrl)) {
        totalFound++;
        if (!imageMap.has(product.coaImageUrl)) {
          imageMap.set(product.coaImageUrl, {
            url: product.coaImageUrl,
            filename: extractFilename(product.coaImageUrl),
            title: `COA for ${product.title}`,
            alt: `Certificate of Analysis for ${product.title}`,
          });
        }
      }
    }
    console.log(`   Found ${products.length} products\n`);

    // 2. Product Variants
    console.log('🔄 Processing Product Variants...');
    const variants = await (prisma as any).productVariant.findMany({
      select: {
        id: true,
        image: true,
      },
    });

    for (const variant of variants) {
      if (isValidImageUrl(variant.image)) {
        totalFound++;
        if (!imageMap.has(variant.image)) {
          imageMap.set(variant.image, {
            url: variant.image,
            filename: extractFilename(variant.image),
          });
        }
      }
    }
    console.log(`   Found ${variants.length} variants\n`);

    // 3. Collections
    console.log('📚 Processing Collections...');
    const collections = await (prisma as any).collection.findMany({
      select: {
        id: true,
        title: true,
        image: true,
      },
    });

    for (const collection of collections) {
      if (isValidImageUrl(collection.image)) {
        totalFound++;
        if (!imageMap.has(collection.image)) {
          imageMap.set(collection.image, {
            url: collection.image,
            filename: extractFilename(collection.image),
            title: collection.title || null,
            alt: `Image for ${collection.title}` || null,
          });
        }
      }
    }
    console.log(`   Found ${collections.length} collections\n`);

    // 4. Blog Posts
    console.log('📝 Processing Blog Posts...');
    const blogPosts = await (prisma as any).blogPost.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        alt: true,
        imageCaption: true,
        seoFilename: true,
        ogImage: true,
      },
    });

    for (const post of blogPosts) {
      // Main blog image
      if (isValidImageUrl(post.image)) {
        totalFound++;
        const existing = imageMap.get(post.image);
        imageMap.set(post.image, {
          url: post.image,
          filename: extractFilename(post.image),
          title: existing?.title || post.title || null,
          alt: existing?.alt || post.alt || null,
          caption: existing?.caption || post.imageCaption || null,
          seoFilename: existing?.seoFilename || post.seoFilename || null,
        });
      }

      // OG Image
      if (isValidImageUrl(post.ogImage)) {
        totalFound++;
        if (!imageMap.has(post.ogImage)) {
          imageMap.set(post.ogImage, {
            url: post.ogImage,
            filename: extractFilename(post.ogImage),
            title: `OG Image for ${post.title}`,
          });
        }
      }
    }
    console.log(`   Found ${blogPosts.length} blog posts\n`);

    // 5. Hero Images
    console.log('🖼️  Processing Hero Images...');
    const heroImages = await (prisma as any).heroImage.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        alt: true,
      },
    });

    for (const hero of heroImages) {
      if (isValidImageUrl(hero.url)) {
        totalFound++;
        if (!imageMap.has(hero.url)) {
          imageMap.set(hero.url, {
            url: hero.url,
            filename: extractFilename(hero.url),
            title: hero.title || null,
            alt: hero.alt || null,
          });
        }
      }
    }
    console.log(`   Found ${heroImages.length} hero images\n`);

    // 6. User Profile Images
    console.log('👤 Processing User Profiles...');
    const userProfiles = await (prisma as any).userProfile.findMany({
      select: {
        id: true,
        imageUrl: true,
      },
    });

    for (const user of userProfiles) {
      if (isValidImageUrl(user.imageUrl)) {
        totalFound++;
        if (!imageMap.has(user.imageUrl)) {
          imageMap.set(user.imageUrl, {
            url: user.imageUrl,
            filename: extractFilename(user.imageUrl),
          });
        }
      }
    }
    console.log(`   Found ${userProfiles.length} user profiles\n`);

    // 7. Extract images from blog post content (HTML)
    console.log('🔍 Extracting images from blog post content...');
    const blogPostsWithContent = await (prisma as any).blogPost.findMany({
      select: {
        id: true,
        content: true,
      },
    });

    for (const post of blogPostsWithContent) {
      if (post.content) {
        // Extract img src attributes
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        let match;
        while ((match = imgRegex.exec(post.content)) !== null) {
          const imgUrl = match[1];
          if (isValidImageUrl(imgUrl)) {
            totalFound++;
            if (!imageMap.has(imgUrl)) {
              // Try to extract alt text from the img tag
              const altMatch = match[0].match(/alt=["']([^"']+)["']/i);
              const titleMatch = match[0].match(/title=["']([^"']+)["']/i);
              
              imageMap.set(imgUrl, {
                url: imgUrl,
                filename: extractFilename(imgUrl),
                alt: altMatch ? altMatch[1] : null,
                title: titleMatch ? titleMatch[1] : null,
              });
            }
          }
        }

        // Extract figure data attributes
        const figureRegex = /<figure[^>]*data-image-url=["']([^"']+)["'][^>]*>/gi;
        while ((match = figureRegex.exec(post.content)) !== null) {
          const imgUrl = match[1];
          if (isValidImageUrl(imgUrl)) {
            totalFound++;
            if (!imageMap.has(imgUrl)) {
              const figureTag = match[0];
              const altMatch = figureTag.match(/data-image-alt=["']([^"']+)["']/i);
              const titleMatch = figureTag.match(/data-image-title=["']([^"']+)["']/i);
              const captionMatch = figureTag.match(/data-image-caption=["']([^"']+)["']/i);
              
              imageMap.set(imgUrl, {
                url: imgUrl,
                filename: extractFilename(imgUrl),
                alt: altMatch ? altMatch[1] : null,
                title: titleMatch ? titleMatch[1] : null,
                caption: captionMatch ? captionMatch[1] : null,
              });
            }
          }
        }
      }
    }
    console.log(`   Processed ${blogPostsWithContent.length} blog posts with content\n`);

    // Count unique images
    const uniqueImages = imageMap.size;
    console.log(`\n📊 Summary:`);
    console.log(`   Total image URLs found: ${totalFound}`);
    console.log(`   Unique images: ${uniqueImages}`);
    console.log(`   Skipped invalid URLs: ${totalFound - uniqueImages}\n`);

    // 8. Insert/Update all images in Media table
    console.log('💾 Saving images to Media table...');
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const [url, imageInfo] of imageMap.entries()) {
      try {
        const existing = await (prisma as any).media.findUnique({
          where: { url },
        });

        if (existing) {
          // Update existing with new metadata if available
          await (prisma as any).media.update({
            where: { url },
            data: {
              filename: imageInfo.filename || existing.filename,
              title: imageInfo.title ?? existing.title,
              alt: imageInfo.alt ?? existing.alt,
              caption: imageInfo.caption ?? existing.caption,
              description: imageInfo.description ?? existing.description,
              seoFilename: imageInfo.seoFilename ?? existing.seoFilename,
            },
          });
          updated++;
        } else {
          // Create new entry
          await (prisma as any).media.create({
            data: {
              url: imageInfo.url,
              filename: imageInfo.filename || extractFilename(url),
              title: imageInfo.title || null,
              alt: imageInfo.alt || null,
              caption: imageInfo.caption || null,
              description: imageInfo.description || null,
              seoFilename: imageInfo.seoFilename || null,
              width: imageInfo.width || null,
              height: imageInfo.height || null,
              size: imageInfo.size || null,
              mimeType: imageInfo.mimeType || null,
            },
          });
          created++;
        }
      } catch (error: any) {
        console.error(`   ❌ Error saving ${url}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Total in Media table: ${created + updated}\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateImages()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration error:', error);
    process.exit(1);
  });

