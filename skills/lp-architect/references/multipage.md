# lp-architect マルチページ設計（プロ・プレミアム用）

## 5ページ構成

| ページ | ファイル名 | 内容 |
|--------|-----------|------|
| トップ | index.html | ヒーロー＋コンセプト要約＋Worksプレビュー＋強み＋CTA。超ミニマルも選択可 |
| About | about.html | 設計思想全文＋強み（Features）＋代表紹介＋資格・受賞歴 |
| Works | works.html | 施工事例一覧。表示形式はグリッド / 大写真 / カテゴリタブ |
| Flow | flow.html | 家づくりの流れ＋サービス案内＋費用ガイド導線 |
| Contact | contact.html | アクセス＋Maps＋問い合わせUI＋イベント / モデルルーム / FAQ |

＋追加ページ：
- Works個別ページ（施工事例詳細）
- Awards一覧
- Blog記事
- Event詳細
- プライバシーポリシー（フォーム設置時必須）

## index.html（トップページ）

1ページ版（sections.md）のセクションを要約版で再構成。

```
Hero（フル）
  ↓
Concept（要約：1段＋「もっと読む」→about.html）
  ↓
Works Preview（代表事例3〜6件＋「全事例を見る」→works.html）
  ↓
Features Preview（強み3項目）
  ↓
About Preview（代表写真＋名前＋「詳しく見る」→about.html）
  ↓
Access Summary（住所＋Maps＋「詳しく見る」→contact.html）
  ↓
CTA
  ↓
Footer
```

### ナビゲーション

```html
<nav class="nav" role="navigation" aria-label="メインナビゲーション">
  <a href="/" class="nav-logo" lang="en">{事務所名}</a>
  <ul class="nav-links">
    <li><a href="about.html" lang="en">About</a></li>
    <li><a href="works.html" lang="en">Works</a></li>
    <li><a href="flow.html" lang="en">Flow</a></li>
    <li><a href="contact.html" lang="en">Contact</a></li>
  </ul>
  <a href="contact.html#contact-form" class="btn btn-nav" lang="en">Contact</a>
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
Features（強み全項目）
  ↓
Staff / About（代表・スタッフ詳細＋資格・受賞歴）
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
Works（表示形式選択）
  ├── グリッド一覧
  ├── 大写真＋テキスト
  ├── カテゴリタブ
  └── 各事例から個別ページへ
  ↓
Awards Preview（Q18選択時）
  ↓
CTA
  ↓
Footer
```

## flow.html

```
Header + Nav
  ↓
Page Hero
  ↓
Flow（5〜8ステップ）
  ├── 初回相談案内（Q10.3＝あり）
  ├── 期間目安表示（Q10.7＝あり）
  ├── サービス案内
  └── Cost Guide（Q18選択時）
  ↓
CTA
  ↓
Footer
```

## contact.html

```
Header + Nav
  ↓
Page Hero
  ↓
Access（住所・営業時間・定休日・電話・支払い方法）
  ↓
Google Maps
  ↓
Event（Q18選択時）
  ↓
Model Room（Q18選択時）
  ↓
Contact（問い合わせUI）
  ↓
FAQ（必要時、アコーディオン形式）
  ↓
CTA
  ↓
Footer
```

## Works個別ページ（施工事例詳細）

```
Header + Nav
  ↓
Project Hero（大写真＋事例名）
  ↓
Project Summary（所在地 / 用途 / 構造 / 面積 / 竣工年）
  ↓
Gallery（5〜12枚）
  ↓
Design Story（設計意図）
  ↓
Related Works
  ↓
CTA
  ↓
Footer
```

## Awards一覧

```
Header + Nav
  ↓
Page Hero
  ↓
Awards List（年 / 賞名 / 主催）
  ↓
CTA
  ↓
Footer
```

## Blog記事

推奨：静的HTMLブログ
```
blog/
├── index.html
├── 2026-04-01-house-planning.html
├── 2026-04-15-renovation-flow.html
└── ...
```

更新フロー：クライアントLINE → Yuichi がClaude Code指示 → 記事生成 → git push → 自動反映

## Event詳細

```
events/
├── index.html
├── open-house-2026-05.html
└── consultation-day-2026-06.html
```

内容：イベント概要 / 日時 / 会場 / 対象者 / 申込導線

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

### 施工事例個別ページ

```
works/
├── project-01.html
├── project-02.html
└── ...
```

内容：大きなファーストビュー写真 / 物件情報 / 写真ギャラリー / 設計の要点 / 関連事例
