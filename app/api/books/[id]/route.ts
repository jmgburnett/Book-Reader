import { createClient } from '@/lib/supabase/server';
import { extractPDFText } from '@/lib/pdf/parser';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/books/[id] - Get a specific book with its text content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get book metadata
    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Download PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('books')
      .download(book.file_path);

    if (downloadError || !fileData) {
      console.error('Error downloading file:', downloadError);
      return NextResponse.json({ error: 'Failed to download book' }, { status: 500 });
    }

    // Extract text
    const buffer = Buffer.from(await fileData.arrayBuffer());
    const pdfData = await extractPDFText(buffer);

    return NextResponse.json({
      book: {
        ...book,
        text: pdfData.text,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/books/[id] - Delete a book
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get book to find file path
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('file_path')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('books')
      .remove([book.file_path]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting book:', deleteError);
      return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
