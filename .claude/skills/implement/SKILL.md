---
name: implement
description: Analyzes ROADMAP and implements tasks in parallel using worktrees and subagents. Use when starting implementation work.
---

# Parallel Implementation

spec/tasks/ROADMAP.md を確認し、並列実装可能なタスクを分析して実装を進めます。

## CRITICAL: Main Agent Role

**メインエージェントは管理・指揮のみを行い、直接の実装作業は行いません。**

以下は全てサブエージェント（ワーカー）に委譲すること：
- **実装**: コードの作成・編集
- **テスト**: テストの実行・確認
- **レビュー対応**: レビュー指摘への修正

メインエージェントが行うのは：
- タスク分析と優先順位付け
- ワーカーのスポーン・監視
- レビューサブエージェントのスポーン
- 人間への判断依頼（スコープ外の問題や判断が必要な場合）
- マージとROADMAP更新

## Steps

### 1. Task Analysis

- spec/tasks/ROADMAP.md の "Todo" タスクを確認
- 依存グラフから並列実行可能なタスクを特定
- 最大4並列まで

### 2. Spawn Workers

各タスクごとにAgentツール（worktree isolation）でサブエージェントをスポーン:

```
Agent(
  subagent_type: "general-purpose",
  isolation: "worktree",
  prompt: "/code-with-task <task-keyword>"
)
```

独立したタスクは並列にスポーンする。依存関係のあるタスクは前段の完了を待つ。

### 3. Monitor Progress

各ワーカーの完了を待ち、結果を確認:
- PR作成の成否
- テスト結果
- エラーの有無

### 4. Review-Fix Loop

ワーカーがPRを作成したら、レビュー→対応→再レビューのループを回す:

#### 4a. レビューサブエージェントをスポーン

```
Agent(
  subagent_type: "general-purpose",
  prompt: "/review-pr-local <PR番号>"
)
```

レビューエージェントは spec 準拠・正確性・テストカバレッジ・型安全性・パフォーマンス・コード品質の全観点からレビューし、PR に comment を投稿する。

#### 4b. Verdict に応じた分岐

- **LGTM**: ループ終了 → Step 5 へ
- **NEEDS_CHANGES**: 対応サブエージェントをスポーン → 4c へ
- **スコープ外の問題や判断が必要**: 人間に報告して判断を仰ぐ

#### 4c. 対応サブエージェントをスポーン

```
Agent(
  subagent_type: "general-purpose",
  isolation: "worktree",  # PR のブランチの worktree を使用
  prompt: "PR #<番号> のレビューコメントを確認し、全ての指摘に対応してください。
    Minor な品質向上の指摘も含めて全て対応すること。
    対応後に push してください。
    gh pr view <番号> --comments でコメントを確認。"
)
```

#### 4d. 再レビュー

対応完了後、4a に戻りレビューサブエージェントを再スポーン。
ループは verdict が LGTM になるまで繰り返す。

### 5. Merge

レビューループが LGTM で完了したら:
1. 人間にマージ承認を求める
2. 承認後マージ（`/merge-pr <PR番号>`）

### 6. Post-Merge (main branch)

マージ後にmainブランチで:
- ROADMAP.md のステータス更新
- タスクファイルを `spec/tasks/completed/` へ移動
- 次の依存タスクのスポーンを検討

## Dependency Graph Reference

```
Phase 1 (key) ──→ Phase 3 (single) ──→ Phase 4 (bracket)
                        ↑                      ↓
Phase 2 (locator) ──────┘               Phase 11 (plugin) ←── Phase 5 (inline)
                                               ↑
Phase 6 (yaml) ──→ Phase 7 (resolver) ──→ Phase 8 (bib loader)
                                               ↓
                                         Phase 9 (citation fmt)
                                               ↓
                                         Phase 10 (bibliography fmt)
```

独立して開始可能: Phase 0, 1, 2, 6, 7
