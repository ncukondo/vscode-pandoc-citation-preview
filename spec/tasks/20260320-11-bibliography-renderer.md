# Task: Bibliography Renderer

## Purpose

Generate a formatted bibliography (reference list) as HTML from the loaded bibliography data, using citation-js with a CSL style. Supports `nocite` to include uncited entries.

## References

- ADR: `spec/decisions/ADR-001-citation-js-for-rendering.md`
- Depends on: `src/resolver/bibliography.ts` (Phase 8)
- Source: `src/renderer/bibliography-renderer.ts`

## TDD Workflow

Each step follows Red-Green-Refactor.

## API Design

```typescript
interface BibliographyRenderOptions {
  bibliographyData: BibliographyData;
  citedIds: string[];            // ids actually cited in the document
  nocite: string[];              // from metadata: specific ids or ["*"]
  cslStyle: string | null;       // CSL XML string, or null for default
}

function renderBibliography(options: BibliographyRenderOptions): string;  // HTML
```

## Steps

### Step 1: Bibliography from cited entries

- [x] Write test: 2 cited ids → HTML bibliography with 2 entries
- [x] Write test: 0 cited ids, no nocite → empty string
- [x] Create stub (verify Red)
- [x] Implement (verify Green)
- [x] Lint & type check

### Step 2: nocite with specific ids

- [x] Write test: 1 cited + 1 nocite → bibliography with 2 entries
- [x] Write test: nocite id that doesn't exist in bibliography → ignored
- [x] Create stub (verify Red)
- [x] Implement (verify Green)
- [x] Lint & type check

### Step 3: nocite wildcard (@*)

- [x] Write test: `nocite: ["*"]` → all entries in bibliography included
- [x] Create stub (verify Red)
- [x] Implement (verify Green)
- [x] Lint & type check

### Step 4: Custom CSL style

- [x] Write test: different CSL style → output format changes
- [x] Write test: null CSL → Chicago author-date default
- [x] Create stub (verify Red)
- [x] Implement (verify Green)
- [x] Lint & type check

### Step 5: HTML output structure

- [x] Write test: output is wrapped in a container div with appropriate class
- [x] Write test: entries are ordered according to CSL style rules
- [x] Create stub (verify Red)
- [x] Implement (verify Green)
- [x] Lint & type check

## Completion Checklist

- [x] All tests pass
- [x] Lint passes
- [x] Type check passes
- [x] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
