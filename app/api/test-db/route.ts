import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';

/**
 * Test endpoint to verify database connection and table structure
 * This helps diagnose why data isn't being stored
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    
    // Test 1: Check if we can connect
    console.log('🔍 Test 1: Checking service client...');
    
    // Test 2: Check if users table exists and get structure
    console.log('🔍 Test 2: Checking users table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(0);
    
    if (tableError) {
      return NextResponse.json({
        success: false,
        error: 'Cannot access users table',
        details: {
          code: tableError.code,
          message: tableError.message,
          hint: tableError.hint,
        },
        suggestion: 'Check if users table exists and RLS policies allow service role access',
      }, { status: 500 });
    }
    
    // Test 3: Try to insert a test record (then delete it)
    console.log('🔍 Test 3: Testing insert capability...');
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const testData = {
      id: testUserId,
      email: 'test@example.com',
      subscription_status: 'inactive',
      plan: null,
      stripe_customer_id: null,
      current_period_end: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .upsert(testData, {
        onConflict: 'id',
      })
      .select();
    
    if (insertError) {
      return NextResponse.json({
        success: false,
        error: 'Cannot insert into users table',
        details: {
          code: insertError.code,
          message: insertError.message,
          hint: insertError.hint,
          details: insertError.details,
        },
        suggestion: 'Check RLS policies and table permissions',
      }, { status: 500 });
    }
    
    // Clean up test record
    await supabase
      .from('users')
      .delete()
      .eq('id', testUserId);
    
    // Test 4: Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    };
    
    return NextResponse.json({
      success: true,
      message: 'All database tests passed!',
      tests: {
        serviceClient: '✅ Connected',
        tableAccess: '✅ Users table accessible',
        insertCapability: '✅ Can insert/update records',
        environment: envCheck,
      },
      insertedTestRecord: insertData,
      note: 'Test record was created and immediately deleted',
    });
    
  } catch (error: any) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
