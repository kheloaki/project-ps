import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ProductData {
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

/**
 * Create products from a JSON file
 */
async function createProductsFromFile(filePath: string) {
  console.log(`📖 Reading products from: ${filePath}`);
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const products: ProductData[] = JSON.parse(fileContent);

  console.log(`📦 Found ${products.length} products to process\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const productData of products) {
    try {
      // Validate required fields
      if (!productData.handle || !productData.title || !productData.price || !productData.image || !productData.description || !productData.category) {
        console.log(`⚠️  Skipping product: Missing required fields - ${productData.title || productData.handle}`);
        skipped++;
        continue;
      }

      // Check if product already exists
      const existing = await prisma.product.findUnique({
        where: { handle: productData.handle },
      });

      if (existing) {
        // Update existing product
        await prisma.product.update({
          where: { handle: productData.handle },
          data: {
            title: productData.title,
            price: productData.price,
            image: productData.image,
            images: productData.images || [],
            description: productData.description,
            bodyHtml: productData.bodyHtml || null,
            seoTitle: productData.seoTitle || null,
            seoDescription: productData.seoDescription || null,
            category: productData.category,
            coaImageUrl: productData.coaImageUrl || null,
          },
        });

        // Update variants if provided
        if (productData.variants && productData.variants.length > 0) {
          // Delete existing variants
          await prisma.productVariant.deleteMany({
            where: { productId: existing.id },
          });

          // Create new variants
          await prisma.productVariant.createMany({
            data: productData.variants.map((variant) => ({
              productId: existing.id,
              title: variant.title,
              price: variant.price,
              sku: variant.sku || null,
              image: variant.image || null,
            })),
          });
        }

        console.log(`✅ Updated: ${productData.title}`);
        updated++;
      } else {
        // Create new product
        const product = await prisma.product.create({
          data: {
            handle: productData.handle,
            title: productData.title,
            price: productData.price,
            image: productData.image,
            images: productData.images || [],
            description: productData.description,
            bodyHtml: productData.bodyHtml || null,
            seoTitle: productData.seoTitle || null,
            seoDescription: productData.seoDescription || null,
            category: productData.category,
            coaImageUrl: productData.coaImageUrl || null,
            variants: {
              create: (productData.variants || []).map((variant) => ({
                title: variant.title,
                price: variant.price,
                sku: variant.sku || null,
                image: variant.image || null,
              })),
            },
          } as any,
        });

        console.log(`✨ Created: ${product.title}`);
        created++;
      }
    } catch (error: any) {
      console.error(`❌ Error processing ${productData.title || productData.handle}:`, error.message);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✨ Created: ${created}`);
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
}

/**
 * Create a single product manually
 */
async function createSingleProduct(productData: ProductData) {
  try {
    // Validate required fields
    if (!productData.handle || !productData.title || !productData.price || !productData.image || !productData.description || !productData.category) {
      throw new Error('Missing required fields: handle, title, price, image, description, category');
    }

    // Check if product already exists
    const existing = await prisma.product.findUnique({
      where: { handle: productData.handle },
    });

    if (existing) {
      console.log(`⚠️  Product with handle "${productData.handle}" already exists. Updating...`);
      
      const updated = await prisma.product.update({
        where: { handle: productData.handle },
        data: {
          title: productData.title,
          price: productData.price,
          image: productData.image,
          images: productData.images || [],
          description: productData.description,
          bodyHtml: productData.bodyHtml || null,
          seoTitle: productData.seoTitle || null,
          seoDescription: productData.seoDescription || null,
          category: productData.category,
          coaImageUrl: productData.coaImageUrl || null,
        },
      });

      console.log(`✅ Updated product: ${updated.title}`);
      return updated;
    } else {
      const product = await prisma.product.create({
        data: {
          handle: productData.handle,
          title: productData.title,
          price: productData.price,
          image: productData.image,
          images: productData.images || [],
          description: productData.description,
          bodyHtml: productData.bodyHtml || null,
          seoTitle: productData.seoTitle || null,
          seoDescription: productData.seoDescription || null,
          category: productData.category,
          coaImageUrl: productData.coaImageUrl || null,
          variants: {
            create: (productData.variants || []).map((variant) => ({
              title: variant.title,
              price: variant.price,
              sku: variant.sku || null,
              image: variant.image || null,
            })),
          },
        } as any,
      });

      console.log(`✨ Created product: ${product.title}`);
      return product;
    }
  } catch (error: any) {
    console.error(`❌ Error creating product:`, error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    if (command === 'file' && args[1]) {
      // Create products from file
      const filePath = path.resolve(args[1]);
      await createProductsFromFile(filePath);
    } else if (command === 'from-website') {
      // This would require puppeteer or similar
      console.log('🌐 Website scraping functionality');
      console.log('To scrape products from peptidesskin.com, you would need to:');
      console.log('1. Install puppeteer: npm install puppeteer');
      console.log('2. Create a scraping script to extract product data');
      console.log('3. Save the data to a JSON file');
      console.log('4. Run: npm run create-products file path/to/products.json');
      console.log('\nAlternatively, you can manually create a JSON file with product data and use the "file" command.');
    } else {
      console.log('📝 Product Creation Script');
      console.log('\nUsage:');
      console.log('  npm run create-products file <path-to-json-file>');
      console.log('  Example: npm run create-products file src/data/products.json');
      console.log('\n  npm run create-products from-website');
      console.log('  (Shows instructions for scraping from website)');
      console.log('\nProduct JSON Format:');
      console.log(JSON.stringify({
        handle: 'product-handle',
        title: 'Product Title',
        price: '$99.00 USD',
        image: 'https://example.com/image.jpg',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        description: 'Product description',
        bodyHtml: '<p>Full HTML content</p>',
        seoTitle: 'SEO Title',
        seoDescription: 'SEO Description',
        category: 'Business & Industrial > Science & Laboratory > Biochemicals',
        coaImageUrl: 'https://example.com/coa.jpg',
        variants: [
          {
            title: 'Default Title',
            price: '$99.00 USD',
            sku: 'SKU-001',
            image: 'https://example.com/variant-image.jpg'
          }
        ]
      }, null, 2));
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

