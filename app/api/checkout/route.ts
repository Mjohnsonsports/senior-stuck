import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CheckoutRequest } from '@/lib/types';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (process.env.STRIPE_SECRET_KEY.startsWith('pk_')) {
  throw new Error('STRIPE_SECRET_KEY must be a secret key (sk_test_ or sk_live_), not a publishable key.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { email, priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing required field: priceId' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
    }

    const origin = request.headers.get('origin') || 'https://www.seniorsstuck.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#price`,
      metadata: {
        ...(email ? { email } : {}),
      },
    });

    console.log('[checkout] session created', { sessionId: session.id });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('[checkout] error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
