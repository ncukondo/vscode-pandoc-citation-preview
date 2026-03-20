# Task: Citation Renderer

## Purpose

Format parsed citations into display text using citation-js and a CSL style. Converts structured citation data into in-text citation strings (e.g., "(Smith, 2020, p. 10)").

## References

- ADR: `spec/decisions/ADR-001-citation-js-for-rendering.md`
- Depends on: `src/resolver/bibliography.ts` (Phase 8)
- Source: `src/renderer/citation-renderer.ts`

## TDD Workflow

Each step follows Red-Green-Refactor.

## API Design

```typescript
interface CitationRenderOptions {
  bibliographyData: BibliographyData;
  cslStyle: string | null;       // CSL XML string, or null for default
}

interface CitationRenderItem {
  id: string;
  locator?: { label: string; value: string };
  prefix?: string;
  suffix?: string;
  suppressAuthor?: boolean;
}

// Render a group of citations (e.g., one bracketed citation with multiple entries)
function renderCitation(
  items: CitationRenderItem[],
  options: CitationRenderOptions
): string;
```

## Steps

### Step 1: Basic single citation

- [ ] Write test: `[{ id: "smith2020" }]` → renders as "(Smith, 2020)" or similar depending on style
- [ ] Write test: unknown id → renders with placeholder/warning
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 2: Citation with locator

- [ ] Write test: `[{ id: "smith2020", locator: { label: "page", value: "10" } }]` → "(Smith, 2020, p. 10)"
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 3: Suppress author

- [ ] Write test: `[{ id: "smith2020", suppressAuthor: true }]` → "(2020)"
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 4: Prefix and suffix

- [ ] Write test: `[{ id: "smith2020", prefix: "see " }]` → "(see Smith, 2020)"
- [ ] Write test: `[{ id: "smith2020", suffix: ", emphasis added" }]` → "(Smith, 2020, emphasis added)"
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 5: Multiple citations in one group

- [ ] Write test: `[{ id: "smith2020" }, { id: "doe2019" }]` → "(Doe, 2019; Smith, 2020)" (sorted by style)
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 6: Custom CSL style

- [ ] Write test: provide a CSL XML string (e.g., Vancouver/numeric style) → output changes accordingly
- [ ] Write test: `null` CSL → Chicago author-date default
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

## Completion Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
