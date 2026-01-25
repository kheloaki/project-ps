"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category.trim()) {
      toast.error('Category name is required');
      return;
    }

    // Since categories are just strings on products (not a separate model),
    // we'll just redirect back to categories page with a success message.
    // The category will be available when creating products.
    toast.success(`Category "${formData.category}" is ready to use when creating products!`);
    router.push('/admin/categories');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Category</h1>
        <p className="text-gray-600">Create a new category for your products</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
        <div className="mb-6 p-4 bg-[#8A773E]/10 border border-[#8A773E]/30 rounded-lg">
          <p className="text-sm text-[#8A773E]">
            <strong>Note:</strong> Categories are automatically created when you assign them to products. 
            You can enter a category name here to reference it when creating products. 
            Use the format &quot;Parent &gt; Child &gt; Subcategory&quot; for hierarchical categories.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g., Business & Industrial > Science & Laboratory > Biochemicals"
            />
            <p className="mt-1 text-sm text-gray-500">
              Use format: &quot;Parent &gt; Child &gt; Subcategory&quot; for hierarchical categories
            </p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/categories"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Categories</h2>
        <p className="text-sm text-gray-600 mb-4">
          Here are some examples of existing categories in your system:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Business &amp; Industrial &gt; Science &amp; Laboratory &gt; Biochemicals</li>
          <li>• Health &amp; Beauty &gt; Health Care</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          Categories are automatically created when you assign them to products during product creation.
        </p>
      </div>
    </div>
  );
}

