# Jobmatcher — full guide (simple English)

One **Next.js** app holds both the website and the API. No separate Express server.

**For group members learning how everything was built**, read **[GROUP_GUIDE.md](./GROUP_GUIDE.md)** (step-by-step, presentation-friendly).

---

## What is this project?

**Jobmatcher** helps job seekers:

1. Find jobs that match their CV with AI (when you add Gemini).
2. Track applications in one dashboard.

| Part | Where it lives | What it does |
|------|----------------|--------------|
| **Pages (frontend)** | `app/page.tsx`, future dashboard pages | What users see |
| **API (backend)** | `app/api/**/route.ts` | Talks to Supabase and Gemini on the server |
| **Database** | Supabase in the cloud | Saves job applications |

---

## How it works (one box)

```
  YOU (browser)
       |
       v
  NEXT.JS (my-app)
    - app/page.tsx        → home page
    - app/api/items       → list/save jobs (Supabase)
    - app/api/gemini      → AI (optional)
    - app/api/health      → “is it running?”
    - app/login           → email + Google sign-in
    - app/register        → full name, email, password
       |
       v
  SUPABASE Auth + Database (+ GEMINI when configured)
```

- **One** command: `npm run dev`
- **One** address locally: http://localhost:3000
- **API** on the same site: http://localhost:3000/api/health

**Vercel:** deploy **one** project. Preset **Next.js**. Root folder **`my-app`**.

---

## Folder structure

```
my-app/
  app/
    page.tsx              ← home page
    layout.tsx            ← navbar, footer, SEO metadata
    globals.css
    login/page.tsx        ← log in page
    register/page.tsx     ← sign up page
    auth/callback/        ← Google returns here
    api/
      auth/register       ← POST email sign-up
      auth/login          ← POST email log-in
      auth/logout         ← POST sign out
      health/route.ts     ← GET  /api/health
      items/route.ts      ← GET, POST /api/items
      gemini/route.ts     ← POST /api/gemini
  components/
    Navbar.tsx, LoginForm, RegisterForm, GoogleSignInButton
  lib/
    supabase/             ← auth sessions + database
  .env.local.example      ← copy to .env.local
  package.json
  README.md               ← you are here
```

---

## Step 1 — Install and run (local)

Open PowerShell:

```powershell
cd "path\to\Jobmatcher\my-app"
npm install
copy .env.local.example .env.local
npm run dev
```

- Website: http://localhost:3000  
- Health check: http://localhost:3000/api/health  

You only need **one** terminal.

---

## Step 2 — Secrets (`.env.local`)

Edit `.env.local` (never commit it):

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GEMINI_API_KEY=...          # optional
```

Use the **same** URL and anon key for the four Supabase lines. The `NEXT_PUBLIC_` ones are needed for login pages and Google in the browser (anon key is designed to be public).

Never put `GEMINI_API_KEY` in `NEXT_PUBLIC_`.

Restart `npm run dev` after changes.

---

## Step 2b — User login (Supabase Auth)

### Email register (browser)

1. Open http://localhost:3000/register  
2. Fill **full name**, **email**, **password**, **confirm password**  
3. Or click **Sign up with Google**

### Email register (Postman)

`POST http://localhost:3000/api/auth/register`

```json
{
  "fullName": "Alex Student",
  "email": "alex@example.com",
  "password": "mysecret12",
  "confirmPassword": "mysecret12"
}
```

### Email login (Postman)

`POST http://localhost:3000/api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "mysecret12"
}
```

### Google one-click

In **Supabase Dashboard**:

1. **Authentication → Providers → Google** → enable  
2. Add **Google Cloud OAuth client ID and secret** (from Google Cloud Console)  
3. **Authentication → URL Configuration** → add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-VERCEL-APP.vercel.app/auth/callback`

Then use **Log in with Google** on `/login` or `/register`.

---

## Step 3 — Supabase table

In Supabase → SQL Editor, run once:

```sql
create table job_applications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  status text not null default 'applied',
  created_at timestamptz default now()
);
```

Test with Postman:

- **GET** http://localhost:3000/api/items  
- **POST** http://localhost:3000/api/items  
  Body (JSON): `{ "title": "Developer", "company": "Example AB", "status": "applied" }`

---

## Step 4 — Build features (team checklist)

### Phase A — Done

- [x] One Next.js app (UI + API)
- [x] `/api/health`, `/api/items`, `/api/gemini`
- [x] Supabase helper in `lib/supabase.ts`

### Phase B — Next

- [ ] Dashboard page that `fetch("/api/items")` and shows a list
- [ ] Form that POSTs a new application
- [ ] Status updates (applied → interview → offer)

### Phase C — Later

- [ ] Supabase Auth (login)
- [ ] Row Level Security so each user sees only their rows
- [ ] CV paste → Gemini match on `/api/gemini`

---

## API cheat sheet

| What | Method | Path |
|------|--------|------|
| Health | GET | /api/health |
| Register | POST | /api/auth/register |
| Login | POST | /api/auth/login |
| Logout | POST | /api/auth/logout |
| List jobs | GET | /api/items |
| Add job | POST | /api/items |
| AI text | POST | /api/gemini |

Live: use your Vercel URL, e.g. `https://your-app.vercel.app/api/health`

---

## Deploy on Vercel

1. Push code to GitHub (one repo is fine).
2. Vercel → New Project → import repo.
3. **Root Directory:** `my-app`
4. **Framework:** Next.js (automatic)
5. **Environment variables** (same names as `.env.local`):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (optional)
6. Deploy.

Postman works against `https://your-app.vercel.app/api/...`

---

## Common problems

| Problem | Fix |
|---------|-----|
| 503 Supabase not configured | Fill `.env.local` and restart dev server |
| 503 Gemini not configured | Add `GEMINI_API_KEY` or ignore until you need AI |
| Empty items list | Table empty or RLS blocking — check Supabase |
| Still opening port 4000 | Old setup — API is now on port **3000** under `/api` |

---

## Team

Lotfar Kaes, Gustav Jeppsson, Andreas Rimheden, Anastasiya Lakhmakova, Marina Silakova.

---

## Summary

- **One Next.js project** = pages + API.  
- **No `frontend/` / `backend/` split** anymore.  
- **Vercel:** one Next.js deploy, root `my-app`.