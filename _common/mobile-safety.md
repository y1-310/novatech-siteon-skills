# モバイル安全ベースライン v1.0

全LP・全クライアントサイト共通。**スマホ実機でのUI崩れを構造的に防ぐための必須ルール**。
2026-08-26 に自社サイト＋デモ8件を実機幅で検査した結果を元に策定。

自動検査: `node tools/check-mobile.js <site-dir>`
（320 / 375 / 390 / 430px の4幅で Chromium 実描画して判定。qa-check.sh と pre-commit で自動実行される）

---

## 検査で落ちる12項目

| # | 症状 | 原因 | 対策 |
|---|------|------|------|
| 1 | 横スクロールが出る | 固定幅・はみ出し要素 | 幅指定を `min()` / `max-width:100%` に |
| 2 | 日本語見出しが右で切れる | `word-break: keep-all` 単独 | `overflow-wrap: anywhere` を必ず併用 |
| 3 | はみ出しが `overflow-x:hidden` で隠れている | ルートで握り潰し | 原因側を直す。ルートの hidden は対症療法 |
| 4 | タップしづらい | タップ領域 44px 未満 | `.tap-safe` で当たり判定を拡張 |
| 5 | 文字が読めない | 12px 未満 | スマホ幅で 12px 下限 |
| 6 | 入力時に画面が拡大する | iOS: input が 16px 未満 | `font-size: 16px` 固定 |
| 7 | 下部CTAが最後の要素を隠す | body の下余白不足 | `padding-bottom` ≧ バー実高 |
| 8 | アンカーの着地点がヘッダーに隠れる | `scroll-margin-top: 0` | `--header-h` 分の scroll-margin |
| 9 | ヒーローがアドレスバー分ズレる | `100vh` | `100svh` / `100dvh` + フォールバック |
| 10 | 画像の縦横比が崩れる | `object-fit: fill` | `cover` + `aspect-ratio` |
| 11 | スクロールしても中身が出てこない | IntersectionObserver の threshold 過大 | `threshold: 0.01` + `rootMargin` |
| 12 | ピンチズームできない | `user-scalable=no` | viewport は `width=device-width, initial-scale=1` のみ |

---

## ① 必須CSSブロック（全サイトに貼る）

`<style>` の**末尾**に、この形のまま貼る。`--header-h` だけ実測値に差し替える。

```css
/* ============================================================
   モバイル安全ベースライン v1.0  —  _common/mobile-safety.md 準拠
   自動検査: node tools/check-mobile.js <site>
   ここを個別に書き換えないこと。仕様変更はマスター側で行う。
   ============================================================ */
:root {
  /* サイト側が同名の変数を使っていることがあるため --mb- 接頭辞を必ず付ける。
     接頭辞なしで :root に足すと、サイトのヘッダー高やナビ位置を壊す。 */
  --mb-header-h: 64px;          /* ← スマホ幅でのヘッダー実高に差し替える */
  --mb-tap-min: 44px;
}

/* 1. 日本語の折り返し
   keep-all だけだと CJK 連続が分割されず、コンテナ幅を超えて切れる。
   overflow-wrap は継承プロパティなので body だけに指定すると、
   個別に break-word を当てた要素で溢れが残る。
   grid / flex の min-content 幅にも効かせるため全要素に指定する。
   （break-word では min-content が縮まないので anywhere でなければ直らない） */
body,
body * {
  overflow-wrap: anywhere;
}

/* 2. アンカーの着地点を固定ヘッダーの下に出す */
[id] {
  scroll-margin-top: calc(var(--mb-header-h) + 12px);
}

/* 4. タップ領域 44x44 の確保
   上下 padding で当たり判定を広げ、負マージンで見た目の位置を維持する。
   14px は「本文 16px + 14px×2 = 44px」から。12px だと 40px で足りない。 */
@media (pointer: coarse) {
  /* 3. iOS の入力時オートズーム防止（16px 未満だとフォーカス時に拡大される）
     マウス環境の見た目は変えないよう、タッチ端末だけに効かせる。 */
  input, select, textarea {
    font-size: 16px;
  }

  a[href^="tel:"],
  a[href^="mailto:"],
  .footer-links a,
  .footer-meta a,
  .info-value a {
    display: inline-block;
    padding: 14px 0;
    margin: -14px 0;
  }

  /* 横幅が足りない短いリンク・アイコンリンク */
  .footer-links a[aria-label],
  .footer-meta a[aria-label] {
    min-width: var(--mb-tap-min);
    text-align: center;
  }

  /* 見た目を変えたくない小さなボタン（カルーセルのドット等）は
     擬似要素で当たり判定だけ広げる。既存の ::after がないことを確認して使う。 */
  .tap-safe { position: relative; }
  .tap-safe::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--mb-tap-min);
    height: var(--mb-tap-min);
    transform: translate(-50%, -50%);
  }
}

/* 5. 画像は必ず枠内に収める */
img, video, svg, canvas, iframe { max-width: 100%; }
```

## ② 100vh の書き方

```css
.hero {
  min-height: 100vh;   /* 旧ブラウザ用フォールバック */
  min-height: 100svh;  /* iOS Safari: アドレスバーを含めた小さい方 */
}
```
`100dvh` はスクロール中に高さが変動してガタつくため、ヒーローには `100svh` を使う。

## ③ IntersectionObserver

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-visible');
    io.unobserve(e.target);
  });
}, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
```

**threshold は 0.01 固定。** 0.1 などにすると、画面高より背の高い要素は
交差比が threshold に届かず**永久に表示されない**（スマホで真っ白になる事故）。
届く上限は `画面高 ÷ threshold` px。threshold 0.15 なら 4,400px を超える要素は出ない。

## ④ 下部スティッキーCTA

```css
body { padding-bottom: calc(var(--mb-sticky-cta-h) + env(safe-area-inset-bottom)); }
.sticky-cta { padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
```
`--mb-sticky-cta-h` はバーの**実高**（padding込み）。実高より小さいと最後の要素が隠れる。

## ⑤ viewport メタ

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
`user-scalable=no` / `maximum-scale=1` は**禁止**（アクセシビリティ違反・検査で落ちる）。

---

## 納品前チェック

```bash
node tools/check-mobile.js path/to/site      # 4幅で実描画検査
node tools/check-mobile.js path/to/site --shot out/   # 375px 全画面スクショ
bash tools/qa-check.sh path/to/site          # モバイル検査を含む全QA
```

**検査が落ちた状態で commit / deploy しない。**
