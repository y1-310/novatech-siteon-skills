# restaurant-interview presets

`restaurant-interview` では `lp-restaurant/references/design-system.md` と同じ5プリセットを使う。

## 1. natural-warmth
- 想定業態: カフェ / 定食屋・食堂
- 想定トーン: ナチュラル / 温もり / やさしい / 手仕事感
- CSS変数:
  - `--bg: #FAF7F2`
  - `--bg-alt: #F2EDE5`
  - `--bg-dark: #2C2621`
  - `--text: #2C2621`
  - `--text-mid: #5C5650`
  - `--text-light: #7A746C`
  - `--accent: #B08968`
  - `--line: #E0D8CC`
  - `--r: 8px`
- フォント:
  - 英字: `Cormorant Garamond`
  - 和文見出し: `Noto Serif JP`
  - 本文: `Noto Sans JP`

## 2. white-modern
- 想定業態: レストラン
- 想定トーン: クリーン / 上質 / ミニマル / 都市的
- CSS変数:
  - `--bg: #FAFAFA`
  - `--bg-alt: #F0F0EE`
  - `--bg-dark: #1A1A1A`
  - `--text: #1A1A1A`
  - `--text-mid: #4A4A48`
  - `--text-light: #6E6E6C`
  - `--accent: #8B7355`
  - `--line: #E0E0DC`
  - `--r: 2px`
- フォント:
  - 英字: `Playfair Display`
  - 和文見出し: `Shippori Mincho`
  - 本文: `Noto Sans JP`

## 3. dark-mood
- 想定業態: バー / ラーメン屋
- 想定トーン: ダーク / ムーディ / 緊張感 / 夜営業
- CSS変数:
  - `--bg: #121110`
  - `--bg-alt: #1C1A18`
  - `--bg-dark: #0A0908`
  - `--text: #E5DFD6`
  - `--text-mid: #A09888`
  - `--text-light: #6A6258`
  - `--accent: #C4956A`
  - `--line: #2A2825`
  - `--r: 0px`
- フォント:
  - 英字: `DM Serif Display`
  - 和文見出し: `Shippori Mincho`
  - 本文: `Noto Sans JP`

## 4. pop-casual
- 想定業態: 居酒屋 / 大衆店
- 想定トーン: 親しみ / にぎやか / カジュアル / 明るい
- CSS変数:
  - `--bg: #F8F5F0`
  - `--bg-alt: #EDE8E0`
  - `--bg-dark: #222018`
  - `--text: #222018`
  - `--text-mid: #4A4540`
  - `--text-light: #7A756E`
  - `--accent: #C05835`
  - `--line: #D8D0C4`
  - `--r: 6px`
- フォント:
  - 英字: `DM Sans`
  - 和文見出し: `Noto Sans JP(500)`
  - 本文: `Noto Sans JP`

## 5. dark-retro
- 想定業態: 昭和レトロ居酒屋
- 想定トーン: レトロ / 重厚 / 懐かしさ / 夜の体温
- CSS変数:
  - `--bg: #1A1714`
  - `--bg-alt: #241F1B`
  - `--bg-dark: #0E0C0A`
  - `--text: #E0D5C8`
  - `--text-mid: #A09282`
  - `--text-light: #6B6058`
  - `--accent: #D4A24E`
  - `--line: #332E28`
  - `--r: 0px`
- フォント:
  - 英字: `Playfair Display`
  - 和文見出し: `Noto Serif JP`
  - 本文: `Noto Sans JP`

## 自動マッピング方針
- `カフェ` は `natural-warmth` を初期値にする。
- `レストラン` は `white-modern` を初期値にする。
- `バー` は `dark-mood` を初期値にする。
- `居酒屋` は `pop-casual` または `dark-retro` を候補にする。
- `ラーメン屋` は `dark-mood` または `natural-warmth` を候補にする。
- `定食屋・食堂` は `natural-warmth` を初期値にする。
- 最終決定はQ13とQ14の回答を優先し、候補から最も近いプリセットを選ぶ。
