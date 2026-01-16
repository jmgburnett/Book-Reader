/**
 * Chunk text into smaller pieces for TTS processing
 * Eleven Labs has a character limit per request
 */

const DEFAULT_CHUNK_SIZE = 5000; // Characters
const SENTENCE_ENDINGS = ['.', '!', '?', '\n'];

/**
 * Split text into chunks at sentence boundaries
 * @param text - Text to chunk
 * @param maxChunkSize - Maximum characters per chunk
 * @returns Array of text chunks
 */
export function chunkText(text: string, maxChunkSize: number = DEFAULT_CHUNK_SIZE): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = '';

  // Split by sentences
  const sentences = text.split(/(?<=[.!?\n])\s+/);

  for (const sentence of sentences) {
    // If a single sentence is longer than max size, split it by words
    if (sentence.length > maxChunkSize) {
      // Save current chunk if it exists
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // Split long sentence by words
      const words = sentence.split(/\s+/);
      let wordChunk = '';

      for (const word of words) {
        if (wordChunk.length + word.length + 1 > maxChunkSize) {
          chunks.push(wordChunk.trim());
          wordChunk = word + ' ';
        } else {
          wordChunk += word + ' ';
        }
      }

      if (wordChunk.trim()) {
        currentChunk = wordChunk;
      }
    } else if (currentChunk.length + sentence.length > maxChunkSize) {
      // Current sentence would exceed limit, start new chunk
      chunks.push(currentChunk.trim());
      currentChunk = sentence + ' ';
    } else {
      // Add sentence to current chunk
      currentChunk += sentence + ' ';
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Split text into paragraphs for chapter-like reading
 * @param text - Text to split
 * @returns Array of paragraphs
 */
export function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Estimate reading time for text
 * @param text - Text to analyze
 * @param wordsPerMinute - Reading speed (default: 200 wpm)
 * @returns Estimated minutes
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get text excerpt
 * @param text - Full text
 * @param maxLength - Maximum excerpt length
 * @returns Excerpt ending at sentence boundary
 */
export function getExcerpt(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) {
    return text;
  }

  let excerpt = text.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    excerpt.lastIndexOf('.'),
    excerpt.lastIndexOf('!'),
    excerpt.lastIndexOf('?')
  );

  if (lastSentenceEnd > 0) {
    excerpt = excerpt.substring(0, lastSentenceEnd + 1);
  } else {
    excerpt = excerpt.substring(0, excerpt.lastIndexOf(' ')) + '...';
  }

  return excerpt;
}
