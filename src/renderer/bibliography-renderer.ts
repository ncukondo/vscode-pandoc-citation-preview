import "@citation-js/plugin-csl";
import { Cite } from "@citation-js/core";
import type { BibliographyData } from "../resolver/bibliography";

const DEFAULT_TEMPLATE = "apa";
const CUSTOM_TEMPLATE_KEY = "__pandoc-citation-preview-bib-custom__";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { plugins } = require("@citation-js/core") as {
  plugins: {
    config: { get(name: string): { templates: { add(name: string, xml: string): void } } };
  };
};
const cslConfig = plugins.config.get("@csl");

export interface BibliographyRenderOptions {
  bibliographyData: BibliographyData;
  citedIds: string[];
  nocite: string[];
  cslStyle: string | null;
}

export function renderBibliography(options: BibliographyRenderOptions): string {
  const { bibliographyData, citedIds, nocite, cslStyle } = options;
  const knownIds = new Set(bibliographyData.ids);

  // Collect all ids that should appear in the bibliography
  const idsToInclude = new Set<string>();

  // Add cited ids that exist in the bibliography
  for (const id of citedIds) {
    if (knownIds.has(id)) {
      idsToInclude.add(id);
    }
  }

  // Handle nocite
  if (nocite.includes("*")) {
    for (const id of bibliographyData.ids) {
      idsToInclude.add(id);
    }
  } else {
    for (const id of nocite) {
      if (knownIds.has(id)) {
        idsToInclude.add(id);
      }
    }
  }

  if (idsToInclude.size === 0) {
    return "";
  }

  // Build a Cite instance with only the entries to include
  const allData = bibliographyData.cite.data;
  const selectedData = allData.filter((entry: { id: string }) => idsToInclude.has(entry.id));
  const selectedCite = new Cite(selectedData);

  let template = DEFAULT_TEMPLATE;
  if (cslStyle) {
    cslConfig.templates.add(CUSTOM_TEMPLATE_KEY, cslStyle);
    template = CUSTOM_TEMPLATE_KEY;
  }

  try {
    const html = selectedCite.format("bibliography", {
      format: "html",
      template,
    }) as string;

    return html;
  } catch {
    return "";
  }
}
