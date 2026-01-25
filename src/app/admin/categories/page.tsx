import { prisma } from '@/lib/prisma';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCategories() {
  // Get unique categories from products
  let products = [];
  
  try {
    products = await prisma.product.findMany({
      select: { category: true },
    });
  } catch (error) {
    // Table doesn't exist yet, return empty array
    console.error('Error fetching products:', error);
  }

  const categories = Array.from(
    new Set(products.map((p) => p.category.split('>').pop()?.trim() || p.category))
  ).sort();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-teal-500 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
              <p className="text-sm text-gray-500">
                {products.filter((p) => 
                  (p.category.split('>').pop()?.trim() || p.category) === category
                ).length} products
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

