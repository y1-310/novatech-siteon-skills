---
name: vault-report-note-selection
description: vault-report でのノート選択優先順位と選択基準（ASCII/日本語トークン分離スコアリング）
type: reference
---

# ノート選択基準 — vault-report

## スコアリング方式

トピックを ASCII 語と日本語語に分離してトークン化する。

```
"FlipRadar現在地"
  → ASCII tokens: ["flipradar"]
  → 日本語 tokens: ["現在地"]
```

各トークンを、リンクの **target path + alias + 同一行テキスト** に対して照合する。

| 条件 | スコア |
|---|---|
| トークンがコンテキストに含まれる（1語につき） | +2 |
| link path に `current` を含み、かつスコア > 0 | +1 |
| スコア = 0 | 除外（リンクがあっても無関係なら選ばない） |

## 適用順序

1. AI_INDEX.md の全 wikilink を行単位で走査
2. `Raw/` `Reports/` `Archive/` `.obsidian/` `.git/` 配下は自動選択しない
3. スコア降順に並べ、上位から最大 15 件を解決・選択
4. symlink の実体パスが Vault 外ならその候補を除外
5. 重複（同じ実体ファイル）は 1 件にまとめる
6. 機密検出ファイルは除外（ファイル名＋カテゴリのみ stderr 出力）
7. 残り 2 件未満 → exit 1、レポート生成しない

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
手動指定でも Vault 境界・symlink escape チェックは適用される。
