# Task: File Path Resolver

## Purpose

Resolve bibliography and CSL file paths from relative/absolute paths using the priority chain: markdown file directory → search directories → workspace root. Abstract filesystem access for testability.

## References

- ADR: `spec/decisions/ADR-003-file-path-resolution.md`
- Source: `src/resolver/file-resolver.ts`

## TDD Workflow

Each step follows Red-Green-Refactor.

## API Design

```typescript
interface ResolveContext {
  mdFileDir: string;              // directory containing the markdown file
  searchDirectories: string[];    // additional search paths
  workspaceRoot: string;          // workspace root directory
  exists: (path: string) => boolean | Promise<boolean>;  // injectable filesystem check
}

function resolvePath(filePath: string, context: ResolveContext): string | null;
```

## Steps

### Step 1: Absolute paths

- [ ] Write test: `"/absolute/path/refs.bib"` → returned as-is (if exists)
- [ ] Write test: absolute path that doesn't exist → `null`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 2: Relative path resolved from markdown file directory

- [ ] Write test: `"refs.bib"` with mdFileDir `/project/docs`, file exists at `/project/docs/refs.bib` → resolved
- [ ] Write test: `"../bib/refs.bib"` with mdFileDir `/project/docs` → `/project/bib/refs.bib`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 3: Fallback to search directories

- [ ] Write test: `"refs.bib"` not in mdFileDir, exists in searchDirectories[0] → resolved
- [ ] Write test: `"refs.bib"` not in first searchDir, exists in second → resolved
- [ ] Write test: `"refs.bib"` not in any searchDir → falls through
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 4: Fallback to workspace root

- [ ] Write test: `"refs.bib"` not in mdFileDir or searchDirs, exists at workspace root → resolved
- [ ] Write test: not found anywhere → `null`
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

### Step 5: Default bibliography (when frontmatter has no bibliography field)

- [ ] Write test: resolve default bibliography paths using same priority chain
- [ ] Create stub (verify Red)
- [ ] Implement (verify Green)
- [ ] Lint & type check

## Completion Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Move file to `spec/tasks/completed/`
