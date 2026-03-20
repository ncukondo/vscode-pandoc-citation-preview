#!/usr/bin/env bash
set -euo pipefail

# Spawn a worker agent for a task in a new worktree.
#
# Usage: spawn-worker.sh <branch-name> <task-keyword>
# Example: spawn-worker.sh feat/bracket-citation bracket-citation-parser

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_NAME="$(basename "$REPO_ROOT")"
PARENT_DIR="$(dirname "$REPO_ROOT")"

BRANCH="${1:?Usage: spawn-worker.sh <branch-name> <task-keyword>}"
TASK_KEYWORD="${2:?Usage: spawn-worker.sh <branch-name> <task-keyword>}"

WORKTREE_BASE="${PARENT_DIR}/${PROJECT_NAME}--worktrees"
WORKTREE_DIR="$WORKTREE_BASE/$(echo "$BRANCH" | tr '/' '-')"

# --- 1. Create worktree ---
if [ -d "$WORKTREE_DIR" ]; then
  echo "[spawn-worker] Worktree already exists: $WORKTREE_DIR"
else
  echo "[spawn-worker] Creating worktree..."
  mkdir -p "$WORKTREE_BASE"
  git worktree add "$WORKTREE_DIR" -b "$BRANCH"
  (cd "$WORKTREE_DIR" && npm install)
fi

# --- 2. Delegate to launch-agent.sh ---
export LAUNCH_AGENT_LABEL="spawn-worker"
exec "$SCRIPT_DIR/launch-agent.sh" "$WORKTREE_DIR" "/code-with-task $TASK_KEYWORD"
