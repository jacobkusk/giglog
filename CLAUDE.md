# GigLog — Claude Code Context

## What is this?
GigLog is a "Letterboxd for live music" — users log concerts they've attended, rate them (performance, vibe, venue, sound), upload photos, follow friends, and discover artists and venues.

## Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Postgres, Auth, Storage, Realtime)
- **Hosting**: Vercel
- **Language**: English (all UI and code)

## Project Structure
```
src/
├── app/            # Next.js App Router pages
├── components/     # Reusable React components
├── lib/
│   └── supabase/   # Supabase client (client.ts for browser, server.ts for SSR)
└── types/          # TypeScript types (database.ts)
supabase/
└── schema.sql      # Database schema — run in Supabase SQL Editor
```

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Code Style
- Use TypeScript strict mode — no `any` types
- Use functional components with hooks
- Use `@/` path alias for imports (e.g. `import { Navbar } from "@/components/navbar"`)
- File naming: lowercase with hyphens (e.g. `concert-card.tsx`)
- Component naming: PascalCase (e.g. `ConcertCard`)
- Use Supabase server client in Server Components, browser client in Client Components
- Keep components small — extract into separate files when > 100 lines

## Database
- Schema is in `supabase/schema.sql`
- Core tables: profiles, artists, venues, concerts, concert_logs, concert_media, follows
- Row Level Security (RLS) is enabled on all tables
- Use Supabase's generated types when available

## Key Conventions
- All pages are Server Components by default, add "use client" only when needed
- Ratings are 1-5 integers (performance, vibe, venue, sound)
- Artist and venue URLs use slugs (e.g. `/artists/radiohead`)
- Images are stored in Supabase Storage buckets
- Never commit .env.local — use .env.local.example as template

## Design
- Dark theme (black/dark gray background, orange accent #f97316)
- Clean, minimal UI inspired by Letterboxd
- Mobile-first responsive design
