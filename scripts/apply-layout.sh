#!/usr/bin/env bash
set -euo pipefail

# Apply main-vertical layout to the current tmux window.
# Main pane ~45% on the left, workers stacked on the right.
#
# Usage: apply-layout.sh

TARGET="${1:-}"

if [ -z "${TMUX:-}" ] && [ -z "$TARGET" ]; then
  echo "ERROR: Not in a tmux session."
  exit 1
fi

if [ -n "$TARGET" ]; then
  TARGET_FLAG=("-t" "$TARGET")
else
  TARGET_FLAG=()
fi

PANE_COUNT=$(tmux list-panes "${TARGET_FLAG[@]}" 2>/dev/null | wc -l)

if [ "$PANE_COUNT" -lt 2 ]; then
  echo "Only $PANE_COUNT pane(s) — no layout needed."
  exit 0
fi

tmux select-layout "${TARGET_FLAG[@]}" main-vertical
WINDOW_WIDTH=$(tmux display-message "${TARGET_FLAG[@]}" -p '#{window_width}')
MAIN_WIDTH=$(( WINDOW_WIDTH * 45 / 100 ))
tmux set-window-option "${TARGET_FLAG[@]}" main-pane-width "$MAIN_WIDTH" 2>/dev/null || true
tmux select-layout "${TARGET_FLAG[@]}" main-vertical

echo "Layout applied: main ${MAIN_WIDTH}cols, ${PANE_COUNT} panes."
