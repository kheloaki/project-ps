import { prisma } from '@/lib/prisma';
import { Package, FileText, ShoppingCart, DollarSign, Activity, Plus } from 'lucide-react';
import Link from 'next/link';
import { UserSearch } from '@/components/admin/user-search';
import { SyncUserButton } from '@/components/admin/sync-user-button';

async function getDashboardStats() {
  try {
    const [products, blogPosts, orders, revenue] = await Promise.all([
      prisma.product.count().catch(() => 0),
      prisma.blogPost.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
      prisma.order.aggregate({
        where: { status: 'completed' },
        _sum: { total: true },
      }).catch(() => ({ _sum: { total: 0 } })),
    ]);

    const pendingOrders = await prisma.order.count({
      where: { status: 'pending' },
    }).catch(() => 0);

    return {
      totalProducts: products,
      totalBlogPosts: blogPosts,
      totalOrders: orders,
      pendingOrders,
      totalRevenue: revenue._sum.total || 0,
    };
  } catch (error) {
    // Return default values if tables don't exist yet
    return {
      totalProducts: 0,
      totalBlogPosts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          subtitle={`${stats.totalProducts} active`}
          icon={Package}
          iconColor="text-green-500"
        />
        <StatCard
          title="Blog Posts"
          value={stats.totalBlogPosts.toString()}
          subtitle={`${stats.totalBlogPosts} published`}
          icon={FileText}
          iconColor="text-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          subtitle={`${stats.pendingOrders} pending`}
          icon={ShoppingCart}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          subtitle="From completed orders"
          icon={DollarSign}
          iconColor="text-orange-500"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <ActivityItem
              type="system"
              title="System initialized"
              description="Admin panel is ready to use"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <p className="text-sm text-gray-500 mb-4">Common administrative tasks</p>
          <div className="space-y-3">
            <QuickAction
              href="/admin/products/new"
              icon={Plus}
              title="Create New Product"
              description="Add a new product to your catalog"
            />
            <QuickAction
              href="/admin/blog/new"
              icon={Plus}
              title="Create New Blog Post"
              description="Write and publish a new blog post"
            />
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          User Management
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Search for users and manage their roles
        </p>
        <SyncUserButton />
        <div className="mt-4">
          <UserSearch />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`${iconColor} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  type,
  title,
  description,
}: {
  type: 'system' | 'product' | 'order' | 'blog';
  title: string;
  description: string;
}) {
  const colors = {
    system: 'bg-[#8A773E]',
    product: 'bg-green-500',
    order: 'bg-purple-500',
    blog: 'bg-blue-500',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full ${colors[type]} mt-2`} />
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors group"
    >
      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors">
        <Icon className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 group-hover:text-teal-700">
          {title}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
