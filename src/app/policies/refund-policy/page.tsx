import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Peptides Skin",
  description: "Read our refund and return policy for research peptides and laboratory supplies. Understand our terms for damaged or missing items.",
  alternates: {
    canonical: "/policies/refund-policy",
  },
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white pt-[48px]">
      <main className="container mx-auto max-w-[800px] px-5 py-20">
        <h1 className="text-3xl font-bold mb-10 uppercase tracking-tight text-[#111827]">Refund Policy</h1>
        <div className="prose prose-slate max-w-none text-[#4b5563] space-y-6">
          <p>Last updated: January 11, 2026</p>
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Returns & Refunds</h2>
          <p>Due to the nature of our products being for laboratory research only, we generally do not accept returns. All sales are final once the product has been shipped.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Damaged or Missing Items</h2>
          <p>If your order arrives damaged or if items are missing, please contact us within 48 hours of delivery. We will require photographic evidence of the damaged packaging and product to process a replacement or credit.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Order Cancellations</h2>
          <p>Orders can only be cancelled before they have been processed for shipping. Once a tracking number has been generated, the order cannot be cancelled.</p>
          
          <h2 className="text-xl font-semibold text-[#111827] uppercase">Contact Us</h2>
          <p>If you have any questions regarding our refund policy, please contact us at support@peptidesskin.com.</p>
        </div>
      </main>
    </div>
  );
}
