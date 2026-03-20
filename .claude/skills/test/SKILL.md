---
name: test
description: Runs all tests, type checks, and build verification. Use to verify project health.
---

# Run Tests

プロジェクトのテスト・型チェック・ビルドを実行します。

## Commands

```bash
# Unit tests
npm test

# Type check
npx tsc --noEmit

# Build
npm run build
```

## Report Format

各コマンドの結果をまとめて報告:

- **Tests**: passed / failed / skipped の数
- **Type check**: エラーの有無と内容
- **Build**: 成功 / 失敗

失敗がある場合は詳細を報告してください。
