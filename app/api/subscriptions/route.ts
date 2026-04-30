import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all subscriptions for the user
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id, plan, subscription_status, current_period_end, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscriptions: subscriptions || [],
    });
  } catch (error: any) {
    console.error('Error in subscriptions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
