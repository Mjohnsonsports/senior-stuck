import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Don't throw error at module level - check in function instead
// This allows the app to start even if key is missing (will error when used)

/**
 * Create a Supabase client with service role key
 * This bypasses RLS and should ONLY be used server-side (API routes, webhooks)
 * NEVER expose this key to the client!
 */
export const createServiceClient = () => {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
  }
  
  if (!supabaseServiceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. ' +
      'Please add it to your .env.local file. ' +
      'Get it from: Supabase Dashboard → Settings → API → service_role key'
    );
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
