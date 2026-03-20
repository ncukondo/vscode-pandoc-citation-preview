import type { SingleCitation } from "./single-citation";
import { parseSingleCitation } from "./single-citation";

export interface BracketCitation {
  type: "bracket";
  citations: SingleCitation[];
  raw: string;
  startPos: number;
  endPos: number;
}

/**
 * Parse a bracketed Pandoc citation at the given position.
 * Expects `[...]` containing one or more semicolon-separated citation entries.
 *
 * @param src - Full source text
 * @param pos - Position where `[` is expected
 * @returns Parsed bracket citation or null
 */
export function parseBracketCitation(
  src: string,
  pos: number,
): BracketCitation | null {
  if (src[pos] !== "[") return null;

  // Find the closing bracket (supports nested brackets via depth tracking)
  const closeIdx = findClosingBracket(src, pos);
  if (closeIdx === -1) return null;

  const inner = src.slice(pos + 1, closeIdx);

  // Must contain at least one @
  if (!inner.includes("@")) return null;

  // Split on semicolons to get individual citation entries
  const parts = inner.split(";");
  const citations: SingleCitation[] = [];

  for (const part of parts) {
    const citation = parseSingleCitation(part);
    if (citation) {
      citations.push(citation);
    }
  }

  if (citations.length === 0) return null;

  const endPos = closeIdx + 1;
  return {
    type: "bracket",
    citations,
    raw: src.slice(pos, endPos),
    startPos: pos,
    endPos,
  };
}

function findClosingBracket(src: string, openPos: number): number {
  let depth = 0;
  for (let i = openPos; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
