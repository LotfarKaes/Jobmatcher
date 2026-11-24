/** Longest description we store. Keeps CARD-04's AI prompts affordable. */
export const MAX_DESCRIPTION_LENGTH = 20_000;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string
{
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) =>
  {
    if (code[0] === "#")
    {
      const n = code[1]?.toLowerCase() === "x"
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);

      return Number.isFinite(n) && n > 0 && n <= 0x10ffff
        ? String.fromCodePoint(n)
        : match;
    }

    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/**
 * Turns HTML or messy plain text into clean plain text:
 * block tags become line breaks, other tags are dropped, entities are decoded,
 * whitespace is collapsed (keeping at most one blank line), and the result is
 * capped at `maxLength` characters.
 */
export function cleanText(input: string | null | undefined, maxLength = MAX_DESCRIPTION_LENGTH): string
{
  if (!input)
    return "";

  let text = input
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|ul|ol|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  text = decodeEntities(text)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text.length > maxLength
    ? text.slice(0, maxLength).trimEnd()
    : text;
}
