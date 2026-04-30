// Legacy export for backward compatibility
// New code should use utils/supabase/client.ts or utils/supabase/server.ts
import { createClient as createBrowserClient } from '@/utils/supabase/client';

// For client-side components, use the browser client
export const supabase = typeof window !== 'undefined' ? createBrowserClient() : null;

export default supabase;
