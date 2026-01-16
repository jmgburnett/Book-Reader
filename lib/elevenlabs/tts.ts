import { getElevenLabsClient } from './client';

export interface TTSParams {
  text: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

/**
 * Convert text to speech using Eleven Labs
 * @param params - TTS parameters
 * @returns Audio buffer
 */
export async function textToSpeech(params: TTSParams) {
  const client = getElevenLabsClient();

  try {
    const audio = await client.textToSpeech.convert(params.voiceId, {
      text: params.text,
      model_id: params.modelId || 'eleven_multilingual_v2',
      voice_settings: {
        stability: params.stability || 0.5,
        similarity_boost: params.similarityBoost || 0.75,
      },
    });

    return audio;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech');
  }
}

/**
 * Stream text to speech for real-time playback
 * @param params - TTS parameters
 * @returns Audio stream
 */
export async function textToSpeechStream(params: TTSParams) {
  const client = getElevenLabsClient();

  try {
    const audioStream = await client.textToSpeech.convertAsStream(params.voiceId, {
      text: params.text,
      model_id: params.modelId || 'eleven_multilingual_v2',
      voice_settings: {
        stability: params.stability || 0.5,
        similarity_boost: params.similarityBoost || 0.75,
      },
    });

    return audioStream;
  } catch (error) {
    console.error('Error streaming speech:', error);
    throw new Error('Failed to stream speech');
  }
}

/**
 * Get available TTS models
 */
export async function getModels() {
  const client = getElevenLabsClient();

  try {
    const models = await client.models.getAll();
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw new Error('Failed to fetch models');
  }
}
