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

## Examples

All examples assume `npm run dev` is running on http://localhost:3000.
From the browser (React components) use relative URLs like `/api/jobs/search`; the login cookie is sent automatically.
In PowerShell use `curl.exe`, not `curl` (that is an alias for `Invoke-WebRequest`).

### Search jobs

```ts
const params = new URLSearchParams({ q: "react", remote: "true", limit: "10" });
const res = await fetch(`/api/jobs/search?${params}`);
const data = await res.json();

if (!res.ok)
  throw new Error(data.error);

// data.total: number of matching ads in JobTech
// data.items: NormalizedJob[] (see types.ts)
for (const job of data.items)
{
  console.log(job.title, job.company, job.location);
}
```

```powershell
curl.exe "http://localhost:3000/api/jobs/search?q=react&limit=2"
```

Query parameters: `q` (required), `municipality` (JobTech concept id), `remote` (`true`/`false`),
`offset` (default 0), `limit` (1–50, default 20).

Response (shortened):

```json
{
  "total": 312,
  "items": [
    {
      "source": "jobtech",
      "externalId": "31766492",
      "sourceUrl": "https://arbetsformedlingen.se/platsbanken/annonser/31766492",
      "applyUrl": "https://jobb.procruitment.se/jobs/8569286-mjukvaruutvecklare-c/applications/new?promotion=2308552-arbetsformedlingen",
      "title": "Mjukvaruutvecklare C#",
      "company": "Procruitment AB",
      "location": "Jönköping",
      "remote": null,
      "description": "Om kunden\nVår kund är ett globalt ledande produktbolag ...",
      "skills": [],
      "salaryMin": null,
      "salaryMax": null,
      "salaryText": null,
      "postedAt": "2026-11-23T12:55:06",
      "deadlineAt": "2027-05-22T23:59:59"
    }
  ]
}
```

### Import a job from a Platsbanken link

Returns a preview so the user can check it before saving. Nothing is written to the database.

```ts
const res = await fetch("/api/jobs/import",
{
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://arbetsformedlingen.se/platsbanken/annonser/31766492" }),
});
const data = await res.json();

if (res.ok)
  showPreview(data.job);
else if (data.code === "LOGIN_REQUIRED" || data.code === "UNSUPPORTED_SITE")
  showPasteTextTab(data.error);   // e.g. a LinkedIn link: ask the user to paste the text
else
  showError(data.error);
```

```powershell
curl.exe -X POST "http://localhost:3000/api/jobs/import" -H "Content-Type: application/json" -d '{\"url\":\"https://arbetsformedlingen.se/platsbanken/annonser/31766492\"}'
```

Response: `{ "job": { ...same shape as a search item... } }`

A LinkedIn link gives status 422:

```json
{
  "error": "LinkedIn requires a login, so we can't read the job from the link. Copy the job text and paste it instead.",
  "code": "LOGIN_REQUIRED"
}
```

### Save a job

The user must be logged in. Send only the id for JobTech ads; the server fetches the ad itself.

```ts
// A job from search or import
await fetch("/api/jobs",
{
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ source: "jobtech", externalId: job.externalId }),
});

// A job the user pasted in
await fetch("/api/jobs",
{
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(
  {
    source: "manual",
    title: "Frontend Developer",
    company: "Example AB",
    location: "Stockholm",
    sourceUrl: "https://www.linkedin.com/jobs/view/123",
    description: "We are looking for ...",
  }),
});
```

Response: `{ "job": { "id": "uuid", "source": "jobtech", "title": "...", "created_by": "uuid", ... } }`
with status 201 when created, or 200 when the JobTech ad was already saved. The row uses the
database column names (snake_case), see `supabase/jobs.sql`.

Not logged in gives status 401:

```json
{ "error": "Log in to save jobs.", "code": "UNAUTHORIZED" }
```

### Status codes

| Status | `code` | When |
| --- | --- | --- |
| 400 | `INVALID_INPUT` | Missing or invalid input; `error` names the field |
| 401 | `UNAUTHORIZED` | Saving without being logged in |
| 404 | `NOT_FOUND` | The Platsbanken ad no longer exists |
| 422 | `LOGIN_REQUIRED` | LinkedIn, Indeed or Glassdoor link |
| 422 | `UNSUPPORTED_SITE` | Any other site that isn't Platsbanken |
| 500 | `DB_ERROR` | Supabase rejected the query (e.g. `jobs.sql` not run yet) |
| 502 | `UPSTREAM_ERROR` | JobTech is down, slow or returned an error |
| 503 | `NOT_CONFIGURED` | Supabase keys missing in `.env.local` |

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

`__fixtures__/jobtech-ad-real.json` is a real `/ad/{id}` response (contact details redacted).
`__fixtures__/jobtech-ad.json` is a hand-written sample used for edge cases such as duplicate skills and HTML entities.
