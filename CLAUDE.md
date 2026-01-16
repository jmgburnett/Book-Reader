# CLAUDE.md - AI Assistant Guide for Book Reader

## Project Overview

**Book Reader** is a digital book reading application designed to provide a seamless reading experience for various book formats. This document serves as a comprehensive guide for AI assistants working on this codebase.

---

## Table of Contents

1. [Repository Status](#repository-status)
2. [Project Architecture](#project-architecture)
3. [Directory Structure](#directory-structure)
4. [Development Workflow](#development-workflow)
5. [Code Conventions](#code-conventions)
6. [Testing Strategy](#testing-strategy)
7. [Documentation Standards](#documentation-standards)
8. [Git Workflow](#git-workflow)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Common Tasks](#common-tasks)

---

## Repository Status

**Current State:** This is a new repository. The initial codebase is being established.

**Tech Stack:**
- **Frontend:** Next.js 14+ (React 18+, TypeScript)
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Voice AI:** Eleven Labs API (voice cloning and text-to-speech)
- **Deployment:** Vercel (serverless, edge functions)
- **Build Tools:** Next.js built-in (Turbopack/Webpack)

**Key Dependencies:**
- `next` - React framework with API routes
- `react` & `react-dom` - UI library
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-helpers-nextjs` - Auth integration
- `elevenlabs-node` or `elevenlabs` - Eleven Labs SDK
- `pdf-parse` or `pdf.js` - PDF parsing and text extraction
- `tailwindcss` - Utility-first CSS framework
- `typescript` - Type safety
- `zod` - Runtime validation

---

## Project Architecture

### Core Components

1. **Voice Cloning System**
   - Audio upload for voice samples
   - Integration with Eleven Labs voice cloning API
   - Voice profile management (CRUD operations)
   - Voice selection and preview

2. **PDF Processing**
   - PDF upload and validation
   - Text extraction from PDFs
   - Chapter/section detection
   - Metadata extraction (title, author, pages)

3. **Text-to-Speech Engine**
   - Text chunking for API limits
   - Streaming audio generation via Eleven Labs
   - Audio playback controls (play, pause, stop, seek)
   - Reading speed adjustment
   - Queue management for long texts

4. **Book Library**
   - PDF storage in Supabase Storage
   - Book metadata in Supabase DB
   - User's book collection
   - Reading progress tracking
   - Bookmarks and notes

5. **User Authentication**
   - Supabase Auth integration
   - Email/password authentication
   - OAuth providers (Google, GitHub)
   - Protected routes and API endpoints

6. **Audio Playback Interface**
   - Real-time audio player
   - Visual progress indicator
   - Text highlighting (current sentence/paragraph)
   - Playback controls
   - Volume and speed controls

### Design Principles

- **Performance First:** Optimize for fast loading and smooth reading experience
- **Accessibility:** Support screen readers and keyboard navigation
- **Modularity:** Keep components decoupled and reusable
- **Progressive Enhancement:** Core reading functionality works everywhere
- **Privacy:** User data and reading preferences stored locally by default

---

## Directory Structure

Next.js 14+ App Router structure:

```
Book-Reader/
├── app/                        # Next.js 14+ App Router
│   ├── (auth)/                # Auth route group
│   │   ├── login/            # Login page
│   │   └── signup/           # Signup page
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── library/          # Book library page
│   │   ├── reader/           # Book reader page
│   │   │   └── [bookId]/    # Dynamic book reader
│   │   └── voices/           # Voice management page
│   ├── api/                  # API Routes (serverless functions)
│   │   ├── books/           # Book CRUD operations
│   │   ├── voices/          # Voice management
│   │   ├── tts/             # Text-to-speech generation
│   │   ├── pdf/             # PDF processing
│   │   └── webhook/         # Webhooks (Supabase, Eleven Labs)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── providers.tsx        # Context providers
├── components/               # Reusable React components
│   ├── ui/                  # Base UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   ├── audio/               # Audio player components
│   │   ├── player.tsx
│   │   └── controls.tsx
│   ├── book/                # Book-related components
│   │   ├── pdf-viewer.tsx
│   │   └── book-card.tsx
│   └── voice/               # Voice-related components
│       ├── voice-clone.tsx
│       └── voice-selector.tsx
├── lib/                      # Core business logic
│   ├── supabase/            # Supabase client & utilities
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   └── middleware.ts    # Auth middleware
│   ├── elevenlabs/          # Eleven Labs integration
│   │   ├── client.ts        # API client
│   │   ├── tts.ts          # Text-to-speech functions
│   │   └── voices.ts        # Voice management
│   ├── pdf/                 # PDF processing
│   │   ├── parser.ts        # PDF parsing
│   │   └── extractor.ts     # Text extraction
│   ├── audio/               # Audio processing
│   │   ├── chunker.ts       # Text chunking
│   │   └── queue.ts         # Audio queue management
│   └── utils/               # Utility functions
│       ├── validation.ts    # Input validation
│       └── helpers.ts       # General helpers
├── types/                    # TypeScript type definitions
│   ├── book.ts
│   ├── voice.ts
│   ├── audio.ts
│   └── supabase.ts
├── hooks/                    # Custom React hooks
│   ├── useAudioPlayer.ts
│   ├── useBookReader.ts
│   └── useVoices.ts
├── public/                   # Static assets
│   ├── icons/
│   └── images/
├── supabase/                 # Supabase configuration
│   ├── migrations/          # Database migrations
│   └── seed.sql             # Seed data
├── tests/                    # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/                  # GitHub configurations
│   └── workflows/           # CI/CD workflows
├── .env.local.example       # Environment variables template
├── .env.local               # Local environment variables (gitignored)
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── vercel.json              # Vercel deployment config
```

---

## Development Workflow

### Branch Strategy

- **main/master:** Production-ready code
- **develop:** Integration branch for features
- **claude/*:** AI assistant working branches (temporary)
- **feature/*:** New feature development
- **bugfix/*:** Bug fixes
- **hotfix/*:** Emergency production fixes

### Before Making Changes

1. **Understand the Context:**
   - Read relevant existing code
   - Check for related issues or PRs
   - Review recent commits in the affected area

2. **Plan the Implementation:**
   - Break down complex tasks into smaller steps
   - Use TodoWrite tool to track progress
   - Identify files that need changes

3. **Verify Assumptions:**
   - Ask clarifying questions if requirements are unclear
   - Use AskUserQuestion tool when multiple approaches are viable

### Making Changes

1. **Read Before Writing:**
   - Always read files before modifying them
   - Understand existing patterns and conventions
   - Maintain consistency with surrounding code

2. **Minimal Changes:**
   - Make only necessary changes
   - Avoid refactoring unrelated code
   - Don't add features beyond the request

3. **Code Quality:**
   - Follow existing code style
   - Add comments only where logic is non-obvious
   - Ensure proper error handling at system boundaries

4. **Security:**
   - Validate user input
   - Sanitize data before rendering
   - Avoid common vulnerabilities (XSS, SQL injection, etc.)

### After Making Changes

1. **Test Your Changes:**
   - Run existing tests
   - Add tests for new functionality
   - Verify in the application if possible

2. **Document if Needed:**
   - Update API documentation for interface changes
   - Add JSDoc comments for public functions
   - Update README if user-facing features changed

3. **Commit and Push:**
   - Write clear, descriptive commit messages
   - Use conventional commit format (feat:, fix:, docs:, etc.)
   - Push to the appropriate branch

---

## Code Conventions

### General Principles

- **DRY (Don't Repeat Yourself):** Extract common logic, but avoid premature abstraction
- **YAGNI (You Aren't Gonna Need It):** Don't add functionality until it's needed
- **KISS (Keep It Simple, Stupid):** Prefer simple solutions over complex ones

### Naming Conventions

```javascript
// Variables and functions: camelCase
const bookTitle = "Example Book";
function loadBook(bookId) { }

// Classes and Components: PascalCase
class BookReader { }
const BookViewer = () => { }

// Constants: UPPER_SNAKE_CASE
const MAX_BOOK_SIZE = 50 * 1024 * 1024;

// Private methods/properties: prefix with underscore
class Reader {
  _privateMethod() { }
}

// Files: kebab-case for multi-word files
// book-reader.js, library-manager.js
```

### File Organization

- One component/class per file
- Group related functionality in directories
- Index files for clean imports
- Keep files under 300 lines when possible

### Comments

- Write self-documenting code first
- Add comments for "why", not "what"
- Document complex algorithms
- Use JSDoc for public APIs

```javascript
// Good: Explains why
// Use binary search since books array is sorted by title
const index = binarySearch(books, title);

// Bad: States the obvious
// Loop through books
for (const book of books) { }

// Good: JSDoc for public API
/**
 * Loads a book from the library by its ID
 * @param {string} bookId - Unique identifier for the book
 * @returns {Promise<Book>} The loaded book object
 * @throws {BookNotFoundError} If book doesn't exist
 */
async function loadBook(bookId) { }
```

### Error Handling

```javascript
// Validate at boundaries
function addBookToLibrary(book) {
  if (!book || !book.id) {
    throw new Error('Invalid book object');
  }
  // ... proceed with valid data
}

// Don't over-validate internal code
function _processBookMetadata(book) {
  // Trust that book is valid since it's internal
  return book.metadata;
}

// Use specific error types
class BookNotFoundError extends Error {
  constructor(bookId) {
    super(`Book not found: ${bookId}`);
    this.name = 'BookNotFoundError';
  }
}
```

---

## Testing Strategy

### Test Structure

```
tests/
├── unit/              # Fast, isolated tests
├── integration/       # Tests for component interaction
└── e2e/              # Full user workflow tests
```

### Testing Guidelines

1. **Unit Tests:**
   - Test individual functions and methods
   - Mock external dependencies
   - Fast execution (< 100ms per test)
   - High coverage for core logic

2. **Integration Tests:**
   - Test component interactions
   - Use real dependencies when practical
   - Focus on critical paths

3. **E2E Tests:**
   - Test user workflows
   - Cover happy paths and critical errors
   - Run in CI/CD pipeline

### Test Naming

```javascript
describe('BookReader', () => {
  describe('loadBook', () => {
    it('should load a valid book successfully', () => {});
    it('should throw BookNotFoundError for invalid ID', () => {});
    it('should cache loaded books for performance', () => {});
  });
});
```

### When to Write Tests

- **New features:** Add tests for core functionality
- **Bug fixes:** Add regression test first
- **Refactoring:** Ensure existing tests pass
- **Don't test:** UI styling, trivial getters/setters

---

## Documentation Standards

### README.md

- Project description and features
- Installation instructions
- Quick start guide
- Links to detailed documentation

### API Documentation

- Document all public interfaces
- Include usage examples
- Document error conditions
- Keep synchronized with code

### Architecture Decisions

- Use ADR (Architecture Decision Records) for significant choices
- Store in `docs/architecture/`
- Include context, decision, and consequences

### Code Documentation

- JSDoc for public APIs
- Inline comments for complex logic
- TODO comments with issue references

```javascript
/**
 * BookReader manages the reading experience
 *
 * @example
 * const reader = new BookReader(bookId);
 * await reader.open();
 * reader.goToPage(5);
 */
class BookReader {
  // TODO: Add annotation support (issue #123)
}
```

---

## Git Workflow

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(reader): add EPUB support

Implement EPUB parser and renderer for displaying
EPUB format books in the reader interface.

Closes #45
```

```
fix(library): prevent duplicate books in collection

Add unique constraint check before adding books
to prevent duplicates in user's library.

Fixes #78
```

### Branch Naming

- `feature/add-pdf-support`
- `bugfix/fix-page-navigation`
- `hotfix/critical-security-patch`
- `claude/task-description-xxxxx` (AI assistant branches)

### Pull Requests

1. **Title:** Clear, descriptive summary
2. **Description:**
   - Summary of changes
   - Motivation and context
   - Testing performed
   - Screenshots (if UI changes)
3. **Review:** Request review before merging
4. **CI/CD:** Ensure all checks pass

---

## AI Assistant Guidelines

### General Principles

1. **Read First, Write Second:**
   - Always read files before modifying
   - Understand existing patterns
   - Maintain consistency

2. **Minimal Changes:**
   - Only change what's necessary
   - Avoid refactoring unrelated code
   - Don't add unrequested features

3. **Ask When Uncertain:**
   - Use AskUserQuestion for clarification
   - Don't guess at requirements
   - Verify assumptions about architecture

4. **Track Progress:**
   - Use TodoWrite for multi-step tasks
   - Mark tasks as in_progress, then completed
   - Keep user informed of progress

### Common Patterns

#### Reading a Book File

```javascript
// src/core/parsers/base-parser.js
class BaseParser {
  async parse(filePath) {
    const content = await this.readFile(filePath);
    const metadata = this.extractMetadata(content);
    const chapters = this.extractChapters(content);
    return { metadata, chapters };
  }
}
```

#### Managing Library State

```javascript
// src/core/library/library-manager.js
class LibraryManager {
  constructor() {
    this.books = new Map();
    this.collections = new Map();
  }

  addBook(book) {
    if (this.books.has(book.id)) {
      throw new Error('Book already exists');
    }
    this.books.set(book.id, book);
  }
}
```

#### Reader State Management

```javascript
// src/core/reader/reader-state.js
class ReaderState {
  constructor(book) {
    this.book = book;
    this.currentPage = 0;
    this.bookmarks = [];
    this.annotations = [];
  }

  goToPage(pageNumber) {
    if (pageNumber < 0 || pageNumber >= this.book.pageCount) {
      throw new RangeError('Invalid page number');
    }
    this.currentPage = pageNumber;
  }
}
```

### File Locations

- **Parsers:** `src/core/parsers/`
- **Reader logic:** `src/core/reader/`
- **Library management:** `src/core/library/`
- **UI components:** `src/components/`
- **Utilities:** `src/utils/`
- **Tests:** `tests/` (mirroring src structure)

### Security Checklist

- [ ] Validate file uploads (size, type)
- [ ] Sanitize user input before display
- [ ] Escape HTML in book content
- [ ] Prevent path traversal in file operations
- [ ] Implement CSRF protection for APIs
- [ ] Use secure headers
- [ ] Don't expose sensitive errors to users

### Performance Guidelines

1. **Lazy Loading:**
   - Load book content on demand
   - Paginate large libraries
   - Defer non-critical resources

2. **Caching:**
   - Cache parsed books
   - Cache rendered pages
   - Implement proper cache invalidation

3. **Optimization:**
   - Minimize DOM operations
   - Use virtual scrolling for large lists
   - Optimize image loading

---

## Third-Party Integrations

### Eleven Labs API

**Purpose:** Voice cloning and text-to-speech generation

**Key Operations:**

1. **Voice Cloning:**
   ```typescript
   // lib/elevenlabs/voices.ts
   import { ElevenLabsClient } from "elevenlabs";

   const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

   // Clone a voice from audio samples
   async function cloneVoice(audioFiles: File[], name: string, description: string) {
     const voice = await client.voices.add({
       name,
       description,
       files: audioFiles,
     });
     return voice;
   }
   ```

2. **Text-to-Speech:**
   ```typescript
   // lib/elevenlabs/tts.ts
   async function generateSpeech(text: string, voiceId: string) {
     const audio = await client.textToSpeech.convert(voiceId, {
       text,
       model_id: "eleven_multilingual_v2",
     });
     return audio;
   }
   ```

3. **Streaming TTS:**
   ```typescript
   // For long texts, use streaming
   async function streamSpeech(text: string, voiceId: string) {
     const stream = await client.textToSpeech.convertAsStream(voiceId, {
       text,
       model_id: "eleven_multilingual_v2",
     });
     return stream;
   }
   ```

**Best Practices:**
- Chunk text into manageable sizes (< 5000 characters)
- Cache generated audio when possible
- Handle rate limits gracefully
- Store voice IDs in database for reuse
- Use streaming for real-time playback

**Environment Variables:**
```bash
ELEVENLABS_API_KEY=your_api_key_here
```

### Supabase Integration

**Purpose:** Database, authentication, and file storage

**Setup:**

1. **Client Configuration:**
   ```typescript
   // lib/supabase/client.ts (browser)
   import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

   export const createClient = () => createClientComponentClient();
   ```

   ```typescript
   // lib/supabase/server.ts (server components)
   import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
   import { cookies } from 'next/headers';

   export const createClient = () => createServerComponentClient({ cookies });
   ```

2. **Database Schema:**
   ```sql
   -- supabase/migrations/001_initial_schema.sql

   -- Users table (extended from auth.users)
   create table public.profiles (
     id uuid references auth.users on delete cascade primary key,
     email text,
     full_name text,
     avatar_url text,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Books table
   create table public.books (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references public.profiles on delete cascade,
     title text not null,
     author text,
     file_path text not null,
     file_size bigint,
     page_count integer,
     created_at timestamp with time zone default timezone('utc'::text, now()),
     updated_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Voices table
   create table public.voices (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references public.profiles on delete cascade,
     elevenlabs_voice_id text not null unique,
     name text not null,
     description text,
     is_default boolean default false,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Reading progress table
   create table public.reading_progress (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references public.profiles on delete cascade,
     book_id uuid references public.books on delete cascade,
     current_page integer default 0,
     current_position integer default 0,
     last_read_at timestamp with time zone default timezone('utc'::text, now()),
     unique(user_id, book_id)
   );

   -- Bookmarks table
   create table public.bookmarks (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references public.profiles on delete cascade,
     book_id uuid references public.books on delete cascade,
     page_number integer not null,
     text_snippet text,
     note text,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Enable Row Level Security
   alter table public.profiles enable row level security;
   alter table public.books enable row level security;
   alter table public.voices enable row level security;
   alter table public.reading_progress enable row level security;
   alter table public.bookmarks enable row level security;

   -- RLS Policies
   create policy "Users can view own profile"
     on public.profiles for select
     using (auth.uid() = id);

   create policy "Users can update own profile"
     on public.profiles for update
     using (auth.uid() = id);

   create policy "Users can view own books"
     on public.books for select
     using (auth.uid() = user_id);

   create policy "Users can insert own books"
     on public.books for insert
     with check (auth.uid() = user_id);

   create policy "Users can update own books"
     on public.books for update
     using (auth.uid() = user_id);

   create policy "Users can delete own books"
     on public.books for delete
     using (auth.uid() = user_id);
   ```

3. **Storage Buckets:**
   ```typescript
   // Create buckets for PDFs and audio samples
   // Bucket: 'books' - for PDF files
   // Bucket: 'voice-samples' - for voice training audio

   // Upload PDF
   async function uploadBook(file: File, userId: string) {
     const fileName = `${userId}/${Date.now()}-${file.name}`;
     const { data, error } = await supabase.storage
       .from('books')
       .upload(fileName, file);
     return data?.path;
   }
   ```

4. **Authentication:**
   ```typescript
   // app/api/auth/callback/route.ts
   import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
   import { cookies } from 'next/headers';
   import { NextResponse } from 'next/server';

   export async function GET(request: Request) {
     const requestUrl = new URL(request.url);
     const code = requestUrl.searchParams.get('code');

     if (code) {
       const supabase = createRouteHandlerClient({ cookies });
       await supabase.auth.exchangeCodeForSession(code);
     }

     return NextResponse.redirect(requestUrl.origin);
   }
   ```

**Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Vercel Deployment

**Configuration:**

1. **vercel.json:**
   ```json
   {
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "nextjs",
     "regions": ["iad1"],
     "env": {
       "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
       "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
       "ELEVENLABS_API_KEY": "@elevenlabs-api-key"
     }
   }
   ```

2. **Edge Functions:**
   ```typescript
   // app/api/tts/route.ts
   export const runtime = 'edge'; // Use edge runtime for low latency

   export async function POST(request: Request) {
     // TTS logic here
   }
   ```

3. **Environment Variables:**
   - Set in Vercel dashboard or via CLI
   - Use `NEXT_PUBLIC_` prefix for client-side variables
   - Keep sensitive keys server-side only

**Deployment Steps:**
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up Supabase connection
4. Configure domains (if custom)
5. Enable automatic deployments on push

**Best Practices:**
- Use Edge Functions for TTS to reduce latency
- Enable caching for static assets
- Use incremental static regeneration (ISR) where applicable
- Monitor function execution times
- Set appropriate timeout limits for long-running operations

---

## Common Tasks

### Adding a New Voice

1. Navigate to `/voices` page
2. Upload audio samples (at least 1 minute of clear speech)
3. Use `lib/elevenlabs/voices.ts` to call Eleven Labs API
4. Store voice ID in Supabase `voices` table
5. Display in voice selector component

**Code:**
```typescript
// app/api/voices/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const audioFiles = formData.getAll('files') as File[];
  const name = formData.get('name') as string;

  // Clone voice with Eleven Labs
  const voice = await cloneVoice(audioFiles, name, description);

  // Save to database
  const { data, error } = await supabase
    .from('voices')
    .insert({ elevenlabs_voice_id: voice.voice_id, name, user_id });

  return NextResponse.json(data);
}
```

### Processing a PDF

1. User uploads PDF via `/library` page
2. API route validates file (size, type)
3. Upload to Supabase Storage
4. Extract text using `lib/pdf/parser.ts`
5. Store metadata in `books` table
6. Return book ID for reader

**Code:**
```typescript
// app/api/books/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Upload to storage
  const filePath = await uploadBook(file, userId);

  // Extract text and metadata
  const { text, metadata } = await parsePDF(file);

  // Save to database
  const { data } = await supabase.from('books').insert({
    title: metadata.title,
    author: metadata.author,
    file_path: filePath,
    page_count: metadata.pageCount,
    user_id: userId
  });

  return NextResponse.json(data);
}
```

### Generating Speech from Text

1. User opens book in reader (`/reader/[bookId]`)
2. Select voice from dropdown
3. Click play button
4. Chunk text into manageable pieces
5. Stream audio from Eleven Labs API
6. Play in audio player component

**Code:**
```typescript
// app/api/tts/route.ts
export const runtime = 'edge';

export async function POST(request: Request) {
  const { text, voiceId } = await request.json();

  // Chunk text if needed
  const chunks = chunkText(text, 5000);

  // Stream first chunk
  const audioStream = await streamSpeech(chunks[0], voiceId);

  return new Response(audioStream, {
    headers: { 'Content-Type': 'audio/mpeg' }
  });
}
```

### Adding Reading Progress Tracking

1. Update `reading_progress` table on page/position change
2. Use debounced updates to avoid excessive writes
3. Load progress when opening book
4. Display progress indicator in UI

**Code:**
```typescript
// hooks/useReadingProgress.ts
export function useReadingProgress(bookId: string) {
  const saveProgress = useDebouncedCallback(
    async (page: number, position: number) => {
      await supabase.from('reading_progress').upsert({
        book_id: bookId,
        user_id: userId,
        current_page: page,
        current_position: position,
        last_read_at: new Date().toISOString()
      });
    },
    1000
  );

  return { saveProgress };
}
```

### Adding Authentication

1. Set up Supabase Auth in `lib/supabase/`
2. Create login/signup pages in `app/(auth)/`
3. Add middleware for protected routes
4. Use `createServerComponentClient` in server components
5. Use `createClientComponentClient` in client components

**Code:**
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
```

### Fixing a Bug

1. Reproduce the bug locally
2. Check error logs (Vercel logs, browser console)
3. Write a failing test
4. Fix the bug
5. Verify test passes
6. Test in development environment
7. Commit with descriptive message
8. Push and verify in staging/production

### Adding Tests

1. Identify what to test (unit, integration, e2e)
2. Create test file in `tests/` directory
3. Write descriptive test cases
4. Mock external services (Eleven Labs, Supabase)
5. Run test suite: `npm test`
6. Ensure tests pass in CI/CD pipeline

**Example:**
```typescript
// tests/unit/lib/pdf/parser.test.ts
import { parsePDF } from '@/lib/pdf/parser';

describe('PDF Parser', () => {
  it('should extract text from valid PDF', async () => {
    const file = new File(['mock pdf content'], 'test.pdf');
    const result = await parsePDF(file);

    expect(result.text).toBeDefined();
    expect(result.metadata.pageCount).toBeGreaterThan(0);
  });

  it('should throw error for invalid PDF', async () => {
    const file = new File(['not a pdf'], 'invalid.pdf');

    await expect(parsePDF(file)).rejects.toThrow();
  });
});
```

---

## Quick Reference

### Essential Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
# or with watch mode
npm test -- --watch

# Build for production
npm run build

# Start production server (after build)
npm start

# Lint code
npm run lint

# Format code (if Prettier is configured)
npm run format

# Type check
npx tsc --noEmit

# Supabase commands (if using Supabase CLI)
npx supabase init
npx supabase start
npx supabase migration new migration_name
npx supabase db push
```

### File References

When referencing code in responses, use the pattern:
```
src/core/reader/book-reader.js:42
```

This helps users navigate to the exact location.

### Important Files

- `CLAUDE.md` (this file): AI assistant guide
- `README.md`: User-facing documentation
- `package.json`: Dependencies and scripts
- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `.env.local`: Environment variables (gitignored)
- `.env.local.example`: Environment variables template
- `middleware.ts`: Next.js middleware (auth, routing)
- `vercel.json`: Vercel deployment configuration
- `supabase/migrations/`: Database schema migrations

---

## Revision History

| Date       | Version | Changes                                              |
|------------|---------|------------------------------------------------------|
| 2026-01-16 | 1.0.0   | Initial creation of CLAUDE.md                        |
| 2026-01-16 | 2.0.0   | Updated with full tech stack (Next.js, Supabase, ElevenLabs) |
|            |         | Added Third-Party Integrations section               |
|            |         | Updated directory structure for Next.js App Router   |
|            |         | Updated Common Tasks with actual implementation      |
|            |         | Added database schema and code examples              |

---

## Notes for Future Updates

This document should be updated when:

- Tech stack is chosen and implemented
- Major architectural decisions are made
- New conventions are established
- Development workflow changes
- New common patterns emerge

Keep this document as a single source of truth for AI assistants working on this codebase.

---

**Last Updated:** 2026-01-16
**Maintained By:** AI Assistants working on this repository
**Questions?** Check the issues or discussions in the repository.
