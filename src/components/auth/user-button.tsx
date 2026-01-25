"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Package, Settings, LogOut } from 'lucide-react';

export function AuthUserButton() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '';

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-full overflow-hidden hover:opacity-80 transition-opacity">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={fullName}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#8A773E] flex items-center justify-center text-white text-sm font-medium">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-0">
        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">{fullName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{email}</p>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">My Account</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">My Orders</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>

        {/* Separator */}
        <DropdownMenuSeparator />

        {/* Sign Out */}
        <div className="py-1">
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

