/**
 * Locator term matcher for Pandoc citation syntax.
 *
 * Identifies CSL locator terms (page, chapter, etc.) from text following
 * a comma in a citation. Separates the locator from suffix text.
 */

export type Locator = { label: string; value: string };
export type LocatorResult = { locator: Locator; suffixStart: number } | null;

/**
 * Locator term definitions mapping CSL labels to their match terms.
 * Order matters: longer/more specific terms must come before shorter ones
 * to ensure correct matching (e.g., "sub verbo" before "v.").
 */
const LOCATOR_TERMS: ReadonlyArray<{ label: string; terms: string[] }> = [
  { label: "sub verbo", terms: ["sub verbo", "sub verbis", "s.vv.", "s.v."] },
  { label: "paragraph", terms: ["paragraph", "paragraphs", "paras.", "para.", "¶¶", "¶"] },
  { label: "section", terms: ["section", "sections", "secs.", "sec.", "§§", "§"] },
  { label: "chapter", terms: ["chapter", "chapters", "chaps.", "chap."] },
  { label: "volume", terms: ["volume", "volumes", "vols.", "vol."] },
  { label: "number", terms: ["number", "numbers", "nos.", "no."] },
  { label: "figure", terms: ["figure", "figures", "figs.", "fig."] },
  { label: "column", terms: ["column", "columns", "cols.", "col."] },
  { label: "folio", terms: ["folio", "folios", "fols.", "fol."] },
  { label: "page", terms: ["pages", "page", "pp.", "p."] },
  { label: "part", terms: ["part", "parts", "pts.", "pt."] },
  { label: "book", terms: ["book", "books", "bks.", "bk."] },
  { label: "line", terms: ["line", "lines", "ll.", "l."] },
  { label: "note", terms: ["note", "notes", "nn.", "n."] },
  { label: "verse", terms: ["verse", "verses", "vv.", "v."] },
  { label: "opus", terms: ["opus", "opera", "opp.", "op."] },
];

/**
 * Parse locator from text that follows the comma after a citation key.
 *
 * @param text - Text after the comma in a citation (e.g., " p. 10, and passim")
 * @returns Parsed locator with suffixStart position, or null if no locator found
 *
 * @example
 * matchLocator(" p. 10, and passim")
 * // => { locator: { label: "page", value: "10" }, suffixStart: 6 }
 */
export function matchLocator(text: string): LocatorResult {
  if (text.length === 0) {
    return null;
  }

  // Strip leading whitespace for matching, but track the offset
  const trimmed = text.replace(/^\s*/, "");
  const leadingSpaces = text.length - trimmed.length;

  if (trimmed.length === 0) {
    return null;
  }

  // Try to match a locator term
  for (const { label, terms } of LOCATOR_TERMS) {
    for (const term of terms) {
      if (startsWithTerm(trimmed, term)) {
        const afterTerm = trimmed.slice(term.length);
        // After the term, expect optional whitespace then a value
        const valueMatch = afterTerm.match(/^\s*(.*)/);
        if (valueMatch) {
          const valueAndSuffix = valueMatch[1];
          const { value, suffixOffset } = extractValue(valueAndSuffix);
          if (value.length > 0) {
            const termEndPos = leadingSpaces + term.length;
            const valueStartInAfterTerm = afterTerm.length - valueAndSuffix.length;
            const suffixStart = termEndPos + valueStartInAfterTerm + suffixOffset;
            return {
              locator: { label, value },
              suffixStart,
            };
          }
        }
      }
    }
  }

  // Try bare number (implicit page locator)
  const bareNumberMatch = trimmed.match(/^(\d[\d\-.]*)/);
  if (bareNumberMatch) {
    const value = bareNumberMatch[1].replace(/[-.]$/, ""); // trim trailing punctuation
    const suffixStart = leadingSpaces + value.length;
    if (value.length > 0) {
      return {
        locator: { label: "page", value },
        suffixStart,
      };
    }
  }

  return null;
}

/**
 * Check if text starts with the given term (case-insensitive for alphabetic terms).
 */
function startsWithTerm(text: string, term: string): boolean {
  if (text.length < term.length) {
    return false;
  }
  const candidate = text.slice(0, term.length);
  // For symbol terms (§, ¶), use exact match; for others, case-insensitive
  if (/^[a-zA-Z]/.test(term)) {
    return candidate.toLowerCase() === term.toLowerCase();
  }
  return candidate === term;
}

/**
 * Extract the locator value from the remaining text after the term.
 * The value ends at the next comma or end of string.
 * Returns the value and the offset where the suffix begins.
 */
function extractValue(text: string): { value: string; suffixOffset: number } {
  // Find the next comma that indicates suffix start
  const commaIndex = text.indexOf(",");
  const rawValue = commaIndex === -1 ? text : text.slice(0, commaIndex);
  const trimmedValue = rawValue.trimEnd();

  return {
    value: trimmedValue,
    suffixOffset: commaIndex === -1 ? text.length : commaIndex,
  };
}
