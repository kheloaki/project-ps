"use client";

import { usePathname } from 'next/navigation';
import { SectionRenderer } from "@/components/shopify/SectionRenderer";
import headerTemplate from "@/data/shopify/header-group.json";
import footerTemplate from "@/data/shopify/footer-group.json";
import AgeVerificationModal from "@/components/sections/age-verification-modal";

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SectionRenderer template={headerTemplate as any} />
      {children}
      <SectionRenderer template={footerTemplate as any} />
      <AgeVerificationModal />
    </>
  );
}

