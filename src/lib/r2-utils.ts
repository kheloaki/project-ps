/**
 * Utility functions for working with R2 image URLs
 */

/**
 * Get optimized image URL from R2
 * Can be used with Next.js Image component
 */
export function getR2ImageUrl(key: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;
  
  if (!baseUrl) {
    console.warn('R2_PUBLIC_URL not configured');
    return key;
  }

  // Remove leading slash from key if present
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  let url = `${baseUrl}/${cleanKey}`;

  // Add query parameters for optimization if needed
  // Note: R2 doesn't have built-in image optimization
  // You might want to use Cloudflare Images or a CDN for this
  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format) params.append('f', options.format);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  return url;
}

/**
 * Extract key from R2 URL
 */
export function extractR2Key(url: string): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;
  
  if (!baseUrl) return null;
  
  if (url.startsWith(baseUrl)) {
    return url.replace(baseUrl + '/', '');
  }
  
  return null;
}

/**
 * Check if URL is an R2 URL
 */
export function isR2Url(url: string): boolean {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;
  return baseUrl ? url.startsWith(baseUrl) : false;
}

