import { describe, it, expect } from "vitest";
import { parseBracketCitation } from "./bracket-citation";

describe("parseBracketCitation", () => {
  // Step 1: Single citation in brackets
  describe("single citation in brackets", () => {
    it('parses "[@smith2020]" at pos 0 → 1 citation', () => {
      const result = parseBracketCitation("[@smith2020]", 0);
      expect(result).not.toBeNull();
      expect(result!.type).toBe("bracket");
      expect(result!.citations).toHaveLength(1);
      expect(result!.citations[0].id).toBe("smith2020");
      expect(result!.raw).toBe("[@smith2020]");
      expect(result!.startPos).toBe(0);
      expect(result!.endPos).toBe(12);
    });

    it('parses "text [@smith2020] more" at pos 5 → correct positions', () => {
      const result = parseBracketCitation("text [@smith2020] more", 5);
      expect(result).not.toBeNull();
      expect(result!.citations).toHaveLength(1);
      expect(result!.citations[0].id).toBe("smith2020");
      expect(result!.startPos).toBe(5);
      expect(result!.endPos).toBe(17);
      expect(result!.raw).toBe("[@smith2020]");
    });

    it('returns null for "[no citation]" at pos 0 (no @)', () => {
      expect(parseBracketCitation("[no citation]", 0)).toBeNull();
    });

    it("returns null when not starting with [", () => {
      expect(parseBracketCitation("@smith2020", 0)).toBeNull();
      expect(parseBracketCitation("text", 0)).toBeNull();
    });
  });
});
