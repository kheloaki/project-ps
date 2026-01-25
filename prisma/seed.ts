import { PrismaClient } from '@prisma/client';
import productsData from '../src/data/products.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Products
  console.log('📦 Seeding products...');
  for (const productData of productsData as any[]) {
    const product = await prisma.product.upsert({
      where: { handle: productData.handle },
      update: {
        title: productData.title,
        price: productData.price,
        image: productData.image,
        description: productData.description,
        bodyHtml: productData.bodyHtml,
        seoTitle: productData.seoTitle,
        seoDescription: productData.seoDescription,
        category: productData.category,
      },
      create: {
        handle: productData.handle,
        title: productData.title,
        price: productData.price,
        image: productData.image,
        description: productData.description,
        bodyHtml: productData.bodyHtml,
        seoTitle: productData.seoTitle,
        seoDescription: productData.seoDescription,
        category: productData.category,
        variants: {
          create: (productData.variants || []).map((variant: any) => ({
            title: variant.title,
            price: variant.price,
            sku: variant.sku,
            image: variant.image,
          })),
        },
      },
    });

    console.log(`✅ Seeded product: ${product.title}`);
  }

  console.log('✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

