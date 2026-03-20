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

メインエージェントが行うのは：
- タスク分析と優先順位付け
- ワーカーのスポーン・監視
- レビュー結果の報告
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

### 4. Review & Merge

ワーカーがPRを作成したら:
1. PRの内容を確認
2. ユーザーに報告・承認を求める
3. 承認後マージ

### 5. Post-Merge (main branch)

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
