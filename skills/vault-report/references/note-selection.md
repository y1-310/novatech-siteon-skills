---
name: vault-report-note-selection
description: vault-report でのノート選択優先順位と選択基準
type: reference
---

# ノート選択基準 — vault-report

## 優先順位

| 優先度 | パス | 理由 |
|---|---|---|
| 1 | `*/current.md` | 最新の現在地スナップショット。トピックに関係なく最初に選ぶ |
| 2 | `Decisions/` 配下 | 確定した判断。確実な根拠になる |
| 3 | `SOP/` 配下 | 安定した手順書。変更頻度が低い |
| 4 | `Lessons/` 配下 | 再発防止・教訓。設計判断の背景になる |
| 5 | `Raw/` | 未整理資料。「補足」として扱い断定的根拠にしない |
| 6 | `Reports/` | 過去レポート。再帰参照に注意 |

## 選択ルール

- **上限15ファイル、最低2ファイル**
- AI_INDEX.md のリンクを起点に、トピックキーワードと一致度でスコアリング
- `current.md` は +3点（優先取得）
- トピックキーワードとの部分一致で +2点/ワード
- スコア 0 のノートは選ばない（AI_INDEX にリンクがあっても無関係なら除外）

## 禁止

- Vault 全体を再帰読みしない（AI_INDEX.md → 対象ノートのみ）
- `Raw/` を単独の確定根拠にしない
- `Reports/` 内の過去レポートを再帰的に読まない（循環参照）
- Notion タスク状態・Git 正式仕様を書き換えない

## 手動指定

```bash
python3 skills/vault-report/scripts/report.py \
  --vault /Users/satouyuuichi/Developer/Knowledge \
  --topic "FlipRadar現在地" \
  --notes "Projects/FlipRadar/current.md,Decisions/index.md"
```

`--notes` を指定した場合は AI_INDEX.md スコアリングをスキップし、指定ノートのみ使用する。
