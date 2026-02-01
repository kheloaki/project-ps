"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  FileText, 
  ShoppingCart,
  Image as ImageIcon,
  ChevronDown,
  FileText as FileTextIcon,
  FolderTree,
  Tags as TagsIcon
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/blog', icon: FileText, label: 'Blog', hasSubmenu: true },
  { href: '/admin/media', icon: ImageIcon, label: 'Media' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/hero-images', icon: ImageIcon, label: 'Hero Images' },
];

const blogSubmenu = [
  { href: '/admin/blog', icon: FileTextIcon, label: 'All Posts' },
  { href: '/admin/blog/categories', icon: FolderTree, label: 'Categories' },
  { href: '/admin/blog/tags', icon: TagsIcon, label: 'Tags' },
];

export function AdminNav() {
  const pathname = usePathname();
  const isBlogActive = pathname?.startsWith('/admin/blog') ?? false;
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  
  // Set initial expanded state after mount to avoid hydration mismatch
  useEffect(() => {
    setIsBlogExpanded(isBlogActive);
  }, [isBlogActive]);

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
                        (item.href !== '/admin' && pathname.startsWith(item.href));
        
        if (item.hasSubmenu && item.href === '/admin/blog') {
          return (
            <div key={item.href}>
              <button
                onClick={() => setIsBlogExpanded(!isBlogExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isBlogActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${isBlogExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              {isBlogExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                  {blogSubmenu.map((subItem) => {
                    const isSubActive = pathname === subItem.href || 
                                       (subItem.href === '/admin/blog' && pathname === '/admin/blog');
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          isSubActive
                            ? 'bg-teal-600 text-white'
                            : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
              isActive
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </>
  );
}

