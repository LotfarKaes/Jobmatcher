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
- A **private dashboard** after login (sidebar + overview cards — section 3).
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

Login still uses Supabase the same way as before (sections 8–9 below); only the **look** changed.

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

## 3. Dashboard UI — command hub (step by step)

**Date:** 25 November 2026  
**Goal:** After login, show a **real dashboard layout** (sidebar menu + stat cards), not only a welcome line. Match the team’s wireframe: suite name on the left, **three metric cards** on the right, same **dark blue / white / yellow** theme as the home page.

Front-end only for now — numbers and menus are **demo data**. Next sprints can load `/api/items` and Supabase.

### Step 1 — What we built

1. **Protected page stays the same** — `app/dashboard/page.tsx` still checks Supabase and redirects guests to `/login`.
2. **New UI shell** — sidebar with 6 menu items; main area shows **overview cards** or a “coming soon” panel.
3. **Reusable pieces** — small components with **props** so anyone can read one file at a time.

### Step 2 — Folder structure

```
my-app/
  lib/dashboard/
    content.ts              → Menu labels, stat numbers, page titles (edit here)

  components/dashboard/
    DashboardApp.tsx          → Client “brain”: which menu is active
    DashboardSidebar.tsx      → Left menu buttons
    DashboardHeader.tsx       → Title row + “Export full audit” (demo)
    DashboardStatsGrid.tsx      → 3 stat cards (Kanban page)
    DashboardKanbanView.tsx     → Stats + KanbanBoard
    kanban/KanbanBoard.tsx      → 5-column pipeline (see step 11)
    DashboardAiMatchView.tsx    → Job match list (AI match page)
    DashboardJobSearchView.tsx  → Search UI (Job search page)
    StatCard.tsx              → One metric card (props: value, badge, trend, …)
    DashboardPlaceholder.tsx  → Other menu items until we build them
    DashboardIcons.tsx        → Small SVG icons for menu + cards

  app/dashboard/
    page.tsx                  → Server: auth check, pass user name to DashboardApp
```

### Step 3 — How the code talks (easy picture)

```
dashboard/page.tsx  (server)
    │
    ├─ createClient() → get logged-in user
    ├─ if no user → redirect /login
    └─ <DashboardApp userLabel="Your name" />

DashboardApp  (client)
    ├─ useState → active menu id ("dashboard", "kanban", …)
    ├─ DashboardSidebar → onSelect changes active id
    ├─ DashboardHeader → title for current section
    └─ job search → search UI | AI match → job strips | kanban → stats + board
        else → DashboardPlaceholder ("next sprint")
```

**Why split server + client?** Login check must run on the **server** (secure). Clicking menu items needs **React state** in the browser → `DashboardApp` is `"use client"`.

### Step 4 — Menu items (demo navigation)

| Menu id | Label | What you see today |
|---------|--------|-------------------|
| `dashboard` | Job search | Search bar (demo) |
| `job-search` | AI match | Saved roles deep match + 4 strips |
| `kanban` | Kanban board | Telemetry header + 3 stat cards + 5-column pipeline |
| `interview` | Interview prep | Placeholder |
| `cv` | My CV | Placeholder |
| `settings` | Settings | Placeholder |

Change labels or add items in **`lib/dashboard/content.ts`** (`DASHBOARD_NAV`).

### Step 5 — Stat cards (overview)

Demo metrics (from wireframe, yellow highlight on match score):

| Card | Demo value |
|------|------------|
| Total jobs saved | 12 (+4 this week) |
| Average match score | **82**/100 (high tier) |
| Interviews booked | 3 (2 upcoming) |

Edit in **`DASHBOARD_STATS`** in `content.ts`. Each card is one **`StatCard`** with props — no copy-paste HTML.

### Step 6 — Theme (same as home)

- Background: `midnight`, cards: `glass-panel`
- Headings: **white**, highlights: **`accent` (yellow)**
- Active menu item: blue glow + yellow icon

No new colors — reuses `tailwind.config.ts` from the home page work.

### Step 7 — What is real vs demo

| Part | Status |
|------|--------|
| Must be logged in to open `/dashboard` | **Real** (Supabase) |
| User name in sidebar | **Real** (from auth metadata or email) |
| Stat numbers, export button, other menus | **Demo UI** |
| Connect to `/api/items` | **Next task** |

### Step 8 — Try it

```powershell
cd my-app
npm run dev
```

1. Register or log in  
2. Open **http://localhost:3000/dashboard**  
3. Click sidebar items — **Kanban board**, **AI match**, and **Job search** have real UI; others are placeholders  

