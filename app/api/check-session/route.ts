import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/utils/supabase/service';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    console.log('🔍 Check-session API called with session_id:', sessionId);

    if (!sessionId) {
      console.error('❌ No session_id provided');
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
      });
      console.log('✅ Session retrieved:', session.id);
    } catch (stripeError: any) {
      console.error('❌ Error retrieving session from Stripe:', stripeError);
      return NextResponse.json(
        { error: `Failed to retrieve session: ${stripeError.message}` },
        { status: 500 }
      );
    }

    if (!session.subscription) {
      console.warn('⚠️ No subscription in session');
      return NextResponse.json({ active: false, message: 'No subscription found in session' });
    }

    // Get subscription details
    let subscription: Stripe.Subscription;
    try {
      subscription = typeof session.subscription === 'string'
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription;
      console.log('✅ Subscription retrieved:', subscription.id);
    } catch (subError: any) {
      console.error('❌ Error retrieving subscription:', subError);
      return NextResponse.json(
        { error: `Failed to retrieve subscription: ${subError.message}` },
        { status: 500 }
      );
    }

    const userId = session.metadata?.userId || session.metadata?.firebaseUID; // Support both for backward compatibility
    if (!userId) {
      console.error('❌ Check-session: No userId in session metadata');
      console.error('Session metadata:', JSON.stringify(session.metadata, null, 2));
      return NextResponse.json({ active: false, error: 'No userId in metadata' });
    }

    console.log('🔍 Check-session: Processing for user:', userId);
    console.log('📧 Email:', session.metadata?.email || session.customer_email);
    
    // Update user document
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;
    
    // Determine plan from price interval
    let plan: 'monthly' | 'yearly' | null = null;
    if (priceId) {
      try {
        // Retrieve the price to get its interval
        const price = await stripe.prices.retrieve(priceId);
        if (price.recurring?.interval === 'month') {
          plan = 'monthly';
        } else if (price.recurring?.interval === 'year') {
          plan = 'yearly';
        } else {
          // Fallback: check price ID string as backup
          plan = priceId.includes('monthly') || priceId.includes('month')
            ? 'monthly'
            : priceId.includes('yearly') || priceId.includes('year')
            ? 'yearly'
            : 'monthly'; // Default to monthly if can't determine
        }
      } catch (priceError) {
        console.warn('⚠️ Could not retrieve price details, using fallback logic');
        // Fallback: check price ID string
        plan = priceId.includes('monthly') || priceId.includes('month')
          ? 'monthly'
          : priceId.includes('yearly') || priceId.includes('year')
          ? 'yearly'
          : 'monthly'; // Default to monthly if can't determine
      }
    } else {
      plan = 'monthly'; // Default to monthly if no price ID
    }

    // Validate and convert current_period_end
    let currentPeriodEnd: number | null = null;
    const periodEnd = (subscription as any).current_period_end as number | undefined;
    if (periodEnd && typeof periodEnd === 'number') {
      currentPeriodEnd = periodEnd * 1000;
      // Validate the timestamp
      const testDate = new Date(currentPeriodEnd);
      if (isNaN(testDate.getTime())) {
        console.warn('⚠️ Invalid current_period_end timestamp, using null');
        currentPeriodEnd = null;
      }
    }

    console.log('💳 Customer ID:', customerId);
    console.log('📦 Plan:', plan);
    console.log('📅 Period End (raw):', periodEnd);
    console.log('📅 Period End (converted):', currentPeriodEnd);
    if (currentPeriodEnd) {
      console.log('📅 Period End (formatted):', new Date(currentPeriodEnd).toISOString());
    }
    console.log('✅ Subscription Status:', subscription.status);

    // Update user document using service role key (bypasses RLS)
    let supabase;
    try {
      supabase = createServiceClient();
      console.log('✅ Service client created');
    } catch (serviceError: any) {
      console.error('❌ Error creating service client:', serviceError);
      return NextResponse.json(
        { error: `Service client error: ${serviceError.message}` },
        { status: 500 }
      );
    }
    
    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, subscription_status')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing user:', checkError);
    }
    console.log('🔍 Existing user check:', { 
      exists: !!existingUser, 
      error: checkError?.code === 'PGRST116' ? 'User not found (expected)' : checkError?.message 
    });

    const upsertData: any = {
      id: userId,
      email: session.metadata?.email || session.customer_email || '',
      subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
      plan: plan,
      stripe_customer_id: customerId,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    };

    // Only include current_period_end if it's valid
    if (currentPeriodEnd === null) {
      delete upsertData.current_period_end;
    }

    // If user doesn't exist, set created_at
    if (!existingUser) {
      upsertData.created_at = new Date().toISOString();
      console.log('📝 Creating new user record');
    } else {
      console.log('📝 Updating existing user record');
    }

    console.log('📤 Upserting data:', JSON.stringify(upsertData, null, 2));

    const { data: upsertedData, error: upsertError } = await supabase
      .from('users')
      .upsert(upsertData, {
        onConflict: 'id',
      })
      .select();

    if (upsertError) {
      console.error('❌ Error upserting user:', upsertError);
      console.error('Error details:', {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details,
        hint: upsertError.hint,
      });
      throw upsertError;
    }

    console.log('✅ Upserted successfully:', upsertedData);

    // Persist subscription record as well (used by /api/subscriptions and history views)
    const subscriptionUpsertData = {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      plan: plan || 'monthly',
      subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    };

    const { error: subscriptionUpsertError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionUpsertData, {
        onConflict: 'stripe_subscription_id',
      });

    if (subscriptionUpsertError) {
      // Do not fail the request if users table is updated; log for diagnostics.
      console.error('⚠️ Error upserting subscription record:', {
        code: subscriptionUpsertError.code,
        message: subscriptionUpsertError.message,
        details: subscriptionUpsertError.details,
        hint: subscriptionUpsertError.hint,
      });
    } else {
      console.log('✅ Subscription record stored in subscriptions table');
    }
    
    // Verify the data was actually stored
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('id, email, subscription_status, plan, stripe_customer_id, current_period_end')
      .eq('id', userId)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification failed - data may not have been stored:', verifyError);
    } else {
      console.log('✅ Verification successful - data confirmed in database:', verifyData);
      console.log('✅ User data stored in users table');
    }

    return NextResponse.json({
      active: subscription.status === 'active',
      status: subscription.status,
      verified: !verifyError,
      storedData: verifyData || null,
    });
  } catch (error: any) {
    console.error('❌❌❌ Unhandled error in check-session:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to check session',
        details: process.env.NODE_ENV === 'development' ? {
          type: error.constructor.name,
          stack: error.stack,
        } : undefined,
      },
      { status: 500 }
    );
  }
}
