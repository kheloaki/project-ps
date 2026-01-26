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
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog'],
  },
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
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
