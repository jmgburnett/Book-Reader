# Book Reader - AI-Powered Voice Reading

An intelligent book reader application that uses Eleven Labs to clone your voice and read PDF books aloud in your personalized voice.

## Features

- 📚 **PDF Upload & Management** - Upload and organize your PDF book collection
- 🎙️ **Voice Cloning** - Clone any voice using Eleven Labs AI technology
- 🔊 **Text-to-Speech** - Listen to books read aloud in your chosen voice
- 📖 **Reading Progress** - Track your reading progress across all books
- 🔖 **Bookmarks & Notes** - Save bookmarks and add notes to your favorite passages
- 🔐 **Secure Authentication** - User authentication powered by Supabase
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14+ with React 18+ and TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Voice AI**: Eleven Labs API
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account ([supabase.com](https://supabase.com))
- An Eleven Labs API key ([elevenlabs.io](https://elevenlabs.io))

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jmgburnett/Book-Reader.git
cd Book-Reader
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your API keys
3. Run the database migration:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the SQL
4. Create storage buckets:
   - Go to Storage in Supabase dashboard
   - Create a bucket named `books` (public or private as needed)
   - Create a bucket named `voice-samples` (private)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Eleven Labs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Book-Reader/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Core business logic
│   ├── supabase/         # Supabase client
│   ├── elevenlabs/       # Eleven Labs integration
│   ├── pdf/              # PDF processing
│   └── audio/            # Audio utilities
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
├── supabase/             # Database migrations
└── public/               # Static assets
```

## Usage

### Upload a Book

1. Sign up or log in to your account
2. Navigate to the Library page
3. Click "Upload Book"
4. Select a PDF file from your computer
5. The book will be processed and added to your library

### Clone a Voice

1. Go to the Voices page
2. Click "Clone New Voice"
3. Upload audio samples (at least 1 minute of clear speech)
4. Name your voice
5. Wait for processing
6. Your voice will appear in the voice selector

### Listen to a Book

1. Open a book from your library
2. Select your preferred voice from the dropdown
3. Click the play button
4. Use controls to pause, adjust speed, or skip sections

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ELEVENLABS_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## API Routes

- `POST /api/books` - Upload a new book
- `GET /api/books` - Get user's books
- `POST /api/voices` - Clone a new voice
- `GET /api/voices` - Get user's voices
- `POST /api/tts` - Generate speech from text

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- [Eleven Labs](https://elevenlabs.io) for voice cloning and TTS
- [Supabase](https://supabase.com) for backend infrastructure
- [Vercel](https://vercel.com) for hosting and deployment
- [Next.js](https://nextjs.org) for the React framework

---

**Built with ❤️ using Next.js, Supabase, and Eleven Labs**
