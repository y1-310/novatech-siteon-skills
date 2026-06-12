---
name: vault-report
description: AI_INDEX.md から関連ノートを選択（スコア>0の2〜15ファイル）し、機密スキャン後に根拠付きレポートを Reports/ に生成する。Raw/Reports は自動選択対象外。機密を含むノートはスキップし、残りが2件未満なら exit 1。--dry-run では Reports/ に書かない。
---

# vault-report — 根拠付きレポート生成

AI_INDEX.md を入口に、必要なノートだけを選んでレポートを作る。

## 実行方法

```bash
python3 skills/vault-report/scripts/report.py \
  --vault /Users/satouyuuichi/Developer/Knowledge \
  --topic "FlipRadar現在地" \
  [--notes "Projects/FlipRadar/current.md,Decisions/index.md"] \
  [--dry-run]   # Reports/ に書かず stdout に表示
```

## ノート選択ルール（自動選択時）

- AI_INDEX.md のリンクからトピックワードとの一致度でスコアリング
- スコア 0 のノートは自動選択しない
- `current.md` ボーナス (+1) はスコアが既に > 0 の場合のみ加算
- `Raw/` および `Reports/` は自動選択対象外
- 最大 15 ファイル、解決できないリンクはスキップ

## --notes 指定時の制約

- Vault 配下の .md ファイルのみ指定可能
- 絶対パス・シンボリックリンクによる Vault 外参照は拒否して exit 1
- 同一ファイルの重複指定は自動除去
- Raw を指定した場合も機密スキャン必須

## 機密スキャン

全選択ノートに対して `vault_secrets.detect_secrets()` を実行する。  
機密が検出されたノートはスキップし、ファイル名とカテゴリのみ stderr に出力する。  
機密値・断片は stdout/stderr/Reports のいずれにも出力しない。  
残ったノートが 2 件未満なら exit 1 でレポートを生成しない。

## 制約

- Notion タスク状態・Git 正式仕様を書き換えない
- 正本（Projects/Decisions/SOP/Lessons）を上書きしない
- `--dry-run` では `Reports/` への出力を行わない

ノート選択の詳細基準は `references/note-selection.md` を参照。
