# 共通コンポーネント仕様

## マーキーテキスト（廃止 / 2026-09-09）

**使わない。** 横に流れる文字列は、読ませる情報がないまま視線を奪い続ける。
装飾のためだけに `width: max-content` を作るため横はみ出しの原因にもなる。

2026-09-09 に bloom / novatech / forge / lila / mori / tomori / tsumugi の
7サイトから撤去した。`check-style.js` ⑧ が検出する。詳細は `.claude/rules.md` 66。

キャッチフレーズを見せたい場合は、静止したテキストとして1回だけ置く。

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

## タイポグラフィ共通仕様（2026-09-09 改訂）

**サイズは下の6段だけを使う。表にない値を新しく作らない。**

旧仕様は 0.72 / 0.85 / 0.92 / 0.95 / 1rem のようにその場で決めた rem を並べていた。
結果、実測で1サイトあたり16〜24種類の文字サイズが混在していた（Refero が公開している
DESIGN.md の実例は5段）。11.52px と 11.84px と 12.16px の差は誰にも見えない。
**見えない差を4つ持つのは、設計していないことの証拠になる。**

| 役割 | サイズ | 行間 | 用途 |
|------|--------|------|------|
| micro | 12px | 1.6 | 注記・セクション番号・キャプション（12px 未満は禁止） |
| caption | 14px | 1.7 | メタ情報・補足・ボタンのラベル |
| body | 16px | 1.85 | 本文。**14.5px は使わない** |
| subheading | clamp(20px, 2.4vw, 26px) | 1.5 | h3・カード見出し |
| heading | clamp(28px, 4vw, 40px) | 1.35 | 日本語の文を h2 に置く場合 |
| display | clamp(38px, 6.4vw, 72px) | 0.98 | `Concept` のような英字1〜2語のセクション見出し |

- **display は英字のディスプレイ語にだけ使う。** 日本語の文に 72px を当てると1行に数語しか
  入らない（`.claude/rules.md` 67）。日本語の見出しは heading を使う。
- 行間は役割ごとに固定する。1サイトで20種類以上の line-height が出るのは、
  段を持たずにその場で決めている状態。

## レスポンシブ共通仕様

| ブレークポイント | padding | グリッド | ヒーロー |
|----------------|---------|---------|---------|
| Desktop（1280px+） | 120px | 2〜3列 | 100dvh（100vh を先に併記） |
| Tablet（768px） | 80px | 1〜2列 | 100dvh（100vh を先に併記） |
| Mobile（375px） | 72px | 1列 | 100dvh（min-height: 520px） |

---

## CLS 対策ルール（必須）

Lighthouse の Cumulative Layout Shift を 0.1 未満に抑えるため、以下を全 lp-* スキルで遵守する。lp-restaurant tomori の CLS 0.205→0.076 改善で実証済み。

### 1. Hero は `align-items: start` + 内側に明示的な `min-height`

**禁止**：`.hero` を `align-items: end`（content を bottom 寄せ）にして web font swap を起こすと、ロード時にコンテンツが大きく上下にシフトして CLS が悪化する。

**必須**：

```css
.hero {
  min-height: 100vh;
  display: grid;
  align-items: start; /* end ではなく start を使う */
}

.hero-inner {
  min-height: 100vh; /* インナーにも min-height を明示 */
  padding-top: calc(var(--header-h) + 220px); /* 上余白で位置を作る */
}
```

### 2. 大型見出しに `font-size-adjust: 0.5`

Hero タイトルなど font-size が大きい要素は、web font ロード前後で fallback フォントとの x-height 差により大きくシフトする。`font-size-adjust` で fallback font の x-height を loaded font に揃え、シフトを抑える。

```css
.hero-title {
  font-size-adjust: 0.5;
}
```

複数の見出し（section-title, page-title 等）にも積極的に適用する。

### 3. 明るい背景の `--text-light` は contrast 4.5:1 を必ず確認

プリセットによっては `--text-light`（#7A746C 等）が `--bg`（#F9F5F0 等）に対して contrast 4.26 と微妙に WCAG AA を満たさないケースがある。**新しいプリセットを使う際は必ず axe-core / Lighthouse で contrast を検証**し、不足する場合はサイト側で `--text-light` を局所的に暗くする：

```css
:root {
  --text-light: #6A655F; /* preset の値より暗くする */
}
```

長期的にはプリセット側を v1.8 と同様に修正する。

---

## 2カラムレイアウトルール（必須）

### 4. 2カラムは `align-items: stretch` 必須

左右カラムの高さが揃わないと右カラムが空中に浮いて見えるため、grid/flex の 2カラム構造には `align-items: stretch`（grid のデフォルト）を必ず維持する。`align-items: start` を 2カラムに使うと右カラムが上端にだけ貼り付いて中央以下が空白になる。

```css
.two-col-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: stretch; /* デフォルトだが明示する */
}
```

### 5. 右カラムが空白で浮く配置は禁止

左カラムに長文・タイムライン等の縦長コンテンツ、右カラムに小さなカード1枚という構成で、右カラムが上端だけに置かれて下半分が空白になる配置は不可。以下のいずれかで解決：

- 右カラムに補足画像・関連情報・CTA を追加して縦の長さを揃える
- `align-self: center` で右カラムを中央寄せして「意図的な空白」に変える
- カラム配分を見直して右カラムをワイドにする
- 縦長すぎる場合は2カラムをやめて1カラム縦並びに切り替える

`grid` の暗黙的な空き領域が「未完成感」を出すため、空白は必ず設計上の意図を持たせる。
