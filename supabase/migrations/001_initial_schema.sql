-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extended from auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Books table
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  author text,
  file_path text not null,
  file_size bigint,
  page_count integer,
  total_text_length integer,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Voices table
create table public.voices (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  elevenlabs_voice_id text not null unique,
  name text not null,
  description text,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Reading progress table
create table public.reading_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  current_page integer default 0,
  current_position integer default 0,
  progress_percentage decimal(5,2) default 0,
  last_read_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, book_id)
);

-- Bookmarks table
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  page_number integer not null,
  position integer,
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

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for books
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

-- RLS Policies for voices
create policy "Users can view own voices"
  on public.voices for select
  using (auth.uid() = user_id);

create policy "Users can insert own voices"
  on public.voices for insert
  with check (auth.uid() = user_id);

create policy "Users can update own voices"
  on public.voices for update
  using (auth.uid() = user_id);

create policy "Users can delete own voices"
  on public.voices for delete
  using (auth.uid() = user_id);

-- RLS Policies for reading_progress
create policy "Users can view own reading progress"
  on public.reading_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own reading progress"
  on public.reading_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reading progress"
  on public.reading_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own reading progress"
  on public.reading_progress for delete
  using (auth.uid() = user_id);

-- RLS Policies for bookmarks
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index books_user_id_idx on public.books(user_id);
create index voices_user_id_idx on public.voices(user_id);
create index reading_progress_user_id_book_id_idx on public.reading_progress(user_id, book_id);
create index bookmarks_user_id_book_id_idx on public.bookmarks(user_id, book_id);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_books_updated_at before update on public.books
  for each row execute procedure public.handle_updated_at();
