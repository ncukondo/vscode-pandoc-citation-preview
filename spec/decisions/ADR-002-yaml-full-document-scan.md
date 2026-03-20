# ADR-002: YAML Metadata Full Document Scan

- **Date**: 2026-03-20
- **Status**: Accepted

## Context

Pandoc allows YAML metadata blocks at any position in a document (not only at the top). Multiple blocks are merged, with later values taking precedence. This enables patterns such as placing an inline `references` block at the end of a document.

VS Code's built-in markdown preview (and CommonMark) only recognizes a single frontmatter block at the document start. We need to decide how broadly to scan for metadata.

## Decision

Scan the **entire document** for YAML metadata blocks.

- A YAML block starts with `---` on its own line and ends with `---` or `...` on its own line.
- The opening `---` must not be followed by a blank line.
- If the block is not at the start of the document, it must be preceded by a blank line.
- Multiple blocks are merged; for duplicate fields, the later block wins.
- Target fields: `bibliography`, `csl`, `references`, `nocite`.
- YAML blocks inside fenced code blocks (`` ``` `` or `~~~`) must be excluded.

## Rationale

1. Enables placing `references:` at the document end — a common Pandoc workflow
2. Full Pandoc compatibility for metadata handling
3. Users writing for Pandoc expect metadata blocks to work anywhere

## Consequences

### Positive
- Supports all Pandoc metadata patterns
- Users can organize metadata flexibly (e.g., bibliography config at top, inline references at bottom)

### Negative
- Must correctly skip fenced code blocks to avoid false positives
- Slightly more complex parsing than frontmatter-only approach
- Performance consideration for very large documents (mitigated by only extracting target fields)

### Neutral
- The merged result may differ from what VS Code's built-in frontmatter parser returns, but this extension only uses the result for citation processing

## Alternatives Considered

### Frontmatter only (first block)
- **Description**: Only parse the YAML block at the document start
- **Pros**: Simple, matches CommonMark/VS Code convention
- **Cons**: Cannot support inline references at document end; breaks Pandoc-native workflows
- **Why rejected**: Too limiting for Pandoc users

## References

- [Pandoc Manual — Metadata blocks](https://pandoc.org/MANUAL.html#metadata-blocks)
