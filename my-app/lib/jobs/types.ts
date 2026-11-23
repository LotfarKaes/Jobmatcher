import { z } from "zod";

/**
 * The one shape every job source maps into before it touches the database.
 * Think of it as the DTO between the source clients and the `jobs` table.
 *
 * Dates are ISO 8601 strings (not Date objects) so the type survives
 * JSON serialization between API routes and the browser unchanged.
 */
export const JobSourceSchema = z.enum(["jobtech", "url", "manual"]);
export type JobSource = z.infer<typeof JobSourceSchema>;

export const NormalizedJobSchema = z.object({
  source: JobSourceSchema,
  externalId: z.string().nullable(),
  sourceUrl: z.url().nullable(),
  applyUrl: z.url().nullable(),
  title: z.string().min(1),
  company: z.string().nullable(),
  location: z.string().nullable(),
  remote: z.boolean().nullable(),
  description: z.string().min(1),
  skills: z.array(z.string()),
  salaryMin: z.number().int().nullable(),
  salaryMax: z.number().int().nullable(),
  salaryText: z.string().nullable(),
  postedAt: z.string().nullable(),
  deadlineAt: z.string().nullable(),
});

// Derive the static type from the runtime schema: one source of truth.
export type NormalizedJob = z.infer<typeof NormalizedJobSchema>;

/** Query accepted by GET /api/jobs/search (validated from URLSearchParams). */
export const JobSearchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
  /** JobTech municipality concept id from the JobTech Taxonomy API (not a name like "Stockholm"). */
  municipality: z.string().trim().min(1).optional(),
  // z.coerce.boolean() would turn the string "false" into true, so parse it explicitly.
  remote: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  offset: z.coerce.number().int().min(0).max(2000).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type JobSearchQuery = z.infer<typeof JobSearchQuerySchema>;

export interface JobSearchResult {
  total: number;
  items: NormalizedJob[];
}
