#!/usr/bin/env bash
set -euo pipefail

# Kill a Claude Code agent running in a tmux pane.
#
# Usage: kill-agent.sh <pane-id> [--keep-pane]

PANE_ID="${1:?Usage: kill-agent.sh <pane-id> [--keep-pane]}"
KEEP_PANE=false
if [ "${2:-}" = "--keep-pane" ]; then
  KEEP_PANE=true
fi

if ! tmux has-session -t "$PANE_ID" 2>/dev/null; then
  echo "[kill-agent] Pane $PANE_ID does not exist."
  exit 0
fi

echo "[kill-agent] Stopping Claude in pane $PANE_ID..."
tmux send-keys -t "$PANE_ID" C-c
sleep 1
tmux send-keys -t "$PANE_ID" Escape
sleep 0.5
tmux send-keys -t "$PANE_ID" '/exit'
sleep 1
tmux send-keys -t "$PANE_ID" Enter
sleep 2
tmux send-keys -t "$PANE_ID" 'y'
sleep 0.5
tmux send-keys -t "$PANE_ID" Enter
sleep 2

PANE_CMD=$(tmux display-message -t "$PANE_ID" -p '#{pane_current_command}' 2>/dev/null || echo "unknown")
if [ "$PANE_CMD" = "claude" ]; then
  echo "[kill-agent] WARNING: Claude may still be running. Sending SIGTERM..."
  PANE_PID=$(tmux display-message -t "$PANE_ID" -p '#{pane_pid}' 2>/dev/null || echo "")
  if [ -n "$PANE_PID" ]; then
    pkill -TERM -P "$PANE_PID" 2>/dev/null || true
    sleep 2
  fi
fi

if [ "$KEEP_PANE" = true ]; then
  echo "[kill-agent] Claude stopped. Pane $PANE_ID kept."
else
  tmux kill-pane -t "$PANE_ID" 2>/dev/null || true
  echo "[kill-agent] Pane $PANE_ID killed."
fi
