// These types will be auto-generated from Supabase later.
// For now, define the core types manually.

export type Concert = {
  id: string;
  artist_id: string;
  venue_id: string;
  date: string;
  start_time: string | null;
  title: string | null;
  tour_name: string | null;
  poster_url: string | null;
  is_upcoming: boolean;
  created_by_user_id: string;
  created_at: string;
};

export type Artist = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image_url: string | null;
  spotify_id: string | null;
  spotify_url: string | null;
  musicbrainz_id: string | null;
  website: string | null;
  claimed_by_user_id: string | null;
  created_at: string;
};

export type Venue = {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  website: string | null;
  capacity: number | null;
  claimed_by_user_id: string | null;
  created_at: string;
};

export type ConcertLog = {
  id: string;
  user_id: string;
  concert_id: string;
  rating_performance: number;
  rating_vibe: number;
  rating_venue: number;
  rating_sound: number;
  review_text: string | null;
  attended_with: string[];
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  spotify_url: string | null;
  created_at: string;
};
