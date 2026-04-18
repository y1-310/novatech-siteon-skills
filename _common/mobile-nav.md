# モバイルナビゲーション 共通仕様

> 全業態（lp-salon / lp-barber / lp-nail-esthe / lp-restaurant / lp-architect / lp-corporate / lp-salon-group）で
> このファイルの仕様に従ってハンバーガーメニューを実装すること。
>
> **追加背景**: 2026-04-18 の iPhone 17 実機確認でデモ4件に不具合発覚。
> Lighthouse では検知できない実機固有の崩れのため、明文化して再発防止する。

---

## 実装方針

- **ブレークポイント**: `max-width: 820px`（業態によっては 760px / 720px も可）
- **オーバーレイ方式**: `position: fixed` でヘッダー直下に展開
- **背景色必須**: `background: var(--bg)` または `rgba(var(--bg-rgb), 0.98)` — 透過禁止
- **テキスト色必須**: `color: var(--text)` を `.menu-open` に明示指定（hero白抜き状態の上書き）
- **z-index**: `999` 以上（スティッキーCTAより上）
- **タップターゲット**: ナビリンク `min-height: 44px`
- **ハンバーガーボタン**: `44×44px`
- **aria**: `aria-expanded` / `aria-controls` / `aria-label` 必須

---

## HTML テンプレート

```html
<!-- ヘッダー内、ブランドロゴの直後・navの直前に挿入 -->
<button
  class="menu-toggle"
  type="button"
  aria-expanded="false"
  aria-controls="nav-menu"
  aria-label="メニューを開く"
>
  <span class="toggle-bar" aria-hidden="true"></span>
</button>

<!-- nav に id を追加 -->
<nav class="nav" id="nav-menu" aria-label="主要メニュー">
  <!-- 既存のナビリンク -->
</nav>
```

---

## CSS テンプレート

### デフォルト（全幅）に追加

```css
/* ハンバーガーボタン — デスクトップでは非表示 */
.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text);
  flex-shrink: 0;
}

/* 3本線アイコン */
.toggle-bar,
.toggle-bar::before,
.toggle-bar::after {
  display: block;
  width: 20px;
  height: 1.5px;
  background: currentColor;
  position: absolute;
  transition: transform 0.25s ease, opacity 0.25s ease;
  left: 0;
}
.toggle-bar::before { content: ''; top: -6px; }
.toggle-bar::after  { content: ''; top: 6px; }

/* X字（開いた状態） */
.menu-open .toggle-bar { background: transparent; }
.menu-open .toggle-bar::before { transform: rotate(45deg) translate(4px, 4px); }
.menu-open .toggle-bar::after  { transform: rotate(-45deg) translate(4px, -4px); }
```

### モバイル @media ブロック内

```css
@media (max-width: 820px) {
  /* ハンバーガーボタン表示 */
  .menu-toggle {
    display: inline-flex;
    position: relative;
  }

  /* ナビをオーバーレイ化 */
  .nav-wrap {          /* またはサイトの .nav / .site-nav / .nav-list-wrap 等 */
    position: fixed;
    inset: var(--header-h, 64px) 0 auto 0;
    /* ⚠️ background-color 必須（透過禁止） */
    background: var(--bg);
    border-bottom: 1px solid var(--line);
    padding: 20px 20px 28px;
    z-index: 999;
    transform: translateY(-120%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  /* 開いた状態 */
  .menu-open .nav-wrap {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
    /* ⚠️ テキスト色明示（hero白抜き状態を上書き） */
    color: var(--text);
  }

  /* ナビリンク個別 — hero状態の color 上書きを確実に */
  .menu-open .nav-wrap a,
  .menu-open .nav a {
    color: var(--text);
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    border-bottom: 1px solid var(--line);
    width: 100%;
  }

  .menu-open .nav-wrap li:last-child a,
  .menu-open .nav li:last-child a {
    border-bottom: none;
  }

  /* スティッキーCTAとの重複回避 */
  .menu-open .sticky-cta {
    display: none;
  }
}
```

---

## JS テンプレート

```javascript
// ハンバーガーメニュー（全業態共通パターン）
(function() {
  var toggle = document.querySelector('.menu-toggle');
  var body   = document.body;
  if (!toggle) return;

  // クリックでトグル
  toggle.addEventListener('click', function() {
    var open = body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });

  // Esc で閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) {
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      toggle.focus();
    }
  });

  // ナビリンクのタップで閉じる
  document.querySelectorAll('.nav a, .site-nav a, .nav-list a').forEach(function(a) {
    a.addEventListener('click', function() {
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
    });
  });

  // prefers-reduced-motion 対応はCSS側で対応済み（transition-duration: 0.01ms）
})();
```

---

## よくある失敗パターン

### ❌ オーバーレイ透過
```css
/* NG: rgba(var(--bg-rgb), 0) — 透過になる */
background: rgba(255,255,255,0.3);
```
→ `background: var(--bg)` または `rgba(var(--bg-rgb), 0.98)` で必ず不透過にする

### ❌ テキスト色の上書き漏れ
```css
/* NG: hero状態の白が残る */
.nav a { color: rgba(255,255,255,0.9); } /* hero用グローバル指定 */
/* menu-open時に上書きなし → 白bg上に白文字で不可視 */
```
→ `.menu-open .nav a { color: var(--text); }` で確実に上書きする

### ❌ z-index 不足
```css
/* NG: スティッキーCTAより低いと重なる */
.nav-wrap { z-index: 10; }
```
→ `z-index: 999` 以上にする

### ❌ prefers-reduced-motion 未対応
```css
/* NG: アニメーション設定のみ */
```
→ `@media (prefers-reduced-motion: reduce)` ブロックで `transition-duration: 0.01ms` を追加する

---

## 業態別ブレークポイント参考

| 業態 | 推奨ブレークポイント | 備考 |
|------|-----------------|------|
| lp-salon | 820px | ナビ項目多め |
| lp-barber | 820px | |
| lp-nail-esthe | 820px | |
| lp-restaurant | 720px | シンプルなナビ |
| lp-architect | 760px | ナビ項目7個 |
| lp-corporate | 760px | ナビ項目7個 |
| lp-salon-group | 820px | |

---

## Puppeteer 検証コマンド

```bash
# モバイルスクリーンショット撮影（ビフォーアフター）
node /Users/satouyuuichi/Developer/novatech-siteon-business/reports/mobile-screenshots/capture.mjs [before|after]
```

iPhone 17（430×932）と iPhone SE（375×667）の両サイズで確認すること。
