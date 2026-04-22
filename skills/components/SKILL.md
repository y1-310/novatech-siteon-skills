---
name: components
description: NovaTech/SateOnの共通演出要素（マーキーテキスト・スクロールフェードイン・ヘッダースクロール変化・モバイルスティッキーCTA・セクション区切り線・タイポグラフィ）と予約ボタン5箇所配置ルール、CLS対策・2カラムレイアウトルール。LP生成時の標準装備として業態別LPスキルから参照される。
---

# components — 共通コンポーネント仕様

このスキルはNovaTech/SateOnのLP生成で使用する共通コンポーネントを定義します。
マスターファイル: `_common/components.md`

## 主要ルール（要約）

### 予約ボタン配置（5箇所必須）

| # | 配置箇所 | 備考 |
|---|---------|------|
| 1 | ヘッダーナビ内 | デスクトップ表示 |
| 2 | ヒーロー内 | メインCTA |
| 3 | メニューセクション下 | 料金確認後のCTA |
| 4 | フッターCTA | ダーク背景の予約誘導 |
| 5 | モバイルスティッキー | 画面下部に常時表示。body に padding-bottom 追加必須 |

### マーキーテキスト

テキスト2回繰り返し。CSS animation（25s linear infinite）。ディスプレイフォント italic。Conceptセクション前後に配置。英字キャッチフレーズ無限スクロール。CSS animationのみ（JSなし）。

### スクロールフェードイン

Intersection Observer。threshold: 0.06。translateY 12px→0 + opacity 0→1。duration 0.7s。

**アニメーション禁止対象**: `img` / `.service-card` / `.gallery-item` / `.works-card` 等のカード系・画像系には付けない（translateY がグリッド内で視覚的衝突を起こすため）。

**許可対象のみ**: h2 / 本文p / ヒーローキャッチコピー / CTAボタンhover / ナビ・モーダル開閉。

### ヘッダースクロール変化

初期: transparent → スクロール後: 半透明背景 + border-bottom + backdrop-filter blur(8px)。z-index: 100。

### モバイルスティッキーCTA

`position: fixed; bottom: 0; z-index: 90;`。min-width: 769px で `display: none`。body に `padding-bottom` を追加してコンテンツが隠れないようにする。

### タイポグラフィ共通仕様

| 要素 | フォント | サイズ | Weight |
|------|---------|--------|--------|
| セクション英字タイトル | ディスプレイフォント | clamp(2rem, 4.5vw, 2.8rem) | 400 |
| セクション日本語サブ | Shippori Mincho | 0.85rem | 400 |
| 本文 | Noto Sans JP | 14.5px | 300 |
| コンセプト文 | 和文見出しフォント | 0.92rem | 400 |
| マーキー | ディスプレイフォント italic | 1rem | 300 |

Inter / Arial / Roboto / Helvetica は**使用禁止**。

### レスポンシブ共通

| ブレークポイント | padding | グリッド |
|----------------|---------|---------|
| Desktop（1280px+） | 120px | 2〜3列 |
| Tablet（768px） | 80px | 1〜2列 |
| Mobile（375px） | 72px | 1列 |

### CLS対策（必須）

- Hero は `align-items: start` + 内側に明示的な `min-height: 100vh`（`align-items: end` 禁止）
- 大型見出しに `font-size-adjust: 0.5`（webfont swap によるシフト防止）
- `--text-light` は `--bg` に対して contrast 4.5:1 以上を確認

### 2カラムレイアウト

- `align-items: stretch` 必須（右カラムが空中に浮く配置禁止）
- 左カラムが縦長・右カラムが小さい場合は `align-self: center` か1カラムに変更

### セクションナンバリング

統一表記：01, 02, 03... ディスプレイフォント、0.72rem、weight 400。

## 詳細ルール

詳細ルールは元ファイル `_common/components.md` を参照してください。
各コンポーネントのHTML/CSS/JSコードは元ファイルに記載されています。
このスキルを呼び出した際、Codex は元ファイルを必要に応じて併読してください。
