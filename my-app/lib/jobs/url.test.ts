import { describe, expect, it } from "vitest";
import { classifyJobUrl } from "./url";

describe("classifyJobUrl", () => {
  it("recognises Platsbanken ads", () => {
    expect(classifyJobUrl("https://arbetsformedlingen.se/platsbanken/annonser/29012345")).toEqual({
      kind: "platsbanken",
      adId: "29012345",
    });
  });

  it.each([
    ["https://www.linkedin.com/jobs/view/123", "LinkedIn"],
    ["https://se.linkedin.com/jobs/view/123", "LinkedIn"],
    ["https://se.indeed.com/viewjob?jk=abc", "Indeed"],
    ["https://www.glassdoor.com/job-listing/x", "Glassdoor"],
  ])("flags %s as login required", (url, site) => {
    expect(classifyJobUrl(url)).toEqual({ kind: "login_required", site });
  });

  it("does not match look-alike domains", () => {
    expect(classifyJobUrl("https://notlinkedin.com/jobs/1")).toEqual({ kind: "unsupported" });
  });

  it("treats other sites as unsupported", () => {
    expect(classifyJobUrl("https://careers.example.se/jobs/1")).toEqual({ kind: "unsupported" });
  });

  it.each(["not a url", "ftp://arbetsformedlingen.se/x", "javascript:alert(1)"])("rejects %s", (url) => {
    expect(classifyJobUrl(url)).toEqual({ kind: "invalid" });
  });
});
