# NovaTech / SITEON - Claude Code メインガイド

## cc-company 組織構成

Yuichiから業務指示を受けたら、CEO が `.claude/agent-operations.md` の振り分けフローに従い
Task ツールで適切な部署長サブエージェントを起動する。判断に迷った場合はYuichiに確認する。

| 役職 | モデル | 担当 |
|------|--------|------|
| CEO | Claude Code Opus 4.7（メイン） | 意思決定・計画・監督・品質チェック・振り分け |
| 営業・リサーチ部長 | Opus 4.6 サブ → Kimi K2.5 を道具 | 市場調査・DM生成・競合分析・事業者カルテ作成 |
| 制作・品質部長 | Opus 4.6 サブ → Codex を道具 | コード生成・大量テキスト出力・品質チェック |
| マーケ・運営部長 | Opus 4.6 サブ → Kimi を道具（顧客5件超で稼働） | SNS運用・月次保守・GBP運用 |
| 秘書室 | Opus 4.6 サブ → Notion/Calendar/Gmail MCP | 情報集約・日次ブリーフ・状態管理 |

詳細な振り分けフローと部署間連携ルール → `.claude/agent-operations.md`
各部署長指示書 → `.claude/agents/` ディレクトリ
Notion クエリルール（秘書室用） → `.claude/notion-query-rules.md`

---

## プロジェクト概要

NovaTech（受託制作）と SITEON（サブスク型HP制作）の統合事業環境。
サロン業態向けLP制作を起点に、飲食店・会社LP・建築へ展開予定。

## リポジトリ構成

| リポジトリ | 用途 |
|-----------|------|
| novatech-siteon-skills | スキル・ルール・共通基盤 |
| novatech-siteon-business | 顧客管理・営業資料・レポート・SNS |
| novatech-siteon-client-{名前} | クライアントサイト（1クライアント1リポ） |

## ルールファイル参照順

1. `.claude/rules.md` — 品質ルール（8カテゴリ・45項目）
2. `.claude/quality.md` — コード品質基準
3. `.claude/git-workflow.md` — Git運用ルール
4. `.claude/siteon-workflow.md` — SITEON制作フロー
5. `.claude/agent-operations.md` — Agent活用手順
6. `.claude/client-management.md` — 顧客管理手順
7. `.claude/lessons.md` — 修正パターン記録

## cc-company サブエージェント構造

```
CEO (Claude Code Opus 4.7) = 振り分け・最終判断・監督
  └─ Task ツールで部署長サブ起動 (Opus 4.6)
     ├─ 営業・リサーチ部長 → Kimi K2.5 を道具（市場調査・DM・事業者カルテ）
     ├─ 制作・品質部長    → Codex/Kimi を道具（コード生成・全テキスト出力）
     ├─ マーケ・運営部長  → Kimi/Puppeteer を道具（顧客5件超で稼働）
     └─ 秘書室           → Notion/Calendar/Gmail MCP（情報集約・日次ブリーフ）

原則：CEO が1行でも出力しようとしたら、それは部署長に任せるべき作業。
```

### CEO の担当

- タスクを受け取り、適切な部署長へ振り分ける（振り分け）
- 何をやるか決める（計画）
- 最適な方法を選ぶ（判断）
- 部署長サブエージェントに具体的な指示を出す（指示）
- 部署長の出力をチェックする（監督）
- git操作・API呼び出しを実行する（実行）
- エラーの原因を分析する（分析）
- 顧客ステータスを管理する（管理）

### 各部署長の担当（全ての出力作業）

| 部署長 | 担当作業 | 使う道具 |
|--------|---------|---------|
| 営業・リサーチ部長 | 事業者リスト生成・カルテ作成・DM一括生成・市場調査 | Kimi K2.5 |
| 制作・品質部長 | HTML/CSS/JS生成・コンセプト文・見積書・SEOテキスト等全出力 | Codex / Kimi |
| マーケ・運営部長 | SNS投稿生成・月次保守・GBP運用 | Kimi / Puppeteer |
| 秘書室 | 日次ブリーフ・Notion更新・current-state.md保守 | Notion MCP |

各指示書の完全仕様 → `.claude/agents/` ディレクトリ

### コスト管理

- 全サブエージェント: Opus 4.6 / CEO: Opus 4.7
- 制作部内の軽いタスクは gpt-5.4-mini を使う
- 1回で正確に出力させる（やり直しがコストの無駄）
- 秘書室の Notion 取得は `.claude/notion-query-rules.md` Pattern A/B/C を厳守

## スキル間の連携フロー

```
/client-site 実行
  ↓
「業種は？」→ サロン / 飲食店 / 会社LP / 建築
  ↓
サロンを選択 → salon-interview が起動
  ↓
Round 0-5 のヒアリング実施
  ↓
業態判定 → lp-salon / lp-barber / lp-nail-esthe / lp-salon-group
  ↓
スキルでサイト生成（プラン判定→参照ファイル分岐）
  ↓
品質チェック（/seo-check + /web-design-reviewer + Lighthouse）
  ↓
プレビュー → 修正ループ → /deploy
```