### Step 9 — Who edits what

| Task | File |
|------|------|
| Menu text | `lib/dashboard/content.ts` → `DASHBOARD_NAV` |
| Stat numbers / labels | `lib/dashboard/content.ts` → `DASHBOARD_STATS` |
| Card layout | `StatCard.tsx`, `DashboardStatsGrid.tsx`, `JobMatchList.tsx` |
| New real screen (e.g. Kanban) | Replace placeholder branch in `DashboardApp.tsx` with a new component |

### Step 10 — Four job match rows (below stats, no tabs)

**Layout:** Under the 3 stat cards, **`JobMatchList`** shows **all 4 jobs** on the page (scroll). Each row is one **`JobMatchStrip`** — job details and fit score in **one card** with **no gap** between left (title, salary, tags) and right (94%, vector fit, badge, headline).

| Piece | File |
|-------|------|
| List of 4 rows | `JobMatchList.tsx` |
| Single combined row | `JobMatchStrip.tsx` |
| Demo job data | `DASHBOARD_JOB_MATCHES` in `lib/dashboard/content.ts` |

`JobPostingCard.tsx` and `VectorFitCard.tsx` stay in the repo as split components; the live dashboard uses the **merged** strip.

Still **demo data** until `/api/items` or Gemini returns real roles.

### Step 11 — Kanban pipeline board (5 columns)

**Date:** 25 November 2026  
**Where:** Sidebar → **Kanban board** (below the 3 stat cards).

We copied the team wireframe: **Application pipeline & tracker** with filters and five stages.

#### What you see

| Part | What it does |
|------|----------------|
| Toolbar | Title, **Match velocity**, **+ Add application**, search + Status/Tier/Sort (demo) |
| **Saved** | 3 cards — company, role, match % |
| **Applied** | 4 cards — badges, warnings, “Send ping” |
| **Interview** | 3 cards — **TARGET STAGE** highlight, readiness bar, calendar line |
| **Offer** | Salary line + deadline |
| **Rejected** | Dimmed card + strikethrough title |

#### Files (read in this order)

```
lib/dashboard/kanban-content.ts   → Column names + all demo cards (edit here)
components/dashboard/kanban/
  KanbanBoard.tsx                 → Puts toolbar + columns together
  KanbanToolbar.tsx               → Header + filters (search uses useState)
  KanbanColumn.tsx                → One stage column + card list
  KanbanCard.tsx                  → One job card (props from data)
DashboardKanbanView.tsx           → Stats grid + <KanbanBoard />
```

#### How React fits together

1. **`KANBAN_COLUMNS`** — list of stages (saved → rejected).  
2. **`KANBAN_CARDS`** — object keyed by stage id; each value is an array of cards.  
3. **`KanbanBoard`** maps columns → **`KanbanColumn`** → maps cards → **`KanbanCard`**.  
4. **`KanbanCard`** only reads props — no hard-coded job names inside the component.

#### Add or change a card

Open **`kanban-content.ts`**, find the stage (e.g. `interview`), copy an existing card object, change `id`, `company`, `title`. Refresh the browser.

Optional fields: `progress`, `interviewEvent`, `offerLine`, `featured`, `dimmed`, `strikethrough`.

#### Theme

Same as dashboard: **midnight** background, **yellow (`accent`)** for match % and highlights, **blue (`brand`)** on progress bars — not the green from the Figma export.

#### Real data later

- `POST /api/items` already exists — map rows to `KanbanCardData` and filter by `status` into columns.  
- On drop, call the API to update `status` (next sprint).

### Step 12 — Drag cards between columns

**Library:** `@dnd-kit/core` (small, works well with React).

#### Simple flow (4 steps)

1. **`KanbanBoard`** keeps `board` in `useState` (copy of `KANBAN_CARDS` at start).  
2. **`DndContext`** wraps all columns — handles `onDragStart` / `onDragEnd`.  
3. Each **`KanbanDraggableCard`** uses `useDraggable({ id: card.id })`.  
4. Each **`KanbanColumn`** uses `useDroppable({ id: column.id })` (Saved, Applied, …).

When you drop a card, **`moveKanbanCard`** in `lib/dashboard/kanban-drag.ts` updates the arrays:

- Drop on **empty column** → `over.id` is the stage name (`interview`, etc.).  
- Drop on **another card** → card moves into that column at that position.

#### Files to read

