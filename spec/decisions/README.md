# Architecture Decision Records (ADR)

## When to Create an ADR

- Major library or framework selection
- Architectural pattern decisions
- Data model changes
- Significant technical trade-offs

Do NOT create ADRs for: minor implementation details, coding style, temporary workarounds, bug fixes.

## Template

```markdown
# ADR-NNN: Title

- **Date**: YYYY-MM-DD
- **Status**: Accepted | Superseded by ADR-XXX | Deprecated

## Context

Background, requirements, constraints, current situation.

## Decision

Concrete description of what will be done.

## Rationale

1. Reason (most important first)

## Consequences

### Positive
### Negative
### Neutral

## Alternatives Considered

### Alternative Name
- **Description**: ...
- **Pros**: ...
- **Cons**: ...
- **Why rejected**: ...

## References
```

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](ADR-001-citation-js-for-rendering.md) | citation-js for citation rendering | Accepted |
| [ADR-002](ADR-002-yaml-full-document-scan.md) | YAML metadata full document scan | Accepted |
| [ADR-003](ADR-003-file-path-resolution.md) | File path resolution strategy | Accepted |
| [ADR-004](ADR-004-citation-syntax-scope.md) | Pandoc citation syntax scope | Accepted |
