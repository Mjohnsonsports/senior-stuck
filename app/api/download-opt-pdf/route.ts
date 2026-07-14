import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const pdfPath = join(process.cwd(), 'public', 'Book New for Mark_merged (1) (1).pdf');
    const pdfBuffer = await readFile(pdfPath);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="MY-Laptop-Legacy.pdf"',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error in download-opt-pdf route:', error);
    return NextResponse.json(
      { error: 'PDF file not found' },
      { status: 404 }
    );
  }
}
