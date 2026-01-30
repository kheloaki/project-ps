import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';

export default async function BlogTagsPage() {
  await requireAdmin();

  let tags: string[] = [];
  
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        tags: true,
      },
    });

    // Flatten and get unique tags
    const allTags = posts.flatMap(post => post.tags || []);
    tags = Array.from(new Set(allTags)).filter(Boolean).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
  }

  // Count posts per tag
  const tagCounts: Record<string, number> = {};
  try {
    const allPosts = await prisma.blogPost.findMany({
      select: { tags: true },
    });
    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });
  } catch (error) {
    console.error('Error counting tags:', error);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-bold text-teal-700 mb-2">Blog Tags</h1>
        <p className="text-gray-600">Manage blog post tags</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {tags.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No tags found. Tags are automatically created when you add them to blog posts.
          </div>
        ) : (
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200"
                >
                  <span className="text-sm font-medium">{tag}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">
                    {tagCounts[tag] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

