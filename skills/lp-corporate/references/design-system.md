# lp-corporate デザインシステム

## カラープリセット

### クリーン × 信頼

```css
:root {
  --bg: #FAFAFA;
  --bg-alt: #F0F0EE;
  --bg-dark: #1C1C20;
  --text: #1C1C20;
  --text-mid: #4A4A50;
  --text-light: #6E6E74;
  --accent: #2E5E8C;
  --line: #E0E0DC;
  --r: 4px;
  --mw: 1080px;
}
```
英字: DM Sans
和文見出し: Noto Sans JP（weight: 500）

### ミニマル × 洗練

```css
:root {
  --bg: #F8F8F6;
  --bg-alt: #EEEEEC;
  --bg-dark: #18181A;
  --text: #18181A;
  --text-mid: #444448;
  --text-light: #6A6A6E;
  --accent: #333333;
  --line: #D8D8D4;
  --r: 2px;
  --mw: 1080px;
}
```
英字: DM Sans
和文見出し: Noto Sans JP（weight: 400）

### アーティスティック × 世界観

```css
:root {
  --bg: #F5F3F0;
  --bg-alt: #EBE8E3;
  --bg-dark: #1A1816;
  --text: #1A1816;
  --text-mid: #4A4640;
  --text-light: #7A756E;
  --accent: #8B6B4A;
  --line: #DDD8D0;
  --r: 0px;
  --mw: 1080px;
}
```
英字: Playfair Display
和文見出し: Shippori Mincho

### ウォーム × 親しみ

```css
:root {
  --bg: #FAF8F4;
  --bg-alt: #F2EDE5;
  --bg-dark: #2C2825;
  --text: #2C2825;
  --text-mid: #5C5650;
  --text-light: #7A746C;
  --accent: #3A6B5C;
  --line: #E0D8CC;
  --r: 8px;
  --mw: 1080px;
}
```
英字: Cormorant Garamond
和文見出し: Noto Serif JP

## Q13×Q14 → プリセット自動マッピング

| Q13（カラー方向性） | Q14（トーン） | プリセット |
|-------------------|-------------|-----------|
| クリーン×信頼 | 信頼・端正 | クリーン × 信頼 |
| クリーン×信頼 | ミニマル・洗練 | クリーン × 信頼 |
| ミニマル×洗練 | ミニマル・洗練 | ミニマル × 洗練 |
| ミニマル×洗練 | 信頼・端正 | ミニマル × 洗練 |
| アーティスティック×世界観 | 世界観・表現性 | アーティスティック × 世界観 |
| ウォーム×親しみ | 親しみ・安心感 | ウォーム × 親しみ |
| おまかせ | おまかせ | クリーン × 信頼（デフォルト） |

## サブタイプ別デフォルトプリセット

| サブタイプ | 特徴 | デフォルトプリセット | 重視セクション |
|-----------|------|-------------------|-------------|
| 士業（弁護士・税理士・社労士等） | 信頼＋専門性 | クリーン × 信頼 | Service / Profile / Price / FAQ / Blog |
| コンサルティング | 専門性＋実績 | クリーン × 信頼 or ミニマル × 洗練 | Service / Case Study / Profile |
| クリエイティブ（映像・デザイン等） | 世界観＋ポートフォリオ | アーティスティック × 世界観 | Works / About / Profile |
| IT・スタートアップ | プロダクト訴求 | ミニマル × 洗練 | Service / Features / Price |
| 一般小規模法人 | 信頼＋安心感 | クリーン × 信頼 | Service / Company / Profile |

## タイポグラフィ仕様

| 要素 | フォント | サイズ | Weight |
|------|---------|--------|--------|
| セクションナンバー | 英字フォント | 0.72rem | 400 |
| セクション英字タイトル | 英字フォント | clamp(2rem, 4.5vw, 2.8rem) | 400 |
| セクション日本語サブ | 和文見出しフォント | 0.85rem | 400 |
| 本文 | Noto Sans JP | 14.5px | 300 |
| ミッション文 | 和文見出しフォント | 0.92rem | 400 |
| サービス名 | Noto Sans JP | 0.9rem | 400 |
| 価格 | 英字フォント | 0.95rem | 400 |
| マーキー | 英字フォント italic | 1rem | 300 |

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
- JSON-LD構造化データ（@type: LegalService / AccountingService / ProfessionalService / Organization）
- Lighthouse各項目90点以上目標
- 全画像にalt属性（日本語）、loading="lazy"（ヒーロー除く）、width/height指定
- canonical URL（マルチページ時）
- viewport設定

## フォント読み込みテンプレート

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family={英字フォント}:ital,wght@0,400;1,300&family={和文見出しフォント}:wght@400;500&family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet">
```

※日本語フォントは最大3ウェイト。fallbackスタック必須。
