import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CustomerPortalRequest } from '@/lib/types';
import { createServiceClient } from '@/utils/supabase/service';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (process.env.STRIPE_SECRET_KEY.startsWith('pk_')) {
  throw new Error('STRIPE_SECRET_KEY must be a secret key (starts with sk_test_ or sk_live_), not a publishable key (pk_).');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body: CustomerPortalRequest = await request.json();
    const { userId } = body;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Customer Portal API called');
      console.log('👤 User ID:', userId);
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user document from Supabase using service client (bypasses RLS)
    const supabase = createServiceClient();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Querying users table for userId:', userId);
    }
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, stripe_customer_id, subscription_status')
      .eq('id', userId)
      .maybeSingle();

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query result:', {
        hasData: !!userData,
        hasError: !!userError,
        errorCode: userError?.code,
        errorMessage: userError?.message,
        userData: userData ? {
          id: userData.id,
          email: userData.email,
          hasStripeCustomerId: !!userData.stripe_customer_id,
          subscriptionStatus: userData.subscription_status,
        } : null,
      });
    }

    if (userError && userError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is handled below
      console.error('❌ Error fetching user:', userError);
      return NextResponse.json(
        { error: `Failed to fetch user data: ${userError.message}` },
        { status: 500 }
      );
    }

    if (!userData) {
      console.error('❌ User not found in users table:', userId);
      if (process.env.NODE_ENV === 'development') {
        console.log('💡 This usually means:');
        console.log('   1. User has not completed a subscription yet, OR');
        console.log('   2. Webhook/check-session did not create the user record');
      }
      
      // Check if user exists in auth.users (Supabase auth)
      try {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
        if (authUser?.user) {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ User exists in auth.users:', authUser.user.email);
          }
          return NextResponse.json(
            { 
              error: 'User account exists but no subscription found. Please complete a subscription first to access billing management.',
              userExists: true,
              hasSubscription: false,
            },
            { status: 404 }
          );
        }
      } catch (authCheckError) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ Could not check auth.users (this is okay)');
        }
      }
      
      return NextResponse.json(
        { 
          error: 'User not found. Please ensure you have completed a subscription.',
          userExists: false,
          hasSubscription: false,
        },
        { status: 404 }
      );
    }

    if (!userData.stripe_customer_id) {
      console.error('❌ User does not have Stripe customer ID:', userId);
      return NextResponse.json(
        { error: 'User does not have a Stripe customer ID. Please complete a subscription first.' },
        { status: 400 }
      );
    }

    // Verify the customer exists in Stripe before creating portal session
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Verifying Stripe customer exists:', userData.stripe_customer_id);
    }
    try {
      const customer = await stripe.customers.retrieve(userData.stripe_customer_id);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Customer found in Stripe:', {
          id: customer.id,
          email: typeof customer === 'object' && !customer.deleted ? customer.email : 'N/A',
          deleted: typeof customer === 'object' && customer.deleted ? true : false,
        });
      }
      
      // Check if customer was deleted
      if (typeof customer === 'object' && customer.deleted) {
        console.error('❌ Customer was deleted in Stripe');
        return NextResponse.json(
          { 
            error: 'Stripe customer was deleted. Please contact support or create a new subscription.',
            customerDeleted: true,
          },
          { status: 400 }
        );
      }
    } catch (stripeError: any) {
      console.error('❌ Error retrieving Stripe customer:', stripeError);
      
      if (stripeError.code === 'resource_missing') {
        console.error('❌ Customer does not exist in Stripe');
        return NextResponse.json(
          { 
            error: 'Stripe customer not found. This may happen if the customer was created in a different Stripe account or environment. Please contact support.',
            customerNotFound: true,
            customerId: userData.stripe_customer_id,
          },
          { status: 400 }
        );
      }
      
      // For other Stripe errors, still try to create portal (might be a temporary issue)
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Could not verify customer, but proceeding with portal creation');
      }
    }

    // Get origin for return URL (use referer or host header for better compatibility)
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
    
    let returnUrl = 'http://localhost:3000/dashboard';
    if (referer) {
      try {
        const url = new URL(referer);
        returnUrl = `${url.origin}/dashboard`;
      } catch {
        // Fallback to host header
        if (host) {
          returnUrl = `${protocol}://${host}/dashboard`;
        }
      }
    } else if (host) {
      returnUrl = `${protocol}://${host}/dashboard`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Creating Stripe Customer Portal session');
      console.log('👤 Customer ID:', userData.stripe_customer_id);
      console.log('↩️ Return URL:', returnUrl);
    }

    // Create billing portal session
    let session;
    try {
      session = await stripe.billingPortal.sessions.create({
        customer: userData.stripe_customer_id,
        return_url: returnUrl,
      });
    } catch (portalError: any) {
      console.error('❌ Error creating portal session:', portalError);
      
      if (portalError.code === 'resource_missing' || portalError.message?.includes('No such customer')) {
        return NextResponse.json(
          { 
            error: 'Stripe customer not found. The customer ID in our database does not exist in Stripe. Please contact support.',
            customerNotFound: true,
            customerId: userData.stripe_customer_id,
            suggestion: 'This usually happens if the customer was created in a different Stripe account or environment (test vs live).',
          },
          { status: 400 }
        );
      }
      
      throw portalError; // Re-throw other errors
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Portal session created:', session.id);
      console.log('🔗 Portal URL:', session.url);
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    // Always log errors
    console.error('Error creating customer portal session:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create customer portal session',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
