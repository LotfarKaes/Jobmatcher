# Jobmatcher — group guide (how we built it)

Hi team. This document is for **Lotfar, Gustav, Andreas, Marina**, and anyone new on the project.

It explains **what we have today**, **how it works**, and **how we can keep building**. The words are simple on purpose — you do not need to be a senior developer to follow along.

For quick commands only, see **README.md**. This file is the **learning story**.

---

## 1. What is Jobmatcher?

Jobmatcher is a website that will help people who look for jobs:

- Keep track of job applications in one place (dashboard).
- Later: use AI to find jobs that match a CV (resume).

Right now we have:

- A **public home page** (who we are, what the project is).
- **Sign up and log in** (email + password, or Google).
- A **private dashboard** after login.
- **API endpoints** for health checks, job list (database), and AI (ready but optional).
- Connection to **Supabase** (online database + user accounts).
- A **modern marketing home page** (dark blue, white and yellow text, animations) — see section 2.

---

## 2. Today's work — modern home page (step by step)

**Date:** 24 November 2026  
**Goal:** Build a beautiful public home page that matches a job-matcher style UX (like Google Stitch job-search designs): resume upload, match scores, and a tracker board — using our existing **Next.js + Tailwind** app.

Anyone on the team can follow these steps to understand what changed and how to run it.

### Step 1 — What we wanted

1. Keep **one app** in `my-app/` (no new folder).
2. Split the home page into **small React components** (easier to edit in a group).
3. Use **dark blue** background, **white** text for reading, **yellow** for highlights (scores, buttons, badges).
4. Add **motion** (gentle animations when you scroll or load the page).
5. Keep the real **team names** and **project story** from section 1.

We used a **Stitch preview link** as design inspiration. The preview often loads only inside Google’s iframe, so we built a standard job-matcher layout: hero → upload CV → job cards with **% fit** → features → steps → team → call-to-action.

### Step 2 — Install one new package (motion)

In PowerShell, from the project folder:

```powershell
cd my-app
npm install framer-motion
```

**Framer Motion** is a library for React that moves elements smoothly (fade in, float, stagger cards). The home page components mark `"use client"` because animations run in the browser.

### Step 3 — Colors and global style

| File | What we did |
|------|-------------|
| `tailwind.config.ts` | Added `midnight` (dark blues), `accent` (yellow), `brand` (blue buttons) |
| `app/globals.css` | Dark mesh background + `.glass-panel` (frosted cards) |
| `app/layout.tsx` | **Plus Jakarta Sans** font, dark footer |

The whole site now shares the same dark theme so the **navbar** and **login/register** cards look consistent.

### Step 4 — Home page = one file that imports sections

**File:** `app/page.tsx`

It only **lists sections in order** (no long HTML in one place):

1. `HeroSection` — headline, buttons, stats  
2. `JobMatchesSection` — demo job cards with yellow fit %  
3. `FeaturesSection` — three feature cards  
4. `HowItWorksSection` — upload → match → track  
5. `TeamSection` — your five names  
6. `CtaSection` — yellow “Create account” banner  
7. `DevApiNote` — small hint for `/api/health`, etc.

### Step 5 — Where the components live

```
my-app/
  components/home/
    HeroSection.tsx         → Top of page + links to /register and /login
    ResumeUploadCard.tsx    → “Upload resume” + search (demo UI for later AI)
    DashboardPreview.tsx    → Animated kanban: Applied / Interview / Offer
    JobMatchesSection.tsx   → Three sample jobs with match scores
    FeaturesSection.tsx     → AI matching, tracker, skills gap
    HowItWorksSection.tsx   → Steps 01–03
    TeamSection.tsx         → Team cards with initials
    CtaSection.tsx          → Final signup prompt
    DevApiNote.tsx          → API paths for developers
    HomePageLoader.tsx      → “Drop CV” + match % animation (loading screen)
    HomePageShell.tsx       → Shows loader, then fades in the home page
    FadeIn.tsx + motion.ts  → Shared animation helpers

  lib/home/
    content.ts              → Team names, features, jobs (edit text HERE)
```

