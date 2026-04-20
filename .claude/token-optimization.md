# トークン最適化プロジェクト

作成日: 2026-04-20
目的: Max $100/月 の使用効率向上。セッションあたりの作業量を増やす。

---

## Phase 0: 現状数値（2026-04-20 計測）

### Claude Code バージョン
v2.1.114

### CLAUDE.md 自動読み込みファイル一覧

| ファイル | words | 推定tokens |
|---------|-------|-----------|
| ~/.claude/CLAUDE.md | 22 | 30 |
| ~/.claude/RTK.md（@参照） | 138 | 180 |
| /Developer/CLAUDE.md | 136 | 350 |
| /Developer/.claude/rules/git-workflow.md | 28 | 70 |
| /Developer/.claude/rules/quality.md | 16 | 40 |
| /Developer/.claude/rules/wp-theme.md | 21 | 50 |
| /Developer/novatech-siteon-skills/.claude/CLAUDE.md | 666 | 1,600 |
| **合計** | **1,027** | **~2,320** |

### novatech-siteon-skills .claude/ 配下（随時参照）

| ファイル | words |
|---------|-------|
| rules.md | 1,498 |
| shared-context.md | 930 |
| siteon-workflow.md | 697 |
| agent-operations.md | 486 |
| mobile-ops.md | 393 |
| quality.md | 286 |
| sales-playbook.md | 264 |
| current-state.md | 254 |
| client-management.md | 248 |
| quality-standards.md | 215 |
| git-workflow.md | 137 |
| business-rules.md | 107 |
| lessons.md | 76 |

### MCP 状況
- Notion/Figma/Slack 等: Claude.ai プロジェクトレベル管理（ローカル非管理）
- html-to-design: ローカル URL 型
- plugins: codex@openai-codex v1.0.2 / claude-mem@thedotmack v12.1.0

### Phase 2 判断
Context Mode（mksglu/context-mode）はスキップ。
理由: 主要 MCP が Claude.ai 管理で Context Mode 効果ゼロ。Phase 3 CLAUDE.md 圧縮の ROI が確実。

---

## Phase 1: ベースライン計測（2026-04-20）

### 計測プロトコル
- 標準タスク: Notion タスク一覧 DB から未完了タスク全件取得
- /context: 新規セッション開始直後の初期ロードトークン（Yuichi が UI で確認）
- /cost: 標準タスク実行後（Yuichi が UI で確認）

### 標準タスク出力（Before）

**実行日**: 2026-04-20
**タスク**: Notion タスク一覧 DB 未完了タスク全件取得（filter: 未着手 OR 進行中）

| 指標 | 計測値 |
|------|--------|
| 取得件数 | **77件** |
| API レスポンスサイズ | **160,776 文字 / 181,635 バイト** |
| 推定トークン（全処理時） | **~40,000 tokens** |
| 備考 | 出力が上限超過→ファイル保存→Read が必要（追加コスト発生） |

**重要な発見**: このクエリ1回で ~40,000 tokens 相当の出力が発生する。  
→ 毎セッションの CLAUDE.md オーバーヘッド（~2,320 tokens）の **約17倍**。  
→ Notion MCP の大量取得クエリが最大のコスト要因。

**改善余地**:
- `page_size` を 100 → 20〜30 に絞る
- `filter_properties` で必要カラムのみ取得（title/ステータス/優先度のみ）
- 全件取得を避け、優先度別・カテゴリ別に分けて小口クエリにする

### /context 初期ロード（Before）
※ Yuichi が次回新規セッション開始時に /context を打って記録

| 項目 | Before | After（Phase 3 後） |
|------|--------|-------------------|
| 初期ロード推定 | ~2,320 tokens | — |
| /context 実測 | （要記録） | — |
| 標準タスク・生 API 出力 | ~40,000 tokens | — |
| 標準タスク /cost | （要記録） | — |

---

## Phase 3: CLAUDE.md 圧縮（実施予定）

### 圧縮対象（優先順位順）

1. `novatech-siteon-skills/.claude/CLAUDE.md`（666 words → 目標 250〜300 words）
2. `/Developer/CLAUDE.md`（136 words → 目標 80〜100 words）
3. `~/.claude/RTK.md`（138 words → 目標 80〜90 words）

### 圧縮方針（Yuichi 承認済み）

**削減対象:**
- cc-company 組織表 → 「詳細は agent-operations.md」1行に
- ルール参照順の説明文 → パスのみ残す
- プロジェクト概要・リポジトリ構成 → shared-context.md にあるため削除

**保持必須:**
- 振り分けフローの核心（Yuichi → CEO → 各部署）
- ファイル参照順リスト（パスのみ）
- 部署分担の1行サマリ
- 絶対ルール6項目

### 圧縮前後サマリー

| ファイル | Before | After | 削減率 |
|---------|--------|-------|--------|
| skills/CLAUDE.md | 666 words / ~1,600 tokens | — | — |
| Developer/CLAUDE.md | 136 words / ~350 tokens | — | — |
| RTK.md | 138 words / ~180 tokens | — | — |
| **合計** | **940 words / ~2,130 tokens** | — | — |

---

## Phase 4: 効果測定（実施予定）

Phase 3 完了後、Phase 1 と同じプロトコルで再計測して比較表を更新する。

---

## ロールバック手順

```bash
# バックアップから復元
cp ~/.claude/RTK.original.md ~/.claude/RTK.md
cp /Users/satouyuuichi/Developer/CLAUDE.original.md /Users/satouyuuichi/Developer/CLAUDE.md
cp /Users/satouyuuichi/Developer/novatech-siteon-skills/.claude/CLAUDE.original.md \
   /Users/satouyuuichi/Developer/novatech-siteon-skills/.claude/CLAUDE.md
```
