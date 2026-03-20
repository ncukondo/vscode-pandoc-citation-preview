---
name: cleanup-roadmap
description: Cleans up completed phases in ROADMAP, moving relevant info to specs or docs.
---

# Cleanup ROADMAP

ROADMAP.mdの完了済みフェーズを整理します。完了したタスクファイルが `spec/tasks/completed/` に移動済みであることを確認し、ROADMAPのステータスを更新します。

## Steps

### 1. Check Completed Tasks

```bash
ls spec/tasks/completed/
```

### 2. Verify ROADMAP Consistency

ROADMAP.md のステータスと実際の状態を照合:
- `completed/` にあるタスクは "Done" になっているか
- アクティブなタスクの状態は正しいか
- PRがマージ済みのタスクは "Done" に更新されているか

### 3. Update ROADMAP

不整合があれば修正し、commit。
