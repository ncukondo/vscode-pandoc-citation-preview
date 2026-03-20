#!/usr/bin/env bash
set -euo pipefail

# Spawn a reviewer agent for a PR.
#
# Usage: spawn-reviewer.sh --pr <pr-number>
#        spawn-reviewer.sh <branch-name> <pr-number>

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_NAME="$(basename "$REPO_ROOT")"
PARENT_DIR="$(dirname "$REPO_ROOT")"
WORKTREE_BASE="${PARENT_DIR}/${PROJECT_NAME}--worktrees"

BRANCH=""
PR_NUMBER=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --pr)
      PR_NUMBER="$2"
      shift 2
      ;;
    -*)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
    *)
      if [ -z "$BRANCH" ]; then
        BRANCH="$1"
      elif [ -z "$PR_NUMBER" ]; then
        PR_NUMBER="$1"
      fi
      shift
      ;;
  esac
done

if [ -z "$PR_NUMBER" ]; then
  echo "Usage: spawn-reviewer.sh --pr <pr-number>" >&2
  exit 1
fi

# Get branch from PR if not provided
if [ -z "$BRANCH" ]; then
  echo "[spawn-reviewer] Fetching branch from PR #$PR_NUMBER..."
  BRANCH=$(gh pr view "$PR_NUMBER" --json headRefName --jq '.headRefName' 2>/dev/null) || {
    echo "[spawn-reviewer] ERROR: Could not get branch for PR #$PR_NUMBER" >&2
    exit 1
  }
fi

BRANCH_DIR=$(echo "$BRANCH" | tr '/' '-')
WORKTREE_DIR="$WORKTREE_BASE/$BRANCH_DIR"

# Create worktree if needed
if [ ! -d "$WORKTREE_DIR" ]; then
  echo "[spawn-reviewer] Creating worktree: $WORKTREE_DIR"
  mkdir -p "$WORKTREE_BASE"
  git fetch origin "$BRANCH" 2>/dev/null || true
  if git show-ref --verify --quiet "refs/heads/$BRANCH" 2>/dev/null; then
    git worktree add "$WORKTREE_DIR" "$BRANCH"
  elif git show-ref --verify --quiet "refs/remotes/origin/$BRANCH" 2>/dev/null; then
    git worktree add "$WORKTREE_DIR" "$BRANCH"
  else
    echo "[spawn-reviewer] ERROR: Branch '$BRANCH' not found" >&2
    exit 1
  fi
  (cd "$WORKTREE_DIR" && npm install)
fi

# Launch reviewer
export LAUNCH_AGENT_LABEL="spawn-reviewer"
exec "$SCRIPT_DIR/launch-agent.sh" "$WORKTREE_DIR" "/review-pr-local $PR_NUMBER"