## プラン別の参照ファイル分岐

```
スタンダード → SKILL.md + design-system.md + sections.md
プロ         → 上記 + multipage.md
プレミアム   → 上記 + multipage.md + premium.md
```

## ファイル保存場所ルール

| データの種類 | 保存先 | GitHub |
|------------|--------|--------|
| スキル・ルール・共通基盤 | novatech-siteon-skills/ | ✅ |
| 顧客管理JSON | novatech-siteon-business/clients/ | ✅ |
| 月次レポート | novatech-siteon-business/reports/ | ✅ |
| 営業資料・DM文面 | novatech-siteon-business/sales/ | ✅ |
| SNS投稿コンテンツ | novatech-siteon-business/sns/ | ✅ |
| クライアントサイト | novatech-siteon-client-{名前}/ | ✅ |
| Codexグローバル設定 | ~/.codex/config.toml | ❌ ローカル |
| APIキー・認証情報 | ローカル | ❌ |
| 契約書・請求書 | Google Drive | ❌ |
| クライアント写真（大容量） | Google Drive | ❌ |

## 命名ルール

| 対象 | 命名規則 | 例 |
|------|---------|-----|
| クライアントサイトリポ | novatech-siteon-client-{クライアント名英語小文字} | novatech-siteon-client-bloom |
| 顧客JSON内のID | 3桁連番 | 001, 002, 003 |
| レポートファイル | YYYY-MM-{種類}.md | 2026-04-monthly.md |
| SNS投稿ファイル | YYYY-MM-DD-{プラットフォーム}.md | 2026-04-15-instagram.md |
| ブランチ名 | main のみ | main |
| コミットメッセージ | v{番号} {要約} | v1.2 メニュー価格更新 |

## 外部AI連携ツール

### Kimi K2.5 CLI (`tools/kimi.js`)

```bash
# 基本（Thinkingモード）
node tools/kimi.js "質問内容"

# 高速モード（Instantモード）
node tools/kimi.js --instant "質問内容"

# ファイル添付
node tools/kimi.js --file data.json "このデータを分析して"
```

- **要件**: `MOONSHOT_API_KEY` 環境変数が必要
- **モデル**: `kimi-k2-5`（Moonshot AI）
- **システムプロンプト**: `.claude/shared-context.md` を自動注入
- **OpenAI互換**: `https://api.moonshot.ai/v1` エンドポイント

## 絶対ルール

1. 新規ファイルは保存先ルールに従う
2. Developer/ 配下以外にプロジェクトファイルを作らない
3. GitHub連携リポジトリ変更後は必ず add→commit→push
4. APIキー・パスワードは絶対にGitHubリポジトリに入れない
5. クライアントサイトは必ず novatech-siteon-client- プレフィックスを付ける
6. 大容量ファイル（画像10MB以上）はGoogle Driveに保存

## 既存スキルとの統合方針

### 残す（そのまま活用）
/clone-site / /web-design-reviewer / /seo-check / /figma-capture / /codex:rescue / /social-content / /cold-email / /seo-audit / /copywriting / /pricing-strategy / 他の汎用スキル全て

### 改修
- /client-site → 業態選択→各interviewスキルへ分岐する構造に変更
- /deploy → GitHub Pages push対応を追加
- /estimate → SITEONプラン料金表と連携

### 新規作成
/salon-interview / /lp-salon / /lp-barber / /lp-nail-esthe / /lp-salon-group / /sns-generate

## SNS画像生成（sns-template-v7）

### /sns-generate コマンド

SNS投稿画像を生成する。`skills/sns-template-v7/` スキルを使用。

```bash
# ローカル単一生成
cd /Users/satouyuuichi/Developer/novatech-siteon-skills/skills/sns-template-v7
node scripts/render.js data/<file>.json

# バッチ生成
node scripts/render.js data/*.json

# 検証のみ
node scripts/validate.js data/<file>.json

# WebP変換
node scripts/generate-webp.js output/
```

### GitHub Actions（自動化）

| ワークフロー | リポジトリ | トリガー |
|------------|-----------|---------|
| sns-generate.yml | novatech-siteon-business | sns/drafts/ へのpush |
| weekly-auto-draft.yml | novatech-siteon-business | 毎週月曜9:00 JST |
| update-demo-image.yml | 各client-* | mainブランチへのpush |

### Notion DB（フェーズ6完了）

| DB名 | URL | Secret名 |
|-----|-----|---------|
| 📈 SNS PDCA計測 | https://www.notion.so/295642c7ec0445c9b7e73e9224fd32f5 | NOTION_DB_PDCA |
| 📅 SNS投稿ネタ帳 | https://www.notion.so/23ce78f2701448eea5d6faade3f4d585 | NOTION_DB_IDEAS |

### 保険として残す
/wp-theme — WordPress案件が来た場合の特別対応用
