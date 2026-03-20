# Pandoc Citation Preview

A VS Code extension that renders Pandoc-style citations (`@key`, `[@key]`) in the built-in Markdown Preview. It loads bibliography data from BibTeX / CSL-JSON files and generates formatted citations and reference lists.

## Features

### Citation Preview

Renders Pandoc citation syntax directly in the Markdown preview.

- **Bracket citations**: `[@smith2020]`, `[@smith2020, p. 10]`, `[@smith2020; @johnson2019]`
- **Inline citations**: `@smith2020`, `@smith2020 [p. 10]`
- **Author suppression**: `[-@smith2020]` renders only the year
- **Prefix / suffix**: `[see @smith2020, p. 10]`

### Interactive Bibliography

- Click a citation to jump to the corresponding bibliography entry
- Hover over a citation to see the full reference in a popover
- DOIs and URLs are automatically rendered as clickable links

### Editor Hover

Hover over a citation key in the editor to preview the formatted reference in a tooltip.

### Bibliography Rendering

Renders the reference list using CSL styles (default: APA).

- Supports BibTeX (`.bib`), CSL-JSON (`.json`), and YAML (`.yaml`/`.yml`)
- Inline references via YAML frontmatter `references:` field
- `nocite` support for including uncited entries

## Usage

### 1. Specify a bibliography file in YAML frontmatter

```markdown
---
bibliography: refs.bib
---

According to @smith2020, ...

## References

::: {#refs}
:::
```

### 2. Multiple bibliography files

```yaml
---
bibliography:
  - refs.bib
  - extra.json
---
```

### 3. Inline references

```yaml
---
references:
  - id: smith2020
    type: article-journal
    title: "Article Title"
    author:
      - family: Smith
        given: John
    issued:
      date-parts:
        - [2020]
---
```

### 4. Custom CSL style

```yaml
---
bibliography: refs.bib
csl: chicago-author-date.csl
---
```

### 5. nocite

```yaml
---
bibliography: refs.bib
nocite: "@*"
---
```

## Supported Citation Syntax

| Syntax | Description |
|--------|-------------|
| `@key` | Inline citation (Author Year) |
| `[@key]` | Bracket citation (Author Year) |
| `[@key, p. 10]` | With locator |
| `[@key1; @key2]` | Multiple citations |
| `[-@key]` | Suppress author |
| `[see @key]` | With prefix |
| `@key [p. 10]` | Inline with locator |

### Supported Locators

page, chapter, section, volume, figure, part, line, note, verse, book, column, folio, opus, sub verbo

## Supported Bibliography Formats

| Format | Extension |
|--------|-----------|
| BibTeX | `.bib` |
| CSL-JSON | `.json` |
| YAML | `.yaml`, `.yml` |
| Inline | YAML frontmatter `references:` |

## Requirements

- VS Code 1.80.0 or later
- No external dependencies required (Pandoc is **not** needed)

## License

MIT
