# Task: Bracket Citation Parser

## Purpose

Parse bracketed Pandoc citations (`[...]`) containing one or more semicolon-separated citation entries into an array of structured citations.

## References

- ADR: `spec/decisions/ADR-004-citation-syntax-scope.md`
- Depends on: `src/parser/single-citation.ts` (Phase 3)
- Source: `src/parser/bracket-citation.ts`

## TDD Workflow

Each step follows Red-Green-Refactor.

## API Design

```typescript
interface BracketCitation {
  type: "bracket";
  citations: SingleCitation[];
  raw: string;        // original text including brackets
  startPos: number;
  endPos: number;
}

// Attempt to parse a bracket citation at the given position
function parseBracketCitation(src: string, pos: number): BracketCitation | null;
```

## Steps

### Step 1: Single citation in brackets

- [ ] Write test: `"[@smith2020]"` at pos 0 → 1 citation
- [ ] Write test: `"text [@smith2020] more"` at pos 5 → 1 citation, correct startPos/endPos
- [ ] Write test: `"[no citation]"` at pos 0 → `null` (no `@`)
- [ ] Write test: not starting with `[` → `null`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 2: Multiple semicolon-separated citations

- [ ] Write test: `"[@k1; @k2]"` → 2 citations
- [ ] Write test: `"[@k1; @k2; @k3]"` → 3 citations
- [ ] Write test: `"[see @k1, p. 10; also -@k2, chap. 3]"` → 2 citations with full structure
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 3: Unmatched brackets

- [ ] Write test: `"[@smith2020"` (no closing `]`) → `null`
- [ ] Write test: `"[@smith[nested]2020]"` → handles nested brackets correctly
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 4: Edge cases

- [ ] Write test: `"[@smith2020, p. 10]"` → locator parsed correctly
- [ ] Write test: `"[-@smith2020]"` → suppressAuthor
- [ ] Write test: `"[]"` → `null` (empty brackets)
- [ ] Write test: `"[@]"` → `null` (no valid key after @)
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

## Completion Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
