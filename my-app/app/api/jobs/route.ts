import { NextResponse } from "next/server";
import { fromJobTechError, invalidInput, jobError } from "@/lib/jobs/http";
import { createJobTechClient } from "@/lib/jobs/jobtech";
import { manualJob, SaveJobBodySchema, toJobInsert } from "@/lib/jobs/save";
import type { NormalizedJob } from "@/lib/jobs/types";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/jobs — save a job to the `jobs` table (see supabase/jobs.sql).
 *   { "source": "jobtech", "externalId": "29012345" }
 *   { "source": "manual", "title": "...", "company": "...", "description": "..." }
 * Requires a logged-in user. Returns { job } (201 when created, 200 when it already existed).
 */
export async function POST(request: Request) {
  if (!getSupabaseConfig().configured) {
    return jobError("NOT_CONFIGURED", "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env.local", 503);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jobError("INVALID_INPUT", "Invalid JSON body", 400);
  }
  const body = SaveJobBodySchema.safeParse(json);
  if (!body.success) return invalidInput(body.error);

  // Session-aware client: queries run as this user, so row-level security applies.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jobError("UNAUTHORIZED", "Log in to save jobs.", 401);

  let job: NormalizedJob;
  if (body.data.source === "jobtech") {
    // JobTech ads are shared: reuse the row if someone already saved this ad.
    const existing = await supabase
      .from("jobs")
      .select("*")
      .eq("source", "jobtech")
      .eq("external_id", body.data.externalId)
      .maybeSingle();
    if (existing.error) return jobError("DB_ERROR", existing.error.message, 500);
    if (existing.data) return NextResponse.json({ job: existing.data });

    try {
      job = await createJobTechClient().getAd(body.data.externalId);
    } catch (err) {
      return fromJobTechError(err);
    }
  } else {
    job = manualJob(body.data);
  }

  const { data, error } = await supabase.from("jobs").insert(toJobInsert(job, user.id)).select().single();
  if (error) return jobError("DB_ERROR", error.message, 500);

  return NextResponse.json({ job: data }, { status: 201 });
}