**Tip for the team:** Change wording or demo jobs in **`lib/home/content.ts`** first — you usually do not need to touch animation files.

### Step 6 — Navbar and auth menu

| File | Change |
|------|--------|
| `components/Navbar.tsx` | Dark bar, links: Home, Matches, Features, Team |
| `components/NavAuth.tsx` | Yellow **Register** button, white **Log in** link |

Login still uses Supabase the same way as before (sections 7–8 below); only the **look** changed.

### Step 7 — Login and register (visual only)

| File | Change |
|------|--------|
| `LoginForm.tsx`, `RegisterForm.tsx` | Glass card, dark inputs, yellow submit button |
| `GoogleSignInButton.tsx` | Dark outline style |

**No change** to API routes or Supabase logic.

### Step 8 — Home page loader (why it exists)

**Problem:** On first visit, the home page is mostly **client-side** (Framer Motion). For a moment you could see only the **dark blue background** with no text — confusing for users.

**Fix (two small files):**

1. **`HomePageLoader.tsx`** — Full-screen animation: **“Drop CV”**, a CV card falls into a zone, the **match %** counts up (about 62 → 95), and a progress bar fills. Uses the same dark / yellow style as the site.
2. **`HomePageShell.tsx`** — Wraps the home page in **`app/page.tsx`**. On load it shows the loader for ~1.6 seconds (shorter if the user prefers reduced motion), then **fades in** the real sections.

**Important:**

- The loader runs **only on `/`** (home). Login and register are **not** affected.
- To change how long it shows, edit **`LOAD_MS`** in `HomePageShell.tsx`.
- This is **visual only** — it does not upload a CV or call the AI; it just explains what Jobmatcher does while the page gets ready.

### Step 9 — Run and check on your laptop

```powershell
cd my-app
npm run dev
```

Open **http://localhost:3000** and scroll the home page:

- Yellow accents on scores and main buttons  
- Resume upload box and floating board preview  
- Team section with your names  

To confirm the app still builds for deploy:

```powershell
npm run build
```

### Step 10 — What is demo vs real (important)

| On the home page | Real or demo? |
|------------------|---------------|
| Job cards and % match | **Demo** — static data in `content.ts` |
| Resume drag-and-drop | **Demo** — links to `/register`; no file upload yet |
| Log in / Register / Dashboard | **Real** — Supabase auth (already built) |
| `/api/items`, `/api/gemini` | **Real APIs** — connect to dashboard in a later sprint |

Next team task can be: save real jobs from `/api/items` on the dashboard and wire CV upload to Gemini.

### Step 11 — Who edits what (quick split)

| Task | Suggested owner |
|------|-----------------|
| Text, team list, demo jobs | Edit `lib/home/content.ts` |
| Layout / new section | New file in `components/home/`, import in `page.tsx` |
| Loader timing / text | `HomePageShell.tsx`, `HomePageLoader.tsx` |
| Colors | `tailwind.config.ts` + `globals.css` |
| Auth bugs | `lib/supabase/` + auth API routes (unchanged by home page) |

---

## 2b. Job fetcher backend (CARD-03, Gustav)

**Date:** 24 November 2026 (branch `gustav`)  
**Goal:** Let users find real jobs and save them, so match score, cover letter and the tracker have real job ads to work with.

This is **backend only**: three API routes plus one Supabase table. Lotfar builds the job search UI and calls these routes. Full details and copy-paste examples are in **`lib/jobs/README.md`**.

### Where jobs come from

| Source | How it works |
|--------|--------------|
| **JobTech JobSearch API** (Arbetsförmedlingen) | Free and official, no API key needed. We search it and fetch single ads by id. |
| **Platsbanken link** | User pastes `arbetsformedlingen.se/platsbanken/annonser/<id>`; we read the id and fetch that ad from JobTech. |
| **Paste text** | User pastes a job ad by hand (title, company, description). Works for any site. |

We do **not** scrape LinkedIn, Indeed or Glassdoor. They need login and forbid scraping, and it breaks easily. If a user pastes such a link, the API answers with `LOGIN_REQUIRED` so the UI can say "paste the text instead".

