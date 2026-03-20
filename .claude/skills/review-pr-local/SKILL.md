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

### 2. Get Task Spec

PR のブランチ名やタイトルから対応するタスクファイルを特定し、spec を読む:

```bash
ls spec/tasks/*.md spec/tasks/completed/*.md
# 該当タスクファイルを読む
```

### 3. Check CI Status

```bash
gh pr checks $ARGUMENTS
```

CI が失敗していれば報告。

### 4. Review Diff

以下の **全ての** 観点でレビュー:

- **Spec Compliance**: タスクファイルの API Design に準拠しているか、要求されたテストケースが全て含まれているか
- **Correctness**: ロジックが正しいか、エッジケースの考慮
- **Test Coverage**: テストが十分か、境界値テスト
- **Type Safety**: 型が適切か、不要な `any` や unsafe cast がないか
- **Performance**: 不要な計算・ループ、正規表現の効率
- **Code Quality**: 命名、責務分離、デッドコード、可読性

### 5. Post Review

指摘事項がある場合は PR に comment として投稿。

ファイルの特定行への指摘:
```bash
gh api repos/{owner}/{repo}/pulls/$ARGUMENTS/comments \
  --method POST \
  -f body="指摘内容" \
  -f path="src/path/to/file.ts" \
  -f commit_id="$(gh pr view $ARGUMENTS --json headRefOid -q .headRefOid)" \
  -f line=42 \
  -f side="RIGHT"
```

全体所見:
```bash
gh pr comment $ARGUMENTS --body "..."
```

**注意**: 同一アカウントでは approve/request-changes は使用不可。`gh pr comment` のみ使用する。

### Review Format

```markdown
## Review Summary
[1-2 sentence summary]

## Spec Compliance
- ...

## Findings

### Critical (must fix)
- [ ] file:line - 説明

### Improvement (should fix)
- [ ] file:line - 説明

### Minor (still fix)
- [ ] file:line - 説明

## Verdict
LGTM / NEEDS_CHANGES
```

### 6. Output Structured Marker (MANDATORY)

**レビュー結果の最後に、必ず以下の形式のマーカーを出力すること。**
これは hook による機械的検証に使用される。省略不可。

```
<!-- REVIEW_RESULT:{"verdict":"LGTM","findings_count":0} -->
```

または:

```
<!-- REVIEW_RESULT:{"verdict":"NEEDS_CHANGES","findings_count":3} -->
```

ルール:
- `findings_count`: Critical + Improvement + Minor の合計数
- `findings_count > 0` なら `verdict` は必ず `NEEDS_CHANGES`
- `findings_count == 0` の場合のみ `verdict` は `LGTM`
- このマーカーはレビュー出力の **最終行** に置くこと

**重要**:
- Minor な品質向上の指摘も含めて **全て** 報告・投稿する
- 指摘が1つでもあれば verdict は `NEEDS_CHANGES`
- 全ての指摘が解消された場合のみ `LGTM`
