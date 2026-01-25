"use client";

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement newsletter subscription API
    // For now, just simulate a submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 500);
  };

  return (
    <section className="bg-[#0B1321] text-white py-[60px] md:py-[80px] border-t border-[#1a2332]">
      <div className="container px-[30px] mx-auto max-w-[1230px]">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.1] uppercase tracking-[0.1em] mb-4">
            Stay Updated
          </h2>
          <p className="text-[16px] md:text-[18px] text-white/80 mb-8 leading-relaxed">
            Subscribe to our newsletter for the latest research updates, new product launches, and exclusive offers.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-[500px] mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#8A773E] focus:border-transparent transition-all"
              />
              <Button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="bg-[#8A773E] hover:bg-[#6B5E2F] text-white px-8 py-4 rounded-md font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Subscribing...'
                ) : isSubmitted ? (
                  'Subscribed!'
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
            {isSubmitted && (
              <p className="mt-4 text-sm text-[#8A773E]">
                Thank you for subscribing! Check your email for confirmation.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

