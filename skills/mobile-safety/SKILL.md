---
name: mobile-safety
description: NovaTech/SITEONの全LP・全クライアントサイト共通のモバイル表示崩れ防止仕様。CSS必須ベースライン（日本語折り返し・アンカーオフセット・タップ領域・iOSオートズーム・100vh・IntersectionObserver）と、Chromiumで実描画して判定する自動検査 tools/check-mobile.js の使い方。HTML/CSS生成・修正時とデプロイ前に必須参照。
---

# mobile-safety — モバイル表示崩れ防止仕様

全業態LP・全クライアントサイト共通。**スマホ実機でのUI崩れを構造的に防ぐ**ためのルール。
2026-08-26 に自社サイト＋デモ8件を 320/375/390/430px で実描画検査した結果を元に策定。
マスターファイル: `_common/mobile-safety.md`

## まず実行する

```bash
node tools/check-mobile.js <site-dir>            # 4幅で実描画検査
node tools/check-mobile.js <site-dir> --shot out/  # 375px 全画面スクショも出す
bash tools/qa-check.sh <site-dir>                # ⑤として自動実行される
```

pre-commit フックが qa-check.sh 経由で自動実行する。**❌のまま commit / deploy しない。**

## 新規サイトを作るときの手順

1. `<style>` の**末尾**に `_common/mobile-safety.md` の必須CSSブロックをそのまま貼る
2. `--mb-header-h` をスマホ幅でのヘッダー実高に差し替える
3. `node tools/check-mobile.js <site-dir>` が ✅ になるまで直す

## 絶対に守るルール

### 1. 変数名は `--mb-` 接頭辞を付ける

```css
/* ✅ 正しい */
:root { --mb-header-h: 76px; --mb-tap-min: 44px; }
/* ❌ 禁止: サイト側の同名変数を壊す（ヘッダー高・ナビ位置が崩れる） */
:root { --header-h: 76px; }
```

### 2. 日本語の折り返しは全要素に効かせる

```css
/* ✅ 正しい */
body, body * { overflow-wrap: anywhere; }
```

`word-break: keep-all` 単独ではCJK連続が分割されず、コンテナ幅を超えて右端が切れる。
`overflow-wrap` は**継承プロパティ**なので `body` だけに指定すると、
個別に `break-word` を当てた要素で溢れが残る。
`break-word` では grid / flex の **min-content 幅が縮まない**ため `anywhere` でなければ直らない。

### 3. `overflow-x: hidden` は解決策ではない

ルートの `overflow-x: hidden` は**はみ出しを隠すだけ**で、内容は切れたまま。
検査ツールは一時的に hidden を外して本当の溢れ幅を測るので誤魔化せない。原因側を直すこと。

### 4. アンカーは固定ヘッダー分オフセットする

```css
[id] { scroll-margin-top: calc(var(--mb-header-h) + 12px); }
```
これがないと `#menu` 等に飛んだとき見出しがヘッダーの裏に隠れる。

### 5. IntersectionObserver の threshold は 0.01 固定

```js
}, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
```
0.1 などにすると**画面高より背の高い要素は永久に表示されない**（スマホで真っ白になる事故）。
表示できる上限は `画面高 ÷ threshold` px。threshold 0.15 なら 4,400px を超える要素は出ない。

横スクロールするギャラリー内のカードは画面外に並ぶため発火しない。`fade-in` を無効化する。

### 6. iOSのオートズーム防止はタッチ端末だけに効かせる

```css
@media (pointer: coarse) {
  input, select, textarea { font-size: 16px; }
}
```
16px 未満だとフォーカス時に画面が拡大する。`@media` を外すとPCの見た目まで変わる。

### 7. タップ領域 44x44px

```css
@media (pointer: coarse) {
  a[href^="tel:"], .footer-links a { display: inline-block; padding: 14px 0; margin: -14px 0; }
}
```
`14px` は「本文 16px + 14px×2 = 44px」から。**12px だと 40px で足りない**。
負マージンで見た目の位置を維持する。横幅が足りない短いリンクは `min-width: var(--mb-tap-min)`。

### 8. 100vh には 100svh のフォールバックを添える

```css
.hero { min-height: 100vh; min-height: 100svh; }
```
`100dvh` はスクロール中に高さが変動してガタつくため、ヒーローには `100svh` を使う。

### 9. 文字は 12px 以上

日本語は12px未満だと実機で潰れる。ヘッダーの説明文など折り返したくない行は
`word-break: keep-all` を併用して区切りのスペースでだけ改行させる。

### 10. viewport は固定しない

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
`user-scalable=no` / `maximum-scale=1` は禁止（アクセシビリティ違反・検査で落ちる）。

## 既存スキルとの役割分担

| スキル / ツール | 役割 |
|---|---|
| `mobile-safety`（このスキル） | **合否判定**。崩れがあれば ❌ で止める |
| `mobile-preview` | **目視用スクショ**。複数デバイスでフルページ撮影 |
| `mobile-nav` | ハンバーガーメニューの実装仕様 |

**`mobile-preview` のスクショだけで判断しない。**
`mobile-preview` は撮影時に `opacity: 1` を強制上書きするため、
「スクロールしても表示されない fade-in」がスクショ上は正常に見える。
実際に 2026-08-26 の調査では、この事故クラスがスクショ運用で見逃されていた。
合否は必ず `check-mobile.js` で取ること。

## 詳細

必須CSSブロックの全文と検査項目の一覧は `_common/mobile-safety.md` を参照。
ハンバーガーメニューの実装仕様は `mobile-nav` スキルを併読すること。
