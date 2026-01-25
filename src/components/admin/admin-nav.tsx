"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  FileText, 
  ShoppingCart,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/blog', icon: FileText, label: 'Blog', hasSubmenu: true },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
                        (item.href !== '/admin' && pathname.startsWith(item.href));
        
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
            {item.hasSubmenu && (
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>
        );
      })}
    </>
  );
}

