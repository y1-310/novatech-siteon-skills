# lp-salon マルチページ設計（プロ・プレミアム用）

## 5ページ構成

| ページ | ファイル名 | 内容 |
|--------|-----------|------|
| トップ | index.html | ヒーロー＋コンセプト要約＋メニュータブプレビュー＋スタッフ顔出し＋CTA。TOH型ミニマルも選択可 |
| About | about.html | コンセプト全文＋こだわり（Features）＋スタッフ紹介 |
| Menu | menu.html | タブ切り替え式全メニュー＋初回価格＋施術時間＋スタイリスト別料金 |
| Gallery | gallery.html | スタイル写真＋内装写真統合。命名選択可。ビフォーアフター。Instagram連携 |
| Info | info.html | アクセス＋Maps＋営業カレンダー＋予約UI＋FAQ＋お支払い方法＋駐車場＋道順 |

＋追加ページ：
- ブログ（別枠：静的HTML推奨 or microCMS）
- スタッフ個別ページ（オプション：staff/1.html等）
- プライバシーポリシー（フォーム設置時必須）
- 特定商取引法表記（EC時必須）

## index.html（トップページ）

1ページ版（sections.md）のセクションを要約版で再構成。

```
Hero（フル）
  ↓
Concept（要約：1段＋「もっと読む」→about.html）
  ↓
Menu Preview（人気メニュー3〜4つ＋「全メニューを見る」→menu.html）
  ↓
Style Gallery Preview（4〜6枚＋「もっと見る」→gallery.html）
  ↓
Staff Preview（顔写真＋名前のみ＋「詳しく見る」→about.html#staff）
  ↓
Access Summary（住所＋Maps＋「詳しく見る」→info.html）
  ↓
CTA
  ↓
Footer
```

### ナビゲーション

```html
<nav class="nav" role="navigation" aria-label="メインナビゲーション">
  <a href="/" class="nav-logo" lang="en">{サロン名}</a>
  <ul class="nav-links">
    <li><a href="about.html" lang="en">About</a></li>
    <li><a href="menu.html" lang="en">Menu</a></li>
    <li><a href="gallery.html" lang="en">Gallery</a></li>
    <li><a href="info.html" lang="en">Info</a></li>
  </ul>
  <a href="info.html#reservation" class="btn btn-nav" lang="en">Reserve</a>
  <button class="nav-toggle" aria-expanded="false" aria-label="メニューを開く">
    <span class="hamburger"></span>
  </button>
</nav>
```

## about.html

```
Header + Nav
  ↓
Page Hero（小さめ：40vh、ページタイトル）
  ↓
Concept（フル版：3パターンから選択）
  ↓
Features（こだわり全項目）
  ↓
Staff（全スタッフ詳細＋メッセージ）
  ↓
CTA
  ↓
Footer
```

## menu.html

```
Header + Nav
  ↓
Page Hero
  ↓
Menu（タブ切り替え式全メニュー）
  ├── 初回価格表示（Q10.3＝あり）
  ├── 施術時間表示（Q10.7＝あり）
  ├── スタイリスト別料金（Q10.5＝あり）
  └── 「こんな方におすすめ」（任意）
  ↓
CTA
  ↓
Footer
```

## gallery.html

命名はQ17.5で決定（Gallery / Collection / Styles）。

```
Header + Nav
  ↓
Page Hero
  ↓
Style Gallery（全スタイル写真）
  ├── カテゴリフィルター（タグ or タブ）
  └── ハッシュタグ表示
  ↓
Photo Gallery（サロン内装写真）
  ↓
Before & After（Q18選択時）
  ↓
Instagram連携（SnapWidget or リンク）
  ↓
CTA
  ↓
Footer
```

## info.html

```
Header + Nav
  ↓
Page Hero
  ↓
Access（住所・営業時間・定休日・電話・お支払い方法）
  ↓
Google Maps
  ↓
駐車場情報（Q18選択時）
  ↓
道順写真（Q18選択時）
  ↓
営業カレンダー（予約UI パターンB選択時）
  ↓
Reservation（予約UI）
  ↓
FAQ（Q18選択時、アコーディオン形式）
  ↓
CTA
  ↓
Footer
```

## 共通ルール

### CSS/JS の分離（プロ・プレミアムのみ可）

スタンダードは単一HTML（rules.md #29）だが、プロ以上の複数ページ構成では共通スタイル・スクリプトの重複を避けるため外部ファイル化を許可する。

```
assets/
├── styles.css   ← 全ページ共通CSS（CSS変数定義 + コンポーネント）
└── scripts.js   ← 全ページ共通JS（fade-in / nav-toggle / tabs）
```

各ページの `<head>` から相対パスで読み込む。`preload` でフォントと styles.css を先読み。

### canonical URL
全ページに設定。
```html
<link rel="canonical" href="https://{ドメイン}/{ページ名}.html">
```

### ページ間リンクの一貫性
- 全ページに同じヘッダー・フッター
- モバイルハンバーガーメニュー共通
- パンくずリストは不要（5ページ程度では冗長）

### ブログ機能

推奨：静的HTMLブログ
```
blog/
├── index.html    ← 記事一覧
├── 2026-04-01-spring-color.html
├── 2026-04-15-hair-care.html
└── ...
```

更新フロー：クライアントLINE → Yuichi がClaude Code指示 → 記事生成 → git push → 自動反映

### スタッフ個別ページ（オプション）

```
staff/
├── 1.html  ← スタッフ1
├── 2.html  ← スタッフ2
└── ...
```

内容：大きなプロフィール写真 / 経歴・得意スタイル / スタイルギャラリー / 指名予約ボタン
