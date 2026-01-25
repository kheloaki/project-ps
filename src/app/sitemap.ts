import { MetadataRoute } from 'next';
import productsData from '@/data/products.json';
import { blogPosts } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://peptidesskin.com';

  // Base pages
  const routes = [
    '',
    '/collections/all',
    '/blogs/news',
    '/pages/about-us',
    '/pages/contact',
      '/pages/faq',
      '/pages/peptide-calculator',
      '/pages/products-collections-sitemap',
      '/policies/privacy-policy',
    '/policies/refund-policy',
    '/policies/shipping-policy',
    '/policies/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Product pages
  const productRoutes = productsData.map((product) => ({
    url: `${baseUrl}/products/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Blog posts
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/news/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes, ...blogRoutes];
}
