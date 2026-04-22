---
name: seo-base
description: NovaTech/SITEONのSEO基本仕様（title/description/canonical/OGP四種/twitter:card/JSON-LD構造化データ・ローカルSEO・NAP一貫性・フォント最適化・アクセシビリティ10項目）。業態別スキルと組み合わせてLP生成時のSEO要素を自動配置する。検索順位に直結するため全LP生成タスクで必須参照。
---

# seo-base — 共通SEO仕様

このスキルはNovaTech/SITEONの全LP共通のSEO実装ルールです。
マスターファイル: `_common/seo-base.md`

## 主要ルール（要約）

### titleタグ形式

```
[サロン名]｜[エリア名] [最寄り駅]の[業態]｜[特徴キーワード]
```
例: `BLOOM｜表参道 表参道駅の美容室｜髪質改善・オーガニックカラー`

### meta description

120〜160文字。エリア名・業態・特徴を含める。

### OGP（4種 + twitter:card を必ず設定）

```html
<meta property="og:title" content="{サロン名}｜{エリア名}の{業態}">
<meta property="og:description" content="{特徴を120文字以内で}">
<meta property="og:image" content="{OGP画像URL}">
<meta property="og:url" content="{サイトURL}">
<meta name="twitter:card" content="summary_large_image">
```

OGP画像仕様: 1200×630px、テキストは中央60%以内に配置。

### canonical URL

マルチページ時は必ず設定:
```html
<link rel="canonical" href="https://example.com/">
```

### JSON-LD 業態別 @type

| 業態 | @type |
|------|-------|
| lp-salon | HairSalon |
| lp-barber | BarberShop |
| lp-nail-esthe | NailSalon または BeautySalon |
| lp-restaurant | Restaurant |
| lp-architect | HomeAndConstructionBusiness |
| lp-corporate | Organization |
| lp-salon-group | Organization（親）+ 各店舗の@type |

JSON-LDには name / url / telephone / address（PostalAddress） / openingHoursSpecification を必ず含める。

### ローカルSEO（NAP一貫性）

**サイト内・GBP・Hot Pepper・SNS全てで表記を完全一致させる。**
- 「東京都渋谷区」と「渋谷区」の混在禁止
- 「03-1234-5678」と「0312345678」の混在禁止

### フォント最適化

- ウェイト最大3つ（300/400/500）
- `font-display: swap` 必須
- preconnect 必須（fonts.googleapis.com / fonts.gstatic.com）
- **禁止フォント**: Inter / Arial / Roboto / Helvetica

### アクセシビリティ必須10項目

1. スキップナビゲーション
2. aria-expanded / aria-label
3. フォーカストラップ（モーダル・メニュー）
4. prefers-reduced-motion 対応
5. フォームlabel紐付け
6. alt属性（日本語・内容説明・30文字以内）
7. focus-visible
8. コントラスト比 4.5:1（WCAG 2.1 AA）
9. タップターゲット 44px
10. 色だけに依存しない情報伝達

### JS無効フォールバック

フェードイン→常時表示 / ナビ→フル表示 / マーキー→静止 / タブ→全展開

## 詳細ルール

詳細ルールは元ファイル `_common/seo-base.md` を参照してください。
JSON-LDの完全な構造、FAQPage構造化データ、SNS連携設定は元ファイルに記載されています。
このスキルを呼び出した際、Codex は元ファイルを必要に応じて併読してください。
