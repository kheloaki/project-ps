import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Package, MapPin, CreditCard, Heart, Settings, ChevronRight } from 'lucide-react';

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in?redirect=/account');
  }

  const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const firstName = user.firstName || fullName.split(' ')[0] || 'User';
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '';

  // TODO: Fetch actual stats from database
  const stats = {
    totalOrders: 0,
    wishlistItems: 0,
    reviews: 0,
    accountStatus: 'Active',
  };

  const accountCards = [
    {
      title: 'My Orders',
      description: 'Track, return, or buy things again.',
      icon: Package,
      href: '/orders',
      color: 'text-green-600',
    },
    {
      title: 'Addresses',
      description: 'Manage your shipping addresses.',
      icon: MapPin,
      href: '/account/addresses',
      color: 'text-green-600',
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payment options.',
      icon: CreditCard,
      href: '/account/payment-methods',
      color: 'text-green-600',
    },
    {
      title: 'Wishlist',
      description: 'Your saved items.',
      icon: Heart,
      href: '/account/wishlist',
      color: 'text-green-600',
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences.',
      icon: Settings,
      href: '/account/settings',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={fullName}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#8A773E] flex items-center justify-center text-white text-2xl font-medium">
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {firstName}!
              </h1>
              <p className="text-sm text-gray-600 mt-1">{email}</p>
            </div>
          </div>
        </div>

        {/* Account Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {accountCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`${card.color} flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                </div>
              </Link>
            );
          })}
          {/* Empty placeholder card */}
          <div className="bg-white rounded-lg shadow-sm p-6 opacity-0 pointer-events-none" />
        </div>

        {/* Account Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Account Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.wishlistItems}
              </div>
              <div className="text-sm text-gray-600">Wishlist Items</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.reviews}
              </div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats.accountStatus}
              </div>
              <div className="text-sm text-gray-600">Account Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