| File | Role |
|------|------|
| `KanbanBoard.tsx` | State + `DndContext` |
| `KanbanDraggableCard.tsx` | Draggable wrapper |
| `KanbanColumn.tsx` | Droppable column |
| `kanban-drag.ts` | Pure functions (easy to unit test) |

Cards are **in browser memory only** until you save to Supabase after `onDragEnd`.

### Step 13 — View / edit / delete popup (per card)

Each kanban card has a **View** button (does not start a drag).

| Action | What happens |
|--------|----------------|
| **View** | Opens modal with **all fields** (same layout as Edit, read-only boxes) |
| **Edit** | Form: stage, company, title, match %, description, footer |
| **Save** | Updates React `board` state in `KanbanBoard.tsx` (moves column if stage changed) |
| **Delete** | Removes card from board after confirm |

**File:** `KanbanCardDetailModal.tsx`  
**State:** `selection` in `KanbanBoard` = `{ cardId, stageId }`.

Hook **Save** and **Delete** to `POST/PATCH/DELETE` API routes when the backend is ready.

---

## 4. One app, not two servers

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

## 5. How a request travels (the big picture)

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

## 6. Folder map (what each part does)

```
my-app/
  app/
    page.tsx                 → Home page (/)
    layout.tsx               → Wraps every page: navbar, footer, Google title (SEO)
    globals.css              → Site-wide colors (Tailwind)
    login/page.tsx           → Login screen
    register/page.tsx        → Sign-up screen
    dashboard/page.tsx       → After login: dashboard UI (sidebar + stat cards) — section 3
    auth/callback/route.ts   → Google returns here after sign-in
    api/
      health/route.ts        → GET /api/health  — “is the server alive?”
      items/route.ts         → GET/POST /api/items — job applications table
      gemini/route.ts        → POST /api/gemini — AI text (needs key)
      auth/
        register/route.ts    → POST sign up with email
        login/route.ts       → POST sign in with email
        logout/route.ts      → POST sign out

  components/
    home/                    → Home page sections (Hero, Matches, Team, …) — see section 2
    dashboard/               → Dashboard sidebar, cards, placeholders — see section 3
    Navbar.tsx               → Logo, Home link, auth area
    NavAuth.tsx              → Shows Log in/Register OR name + Dashboard + Log out
    LoginForm.tsx            → Email login form + Google button
    RegisterForm.tsx         → Full name, email, password, confirm + Google
    GoogleSignInButton.tsx   → “Continue with Google”

  lib/home/
    content.ts               → Team names, demo jobs, feature text (easy to edit)

  lib/dashboard/
    content.ts               → Dashboard menu + demo stat numbers

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

## 7. Pages your teammates can open

| URL | Who can see it | What happens |
|-----|----------------|--------------|
| `/` | Everyone | Modern home page (hero, matches, features, team) |
| `/login` | Everyone | Log in form |
| `/register` | Everyone | Create account form |
| `/dashboard` | **Only logged-in users** | Sidebar + overview stat cards; others sent to `/login` |

### Dashboard protection

`app/dashboard/page.tsx` asks Supabase: “Is there a logged-in user?”

- **Yes** → show **`DashboardApp`** (menu + cards).
- **No** → redirect to `/login`.

That is a basic **protected page** pattern we will reuse for real job data later.

---

## 8. How sign-up and log-in work

We use **Supabase Auth**. Supabase stores users (email, password hash, Google id). Our app talks to Supabase through code in `lib/supabase/`.

### 8a. Email registration (manual)

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

### 8b. Email log-in

1. User enters email + password on `/login`.
2. `LoginForm.tsx` → **`POST /api/auth/login`**.
3. Server calls `signInWithPassword`.
4. Supabase sets **cookies** (small files) so the browser “remembers” the user.
5. Redirect to **`/dashboard`**.

### 8c. Google (one click)

1. User clicks **Log in with Google** on login or register.
2. `GoogleSignInButton.tsx` opens Google’s page (OAuth).
3. After approval, browser goes to **`/auth/callback`** with a `code`.
4. `auth/callback/route.ts` trades that code for a session.
5. User lands on **`/dashboard`**.

**You must configure Google** in Supabase dashboard (see section 11).

### 8d. Log out

1. User clicks **Log out** in the navbar.
2. App calls **`POST /api/auth/logout`** and browser `signOut`.
3. Menu switches back to **Log in / Register** without refreshing the whole page (see NavAuth below).

---

## 9. Why the menu updates without refresh

Early version: menu was built on the **server** once per page load. After log out, it still showed your name until F5.

**Fix:** `NavAuth.tsx` is a **client component**. It:

- Reads the user from Supabase in the browser.
- Listens to `onAuthStateChange` (login/logout events).
- Listens to a custom event `jobmatcher:auth-changed` after our forms succeed.

So the navbar updates **right away**.

When logged in, menu shows: **Dashboard · Your name · Log out**.  
When logged out: **Log in · Register**.

---

## 10. API routes (for Postman and future dashboard)

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

## 11. What you must set up in Supabase

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

4. **Authentication → Providers**
   - **Email** on (for manual register).
   - **Google** on + Client ID/Secret from Google Cloud Console.
5. **Authentication → URL Configuration** — redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-APP.vercel.app/auth/callback` (when deployed)

