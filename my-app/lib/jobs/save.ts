import { z } from "zod";
import { cleanText } from "./clean";
import type { NormalizedJob } from "./types";

/** Body for POST /api/jobs. JobTech jobs are re-fetched on the server by id, never trusted from the client. */
export const SaveJobBodySchema = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("jobtech"),
    externalId: z.string().regex(/^\d+$/, "must be a numeric JobTech ad id"),
  }),
  z.object({
    source: z.literal("manual"),
    title: z.string().trim().min(1).max(300),
    company: z.string().trim().max(300).optional(),
    location: z.string().trim().max(300).optional(),
    sourceUrl: z.url().optional(),
    description: z.string().trim().min(1).max(100_000),
  }),
]);
export type SaveJobBody = z.infer<typeof SaveJobBodySchema>;

type ManualJobBody = Extract<SaveJobBody, { source: "manual" }>;

/** Turns pasted text into a NormalizedJob. */
export function manualJob(body: ManualJobBody): NormalizedJob
{
  return {
    source: "manual",
    externalId: null,
    sourceUrl: body.sourceUrl ?? null,
    applyUrl: null,
    title: body.title,
    company: body.company || null,
    location: body.location || null,
    remote: null,
    description: cleanText(body.description) || body.title,
    skills: [],
    salaryMin: null,
    salaryMax: null,
    salaryText: null,
    postedAt: null,
    deadlineAt: null,
  };
}

/** Row shape of the `jobs` table (snake_case, see supabase/jobs.sql). */
export interface JobRow
{
  id: string;
  source: NormalizedJob["source"];
  external_id: string | null;
  source_url: string | null;
  apply_url: string | null;
  title: string;
  company: string | null;
  location: string | null;
  remote: boolean | null;
  description: string;
  skills: string[];
  salary_min: number | null;
  salary_max: number | null;
  salary_text: string | null;
  posted_at: string | null;
  deadline_at: string | null;
  created_by: string | null;
  created_at: string;
}

export function toJobInsert(job: NormalizedJob, userId: string): Omit<JobRow, "id" | "created_at">
{
  return {
    source: job.source,
    external_id: job.externalId,
    source_url: job.sourceUrl,
    apply_url: job.applyUrl,
    title: job.title,
    company: job.company,
    location: job.location,
    remote: job.remote,
    description: job.description,
    skills: job.skills,
    salary_min: job.salaryMin,
    salary_max: job.salaryMax,
    salary_text: job.salaryText,
    posted_at: job.postedAt,
    deadline_at: job.deadlineAt,
    created_by: userId,
  };
}
