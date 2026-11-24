import { describe, expect, it, vi } from "vitest";
import sampleAd from "./__fixtures__/jobtech-ad.json";
import {
  createJobTechClient,
  JobTechAdSchema,
  JobTechError,
  mapJobTechAd,
  parsePlatsbankenId,
} from "./jobtech";
import { JobSearchQuerySchema, NormalizedJobSchema } from "./types";

/** A fake fetch that records the request and returns the given JSON body and status. */
function fakeFetch(body: unknown, status = 200)
{
  return vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }),
  ) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

describe("mapJobTechAd", () => {
  const job = mapJobTechAd(JobTechAdSchema.parse(sampleAd));

  it("produces a valid NormalizedJob", () => {
    expect(NormalizedJobSchema.safeParse(job).success).toBe(true);
  });

  it("maps the main fields", () => {
    expect(job).toMatchObject({
      source: "jobtech",
      externalId: "29012345",
      title: "Backend-utvecklare C# / .NET",
      company: "Exempel AB",
      location: "Göteborg",
      applyUrl: "https://exempel.se/jobb/123",
      salaryText: "Fast månadslön",
      postedAt: "2026-11-18T09:30:00",
      deadlineAt: "2026-12-15T23:59:59",
      remote: null,
    });
  });

  it("prefers plain text description and cleans it", () => {
    expect(job.description).toBe("Vi söker en utvecklare.\n\nDu har erfarenhet av C# & .NET.");
  });

  it("merges must-have and nice-to-have skills without duplicates", () => {
    expect(job.skills).toEqual(["C#", ".NET", "PostgreSQL"]);
  });

  it("copes with an ad that has almost nothing", () => {
    const bare = mapJobTechAd(JobTechAdSchema.parse({ id: 1 }));
    expect(bare.externalId).toBe("1");
    expect(bare.title).toBe("Untitled job");
    expect(bare.sourceUrl).toBe("https://arbetsformedlingen.se/platsbanken/annonser/1");
    expect(bare.skills).toEqual([]);
    expect(NormalizedJobSchema.safeParse(bare).success).toBe(true);
  });

  it("drops non-http URLs", () => {
    const ad = JobTechAdSchema.parse({ id: "2", application_details: { url: "javascript:alert(1)" } });
    expect(mapJobTechAd(ad).applyUrl).toBeNull();
  });
});

describe("parsePlatsbankenId", () => {
  it.each([
    ["https://arbetsformedlingen.se/platsbanken/annonser/29012345", "29012345"],
    ["https://www.arbetsformedlingen.se/platsbanken/annonser/29012345/", "29012345"],
    ["  https://arbetsformedlingen.se/platsbanken/annonser/29012345?utm=x#top ", "29012345"],
  ])("reads the id from %s", (url, id) => {
    expect(parsePlatsbankenId(url)).toBe(id);
  });

  it.each([
    "not a url",
    "https://www.linkedin.com/jobs/view/123",
    "https://evil.example/platsbanken/annonser/123",
    "https://arbetsformedlingen.se.evil.example/platsbanken/annonser/123",
    "https://arbetsformedlingen.se/platsbanken/annonser/abc",
    "https://arbetsformedlingen.se/platsbanken",
  ])("returns null for %s", (url) => {
    expect(parsePlatsbankenId(url)).toBeNull();
  });
});

describe("JobSearchQuerySchema", () => {
  it("applies defaults and parses remote=false as false", () => {
    const q = JobSearchQuerySchema.parse({ q: " react ", remote: "false" });
    expect(q).toEqual({ q: "react", remote: false, offset: 0, limit: 20 });
  });

  it("rejects a limit above 50", () => {
    expect(JobSearchQuerySchema.safeParse({ q: "x", limit: "500" }).success).toBe(false);
  });
});

describe("createJobTechClient", () => {
  it("search sends the query and maps hits, skipping malformed ones", async () => {
    const fetch = fakeFetch({ total: { value: 42 }, hits: [sampleAd, { headline: "no id" }] });
    const client = createJobTechClient({ fetch, apiKey: "" });

    const result = await client.search(JobSearchQuerySchema.parse({ q: "c#", remote: "true", limit: "5" }));

    const url = new URL(fetch.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/search");
    expect(Object.fromEntries(url.searchParams)).toEqual({ q: "c#", offset: "0", limit: "5", remote: "true" });
    expect(result.total).toBe(42);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.externalId).toBe("29012345");
  });

  it("sends the api-key header only when a key is set", async () => {
    const fetch = fakeFetch(sampleAd);
    await createJobTechClient({ fetch, apiKey: "secret" }).getAd("29012345");
    const init = fetch.mock.calls[0]![1] as RequestInit;
    expect((init.headers as Record<string, string>)["api-key"]).toBe("secret");
  });

  it("getAd maps a 404 to NOT_FOUND", async () => {
    const client = createJobTechClient({ fetch: fakeFetch({}, 404), apiKey: "" });
    await expect(client.getAd("1")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("getAd maps a 500 to UPSTREAM_ERROR", async () => {
    const client = createJobTechClient({ fetch: fakeFetch({}, 500), apiKey: "" });
    await expect(client.getAd("1")).rejects.toMatchObject({ code: "UPSTREAM_ERROR", status: 500 });
  });

  it("getAd rejects a non-numeric id without calling the API", async () => {
    const fetch = fakeFetch(sampleAd);
    const client = createJobTechClient({ fetch, apiKey: "" });
    await expect(client.getAd("../search")).rejects.toBeInstanceOf(JobTechError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("turns a network failure into UPSTREAM_ERROR", async () => {
    const fetch = vi.fn(async () =>
    {
      throw new TypeError("fetch failed");
    }) as unknown as typeof globalThis.fetch;
    const client = createJobTechClient({ fetch, apiKey: "" });
    await expect(client.getAd("1")).rejects.toMatchObject({ code: "UPSTREAM_ERROR" });
  });
});
