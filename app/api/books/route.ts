import { createClient } from '@/lib/supabase/server';
import { extractPDFText, validatePDF } from '@/lib/pdf/parser';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/books - List all books for the current user
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
      return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
    }

    return NextResponse.json({ books });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/books - Upload and process a new book
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate PDF
    try {
      validatePDF(file);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Extract text and metadata
    let pdfData;
    try {
      pdfData = await extractPDFText(file);
    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to parse PDF: ' + error.message }, { status: 400 });
    }

    // Upload file to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Save book metadata to database
    const { data: book, error: insertError } = await supabase
      .from('books')
      .insert({
        user_id: user.id,
        title: pdfData.metadata.title || file.name.replace('.pdf', ''),
        author: pdfData.metadata.author || null,
        file_path: fileName,
        file_size: file.size,
        page_count: pdfData.numPages,
        total_text_length: pdfData.text.length,
      })
      .select()
      .single();

    if (insertError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('books').remove([fileName]);
      console.error('Error inserting book:', insertError);
      return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
    }

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
