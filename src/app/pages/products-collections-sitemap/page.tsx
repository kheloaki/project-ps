import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import productsData from '@/data/products.json';
import { blogPosts } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: "Sitemap - Products, Collections & News | Peptides Skin",
  description: "Browse our complete directory of research peptides, collections, and the latest news articles from Peptides Skin.",
  alternates: {
    canonical: "/pages/products-collections-sitemap",
  },
};

  export default function SitemapPage() {
    const collections = [
      { name: "All Products", handle: "all" },
      { name: "Best Sellers", handle: "best-sellers" },
      { name: "New Arrivals", handle: "new-arrivals" },
      { name: "Research Peptides", handle: "research-peptides" },
      { name: "Metabolic Research", handle: "metabolic-research" },
      { name: "Regenerative Studies", handle: "regenerative-studies" },
    ];

    return (
      <div className="min-h-screen bg-white pt-[48px]">
        <main className="container mx-auto px-5 py-20 max-w-[1100px]">
          <h1 className="text-4xl font-bold mb-12 uppercase tracking-tight">Site Directory</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-8 pb-2 border-b-2 border-black/5">Collections</h2>
              <ul className="space-y-4">
                {collections.map((col) => (
                  <li key={col.handle}>
                    <Link href={`/collections/${col.handle}`} className="text-[15px] text-gray-600 hover:text-black transition-colors font-medium">
                      {col.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-8 pb-2 border-b-2 border-black/5">Products ({productsData.length})</h2>
              <ul className="space-y-4">
                {[...productsData].sort((a, b) => a.title.localeCompare(b.title)).map((product) => (
                  <li key={product.handle}>
                    <Link href={`/products/${product.handle}`} className="text-[15px] text-gray-600 hover:text-black transition-colors font-medium">
                      {product.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-8 pb-2 border-b-2 border-black/5">News Articles ({blogPosts.length})</h2>
              <ul className="space-y-4">
                {blogPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blogs/news/${post.slug}`} className="text-[15px] text-gray-600 hover:text-black transition-colors font-medium">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    );
  }
