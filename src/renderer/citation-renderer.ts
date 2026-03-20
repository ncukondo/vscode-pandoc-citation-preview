import "@citation-js/plugin-csl";
import type { BibliographyData } from "../resolver/bibliography";

export interface CitationRenderOptions {
  bibliographyData: BibliographyData;
  cslStyle: string | null;
}

export interface CitationRenderItem {
  id: string;
  locator?: { label: string; value: string };
  prefix?: string;
  suffix?: string;
  suppressAuthor?: boolean;
}

interface CiteproceItem {
  id: string;
  locator?: string;
  label?: string;
  prefix?: string;
  suffix?: string;
  "suppress-author"?: boolean;
}

function toCiteprocEntry(item: CitationRenderItem): CiteproceItem {
  const entry: CiteproceItem = { id: item.id };
  if (item.locator) {
    entry.locator = item.locator.value;
    entry.label = item.locator.label;
  }
  if (item.prefix) entry.prefix = item.prefix;
  if (item.suffix) entry.suffix = item.suffix;
  if (item.suppressAuthor) entry["suppress-author"] = true;
  return entry;
}

export function renderCitation(
  items: CitationRenderItem[],
  options: CitationRenderOptions,
): string {
  const { bibliographyData } = options;
  const knownIds = new Set(bibliographyData.ids);
  const unknownItems = items.filter((item) => !knownIds.has(item.id));

  if (unknownItems.length === items.length) {
    return `[?${items.map((i) => i.id).join("; ")}]`;
  }

  const validItems = items.filter((item) => knownIds.has(item.id));
  const entry = validItems.map(toCiteprocEntry);

  try {
    const result = bibliographyData.cite.format("citation", {
      entry,
      template: "apa",
    }) as string;

    if (unknownItems.length > 0) {
      const unknownPart = unknownItems.map((i) => `?${i.id}`).join("; ");
      return `${result} [${unknownPart}]`;
    }

    return result;
  } catch {
    return `[?${items.map((i) => i.id).join("; ")}]`;
  }
}
