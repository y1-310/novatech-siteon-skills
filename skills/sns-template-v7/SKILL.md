---
name: sns-template-v7
description: Instagram/SNS向け投稿画像をHTMLテンプレートから生成するスキル。data/*.jsonを受け取りscripts/render.jsでPNG/WebP出力する。バッチ生成・GitHub Actions自動化に対応。SNS画像生成・投稿素材作成タスクで使用する。
---

# sns-template-v7 スキル

NovaTech/SateOn SNS画像生成の公式スキル（v7）。

## 使い方
1. post.json を作成（data/ 配下、またはCIによる自動生成）
2. validate.js で検証
3. render.js で4ページ画像生成
4. generate-webp.js でWebP変換（アーカイブ用）
5. novatech-siteon-business/sns/images/ に配置

## 前提ドキュメント
- Notion「SNS画像テンプレ v7 設計書」https://www.notion.so/344fbbb9a76181348b1dfc5acc97694e
- Notion「SNS v7 実装仕様書」https://www.notion.so/345fbbb9a76181ef85c8d136db44763d
- Notion「Claude Code向け実装指示書」https://www.notion.so/345fbbb9a761813c9ecdd3e3b11ac057

## コマンド
```bash
# 単一生成
node scripts/render.js data/<file>.json

# バッチ生成
node scripts/render.js data/*.json

# 検証のみ
node scripts/validate.js data/<file>.json

# WebP変換
node scripts/generate-webp.js output/
```

## テンプレート体系
| テンプレID | post_axis | 用途 |
|-----------|-----------|------|
| T1 | attraction_hint | 集客ヒント（セージ背景） |
| T2 | attraction_hint | 集客ヒント（チャコール背景） |
| T3 | attraction_hint | 集客ヒント（グレージュ背景） |
| T4 | case_study | salon制作事例 |
| T5 | case_study | restaurant制作事例 |
| T6 | case_study | architect制作事例 |
| T7 | case_study | corporate制作事例 |
| T8 | case_study | barber制作事例 |
| T9 | case_study | nail-esthe制作事例 |
| T10 | case_study | salon-group制作事例 |
| T11 | service_intro | サービス紹介 |

## 依存パッケージ
puppeteer / sharp / ajv / ajv-formats（qrcodeは不要）

## フォントルール
- Google Fonts CDN使用
- `display=block` 必須（`swap` 禁止）
- Puppeteerは `document.fonts.ready` を待機
- `networkidle0` との二重待機が必須