### The three routes

| Method | Path | What it does | Login? |
|--------|------|--------------|--------|
| GET | `/api/jobs/search?q=react` | Searches JobTech. Also `municipality`, `remote`, `offset`, `limit`. Nothing is saved. | No |
| POST | `/api/jobs/import` | Body `{ "url": "..." }`. Returns a preview of one job. Nothing is saved. | No |
| POST | `/api/jobs` | Saves a job: `{ "source": "jobtech", "externalId": "123" }` or `{ "source": "manual", "title", "description", ... }` | **Yes** |

Every job comes back in the **same shape** (`NormalizedJob` in `lib/jobs/types.ts`): title, company, location, remote, description (plain text, HTML removed), skills, salary, links, dates. The UI never has to care where a job came from.

Errors use the same `{ error: "message" }` shape as the rest of the app, plus a `code` such as `INVALID_INPUT`, `UNAUTHORIZED`, `NOT_FOUND` or `UPSTREAM_ERROR`. The `error` text is written so it can be shown to users.

### Files

```
my-app/
  app/api/jobs/
    search/route.ts      → GET /api/jobs/search
    import/route.ts      → POST /api/jobs/import
    route.ts             → POST /api/jobs (save)
  lib/jobs/
    types.ts             → NormalizedJob + input checks (zod)
    jobtech.ts           → JobTech client (search, get one ad)
    url.ts               → Recognises Platsbanken / LinkedIn / other links
    clean.ts             → Turns ad HTML into plain text
    save.ts              → Body check + row mapping for saving
    http.ts              → Shared error responses
    *.test.ts            → Tests (Vitest)
    jobtech.http         → Manual requests for the VS Code / Rider HTTP client
    README.md            → Examples (fetch, curl, PowerShell)
  supabase/jobs.sql      → Creates the jobs table
```

### The `jobs` table

`supabase/jobs.sql` creates a `jobs` table with **Row Level Security**:

- Any logged-in user can read **JobTech** jobs (they are public ads anyway).
- A **manually pasted** job is visible only to the user who saved it.
- Users can only insert rows as themselves.
- The same JobTech ad is stored only once (`unique (source, external_id)`); saving it again returns the existing row.

**To do:** someone with access must run `supabase/jobs.sql` once in the Supabase **SQL Editor** (see section 10). Until then, `POST /api/jobs` returns `DB_ERROR`.

### Tests

```powershell
cd my-app
npm test            # 43 tests, no network needed (uses saved JobTech responses)
npm run typecheck   # TypeScript check without building
```

### What the UI should do (for Lotfar)

1. Search box → `GET /api/jobs/search` → show `items` as cards.
2. "Paste link" → `POST /api/jobs/import` → show the preview.
3. "Paste text" → a small form → `POST /api/jobs` with `source: "manual"`.
4. "Save" on a card → `POST /api/jobs` with `source: "jobtech"` and the job's `externalId`.

---

## 3. One app, not two servers

We used to think about a separate “frontend folder” and “backend folder.”  
Now everything lives in **one Next.js app** inside **`my-app/`**.

Think of it like **one building**:

| Floor | What it is | Folder in code |
|-------|------------|----------------|
| **Lobby** | Pages people see | `app/page.tsx`, `app/login`, `app/register`, `app/dashboard` |
| **Kitchen** | APIs and server work | `app/api/.../route.ts` |
| **Storage room** | Talk to Supabase / settings | `lib/supabase/` |
| **Front desk sign** | Top menu | `components/Navbar.tsx`, `components/NavAuth.tsx` |

You run **one command**: `npm run dev` → open **http://localhost:3000**.

---

## 4. How a request travels (the big picture)

When someone opens the site in Chrome or Edge:

```
Person
  → Browser (what they click and type)
  → Next.js on localhost:3000 (our code)
       → Shows a PAGE (React), or
       → Runs an API ROUTE (server code)
  → Supabase in the cloud (users + data)
  → (Optional) Google Gemini for AI
```

