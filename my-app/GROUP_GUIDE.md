# Jobmatcher — group guide (how we built it)

Hi team. This document is for **Lotfar, Gustav, Andreas, Anastasiya, Marina**, and anyone new on the project.

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

---

## 2. One app, not two servers

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

## 3. How a request travels (the big picture)

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

## 4. Folder map (what each part does)

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
      auth/
        register/route.ts    → POST sign up with email
        login/route.ts       → POST sign in with email
        logout/route.ts      → POST sign out

  components/
    Navbar.tsx               → Logo, Home link, auth area
    NavAuth.tsx              → Shows Log in/Register OR name + Dashboard + Log out
    LoginForm.tsx            → Email login form + Google button
    RegisterForm.tsx         → Full name, email, password, confirm + Google
    GoogleSignInButton.tsx   → “Continue with Google”

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

## 5. Pages your teammates can open

| URL | Who can see it | What happens |
|-----|----------------|--------------|
| `/` | Everyone | Home + team list |
| `/login` | Everyone | Log in form |
| `/register` | Everyone | Create account form |
| `/dashboard` | **Only logged-in users** | Welcome message; others sent to `/login` |

### Dashboard protection

`app/dashboard/page.tsx` asks Supabase: “Is there a logged-in user?”

- **Yes** → show “Welcome to Jobmatcher dashboard”.
- **No** → redirect to `/login`.

That is a basic **protected page** pattern we will reuse for real job data later.

---

## 6. How sign-up and log-in work

We use **Supabase Auth**. Supabase stores users (email, password hash, Google id). Our app talks to Supabase through code in `lib/supabase/`.

### 6a. Email registration (manual)

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

### 6b. Email log-in

1. User enters email + password on `/login`.
2. `LoginForm.tsx` → **`POST /api/auth/login`**.
3. Server calls `signInWithPassword`.
4. Supabase sets **cookies** (small files) so the browser “remembers” the user.
5. Redirect to **`/dashboard`**.

### 6c. Google (one click)

1. User clicks **Log in with Google** on login or register.
2. `GoogleSignInButton.tsx` opens Google’s page (OAuth).
3. After approval, browser goes to **`/auth/callback`** with a `code`.
4. `auth/callback/route.ts` trades that code for a session.
5. User lands on **`/dashboard`**.

**You must configure Google** in Supabase dashboard (see section 9).

### 6d. Log out

1. User clicks **Log out** in the navbar.
2. App calls **`POST /api/auth/logout`** and browser `signOut`.
3. Menu switches back to **Log in / Register** without refreshing the whole page (see NavAuth below).

---

## 7. Why the menu updates without refresh

Early version: menu was built on the **server** once per page load. After log out, it still showed your name until F5.

**Fix:** `NavAuth.tsx` is a **client component**. It:

- Reads the user from Supabase in the browser.
- Listens to `onAuthStateChange` (login/logout events).
- Listens to a custom event `jobmatcher:auth-changed` after our forms succeed.

So the navbar updates **right away**.

When logged in, menu shows: **Dashboard · Your name · Log out**.  
When logged out: **Log in · Register**.

---

## 8. API routes (for Postman and future dashboard)

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

## 9. What you must set up in Supabase

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

## 10. Environment file (`.env.local`)

| Variable | Used for |
|----------|----------|
| `SUPABASE_URL` | Database + auth |
| `SUPABASE_ANON_KEY` | Safe public key with Supabase rules (RLS) |
| `GEMINI_API_KEY` | Optional AI |

`next.config.ts` copies Supabase values so the browser can log in without duplicating `NEXT_PUBLIC_*` lines.

**Never commit `.env.local` to Git.** `.gitignore` blocks it.

---

## 11. Tech words we use (short glossary)

| Word | Plain meaning |
|------|----------------|
| **Next.js** | Framework that builds our website + APIs together |
| **React** | Library to build buttons, forms, pages as components |
| **TypeScript** | JavaScript with types — fewer silly bugs |
| **Tailwind** | CSS classes like `text-lg` for styling |
| **Supabase** | Cloud service: login + database |
| **API route** | A URL that returns JSON, not a full HTML page |
| **Middleware** | Code that runs before each page; keeps login cookies fresh |
| **OAuth** | “Log in with Google” — Google checks password, we get a yes/no token |
| **Session** | Proof you are logged in (stored in cookies) |
| **Vercel** | Website host for Next.js (production) |

---

## 12. How to run the project (every teammate)

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

## 13. Deploy on Vercel (summary)

1. Push code to GitHub.
2. Vercel → New project → root folder **`my-app`**, preset **Next.js**.
3. Add same env vars as `.env.local` in Vercel settings.
4. Add production callback URL in Supabase (see section 9).

---

## 14. What we implemented vs what is next

### Done ✅

- Single Next.js app structure
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

## 15. How to explain this in a presentation (2 minutes)

1. “We built **one Next.js app** — pages and APIs together.”
2. “**Supabase** holds users and will hold job applications.”
3. “You can **register with email or Google**, then see a **dashboard**.”
4. “**API routes** let us test with Postman and power the dashboard later.”
5. “**`.env.local`** connects our laptop to **our** Supabase project — that’s how we know which database we use.”

---

## 16. Questions teammates often ask

**Why do I only see Log in after I added Supabase in the browser?**  
The **browser “connected”** feeling is not the same as keys in `.env.local`. The app needs `SUPABASE_URL` and `SUPABASE_ANON_KEY` on your machine.

**Why does Postman work on port 3000, not 4000?**  
We merged the old Express backend into Next.js. All APIs are under the same port as the website.

**Can two teammates share one Supabase project?**  
Yes. Same URL and keys in each person’s `.env.local` (do not share keys in public chat — share via private team channel).

**I get an error right when the site loads about Supabase URL.**  
Empty `.env.local`. Copy keys, restart `npm run dev`.

---

## 17. Who to ask on the team

Use this section in meetings:

- **Architecture / Next.js structure** — document owner  
- **Supabase tables & auth settings** — whoever set up the dashboard  
- **Vercel & Git** — whoever owns deployment  
- **UI pages** — frontend/design  
- **API & Postman** — backend integration  

*(Fill in names as you split tasks.)*

---

## 18. One sentence to remember

**Jobmatcher is a Next.js website where logged-in users will track jobs; Supabase stores users and data; we already ship login, Google, dashboard, and APIs — the dashboard list is the next brick to add.**

Thank you for reading. If something in this guide is wrong or out of date, update **GROUP_GUIDE.md** in the same PR as the code change so the team stays aligned.