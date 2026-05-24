# Kinetic Ledger

Kinetic Ledger is a single-page React app that demonstrates a lightweight inventory/reservation flow with a simulated ledger-style confirmation and logging. The app was converted to persist state in Supabase (PostgreSQL JSON rows) so it can run from a remote backend and be deployed to a static host (Vercel, Netlify, etc.).

## Features
- View products with images, categories, and stock distribution.
- Create reservations (temporary holds) on products.
- Countdown timer for reservations (defaults to 14:59) — when the timer expires, holds are released and logs are appended.
- Confirm reservations (simulated payment) which permanently deducts stock and generates a receipt with a mock transaction hash.
- System logs for important events (reservation created/confirmed/canceled, stock released, conflict errors).
- Settings view to reset/demo data and manage logs.

## Project structure (important files)
- `src/App.tsx` — main app, state management and UI orchestration.
- `src/lib/supabase.ts` — Supabase client wrapper (reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
- `src/data.ts` — initial product and reservation seed data.
- `src/types.ts` — TypeScript types used across the app.
- `src/components/*` — UI components (`Header`, `Footer`, `ProductsView`, `ReservationsView`, `SettingsView`, etc.).

## Required environment variables
Create a `.env.local` (ignored by git) with the Vite-prefixed variables below:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
```

The values you already used in development (project URL and publishable key) are fine for client-side access. Do NOT use the service role key in browser code.

## Supabase schema (simple)
Open the Supabase SQL editor and run:

```sql
create table app_state (
  key text primary key,
  value jsonb not null
);

-- Optional: seed initial rows
insert into app_state (key, value) values
('products', '[]'::jsonb),
('reservations', '[]'::jsonb),
('logs', '[]'::jsonb),
('timeLeft', '899'::jsonb);
```

The app stores JSON blobs under keys `products`, `reservations`, `logs`, and `timeLeft`.

## Local development
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The app will run on `http://localhost:3000` by default (Vite). It will read/write the Supabase `app_state` rows.

## Push this project to GitHub (commands you should run locally)
I attempted to push from this environment but `git` is not available here. To push from your machine, run:

```bash
cd /path/to/kinetic-ledger
git init
git add .
git commit -m "Initial commit: Kinetic Ledger with Supabase integration"
git branch -M main
git remote add origin https://github.com/Navya0004/navya-.git
git push -u origin main
```

If you prefer using the GitHub CLI to create the repo and push in one step:

```bash
gh repo create Navya0004/navya- --public --source=. --remote=origin --push
```

If you encounter authentication errors when pushing, ensure your Git credentials or SSH keys are configured in your environment.

## Deploy to Vercel (recommended)
1. Push to GitHub (see above).
2. On https://vercel.com, click "Import Project" and select the GitHub repository.
3. Ensure the build command is `npm run build` and the output directory is `dist` (Vite defaults).
4. In Vercel project settings -> Environment Variables, add:

   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your publishable anon key

5. Deploy — Vercel will build and publish a public URL.

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

## Post-deploy verification
- Visit the Vercel URL and confirm the product list loads and reservations persist across reloads (Supabase `app_state` should update).
- Use Supabase SQL editor to inspect `app_state` table content.

## Security notes
- Keep `.env.local` out of version control (already in `.gitignore`).
- Never put the Supabase `service_role` key in client code — it's for server-side only.


