# Pandoc Citation Preview - VS Code Extension

VS Code の組み込み Markdown Preview を拡張し、Pandoc 形式の引用（`@key`, `[@key]`）をサポートする拡張機能。

## Quick Reference

| Item | Location |
|------|----------|
| Spec index | `spec/_index.md` (存在すれば) |
| ADRs | `spec/decisions/` |
| Tasks | `spec/tasks/` |
| ROADMAP | `spec/tasks/ROADMAP.md` |
| Source | `src/` |

## Work Guidelines

- **常に `spec/tasks/ROADMAP.md` を起点に作業を開始する**
- タスクファイルの TDD ステップに従って実装
- ステップ完了毎にcommit
- Context window の残量に注意し、compact が必要になる前に作業を中断

## Commands

```bash
npm test          # vitest でユニットテスト
npm run build     # esbuild でビルド
npm run watch     # watch モード
npx tsc --noEmit  # 型チェック
```

## Project Structure

```
src/
  extension.ts          # VS Code extension entry point
  parser/               # Citation syntax parsers
  metadata/             # YAML metadata extraction
  resolver/             # File path resolution, bibliography loading
  renderer/             # Citation & bibliography rendering
  plugin.ts             # markdown-it plugin integration
spec/
  decisions/            # Architecture Decision Records
  tasks/                # Task files (TDD)
    completed/          # Completed tasks
    ROADMAP.md          # Progress tracking
```

## Parallel Development

- 並列作業は git worktree を使用
- worktree は `vscode-pandoc-citation-preview--worktrees/` 内に作成
- ワーカーは実装・テスト・PR作成まで、マージとROADMAP更新はmainブランチで行う
