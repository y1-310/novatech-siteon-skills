# lp-barber デザインシステム

## カラープリセット

### ダーク × ソリッド（デフォルト）

```css
:root {
  --bg: #141312;
  --bg-alt: #1E1D1B;
  --bg-dark: #0A0A09;
  --text: #E8E4DF;
  --text-mid: #A8A29B;
  --text-light: #6E6A64;
  --accent: #C4A265;
  --line: #2E2D2A;
  --r: 0px;
  --mw: 1080px;
}
```
英字: DM Serif Display
和文見出し: Shippori Mincho

### ダーク × ヴィンテージ

```css
:root {
  --bg: #1A1714;
  --bg-alt: #231F1B;
  --bg-dark: #0D0B09;
  --text: #E0D5C8;
  --text-mid: #9E9285;
  --text-light: #6B6158;
  --accent: #B87333;
  --line: #332E28;
  --r: 0px;
  --mw: 1080px;
}
```
英字: Playfair Display
和文見出し: Noto Serif JP

### ライト × カジュアル（Birds型）

```css
:root {
  --bg: #F5F0E8;
  --bg-alt: #EBE5DA;
  --bg-dark: #1A1918;
  --text: #1A1918;
  --text-mid: #4A4540;
  --text-light: #7A756E;
  --accent: #C05835;
  --line: #D8D0C4;
  --r: 4px;
  --mw: 1080px;
}
```
英字: DM Sans
和文見出し: Noto Sans JP（weight: 500）

## Q13×Q14 → プリセット自動マッピング

| Q13 | Q14 | プリセット |
|-----|-----|-----------|
| モノトーン×ゴールド | モード・洗練 | ダーク × ソリッド |
| モノトーン×ゴールド | 静謐・上品 | ダーク × ソリッド |
| グレージュ | モード・洗練 | ダーク × ヴィンテージ |
| グレージュ | 温もり・親しみ | ダーク × ヴィンテージ |
| ナチュラル | 温もり・親しみ | ライト × カジュアル |
| おまかせ | おまかせ | ダーク × ソリッド（デフォルト） |

## タイポグラフィ仕様

lp-salon と同じ構造。ただしフォントがプリセットで異なる。

| 要素 | フォント | サイズ | Weight |
|------|---------|--------|--------|
| セクションナンバー | ディスプレイフォント | 0.72rem | 400 |
| セクション英字タイトル | ディスプレイフォント | clamp(2rem, 4.5vw, 2.8rem) | 400 |
| セクション日本語サブ | 和文見出しフォント | 0.85rem | 400 |
| 本文 | Noto Sans JP | 14.5px | 300 |
| コンセプト文 | 和文見出しフォント | 0.92rem | 400 |
| メニュー名 | Noto Sans JP | 0.85rem | 300 |
| 価格 | ディスプレイフォント | 0.95rem | 400 |
| マーキー | ディスプレイフォント italic | 1rem | 300 |

## レスポンシブ仕様

lp-salon と同一。

| ブレークポイント | padding | グリッド | ヒーロー |
|----------------|---------|---------|---------|
| Desktop（1280px+） | 120px | 2〜3列 | 100vh |
| Tablet（768px） | 80px | 1〜2列 | 100vh |
| Mobile（375px） | 56px | 1列 | 100vh（min-height: 520px） |

## 技術仕様

lp-salon と同一。ただし JSON-LD の @type は `BarberShop`。

## ダーク背景時の注意点

- テキスト色が白系（--text: #E8E4DF等）
- コントラスト比 4.5:1 を必ず確保
- 画像の暗い部分が背景に溶け込まないよう、微妙なborder or shadow追加
- ヘッダースクロール変化：transparent → rgba(--bg-rgb, 0.95)
- モバイルスティッキーCTA：--bg-dark（さらに暗く）