**Pages** = HTML you see (home, login, dashboard).  
**API routes** = JSON data for tools like Postman, or for future dashboard lists.

Secrets (database keys, AI keys) stay on the **server**. We never put private keys in the browser.

---

## 5. Folder map (what each part does)

```
my-app/
  app/
    page.tsx                 → Home page (/)
    layout.tsx               → Wraps every page: navbar, footer, Google title (SEO)
    globals.css              → Site-wide colors (Tailwind)
    login/page.tsx           → Login screen
    register/page.tsx        → Sign-up screen
    dashboard/page.tsx       → After login: “Welcome to Jobmatcher dashboard”
    auth/callback/route.ts   → Google returns here after sign-in
    api/
      health/route.ts        → GET /api/health  — “is the server alive?”
      items/route.ts         → GET/POST /api/items — job applications table
      gemini/route.ts        → POST /api/gemini — AI text (needs key)
      jobs/                  → Job fetcher (search, import, save) — see section 2b
      auth/
        register/route.ts    → POST sign up with email
        login/route.ts       → POST sign in with email
        logout/route.ts      → POST sign out

  components/
    home/                    → Home page sections (Hero, Matches, Team, …) — see section 2
    Navbar.tsx               → Logo, Home link, auth area
    NavAuth.tsx              → Shows Log in/Register OR name + Dashboard + Log out
    LoginForm.tsx            → Email login form + Google button
    RegisterForm.tsx         → Full name, email, password, confirm + Google
    GoogleSignInButton.tsx   → “Continue with Google”

  lib/home/
    content.ts               → Team names, demo jobs, feature text (easy to edit)

  lib/jobs/                  → JobTech client, job shape, tests — see section 2b

  supabase/
    jobs.sql                 → Creates the jobs table (run once in Supabase)

  lib/supabase/
    env.ts                   → Reads SUPABASE_URL and keys from .env.local
    server.ts                → Supabase on the server (API routes, dashboard check)
    client.ts                → Supabase in the browser (menu, Google click)
    middleware.ts              → Keeps login session fresh between page clicks

  middleware.ts              → Runs on almost every request; refreshes auth cookies

  .env.local                 → Your secrets (NOT in Git)
  .env.local.example         → Copy this to start
  package.json               → Project name and npm commands
```

---

## 6. Pages your teammates can open

| URL | Who can see it | What happens |
|-----|----------------|--------------|
| `/` | Everyone | Modern home page (hero, matches, features, team) |
| `/login` | Everyone | Log in form |
| `/register` | Everyone | Create account form |
| `/dashboard` | **Only logged-in users** | Welcome message; others sent to `/login` |

### Dashboard protection

`app/dashboard/page.tsx` asks Supabase: “Is there a logged-in user?”

- **Yes** → show “Welcome to Jobmatcher dashboard”.
- **No** → redirect to `/login`.

That is a basic **protected page** pattern we will reuse for real job data later.

---

## 7. How sign-up and log-in work

We use **Supabase Auth**. Supabase stores users (email, password hash, Google id). Our app talks to Supabase through code in `lib/supabase/`.

### 7a. Email registration (manual)

1. User fills **full name**, **email**, **password**, **confirm password** on `/register`.
2. `RegisterForm.tsx` sends JSON to **`POST /api/auth/register`**.
3. `register/route.ts` checks:
   - Name at least 2 characters
   - Email looks valid
   - Password at least 8 characters
   - Password === confirm password
4. If OK, Supabase `signUp` runs. Full name is saved in `user_metadata.full_name`.
5. User is redirected to **`/dashboard`** (if a session was created).

**Why an API route?** Password is checked on the server. We do not put secret logic only in the browser.

### 7b. Email log-in

1. User enters email + password on `/login`.
2. `LoginForm.tsx` → **`POST /api/auth/login`**.
3. Server calls `signInWithPassword`.
4. Supabase sets **cookies** (small files) so the browser “remembers” the user.
5. Redirect to **`/dashboard`**.

### 7c. Google (one click)

