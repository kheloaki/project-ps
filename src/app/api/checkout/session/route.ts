import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/checkout/session
 * Retrieve checkout session (placeholder - Stripe removed)
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    // Return mock session data since Stripe is removed
    return NextResponse.json({
      id: sessionId,
      amount_total: 0,
      currency: 'usd',
      customer_email: null,
      payment_status: 'paid',
      line_items: [],
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
