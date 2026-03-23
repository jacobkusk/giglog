-- GigLog Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  spotify_url text,
  created_at timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- ARTISTS
-- ============================================
create table public.artists (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  bio text,
  image_url text,
  spotify_id text,
  spotify_url text,
  musicbrainz_id text,
  website text,
  claimed_by_user_id uuid references public.profiles(id),
  created_at timestamptz default now() not null
);

create index idx_artists_slug on public.artists(slug);
create index idx_artists_name on public.artists using gin(to_tsvector('english', name));

-- ============================================
-- VENUES
-- ============================================
create table public.venues (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  city text not null,
  country text not null,
  address text,
  latitude double precision,
  longitude double precision,
  image_url text,
  website text,
  capacity integer,
  claimed_by_user_id uuid references public.profiles(id),
  created_at timestamptz default now() not null
);

create index idx_venues_slug on public.venues(slug);
create index idx_venues_city on public.venues(city);

-- ============================================
-- CONCERTS
-- ============================================
create table public.concerts (
  id uuid default uuid_generate_v4() primary key,
  artist_id uuid references public.artists(id) not null,
  venue_id uuid references public.venues(id) not null,
  date date not null,
  start_time timestamptz,
  title text,
  tour_name text,
  poster_url text,
  is_upcoming boolean default false,
  created_by_user_id uuid references public.profiles(id),
  created_at timestamptz default now() not null
);

create index idx_concerts_artist on public.concerts(artist_id);
create index idx_concerts_venue on public.concerts(venue_id);
create index idx_concerts_date on public.concerts(date desc);

-- ============================================
-- CONCERT LOGS (user's personal diary entry)
-- ============================================
create table public.concert_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concert_id uuid references public.concerts(id) on delete cascade not null,
  rating_performance smallint check (rating_performance between 1 and 5),
  rating_vibe smallint check (rating_vibe between 1 and 5),
  rating_venue smallint check (rating_venue between 1 and 5),
  rating_sound smallint check (rating_sound between 1 and 5),
  review_text text,
  attended_with uuid[] default '{}',
  created_at timestamptz default now() not null,
  unique(user_id, concert_id)
);

create index idx_concert_logs_user on public.concert_logs(user_id);
create index idx_concert_logs_concert on public.concert_logs(concert_id);

-- ============================================
-- SETLIST ITEMS
-- ============================================
create table public.setlist_items (
  id uuid default uuid_generate_v4() primary key,
  concert_id uuid references public.concerts(id) on delete cascade not null,
  position integer not null,
  song_title text not null,
  timestamp timestamptz,
  spotify_track_id text,
  added_by_user_id uuid references public.profiles(id),
  created_at timestamptz default now() not null
);

create index idx_setlist_concert on public.setlist_items(concert_id);

-- ============================================
-- CONCERT MEDIA (photos & videos — the pinboard)
-- ============================================
create table public.concert_media (
  id uuid default uuid_generate_v4() primary key,
  concert_id uuid references public.concerts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  media_type text not null check (media_type in ('image', 'video')),
  url text not null,
  caption text,
  created_at timestamptz default now() not null
);

create index idx_concert_media_concert on public.concert_media(concert_id);

-- ============================================
-- FOLLOWS
-- ============================================
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (follower_id, following_id)
);

create index idx_follows_follower on public.follows(follower_id);
create index idx_follows_following on public.follows(following_id);

-- ============================================
-- EVENT REMINDERS
-- ============================================
create table public.event_reminders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concert_id uuid references public.concerts(id) on delete cascade not null,
  remind_at timestamptz not null,
  sent boolean default false,
  created_at timestamptz default now() not null
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.artists enable row level security;
alter table public.venues enable row level security;
alter table public.concerts enable row level security;
alter table public.concert_logs enable row level security;
alter table public.setlist_items enable row level security;
alter table public.concert_media enable row level security;
alter table public.follows enable row level security;
alter table public.event_reminders enable row level security;

-- Profiles: public read, own write
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Artists: public read, authenticated create
create policy "Artists are viewable by everyone" on public.artists for select using (true);
create policy "Authenticated users can create artists" on public.artists for insert with check (auth.role() = 'authenticated');

-- Venues: public read, authenticated create
create policy "Venues are viewable by everyone" on public.venues for select using (true);
create policy "Authenticated users can create venues" on public.venues for insert with check (auth.role() = 'authenticated');

-- Concerts: public read, authenticated create
create policy "Concerts are viewable by everyone" on public.concerts for select using (true);
create policy "Authenticated users can create concerts" on public.concerts for insert with check (auth.role() = 'authenticated');

-- Concert logs: public read, own write
create policy "Concert logs are viewable by everyone" on public.concert_logs for select using (true);
create policy "Users can create own logs" on public.concert_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own logs" on public.concert_logs for update using (auth.uid() = user_id);
create policy "Users can delete own logs" on public.concert_logs for delete using (auth.uid() = user_id);

-- Setlist items: public read, authenticated create
create policy "Setlists are viewable by everyone" on public.setlist_items for select using (true);
create policy "Authenticated users can add setlist items" on public.setlist_items for insert with check (auth.role() = 'authenticated');

-- Concert media: public read, own write
create policy "Media is viewable by everyone" on public.concert_media for select using (true);
create policy "Users can upload own media" on public.concert_media for insert with check (auth.uid() = user_id);
create policy "Users can delete own media" on public.concert_media for delete using (auth.uid() = user_id);

-- Follows: public read, own write
create policy "Follows are viewable by everyone" on public.follows for select using (true);
create policy "Users can follow" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

-- Reminders: own only
create policy "Users can view own reminders" on public.event_reminders for select using (auth.uid() = user_id);
create policy "Users can create own reminders" on public.event_reminders for insert with check (auth.uid() = user_id);
create policy "Users can delete own reminders" on public.event_reminders for delete using (auth.uid() = user_id);
