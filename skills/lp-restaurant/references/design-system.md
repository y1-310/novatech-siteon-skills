# lp-restaurant design system

## プリセット1: ナチュラル×温もり
- 向いている業態: カフェ / 定食屋・食堂
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

## プリセット2: ホワイト×モダン
- 向いている業態: レストラン
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

## プリセット3: ダーク×ムード
- 向いている業態: バー / ラーメン屋
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

## プリセット4: ポップ×カジュアル
- 向いている業態: 居酒屋 / 大衆店
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

## プリセット5: ダーク×レトロ
- 向いている業態: 昭和レトロ居酒屋
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

## サブタイプ別デフォルトプリセット
- カフェ → プリセット1
- レストラン → プリセット2
- バー → プリセット3
- 居酒屋 → プリセット4 または 5
- ラーメン屋 → プリセット3 または 1
- 定食屋・食堂 → プリセット1

## タイポグラフィ規約
- 英字見出しは装飾目的で使用し、日本語主見出しの意味を上書きしない。
- 和文見出しは2行以内を基本とし、余白で品位をつくる。
- 本文は可読性を優先し、極端な字間調整を行わない。

## ボタン規約
- 主CTAは `--accent` を使い、背景とのコントラストを確保する。
- 副CTAは `--line` と `--text` を基準にアウトライン化する。
- ボタン角丸は常に `--r` を参照する。

## border-radius規約
- 画像カード、ボタン、タグ、予約導線の角丸はすべて `--r` を使う。
- `--r: 0px` のプリセットでは直線的な印象を維持し、影も控えめにする。
