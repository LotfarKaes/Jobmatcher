# Jobmatcher — full guide (simple English)

Read this like a story. Each part builds on the last. You do not need to be a coding expert. Take one step at a time.

---

## What is this project?

**Jobmatcher** helps job seekers:

1. Find jobs that match their CV (resume) with help from AI when you turn it on.
2. Track every application in one dashboard — from “I applied” to “I got hired.”

You are building a **full stack** app. That sounds fancy, but it only means three things work together:

| Part | Simple name | What it does |
|------|-------------|--------------|
| **Frontend** | The face | Screens you click and read. Lives in the browser. |
| **Backend** | The waiter | Takes orders from the frontend, runs safe logic, asks the database. |
| **Database (Supabase)** | The memory box | Saves job applications and other data in the cloud. |

**Gemini** (Google AI) is optional. The backend can send it a question when you add your API key. Never put that key on the frontend.

---

## How the architecture works

Think of a restaurant:

1. **You (user)** sit at the table — that is the **browser** and the **frontend**.
2. You ask for something — for example “show my applications.”
3. The **backend** walks to the kitchen and asks **Supabase** for the data.
4. Supabase sends the list back. The backend passes it to the frontend.
5. The frontend draws the list on the screen.

```
  YOU (browser)
       |
       |  "Please give me my job list"
       v
  FRONTEND (Next.js)  ---- talks to --->  BACKEND (Express)
       |                                        |
       |  shows pages                           |  reads/writes
       |                                        v
       |                                   SUPABASE (cloud database)
       |
       optional later: BACKEND ---> GEMINI (AI answers)
```

### Important rules

- The frontend and backend are **two separate programs**. Each has its own `npm run dev`. One command does not start both.
- On your laptop, the frontend often runs at **http://localhost:3000**.
- The backend often runs at **http://localhost:4000**.
- Secrets (Supabase keys, Gemini key) go in **backend `.env` only**. Do not paste them into the frontend unless the docs say it is safe (public anon key with Row Level Security is a special case — we keep it simple and use the backend first).

### What each folder is for

```
my-app/
  frontend/                 ← Website (Next.js, React, TypeScript, Tailwind)
    app/
      layout.tsx            ← Wrapper for every page (title for Google, navbar, footer)
      page.tsx              ← Home page
      globals.css           ← Colors and base styles
    components/
      Navbar.tsx            ← Top menu
    .env.local.example      ← Copy to .env.local (API address for the site)
    package.json            ← Frontend tools list

  backend/                  ← API server (Node.js, Express)
    src/
      server.ts             ← Starts the server and connects routes
      routes/
        health.ts           ← “Are you alive?” check
        items.ts            ← List and add job applications (Supabase)
        gemini.ts           ← AI text (needs GEMINI_API_KEY)
      services/
        supabase.ts         ← Connects to Supabase
    .env.example            ← Copy to .env (keys and port)
    package.json            ← Backend tools list

  README.md                 ← You are here
  .gitignore                ← Tells git not to upload node_modules and secrets
```

---

## What you need on your computer first

1. **Node.js** (version 18 or newer is fine). Download from nodejs.org if you do not have it.
2. **A code editor** (Cursor or VS Code).
3. **Internet** — Supabase lives online.
4. **A free Supabase account** — supabase.com (when you are ready for the database).
5. **Optional:** Gemini API key from Google when you want AI.

Check Node:

```powershell
node -v
npm -v
```

You should see version numbers, not an error.

---

## Step-by-step: run the project on your laptop

### Step 1 — Open the backend folder and install

In PowerShell:

```powershell
cd "C:\Users\Ägaren\Desktop\my vision\FrontendLaxicon\Jobmatcher\my-app\backend"
npm install
```

(Use your real path if it is different.)

### Step 2 — Make a secret settings file for the backend

Copy the example file to a real `.env` file:

```powershell
copy .env.example .env
```

Open `.env` in your editor. You can leave Supabase and Gemini blank at first. Keep:

```
PORT=4000
```

### Step 3 — Start the backend

```powershell
npm run dev
```

Leave this window open. You should see a message that the API is listening on port **4000**.

Test in the browser: **http://localhost:4000/api/health**

You should see JSON with `"ok": true`. That means the backend works.

### Step 4 — Open the frontend folder and install

Open a **second** PowerShell window:

```powershell
cd "C:\Users\Ägaren\Desktop\my vision\FrontendLaxicon\Jobmatcher\my-app\frontend"
npm install
```

### Step 5 — Tell the frontend where the backend lives

```powershell
copy .env.local.example .env.local
```

Inside `.env.local` you should have:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 6 — Start the frontend

