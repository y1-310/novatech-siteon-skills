---
name: vault-report
description: AI_INDEX.md から関連ノートを選択（原則2〜15ファイル）し、根拠付きレポートを Knowledge/Reports/YYYY-MM-DD-<topic>.md に生成する。使用ノートを frontmatter または末尾参照一覧に記録する。Raw を直接根拠に断定せず検証済み正本を優先する。FlipRadar現在地・設計判断・手順確認など知識ベースのレポート生成で使用する。Notionタスク状態・Git正式仕様は書き換えない。
---

# vault-report — 根拠付きレポート生成

AI_INDEX.md を入口に、必要なノートだけを選んでレポートを作る。

## 実行方法

```bash
python3 skills/vault-report/scripts/report.py \
  --vault /Users/satouyuuichi/Developer/Knowledge \
  --topic "FlipRadar現在地" \
  [--notes "Projects/FlipRadar/current.md,Decisions/index.md"]  # 省略時は AI_INDEX から自動選択
```

## 動作

1. `AI_INDEX.md` を読み、トピックに関連するノートを選ぶ（2〜15ファイル上限）
2. 選択ノートを読み、根拠付きで要点をまとめる
3. `Reports/YYYY-MM-DD-<topic>.md` に出力する
4. frontmatter `sources:` に使用ノートのパスを列挙する

## ノート選択の優先順位

1. `current.md`（現在地スナップショット）
2. `Decisions/`（確定判断）
3. `SOP/`（安定手順）
4. `Lessons/`（再発防止）
5. `Raw/`・過去ノートは「補足」として扱い、確定的な根拠にしない

## 制約

- Vault 全体を再帰読みしない（AI_INDEX.md → 対象ノートのみ）
- Raw を直接根拠に断定的記述をしない
- Notion タスク状態・Git 正式仕様を書き換えない
- レポートは `Reports/` に保存。正本（Projects/Decisions/SOP/Lessons）を上書きしない

ノート選択の詳細基準は `references/note-selection.md` を参照。
