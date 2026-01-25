'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  amount_total: number;
}

interface SessionData {
  id: string;
  amount_total: number;
  currency: string;
  customer_email: string | null;
  line_items: LineItem[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    if (!cartCleared) {
      clearCart();
      setCartCleared(true);
    }
  }, [clearCart, cartCleared]);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${sessionId}`);
        if (!res.ok) {
          // If session fetch fails, still show success page
          setLoading(false);
          return;
        }
        const data = await res.json();
        setSession(data);
      } catch (err) {
        // On error, still show success page (order was placed)
        setError('Order details unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#12b3b0]" />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#12b3b0] flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-semibold uppercase tracking-wide mb-3">
          Order Confirmed
        </h1>

        <p className="text-[#757575] mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {session && (
          <div className="border border-[#e5e5e5] p-6 text-left mb-8">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#e5e5e5]">
              <Package className="w-5 h-5 text-[#12b3b0]" />
              <span className="text-sm font-medium uppercase tracking-wide">Order Details</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#757575]">Order ID</span>
                <span className="font-mono text-xs">{session.id.slice(0, 20)}...</span>
              </div>

              {session.customer_email && (
                <div className="flex justify-between">
                  <span className="text-[#757575]">Email</span>
                  <span>{session.customer_email}</span>
                </div>
              )}

              {session.line_items && session.line_items.length > 0 && (
                <div className="pt-3 border-t border-[#e5e5e5]">
                  <span className="text-[#757575] text-xs uppercase tracking-wide">Items</span>
                  <div className="mt-2 space-y-2">
                    {session.line_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.description} x{item.quantity}</span>
                        <span>${(item.amount_total / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-[#e5e5e5] font-semibold">
                <span>Total</span>
                <span>
                  ${(session.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[#f4f4f4] text-sm text-[#757575]">
            Your payment was successful. Order details will be sent to your email.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/collections/all"
            className="inline-flex items-center justify-center gap-2 bg-[#121626] text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-[#12b3b0] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#757575]">
          A confirmation email has been sent with your order details.
          <br />
          For questions, contact support@peptidesskin.com
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#12b3b0]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
