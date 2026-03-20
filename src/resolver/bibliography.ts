import { Cite } from "@citation-js/core";
import "@citation-js/plugin-bibtex";
import type { CslReference } from "../metadata/yaml-extractor";

export interface BibliographyData {
  cite: Cite;
  ids: string[];
}

export interface LoadOptions {
  bibliographyPaths: string[];
  inlineReferences: CslReference[];
  readFile: (path: string) => string | Promise<string>;
}

export async function loadBibliography(
  options: LoadOptions,
): Promise<BibliographyData> {
  const cite = new Cite();

  for (const filePath of options.bibliographyPaths) {
    const content = await options.readFile(filePath);
    cite.add(content);
  }

  return { cite, ids: cite.getIds() };
}
