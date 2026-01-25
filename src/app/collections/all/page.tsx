import { Metadata } from "next";
import CollectionHero from "@/components/sections/collection-hero";
import CollectionFilters from "@/components/sections/collection-filters";
import ProductGrid from "@/components/sections/product-grid";
import { generateBreadcrumbSchema } from "@/lib/schema";
import productsData from "@/data/products.json";

export const metadata: Metadata = {
  title: "All Products | Peptides Skin",
  description: "Browse our full catalog of high-purity research peptides and laboratory supplies.",
  alternates: {
    canonical: "/collections/all",
  },
};

export default function AllCollectionsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: 'https://peptidesskin.com' },
    { name: 'All Products', item: 'https://peptidesskin.com/collections/all' },
  ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <div className="bg-white pt-[48px]">
          <CollectionHero title="All Products" />
          <CollectionFilters />
          <ProductGrid products={productsData} />
        </div>
      </>
    );
}
