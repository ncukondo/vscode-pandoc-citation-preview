#!/usr/bin/env bash
set -euo pipefail

# Check task completion status using GitHub API.
#
# Usage: check-task-completion.sh <branch> <task-type> [pr-number]
# Task types: pr-creation, review

BRANCH="${1:?Usage: check-task-completion.sh <branch> <task-type> [pr-number]}"
TASK_TYPE="${2:?Usage: check-task-completion.sh <branch> <task-type> [pr-number]}"
PR_NUM="${3:-}"

case "$TASK_TYPE" in
  pr-creation)
    PR_JSON=$(gh pr list --head "$BRANCH" --json number,state --jq '.[0] // empty' 2>/dev/null || true)
    if [ -z "$PR_JSON" ]; then
      echo "pending"
      exit 0
    fi
    PR_NUM=$(echo "$PR_JSON" | jq -r '.number')
    FAILED_CHECKS=$(gh pr checks "$PR_NUM" --json name,bucket \
      --jq '.[] | select(.bucket == "fail" or .bucket == "cancel") | .name' 2>/dev/null || true)
    PENDING_CHECKS=$(gh pr checks "$PR_NUM" --json name,bucket \
      --jq '.[] | select(.bucket == "pending") | .name' 2>/dev/null || true)
    if [ -n "$PENDING_CHECKS" ]; then
      echo "ci-pending"
    elif [ -n "$FAILED_CHECKS" ]; then
      echo "ci-failed"
    else
      echo "completed"
    fi
    ;;
  review)
    if [ -z "$PR_NUM" ]; then
      echo "error: pr-number required" >&2
      exit 1
    fi
    REVIEWS_JSON=$(gh pr view "$PR_NUM" --json reviews --jq '.reviews' 2>/dev/null || echo "[]")
    REVIEW_COUNT=$(echo "$REVIEWS_JSON" | jq 'length')
    if [ "$REVIEW_COUNT" -eq 0 ]; then
      echo "pending"
      exit 0
    fi
    LATEST_STATE=$(echo "$REVIEWS_JSON" | jq -r '.[-1].state')
    case "$LATEST_STATE" in
      APPROVED) echo "approved" ;;
      CHANGES_REQUESTED) echo "changes_requested" ;;
      *) echo "commented" ;;
    esac
    ;;
  *)
    echo "error: unknown task type: $TASK_TYPE" >&2
    exit 1
    ;;
esac
