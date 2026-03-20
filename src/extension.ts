import type MarkdownIt from "markdown-it";

export function activate() {
  return {
    extendMarkdownIt(md: MarkdownIt) {
      return md.use(pandocCitationPlugin);
    },
  };
}

/**
 * markdown-it plugin that renders Pandoc-style citations.
 *
 * Supported syntax:
 *   [@key]           → single citation
 *   [@key, p. 10]    → citation with locator
 *   [@key; @key2]    → multiple citations
 *   @key             → in-text citation
 *   [-@key]          → suppress author
 */
function pandocCitationPlugin(md: MarkdownIt) {
  // Bracketed citations: [@key], [@key, p. 10], [-@key], [@k1; @k2]
  md.inline.ruler.before("link", "pandoc_citation_bracket", (state, silent) => {
    const src = state.src;
    const start = state.pos;

    if (src.charCodeAt(start) !== 0x5b /* [ */) return false;

    // Find matching ]
    const end = findClosingBracket(src, start);
    if (end === -1) return false;

    const inner = src.slice(start + 1, end);

    // Must contain at least one @
    if (!inner.includes("@")) return false;

    // Validate it looks like a citation: starts with optional - then @
    if (!/^-?@/.test(inner.trim()) && !/;\s*-?@/.test(inner)) return false;

    if (!silent) {
      const token = state.push("pandoc_citation", "", 0);
      token.content = inner;
      token.markup = "[@]";
    }

    state.pos = end + 1;
    return true;
  });

  // Inline citations: @key (word boundary)
  md.inline.ruler.before(
    "link",
    "pandoc_citation_inline",
    (state, silent) => {
      const src = state.src;
      const start = state.pos;

      if (src.charCodeAt(start) !== 0x40 /* @ */) return false;

      // Previous char must be whitespace or start of string
      if (start > 0 && /\w/.test(src[start - 1])) return false;

      // Match @citation-key (letters, digits, _, -, :, .)
      const match = src.slice(start).match(/^@([\w][\w:.#$%&\-+?<>~/]*)/);
      if (!match) return false;

      if (!silent) {
        const token = state.push("pandoc_citation_inline", "", 0);
        token.content = match[1];
        token.markup = "@";
      }

      state.pos = start + match[0].length;
      return true;
    }
  );

  // Renderer for bracketed citations
  md.renderer.rules["pandoc_citation"] = (tokens, idx) => {
    const content = escapeHtml(tokens[idx].content);
    return `<cite class="pandoc-citation">[${content}]</cite>`;
  };

  // Renderer for inline citations
  md.renderer.rules["pandoc_citation_inline"] = (tokens, idx) => {
    const content = escapeHtml(tokens[idx].content);
    return `<cite class="pandoc-citation pandoc-citation-inline">@${content}</cite>`;
  };
}

function findClosingBracket(src: string, start: number): number {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src.charCodeAt(i) === 0x5b /* [ */) depth++;
    else if (src.charCodeAt(i) === 0x5d /* ] */) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
