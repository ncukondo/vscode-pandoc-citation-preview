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

- [ ] Write test: 2 cited ids → HTML bibliography with 2 entries
- [ ] Write test: 0 cited ids, no nocite → empty string
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 2: nocite with specific ids

- [ ] Write test: 1 cited + 1 nocite → bibliography with 2 entries
- [ ] Write test: nocite id that doesn't exist in bibliography → ignored
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 3: nocite wildcard (@*)

- [ ] Write test: `nocite: ["*"]` → all entries in bibliography included
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 4: Custom CSL style

- [ ] Write test: different CSL style → output format changes
- [ ] Write test: null CSL → Chicago author-date default
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 5: HTML output structure

- [ ] Write test: output is wrapped in a container div with appropriate class
- [ ] Write test: entries are ordered according to CSL style rules
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

## Completion Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
