#!/usr/bin/env bash
set -euo pipefail

# Merge a PR and clean up worktree.
#
# Usage: merge-pr.sh <pr-number>

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_NAME="$(basename "$REPO_ROOT")"
PARENT_DIR="$(dirname "$REPO_ROOT")"
WORKTREE_BASE="${PARENT_DIR}/${PROJECT_NAME}--worktrees"

PR_NUM="${1:?Usage: merge-pr.sh <pr-number>}"

echo "[merge-pr] Merging PR #$PR_NUM..."

# Get branch name
BRANCH=$(gh pr view "$PR_NUM" --json headRefName --jq '.headRefName' 2>/dev/null) || {
  echo "[merge-pr] ERROR: Could not get branch for PR #$PR_NUM" >&2
  exit 1
}

# Merge
gh pr merge "$PR_NUM" --squash --delete-branch

# Pull latest
git checkout main 2>/dev/null || true
git pull origin main

# Clean up worktree
BRANCH_DIR=$(echo "$BRANCH" | tr '/' '-')
WORKTREE_DIR="$WORKTREE_BASE/$BRANCH_DIR"
if [ -d "$WORKTREE_DIR" ]; then
  echo "[merge-pr] Removing worktree: $WORKTREE_DIR"
  git worktree remove "$WORKTREE_DIR" --force 2>/dev/null || rm -rf "$WORKTREE_DIR"
fi
git worktree prune 2>/dev/null || true

# Clean up local branch
git branch -D "$BRANCH" 2>/dev/null || true

echo "[merge-pr] Done. PR #$PR_NUM merged."
