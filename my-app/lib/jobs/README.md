# Job fetcher (CARD-03)

Fetches jobs from Arbetsförmedlingen's JobTech JobSearch API and saves them to Supabase.

## API routes

| Route | Body / query | Returns |
| --- | --- | --- |
| `GET /api/jobs/search` | `?q=react&remote=true&offset=0&limit=20` | `{ total, items }` (not saved) |
| `POST /api/jobs/import` | `{ "url": "https://arbetsformedlingen.se/platsbanken/annonser/123" }` | `{ job }` preview (not saved) |
| `POST /api/jobs` | `{ "source": "jobtech", "externalId": "123" }` or `{ "source": "manual", "title", "company?", "location?", "description" }` | `{ job }` saved row. Needs login |

Errors use the app's `{ error: "message" }` shape plus a `code`:
`INVALID_INPUT`, `UNAUTHORIZED`, `LOGIN_REQUIRED` (LinkedIn/Indeed/Glassdoor links), `UNSUPPORTED_SITE`,
`NOT_FOUND`, `UPSTREAM_ERROR`, `DB_ERROR`, `NOT_CONFIGURED`. `error` is written for users.

## Setup

1. Run `supabase/jobs.sql` once in Supabase → SQL Editor (creates the `jobs` table and RLS policies).
2. Optional: set `JOBTECH_API_KEY` in `.env.local` only if JobTech turns out to need a key.

## Files

| File | What it does |
| --- | --- |
| `types.ts` | `NormalizedJob` (the shape every source maps to) and the search query schema |
| `clean.ts` | HTML or messy text to clean plain text, capped at 20,000 characters |
| `jobtech.ts` | JobTech client (`search`, `getAd`), the `mapJobTechAd` mapper, `parsePlatsbankenId` |
| `url.ts` | Decides how a pasted link can be imported |
| `save.ts` | Save-body schema, pasted-text mapper, and `jobs` row mapping |
| `http.ts` | Error responses |
| `jobtech.http` | Requests for trying the live API and local routes by hand |

## Tests

```sh
npm test          # vitest
npm run typecheck # tsc
```

`__fixtures__/jobtech-ad.json` is a hand-written sample, not a captured API response.
Replace it with a real `/ad/{id}` response once you've run `jobtech.http`.
