# NovaTech / SITEON - Claude Code メインガイド

## プロジェクト概要

NovaTech（受託制作）と SITEON（サブスク型HP制作）の統合事業環境。
サロン業態向けLP制作を起点に、飲食店・会社LP・建築へ展開予定。

## リポジトリ構成

| リポジトリ | 用途 |
|-----------|------|
| novatech-siteon-skills | スキル・ルール・共通基盤 |
| novatech-siteon-business | 顧客管理・営業資料・レポート・SNS |
| novatech-siteon-client-{名前} | クライアントサイト（1サロン1リポ） |

## ルールファイル参照順

1. `.claude/rules.md` — 品質ルール（8カテゴリ・45項目）
2. `.claude/quality.md` — コード品質基準
3. `.claude/git-workflow.md` — Git運用ルール
4. `.claude/siteon-workflow.md` — SITEON制作フロー
5. `.claude/agent-operations.md` — Agent活用手順
6. `.claude/client-management.md` — 顧客管理手順
7. `.claude/lessons.md` — 修正パターン記録

## Claude Code と Codex の役割分担

```
Claude Code = 経営者・管理職（判断・計画・監督）
Codex       = 実務担当者（全ての出力作業）

原則：Claude Codeが1行でも文章やコードを自分で書こうとしたら、
     それはCodexに任せるべき作業。
```

### Claude Code の担当

- 何をやるか決める（計画）
- どの方法が最適か選ぶ（判断）
- Codexに具体的な指示を出す（指示）
- Codexの出力をチェックする（監督）
- git操作・API呼び出しを実行する（実行）
- エラーの原因を分析する（分析）
- 顧客ステータスを管理する（管理）

### Codex の担当（全ての出力作業）

- HTML/CSS/JS サイト生成
- JSON データ生成・整形
- Markdown ドキュメント
- メール文面・営業DM・提案書・見積書
- SEOテキスト（title/description/JSON-LD）
- SNS投稿文・ブログ記事
- 口コミ返信文
- 法的文書テンプレート
- FAQ・コンセプト文・キャッチコピー
- サロンカルテの整形
- Googleフォームの質問項目テキスト

### Plusプランでの段階的運用

| フェーズ | 条件 | 運用 |
|---------|------|------|
| 1 | 今〜成約3件 | サイト生成・大量DM→Codex、短い文書→Claude Code許容 |
| 2 | 成約3件超 | 全出力作業をCodexに委任（月$200はSITEON3件分で回収） |
| 3 | 成約10件超 | Pro継続 or APIキー（使用量で判断） |

### Codexコスト節約策

- 軽い作業はgpt-5.4-miniを使う
- 1回で正確に出力させる（やり直しがクレジットの無駄）
- AGENTS.mdで事前ルール設定→出力品質UP
- 複数の小さな依頼を1回にまとめる

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
| クライアントサイトリポ | novatech-siteon-client-{サロン名英語小文字} | novatech-siteon-client-bloom |
| 顧客JSON内のID | 3桁連番 | 001, 002, 003 |
| レポートファイル | YYYY-MM-{種類}.md | 2026-04-monthly.md |
| SNS投稿ファイル | YYYY-MM-DD-{プラットフォーム}.md | 2026-04-15-instagram.md |
| ブランチ名 | main のみ | main |
| コミットメッセージ | v{番号} {要約} | v1.2 メニュー価格更新 |

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
/salon-interview / /lp-salon / /lp-barber / /lp-nail-esthe / /lp-salon-group

### 保険として残す
/wp-theme — WordPress案件が来た場合の特別対応用
