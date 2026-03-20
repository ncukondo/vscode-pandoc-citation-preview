# ADR-004: Pandoc Citation Syntax Scope

- **Date**: 2026-03-20
- **Status**: Accepted

## Context

Pandoc's citation syntax includes several features of varying complexity and usage frequency. The full specification includes:

- Bracketed citations: `[@key]`, `[@key, p. 10]`, `[see @key; -@key2]`
- In-text citations: `@key`, `@key [p. 10]`
- Standard key rules: starts with `[a-zA-Z0-9_]`, allows internal punctuation `[:.#$%&\-+?<>~/]`, trailing punctuation excluded, consecutive internal punctuation terminates key
- Curly brace key syntax: `@{any.key.here.}` (allows arbitrary characters in keys)

## Decision

Support **all Pandoc citation syntax except curly brace keys** (`@{...}`).

### Supported

- Bracketed citations with prefix, suffix, locator, suppress-author, multiple citations
- In-text citations with optional trailing locator in brackets
- Standard citation key character rules including trailing punctuation exclusion and consecutive punctuation termination
- Structured parsing: `id`, `prefix`, `suffix`, `locator` (label + value), `suppressAuthor`
- English locator terms: page/p./pp., chapter/chap., section/sec., volume/vol., etc.

### Not Supported

- Curly brace key syntax `@{...}` — keys must conform to standard character rules

## Rationale

1. Curly brace keys are rarely used in practice (primarily for URL-as-key edge cases)
2. Standard key rules already cover the vast majority of BibTeX/BibLaTeX citation keys
3. Omitting curly brace syntax simplifies the key parser significantly
4. Can be added later if demand arises without breaking existing functionality

## Consequences

### Positive
- Simpler, more maintainable key parsing logic
- Covers >99% of real-world citation keys

### Negative
- Users with URL-style or unusual citation keys cannot use them without renaming
- Not 100% Pandoc-compatible (documented limitation)

### Neutral
- If added later, it would be a backward-compatible addition to the key parser

## Alternatives Considered

### Full Pandoc syntax including curly braces
- **Description**: Implement `@{...}` syntax
- **Pros**: 100% compatible
- **Cons**: Additional parser complexity for a rarely-used feature
- **Why rejected**: Low value-to-complexity ratio; can be added later

## References

- [Pandoc Manual — Citation syntax](https://pandoc.org/MANUAL.html#citation-syntax)
