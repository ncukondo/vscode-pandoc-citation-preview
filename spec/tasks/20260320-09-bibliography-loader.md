# Task: Bibliography Loader

## Purpose

Load and parse bibliography data from files (BibTeX, CSL JSON, CSL YAML) and inline references using citation-js. Merge all sources into a unified citation database.

## References

- ADR: `spec/decisions/ADR-001-citation-js-for-rendering.md`
- Depends on: `src/resolver/file-resolver.ts` (Phase 7)
- Source: `src/resolver/bibliography.ts`

## TDD Workflow

Each step follows Red-Green-Refactor.

## API Design

```typescript
interface BibliographyData {
  cite: Cite;                    // citation-js Cite instance
  ids: string[];                 // available citation keys
}

interface LoadOptions {
  bibliographyPaths: string[];   // resolved absolute paths
  inlineReferences: CslReference[];  // from YAML metadata
  readFile: (path: string) => string | Promise<string>;  // injectable file reader
}

function loadBibliography(options: LoadOptions): BibliographyData;
```

## Steps

### Step 1: Load BibTeX (.bib) file

- [ ] Write test: parse a simple .bib string with one entry → correct id extracted
- [ ] Write test: parse .bib with multiple entries → all ids available
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 2: Load CSL JSON (.json) file

- [ ] Write test: parse CSL JSON array with one entry → correct id
- [ ] Write test: parse CSL JSON with multiple entries → all ids
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 3: Load CSL YAML (.yaml) file

- [ ] Write test: parse CSL YAML → convert to JSON → correct ids
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 4: Merge inline references

- [ ] Write test: inline references added to cite instance → ids available
- [ ] Write test: inline reference with same id as .bib entry → inline wins
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 5: Multiple bibliography files

- [ ] Write test: two .bib files → all ids merged
- [ ] Write test: mixed formats (.bib + .json) → all ids merged
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 6: Error handling

- [ ] Write test: invalid BibTeX → graceful error (empty or partial result)
- [ ] Write test: file read failure → graceful error
- [ ] Write test: empty bibliography list + no inline refs → empty BibliographyData
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

## Completion Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