```powershell
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the Jobmatcher home page.

### Step 7 — Remember: two windows

| Window | Folder | Command | Address |
|--------|--------|---------|---------|
| 1 | backend | npm run dev | http://localhost:4000 |
| 2 | frontend | npm run dev | http://localhost:3000 |

Stop a server with **Ctrl + C** in that window.

---

## Step-by-step: connect live Supabase

Yes — your **local** backend can talk to your **real** Supabase project in the cloud. You do not need Supabase running on your PC.

### Step 1 — Create a Supabase project

1. Log in at supabase.com.
2. Create a new project. Pick a name and password for the database.
3. Wait until the project is ready.

### Step 2 — Copy your keys

In Supabase: **Project Settings → API**

Copy:

- **Project URL** → paste into `SUPABASE_URL` in `backend/.env`
- **anon public** key → paste into `SUPABASE_ANON_KEY` in `backend/.env`

Save the file. Restart the backend (`Ctrl+C`, then `npm run dev` again).

### Step 3 — Create the table for applications

In Supabase, open **SQL Editor**. Run this once:

```sql
create table job_applications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  status text not null default 'applied',
  created_at timestamptz default now()
);
```

You can also add test rows in **Table Editor**.

### Step 4 — Test the API

- **GET** http://localhost:4000/api/items — should return a list (maybe empty at first).
- Use Postman, Thunder Client, or curl to **POST** JSON:

```json
{
  "title": "Frontend Developer",
  "company": "Example AB",
  "status": "applied"
}
```

to **http://localhost:4000/api/items**

If you get errors about permissions, you may need **Row Level Security** policies in Supabase for your table. Ask a teacher or teammate, or learn “Supabase RLS for beginners.”

### Step 5 — Show data on the website (your next coding task)

The home page does not load the list yet. Full stack development means:

1. Add a **Dashboard** page in `frontend/app/`.
2. On that page, call `fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`)`.
3. Show each job in a card or table.
4. Add a small form that **POST**s a new job to the same API.
5. Refresh the list after save.

That is frontend + backend + database working together.

---

## Step-by-step: turn on Gemini (AI) later

1. Get an API key from Google AI Studio (Gemini).
2. Put it in `backend/.env`:

   ```
   GEMINI_API_KEY=your_key_here
   ```

3. Restart the backend.
4. Send a POST to **http://localhost:4000/api/gemini** with body:

   ```json
   { "prompt": "Say hello in one sentence." }
   ```

5. Build a feature on the frontend that only calls this API (never the key itself). Example: “Paste your CV and we suggest job titles.”

---

## Step-by-step: full stack development plan (whole project)

Use this as a checklist for your team. Do the steps in order when you can.

### Phase 1 — Foundation (you are mostly here)

- [x] Split `frontend` and `backend` folders.
- [x] Home page with team names and SEO basics.
- [x] Health API works.
- [ ] Everyone on the team can run two terminals and open localhost.

### Phase 2 — Database and API

- [ ] Supabase project live, table `job_applications` created.
- [ ] GET and POST `/api/items` tested.
- [ ] Dashboard page lists applications from the API.
- [ ] Form to add a new application.
- [ ] Edit status (applied, interview, offer, rejected) — new API route if needed.

### Phase 3 — Users and safety (when you are ready)

- [ ] Supabase Auth (sign up, log in).
- [ ] Each user only sees their own rows (RLS policies).
- [ ] Backend or Supabase rules so strangers cannot steal data.

### Phase 4 — AI job matching

- [ ] Upload or paste CV text on the frontend.
- [ ] Backend sends safe prompt to Gemini.
- [ ] Show suggested jobs or match score (store results in Supabase if you want history).

### Phase 5 — Polish and SEO

- [ ] One clear `h1` per page, good titles and descriptions.
- [ ] Works on phone and desktop (Tailwind responsive classes).
- [ ] Fast pages, no huge images without reason.

### Phase 6 — Go live on the internet

- [ ] Put code on GitHub (one repo is enough — frontend and backend folders together).
- [ ] Deploy **frontend** to Vercel (root folder: `my-app/frontend`).
- [ ] Deploy **backend** to a host that runs Node all the time (Render, Railway, etc.) **or** move APIs into Next.js later.
- [ ] Set `NEXT_PUBLIC_API_URL` on Vercel to your live API URL (not localhost).
- [ ] Put Supabase and Gemini keys in the hosting dashboard, not in git.

---

## API cheat sheet (for developers)

| What | Method | URL | Notes |
|------|--------|-----|--------|
| Health check | GET | /api/health | Always try this first |
| List applications | GET | /api/items | Needs Supabase |
| Add application | POST | /api/items | JSON: title, company, status |
| AI text | POST | /api/gemini | JSON: prompt — needs GEMINI_API_KEY |

Base URL local: `http://localhost:4000`

---

## Common problems (plain answers)

**“npm is not recognized”**  
Install Node.js and open a new terminal.

**Home page works but API fails**  
Is the backend window still running? Did you copy `.env` and `.env.local`?

**Supabase says not configured**  
Fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `backend/.env` and restart.

**Empty list but no error**  
The table might be empty. Add a row in Supabase or POST from the API.

**CORS errors in the browser**  
The backend allows browser calls in dev. If you deploy, set CORS to your real website URL.

**One repo or two for Git and Vercel?**  
One Git repo is fine. Vercel usually hosts the **frontend** folder first. The Express backend often needs its own host unless you move APIs into Next.js.

---

## Team

Lotfar Kaes, Gustav Jeppsson, Andreas Rimheden, Anastasiya Lakhmakova, Marina Silakova.

---

## Short summary

1. **Frontend** = what users see. Run in `frontend` with `npm run dev` → port 3000.  
2. **Backend** = brain that talks to Supabase and Gemini. Run in `backend` with `npm run dev` → port 4000.  
3. **Supabase** = saves data in the cloud; local backend can use the live project.  
4. Build in phases: run locally → database → dashboard → users → AI → deploy.  
5. Read this file again whenever someone new joins the team.

Good luck. One step at a time.