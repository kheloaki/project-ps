import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/checkout
 * Create a checkout session (placeholder - Stripe removed)
 */
export async function POST(req: NextRequest) {
  try {
    const { lineItems, customerEmail, shippingOption, shippingCost } = await req.json();

    if (!lineItems?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Return a mock response since Stripe is removed
    return NextResponse.json({ 
      sessionId: `demo_${Date.now()}`,
      url: `/checkout/success?session_id=demo_${Date.now()}`
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
