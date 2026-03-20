import { describe, it, expect } from "vitest";
import { resolvePath } from "./file-resolver";
import type { ResolveContext } from "./file-resolver";

// Helper to create a context with a set of existing files
function makeContext(
  existingFiles: string[],
  overrides: Partial<ResolveContext> = {},
): ResolveContext {
  return {
    mdFileDir: "/project/docs",
    searchDirectories: [],
    workspaceRoot: "/workspace",
    exists: (p: string) => existingFiles.includes(p),
    ...overrides,
  };
}

describe("resolvePath", () => {
  // ─── Step 1: Absolute paths ──────────────────────────────────────────

  describe("Step 1: Absolute paths", () => {
    it("returns absolute path as-is when file exists", () => {
      const ctx = makeContext(["/absolute/path/refs.bib"]);
      expect(resolvePath("/absolute/path/refs.bib", ctx)).toBe(
        "/absolute/path/refs.bib",
      );
    });

    it("returns null for absolute path that does not exist", () => {
      const ctx = makeContext([]);
      expect(resolvePath("/absolute/path/refs.bib", ctx)).toBeNull();
    });
  });

  // ─── Step 2: Relative path from markdown file directory ────────────────

  describe("Step 2: Relative path from markdown file directory", () => {
    it("resolves simple relative path from mdFileDir", () => {
      const ctx = makeContext(["/project/docs/refs.bib"], {
        mdFileDir: "/project/docs",
      });
      expect(resolvePath("refs.bib", ctx)).toBe("/project/docs/refs.bib");
    });

    it("resolves ../ relative path from mdFileDir", () => {
      const ctx = makeContext(["/project/bib/refs.bib"], {
        mdFileDir: "/project/docs",
      });
      expect(resolvePath("../bib/refs.bib", ctx)).toBe(
        "/project/bib/refs.bib",
      );
    });
  });
});
