import { describe, it, expect } from "vitest";
import { matchLocator } from "./locator";

describe("matchLocator", () => {
  describe("Step 1: Abbreviated locator terms", () => {
    it('parses " p. 10" as page 10', () => {
      const result = matchLocator(" p. 10");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("page");
      expect(result!.locator.value).toBe("10");
    });

    it('parses " pp. 10-15" as page 10-15', () => {
      const result = matchLocator(" pp. 10-15");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("page");
      expect(result!.locator.value).toBe("10-15");
    });

    it('parses " chap. 3" as chapter 3', () => {
      const result = matchLocator(" chap. 3");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("chapter");
      expect(result!.locator.value).toBe("3");
    });

    it('parses " vol. 2" as volume 2', () => {
      const result = matchLocator(" vol. 2");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("volume");
      expect(result!.locator.value).toBe("2");
    });

    it('parses " sec. 4.1" as section 4.1', () => {
      const result = matchLocator(" sec. 4.1");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("section");
      expect(result!.locator.value).toBe("4.1");
    });
  });

  describe("Step 2: Full-name locator terms", () => {
    it('parses " page 10" as page 10', () => {
      const result = matchLocator(" page 10");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("page");
      expect(result!.locator.value).toBe("10");
    });

    it('parses " chapter 3" as chapter 3', () => {
      const result = matchLocator(" chapter 3");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("chapter");
      expect(result!.locator.value).toBe("3");
    });

    it('parses " section 1" as section 1', () => {
      const result = matchLocator(" section 1");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("section");
      expect(result!.locator.value).toBe("1");
    });
  });

  describe("Step 3: Symbol locator terms", () => {
    it('parses " § 5" as section 5', () => {
      const result = matchLocator(" § 5");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("section");
      expect(result!.locator.value).toBe("5");
    });

    it('parses " ¶ 3" as paragraph 3', () => {
      const result = matchLocator(" ¶ 3");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("paragraph");
      expect(result!.locator.value).toBe("3");
    });
  });

  describe("Step 4: Bare numbers (implicit page)", () => {
    it('parses " 10" as page 10', () => {
      const result = matchLocator(" 10");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("page");
      expect(result!.locator.value).toBe("10");
    });

    it('parses " 10-15" as page 10-15', () => {
      const result = matchLocator(" 10-15");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("page");
      expect(result!.locator.value).toBe("10-15");
    });
  });

  describe("Step 5: No locator (returns null)", () => {
    it('returns null for " and passim"', () => {
      expect(matchLocator(" and passim")).toBeNull();
    });

    it('returns null for " see also"', () => {
      expect(matchLocator(" see also")).toBeNull();
    });

    it('returns null for ""', () => {
      expect(matchLocator("")).toBeNull();
    });
  });

  describe("Step 6: Locator with trailing suffix", () => {
    it('parses " p. 10, and passim" with correct suffixStart', () => {
      const result = matchLocator(" p. 10, and passim");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("page");
      expect(result!.locator.value).toBe("10");
      // suffixStart should point to the comma
      expect(" p. 10, and passim".slice(result!.suffixStart)).toBe(
        ", and passim"
      );
    });

    it('parses " chap. 3, emphasis added" with correct suffixStart', () => {
      const result = matchLocator(" chap. 3, emphasis added");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("chapter");
      expect(result!.locator.value).toBe("3");
      expect(" chap. 3, emphasis added".slice(result!.suffixStart)).toBe(
        ", emphasis added"
      );
    });
  });

  describe("Additional coverage for all locator terms", () => {
    it("parses no. abbreviation", () => {
      const result = matchLocator(" no. 7");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("number");
      expect(result!.locator.value).toBe("7");
    });

    it("parses pt. abbreviation", () => {
      const result = matchLocator(" pt. 2");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("part");
      expect(result!.locator.value).toBe("2");
    });

    it("parses bk. abbreviation", () => {
      const result = matchLocator(" bk. 1");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("book");
      expect(result!.locator.value).toBe("1");
    });

    it("parses fig. abbreviation", () => {
      const result = matchLocator(" fig. 4");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("figure");
      expect(result!.locator.value).toBe("4");
    });

    it("parses l. abbreviation", () => {
      const result = matchLocator(" l. 20");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("line");
      expect(result!.locator.value).toBe("20");
    });

    it("parses n. abbreviation", () => {
      const result = matchLocator(" n. 5");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("note");
      expect(result!.locator.value).toBe("5");
    });

    it("parses col. abbreviation", () => {
      const result = matchLocator(" col. 3");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("column");
      expect(result!.locator.value).toBe("3");
    });

    it("parses para. abbreviation", () => {
      const result = matchLocator(" para. 8");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("paragraph");
      expect(result!.locator.value).toBe("8");
    });

    it("parses v. abbreviation", () => {
      const result = matchLocator(" v. 12");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("verse");
      expect(result!.locator.value).toBe("12");
    });

    it("parses fol. abbreviation", () => {
      const result = matchLocator(" fol. 6");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("folio");
      expect(result!.locator.value).toBe("6");
    });

    it("parses op. abbreviation", () => {
      const result = matchLocator(" op. 9");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("opus");
      expect(result!.locator.value).toBe("9");
    });

    it("parses s.v. abbreviation", () => {
      const result = matchLocator(" s.v. test");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("sub verbo");
      expect(result!.locator.value).toBe("test");
    });

    it("parses §§ symbol", () => {
      const result = matchLocator(" §§ 5-10");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("section");
      expect(result!.locator.value).toBe("5-10");
    });

    it("parses ¶¶ symbol", () => {
      const result = matchLocator(" ¶¶ 1-3");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("paragraph");
      expect(result!.locator.value).toBe("1-3");
    });

    it("parses plural full names", () => {
      const result = matchLocator(" pages 10-20");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("page");
      expect(result!.locator.value).toBe("10-20");
    });

    it("parses sub verbo full name", () => {
      const result = matchLocator(" sub verbo test");
      expect(result).not.toBeNull();
      expect(result!.locator.label).toBe("sub verbo");
      expect(result!.locator.value).toBe("test");
    });
  });
});
