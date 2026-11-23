import { describe, expect, it } from "vitest";
import { cleanText } from "./clean";

describe("cleanText", () => {
  it("returns an empty string for null, undefined and empty input", () => {
    expect(cleanText(null)).toBe("");
    expect(cleanText(undefined)).toBe("");
    expect(cleanText("")).toBe("");
  });

  it("turns block tags into line breaks and drops other tags", () => {
    expect(cleanText("<p>Hello <b>world</b></p><p>Second</p>")).toBe("Hello world\nSecond");
  });

  it("turns list items into dashes", () => {
    expect(cleanText("<ul><li>C#</li><li>SQL</li></ul>")).toBe("- C#\n- SQL");
  });

  it("removes script and style blocks entirely", () => {
    expect(cleanText("<style>p{}</style>Text<script>alert(1)</script>")).toBe("Text");
  });

  it("decodes named and numeric entities", () => {
    expect(cleanText("C# &amp; .NET &lt;3 &#229;&#xE4;")).toBe("C# & .NET <3 åä");
  });

  it("collapses whitespace and keeps at most one blank line", () => {
    expect(cleanText("  a \t b\r\n\r\n\r\n\r\nc  ")).toBe("a b\n\nc");
  });

  it("caps the length", () => {
    expect(cleanText("abcdef", 3)).toBe("abc");
  });
});
