# lp-corporate マルチページ設計（プロ・プレミアム用）

## 5ページ構成

| ページ | ファイル名 | 内容 |
|--------|-----------|------|
| トップ | index.html | ヒーロー＋事業要約＋サービスプレビュー＋代表者顔出し＋CTA。超ミニマルも選択可 |
| About | about.html | 事業理念全文＋強み（Strength）＋代表紹介・チーム |
| Service | service.html | サービス一覧＋料金表＋対応範囲＋FAQ導線 |
| Works | works.html | 実績・事例一覧＋代表事例詳細＋お客様の声 |
| Info | info.html | 会社概要＋Maps＋相談導線＋FAQ＋お知らせ |

＋追加ページ：
- サービス個別ページ（オプション：service/slug.html 等）
- 実績個別ページ（オプション：works/slug.html 等）
- ブログ（別枠：静的HTML推奨 or microCMS）
- お知らせ詳細ページ
- プライバシーポリシー（フォーム設置時必須）

## index.html（トップページ）

1ページ版（sections.md）のセクションを要約版で再構成。

```
Hero（フル）
  ↓
About / Mission（要約：1段＋「もっと読む」→about.html）
  ↓
Service Preview（主要サービス3〜4つ＋「詳しく見る」→service.html）
  ↓
Strength Preview（強み3つ）
  ↓
Profile Preview（代表写真＋肩書き＋「詳しく見る」→about.html#profile）
  ↓
Works Preview（事例3件＋「もっと見る」→works.html）
  ↓
Company Summary（住所＋Maps＋「詳しく見る」→info.html）
  ↓
CTA
  ↓
Footer
```

### ナビゲーション

```html
<nav class="nav" role="navigation" aria-label="メインナビゲーション">
  <a href="/" class="nav-logo" lang="en">{サイト名}</a>
  <ul class="nav-links">
    <li><a href="about.html" lang="en">About</a></li>
    <li><a href="service.html" lang="en">Service</a></li>
    <li><a href="works.html" lang="en">Works</a></li>
    <li><a href="info.html" lang="en">Info</a></li>
  </ul>
  <a href="info.html#contact" class="btn btn-nav" lang="en">Contact</a>
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
About / Mission（フル版：3パターンから選択）
  ↓
Strength（全項目）
  ↓
Profile / Team（全スタッフ詳細＋経歴＋資格）
  ↓
CTA
  ↓
Footer
```

## service.html

```
Header + Nav
  ↓
Page Hero
  ↓
Service（タブ切り替え式全サービス）
  ├── 料金表示（Q10.5＝あり）
  ├── 応相談表示（Q10.5＝応相談のみ表示）
  ├── 対応範囲表示（任意）
  └── 成果物例（任意）
  ↓
Flow（Q18選択時）
  ↓
FAQ（Q18選択時）
  ↓
CTA
  ↓
Footer
```

## works.html

```
Header + Nav
  ↓
Page Hero
  ↓
Works / Case Study（実績一覧）
  ├── カテゴリフィルター（業種 or 支援内容）
  └── 成果サマリー表示
  ↓
Testimonial（Q18選択時）
  ↓
Media（Q18選択時）
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
Company / Info（住所・営業時間・定休日・電話・支払い方法）
  ↓
Google Maps
  ↓
News（Q18選択時）
  ↓
Contact / CTA（問い合わせUI）
  ↓
Recruit（Q18選択時）
  ↓
FAQ（Q18選択時、アコーディオン形式）
  ↓
CTA
  ↓
Footer
```

## 共通ルール

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
├── 2026-04-01-tax-column.html
├── 2026-04-15-legal-note.html
└── ...
```

更新フロー：クライアントLINE → Yuichi がClaude Code指示 → 記事生成 → git push → 自動反映

### サービス個別ページ（オプション）

```
service/
├── advisory.html
├── startup-support.html
└── ...
```

内容：サービス概要 / 対応範囲 / 料金 / よくある質問 / 問い合わせボタン

### 実績個別ページ（オプション）

```
works/
├── case-01.html
├── case-02.html
└── ...
```

内容：クライアント課題 / 支援内容 / 進行フロー / 成果 / 担当コメント
