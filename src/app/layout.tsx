import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateRootSchema } from "@/lib/schema";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { AdminWrapper } from "@/components/admin/admin-wrapper";
import { CartSidebarWrapper } from "@/components/cart/cart-sidebar-wrapper";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { DisableRightClick } from "@/components/disable-right-click";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peptidesskin.com"),
  title: "Peptides Skin - Precision Synthesis for Research",
  description: "Peptides Skin provides high-purity peptides and B2B bulk synthesis for global research and biotechnology.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchema = generateRootSchema();

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
          />
          <DisableRightClick />
          <CartProvider>
            <AdminWrapper>
              <main className="min-h-screen">
                {children}
              </main>
            </AdminWrapper>
            <CartSidebarWrapper />
            <Toaster position="top-center" />
          </CartProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
