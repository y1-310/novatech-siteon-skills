# 共通コンポーネント仕様

## マーキーテキスト

テキスト2回繰り返し。CSS animation（25s linear infinite）。ディスプレイフォント italic。
Conceptセクション前後に配置。英字キャッチフレーズ無限スクロール。CSS animationのみ。

```html
<div class="marquee" aria-hidden="true">
  <div class="marquee-inner">
    <span>キャッチフレーズ — </span>
    <span>キャ��チフレーズ — </span>
  </div>
</div>
```

```css
.marquee {
  overflow: hidden;
  white-space: nowrap;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem;
  font-weight: 300;
  color: var(--text-light);
}
.marquee-inner {
  display: inline-block;
  animation: marquee 25s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

### noscript対応
マーキー → 静止表示

## セクション区切り線

1px solid var(--line)。max-width: var(--mw)。margin: 0 auto。

```html
<hr class="section-divider">
```

```css
.section-divider {
  border: none;
  border-top: 1px solid var(--line);
  max-width: var(--mw);
  margin: 0 auto;
}
```

## 予約ボタン配置箇所（5箇所）

| # | 配置箇所 | 備考 |
|---|---------|------|
| 1 | ヘッダーナビ内 | デスクトップ表示 |
| 2 | ヒーロー内 | メインCTA |
| 3 | メニューセクション下 | 料金確認後のCTA |
| 4 | フッターCTA | ダーク背景の予約誘導 |
| 5 | モバイルスティッキー | 画面下部に常時表示。padding-bottom追加必須 |

## スクロールアニメーション

Intersection Observer。threshold: 0.06。translateY 12px→0 + opacity 0→1。duration 0.7s。

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.06 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```

```css
.fade-in {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### noscript対応
フェードイン → 常時表示（opacity: 1, transform: none）

## ヘッダースクロール変化

transparent → 半透明背景 + border-bottom + backdrop-filter blur

```css
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  transition: background-color 0.3s, border-color 0.3s;
  background-color: transparent;
  border-bottom: 1px solid transparent;
}
.header.scrolled {
  background-color: rgba(var(--bg-rgb), 0.95);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(8px);
}
```

### noscript対応
ナビ → フル表示（スクロール状態を初期表示）

## モバイルスティッキーCTA

画面下部に予約ボタン常時表示。body に padding-bottom を追加してコンテンツが隠れないようにする。

```css
.sticky-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 90;
  padding: 12px 16px;
  background-color: var(--bg-dark);
}
@media (min-width: 769px) {
  .sticky-cta { display: none; }
}
```

## セクションナンバリング

統一表記：01, 02, 03...
フォント：ディスプレイフォント、0.72rem、weight 400。

```html
<span class="section-number">01</span>
<h2 class="section-title" lang="en">Concept</h2>
<p class="section-subtitle">コンセプト</p>
```

## タイポグラフィ共通仕様

| 要素 | フォント | サイズ | Weight |
|------|---------|--------|--------|
| セクションナンバー | ディスプレイフォント | 0.72rem | 400 |
| セクション英字タイトル | ディスプレイフォント | clamp(2rem, 4.5vw, 2.8rem) | 400 |
| セクション日本語サブ | Shippori Mincho | 0.85rem | 400 |
| 本文 | Noto Sans JP | 14.5px | 300 |
| コンセプト文 | 和文見出しフォント | 0.92rem | 400 |
| メニュー名 | Noto Sans JP | 0.85rem | 300 |
| 価格 | ���ィスプレイフォント | 0.95rem | 400 |
| マーキー | ディスプレイフォント italic | 1rem | 300 |

## レスポンシブ共通仕様

| ブレークポイント | padding | グリッド | ヒーロー |
|----------------|---------|---------|---------|
| Desktop（1280px+） | 120px | 2〜3列 | 100vh |
| Tablet（768px） | 80px | 1〜2�� | 100vh |
| Mobile（375px） | 72px | 1列 | 100vh（min-height: 520px） |
