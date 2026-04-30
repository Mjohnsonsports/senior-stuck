import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Use the origin from the request URL to ensure we stay on the same domain
  const origin = requestUrl.origin;
  const redirectUrl = new URL(next, origin);
  
  return NextResponse.redirect(redirectUrl);
}
