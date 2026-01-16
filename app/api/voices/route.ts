import { createClient } from '@/lib/supabase/server';
import { cloneVoice, getVoices } from '@/lib/elevenlabs/voices';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/voices - List all voices for the current user
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

    // Get user's voices from database
    const { data: userVoices, error } = await supabase
      .from('voices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching voices:', error);
      return NextResponse.json({ error: 'Failed to fetch voices' }, { status: 500 });
    }

    // Also get all available Eleven Labs voices (including pre-made ones)
    try {
      const elevenLabsVoices = await getVoices();
      return NextResponse.json({
        userVoices,
        availableVoices: elevenLabsVoices.voices,
      });
    } catch (error) {
      // If Eleven Labs API fails, just return user voices
      return NextResponse.json({
        userVoices,
        availableVoices: [],
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/voices - Clone a new voice
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
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const files = formData.getAll('files') as File[];

    if (!name) {
      return NextResponse.json({ error: 'Voice name is required' }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'At least one audio file is required' }, { status: 400 });
    }

    // Convert files to buffers
    const fileBuffers = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return Buffer.from(arrayBuffer);
      })
    );

    // Clone voice with Eleven Labs
    let clonedVoice;
    try {
      clonedVoice = await cloneVoice({
        name,
        description,
        files: fileBuffers,
      });
    } catch (error: any) {
      console.error('Error cloning voice:', error);
      return NextResponse.json(
        { error: 'Failed to clone voice: ' + error.message },
        { status: 500 }
      );
    }

    // Save voice metadata to database
    const { data: voice, error: insertError } = await supabase
      .from('voices')
      .insert({
        user_id: user.id,
        elevenlabs_voice_id: clonedVoice.voiceId,
        name: clonedVoice.name,
        description: description || null,
        is_default: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting voice:', insertError);
      return NextResponse.json({ error: 'Failed to save voice' }, { status: 500 });
    }

    return NextResponse.json({ voice }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
