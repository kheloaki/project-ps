import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Peptides Skin",
  description: "Learn how Peptides Skin collects, uses, and protects your personal information when you use our website and services.",
  alternates: {
    canonical: "/policies/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-[48px]">
      <main className="container mx-auto max-w-[800px] px-5 py-20">
        <h1 className="text-3xl font-bold mb-10 uppercase tracking-tight text-[#111827]">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-[#4b5563] space-y-6">
          <p>Last updated: January 11, 2026</p>
          <p>This Privacy Policy describes how Peptides Skin (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from the Site or otherwise communicate with us.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Collecting Personal Information</h2>
          <p>When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Sharing Personal Information</h2>
          <p>We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example, we use Shopify to power our online store.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Behavioral Advertising</h2>
          <p>As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you.</p>
          
            <h2 className="text-xl font-semibold text-[#111827] uppercase">Cookies</h2>
            <p>A cookie is a small amount of information that's downloaded to your computer or device when you visit our Site. We use a number of different cookies, including functional, performance, advertising, and social media or content cookies.</p>

          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Contact</h2>
          <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at support@peptidesskin.com.</p>
        </div>
      </main>
    </div>
  );
}
