# lp-barber デザインシステム

## カラープリセット & Q13×Q14 マッピング

→ `salon-interview/references/presets.md` を参照（全 lp-* スキルの Single Source of Truth）。
lp-barber は5プリセット（既存3 + 新規2）。デフォルトは「ダーク × ソリッド」。

### 既存プリセット
- ダーク × ソリッド（`--accent` を `#C4A265` → `#D4AF37` に微調整【v1.18】分析4/5件の標準ゴールドに合わせる）
- ダーク × ヴィンテージ（変更なし）
- ライト × カジュアル（変更なし）

### 新規プリセット（v1.18追加）

#### ストリートバーバー（黒 × 蛍光）
ストリート系・若者向けバーバーショップ。
```css
--bg: #0D0D0D; --bg-alt: #1A1A1A; --bg-dark: #000000;
--text: #F0F0F0; --text-mid: #A0A0A0; --text-light: #666666;
--accent: #00FF88; --line: #2A2A2A; --r: 0px;
英字: DM Sans (weight: 700); 和文見出し: Noto Sans JP (weight: 700);
```
WCAG AA: `#00FF88` on `#0D0D0D` → 12.4:1 ✅

#### 和バーバー（黒 × 金 × 赤）
和テイストのバーバー。金と朱赤のアクセント。
```css
--bg: #121010; --bg-alt: #1C1818; --bg-dark: #080606;
--text: #E8E0D8; --text-mid: #A09890; --text-light: #686058;
--accent: #C8A84E; --accent-sub: #B8342A; --line: #2A2624; --r: 0px;
英字: Playfair Display; 和文見出し: Shippori Mincho;
```
WCAG AA: `#C8A84E` on `#121010` → 7.8:1 ✅
※ `--accent-sub` は和バーバー専用（区切り線・ホバー用）。他プリセット・他業態に波及させない
※ `#B8342A` on `#121010` → 3.2:1 → テキストには使用しない（装飾のみ）

## 写真フィルタールール（v1.18追加）

分析5/5件がモノクロまたはセピアトーン。プリセット連動で自動適用。

| プリセット | フィルター | ホバー時 |
|-----------|----------|---------|
| ダーク × ソリッド | `filter: grayscale(100%) contrast(1.1)` | `filter: none` |
| ダーク × ヴィンテージ | `filter: sepia(40%) contrast(1.05)` | `filter: none` |
| ライト × カジュアル | フィルターなし | — |
| ストリートバーバー | フィルターなし | — |
| 和バーバー | `filter: grayscale(30%) contrast(1.1)` | `filter: none` |

```css
/* 写真フィルター（プリセット連動） */
.feature-image img,
.gallery-card img,
.staff-card img {
  filter: grayscale(100%) contrast(1.1);
  transition: filter 0.5s ease;
}
.feature-image img:hover,
.gallery-card img:hover {
  filter: none;
}
/* ヒーロー写真はフィルターなし */
.hero img, .hero { filter: none; }
/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .feature-image img, .gallery-card img { transition: none; }
}
```

- Q14後の補足質問「写真のトーン処理は？」（モノクロ / セピア / カラーのまま / おまかせ）でオーナーが「カラーのまま」を選択 → 全フィルターOFF
- デフォルト：おまかせ（プリセット連動）

## 2枚並列写真レイアウト（v1.18追加）

lp-salon と同一仕様。Featuresで写真2枚横並びが可能。
```css
.feature-dual .feature-images {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
}
```

## タイポグラフィ仕様

→ `_common/components.md` の「タイポグラフィ共通仕様」を参照（lp-salon と共通）。
プリセットによって割り当てられるディスプレイフォント・和文見出しフォントが異なる（presets.md 参照）。

## レスポンシブ仕様

→ `_common/components.md` の「レスポンシブ共通仕様」を参照。lp-salon と同一。

## 技術仕様

lp-salon と同一。ただし JSON-LD の @type は `BarberShop`。SEO 詳細は `_common/seo-base.md` 参照。

## ダーク背景時の注意点

- テキスト色が白系（--text: #E8E4DF等）
- コントラスト比 4.5:1 を必ず確保
- 画像の暗い部分が背景に溶け込まないよう、微妙なborder or shadow追加
- ヘッダースクロール変化：transparent → rgba(--bg-rgb, 0.95)
- モバイルスティッキーCTA：--bg-dark（さらに暗く）

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
