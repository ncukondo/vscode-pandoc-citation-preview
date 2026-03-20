import { describe, it, expect } from "vitest";
import { Cite } from "@citation-js/core";
import "@citation-js/plugin-bibtex";
import "@citation-js/plugin-csl";
import { renderCitation } from "./citation-renderer";
import type {
  CitationRenderItem,
  CitationRenderOptions,
} from "./citation-renderer";

function makeBibData(
  entries: Array<{
    id: string;
    family: string;
    given: string;
    year: number;
    type?: string;
    title?: string;
  }>,
) {
  const cite = new Cite(
    entries.map((e) => ({
      id: e.id,
      type: e.type ?? "article-journal",
      author: [{ family: e.family, given: e.given }],
      title: e.title ?? "Test",
      issued: { "date-parts": [[e.year]] },
    })),
  );
  return { cite, ids: cite.getIds() };
}

const defaultBib = () =>
  makeBibData([
    { id: "smith2020", family: "Smith", given: "John", year: 2020 },
    { id: "doe2019", family: "Doe", given: "Jane", year: 2019 },
  ]);

const defaultOptions = (): CitationRenderOptions => ({
  bibliographyData: defaultBib(),
  cslStyle: null,
});

describe("renderCitation", () => {
  describe("Step 1: Basic single citation", () => {
    it("renders a known citation id", () => {
      const result = renderCitation(
        [{ id: "smith2020" }],
        defaultOptions(),
      );
      expect(result).toBe("(Smith, 2020)");
    });

    it("renders placeholder for unknown id", () => {
      const result = renderCitation(
        [{ id: "unknown_id" }],
        defaultOptions(),
      );
      expect(result).toContain("unknown_id");
    });
  });
});
