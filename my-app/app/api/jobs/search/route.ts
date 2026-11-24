import { NextResponse, type NextRequest } from "next/server";
import { fromJobTechError, invalidInput } from "@/lib/jobs/http";
import { createJobTechClient } from "@/lib/jobs/jobtech";
import { JobSearchQuerySchema } from "@/lib/jobs/types";

/**
 * GET /api/jobs/search?q=react&remote=true&offset=0&limit=20
 * Searches Arbetsförmedlingen's JobTech API. Returns { total, items }; nothing is saved.
 */
export async function GET(request: NextRequest)
{
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const query = JobSearchQuerySchema.safeParse(params);

  if (!query.success)
    return invalidInput(query.error);

  try
  {
    const result = await createJobTechClient().search(query.data);

    return NextResponse.json(result);
  }
  catch (err)
  {
    return fromJobTechError(err);
  }
}
