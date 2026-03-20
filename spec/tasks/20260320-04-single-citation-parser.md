# Task: Single Citation Parser

## Purpose

Parse a single citation entry (one item between semicolons inside brackets) into its structured components: id, prefix, suffix, locator, and suppress-author flag.

## References

- ADR: `spec/decisions/ADR-004-citation-syntax-scope.md`
- Depends on: `src/parser/citation-key.ts` (Phase 1), `src/parser/locator.ts` (Phase 2)
- Source: `src/parser/single-citation.ts`

## TDD Workflow

Each step follows Red-Green-Refactor.

## API Design

```typescript
interface Locator {
  label: string;
  value: string;
}

interface SingleCitation {
  id: string;
  prefix: string;
  suffix: string;
  locator: Locator | null;
  suppressAuthor: boolean;
}

function parseSingleCitation(text: string): SingleCitation | null;
```

- `text`: the text of one citation item (between `;` separators, without surrounding brackets)
- Returns parsed citation or `null` if no valid `@key` found

## Steps

### Step 1: Basic citation (key only)

- [ ] Write test: `"@smith2020"` → `{ id: "smith2020", prefix: "", suffix: "", locator: null, suppressAuthor: false }`
- [ ] Write test: `""` → `null`
- [ ] Write test: `"no citation here"` → `null`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 2: Suppress author

- [ ] Write test: `"-@smith2020"` → `{ ..., suppressAuthor: true }`
- [ ] Write test: `" -@smith2020"` → `{ ..., suppressAuthor: true }` (with leading space)
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 3: Prefix text

- [ ] Write test: `"see @smith2020"` → `{ ..., prefix: "see ", ... }`
- [ ] Write test: `"e.g., @smith2020"` → `{ ..., prefix: "e.g., ", ... }`
- [ ] Write test: `"see -@smith2020"` → `{ ..., prefix: "see ", suppressAuthor: true }`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 4: Locator

- [ ] Write test: `"@smith2020, p. 10"` → `{ ..., locator: { label: "page", value: "10" }, ... }`
- [ ] Write test: `"@smith2020, chap. 3"` → `{ ..., locator: { label: "chapter", value: "3" }, ... }`
- [ ] Write test: `"@smith2020, 15"` → `{ ..., locator: { label: "page", value: "15" }, ... }`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 5: Suffix text

- [ ] Write test: `"@smith2020, p. 10, and *passim*"` → `{ ..., locator: { label: "page", value: "10" }, suffix: ", and *passim*" }`
- [ ] Write test: `"@smith2020, see also"` → `{ ..., locator: null, suffix: ", see also" }` (no recognized locator → all is suffix)
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 6: Full combination

- [ ] Write test: `"see @smith2020, pp. 10-15, and *passim*"` → all fields populated
- [ ] Write test: `"e.g., -@doe2019, chap. 3"` → prefix + suppressAuthor + locator
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

## Completion Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