6. **Users** tab — you will see everyone who registered.

After editing `.env.local`, always **restart** `npm run dev`.

---

## 12. Environment file (`.env.local`)

| Variable | Used for |
|----------|----------|
| `SUPABASE_URL` | Database + auth |
| `SUPABASE_ANON_KEY` | Safe public key with Supabase rules (RLS) |
| `GEMINI_API_KEY` | Optional AI |

`next.config.ts` copies Supabase values so the browser can log in without duplicating `NEXT_PUBLIC_*` lines.

**Never commit `.env.local` to Git.** `.gitignore` blocks it.

---

## 13. Tech words we use (short glossary)

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

---

## 14. How to run the project (every teammate)

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

## 15. Deploy on Vercel (summary)

1. Push code to GitHub.
2. Vercel → New project → root folder **`my-app`**, preset **Next.js**.
3. Add same env vars as `.env.local` in Vercel settings.
4. Add production callback URL in Supabase (see section 11).

---

## 16. What we implemented vs what is next

### Done ✅

- Single Next.js app structure
- Modern home page (dark blue / white / yellow, Framer Motion, `components/home/`) — see **section 2**
- Home page loader (CV drop + match % while content appears) — **section 2, step 8**
- Dashboard UI (sidebar, stat cards, demo menus) — **section 3**
- Kanban pipeline (5 columns, filter bar) — **section 3, step 11**
- Home page + SEO layout
- Email register (full name, email, password, confirm)
- Email login
- Google sign-in/up
- Protected dashboard with welcome text
- Navbar auth state (login/logout without manual refresh)
- APIs: health, items, gemini, auth
- Supabase connection pattern
- README + this group guide

### Next ideas (for the team to pick) 🔜

- Show `job_applications` on dashboard (fetch `/api/items`)
- Form to add a new application on dashboard
- Link each row to a logged-in user (`user_id` + RLS in Supabase)
- CV upload / paste → Gemini match
- Status pills: applied → interview → offer

---

## 17. How to explain this in a presentation (2 minutes)

1. “We built **one Next.js app** — pages and APIs together.”
2. “**Supabase** holds users and will hold job applications.”
3. “You can **register with email or Google**, then see a **dashboard**.”
4. “**API routes** let us test with Postman and power the dashboard later.”
5. “**`.env.local`** connects our laptop to **our** Supabase project — that’s how we know which database we use.”

---

## 18. Questions teammates often ask

**Why do I only see Log in after I added Supabase in the browser?**  
The **browser “connected”** feeling is not the same as keys in `.env.local`. The app needs `SUPABASE_URL` and `SUPABASE_ANON_KEY` on your machine.

**Why does Postman work on port 3000, not 4000?**  
We merged the old Express backend into Next.js. All APIs are under the same port as the website.

**Can two teammates share one Supabase project?**  
Yes. Same URL and keys in each person’s `.env.local` (do not share keys in public chat — share via private team channel).

**I get an error right when the site loads about Supabase URL.**  
Empty `.env.local`. Copy keys, restart `npm run dev`.

---

## 19. Who to ask on the team

Use this section in meetings:

- **Architecture / Next.js structure** — document owner  
- **Supabase tables & auth settings** — whoever set up the dashboard  
- **Vercel & Git** — whoever owns deployment  
- **UI pages** — frontend/design  
- **API & Postman** — backend integration  

*(Fill in names as you split tasks.)*

---

## 20. One sentence to remember

**Jobmatcher is a Next.js website where logged-in users will track jobs; Supabase stores users and data; we already ship login, Google, dashboard, and APIs — the dashboard list is the next brick to add.**

Thank you for reading. If something in this guide is wrong or out of date, update **GROUP_GUIDE.md** in the same PR as the code change so the team stays aligned.