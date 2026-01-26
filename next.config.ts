import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    rules: {
    }
  },
  async redirects() {
    return [
      {
        source: '/collections/frontpage',
        destination: '/collections/all',
        permanent: true,
      },
      {
        source: '/blogs/news.atom',
        destination: '/blogs/news',
        permanent: true,
      },
      {
        source: '/pages/sitemap',
        destination: '/pages/products-collections-sitemap',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/collections/all',
        permanent: true,
      },
      {
        source: '/collections',
        destination: '/collections/all',
        permanent: true,
      },
      {
        source: '/blogs',
        destination: '/blogs/news',
        permanent: true,
      },
      {
        source: '/pages/privacy-policy',
        destination: '/policies/privacy-policy',
        permanent: true,
      },
      {
        source: '/pages/terms-of-service',
        destination: '/policies/terms-of-service',
        permanent: true,
      },
      {
        source: '/pages/refund-policy',
        destination: '/policies/refund-policy',
        permanent: true,
      },
      {
        source: '/pages/shipping-policy',
        destination: '/policies/shipping-policy',
        permanent: true,
      },
    ];
  },
} as NextConfig;

export default nextConfig;
