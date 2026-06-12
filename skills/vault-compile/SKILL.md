---
name: vault-compile
description: Knowledge/Raw/ の未整理資料から概念・判断候補・手順候補・教訓候補を抽出し Reports/compile-proposals/ に提案を出力する。--file は Raw/ 配下のみ指定可能（../・絶対パス・symlink逸脱は exit 1）。Projects/Decisions/SOP/Lessons 指定時は exit 1。機密検出時はカテゴリのみ出力してスキップ。--dry-run では Reports/ に書かない。
---

# vault-compile — Vault 整理提案生成

Raw 資料を読み、整理案を提案する。正本は変更しない。

## 実行方法

```bash
python3 skills/vault-compile/scripts/compile.py \
  --vault /Users/satouyuuichi/Developer/Knowledge \
  [--file specific-file.md]  # Raw/ 相対パス。省略時は Raw/ 全件
  [--dry-run]                # Reports/ に書かず stdout に表示
```

## --file パス検証

- 引数は Raw/ 配下の相対パスとして解決する
- `../` による Raw/ 外参照は拒否して exit 1
- 絶対パスが Raw/ 外を指す場合は拒否して exit 1
- シンボリックリンクが Raw/ 外に解決される場合は拒否して exit 1
- Projects/Decisions/SOP/Lessons を指定した場合は exit 1

## 動作

1. `Raw/` 内の .md ファイルを読む
2. `vault_secrets.detect_secrets()` で機密スキャン → 検出時はカテゴリのみ stderr 出力してスキップ
3. 概念・判断候補・手順候補・教訓候補を抽出する
4. 既存ノートへの `[[Wikiリンク]]` と出典を付ける
5. `Reports/compile-proposals/YYYY-MM-DD-<stem>.md` に提案を出力する（`--dry-run` 時は stdout）

## 出力の使い方

- 提案ファイルはあくまで「案」。正本への反映は手動で行う
- `Decisions/`・`SOP/`・`Lessons/` への内容移動は人間が確認してから実施する

## 制約

- `Projects/`, `Decisions/`, `SOP/`, `Lessons/` を自動で書き換えない
- 機密の値・断片は stdout/stderr/Reports のいずれにも出力しない
- Raw ファイルは削除しない（移動・アーカイブも手動）

詳細ルールは [[SOP/information-governance]] を参照。
