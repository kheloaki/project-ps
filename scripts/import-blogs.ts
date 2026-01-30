/**
 * Import Blogs Script
 * 
 * This script imports blog posts from the existing blog-posts.ts file
 * or from peptidesskin.com into the database.
 * 
 * Usage:
 *   tsx scripts/import-blogs.ts
 *   tsx scripts/import-blogs.ts --from-file
 *   tsx scripts/import-blogs.ts --from-website
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt?: string;
  category: string;
  date: string;
  metaDescription?: string;
  tags?: string[];
  content: string;
  faqs?: Array<{ question: string; answer: string }>;
}

// Parse date string like "JAN 13, 2026" to Date object
function parseDate(dateStr: string): Date {
  const months: Record<string, number> = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };

  const parts = dateStr.trim().split(' ');
  if (parts.length === 3) {
    const month = months[parts[0].toUpperCase()];
    const day = parseInt(parts[1].replace(',', ''));
    const year = parseInt(parts[2]);
    
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  // Fallback to current date
  return new Date();
}

async function importFromFile() {
  console.log('📚 Importing blogs from blog-posts.ts file...\n');
  
  try {
    // Import the blog posts data
    const blogPostsPath = path.join(process.cwd(), 'src', 'data', 'blog-posts.ts');
    
    if (!fs.existsSync(blogPostsPath)) {
      console.error('❌ blog-posts.ts file not found at:', blogPostsPath);
      return;
    }

    // Read and evaluate the file (since it's a TypeScript export)
    const fileContent = fs.readFileSync(blogPostsPath, 'utf-8');
    
    // Extract the blogPosts array using regex
    const arrayMatch = fileContent.match(/export const blogPosts = (\[[\s\S]*?\]);/);
    if (!arrayMatch) {
      console.error('❌ Could not parse blog-posts.ts file');
      return;
    }

    // Use eval to parse the array (safe in this context as it's our own file)
    const blogPosts: BlogPostData[] = eval(arrayMatch[1]);

    console.log(`Found ${blogPosts.length} blog posts to import\n`);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const post of blogPosts) {
      try {
        // Check if post already exists
        const existing = await prisma.blogPost.findUnique({
          where: { slug: post.slug },
        });

        const date = parseDate(post.date);
        const publishedDate = date;

        const postData = {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content || post.excerpt,
          image: post.image,
          alt: post.alt || null,
          category: post.category,
          date: date,
          publishedDate: publishedDate,
          status: 'published' as const,
          metaTitle: post.title,
          metaDescription: post.metaDescription || post.excerpt,
          tags: post.tags || [],
          faqs: post.faqs && post.faqs.length > 0 ? post.faqs : null,
        };

        if (existing) {
          // Update existing post
          await prisma.blogPost.update({
            where: { slug: post.slug },
            data: postData,
          });
          updated++;
          console.log(`✅ Updated: ${post.title}`);
        } else {
          // Create new post
          await prisma.blogPost.create({
            data: postData,
          });
          imported++;
          console.log(`✅ Imported: ${post.title}`);
        }
      } catch (error: any) {
        console.error(`❌ Error importing "${post.title}":`, error.message);
        skipped++;
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total: ${blogPosts.length}\n`);

  } catch (error: any) {
    console.error('❌ Error importing blogs:', error);
  }
}

async function importFromWebsite() {
  console.log('🌐 Scraping blogs from peptidesskin.com...\n');
  
  try {
    const puppeteer = await import('puppeteer').catch(() => null);
    
    if (!puppeteer) {
      console.log('❌ Puppeteer is not installed.');
      console.log('📦 Install it with: npm install puppeteer');
      console.log('\n💡 Tip: Use --from-file to import from existing blog-posts.ts file instead.');
      return;
    }

    console.log('🚀 Launching browser...');
    const browser = await puppeteer.default.launch({ headless: true });
    const page = await browser.newPage();

    console.log('📖 Navigating to /blogs/news...');
    await page.goto('https://peptidesskin.com/blogs/news', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for blog posts to load
    await page.waitForSelector('article, .blog-card, [class*="blog"]', { timeout: 10000 }).catch(() => {
      console.log('⚠️  Could not find blog posts selector, trying alternative selectors...');
    });

    // Extract blog post links
    const blogLinks = await page.evaluate(() => {
      const links: string[] = [];
      const anchors = document.querySelectorAll('a[href*="/blogs/news/"]');
      anchors.forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (href && !links.includes(href)) {
          links.push(href);
        }
      });
      return links;
    });

    console.log(`Found ${blogLinks.length} blog post links\n`);

    const blogPosts: BlogPostData[] = [];

    for (let i = 0; i < blogLinks.length; i++) {
      const link = blogLinks[i];
      const fullUrl = link.startsWith('http') ? link : `https://peptidesskin.com${link}`;
      
      console.log(`📄 Scraping ${i + 1}/${blogLinks.length}: ${link}`);

      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        
        const postData = await page.evaluate(() => {
          const getText = (selector: string) => {
            const el = document.querySelector(selector);
            return el?.textContent?.trim() || '';
          };

          const getAttribute = (selector: string, attr: string) => {
            const el = document.querySelector(selector);
            return el?.getAttribute(attr) || '';
          };

          const getImage = () => {
            const img = document.querySelector('article img, .blog-post img, [class*="blog"] img');
            return img?.getAttribute('src') || img?.getAttribute('data-src') || '';
          };

          const slug = window.location.pathname.split('/').pop() || '';
          const title = getText('h1, article h1, .blog-title, [class*="title"]');
          const excerpt = getText('meta[name="description"], .excerpt, [class*="excerpt"]');
          const image = getImage();
          const alt = document.querySelector('article img, .blog-post img')?.getAttribute('alt') || '';
          const category = getText('[class*="category"], .category, .post-category');
          const date = getText('[class*="date"], .date, .post-date, time');
          const content = document.querySelector('article, .blog-content, [class*="content"]')?.innerHTML || '';

          return {
            slug,
            title,
            excerpt,
            image,
            alt,
            category: category || 'NEWS',
            date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
            content,
            tags: [],
          };
        });

        blogPosts.push(postData as BlogPostData);
        console.log(`   ✅ Scraped: ${postData.title}`);
      } catch (error: any) {
        console.error(`   ❌ Error scraping ${link}:`, error.message);
      }
    }

    await browser.close();

    console.log(`\n📚 Scraped ${blogPosts.length} blog posts. Now importing to database...\n`);

    // Import to database
    let imported = 0;
    let updated = 0;

    for (const post of blogPosts) {
      try {
        const date = parseDate(post.date);
        const existing = await prisma.blogPost.findUnique({
          where: { slug: post.slug },
        });

        const postData = {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || post.title,
          content: post.content || post.excerpt || post.title,
          image: post.image,
          alt: post.alt || null,
          category: post.category,
          date: date,
          publishedDate: date,
          status: 'published' as const,
          metaTitle: post.title,
          metaDescription: post.excerpt || post.title,
          tags: post.tags || [],
        };

        if (existing) {
          await prisma.blogPost.update({
            where: { slug: post.slug },
            data: postData,
          });
          updated++;
        } else {
          await prisma.blogPost.create({
            data: postData,
          });
          imported++;
        }
      } catch (error: any) {
        console.error(`❌ Error importing "${post.title}":`, error.message);
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   📝 Total: ${blogPosts.length}\n`);

  } catch (error: any) {
    console.error('❌ Error scraping blogs:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const fromFile = args.includes('--from-file');
  const fromWebsite = args.includes('--from-website');

  try {
    if (fromWebsite) {
      await importFromWebsite();
    } else {
      // Default to importing from file
      await importFromFile();
    }
  } catch (error: any) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

