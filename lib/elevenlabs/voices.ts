import { getElevenLabsClient } from './client';

export interface VoiceCloneParams {
  name: string;
  description?: string;
  files: Buffer[];
}

/**
 * Clone a voice using Eleven Labs API
 * @param params - Voice cloning parameters
 * @returns The created voice ID
 */
export async function cloneVoice(params: VoiceCloneParams) {
  const client = getElevenLabsClient();

  try {
    const voice = await client.voices.add({
      name: params.name,
      description: params.description || '',
      files: params.files,
    });

    return {
      voiceId: voice.voice_id,
      name: voice.name,
    };
  } catch (error) {
    console.error('Error cloning voice:', error);
    throw new Error('Failed to clone voice');
  }
}

/**
 * Get all voices for the current API key
 */
export async function getVoices() {
  const client = getElevenLabsClient();

  try {
    const voices = await client.voices.getAll();
    return voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error('Failed to fetch voices');
  }
}

/**
 * Get a specific voice by ID
 */
export async function getVoice(voiceId: string) {
  const client = getElevenLabsClient();

  try {
    const voice = await client.voices.get(voiceId);
    return voice;
  } catch (error) {
    console.error('Error fetching voice:', error);
    throw new Error('Failed to fetch voice');
  }
}

/**
 * Delete a voice
 */
export async function deleteVoice(voiceId: string) {
  const client = getElevenLabsClient();

  try {
    await client.voices.delete(voiceId);
    return true;
  } catch (error) {
    console.error('Error deleting voice:', error);
    throw new Error('Failed to delete voice');
  }
}
