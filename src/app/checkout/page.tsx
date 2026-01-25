'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBag, ArrowLeft, Lock, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

export default function CheckoutPage() {
  const { items, total, itemCount, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
  const [email, setEmail] = useState('');
  const [emailOffers, setEmailOffers] = useState(false);
  
  const deliveryMethod = 'ship';
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardEmailOffers, setCardEmailOffers] = useState(false);
  
  const paymentMethod = 'card';
  
  const [saveInfo, setSaveInfo] = useState(false);
  
  const [discountCode, setDiscountCode] = useState('');
  
  const shippingCost = 0;
  const taxRate = 0.05;
  const subtotal = total;
  const estimatedTax = subtotal * taxRate;
  const finalTotal = subtotal + shippingCost + estimatedTax;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Order placed successfully! (Demo mode)');
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#f4f4f4] flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-[#757575]" />
          </div>
          <h1 className="text-2xl font-semibold uppercase tracking-wide mb-3">Your cart is empty</h1>
          <p className="text-[#757575] text-sm mb-8">
            Add research peptides to your cart to proceed with checkout.
          </p>
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 bg-[#121626] text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-[#12b3b0] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="lg:hidden border-b border-[#e5e5e5]">
        <button
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          className="w-full flex items-center justify-between px-4 py-4 bg-[#fafafa]"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#12b3b0]" />
            <span className="text-[#12b3b0] text-sm">
              {showOrderSummary ? 'Hide' : 'Show'} order summary
            </span>
            {showOrderSummary ? (
              <ChevronUp className="w-4 h-4 text-[#12b3b0]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#12b3b0]" />
            )}
          </div>
          <span className="font-semibold">${finalTotal.toFixed(2)}</span>
        </button>
        
        {showOrderSummary && (
          <div className="px-4 py-4 bg-[#fafafa] border-t border-[#e5e5e5]">
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-white border border-[#e5e5e5] rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#757575] text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-[#757575]">{item.variantTitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-1 text-[#757575] hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 lg:border-r lg:border-[#e5e5e5]">
          <div className="max-w-[550px] mx-auto px-4 py-8 lg:py-12 lg:pr-8 lg:ml-auto lg:mr-0">


            <div className="mb-6">
              <Link
                href="/collections/all"
                className="inline-flex items-center gap-2 text-sm text-[#12b3b0] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to shopping
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Contact</h2>
                  <Link href="#" className="text-sm text-[#12b3b0] hover:underline">
                    Log in
                  </Link>
                </div>
                <input
                  type="email"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0]"
                />
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailOffers}
                    onChange={(e) => setEmailOffers(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d9d9d9] text-[#12b3b0] focus:ring-[#12b3b0]"
                  />
                  <span className="text-sm text-[#545454]">Email me with news and offers</span>
                </label>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Delivery</h2>
                
                <div className="space-y-3">
                    <div className="relative">
                      <select
                        value="US"
                        disabled
                        className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 text-sm bg-[#fafafa] appearance-none cursor-not-allowed"
                      >
                        <option value="US">United States</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575] pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First name (optional)"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0]"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0]"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0]"
                    />

                    <input
                      type="text"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0]"
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0]"
                      />
                      <div className="relative">
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                          className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0] appearance-none bg-white"
                        >
                          <option value="">State</option>
                          {US_STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575] pointer-events-none" />
                      </div>
                      <input
                        type="text"
                        placeholder="ZIP code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                        className="border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0]"
                      />
                    </div>
                  </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping method</h2>
                <div className="p-4 bg-[#fafafa] rounded-md border border-[#e5e5e5]">
                  <p className="text-sm text-[#545454]">
                    Enter your shipping address to view available shipping methods.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-1">Payment</h2>
                <p className="text-xs text-[#757575] mb-4">All transactions are secure and encrypted.</p>
                
                <div className="border border-[#d9d9d9] rounded-md overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#f0fafa]">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-4 border-[#12b3b0]" />
                      <span className="text-sm">Credit card</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-5 bg-[#1a1f71] rounded flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">VISA</span>
                      </div>
                      <div className="w-8 h-5 bg-[#eb001b] rounded flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">MC</span>
                      </div>
                      <div className="w-8 h-5 bg-[#006fcf] rounded flex items-center justify-center">
                        <span className="text-white text-[6px] font-bold">AMEX</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#f7f7f7] space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Card number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        required
                        className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 pr-10 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0] bg-white"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Expiration date (MM/YY)"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        required
                        className="border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0] bg-white"
                      />
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Security code"
                          value={securityCode}
                          onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                          required
                          className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 pr-10 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0] bg-white"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-4 border border-[#757575] rounded-sm flex items-center justify-center">
                          <span className="text-[6px] text-[#757575]">CVV</span>
                        </div>
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      required
                      className="w-full border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0] bg-white"
                    />
                    
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={cardEmailOffers}
                        onChange={(e) => setCardEmailOffers(e.target.checked)}
                        className="w-4 h-4 rounded border-[#d9d9d9] text-[#12b3b0] focus:ring-[#12b3b0]"
                      />
                      <span className="text-sm text-[#545454]">Email me with news and offers</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Remember me</h2>
                <label className="flex items-start gap-3 p-4 border border-[#d9d9d9] rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#d9d9d9] text-[#12b3b0] focus:ring-[#12b3b0]"
                  />
                  <span className="text-sm text-[#545454]">
                    Save my information for a faster checkout with Shop account
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#757575]">
                <Lock className="w-3 h-3" />
                <span>SECURE AND ENCRYPTED</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#12b3b0] text-white py-4 rounded-md text-sm font-medium hover:bg-[#0e9996] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Pay now'}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-[#12b3b0]">
                <Link href="/policies/refund-policy" className="hover:underline">Refund policy</Link>
                <Link href="/policies/privacy-policy" className="hover:underline">Privacy policy</Link>
                <Link href="/policies/terms-of-service" className="hover:underline">Terms of service</Link>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:block w-[480px] bg-[#fafafa] flex-shrink-0">
          <div className="sticky top-0 p-8 pl-8 pr-12">
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-white border border-[#e5e5e5] rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#757575] text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-[#757575]">{item.variantTitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-1 text-[#757575] hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 border border-[#d9d9d9] rounded-md px-3 py-3 text-sm focus:outline-none focus:border-[#12b3b0] focus:ring-1 focus:ring-[#12b3b0] bg-white"
              />
              <button
                type="button"
                className="px-6 py-3 bg-[#e5e5e5] text-[#545454] rounded-md text-sm font-medium hover:bg-[#d9d9d9] transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="space-y-3 pb-4 border-b border-[#e5e5e5]">
              <div className="flex justify-between text-sm">
                <span className="text-[#545454]">Subtotal · {itemCount} items</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#545454]">Shipping</span>
                <span className="text-[#757575]">Enter shipping address</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#545454] flex items-center gap-1">
                  Estimated taxes
                  <span className="w-4 h-4 border border-[#757575] rounded-full text-[10px] flex items-center justify-center text-[#757575]">?</span>
                </span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between py-4">
              <span className="text-lg font-semibold">Total</span>
              <div className="text-right">
                <span className="text-xs text-[#757575] mr-2">USD</span>
                <span className="text-xl font-semibold">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
