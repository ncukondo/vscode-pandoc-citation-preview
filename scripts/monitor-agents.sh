#!/usr/bin/env bash
set -euo pipefail

# Monitor all Claude agents by scanning state files.
#
# Usage: monitor-agents.sh [--watch]

STATE_DIR="/tmp/claude-agent-states"
WATCH=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --watch|-w) WATCH=true; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

get_existing_panes() {
  tmux list-panes -a -F "#{pane_id}" 2>/dev/null || true
}

format_age() {
  local seconds="$1"
  if [ "$seconds" -lt 60 ]; then echo "${seconds}s"
  elif [ "$seconds" -lt 3600 ]; then echo "$((seconds / 60))m"
  else echo "$((seconds / 3600))h"
  fi
}

show_status() {
  if [ ! -d "$STATE_DIR" ]; then
    echo "No agent states found."
    return
  fi

  local existing_panes
  existing_panes=$(get_existing_panes)
  local now
  now=$(date +%s)

  printf "%-8s %-10s %-6s %-s\n" "PANE" "STATE" "AGE" "PATH"
  printf "%-8s %-10s %-6s %-s\n" "----" "-----" "---" "----"

  for state_file in "$STATE_DIR"/*; do
    [ -f "$state_file" ] || continue
    local pane_id
    pane_id=$(basename "$state_file")
    local state
    state=$(cat "$state_file" 2>/dev/null || echo "?")

    if ! echo "$existing_panes" | grep -q "^${pane_id}$"; then
      continue
    fi

    local mtime
    if [[ "$(uname)" == "Darwin" ]]; then
      mtime=$(stat -f %m "$state_file" 2>/dev/null || echo "$now")
    else
      mtime=$(stat -c %Y "$state_file" 2>/dev/null || echo "$now")
    fi
    local age=$((now - mtime))
    local age_str
    age_str=$(format_age "$age")

    local path
    path=$(tmux display-message -t "$pane_id" -p '#{pane_current_path}' 2>/dev/null || echo "?")

    printf "%-8s %-10s %-6s %-s\n" "$pane_id" "$state" "$age_str" "$path"
  done
}

if [ "$WATCH" = true ]; then
  while true; do
    clear
    echo "=== Agent Monitor ($(date '+%H:%M:%S')) ==="
    echo
    show_status
    sleep 5
  done
else
  show_status
fi
