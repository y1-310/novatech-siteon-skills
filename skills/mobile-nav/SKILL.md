---
name: mobile-nav
description: NovaTech/SITEONのハンバーガーメニュー実装仕様（iPhone実機での不具合対策・アクセシビリティ対応・アニメーション禁止対象含む）。モバイルナビゲーション生成・修正時に必須参照。全業態LPスキル（lp-salon等）から自動的に呼び出される。
---

# mobile-nav — モバイルナビゲーション共通仕様

このスキルはNovaTech/SITEONの全業態LP共通のハンバーガーメニュー実装ルールです。
2026-04-18 iPhone 17実機確認で発覚した不具合の再発防止ルールを含みます。
マスターファイル: `_common/mobile-nav.md`

## 主要ルール（要約）

### 実装仕様

| 項目 | 値 |
|------|-----|
| ブレークポイント | max-width: 820px（lp-restaurant: 720px / lp-architect・lp-corporate: 760px） |
| オーバーレイ方式 | `position: fixed` でヘッダー直下に展開 |
| z-index | 999以上（スティッキーCTAより上） |
| タップターゲット | ナビリンク `min-height: 44px` / ハンバーガーボタン `44×44px` |
| aria必須 | `aria-expanded` / `aria-controls` / `aria-label` |

### 絶対に守るルール（iPhone実機対応）

**1. 背景色は必ず不透過**
```css
/* ✅ 正しい */
background: var(--bg);
/* ❌ 禁止 */
background: rgba(255,255,255,0.3); /* 透過になる */
```

**2. テキスト色を `.menu-open` で必ず上書き**
```css
/* hero状態の白が残る問題を防ぐ */
.menu-open .nav a { color: var(--text); }
```

**3. Safari iOS 水平はみ出し対策**
```css
/* html と body の両方に設定（body 単体では不十分）*/
html { overflow-x: hidden; }
body { overflow-x: hidden; }
```
原因: マーキー等のCSS transformアニメーションがSafari iOSの幅計算をトリガー。Chromeでは再現しないため実機確認必須。

**4. z-index 不足禁止**
```css
.nav-wrap { z-index: 999; } /* スティッキーCTA(z-index:90)より上 */
```

**5. prefers-reduced-motion 対応**
```css
@media (prefers-reduced-motion: reduce) {
  .nav-wrap { transition-duration: 0.01ms; }
}
```

### アクセシビリティ必須項目

- `aria-expanded="false"` 初期値
- クリックで `aria-expanded` と `aria-label` を動的更新
- Esc キーでメニューを閉じる
- ナビリンクのタップでメニューを閉じる
- メニューを閉じた後 `.menu-toggle` にフォーカスを戻す

### メニュー開閉の状態管理

`body` に `.menu-open` クラスをトグルして全スタイルを制御する。
開いた状態でスティッキーCTAを `display: none` にすること（重複回避）。

## 詳細ルール

詳細ルールは元ファイル `_common/mobile-nav.md` を参照してください。
HTML/CSS/JSの完全なテンプレートコード、よくある失敗パターン集、
Puppeteer検証コマンドは元ファイルに記載されています。
このスキルを呼び出した際、Codex は元ファイルを必要に応じて併読してください。
