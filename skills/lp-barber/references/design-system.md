# lp-barber デザインシステム

## カラープリセット & Q13×Q14 マッピング

→ `salon-interview/references/presets.md` を参照（全 lp-* スキルの Single Source of Truth）。
lp-barber は3プリセット：ダーク × ソリッド / ダーク × ヴィンテージ / ライト × カジュアル（Birds型）。
デフォルトは「ダーク × ソリッド」。

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
