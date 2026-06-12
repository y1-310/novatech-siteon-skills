---
name: vault-lint
description: Knowledge Vault の品質検査を行い、壊れたWikiリンク・孤立ノート・重複候補（タイトル指紋一致）・14日以上未確認のcurrent.md・根拠なしcurrent.md・タスク混入・矛盾候補・機密情報を検出する。HIGH>0のとき exit 1。機密は検出カテゴリのみ出力し、値・断片は一切出さない。定期メンテナンス・Vault品質確認で使用する。
---

# vault-lint — Vault 品質検査

検査のみ行う。ファイルの修正・削除・統合は禁止。

## 実行方法

```bash
python3 skills/vault-lint/scripts/lint.py \
  --vault /Users/satouyuuichi/Developer/Knowledge \
  [--dry-run]   # Reports/ への出力なし。結果をstdoutに表示
```

## 検査項目

| ID | 項目 | 説明 |
|---|---|---|
| L1 | 壊れたWikiリンク | `[[リンク]]` のターゲットファイルが存在しない |
| L2 | 孤立ノート | 他のノートからリンクされていない .md ファイル |
| L3 | 重複候補 | 同名ファイルでH1タイトルも一致（current/indexは除外） |
| L4 | 古い current.md | 最終更新から14日以上経過 |
| L5 | 根拠なし current.md | commit/ファイル/URL の根拠記述がない |
| L6 | タスク混入 | current.md にタスク/担当/期限記述を検出 |
| L7 | 矛盾候補 | 同一ファイルに複数の列数記述など |
| L8 | 機密らしき記述 | 検出カテゴリのみ出力。値・断片は出力しない |

## L4 日付判定ルール

1. `最終更新: YYYY-MM-DD` または `最終確認: YYYY-MM-DD` ラベルを優先
2. ラベルがない場合のみ mtime を使用
3. `決定日` やコミット日は最終更新日として使わない

## L8 検出パターン

api_key / token / password / bearer / OpenAI sk- / JWT / Slack xox{b,p,a,s} /
GitHub ghp_ / github_pat_ / AWS AKIA/ASIA / Google AIza / PEM private key /
Set-Cookie / Cookie (HTTP header) / sessionid

## 出力

```
Reports/vault-lint-YYYY-MM-DD.md
```

- 優先度 HIGH / MEDIUM / LOW で分類
- 上位3件を冒頭に「要対応」として表示
- HIGH > 0 のとき exit 1

## 制約

- ファイルの書き換え・削除・移動を行わない
- `--dry-run` では `Reports/` への出力も行わない
- 機密の値・断片は stdout/stderr/Reports を含むいかなる出力にも含めない
