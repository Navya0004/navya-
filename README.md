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

### Quick start
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The app will run on `http://localhost:3000` by default (Vite). It will read/write the Supabase `app_state` rows.

### Step-by-step local setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/Navya0004/navya-.git
   cd kinetic-ledger
   npm install
   ```

2. **Set up Supabase project:**
   - Go to https://supabase.com and create a new project
   - Note the project URL and publishable (anon) key

3. **Create `.env.local` in project root:**
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
   ```
   Do NOT commit this file (already in `.gitignore`).

4. **Create Supabase tables (SQL migration):**
   Open Supabase SQL Editor and run:
   ```sql
   create table if not exists app_state (
     key text primary key,
     value jsonb not null,
     created_at timestamp default now(),
     updated_at timestamp default now()
   );
   ```

5. **Seed initial data (optional but recommended):**
   Run the app and click **"Reset Database"** in the Settings tab, or manually insert:
   ```sql
   insert into app_state (key, value) values
   ('products', '[]'::jsonb),
   ('reservations', '[]'::jsonb),
   ('logs', '[]'::jsonb),
   ('timeLeft', '899'::jsonb),
   ('systemStatus', '"Operational"'::jsonb),
   ('lowStockThreshold', '15'::jsonb);
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` — the app will load and persist to Supabase.

### Environment variables explained

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | Yes | Supabase project endpoint |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public anon key for browser (safe to expose) |

Never use `VITE_SUPABASE_SERVICE_ROLE_KEY` in client code — it is server-side only.

### Seed data details

The app comes with seed data in `src/data.ts`:
- **Products**: 8 tech products with images, pricing, stock info, and warehouse distribution.
- **Default Reservations**: 2 sample reservations (Alpha-9 Microprocessor × 2500, Thermal Casting Shell × 480).

To reset to seed data at any time:
1. Go to **Settings** tab in the app.
2. Click **"Reset Database"** — stock and reservations return to initial state.
3. Click **"Load Demo Reservations"** — re-populate template reservations.

## Expiry Mechanism in Production

### How it works (browser-based client-side timer)

1. **Timer starts** when the first reservation is made.
2. **Countdown runs** in the browser every 1 second (via `setInterval`).
3. **On expiry** (`timeLeft === 0`):
   - All reserved stock is released back to `totalStock`.
   - A `STOCK_RELEASED` log entry is created.
   - Reservations array is cleared.
   - Timer resets to 14:59.
   - An overlay notifies the user.

### Production implications

⚠️ **Current limitation**: The timer runs only in the browser. If you close the browser tab, the timer pauses. When you return, it continues from where it left off (stored in `app_state`). This is acceptable for a demo but not suitable for critical inventory holds.

### More robust approach (future improvement)

For production, use **server-side expiry** with Supabase:
1. Store `reservation_created_at` timestamp in each reservation row.
2. Use a **Postgres trigger** or **Supabase Edge Function** to check expiry server-side.
3. On the client, poll or subscribe to changes and sync the UI.

Example Supabase Edge Function (pseudo-code):
```typescript
// Called periodically or via cron
const expiredRes = await supabase
  .from('reservations')
  .select('*')
  .lt('created_at', now - 15 minutes);

// Release stock and delete expired reservations
await supabase.from('reservations').delete().in('id', expiredRes.map(r => r.id));
```

---

## Design Tradeoffs & Future Improvements

### Tradeoffs made (MVP focus)

| Aspect | Current | Reason |
|--------|---------|--------|
| **Expiry** | Browser timer | Fast to implement; works for demo. Breaks if browser closes. |
| **Auth** | None | Supabase `anon` key allows public reads/writes. OK for demo; unsafe for production. |
| **Persistence** | JSON in Supabase | Simple and flexible; not optimized for relational queries. |
| **Conflict handling** | Simulated error modal | Real-time optimistic locking would require more infrastructure. |
| **Payment** | Mocked tx-hash | No actual payment gateway integration. |
| **Logging** | In-memory then persisted JSON | No structured query/analytics. |

### If I had more time, I would add

1. **Authentication (Supabase Auth)**
   - Google/GitHub OAuth
   - Role-based access (admin vs. customer)
   - User-specific reservations and purchase history

2. **Server-side expiry** (as noted above)
   - Postgres trigger or Edge Function
   - Real-time WebSocket subscription to sync expiry events

3. **Proper database schema**
   - Separate `products`, `reservations`, `ledger_logs`, `users` tables
   - Foreign keys and indexes for faster queries
   - Soft deletes for audit trails

4. **Real payment integration**
   - Stripe or another payment processor
   - Webhook handling for payment confirmation
   - Refund/cancellation flows

5. **Optimistic concurrency control**
   - Version numbers or timestamps on products
   - Detect conflicts when two users reserve the same last unit
   - Atomic stock deduction

6. **Monitoring & observability**
   - Structured logging (e.g., via Supabase's `pgAdmin` or external logger)
   - Error tracking (e.g., Sentry)
   - Performance metrics

7. **Testing**
   - Unit tests for state transitions and handlers
   - Integration tests for Supabase reads/writes
   - E2E tests for the full reservation → confirmation flow

8. **Admin dashboard**
   - View/edit products and stock
   - View all reservations and transactions
   - Refund/override capabilities

9. **Offline support**
   - Service Worker caching
   - Sync queue for offline mutations
   - Conflict resolution on reconnect

---

## Push this project to GitHub (commands you should run locally)
To push from your machine, run:

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
- For production, enable Row Level Security (RLS) on `app_state` table to restrict who can read/write.

---

**Questions or feedback?** Open an issue or fork the repo to contribute!
