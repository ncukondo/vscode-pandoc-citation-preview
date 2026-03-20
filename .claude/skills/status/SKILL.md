---
name: status
description: Shows project status including git state, worktrees, open PRs, and ROADMAP progress.
---

# Project Status

プロジェクトの現在の状態を表示します。

## Checks

### 1. Git Status
```bash
git status --short
git branch -a
```

### 2. Active Worktrees
```bash
git worktree list
```

### 3. Open PRs
```bash
gh pr list --state open --json number,title,headRefName,reviewDecision,statusCheckRollup --jq '.[] | "PR #\(.number): \(.title) [\(.reviewDecision // "PENDING")]"'
```

### 4. ROADMAP Progress

spec/tasks/ROADMAP.md を読んで進捗サマリを表示:
- Todo / In Progress / Done の数
- 次に着手可能なタスク

### 5. Worker Status (if any)

```bash
PARENT_DIR="$(cd "$(git rev-parse --show-toplevel)/.." && pwd)"
PROJECT_NAME="$(basename "$(git rev-parse --show-toplevel)")"
WORKTREE_DIR="${PARENT_DIR}/${PROJECT_NAME}--worktrees"
for f in "$WORKTREE_DIR"/*/.worker-status.json; do
  [ -f "$f" ] && echo "=== $(dirname "$f") ===" && cat "$f"
done 2>/dev/null
```

### 6. Test Health
```bash
npm test -- --run 2>&1 | tail -5
```

## Output

上記の結果をまとめて簡潔に報告してください。
