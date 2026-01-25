import React from "react";
import { Metadata } from "next";
import CollectionHero from "@/components/sections/collection-hero";
import ProductFilters from "@/components/sections/product-filters";
import ProductGrid from "@/components/sections/product-grid";
import { generateBreadcrumbSchema, generateCollectionSchema } from "@/lib/schema";
import productsData from "@/data/products.json";

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const { handle } = await params;
  const title = handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${title} | Peptides Skin`,
    description: `Explore our ${title} collection. High-purity research peptides and supplies.`,
    alternates: {
      canonical: `/collections/${handle}`,
    },
  };
}

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const { handle } = await params;
  const title = handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Filter products for schema
  const filteredProducts = handle === 'all' 
    ? productsData 
    : productsData.filter(p => p.category.toLowerCase().includes(handle.replace('-', ' ')));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: 'https://peptidesskin.com' },
    { name: title, item: `https://peptidesskin.com/collections/${handle}` },
  ]);

  const collectionSchema = generateCollectionSchema({
    handle,
    title,
    products: filteredProducts
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="flex flex-col w-full bg-background pt-[48px]">
        <CollectionHero title={title} />
        <ProductFilters />
        <ProductGrid products={filteredProducts.length > 0 ? filteredProducts as any : productsData as any} />
      </div>
    </>
  );
}
