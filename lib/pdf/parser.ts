import pdf from 'pdf-parse';

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modDate?: string;
}

export interface PDFParseResult {
  text: string;
  numPages: number;
  metadata: PDFMetadata;
  info: any;
}

/**
 * Parse a PDF file and extract text content
 * @param buffer - PDF file buffer
 * @returns Parsed PDF data
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    const data = await pdf(buffer);

    return {
      text: data.text,
      numPages: data.numpages,
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate,
        modDate: data.info?.ModDate,
      },
      info: data.info,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Extract text from PDF file with validation
 * @param file - File object or buffer
 * @returns Extracted text and metadata
 */
export async function extractPDFText(file: File | Buffer) {
  let buffer: Buffer;

  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  // Validate that it's a PDF
  if (!buffer.toString('utf8', 0, 4).includes('%PDF')) {
    throw new Error('Invalid PDF file');
  }

  const result = await parsePDF(buffer);

  if (!result.text || result.text.trim().length === 0) {
    throw new Error('PDF contains no extractable text');
  }

  return result;
}

/**
 * Validate PDF file size and type
 * @param file - File to validate
 * @param maxSize - Maximum file size in bytes (default: 50MB)
 */
export function validatePDF(file: File, maxSize: number = 50 * 1024 * 1024) {
  if (!file.type.includes('pdf')) {
    throw new Error('File must be a PDF');
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  return true;
}
