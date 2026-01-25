import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getProductByHandle } from '@/lib/db/products';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema';
import ProductHero from '@/components/sections/product-hero';
import ProductDetails from '@/components/sections/product-details';
import CoAResourceSection from '@/components/sections/coa-resource';
import CustomSection from '@/components/sections/custom-section';
import CompanyTrustBadges from '@/components/sections/company-trust-badges';
import { CartButtonWrapper } from '@/components/cart/cart-button-wrapper';

interface Variant {
  id: string;
  title: string;
  price: string;
}

interface ImageMetadata {
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
  description: string;
  bodyHtml?: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  coaImageUrl?: string;
  variants?: Variant[];
  images?: string[];
  sections?: {
    productHero?: boolean;
    productDetails?: boolean;
    coaResource?: boolean;
    customSection?: {
      enabled?: boolean;
      title?: string;
      content?: string;
    };
    companyTrustBadges?: boolean;
  };
  // Legacy support for customSection at root level
  customSection?: {
    enabled?: boolean;
    title?: string;
    content?: string;
  };
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.description,
    alternates: {
      canonical: `/products/${handle}`,
    },
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { handle } = await params;
  const dbProduct = await getProductByHandle(handle);

  if (!dbProduct) {
    notFound();
  }

  // Transform database product to match the expected interface
  const product: Product = {
    id: dbProduct.id,
    handle: dbProduct.handle,
    title: dbProduct.title,
    price: dbProduct.price,
    image: dbProduct.image,
    description: dbProduct.description,
    bodyHtml: dbProduct.bodyHtml || undefined,
    seoTitle: dbProduct.seoTitle || undefined,
    seoDescription: dbProduct.seoDescription || undefined,
    category: dbProduct.category,
    coaImageUrl: (dbProduct as any).coaImageUrl || undefined,
    variants: (dbProduct.variants && dbProduct.variants.length > 0) 
      ? dbProduct.variants.map((v) => ({
          id: v.id,
          title: v.title,
          price: v.price,
        }))
      : [],
    // Collect all images: product.images array + main product image + variant images (if they exist)
    images: (() => {
      const imageSet = new Set<string>();
      
      // First, add images from the product.images array (if it exists)
      if ((dbProduct as any).images && Array.isArray((dbProduct as any).images)) {
        (dbProduct as any).images.forEach((img: string) => {
          if (img && img.trim() !== '') {
            imageSet.add(img);
          }
        });
      }
      
      // Add main product image (if not already in images array)
      if (dbProduct.image) imageSet.add(dbProduct.image);
      
      // Add variant images
      if (dbProduct.variants && dbProduct.variants.length > 0) {
        dbProduct.variants.forEach((v: any) => {
          if (v.image && v.image.trim() !== '') {
            imageSet.add(v.image);
          }
        });
      }
      
      const imagesArray = Array.from(imageSet);
      // Debug: log images for troubleshooting
      console.log('Product images collected:', {
        productImagesArray: (dbProduct as any).images || [],
        mainImage: dbProduct.image,
        variantCount: dbProduct.variants?.length || 0,
        variantImages: dbProduct.variants?.map((v: any) => v.image).filter(Boolean) || [],
        totalImages: imagesArray.length,
        images: imagesArray
      });
      return imagesArray;
    })(),
    sections: {
      productHero: true,
      productDetails: true,
      coaResource: true,
      companyTrustBadges: true,
    }, // Default: show all sections
    customSection: undefined,
  };

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: 'https://peptidesskin.com' },
    { name: 'Products', item: 'https://peptidesskin.com/collections/all' },
    { name: product.title, item: `https://peptidesskin.com/products/${handle}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-white pt-[48px]">
        <main>
          {/* Cart Button - Fixed Position */}
          <CartButtonWrapper />
          
          <div className="container mx-auto px-4">
            {/* Product Hero - enabled by default */}
            {(product.sections?.productHero !== false) && (
              <ProductHero product={product} />
            )}
            
            {/* Product Details - enabled by default */}
            {(product.sections?.productDetails !== false) && (
              <ProductDetails product={{
                title: product.title,
                bodyHtml: product.bodyHtml,
                description: product.description,
                coaImageUrl: product.coaImageUrl,
              }} />
            )}
            
            {/* COA Resource Section - only show if COA image is uploaded */}
            {(product.sections?.coaResource !== false) && product.coaImageUrl && (
              <CoAResourceSection coaImageUrl={product.coaImageUrl} />
            )}
            
            {/* Custom Section */}
            <CustomSection 
              title={product.sections?.customSection?.title || product.customSection?.title}
              content={product.sections?.customSection?.content || product.customSection?.content}
              enabled={product.sections?.customSection?.enabled || product.customSection?.enabled || false}
            />
          </div>
          
          {/* Company Trust Badges - enabled by default */}
          {(product.sections?.companyTrustBadges !== false) && (
            <CompanyTrustBadges />
          )}

          {/* Return to Collection */}
          <div className="mt-20 pt-10 border-t border-zinc-100 flex justify-center">
            <Link 
              href="/collections/all" 
              className="group flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-zinc-500 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Return to Collection
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
