#!/usr/bin/env bash
set -euo pipefail

# Send a prompt to a Claude agent in a tmux pane.
#
# Usage: send-to-agent.sh <pane-id> <prompt>

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PANE="${1:?Usage: send-to-agent.sh <pane-id> <prompt>}"
PROMPT="${2:?Usage: send-to-agent.sh <pane-id> <prompt>}"

if ! tmux has-session -t "$PANE" 2>/dev/null; then
  echo "[send-to-agent] ERROR: Pane $PANE does not exist" >&2
  exit 1
fi

STATE=$("$SCRIPT_DIR/check-agent-state.sh" "$PANE" 2>/dev/null || echo "error")

if [ "$STATE" != "idle" ] && [ "$STATE" != "starting" ]; then
  echo "[send-to-agent] ERROR: Agent not ready (state: $STATE)" >&2
  exit 1
fi

echo "[send-to-agent] Sending prompt to pane $PANE..."
tmux send-keys -t "$PANE" "$PROMPT"
sleep 1
tmux send-keys -t "$PANE" Enter
echo "[send-to-agent] Prompt sent."
