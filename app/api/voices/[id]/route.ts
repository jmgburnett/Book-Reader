import { createClient } from '@/lib/supabase/server';
import { deleteVoice } from '@/lib/elevenlabs/voices';
import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/voices/[id] - Delete a voice
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

    // Get voice to find Eleven Labs voice ID
    const { data: voice, error: fetchError } = await supabase
      .from('voices')
      .select('elevenlabs_voice_id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !voice) {
      return NextResponse.json({ error: 'Voice not found' }, { status: 404 });
    }

    // Delete from Eleven Labs
    try {
      await deleteVoice(voice.elevenlabs_voice_id);
    } catch (error) {
      console.error('Error deleting voice from Eleven Labs:', error);
      // Continue with database deletion even if Eleven Labs deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('voices')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting voice:', deleteError);
      return NextResponse.json({ error: 'Failed to delete voice' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