1. User clicks **Log in with Google** on login or register.
2. `GoogleSignInButton.tsx` opens Google’s page (OAuth).
3. After approval, browser goes to **`/auth/callback`** with a `code`.
4. `auth/callback/route.ts` trades that code for a session.
5. User lands on **`/dashboard`**.

**You must configure Google** in Supabase dashboard (see section 10).

### 7d. Log out

1. User clicks **Log out** in the navbar.
2. App calls **`POST /api/auth/logout`** and browser `signOut`.
3. Menu switches back to **Log in / Register** without refreshing the whole page (see NavAuth below).

---

## 8. Why the menu updates without refresh

Early version: menu was built on the **server** once per page load. After log out, it still showed your name until F5.

**Fix:** `NavAuth.tsx` is a **client component**. It:

- Reads the user from Supabase in the browser.
- Listens to `onAuthStateChange` (login/logout events).
- Listens to a custom event `jobmatcher:auth-changed` after our forms succeed.

So the navbar updates **right away**.

When logged in, menu shows: **Dashboard · Your name · Log out**.  
When logged out: **Log in · Register**.

---

## 9. API routes (for Postman and future dashboard)

All APIs start with **http://localhost:3000** when you run `npm run dev`.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Simple check — no database needed |
| POST | `/api/auth/register` | Body: fullName, email, password, confirmPassword |
| POST | `/api/auth/login` | Body: email, password |
| POST | `/api/auth/logout` | Ends session |
| GET | `/api/items` | List rows from `job_applications` in Supabase |
| POST | `/api/items` | Body: title, company, status |
| POST | `/api/gemini` | Body: prompt (needs GEMINI_API_KEY) |
| GET | `/api/jobs/search` | Query: q, municipality, remote, offset, limit (see section 2b) |
| POST | `/api/jobs/import` | Body: url (Platsbanken link) → job preview |
| POST | `/api/jobs` | Save a job (needs login) |

### Health

Always try this first. If it works, Next.js is running.

### Items (job applications)

Uses `lib/supabase.ts` (older helper) + table **`job_applications`**.  
If `.env.local` has no Supabase keys → **503** “not configured”.  
If table is missing → **500** with error message.

We will connect this to the dashboard UI in a next sprint.

### Gemini

Sends your text prompt to Google’s model. Only works when `GEMINI_API_KEY` is set server-side.

---

## 10. What you must set up in Supabase

1. Create a project at **supabase.com**.
2. **Project Settings → API** → copy URL and **anon public** key into `.env.local`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

3. **SQL Editor** — create table (for `/api/items`):

```sql
create table job_applications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  status text not null default 'applied',
  created_at timestamptz default now()
);
```

   And for the job fetcher: paste and run **`supabase/jobs.sql`** (creates `jobs` + RLS rules, see section 2b).

4. **Authentication → Providers**
   - **Email** on (for manual register).
   - **Google** on + Client ID/Secret from Google Cloud Console.
