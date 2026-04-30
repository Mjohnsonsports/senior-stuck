import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createServiceClient } from '@/utils/supabase/service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required. Please log in to access this resource.' },
        { status: 401 }
      );
    }

    // Get user document to check subscription status using service client
    const supabase = createServiceClient();
    let userDoc;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, subscription_status')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user document:', error);
        return NextResponse.json(
          { error: 'Failed to verify subscription status' },
          { status: 500 }
        );
      }

      userDoc = data;
    } catch (error) {
      console.error('Error fetching user document:', error);
      return NextResponse.json(
        { error: 'Failed to verify subscription status' },
        { status: 500 }
      );
    }

    // Check if user has active subscription
    if (!userDoc || userDoc.subscription_status !== 'active') {
      console.log('❌ Access denied - User subscription status:', userDoc?.subscription_status || 'not found');
      return NextResponse.json(
        { error: 'Active subscription required to access this resource' },
        { status: 403 }
      );
    }

    console.log('✅ User has active subscription, allowing PDF download');

    // Read the PDF file
    try {
      const pdfPath = join(process.cwd(), 'public', '_Lead magner pdf .pdf');
      const pdfBuffer = await readFile(pdfPath);

      // Return PDF with proper headers
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Unstuck-Newsletter-Guide.pdf"',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      });
    } catch (error) {
      console.error('Error reading PDF file:', error);
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error in download-pdf route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download PDF' },
      { status: 500 }
    );
  }
}
