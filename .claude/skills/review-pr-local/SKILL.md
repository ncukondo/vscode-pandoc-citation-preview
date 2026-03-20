---
name: review-pr-local
description: Reviews a PR from the main repository without a worktree. Use for lightweight PR review.
---

# Review PR: $ARGUMENTS

PR `$ARGUMENTS` をレビューします。

## Steps

### 1. Get PR Information

```bash
gh pr view $ARGUMENTS --json title,body,headRefName,baseRefName,additions,deletions,files
gh pr diff $ARGUMENTS
```

### 2. Check CI Status

```bash
gh pr checks $ARGUMENTS
```

CI が失敗していれば報告。

### 3. Review Diff

以下の観点でレビュー:

- **Correctness**: ロジックが正しいか
- **Test Coverage**: テストが十分か
- **Type Safety**: 型安全性
- **Edge Cases**: エッジケースの考慮
- **Code Quality**: コードの品質・可読性

### 4. Post Review

```bash
gh pr review $ARGUMENTS --approve --body "..."
# or
gh pr review $ARGUMENTS --request-changes --body "..."
# or
gh pr review $ARGUMENTS --comment --body "..."
```

### Review Format

```markdown
## Summary
[1-2 sentence summary]

## Findings

### Critical
- [ ] ...

### Suggestions
- ...

## Verdict
APPROVE / REQUEST_CHANGES / COMMENT
```

全ての発見事項（minor含む）をユーザーに報告すること。
