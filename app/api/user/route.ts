import { NextRequest, NextResponse } from 'next/server';
import { getUserDocument, createOrUpdateUser } from '@/lib/supabase-db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required' },
        { status: 400 }
      );
    }

    try {
      const userDoc = await getUserDocument(uid);

      if (!userDoc) {
        // Return default user document instead of 404
        // This allows the dashboard to load even if user doc doesn't exist yet
        return NextResponse.json({
          uid: uid,
          email: '',
          subscriptionStatus: 'inactive',
          plan: null,
          stripeCustomerId: null,
          currentPeriodEnd: null,
          createdAt: null,
        });
      }

      return NextResponse.json(userDoc);
    } catch (supabaseError: any) {
      // Always log errors
      console.error('Supabase error:', supabaseError);
      // If Supabase is not configured or has an error, return default document
      if (supabaseError.message?.includes('not initialized') || supabaseError.message?.includes('Supabase')) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Supabase not available, returning default user document');
        }
        return NextResponse.json({
          uid: uid,
          email: '',
          subscriptionStatus: 'inactive',
          plan: null,
          stripeCustomerId: null,
          currentPeriodEnd: null,
          createdAt: null,
        });
      }
      throw supabaseError;
    }
  } catch (error: any) {
    console.error('Error fetching user:', error);
    // Even on error, return a default document so dashboard can load
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');
    return NextResponse.json({
      uid: uid || '',
      email: '',
      subscriptionStatus: 'inactive',
      plan: null,
      stripeCustomerId: null,
      currentPeriodEnd: null,
      createdAt: null,
      error: error.message || 'Failed to fetch user',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email } = body;

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required' },
        { status: 400 }
      );
    }

    // Create or update user document
    await createOrUpdateUser(uid, {
      email: email || '',
      subscriptionStatus: 'inactive',
      plan: null,
      stripeCustomerId: null,
      currentPeriodEnd: null,
    });

    // Return the created user document
    const userDoc = await getUserDocument(uid);
    return NextResponse.json(userDoc || {
      uid: uid,
      email: email || '',
      subscriptionStatus: 'inactive',
      plan: null,
      stripeCustomerId: null,
      currentPeriodEnd: null,
      createdAt: null,
    });
  } catch (error: any) {
    // Always log errors
    console.error('Error creating user:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
