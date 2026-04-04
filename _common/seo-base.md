# 共通SEO仕様

## メタタグ

### title パターン
```
[サロン名]｜[エリア名] [最寄り駅]の[業態]｜[特徴キーワード]
```
例：`BLOOM｜表参道 表参道駅の美容室｜髪質改善・オーガニックカラー`

### meta description
120〜160文字。エリア名・業態・特徴を含める。

### viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### canonical URL
マルチページ時に設定必須。
```html
<link rel="canonical" href="https://example.com/">
```

## OGP設定

4種 + twitter:card を必ず設定する。

```html
<meta property="og:title" content="{サロン名}｜{エリア名}の{業態}">
<meta property="og:description" content="{サロンの特徴を120文字以内で}">
<meta property="og:image" content="{OGP画像URL}">
<meta property="og:url" content="{サイトURL}">
<meta name="twitter:card" content="summary_large_image">
```

### OGP画像仕様
- サイズ：1200×630px
- テキストは中央60%以内に配置
- スタンダード・プロ：テンプレート
- プレミアム：Figmaカスタムデザイン

## JSON-LD 構造化データ

### 業態別 @type

| 業態 | @type |
|------|-------|
| 美容室 | HairSalon |
| バーバー | BarberShop |
| ネイル | NailSalon |
| エステ | BeautySalon |
| まつエク | BeautySalon |
| 多店舗 | Organization（親）+ 各店舗の @type |

### 基本構造

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "{業態別@type}",
  "name": "{サロン名}",
  "image": "{メイン画像URL}",
  "url": "{サイトURL}",
  "telephone": "{電話番号}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{住所}",
    "addressLocality": "{市区町村}",
    "addressRegion": "{都道府県}",
    "postalCode": "{郵便番号}",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{緯度}",
    "longitude": "{経度}"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "{開店時間}",
      "closes": "{閉店時間}"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{評価}",
    "reviewCount": "{口コミ件数}"
  },
  "hasMap": "{Google Maps URL}"
}
</script>
```

### FAQPage（FAQ設置時）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{質問}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{回答}"
      }
    }
  ]
}
</script>
```

## ローカルSEO対策

### Googleビジネスプロフィール（GBP）

設定必須項目：
- ビジネス名
- 住所
- 電話番号
- カテゴリ
- 営業時間
- 写真
- ウェブサイトURL
- 説明文

### NAP一貫性

**サイト内・GBP・Hot Pepper・SNS全てで完全一致。表記ゆれ禁止。**

- 「東京都渋谷区」と「渋谷区」の混在禁止
- 「03-1234-5678」と「0312345678」の混在禁止
- 英語表記と日本語表記の混在禁止

## 日本語フォント最適化

- ウェイト最小化（最大3つ：300/400/500）
- font-display: swap 必須
- preconnect 必須
- fallbackフォントスタック必須

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### 禁止フォント
Inter / Arial / Roboto / Helvetica

## SNS連携

### Instagram
小規模サロンはリンクのみ。SNS重視ならSnapWidget埋め込み。

### LINE
友だち追加ボタン設置。リッチメニューデザインをサイトと統一。

## 多言語対応の基盤

現時点では不要。将来に備えて：
- 英字ラベル＋日本語サブの二重表記を維持
- 英語要素に lang="en" を個別指定

## アクセシビリティ

### 実装必須項目
1. スキップナビゲーション
2. aria-expanded・aria-label
3. フォーカストラップ（モーダル・メニュー）
4. prefers-reduced-motion 対応
5. フォームlabel紐付け
6. alt属性ルール（日本語、内容を説明）
7. focus-visible
8. コントラスト比 4.5:1（WCAG 2.1 AA）
9. タップターゲット 44px
10. 色だけに依存しない情報伝達

## エラーハンドリング・フォールバック

| 対象 | フォールバック |
|------|-------------|
| フォント | fallbackスタック必須 |
| 画像 | bg-alt背景にaltテキスト表示 |
| JS無効時 | フェードイン→常時表示 / ナビ→フル表示 / マーキー→静止 / タブ→全展開 |
| iframe失敗時 | 電話番号フォールバック |
