# lp-architect デザインシステム

## カラープリセット

### ホワイト × ナチュラル

```css
:root {
  --bg: #FAFAF8;
  --bg-alt: #F2F0EC;
  --bg-dark: #2A2824;
  --text: #2A2824;
  --text-mid: #5A5650;
  --text-light: #7A746C;
  --accent: #7A8B6F;
  --line: #E0DCD6;
  --r: 4px;
  --mw: 1080px;
}
```
英字: Cormorant Garamond
和文見出し: Noto Serif JP
本文: Noto Sans JP

### ウォーム × 木目

```css
:root {
  --bg: #F9F5EF;
  --bg-alt: #F0EAE0;
  --bg-dark: #28231C;
  --text: #28231C;
  --text-mid: #504840;
  --text-light: #786E64;
  --accent: #A67C52;
  --line: #DDD5C8;
  --r: 8px;
  --mw: 1080px;
}
```
英字: DM Serif Display
和文見出し: Noto Serif JP
本文: Noto Sans JP

### ミニマル × モノトーン

```css
:root {
  --bg: #F5F5F3;
  --bg-alt: #EBEBEA;
  --bg-dark: #1A1A1A;
  --text: #1A1A1A;
  --text-mid: #4A4A48;
  --text-light: #6E6E6C;
  --accent: #444444;
  --line: #D0D0CE;
  --r: 0px;
  --mw: 1080px;
}
```
英字: DM Sans
和文見出し: Noto Sans JP（weight: 500）
本文: Noto Sans JP

## Q13×Q14 → プリセット自動マッピング

| Q13（カラー方向性） | Q14（トーン） | プリセット |
|-------------------|-------------|-----------|
| ホワイト×ナチュラル | 静謐・上品 | ホワイト × ナチュラル |
| ホワイト×ナチュラル | 温もり・親しみ | ホワイト × ナチュラル |
| ウォーム×木目 | 温もり・親しみ | ウォーム × 木目 |
| ウォーム×木目 | 静謐・上品 | ウォーム × 木目 |
| ミニマル×モノトーン | 理知的・洗練 | ミニマル × モノトーン |
| ミニマル×モノトーン | 静謐・上品 | ミニマル × モノトーン |
| おまかせ | おまかせ | ホワイト × ナチュラル（デフォルト） |

## サブタイプ別デフォルトプリセット

| サブタイプ | デフォルトプリセット |
|-----------|-------------------|
| 設計事務所 | ホワイト × ナチュラル / ミニマル × モノトーン |
| 工務店 | ウォーム × 木目 |
| リノベーション会社 | ホワイト × ナチュラル / ウォーム × 木目 |

## タイポグラフィ仕様

| 要素 | フォント | サイズ | Weight |
|------|---------|--------|--------|
| セクションナンバー | ディスプレイフォント | 0.72rem | 400 |
| セクション英字タイトル | ディスプレイフォント | clamp(2rem, 4.5vw, 2.8rem) | 400 |
| セクション日本語サブ | 和文見出しフォント | 0.85rem | 400 |
| 本文 | Noto Sans JP | 14.5px | 300 |
| プロジェクト名 | 和文見出しフォント | 1rem | 400 |
| 所在地・構造等 | Noto Sans JP | 0.8rem | 300 |
| CTA | ディスプレイフォント | 0.9rem | 400 |

## レスポンシブ仕様

| ブレークポイント | padding | グリッド | ヒーロー |
|----------------|---------|---------|---------|
| Desktop（1280px+） | 120px | 2〜3列 | 100vh |
| Tablet（768px） | 80px | 1〜2列 | 100vh |
| Mobile（375px） | 56px | 1列 | 100vh（min-height: 520px） |

## 技術仕様

- 単一HTMLファイル（CSS/JS inline）
- Google Fonts（font-display: swap、preconnect設定）
- セマンティックHTML（header/nav/main/section/footer）
- OGPメタタグ4種＋twitter:card
- JSON-LD構造化データ（@type: ArchitecturalFirm / HomeAndConstructionBusiness）
- Lighthouse各項目90点以上目標
- 全画像にalt属性（日本語）、loading="lazy"（ヒーロー除く）、width/height指定
- canonical URL（マルチページ時）
- viewport設定

## フォント読み込みテンプレート

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family={ディスプレイフォント}:ital,wght@0,400;1,300&family={和文見出しフォント}:wght@400;500&family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet">
```

※日本語フォントは最大3ウェイト。fallbackスタック必須。
