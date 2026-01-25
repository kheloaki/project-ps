import React from "react";
import { Mail, MapPin, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Peptides Skin",
  description: "Get in touch with Peptides Skin for questions about our research peptides, bulk orders, or your current shipment.",
  alternates: {
    canonical: "/pages/contact",
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-white pt-[48px]">
      <main className="container mx-auto max-w-[1200px] px-5 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-3xl font-bold mb-6 uppercase tracking-tight text-[#111827]">Contact Us</h1>
            <p className="text-[#4b5563] mb-10 leading-relaxed">
              Have questions about our research peptides or your order? Our team is here to help. Please fill out the form or reach out via email.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#8A773E]/10 p-3 rounded-full text-[#8A773E]">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] uppercase text-sm">Email</h3>
                  <p className="text-[#4b5563]">support@peptidesskin.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#8A773E]/10 p-3 rounded-full text-[#8A773E]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] uppercase text-sm">Location</h3>
                  <p className="text-[#4b5563]">United States (B2B Research Supplier)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#8A773E]/10 p-3 rounded-full text-[#8A773E]">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] uppercase text-sm">Hours</h3>
                  <p className="text-[#4b5563]">Monday - Friday: 9am - 5pm EST</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#111827] uppercase mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8A773E] focus:ring-1 focus:ring-[#8A773E] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111827] uppercase mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8A773E] focus:ring-1 focus:ring-[#8A773E] outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111827] uppercase mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8A773E] focus:ring-1 focus:ring-[#8A773E] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111827] uppercase mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8A773E] focus:ring-1 focus:ring-[#8A773E] outline-none transition-all"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#111827] text-white font-bold py-4 rounded-lg uppercase tracking-wider hover:bg-black transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
