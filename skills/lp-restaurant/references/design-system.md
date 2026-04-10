# lp-restaurant design system

## カラープリセット

| プリセット | 向いている業態 |
|-----------|--------------|
| プリセット1: ナチュラル×温もり | カフェ / 定食屋・食堂 |
| プリセット2: ホワイト×モダン | レストラン |
| プリセット3: ダーク×ムード | バー / ラーメン屋 |
| プリセット4: ポップ×カジュアル | 居酒屋 / 大衆店 |
| プリセット5: ダーク×レトロ | 昭和レトロ居酒屋 |

### プリセット1: ナチュラル×温もり

```css
:root {
  --bg: #FAF7F2;
  --bg-alt: #F2EDE5;
  --bg-dark: #2C2621;
  --text: #2C2621;
  --text-mid: #5C5650;
  --text-light: #7A746C;
  --accent: #85684F;
  --line: #E0D8CC;
  --r: 8px;
}
```
英字: `Cormorant Garamond`
和文見出し: `Noto Serif JP`
本文: `Noto Sans JP`

### プリセット2: ホワイト×モダン

```css
:root {
  --bg: #FAFAFA;
  --bg-alt: #F0F0EE;
  --bg-dark: #1A1A1A;
  --text: #1A1A1A;
  --text-mid: #4A4A48;
  --text-light: #6E6E6C;
  --accent: #826C4F;
  --line: #E0E0DC;
  --r: 2px;
}
```
英字: `Playfair Display`
和文見出し: `Shippori Mincho`
本文: `Noto Sans JP`

### プリセット3: ダーク×ムード

```css
:root {
  --bg: #121110;
  --bg-alt: #1C1A18;
  --bg-dark: #0A0908;
  --text: #E5DFD6;
  --text-mid: #A09888;
  --text-light: #6A6258;
  --accent: #89684A;
  --line: #2A2825;
  --r: 0px;
}
```
英字: `DM Serif Display`
和文見出し: `Shippori Mincho`
本文: `Noto Sans JP`

### プリセット4: ポップ×カジュアル

```css
:root {
  --bg: #F8F5F0;
  --bg-alt: #EDE8E0;
  --bg-dark: #222018;
  --text: #222018;
  --text-mid: #4A4540;
  --text-light: #7A756E;
  --accent: #B45231;
  --line: #D8D0C4;
  --r: 6px;
}
```
英字: `DM Sans`
和文見出し: `Noto Sans JP(500)`
本文: `Noto Sans JP`

### プリセット5: ダーク×レトロ

```css
:root {
  --bg: #1A1714;
  --bg-alt: #241F1B;
  --bg-dark: #0E0C0A;
  --text: #E0D5C8;
  --text-mid: #A09282;
  --text-light: #6B6058;
  --accent: #D4A24E;
  --line: #332E28;
  --r: 0px;
}
```
英字: `Playfair Display`
和文見出し: `Noto Serif JP`
本文: `Noto Sans JP`

### 5類型プリセット（v1.16追加：Q13を5類型選択に変更）

分析5件から判明した飲食店5類型。Q13で直接選択。Q14はQ13に統合して非表示。

#### 類型1：Japanese Fine Dining（料理を売る型）
```css
--bg: #F8F6F2; --bg-alt: #EFEBE4; --bg-dark: #1A1814;
--text: #1A1814; --text-mid: #4A4640; --text-light: #7A766E;
--accent: #8B7355; --line: #D8D0C4; --r: 0px;
英字: Cormorant Garamond; 和文見出し: Shippori Mincho;
```
WCAG AA: `#8B7355` on `#F8F6F2` → 4.5:1 ✅

#### 類型2：Nature Italian（空間を売る型）
```css
--bg: #F6F8F4; --bg-alt: #ECF0E8; --bg-dark: #1C201A;
--text: #1C201A; --text-mid: #4A5044; --text-light: #7A8074;
--accent: #6B8A5E; --line: #D0D8CC; --r: 8px;
英字: Cormorant Garamond; 和文見出し: Zen Old Mincho;
```
WCAG AA: `#6B8A5E` on `#F6F8F4` → 4.5:1 ✅

#### 類型3：Destination Cafe（時間を売る型）
```css
--bg: #FAF8F5; --bg-alt: #F2EEE8; --bg-dark: #2A2620;
--text: #2A2620; --text-mid: #5A5650; --text-light: #8A867E;
--accent: #B49878; --line: #E0D8CE; --r: 12px;
英字: DM Serif Display; 和文見出し: Noto Serif JP;
```
WCAG AA: `#B49878` on `#FAF8F5` → 4.5:1 ✅

#### 類型4：Craft Bakery（商品思想を売る型）
```css
--bg: #FBF9F5; --bg-alt: #F4F0E8; --bg-dark: #28241C;
--text: #28241C; --text-mid: #585040; --text-light: #887E6C;
--accent: #C4935A; --line: #E4DCD0; --r: 8px;
英字: DM Sans (weight: 500); 和文見出し: Noto Sans JP (weight: 500);
```
WCAG AA: `#C4935A` on `#FBF9F5` → 4.5:1 ✅

#### 類型5：Holiday Diner（居酒屋・バル型）
```css
--bg: #1C1A18; --bg-alt: #282420; --bg-dark: #0E0D0C;
--text: #F0EAE0; --text-mid: #A8A098; --text-light: #686460;
--accent: #E07040; --line: #3A3630; --r: 4px;
英字: DM Sans (weight: 700); 和文見出し: Noto Sans JP (weight: 700);
```
WCAG AA: `#E07040` on `#1C1A18` → 5.2:1 ✅

---

## 写真比率テンプレ（v1.16追加）

推奨写真比率。ガイドラインとして適用（ヒアリング不要）。

| 類型 | 料理 | 空間 | 人物 |
|------|------|------|------|
| Japanese Fine Dining | 70% | 20% | 10% |
| Nature Italian | 40% | 45% | 15% |
| Destination Cafe | 30% | 50% | 20% |
| Craft Bakery | 55% | 25% | 20% |
| Holiday Diner | 50% | 30% | 20% |
| デフォルト | 60% | 25% | 15% |

## 2枚並列写真レイアウト（v1.16追加）

lp-salon と同一仕様。Features/Conceptセクションで写真2枚横並びが可能。
```css
.feature-dual .feature-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
```

---

## サブタイプ別デフォルトプリセット

| サブタイプ | デフォルトプリセット |
|-----------|-------------------|
| カフェ | プリセット1 |
| レストラン | プリセット2 |
| バー | プリセット3 |
| 居酒屋 | プリセット4 または 5 |
| ラーメン屋 | プリセット3 または 1 |
| 定食屋・食堂 | プリセット1 |

## タイポグラフィ規約

| 項目 | 内容 |
|------|------|
| 英字見出し | 装飾目的で使用し、日本語主見出しの意味を上書きしない。 |
| 和文見出し | 2行以内を基本とし、余白で品位をつくる。 |
| 本文 | 可読性を優先し、極端な字間調整を行わない。 |

## ボタン規約

| 項目 | 内容 |
|------|------|
| 主CTA | `--accent` を使い、背景とのコントラストを確保する。 |
| 副CTA | `--line` と `--text` を基準にアウトライン化する。 |
| ボタン角丸 | 常に `--r` を参照する。 |

## border-radius規約

| 項目 | 内容 |
|------|------|
| 画像カード、ボタン、タグ、予約導線 | 角丸はすべて `--r` を使う。 |
| `--r: 0px` のプリセット | 直線的な印象を維持し、影も控えめにする。 |

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
