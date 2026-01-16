# Quick Start Guide

Get your Book Reader app running in 5 steps!

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier is fine)
- An Eleven Labs account (free tier available)

## 🚀 Setup Steps

### 1. Create Supabase Project (5 min)

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Choose an organization and fill in:
   - Project name: `book-reader`
   - Database password: (create a strong password)
   - Region: (choose closest to you)
4. Click **"Create new project"** and wait ~2 minutes

### 2. Configure Environment Variables (2 min)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - Project URL
   - `anon` `public` key
   - `service_role` key

3. In your terminal:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edit `.env.local` and paste your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ELEVENLABS_API_KEY=(get this in step 4)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3. Set Up Database (3 min)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. You should see "Success. No rows returned"

### 4. Create Storage Buckets (2 min)

1. In Supabase dashboard, click **Storage**
2. Click **New bucket**
   - Name: `books`
   - Public: **Uncheck** (keep private)
   - Click **Create bucket**
3. Click **New bucket** again
   - Name: `voice-samples`
   - Public: **Uncheck**
   - Click **Create bucket**

### 5. Get Eleven Labs API Key (2 min)

1. Go to https://elevenlabs.io and sign up
2. Click on your profile → **Profile + API Key**
3. Copy your API key
4. Add it to `.env.local`:
   ```env
   ELEVENLABS_API_KEY=your_key_here
   ```

## ✅ Verify Your Setup

Run the verification script:

```bash
npm run verify-setup
```

You should see:
```
🎉 Supabase setup verification complete!
```

If you see any errors, check the detailed guide in `SETUP.md`

## 🎬 Run the App

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🧪 Test It Out

1. Click **"Sign Up"** and create an account
2. Go to **Library** and upload a small PDF
3. Go to **Voices** and use a pre-made voice (or clone your own)
4. Click **Read** on your book
5. Select a voice and click **Play** 🎉

## 🐛 Troubleshooting

**"Failed to fetch" errors**
- Restart dev server: `npm run dev`
- Check `.env.local` has all values
- Verify URLs don't have trailing slashes

**"Table does not exist"**
- Run the migration SQL in Supabase SQL Editor
- Check Tables in Supabase dashboard

**"Storage bucket not found"**
- Create `books` and `voice-samples` buckets
- Verify names are exactly correct (lowercase, no spaces)

**Need more help?**
- See detailed guide: `SETUP.md`
- Check Supabase logs: Dashboard → Logs
- Open an issue on GitHub

## 📚 Next Steps

- Read the full documentation in `README.md`
- Explore the code in `CLAUDE.md`
- Deploy to Vercel (see README for instructions)

---

**Time to first book read: ~15 minutes!** ⏱️
