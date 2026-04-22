# next-session-notes.md — 次回セッション着手メモ

> 最終更新: 2026-04-22
> 次回担当: Claude Code

---

## 残タスク（Phase 5-7）

### Phase 5: Developer/ フォルダ棚卸し（約20分）

```bash
tree -L 2 -a ~/Developer --gitignore
# または
find ~/Developer -maxdepth 2 -type d
```

各ディレクトリを以下で分類して Yuichi に報告:
- ✅ アクティブ: 現行運用中
- ⚠️ 要判断: 最終更新3ヶ月以上前、または用途不明
- 🗑️ 削除候補: 試作・実験の残骸、重複、古いバックアップ
- 📦 アーカイブ候補: 過去プロジェクトで日常的には不要

**重要**: 削除・アーカイブは Yuichi の明示承認後のみ実行。
削除候補は `~/Developer/_archive_YYYYMMDD/` に一時移動 → 1週間後に完全削除の方針。

### Phase 6: GitHub 保存ファイル精査（約15分）

対象リポジトリ:
- novatech-siteon-skills
- novatech-siteon-business
- novatech-siteon-client-* 全リポ

各リポジトリで確認:
- `.gitignore` の現状
- 不要ファイルの検出（`.DS_Store` / `*.log` / `.env` / `200KB超の画像` 等）
- APIキー・認証情報の誤push確認（grep検索）
- `git rm --cached` でトラッキング解除 → `.gitignore` に追記

### Phase 7: 統合テスト + 最終 commit（約10分）

1. Claude Code と Codex CLI 双方でスキル動作確認
2. `.claude/shared-context.md` の変更履歴に最終エントリを追記
3. Notion「NovaTech 現在の状態」ページ更新（参謀Claude経由）
4. `skills/.system/` の gitignore 対応（Codex が自動生成するディレクトリ）

---

## 今日動作確認済みの仕組み

| 仕組み | 状態 | 備考 |
|--------|------|------|
| Codex CLI v0.122.0 | ✅ 稼働 | `~/.npm-global/bin/codex` |
| `~/.codex/skills/` symlink | ✅ 機能 | `→ novatech-siteon-skills/skills/` |
| skills/ frontmatter | ✅ 全17件 | Codex の暗黙的呼び出し対応 |
| AGENTS.md スキル一覧 | ✅ 追記済 | 全17件を明示 |

---

## 触らないでほしいもの

- **`~/.codex/skills`** — symlink 実体。`mv` 系コマンドに注意（Codex起動中に実体ディレクトリが再作成されることがある）
- **`~/.codex/skills.backup_20260422/`** — 元の Codex Plugin スキル格納ディレクトリ。削除しない
- **`skills/.system/`** — Codex が自動生成する内部ディレクトリ。git 管理対象外（.gitignore に追加推奨）

---

## Codex CLI 起動時の注意

```bash
# 必ず novatech-siteon-skills から起動する
cd ~/Developer/novatech-siteon-skills && codex
```

- 別ディレクトリから起動しても `~/.codex/skills/` のスキルは読み込まれる（グローバル検出）
- ただし AGENTS.md の読み込みはカレントディレクトリ依存のため、プロジェクトディレクトリからの起動を推奨

---

## Phase 5 実施前に確認すること

```bash
# Developer/ の概要を先に把握
ls ~/Developer/
du -sh ~/Developer/*/
```

Yuichi に確認してから削除系コマンドを実行すること。
