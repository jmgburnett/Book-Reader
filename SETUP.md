# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Book Reader application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Project Name**: Book Reader (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
5. Click "Create new project"
6. Wait for the project to finish setting up (2-3 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon on left sidebar)
2. Click on **API** in the settings menu
3. You'll see several keys. Copy these values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - Keep this secret!

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

   # Eleven Labs Configuration (get from elevenlabs.io)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 4: Run Database Migration

1. In your Supabase dashboard, click on **SQL Editor** (icon on left sidebar)
2. Click **New Query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Copy the entire contents
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. You should see a success message

**What this migration creates:**
- ✅ `profiles` table - User profiles
- ✅ `books` table - Book metadata
- ✅ `voices` table - Voice clones
- ✅ `reading_progress` table - Reading progress tracking
- ✅ `bookmarks` table - User bookmarks
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Automatic profile creation trigger
- ✅ Database indexes for performance

## Step 5: Create Storage Buckets

### Create 'books' Bucket

1. Click on **Storage** (icon on left sidebar)
2. Click **New bucket**
3. Fill in the details:
   - **Name**: `books`
   - **Public bucket**: ❌ (keep private for user security)
4. Click **Create bucket**

5. Set up bucket policies:
   - Click on the `books` bucket
   - Go to **Policies** tab
   - Click **New Policy**
   - Select **Custom policy**
   - Add this policy for SELECT (view):
     ```sql
     CREATE POLICY "Users can view own books"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'books' AND auth.uid()::text = (storage.foldername(name))[1]);
     ```

   - Click **New Policy** again for INSERT:
     ```sql
     CREATE POLICY "Users can upload own books"
     ON storage.objects FOR INSERT
     WITH CHECK (bucket_id = 'books' AND auth.uid()::text = (storage.foldername(name))[1]);
     ```

   - Click **New Policy** again for DELETE:
     ```sql
     CREATE POLICY "Users can delete own books"
     ON storage.objects FOR DELETE
     USING (bucket_id = 'books' AND auth.uid()::text = (storage.foldername(name))[1]);
     ```

### Create 'voice-samples' Bucket

1. Click **New bucket** again
2. Fill in the details:
   - **Name**: `voice-samples`
   - **Public bucket**: ❌ (keep private)
3. Click **Create bucket**
4. Add similar policies as above (replace 'books' with 'voice-samples')

## Step 6: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Enable additional providers (Google, GitHub, etc.)
4. Go to **Authentication** → **URL Configuration**
5. Add your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/api/auth/callback`

## Step 7: Get Eleven Labs API Key

1. Go to [https://elevenlabs.io](https://elevenlabs.io)
2. Sign up or log in
3. Go to your **Profile** → **API Keys**
4. Copy your API key
5. Add it to `.env.local`:
   ```env
   ELEVENLABS_API_KEY=your_api_key_here
   ```

## Step 8: Test Your Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

4. Test the following:
   - ✅ Sign up for a new account
   - ✅ Log in with your credentials
   - ✅ Upload a small PDF to the library
   - ✅ View the uploaded book
   - ✅ Try the reader (you'll need a voice first)

## Troubleshooting

### "Failed to fetch" errors
- Check that your environment variables are correct
- Make sure `.env.local` exists and has the right values
- Restart the dev server after changing environment variables

### Database errors
- Verify the migration ran successfully in SQL Editor
- Check the Table Editor to confirm tables were created
- Review the Database → Logs for any errors

### Storage errors
- Confirm buckets were created with correct names
- Verify RLS policies are set up for both buckets
- Check Storage → Logs for permission errors

### Authentication errors
- Verify email provider is enabled
- Check redirect URLs are configured
- Look at Authentication → Logs for details

## Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables configured in `.env.local`
- [ ] Database migration run successfully
- [ ] All 5 tables visible in Table Editor
- [ ] `books` storage bucket created
- [ ] `voice-samples` storage bucket created
- [ ] Storage policies configured for both buckets
- [ ] Email authentication enabled
- [ ] Redirect URLs configured
- [ ] Eleven Labs API key obtained and added
- [ ] Development server runs without errors
- [ ] Can sign up for a new account
- [ ] Can log in successfully

## Next Steps

Once setup is complete:

1. **Upload a test book** - Try uploading a small PDF
2. **Clone a voice** - Upload some audio samples to create a voice
3. **Test the reader** - Open a book and listen to it being read
4. **Deploy to production** - Follow the deployment guide in README.md

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or open an issue on GitHub.