5. **Authentication → URL Configuration** — redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-APP.vercel.app/auth/callback` (when deployed)

6. **Users** tab — you will see everyone who registered.

After editing `.env.local`, always **restart** `npm run dev`.

---

## 11. Environment file (`.env.local`)

| Variable | Used for |
|----------|----------|
| `SUPABASE_URL` | Database + auth |
| `SUPABASE_ANON_KEY` | Safe public key with Supabase rules (RLS) |
| `GEMINI_API_KEY` | Optional AI |
| `JOBTECH_API_KEY` | Optional. JobTech works without a key today |

`next.config.ts` copies Supabase values so the browser can log in without duplicating `NEXT_PUBLIC_*` lines.

**Never commit `.env.local` to Git.** `.gitignore` blocks it.

---

## 12. Tech words we use (short glossary)

| Word | Plain meaning |
|------|----------------|
| **Next.js** | Framework that builds our website + APIs together |
| **React** | Library to build buttons, forms, pages as components |
| **TypeScript** | JavaScript with types — fewer silly bugs |
| **Tailwind** | CSS classes like `text-lg` for styling |
| **Framer Motion** | Small animations on the home page (fade in, float) |
| **Supabase** | Cloud service: login + database |
| **API route** | A URL that returns JSON, not a full HTML page |
| **Middleware** | Code that runs before each page; keeps login cookies fresh |
| **OAuth** | “Log in with Google” — Google checks password, we get a yes/no token |
| **Session** | Proof you are logged in (stored in cookies) |
| **Vercel** | Website host for Next.js (production) |
| **JobTech** | Arbetsförmedlingen's free job ad API (the same ads as Platsbanken) |
| **zod** | Checks that incoming JSON / query strings have the right shape |
| **Vitest** | Test runner (`npm test`) |
| **RLS** | Row Level Security — Supabase rules for who can read or write each row |

---

## 13. How to run the project (every teammate)

```powershell
cd my-app
npm install
copy .env.local.example .env.local
# fill in Supabase keys
npm run dev
```

- Home: http://localhost:3000  
- Register: http://localhost:3000/register  
- After login: http://localhost:3000/dashboard  

---

## 14. Deploy on Vercel (summary)

1. Push code to GitHub.
2. Vercel → New project → root folder **`my-app`**, preset **Next.js**.
3. Add same env vars as `.env.local` in Vercel settings.
4. Add production callback URL in Supabase (see section 10).

---

## 15. What we implemented vs what is next

### Done ✅

- Single Next.js app structure
- Modern home page (dark blue / white / yellow, Framer Motion, `components/home/`) — see **section 2**
- Home page loader (CV drop + match % while content appears) — **section 2, step 8**
- Home page + SEO layout
- Email register (full name, email, password, confirm)
- Email login
- Google sign-in/up
- Protected dashboard with welcome text
- Navbar auth state (login/logout without manual refresh)
- APIs: health, items, gemini, auth
- Job fetcher backend: JobTech search, Platsbanken link import, paste text, save to `jobs` (**section 2b**, branch `gustav`)
- Supabase connection pattern
- README + this group guide

### Next ideas (for the team to pick) 🔜

- Show `job_applications` on dashboard (fetch `/api/items`)
- Form to add a new application on dashboard
- Link each row to a logged-in user (`user_id` + RLS in Supabase)
- CV upload / paste → Gemini match
- Job search UI on top of `/api/jobs/*` (Lotfar)
- Run `supabase/jobs.sql` in our Supabase project
- Status pills: applied → interview → offer

---

## 16. How to explain this in a presentation (2 minutes)

1. “We built **one Next.js app** — pages and APIs together.”
2. “**Supabase** holds users and will hold job applications.”
3. “You can **register with email or Google**, then see a **dashboard**.”
4. “**API routes** let us test with Postman and power the dashboard later.”
5. “**`.env.local`** connects our laptop to **our** Supabase project — that’s how we know which database we use.”

---

## 17. Questions teammates often ask

**Why do I only see Log in after I added Supabase in the browser?**  
The **browser “connected”** feeling is not the same as keys in `.env.local`. The app needs `SUPABASE_URL` and `SUPABASE_ANON_KEY` on your machine.

**Why does Postman work on port 3000, not 4000?**  
We merged the old Express backend into Next.js. All APIs are under the same port as the website.

**Can two teammates share one Supabase project?**  
Yes. Same URL and keys in each person’s `.env.local` (do not share keys in public chat — share via private team channel).

**I get an error right when the site loads about Supabase URL.**  
Empty `.env.local`. Copy keys, restart `npm run dev`.

---

## 18. Who to ask on the team

Use this section in meetings:

- **Architecture / Next.js structure** — document owner  
- **Supabase tables & auth settings** — whoever set up the dashboard  
- **Vercel & Git** — whoever owns deployment  
- **UI pages** — frontend/design  
- **API & Postman** — backend integration  

*(Fill in names as you split tasks.)*

---

## 19. One sentence to remember

**Jobmatcher is a Next.js website where logged-in users will track jobs; Supabase stores users and data; we already ship login, Google, dashboard, and APIs — the dashboard list is the next brick to add.**

Thank you for reading. If something in this guide is wrong or out of date, update **GROUP_GUIDE.md** in the same PR as the code change so the team stays aligned.