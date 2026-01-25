import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Peptides Skin",
  description: "Review our shipping processing times, international delivery options, and policies for research peptide shipments.",
  alternates: {
    canonical: "/policies/shipping-policy",
  },
};

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white pt-[48px]">
      <main className="container mx-auto max-w-[800px] px-5 py-20">
        <h1 className="text-3xl font-bold mb-10 uppercase tracking-tight text-[#111827]">Shipping Policy</h1>
        <div className="prose prose-slate max-w-none text-[#4b5563] space-y-6">
          <p>Last updated: January 11, 2026</p>
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Processing Time</h2>
          <p>Orders are typically processed within 1-2 business days (Monday-Friday, excluding holidays). You will receive a shipping confirmation email with tracking information once your order has been dispatched.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Shipping Methods</h2>
          <p>We offer several shipping options to meet your needs, including standard and expedited shipping. Delivery times vary based on the destination and the shipping method selected at checkout.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">International Shipping</h2>
          <p>We ship internationally to most countries. Please note that international orders may be subject to import duties and taxes, which are the responsibility of the customer.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Undeliverable Packages</h2>
          <p>If a package is returned to us as undeliverable due to an incorrect address provided by the customer, the customer will be responsible for the cost of re-shipping the package.</p>
        </div>
      </main>
    </div>
  );
}
