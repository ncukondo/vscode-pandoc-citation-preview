# ADR-003: File Path Resolution Strategy

- **Date**: 2026-03-20
- **Status**: Accepted

## Context

Bibliography and CSL files referenced in YAML metadata (e.g., `bibliography: refs.bib`) need to be resolved to absolute paths. The resolution strategy must handle:

- Relative paths (most common)
- Absolute paths
- Files not co-located with the markdown document
- Fallback when frontmatter does not specify a bibliography

## Decision

Resolve file paths using the following priority chain:

1. **Absolute path** → use as-is
2. **Relative path** →
   a. Resolve from the markdown file's directory
   b. If not found, search through `searchDirectories` in order
   c. If not found, resolve from workspace root
3. **No frontmatter `bibliography`** → use `defaultBibliography` setting

### VS Code Settings

```jsonc
{
  "pandocCitation.defaultBibliography": [],
  "pandocCitation.searchDirectories": [],
  "pandocCitation.defaultCsl": "",
  "pandocCitation.cslSearchDirectories": []
}
```

- `searchDirectories` and `cslSearchDirectories` accept absolute paths or paths relative to workspace root.
- `defaultBibliography` accepts the same path formats and is used only when the document has no `bibliography` field.

## Rationale

1. Markdown-relative resolution matches Pandoc's behavior
2. Search directories support monorepo / shared bibliography setups
3. Workspace root fallback covers the common case of a single `.bib` at project root
4. Default bibliography setting avoids requiring frontmatter in every file

## Consequences

### Positive
- Works out-of-the-box for typical Pandoc projects (bib file next to md file)
- Flexible enough for complex project structures
- No bibliography in frontmatter still works if defaults are configured

### Negative
- Multiple fallback levels may make debugging "which file was loaded" harder
- Need to handle the case where the same filename exists in multiple search directories

### Neutral
- CSL files follow the same resolution pattern for consistency

## Alternatives Considered

### Workspace-root-only resolution
- **Description**: Always resolve relative to workspace root
- **Pros**: Simple, predictable
- **Cons**: Breaks Pandoc convention; doesn't work for nested directory structures
- **Why rejected**: Too inflexible for real-world usage

### Automatic .bib discovery (glob workspace)
- **Description**: Automatically find all .bib files in the workspace
- **Pros**: Zero configuration
- **Cons**: Ambiguous when multiple .bib files exist; slow on large workspaces; may load unintended files
- **Why rejected**: Implicit behavior leads to surprises

## References

- [Pandoc Manual — Specifying bibliographic data](https://pandoc.org/MANUAL.html#specifying-bibliographic-data)
