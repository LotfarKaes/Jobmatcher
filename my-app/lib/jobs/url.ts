import { parsePlatsbankenId } from "./jobtech";

/** Sites that need a login and forbid scraping. We ask the user to paste the text instead. */
const LOGIN_SITES: Record<string, string> = {
  "linkedin.com": "LinkedIn",
  "indeed.com": "Indeed",
  "se.indeed.com": "Indeed",
  "indeed.se": "Indeed",
  "glassdoor.com": "Glassdoor",
  "glassdoor.se": "Glassdoor",
};

export type JobUrlKind =
  | { kind: "platsbanken"; adId: string }
  | { kind: "login_required"; site: string }
  | { kind: "unsupported" }
  | { kind: "invalid" };

/** Decides how a pasted job link can be imported. Pure function, no I/O. */
export function classifyJobUrl(raw: string): JobUrlKind
{
  let url: URL;

  try
  {
    url = new URL(raw.trim());
  }
  catch
  {
    return { kind: "invalid" };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:")
    return { kind: "invalid" };

  const adId = parsePlatsbankenId(url.toString());

  if (adId)
    return { kind: "platsbanken", adId };

  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  for (const [domain, site] of Object.entries(LOGIN_SITES))
  {
    if (host === domain || host.endsWith(`.${domain}`))
      return { kind: "login_required", site };
  }

  return { kind: "unsupported" };
}
