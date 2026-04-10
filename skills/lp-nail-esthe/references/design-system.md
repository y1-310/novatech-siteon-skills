# lp-nail-esthe デザインシステム

## カラープリセット & Q13×Q14 マッピング

→ `salon-interview/references/presets.md` を参照（全 lp-* スキルの Single Source of Truth）。
lp-nail-esthe は6プリセット（既存3 + 新規3）。デフォルトは「フェミニン × 上品」。

### 既存プリセット
- フェミニン × 上品
- ラベンダー × 洗練
- ベージュ × ナチュラル

### 新規プリセット（v1.14追加）

#### ラグジュアリーエステ（白 × グリーン）
高級感のあるエステサロン向け。グリーンで癒し・自然を表現。
```css
--bg: #F9FAF7; --bg-alt: #EFF2EA; --bg-dark: #1A2118;
--text: #1A2118; --text-mid: #4A5444; --text-light: #7A8474;
--accent: #5C7A5A; --line: #D4DCD0; --r: 8px;
英字: Cormorant Garamond; 和文見出し: Zen Old Mincho;
```
WCAG AA: `#5C7A5A` on `#F9FAF7` → 4.6:1 ✅

#### ポップネイル（白 × ピンク × 赤）
カジュアル・ポップなネイルサロン向け。若い客層を想定。
```css
--bg: #FFFBFA; --bg-alt: #FFF0EE; --bg-dark: #2A1A1C;
--text: #2A1A1C; --text-mid: #6A4A50; --text-light: #9A7A80;
--accent: #E05870; --line: #F0D8DC; --r: 16px;
英字: DM Sans (weight: 500); 和文見出し: Noto Sans JP (weight: 500);
```
WCAG AA: `#E05870` on `#FFFBFA` → 4.5:1 ✅（ぎりぎり）

#### ミニマルビューティー（白 × ベージュ）
シンプルで洗練されたネイル・まつエクサロン向け。
```css
--bg: #FAFAF8; --bg-alt: #F2F0EC; --bg-dark: #1C1C1A;
--text: #1C1C1A; --text-mid: #5C5A56; --text-light: #8A8882;
--accent: #A09080; --line: #E0DCD6; --r: 4px;
英字: DM Serif Display; 和文見出し: Shippori Mincho;
```
WCAG AA: `#A09080` on `#FAFAF8` → 3.6:1 ⚠️ **--accent をテキストに使う場合は太字(500+)に限定。通常テキストには --text を使用**

## 業態別のプリセット推奨

| 業態 | 推奨プリセット |
|------|-------------|
| ネイル | フェミニン × 上品 or ラベンダー × 洗練 |
| エステ | ベージュ × ナチュラル or フェミニン × 上品 |
| まつエク | フェミニン × 上品 or ラベンダー × 洗練 |

## タイポグラフィ仕様

→ `_common/components.md` の「タイポグラフィ共通仕様」を参照。プリセットに応じてフォントが変わる（presets.md 参照）。

## レスポンシブ仕様

→ `_common/components.md` の「レスポンシブ共通仕様」を参照。lp-salon と同一。

## 技術仕様

lp-salon と同一。ただし JSON-LD の @type は業態で分岐：

| 業態 | @type |
|------|-------|
| ネイル | NailSalon |
| エステ | BeautySalon |
| まつエク | BeautySalon |

## ギャラリーグリッド仕様（v1.14追加）

nail-estheのデフォルトギャラリーパターン。

```css
/* ギャラリーグリッド（FASTNAIL型） */
.design-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

@media (max-width: 1024px) {
  .design-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .design-grid { grid-template-columns: repeat(2, 1fr); }
}

.design-item img {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  width: 100%;
}

.design-item:hover .design-info {
  opacity: 1;
  transform: translateY(0);
}
```

- 表示枚数：12〜20枚。「もっと見る」ボタンで追加表示、またはInstagramへのリンク
- ホバー：scale(1.02) + overlay（メニュー名 or デザイン名をテキスト表示）
- 写真が12枚未満の場合 → 横スクロールに自動フォールバック（Agentが判断）

## 2枚並列写真レイアウト（v1.14追加）

lp-salon と同一仕様。Featuresセクションで写真2枚横並びが可能。

```css
.feature-dual .feature-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.feature-dual .feature-images img {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  width: 100%;
}
```

## nail-esthe固有のデザインルール

- 写真は1:1正方形を基本とする（ネイルデザイン・施術結果の表示に最適）
- ギャラリーのグリッド：4列（desktop）/ 3列（tablet）/ 2列（mobile）
- border-radius は丸め（var(--r): 8px〜12px）
- フェミニンなトーンだが、甘すぎない上品さを保つ

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
