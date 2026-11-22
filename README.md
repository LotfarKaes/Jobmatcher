# Jobmatcher

Jobmatcher helps job seekers save time: track applications and (later) use AI to find jobs that fit your CV.

## Where the code is

Everything runs from **one Next.js app**:

**my-app/**

- **Pages** — what you see (`app/page.tsx`, components)
- **API** — server routes (`app/api/...`) for Supabase and Gemini

There is **no separate Express folder** anymore.

## Read the guide

Start here: **[my-app/README.md](my-app/README.md)**

It explains setup, folders, Supabase, Postman, and Vercel in simple steps.

## Quick start

```powershell
cd my-app
npm install
copy .env.local.example .env.local
npm run dev
```

Open http://localhost:3000 — API: http://localhost:3000/api/health

## Old practice files

**index.html** and **style.css** in this folder were an early HTML exercise. The real app is **my-app/**.