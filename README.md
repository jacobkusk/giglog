# GigLog

Your concert diary. Rate it. Share it. Remember it.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.local.example .env.local
```
Fill in your Supabase keys in `.env.local`.

### 3. Set up database
Copy the contents of `supabase/schema.sql` and run it in your Supabase project's SQL Editor.

### 4. Run dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (Auth, Database, Storage)
- Vercel (hosting)
