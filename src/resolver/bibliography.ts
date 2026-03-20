import { Cite } from "@citation-js/core";
import "@citation-js/plugin-bibtex";
import { parse as parseYaml } from "yaml";
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

function isYamlFile(filePath: string): boolean {
  return /\.ya?ml$/i.test(filePath);
}

export async function loadBibliography(
  options: LoadOptions,
): Promise<BibliographyData> {
  const cite = new Cite();

  for (const filePath of options.bibliographyPaths) {
    const content = await options.readFile(filePath);
    if (isYamlFile(filePath)) {
      const data = parseYaml(content);
      cite.add(data);
    } else {
      cite.add(content);
    }
  }

  return { cite, ids: cite.getIds() };
}
