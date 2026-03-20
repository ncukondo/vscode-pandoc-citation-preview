import { describe, it, expect } from "vitest";
import { loadBibliography } from "./bibliography";

describe("loadBibliography", () => {
  describe("Step 1: Load BibTeX (.bib) file", () => {
    it("parses a simple .bib string with one entry and extracts correct id", async () => {
      const bibContent = `@article{smith2020,
  author = {Smith, John},
  title = {A Test Article},
  journal = {Test Journal},
  year = {2020}
}`;
      const result = await loadBibliography({
        bibliographyPaths: ["/path/to/refs.bib"],
        inlineReferences: [],
        readFile: async () => bibContent,
      });

      expect(result.ids).toContain("smith2020");
      expect(result.ids).toHaveLength(1);
    });

    it("parses .bib with multiple entries and all ids are available", async () => {
      const bibContent = `@article{smith2020,
  author = {Smith, John},
  title = {Article One},
  journal = {J1},
  year = {2020}
}

@book{jones2021,
  author = {Jones, Alice},
  title = {A Book},
  publisher = {Press},
  year = {2021}
}`;
      const result = await loadBibliography({
        bibliographyPaths: ["/path/to/refs.bib"],
        inlineReferences: [],
        readFile: async () => bibContent,
      });

      expect(result.ids).toContain("smith2020");
      expect(result.ids).toContain("jones2021");
      expect(result.ids).toHaveLength(2);
    });
  });
});
