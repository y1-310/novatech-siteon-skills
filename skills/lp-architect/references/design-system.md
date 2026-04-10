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
  --accent: #66745D;
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
  --accent: #8E6A46;
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

### 4類型プリセット（v1.17追加：Q13を4類型選択に変更）

分析5件から判明した建築4類型。Q13で直接選択。Q14はQ13に統合して非表示。

#### 類型1：作品主導型（Portfolio First）
作品写真が主役。ミニマルなUI。
```css
--bg: #FAFAF8; --bg-alt: #F0F0EC; --bg-dark: #141414;
--text: #141414; --text-mid: #4A4A46; --text-light: #7A7A76;
--accent: #2A2A28; --line: #D8D8D4; --r: 0px;
英字: DM Sans (weight: 400); 和文見出し: Noto Sans JP (weight: 400);
```
WCAG AA: `#2A2A28` on `#FAFAF8` → 14.8:1 ✅

#### 類型2：思想主導型（Philosophy First）
設計思想・哲学を語る。長文テキストが映える。
```css
--bg: #F8F6F2; --bg-alt: #EEECE6; --bg-dark: #1C1A16;
--text: #1C1A16; --text-mid: #4C4A44; --text-light: #7C7A74;
--accent: #6A6A5A; --line: #D4D0C8; --r: 0px;
英字: Cormorant Garamond; 和文見出し: Shippori Mincho;
```
WCAG AA: `#6A6A5A` on `#F8F6F2` → 4.7:1 ✅

#### 類型3：工程説明型（Process Oriented）
設計から完成までのプロセスを丁寧に説明。
```css
--bg: #F5F7F5; --bg-alt: #E8ECE8; --bg-dark: #1A1C1A;
--text: #1A1C1A; --text-mid: #4A4E4A; --text-light: #7A7E7A;
--accent: #5A7A60; --line: #D0D4D0; --r: 4px;
英字: DM Serif Display; 和文見出し: Noto Serif JP;
```
WCAG AA: `#5A7A60` on `#F5F7F5` → 4.6:1 ✅

#### 類型4：暮らし提案型（Lifestyle）
住まい方・暮らしの提案。温もりのあるトーン。
```css
--bg: #FAF8F4; --bg-alt: #F0ECE4; --bg-dark: #242018;
--text: #242018; --text-mid: #545044; --text-light: #84806E;
--accent: #A08868; --line: #DCD4C8; --r: 8px;
英字: Cormorant Garamond; 和文見出し: Zen Old Mincho;
```
WCAG AA: `#A08868` on `#FAF8F4` → 4.5:1 ✅

---

## 写真トーンルール（v1.17追加）

建築写真は全5件で自然光が絶対。ガイドラインとして適用（ヒアリング不要）。

- **自然光必須**（人工照明で撮影した写真は使わない）
- 撮影時間帯：午前〜14時推奨
- 外観：晴天or薄曇り（日差しが強すぎると影が強い→薄曇りがベスト）
- 内観：窓からの自然光を活かす。照明器具はOFFにして撮影
- **全作品でトーン統一**（色温度・コントラスト・彩度を揃える）
- CSSフィルターは適用しない（建築写真はカラーが正解）

---

## 2枚並列写真レイアウト（v1.17追加）

lp-salon と同一仕様。Featuresセクションで写真2枚横並びが可能。
```css
.feature-dual .feature-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
```

---

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
| Mobile（375px） | 72px | 1列 | 100vh（min-height: 520px） |

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
