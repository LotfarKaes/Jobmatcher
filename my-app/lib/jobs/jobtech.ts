import { z } from "zod";
import { cleanText } from "./clean";
import type { JobSearchQuery, JobSearchResult, NormalizedJob } from "./types";

/**
 * Client for Arbetsförmedlingen's JobTech JobSearch API.
 * Docs and Swagger: https://jobsearch.api.jobtechdev.se
 *
 * The response schemas below are deliberately loose (every field optional or
 * nullable, unknown fields ignored). They only describe the fields we map, so a
 * new field in the API never breaks us, and a missing one becomes null.
 */

export const JOBTECH_BASE_URL = "https://jobsearch.api.jobtechdev.se";
const TIMEOUT_MS = 8_000;

const text = z.string().nullish();

const SkillListSchema = z
  .object({ skills: z.array(z.object({ label: text })).nullish() })
  .nullish();

export const JobTechAdSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  headline: text,
  webpage_url: text,
  publication_date: text,
  application_deadline: text,
  salary_description: text,
  employer: z.object({ name: text, workplace: text }).nullish(),
  workplace_address: z
    .object({ municipality: text, city: text, region: text, country: text })
    .nullish(),
  description: z.object({ text: text, text_formatted: text }).nullish(),
  application_details: z.object({ url: text }).nullish(),
  must_have: SkillListSchema,
  nice_to_have: SkillListSchema,
});
export type JobTechAd = z.infer<typeof JobTechAdSchema>;

export const JobTechSearchResponseSchema = z.object({
  total: z.object({ value: z.number() }).nullish(),
  hits: z.array(z.unknown()).default([]),
});

export type JobTechErrorCode = "NOT_FOUND" | "UPSTREAM_ERROR";

/** Thrown by the client. API routes map `code` to the `{ error, code }` response (see http.ts). */
export class JobTechError extends Error
{
  constructor(
    public readonly code: JobTechErrorCode,
    message: string,
    public readonly status?: number,
  )
  {
    super(message);
    this.name = "JobTechError";
  }
}

function asUrl(value: string | null | undefined): string | null
{
  if (!value)
    return null;

  try
  {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  }
  catch
  {
    return null;
  }
}

function skillLabels(...lists: (z.infer<typeof SkillListSchema>)[]): string[]
{
  const labels = lists
    .flatMap((l) => l?.skills ?? [])
    .map((s) => s.label?.trim());

  return [...new Set(labels.filter((l): l is string => !!l))];
}

/** Pure mapper from a JobTech ad to our NormalizedJob. No I/O, easy to unit test. */
export function mapJobTechAd(ad: JobTechAd): NormalizedJob
{
  const address = ad.workplace_address;
  const location = address?.city || address?.municipality || address?.region || null;
  const description = cleanText(ad.description?.text ?? ad.description?.text_formatted);

  return {
    source: "jobtech",
    externalId: ad.id,
    sourceUrl: asUrl(ad.webpage_url) ?? platsbankenUrl(ad.id),
    applyUrl: asUrl(ad.application_details?.url),
    title: ad.headline?.trim() || "Untitled job",
    company: ad.employer?.name?.trim() || ad.employer?.workplace?.trim() || null,
    location,
    // The ad has no reliable remote flag; only the search filter knows. Unknown = null.
    remote: null,
    description: description || "(No description provided)",
    skills: skillLabels(ad.must_have, ad.nice_to_have),
    salaryMin: null,
    salaryMax: null,
    salaryText: ad.salary_description?.trim() || null,
    postedAt: ad.publication_date ?? null,
    deadlineAt: ad.application_deadline ?? null,
  };
}

export function platsbankenUrl(adId: string): string
{
  return `https://arbetsformedlingen.se/platsbanken/annonser/${encodeURIComponent(adId)}`;
}

/**
 * Returns the ad id from a Platsbanken link, or null if the URL isn't one.
 * Accepts e.g. https://arbetsformedlingen.se/platsbanken/annonser/29012345?foo=bar
 */
export function parsePlatsbankenId(rawUrl: string): string | null
{
  let url: URL;

  try
  {
    url = new URL(rawUrl.trim());
  }
  catch
  {
    return null;
  }

  const host = url.hostname
    .toLowerCase()
    .replace(/^www\./, "");

  if (host !== "arbetsformedlingen.se")
    return null;

  const match = url.pathname.match(/^\/platsbanken\/annonser\/(\d+)\/?$/);

  return match?.[1] ?? null;
}

export interface JobTechClientOptions
{
  /** Injected for tests. Defaults to the global fetch. */
  fetch?: typeof fetch;
  baseUrl?: string;
  /** Only needed if JobTech requires a key again. Read from JOBTECH_API_KEY by default. */
  apiKey?: string;
}

/**
 * Creates a client for the JobTech API.
 */
export function createJobTechClient(options: JobTechClientOptions = {})
{
  const doFetch = options.fetch ?? fetch;
  const baseUrl = options.baseUrl ?? JOBTECH_BASE_URL;
  const apiKey = options.apiKey ?? process.env.JOBTECH_API_KEY;

  async function getJson(path: string, params?: URLSearchParams): Promise<unknown>
  {
    const url = `${baseUrl}${path}${params ? `?${params}` : ""}`;
    const headers: Record<string, string> = { accept: "application/json" };

    if (apiKey)
      headers["api-key"] = apiKey;

    let res: Response;

    try
    {
      // fetch has no default timeout, unlike HttpClient's 100 s.
      res = await doFetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
    }
    catch (err)
    {
      const reason = err instanceof Error && err.name === "TimeoutError"
        ? "timed out"
        : "could not be reached";

      throw new JobTechError("UPSTREAM_ERROR", `The job search service ${reason}. Try again in a moment.`);
    }

    // fetch does not throw on 4xx/5xx, so check status explicitly.
    if (res.status === 404)
      throw new JobTechError("NOT_FOUND", "That job ad no longer exists on Platsbanken.", 404);

    if (!res.ok)
      throw new JobTechError("UPSTREAM_ERROR", `The job search service returned an error (${res.status}).`, res.status);

    return res.json();
  }

  return {
    /** Keyword search. Returns normalized jobs; nothing is saved. */
    async search(query: JobSearchQuery): Promise<JobSearchResult>
    {
      const params = new URLSearchParams({
        q: query.q,
        offset: String(query.offset),
        limit: String(query.limit),
      });

      if (query.municipality)
        params.set("municipality", query.municipality);

      if (query.remote)
        params.set("remote", "true");

      const body = JobTechSearchResponseSchema.parse(await getJson("/search", params));

      // Parse ads one by one so a single odd ad is skipped instead of failing the whole page.
      const items: NormalizedJob[] = [];

      for (const hit of body.hits)
      {
        const ad = JobTechAdSchema.safeParse(hit);

        if (ad.success)
          items.push(mapJobTechAd(ad.data));
      }

      return { total: body.total?.value ?? items.length, items };
    },

    /** One ad by its JobTech / Platsbanken id. */
    async getAd(id: string): Promise<NormalizedJob>
    {
      if (!/^\d+$/.test(id))
        throw new JobTechError("NOT_FOUND", "That is not a valid Platsbanken ad id.");

      const ad = JobTechAdSchema.safeParse(await getJson(`/ad/${id}`));

      if (!ad.success)
        throw new JobTechError("UPSTREAM_ERROR", "The job search service returned an ad we could not read.");

      return mapJobTechAd(ad.data);
    },
  };
}

export type JobTechClient = ReturnType<typeof createJobTechClient>;
