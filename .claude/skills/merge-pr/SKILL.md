---
name: merge-pr
description: Merges an approved PR and performs post-merge cleanup. Use after PR is approved.
---

# Merge PR: $ARGUMENTS

PR `$ARGUMENTS` をマージし、後処理を行います。

## Steps

### 1. Verify PR Status

```bash
gh pr view $ARGUMENTS --json state,reviewDecision,statusCheckRollup
```

- state が OPEN であること
- reviewDecision が APPROVED であること（または明示的にユーザーが承認）
- CI が通っていること

### 2. Merge

```bash
gh pr merge $ARGUMENTS --squash --delete-branch
```

### 3. Update Local

```bash
git checkout main
git pull origin main
```

### 4. Clean Up Worktree (if exists)

```bash
PARENT_DIR="$(cd "$(git rev-parse --show-toplevel)/.." && pwd)"
PROJECT_NAME="$(basename "$(git rev-parse --show-toplevel)")"
WORKTREE_DIR="${PARENT_DIR}/${PROJECT_NAME}--worktrees"
# Remove worktree for the merged branch if it exists
git worktree list | grep "$WORKTREE_DIR" && git worktree prune
```

### 5. Post-Merge Updates (on main)

- ROADMAP.md のステータスを "Done" に更新
- 該当タスクファイルを `spec/tasks/completed/` へ移動
- commit & push

```bash
git add spec/tasks/ROADMAP.md spec/tasks/completed/
git commit -m "docs: update roadmap and move completed task"
git push origin main
```
