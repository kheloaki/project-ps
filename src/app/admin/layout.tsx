import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  FileText, 
  ShoppingCart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';

async function checkAdminAccess() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in?redirect=/admin');
  }

  const user = await currentUser();
  
  // Check if user has admin role in Clerk
  // You can customize this based on your Clerk organization/role setup
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                  user?.publicMetadata?.isAdmin === true ||
                  process.env.ADMIN_USER_IDS?.split(',').includes(userId);

  if (!isAdmin) {
    redirect('/');
  }

  return { user, userId };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 flex flex-col">
          <div className="p-6 flex-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#5D6B98] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-gray-500">Peptide Researches</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h2>
              
              <AdminNav />
            </nav>
          </div>

          {/* Back to Site Button */}
          <div className="p-6 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-[#5D6B98] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div className="flex items-center gap-2 text-[#5D6B98] group-hover:text-[#4A5678]">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Site</span>
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}

