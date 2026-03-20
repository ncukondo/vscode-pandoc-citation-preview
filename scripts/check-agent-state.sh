#!/usr/bin/env bash
set -euo pipefail

# Check the state of a Claude Code agent running in a tmux pane.
#
# Usage: check-agent-state.sh <pane-id>
# Output: "trust", "permission", "idle", "working", or "starting"

PANE="${1:?Usage: check-agent-state.sh <pane-id>}"
WORKER_STATE_DIR="/tmp/claude-agent-states"
STATE_FILE="$WORKER_STATE_DIR/$PANE"

IS_STARTING=false

# --- Method 1: Hooks-based state file ---
if [[ -f "$STATE_FILE" ]]; then
  if [[ "$(uname)" == "Darwin" ]]; then
    FILE_MTIME=$(stat -f %m "$STATE_FILE" 2>/dev/null || echo 0)
  else
    FILE_MTIME=$(stat -c %Y "$STATE_FILE" 2>/dev/null || echo 0)
  fi
  NOW=$(date +%s)
  AGE=$((NOW - FILE_MTIME))

  if [[ $AGE -lt 120 ]]; then
    STATE=$(cat "$STATE_FILE" 2>/dev/null || echo "")
    if [[ -n "$STATE" ]]; then
      if [[ "$STATE" == "starting" ]]; then
        IS_STARTING=true
      elif [[ "$STATE" == "permission" ]]; then
        echo "trust"
        exit 0
      else
        echo "$STATE"
        exit 0
      fi
    fi
  fi
fi

# --- Method 2: tmux capture-pane fallback ---
if ! tmux has-session -t "$PANE" 2>/dev/null; then
  echo "error: pane not found"
  exit 1
fi

CONTENT=$(tmux capture-pane -t "$PANE" -p -S -50 2>/dev/null)

# Trust prompt detection
if echo "$CONTENT" | grep -q 'folder' && \
   echo "$CONTENT" | grep -q 'confirm'; then
  echo "trust"
  exit 0
fi

# Idle detection
if echo "$CONTENT" | grep -q '❯'; then
  PROMPT_LINE=$(echo "$CONTENT" | grep '❯' | tail -1)
  if echo "$PROMPT_LINE" | grep -qE '(⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏)'; then
    echo "working"
  else
    echo "idle"
  fi
  exit 0
fi

if [[ "$IS_STARTING" == "true" ]]; then
  echo "starting"
  exit 0
fi

echo "working"
