import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductByHandle, searchProducts } from '@/lib/db/products';
import productsData from '@/data/products.json';

/**
 * GET /api/products
 * Get all products or search products
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const handle = searchParams.get('handle');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    if (handle) {
      const product = await getProductByHandle(handle);
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    if (search) {
      try {
        // Try database search first
        const dbProducts = await searchProducts(search);
        if (dbProducts.length > 0) {
          return NextResponse.json({ products: dbProducts });
        }
      } catch (error) {
        console.error('Database search error:', error);
      }
      
      // Fallback to JSON search if database search fails or returns no results
      const searchTerm = search.toLowerCase().trim();
      const jsonProducts = (productsData as any[]).filter((product) => {
        const searchableFields = [
          product.title,
          product.handle,
          product.description,
          product.bodyHtml || '',
          product.seoTitle || '',
          product.seoDescription || '',
          product.category,
        ].map(field => (field || '').toLowerCase());
        
        return searchableFields.some(field => field.includes(searchTerm));
      });
      
      return NextResponse.json({ products: jsonProducts });
    }

    if (category) {
      const products = await getAllProducts();
      const filtered = products.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
      return NextResponse.json({ products: filtered });
    }

    const products = await getAllProducts();
    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;
    return NextResponse.json({ products: limitedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

