# Task: Inline Citation Parser

## Purpose

Parse in-text Pandoc citations (`@key` and `@key [locator]`) that appear outside brackets. The author name becomes part of the running text (e.g., "Smith (2020)").

## References

- ADR: `spec/decisions/ADR-004-citation-syntax-scope.md`
- Depends on: `src/parser/citation-key.ts` (Phase 1), `src/parser/locator.ts` (Phase 2)
- Source: `src/parser/inline-citation.ts`

## TDD Workflow

Each step follows Red-Green-Refactor.

## API Design

```typescript
interface InlineCitation {
  type: "inline";
  id: string;
  locator: Locator | null;
  startPos: number;
  endPos: number;
}

// Attempt to parse an inline citation at the given position
// pos should point to the '@' character
function parseInlineCitation(src: string, pos: number): InlineCitation | null;
```

## Steps

### Step 1: Basic inline citation

- [ ] Write test: `"@smith2020"` at pos 0 → `{ id: "smith2020", locator: null, endPos: 10 }`
- [ ] Write test: `"says @smith2020 and"` at pos 5 → correct id and positions
- [ ] Write test: `"@smith2020."` → id is `"smith2020"`, endPos 10 (trailing `.` excluded)
- [ ] Write test: not starting with `@` → `null`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 2: Word boundary check

The `@` must not be preceded by a word character (to avoid matching email addresses etc.).

- [ ] Write test: `"email@example"` at pos 5 → `null`
- [ ] Write test: `"a @smith"` at pos 2 → valid
- [ ] Write test: `"@smith"` at pos 0 (start of string) → valid
- [ ] Write test: `"(@smith)"` at pos 1 → valid (preceded by non-word char)
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 3: Trailing locator in brackets

`@key [p. 10]` — a bracket immediately following the key is parsed as a locator.

- [ ] Write test: `"@smith2020 [p. 10]"` → `{ id: "smith2020", locator: { label: "page", value: "10" }, endPos: 18 }`
- [ ] Write test: `"@smith2020 [chap. 3]"` → locator with chapter
- [ ] Write test: `"@smith2020 [some text]"` → no valid locator → locator null, endPos after key only (brackets not consumed)
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 4: Edge cases

- [ ] Write test: `"@smith2020[p. 10]"` → no space before `[` — still parse locator? (Pandoc requires space — `null` locator, endPos after key)
- [ ] Write test: `"@a"` → valid (single-char key)
- [ ] Write test: `"@"` → `null` (no key)
- [ ] Write test: `"@123"` → valid (starts with digit)
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

## Completion Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
