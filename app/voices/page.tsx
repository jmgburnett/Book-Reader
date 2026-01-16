'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Voice {
  id: string;
  name: string;
  description: string | null;
  elevenlabs_voice_id: string;
  created_at: string;
}

export default function VoicesPage() {
  const [userVoices, setUserVoices] = useState<Voice[]>([]);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showCloneForm, setShowCloneForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    files: [] as File[],
  });
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

    setUser(user);
    fetchVoices();
  };

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/voices');
      const data = await response.json();

      if (response.ok) {
        setUserVoices(data.userVoices || []);
        setAvailableVoices(data.availableVoices || []);
      } else {
        setError(data.error || 'Failed to fetch voices');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch voices');
    } finally {
      setLoading(false);
    }
  };

  const handleCloneVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCloning(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formData.files.forEach((file) => {
      formDataToSend.append('files', file);
    });

    try {
      const response = await fetch('/api/voices', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setUserVoices([data.voice, ...userVoices]);
        setShowCloneForm(false);
        setFormData({ name: '', description: '', files: [] });
      } else {
        setError(data.error || 'Failed to clone voice');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clone voice');
    } finally {
      setCloning(false);
    }
  };

  const handleDeleteVoice = async (voiceId: string) => {
    if (!confirm('Are you sure you want to delete this voice?')) return;

    try {
      const response = await fetch(`/api/voices/${voiceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserVoices(userVoices.filter((v) => v.id !== voiceId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete voice');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete voice');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, files });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                href="/library"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Library
              </Link>
              <Link
                href="/voices"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
              >
                Voices
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Voice Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Clone your own voice or use pre-made voices for reading
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="mb-8">
            <button
              onClick={() => setShowCloneForm(!showCloneForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {showCloneForm ? 'Cancel' : 'Clone New Voice'}
            </button>
          </div>

          {showCloneForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Clone Your Voice
              </h2>
              <form onSubmit={handleCloneVoice} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Voice Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Audio Samples (at least 1 minute of clear speech)
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    multiple
                    required
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload one or more audio files of your voice (MP3, WAV, etc.)
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={cloning}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cloning ? 'Cloning...' : 'Clone Voice'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Cloned Voices
              </h2>
              {userVoices.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                  No cloned voices yet. Clone your voice to get started!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {userVoices.map((voice) => (
                    <div
                      key={voice.id}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {voice.name}
                        </h3>
                        {voice.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {voice.description}
                          </p>
                        )}
                        <div className="mt-4">
                          <button
                            onClick={() => handleDeleteVoice(voice.id)}
                            className="text-sm text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {availableVoices.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Voices
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {availableVoices.map((voice) => (
                    <div
                      key={voice.voice_id}
                      className="bg-white overflow-hidden shadow rounded-lg p-4"
                    >
                      <h3 className="text-sm font-medium text-gray-900">
                        {voice.name}
                      </h3>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="capitalize">{voice.labels?.gender}</span>
                        {voice.labels?.accent && (
                          <span className="ml-2 capitalize">{voice.labels.accent}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
