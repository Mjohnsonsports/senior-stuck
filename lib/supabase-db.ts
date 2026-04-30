import { createClient } from '@/utils/supabase/client';
import { UserDocument } from './types';

/**
 * Get user document from Supabase
 */
export async function getUserDocument(uid: string): Promise<UserDocument | null> {
  const supabase = createClient();
  
  if (!supabase) {
    throw new Error('Supabase is not initialized. Please configure Supabase in your .env.local file.');
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error getting user document:', error);
      throw error;
    }

    if (data) {
      return {
        uid: data.id,
        email: data.email || '',
        subscriptionStatus: data.subscription_status || 'inactive',
        plan: data.plan || null,
        stripeCustomerId: data.stripe_customer_id || null,
        currentPeriodEnd: data.current_period_end || null,
        createdAt: data.created_at || null,
      } as UserDocument & { uid: string };
    }

    return null;
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
}

/**
 * Create or update user document in Supabase
 */
export async function createOrUpdateUser(
  uid: string,
  data: Partial<UserDocument>
): Promise<void> {
  const supabase = createClient();
  
  if (!supabase) {
    throw new Error('Supabase is not initialized. Please configure Supabase in your .env.local file.');
  }

  try {
    const updateData: any = {
      id: uid,
      email: data.email !== undefined ? data.email : '',
      subscription_status: data.subscriptionStatus !== undefined ? data.subscriptionStatus : 'inactive',
      plan: data.plan !== undefined ? data.plan : null,
      stripe_customer_id: data.stripeCustomerId !== undefined ? data.stripeCustomerId : null,
      current_period_end: data.currentPeriodEnd !== undefined ? data.currentPeriodEnd : null,
    };

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', uid)
      .single();

    if (existingUser) {
      // Update existing document
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', uid);

      if (error) {
        console.error('Error updating user document:', error);
        throw error;
      }

      console.log(`✅ Updated user document for ${uid}`);
      console.log(`   Subscription status: ${updateData.subscription_status}`);
      console.log(`   Plan: ${updateData.plan}`);
      console.log(`   Customer ID: ${updateData.stripe_customer_id}`);
    } else {
      // Create new document
      const { error } = await supabase
        .from('users')
        .insert({
          ...updateData,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error creating user document:', error);
        throw error;
      }

      console.log(`✅ Created new user document for ${uid}`);
      console.log(`   Subscription status: ${updateData.subscription_status}`);
      console.log(`   Plan: ${updateData.plan}`);
    }
  } catch (error: any) {
    console.error('❌ Error creating/updating user document:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
}

/**
 * Find user by Stripe customer ID
 */
export async function findUserByStripeCustomerId(
  stripeCustomerId: string
): Promise<{ uid: string; data: UserDocument } | null> {
  const supabase = createClient();
  
  if (!supabase) {
    throw new Error('Supabase is not initialized. Please configure Supabase in your .env.local file.');
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error finding user by Stripe customer ID:', error);
      throw error;
    }

    if (data) {
      return {
        uid: data.id,
        data: {
          email: data.email || '',
          subscriptionStatus: data.subscription_status || 'inactive',
          plan: data.plan || null,
          stripeCustomerId: data.stripe_customer_id || null,
          currentPeriodEnd: data.current_period_end || null,
          createdAt: data.created_at || null,
        } as UserDocument,
      };
    }

    return null;
  } catch (error) {
    console.error('Error finding user by Stripe customer ID:', error);
    throw error;
  }
}
