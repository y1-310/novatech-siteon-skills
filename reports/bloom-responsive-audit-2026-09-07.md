# bloom 全アスペクト比レスポンシブ検査レポート（2026-09-07）

- 対象: `/Users/satouyuuichi/Developer/novatech-siteon-client-bloom/index.html`（1963行）
- ツール: mobile-preview skill v1.2（Playwright / Chromium）+ 静的ルール照合
- 位置づけ: **bloom 改修パイロットの判断材料。本レポート時点では修正を行っていない**
- 対応ルール: `.claude/rules.md` カテゴリ4「全アスペクト比レスポンシブ（40〜49）」

---

## 1. 横オーバーフロー実測（全10ビューポート）

判定基準: `document.documentElement.scrollWidth <= window.innerWidth`

| ビューポート | 用途 | scrollWidth | innerWidth | clientWidth | 判定 | はみ出し |
|---|---|---|---|---|---|---|
| 320x568 | 最小スマホ | 320 | 320 | 320 | ✅ | 0px |
| 375x667 | 現行スマホ帯 (iPhone SE) | 375 | 375 | 375 | ✅ | 0px |
| 390x844 | 現行スマホ帯 | 390 | 390 | 390 | ✅ | 0px |
| 430x932 | 現行スマホ帯 (Pro Max) | 430 | 430 | 430 | ✅ | 0px |
| 768x1024 | タブレット縦 | 768 | 768 | 768 | ✅ | 0px |
| 1024x768 | タブレット横 | 1024 | 1024 | 1024 | ✅ | 0px |
| 1280x800 | PC帯 | 1280 | 1280 | 1280 | ✅ | 0px |
| 1536x960 | PC帯 | 1536 | 1536 | 1536 | ✅ | 0px |
| 1920x1080 | PC帯 | 1920 | 1920 | 1920 | ✅ | 0px |
| 1280x600 | アスペクト比異常系（低い横長） | 1280 | 1280 | 1280 | ✅ | 0px |

**横はみ出し 0 ビューポート。** はみ出し原因要素の検出も 0 件。
機械可読版: `reports/bloom-responsive-audit-2026-09-07.json`

---

## 2. 新ルール 40〜49 の静的違反箇所

| ルール | 内容 | 判定 | 該当行 | 重要度 |
|---|---|---|---|---|
| 40 | `box-sizing: border-box` を `*, *::before, *::after` に適用 | ❌ | `index.html:46-48` — `* { box-sizing: border-box; }` のみで疑似要素が未カバー | 中 |
| 41 | `100vh` に fallback 併記 | ⚠️ | `index.html:323-324`, `359-360` — `min-height: 100vh; min-height: 100svh;`。ルールは `100dvh` を指定しているが実装は `svh` | 中 |
| 42 | `100vw` 使用禁止 | ✅ | 該当なし | — |
| 43 | コンテナの固定px幅禁止 | ⚠️ | `index.html:734-737` `.gallery-card { min-width:260px; max-width:260px }` / `index.html:739` `.gallery-card img { width:260px }` | 低 |
| 44 | `img`/`video` の `max-width:100%; height:auto` + CLS対策 | ✅ | `index.html:76-81` で img に適用済み。全21件の `<img>` に `width`/`height` 属性あり。`<video>` 要素なし | — |
| 45 | 見出し・主要余白の `clamp()` 流体化 | ❌ | 未クランプ: `.brand-logo` 1.5rem (`239`) / `.menu-panel-head h3` 1.5rem (`634`) / `.staff-card h3` 1.2rem (`774`) / `.footer-logo` 1.6rem (`955`) | 中 |
| 46 | grid は `minmax(0, 1fr)` 必須 | ❌ | `index.html:1043`, `1122`, `1170`, `1178`, `1182` — モバイルブレークポイント内が `grid-template-columns: 1fr;` のまま（計5箇所） | 高 |
| 47 | 日本語長文見出しに `overflow-wrap: break-word` | ✅ | `index.html:50` で h1/h2/h3/.hero-copy/.section-title に設定済み。`54` でカード内 h3 に `anywhere` 併用 | — |
| 48 | `fixed`/`sticky` の `env(safe-area-inset-*)` 対応 | ❌ | 対応済みは `.sticky-cta` (`987`) のみ。未対応: `.skip-link` (`94` top/left) / `.header` (`207` top:0) / `.nav-wrap` (`1072` inset) | 中 |
| 49 | 横長要素の親に `overflow-x: auto` | ✅ | `<table>` / `<pre>` 要素なし。該当なし | — |

### 集計

- 重要度 **高**: 1件（ルール46 / 5箇所）
- 重要度 **中**: 3件（ルール40 / 41 / 45 / 48 のうち 40・45・48。41は判断待ちのため下記参照）
- 重要度 **低**: 1件（ルール43）
- 適合: ルール42 / 44 / 47 / 49

---

## 3. Yuichi 判断が必要な項目

### ルール41 — `dvh` か `svh` か

bloom は hero に `min-height: 100svh` を使っている。`svh`（small viewport height）はアドレスバー表示時の最小高さを基準にするため、**hero の `min-height` としては `dvh` より安全**（`dvh` はアドレスバーの出入りで高さが動的に変わり、スクロール中にレイアウトが揺れる）。

選択肢:
- (a) ルール41に「`min-height` の hero は `svh` を推奨、`height` 指定は `dvh`」と条件を書き分ける
- (b) bloom を `dvh` に合わせてルールどおりにする

**推奨は (a)。** bloom の実装のほうが技術的に妥当。

### ルール43 — カルーセル内の固定px幅

`.gallery-card` の 260px 固定は scroll-snap 横スクロールカルーセル内での意図的な指定で、実測でもはみ出していない。ルール43に「横スクロールコンテナ内のアイテムは除外」の例外を追記するのが妥当。

---

## 4. 改修パイロットの推奨順序（未実施）

1. **ルール46（高）** — `grid-template-columns: 1fr` → `minmax(0, 1fr)` 5箇所。機械的置換で副作用なし
2. **ルール40（中）** — `*` → `*, *::before, *::after`
3. **ルール48（中）** — `.header` / `.nav-wrap` / `.skip-link` に `env(safe-area-inset-*)` を追加
4. **ルール45（中）** — 見出し4箇所を `clamp()` 化。モバイル用の固定値上書き（`1148` 等）も併せて整理
5. ルール41 / 43 は上記の Yuichi 判断後

改修後は `node .claude/skills/mobile-preview/scripts/mobile-preview.js <bloom> <out>` で10ビューポート再検査し、さらに `node tools/check-mobile.js <bloom>` を commit ゲートとして通す。
