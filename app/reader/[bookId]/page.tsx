'use client';

import { createClient } from '@/lib/supabase/client';
import { chunkText } from '@/lib/audio/chunker';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface Book {
  id: string;
  title: string;
  author: string | null;
  text: string;
  page_count: number | null;
}

interface Voice {
  id: string;
  name: string;
  elevenlabs_voice_id: string;
}

export default function ReaderPage({ params }: { params: Promise<{ bookId: string }> }) {
  const resolvedParams = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    fetchBook();
    fetchVoices();
  };

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${resolvedParams.bookId}`);
      const data = await response.json();

      if (response.ok) {
        setBook(data.book);
        // Chunk the text for TTS
        const textChunks = chunkText(data.book.text, 5000);
        setChunks(textChunks);
      } else {
        setError(data.error || 'Failed to fetch book');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/voices');
      const data = await response.json();

      if (response.ok) {
        const allVoices = [
          ...data.userVoices.map((v: any) => ({
            id: v.id,
            name: v.name,
            elevenlabs_voice_id: v.elevenlabs_voice_id,
          })),
          ...(data.availableVoices || []).slice(0, 10).map((v: any) => ({
            id: v.voice_id,
            name: v.name,
            elevenlabs_voice_id: v.voice_id,
          })),
        ];
        setVoices(allVoices);
        if (allVoices.length > 0) {
          setSelectedVoice(allVoices[0].elevenlabs_voice_id);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch voices:', err);
    }
  };

  const playChunk = async (chunkIndex: number) => {
    if (!selectedVoice || !chunks[chunkIndex]) return;

    setPlaying(true);
    setCurrentChunk(chunkIndex);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: chunks[chunkIndex],
          voiceId: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to play audio');
      setPlaying(false);
    }
  };

  const handlePlay = () => {
    playChunk(currentChunk);
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentChunk < chunks.length - 1) {
      playChunk(currentChunk + 1);
    }
  };

  const handlePrevious = () => {
    if (currentChunk > 0) {
      playChunk(currentChunk - 1);
    }
  };

  const handleAudioEnded = () => {
    if (currentChunk < chunks.length - 1) {
      playChunk(currentChunk + 1);
    } else {
      setPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading book...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Book not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/library')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Library
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          {book.author && <p className="mt-2 text-lg text-gray-600">{book.author}</p>}
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <label
                htmlFor="voice-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Voice
              </label>
              <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.elevenlabs_voice_id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Chunk {currentChunk + 1} of {chunks.length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {chunks[currentChunk]}
            </p>
          </div>
        </div>

        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          className="hidden"
        />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePrevious}
              disabled={currentChunk === 0}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {!playing ? (
              <button
                onClick={handlePlay}
                className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={currentChunk === chunks.length - 1}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mt-2 text-center text-sm text-red-600">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
