import { NextResponse } from "next/server";
import { z } from "zod";
import { fromJobTechError, invalidInput, jobError } from "@/lib/jobs/http";
import { createJobTechClient } from "@/lib/jobs/jobtech";
import { classifyJobUrl } from "@/lib/jobs/url";

const ImportBodySchema = z.object({ url: z.string().trim().min(1).max(2000) });

/**
 * POST /api/jobs/import   body: { "url": "https://arbetsformedlingen.se/platsbanken/annonser/123" }
 * Returns { job } as a preview (not saved). Only Platsbanken links are supported;
 * other sites get an error telling the user to paste the job text instead.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jobError("INVALID_INPUT", "Invalid JSON body", 400);
  }
  const body = ImportBodySchema.safeParse(json);
  if (!body.success) return invalidInput(body.error);

  const target = classifyJobUrl(body.data.url);
  switch (target.kind) {
    case "invalid":
      return jobError("INVALID_INPUT", "That doesn't look like a valid web link.", 400);
    case "login_required":
      return jobError(
        "LOGIN_REQUIRED",
        `${target.site} requires a login, so we can't read the job from the link. Copy the job text and paste it instead.`,
        422,
      );
    case "unsupported":
      return jobError(
        "UNSUPPORTED_SITE",
        "We can only import links from Platsbanken (Arbetsförmedlingen) for now. Copy the job text and paste it instead.",
        422,
      );
    case "platsbanken":
      try {
        const job = await createJobTechClient().getAd(target.adId);
        return NextResponse.json({ job });
      } catch (err) {
        return fromJobTechError(err);
      }
  }
}
