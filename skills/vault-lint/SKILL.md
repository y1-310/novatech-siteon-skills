---
name: vault-lint
description: Knowledge Vault の品質検査を行い、壊れたWikiリンク・孤立ノート・重複候補・14日以上未確認のcurrent.md・根拠/確認日なしのcurrent.md・current.mdへのタスク/担当/期限/完了チェック混入・複数ノート間の矛盾候補・機密情報らしき記述を検出して Knowledge/Reports/vault-lint-YYYY-MM-DD.md に出力する。自動修正・削除・統合は行わない。優先度の高い問題を最大3件提示する。定期メンテナンス・Vault品質確認・セッション開始時の健全性チェックで使用する。
---

# vault-lint — Vault 品質検査

検査のみ行う。ファイルの修正・削除・統合は禁止。

## 実行方法

```bash
python3 skills/vault-lint/scripts/lint.py \
  --vault /Users/satouyuuichi/Developer/Knowledge \
  [--dry-run]   # 出力ファイルを生成せずに結果をstdoutに表示
```

## 検査項目

| ID | 項目 | 説明 |
|---|---|---|
| L1 | 壊れたWikiリンク | `[[リンク]]` のターゲットファイルが存在しない |
| L2 | 孤立ノート | 他のノートからリンクされていない .md ファイル |
| L3 | 重複候補 | タイトルが類似するノートが複数存在する |
| L4 | 古い current.md | 最終更新から14日以上経過 |
| L5 | 根拠なし current.md | commit/ファイル/コマンドの根拠記述がない |
| L6 | タスク混入 | current.md に担当/期限/完了チェック(`- [ ]`)が含まれる |
| L7 | 矛盾候補 | 複数ノートで同一事実が矛盾している可能性がある |
| L8 | 機密らしき記述 | APIキー・token・password・Cookieパターンを検出 |

## 出力

```
Reports/vault-lint-YYYY-MM-DD.md
```

- 優先度 HIGH / MEDIUM / LOW で分類
- 上位3件を冒頭に「要対応」としてサマリー表示
- 自動修正は行わない。修正の指示・判断は人間が行う

## 制約

- ファイルの書き換え・削除・移動を行わない
- `--dry-run` では `Reports/` への出力も行わない
- 機密として検出した内容は報告のみ（ログへの書き出し禁止）
