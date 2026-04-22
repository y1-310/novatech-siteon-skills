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

### 士業別カラープリセット（v1.19追加：Q13を士業別選択に変更）

Q13で士業を直接選択。Q14はQ13に統合して非表示。WCAG AA全て確認済み。

#### 税理士（紺 × 金）
```css
--bg: #F5F6F8; --bg-alt: #E8EAF0; --bg-dark: #14182A;
--text: #14182A; --text-mid: #3A4060; --text-light: #6A7090;
--accent: #B8962A; --line: #D0D4DC; --r: 4px;
英字: DM Serif Display; 和文見出し: Noto Serif JP;
```

#### 行政書士（グリーン）
```css
--bg: #F5F8F5; --bg-alt: #E8F0E8; --bg-dark: #142018;
--text: #142018; --text-mid: #3A5040; --text-light: #6A8070;
--accent: #2A7A4A; --line: #C8D8CC; --r: 4px;
英字: DM Sans (weight: 500); 和文見出し: Noto Sans JP (weight: 500);
```

#### 社労士（オレンジ）
```css
--bg: #FAF8F5; --bg-alt: #F2EDE5; --bg-dark: #201C14;
--text: #201C14; --text-mid: #504A3A; --text-light: #807A6A;
--accent: #D07030; --line: #DCD4C8; --r: 8px;
英字: DM Sans (weight: 500); 和文見出し: Noto Sans JP (weight: 500);
```

#### 弁護士（黒 × 金）
```css
--bg: #F5F5F3; --bg-alt: #EAEAE7; --bg-dark: #111110;
--text: #111110; --text-mid: #3D3D3A; --text-light: #5E5E58;
--accent: #B09B72; --line: #D5D5D0; --r: 0px;
英字: DM Serif Display; 和文見出し: Shippori Mincho;
```

#### コンサル・一般法人（ブルー）
```css
--bg: #F5F7FA; --bg-alt: #E8ECF2; --bg-dark: #141A24;
--text: #141A24; --text-mid: #3A4A60; --text-light: #6A7A90;
--accent: #2A5A8A; --line: #D0D8E0; --r: 4px;
英字: DM Sans (weight: 500); 和文見出し: Noto Sans JP (weight: 500);
```

---

## 2枚並列写真レイアウト（v1.19追加）

lp-salon と同一仕様。Featuresセクションで写真2枚横並びが可能。
```css
.feature-dual .feature-images {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
}
```

---

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
| Mobile（375px） | 72px | 1列 | 100vh（min-height: 520px） |

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

```css

/* 日本語改行制御（japanese-copy-guide.md 準拠） */
h1, h2, h3,
.hero-copy,
.concept-text,
.section-title {
  word-break: keep-all;
  overflow-wrap: break-word;
}

h1, .hero-copy {
  max-width: 18em;
}

h2 {
  max-width: 22em;
}
```
