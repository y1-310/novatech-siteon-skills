---
name: vault-compile
description: Knowledge/Raw/ の未整理資料を読み、概念・判断候補・手順候補・教訓候補を抽出して Knowledge/Reports/compile-proposals/ に変更提案を出力する。正本（Projects/Decisions/SOP/Lessons）は自動上書きしない。APIキー・Cookie・顧客機密を検出した場合は出力せず警告する。新規資料の取り込み・Vault整理・定期メンテナンスで使用する。
---

# vault-compile — Vault 整理提案生成

Raw 資料を読み、整理案を提案する。正本は変更しない。

## 実行方法

```bash
python3 skills/vault-compile/scripts/compile.py \
  --vault /Users/satouyuuichi/Developer/Knowledge \
  [--file Raw/specific-file.md]  # 省略時は Raw/ 全件
```

## 動作

1. `Raw/` 内の .md ファイルを読む
2. 概念・判断候補・手順候補・教訓候補を抽出する
3. 既存ノートへの [[Wikiリンク]] と出典を付ける
4. 機密パターン（APIキー・token・password・Cookie）を検出した場合は警告してスキップ
5. `Reports/compile-proposals/YYYY-MM-DD-<stem>.md` に提案を出力する

## 出力の使い方

- 提案ファイルはあくまで「案」。正本への反映は手動で行う
- `Decisions/`・`SOP/`・`Lessons/` への内容移動は人間が確認してから実施する
- 提案ファイルは `Reports/compile-proposals/` に残し、正本とは分離する

## 制約

- `Projects/`, `Decisions/`, `SOP/`, `Lessons/` を自動で書き換えない
- 機密を含む行は提案にも出力しない
- Raw ファイルは削除しない（移動・アーカイブも手動）

詳細ルールは [[SOP/information-governance]] を参照。
