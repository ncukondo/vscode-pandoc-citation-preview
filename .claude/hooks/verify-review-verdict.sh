#!/bin/bash
# Hook: verify-review-verdict.sh
# PostToolUse hook for Agent tool calls.
# Enforces that review subagent verdicts are consistent with findings.
# If findings_count > 0 but verdict is LGTM, blocks and injects correction context.

set -e

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only process Agent tool calls
if [ "$TOOL_NAME" != "Agent" ]; then
  exit 0
fi

TOOL_OUTPUT=$(echo "$INPUT" | jq -r '.tool_output // empty')

# Look for the structured marker in the output
# Format: <!-- REVIEW_RESULT:{"verdict":"...","findings_count":N} -->
MARKER=$(echo "$TOOL_OUTPUT" | grep -o '<!-- REVIEW_RESULT:{[^}]*} -->' | tail -1 || true)

# No marker found — not a review agent, skip
if [ -z "$MARKER" ]; then
  exit 0
fi

# Extract JSON from marker
JSON=$(echo "$MARKER" | sed 's/<!-- REVIEW_RESULT://;s/ -->//')

VERDICT=$(echo "$JSON" | jq -r '.verdict // empty')
FINDINGS_COUNT=$(echo "$JSON" | jq -r '.findings_count // 0')

# Validate consistency
if [ "$FINDINGS_COUNT" -gt 0 ] 2>/dev/null && [ "$VERDICT" = "LGTM" ]; then
  cat <<EOF
{
  "decision": "block",
  "reason": "Review verdict inconsistent: ${FINDINGS_COUNT} findings but verdict is LGTM"
}
EOF
  echo "REVIEW CONSISTENCY CHECK FAILED: Found ${FINDINGS_COUNT} findings but verdict was LGTM. Verdict must be NEEDS_CHANGES when any findings exist. Re-run the review or override the verdict to NEEDS_CHANGES." >&2
  exit 2
fi

# Validate that findings_count == 0 when LGTM
if [ "$VERDICT" = "LGTM" ] && [ "$FINDINGS_COUNT" -eq 0 ] 2>/dev/null; then
  exit 0
fi

# NEEDS_CHANGES with findings — consistent, allow
if [ "$VERDICT" = "NEEDS_CHANGES" ] && [ "$FINDINGS_COUNT" -gt 0 ] 2>/dev/null; then
  exit 0
fi

# Any other case, allow (don't block on unexpected data)
exit 0
