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
- **レビュー**: PRのレビュー

メインエージェントが行うのは：
- タスク分析と優先順位付け
- ワーカーのスポーン（tmux経由）・監視
- オーケストレーション管理
- レビュー結果の報告・ユーザー判断の仲介
- マージとROADMAP更新

## Architecture

各ワーカーは **独立した Claude CLI プロセス** として tmux pane で実行される。
Agent tool のサブエージェントではない。これにより:
- 各ワーカーが独自のセッション・権限を持つ
- 権限問題が発生しない
- 真の並列実行が可能

## Steps

### 1. Task Analysis

- spec/tasks/ROADMAP.md の "Todo" タスクを確認
- 依存グラフから並列実行可能なタスクを特定
- 最大4並列まで（main + 4 workers = 5 panes）

### 2. Spawn Workers

```bash
# Pane数チェック（5以上なら待つ）
tmux list-panes | wc -l

# ワーカーをスポーン
./scripts/spawn-worker.sh feat/<task-name> <task-keyword>

# レイアウト調整
./scripts/apply-layout.sh
```

spawn-worker.sh が自動で:
1. worktree 作成 (`project--worktrees/` 内)
2. npm install
3. tmux pane 作成
4. Claude CLI 起動 + プロンプト送信

### 3. Monitor Progress

```bash
# エージェント状態一覧
./scripts/monitor-agents.sh

# 特定ペインの出力確認
tmux capture-pane -t <pane-id> -p | tail -30

# タスク完了チェック
./scripts/check-task-completion.sh <branch> pr-creation
```

### 4. Implementation Complete → Review

ワーカーがPR作成完了したら:
1. PR確認: `gh pr list --head <branch>`
2. ワーカー終了: `./scripts/kill-agent.sh <pane-id>`
3. レビューア起動: `./scripts/spawn-reviewer.sh --pr <pr-number>`
4. レイアウト調整: `./scripts/apply-layout.sh`

### 5. Review Complete → Report to User

レビューア完了時:
1. レビュー確認: `gh pr view <pr-number> --comments`
2. レビューア終了: `./scripts/kill-agent.sh <pane-id>`
3. **全指摘をユーザーに報告**（minor含む）
4. ユーザーの判断を仰ぐ（マージ or 修正）

### 6. Fix (if needed)

```bash
# 修正エージェント起動
./scripts/launch-agent.sh <worktree-dir> "<fix instructions>"
```

修正完了後、再レビュー（Step 4に戻る）。

### 7. Merge (after user approval)

```bash
./scripts/merge-pr.sh <pr-number>
```

### 8. Post-Merge (main branch)

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

## Script Reference

| Script | Purpose |
|--------|---------|
| `spawn-worker.sh` | worktree作成 + ワーカー起動 |
| `spawn-reviewer.sh` | PR用レビューア起動 |
| `launch-agent.sh` | 汎用エージェント起動（pane + settings + Claude） |
| `kill-agent.sh` | エージェント停止 |
| `send-to-agent.sh` | エージェントにプロンプト送信 |
| `check-agent-state.sh` | エージェント状態確認 |
| `check-task-completion.sh` | PR/レビュー状態確認 |
| `monitor-agents.sh` | 全エージェント状態一覧 |
| `apply-layout.sh` | tmuxレイアウト調整 |
| `merge-pr.sh` | PRマージ + クリーンアップ |
