import { NextRequest, NextResponse } from 'next/server';

/**
 * Check if all required environment variables are set
 * This helps diagnose configuration issues
 */
export async function GET(request: NextRequest) {
  const envVars = {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: {
      value: process.env.NEXT_PUBLIC_SUPABASE_URL,
      set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      required: true,
      description: 'Supabase project URL',
    },
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: {
      value: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? '***SET***' : null,
      set: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      required: true,
      description: 'Supabase anon/public key',
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      value: process.env.SUPABASE_SERVICE_ROLE_KEY ? `***SET (${process.env.SUPABASE_SERVICE_ROLE_KEY.length} chars)***` : null,
      set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      required: true,
      description: 'Supabase service_role key (SECRET)',
    },
    
    // Stripe
    STRIPE_SECRET_KEY: {
      value: process.env.STRIPE_SECRET_KEY ? `***SET (starts with ${process.env.STRIPE_SECRET_KEY.substring(0, 7)})***` : null,
      set: !!process.env.STRIPE_SECRET_KEY,
      required: true,
      description: 'Stripe secret key (sk_test_ or sk_live_)',
    },
    STRIPE_WEBHOOK_SECRET: {
      value: process.env.STRIPE_WEBHOOK_SECRET ? `***SET (starts with ${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 6)})***` : null,
      set: !!process.env.STRIPE_WEBHOOK_SECRET,
      required: true,
      description: 'Stripe webhook signing secret (whsec_)',
    },
    NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID: {
      value: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? `***SET (${process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID.substring(0, 10)}...)***` : null,
      set: !!process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
      required: true,
      description: 'Stripe monthly plan price ID',
    },
    NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID: {
      value: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ? `***SET (${process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID.substring(0, 10)}...)***` : null,
      set: !!process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
      required: true,
      description: 'Stripe yearly plan price ID',
    },
  };

  const missing = Object.entries(envVars)
    .filter(([_, info]) => info.required && !info.set)
    .map(([key, _]) => key);

  const allSet = missing.length === 0;

  return NextResponse.json({
    success: allSet,
    message: allSet 
      ? '✅ All required environment variables are set!' 
      : `❌ Missing ${missing.length} required environment variable(s)`,
    missing,
    variables: envVars,
    instructions: allSet 
      ? 'All variables are configured. If data still not storing, check /api/test-db for database connection issues.'
      : 'Please add the missing variables to your .env.local file and restart the dev server.',
  });
}
