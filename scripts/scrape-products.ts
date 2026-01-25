/**
 * Website Scraper for PeptidesSkin.com Products
 * 
 * This script scrapes product data from peptidesskin.com and saves it to a JSON file.
 * 
 * To use this script:
 * 1. Install puppeteer: npm install puppeteer
 * 2. Run: npm run scrape-products
 * 3. The products will be saved to scripts/scraped-products.json
 * 4. Then run: npm run create-products file scripts/scraped-products.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface ScrapedProduct {
  handle: string;
  title: string;
  price: string;
  image: string;
  images?: string[];
  description: string;
  bodyHtml?: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  coaImageUrl?: string;
  variants?: Array<{
    title: string;
    price: string;
    sku?: string;
    image?: string;
  }>;
}

async function scrapeProducts() {
  try {
    // Check if puppeteer is installed
    const puppeteer = await import('puppeteer').catch(() => null);
    
    if (!puppeteer) {
      console.log('❌ Puppeteer is not installed.');
      console.log('📦 Install it with: npm install puppeteer');
      console.log('\nAlternatively, you can manually create a JSON file with product data.');
      console.log('See the example format by running: npm run create-products');
      return;
    }

    console.log('🌐 Starting to scrape products from peptidesskin.com...\n');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to products page
    console.log('📄 Loading products page...');
    await page.goto('https://peptidesskin.com/products', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for products to load
    await page.waitForSelector('.product-item, [class*="product"], .product-card', { timeout: 10000 }).catch(() => {
      console.log('⚠️  Could not find product selectors. The website structure may have changed.');
    });

    // Extract product data
    console.log('🔍 Extracting product data...');
    const products: ScrapedProduct[] = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.product-item, [class*="product"], .product-card, article');
      const scrapedProducts: ScrapedProduct[] = [];

      productElements.forEach((element) => {
        try {
          // Try to extract product information
          // These selectors may need to be adjusted based on the actual website structure
          const titleElement = element.querySelector('h2, h3, .product-title, [class*="title"]');
          const priceElement = element.querySelector('.price, [class*="price"], .product-price');
          const imageElement = element.querySelector('img');
          const linkElement = element.querySelector('a');

          if (titleElement && priceElement) {
            const title = titleElement.textContent?.trim() || '';
            const price = priceElement.textContent?.trim() || '';
            const image = imageElement?.getAttribute('src') || imageElement?.getAttribute('data-src') || '';
            const href = linkElement?.getAttribute('href') || '';

            // Generate handle from title or URL
            const handle = href
              ? href.split('/').pop()?.split('?')[0] || ''
              : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            if (title && price && handle) {
              scrapedProducts.push({
                handle,
                title,
                price,
                image: image.startsWith('http') ? image : `https://peptidesskin.com${image}`,
                description: title, // Default description
                category: 'Business & Industrial > Science & Laboratory > Biochemicals',
                variants: [
                  {
                    title: 'Default Title',
                    price,
                  },
                ],
              });
            }
          }
        } catch (error) {
          console.error('Error extracting product:', error);
        }
      });

      return scrapedProducts;
    });

    await browser.close();

    if (products.length === 0) {
      console.log('⚠️  No products found. The website structure may have changed.');
      console.log('💡 You may need to update the CSS selectors in this script.');
      return;
    }

    // Save to JSON file
    const outputPath = path.join(__dirname, 'scraped-products.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

    console.log(`\n✅ Successfully scraped ${products.length} products!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log('\n📝 Next steps:');
    console.log(`   npm run create-products file ${outputPath}`);

  } catch (error: any) {
    console.error('❌ Error scraping products:', error.message);
    console.log('\n💡 Alternative approach:');
    console.log('   1. Manually visit https://peptidesskin.com/products');
    console.log('   2. Copy product data and create a JSON file');
    console.log('   3. Run: npm run create-products file <path-to-json>');
  }
}

// Run if called directly
if (require.main === module) {
  scrapeProducts();
}

export { scrapeProducts };

