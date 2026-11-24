import { NextResponse } from "next/server";
import type { z } from "zod";
import { JobTechError } from "./jobtech";

/**
 * Error codes the job routes return. The body keeps the app's existing
 * `{ error: "message" }` shape and adds `code`, so the UI can show
 * `error` as is and branch on `code` (e.g. LOGIN_REQUIRED → show the paste-text tab).
 */
export type JobErrorCode =
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "UNSUPPORTED_SITE"
  | "LOGIN_REQUIRED"
  | "NOT_FOUND"
  | "UPSTREAM_ERROR"
  | "DB_ERROR"
  | "NOT_CONFIGURED";

export function jobError(code: JobErrorCode, message: string, status: number)
{
  return NextResponse.json({ error: message, code }, { status });
}

export function invalidInput(error: z.ZodError)
{
  const details = error.issues
    .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
    .join("; ");

  return jobError("INVALID_INPUT", `Invalid input. ${details}`, 400);
}

/** Maps errors thrown by the JobTech client to responses; rethrows anything unexpected. */
export function fromJobTechError(err: unknown)
{
  if (err instanceof JobTechError)
  {
    const status = err.code === "NOT_FOUND"
      ? 404
      : 502;

    return jobError(err.code, err.message, status);
  }

  throw err;
}
