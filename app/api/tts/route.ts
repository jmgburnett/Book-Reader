import { createClient } from '@/lib/supabase/server';
import { textToSpeechStream } from '@/lib/elevenlabs/tts';
import { NextRequest, NextResponse } from 'next/server';

// Use edge runtime for low latency
export const runtime = 'edge';

/**
 * POST /api/tts - Convert text to speech
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

    const body = await request.json();
    const { text, voiceId, stability, similarityBoost } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!voiceId) {
      return NextResponse.json({ error: 'Voice ID is required' }, { status: 400 });
    }

    // Generate speech
    const audioStream = await textToSpeechStream({
      text,
      voiceId,
      stability,
      similarityBoost,
    });

    // Stream the audio back to the client
    return new Response(audioStream as any, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech: ' + error.message },
      { status: 500 }
    );
  }
}
