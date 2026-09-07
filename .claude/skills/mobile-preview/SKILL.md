# mobile-preview skill v1.3

## 1. 目的

静的 LP / HTML ファイルを複数デバイスサイズでフルページスクリーンショット撮影する共通スキル。
全案件（月凪・bloom・mori 等）で使い回せる恒久資産として整備。

Playwright を使用して実際の CSS/JS 描画済み状態を画像化するため、
Lighthouse の desktop エミュレーションより精度が高い。

## v1.3 変更点（2026-09-07 メニュー展開状態の監査を追加）

| 項目 | v1.2 | v1.3 |
|------|------|------|
| 検査する状態 | 初期表示・閉じた状態のみ | **ハンバーガー展開状態を追加**（モバイル幅 <768px で自動実行） |
| ルール50 パネル背景 | 未検査 | `backgroundColor` の alpha < 1 を検出 |
| ルール51 パネル位置 | 未検査 | パネル上端とヘッダー下端のズレ > 1px を検出 |
| ルール52 行頭禁則 | 未検査 | Range実測で行頭の長音符・拗促音・句読点・閉じ括弧の孤立を検出 |
| ルール53 アンカー | 未検査 | `[id]` の `scroll-margin-top` が 0 またはヘッダー実高未満を検出 |
| 終了コード | 横はみ出し時に 1 | 上記の違反でも 1 |

**追加理由**: bloom を10ビューポートで検査し横オーバーフロー0pxで「問題なし」と報告した直後、
iOSシミュレータで開いたら上記4種が即座に見つかった。**横幅の数値検査では原理的に検出できない**
種類の不具合であり、ルール化（rules.md 50〜53）だけでは同じ見落としが再発するため自動化した。

検出器の妥当性は、修正前の公開版（4種すべて検出）と修正後のローカル版（0件・exit 0）の
両方で確認済み。

### 出力例

```
✅ 375x667    scrollWidth=  375 / innerWidth=  375
   ❌ [メニュー展開/ルール50/高] オーバーレイパネルの背景が半透明（alpha=0.98）。背面が透けて可読性が落ちる
      └ nav-wrap
   ❌ [メニュー展開/ルール51/高] パネルがヘッダーの裏に 13px 潜っている（ヘッダー実高と固定px参照のズレ）
      └ nav-wrap
   ❌ [メニュー展開/ルール52/中] 行頭に「ー」が孤立している
      └ brand-meta : 青山エリアの路面店 / 髪質改善・トータルビュー
```

### 検出対象の要素

ハンバーガーは `[data-menu-toggle]` / `.menu-toggle` / `[aria-controls][aria-expanded]` /
`button[class*="hamburger"]` / `button[class*="menu"]` の順で探す。
パネルは `aria-controls` の参照先から `position: fixed|absolute` の祖先まで遡って特定する
（`aria-controls` が中身の `nav` を指し、背景を持つのは親パネルというケースに対応）。
検出できない場合は「該当なし」として扱い、失敗にはしない。

## v1.2 変更点（2026-09-07 全アスペクト比レスポンシブ堅牢化）

| 項目 | v1.1 | v1.2 |
|------|------|------|
| 検証ビューポート | 6デバイス（機種名ベース） | **10ビューポート（幅×高さベース）** — 最小スマホ〜PC帯 + アスペクト比異常系 |
| 横オーバーフロー判定 | なし | **全ビューポートで `documentElement.scrollWidth <= window.innerWidth` を判定し数値を記録** |
| はみ出し原因の特定 | なし | **該当要素のセレクタ・幅・right座標をレポートに出力** |
| レポート出力 | なし | `responsive-audit.md` / `responsive-audit.json` |
| 監査のみ実行 | なし | `--audit-only`（スクショを省略して高速検査） |
| 終了コード | 撮影失敗時のみ 1 | 撮影失敗 **または横はみ出し検出時** に 1 |

## v1.1 変更点

| 項目 | v1.0 | v1.1 |
|------|------|------|
| フェード要素 | opacity:0 のまま空白 | CSS強制上書きで opacity:1 に |
| IntersectionObserver | 未発火 | 全ページスクロールで発火 |
| lazy-load 画像 | 未読み込み | スクロール後に読み込み完了 |
| フォント待機 | なし | document.fonts.ready を待機 |
| デバイス構成 | iPhone-14-Pro / Galaxy-S9+ / iPad-Mini | iPhone-17-Pro / Galaxy-S24 / iPad-Air-13 に刷新 |

## 2. 使用方法（Claude Code への指示例）

```
node /Users/satouyuuichi/Developer/novatech-siteon-skills/.claude/skills/mobile-preview/scripts/mobile-preview.js \
  [対象パス or URL] \
  [出力ディレクトリ]
```

### 例: ローカルファイル

```bash
node .claude/skills/mobile-preview/scripts/mobile-preview.js \
  ~/Developer/tsukinagi-kamakura-lp/index.html \
  /tmp/previews
```

### 例: ローカルサーバー

```bash
# サーバーを起動してから
python3 -m http.server 8888 -d ~/Developer/tsukinagi-kamakura-lp &
node .claude/skills/mobile-preview/scripts/mobile-preview.js \
  http://localhost:8888/ \
  /tmp/previews
```

### 例: 本番 URL

```bash
node .claude/skills/mobile-preview/scripts/mobile-preview.js \
  https://bloom.siteon.jp \
  ~/Developer/novatech-siteon-client-bloom/previews
```

## 3. 検証ビューポート一覧（v1.2）

### 幅ベース（高さは標準比率）

| ビューポート | DPR | 用途 |
|---|---|---|
| 320x568 | 2 | 最小スマホ |
| 375x667 | 2 | 現行スマホ帯（iPhone SE） |
| 390x844 | 3 | 現行スマホ帯 |
| 430x932 | 3 | 現行スマホ帯（Pro Max） |
| 768x1024 | 2 | タブレット縦 |
| 1024x768 | 2 | タブレット横 |
| 1280x800 | 1 | PC帯 |
| 1536x960 | 1 | PC帯 |
| 1920x1080 | 1 | PC帯 |

### アスペクト比異常系

| ビューポート | DPR | 用途 |
|---|---|---|
| 1280x600 | 1 | 低い横長。ノートPC + ブラウザUI圧迫を想定。hero と fixed 要素の崩れ検出用 |

## 3b. 横オーバーフロー検査（全ビューポート必須）

判定基準:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

- 全ビューポートで `scrollWidth` / `innerWidth` / `clientWidth` の**数値を記録**する
- はみ出し検出時は、`html` / `body` の `overflow-x: hidden` を一時的に外して実際の溢れ幅を測り、
  **原因要素のセレクタ・幅・right座標**を特定してレポートに含める
  （clip祖先を持つ要素は除外し、溢れ幅の大きい順に上位15件）
- 対応する品質ルール: `.claude/rules.md` カテゴリ4 の 37 / 38 / 39 / 42 / 43 / 46 / 49

出力レポート:

| ファイル | 内容 |
|---|---|
| `responsive-audit.md` | 全ビューポートの数値表 + はみ出し原因要素の表 |
| `responsive-audit.json` | 同内容の機械可読版（CI・差分比較用） |

横はみ出しを1つでも検出すると **終了コード 1** を返す。

### 監査のみ実行（高速）

```bash
node .claude/skills/mobile-preview/scripts/mobile-preview.js <対象> <出力先> --audit-only
```

> 実装は Playwright（Chromium）。指示書上の「Puppeteer検査」は同等の実描画検査を指す。
> **Chromium の自動検査を通っても iOS Safari 実機では崩れることがある**（lessons.md 7）。
> 本スキルは実機確認の代替ではない。
> 既存の `tools/check-mobile.js`（4幅・崩れ12項目）とは役割分担 —
> check-mobile.js は commit ゲート、本スキルは全アスペクト比の網羅確認。

## 4. 前提条件

- Node.js 18 以上
- @playwright/test インストール済み（`npm install` 後に `npx playwright install chromium`）

```bash
cd /Users/satouyuuichi/Developer/novatech-siteon-skills/.claude/skills/mobile-preview/
npm install
npx playwright install chromium
```

## 5. 出力先ルール

| 用途 | 出力先 |
|---|---|
| テスト・開発時 | `/tmp/previews/` |
| 本番確認・Yuichi 実機代替 | 対象プロジェクトの `./previews/` |
| Git 管理 | `previews/` は `.gitignore` に追記して除外 |

出力ファイル名: `preview-{幅x高さ}.png`（例: `preview-390x844.png`）
レポート: `responsive-audit.md` / `responsive-audit.json`

## 6. トラブルシューティング

| エラー | 対処 |
|---|---|
| `chromium not found` | `npx playwright install chromium` を再実行 |
| `timeout` | 外部リソース（Unsplash 等）の読み込みに時間がかかる場合。HTTP サーバー経由に切り替え |
| `file:// CORS エラー` | `python3 -m http.server` でローカルサーバー経由に切り替え |
| `fonts not loaded` | スクリプト内の `document.fonts.ready` 待機が機能しているか確認 |

## 7. スクロール動画録画（Instagram リール用）

`scripts/scroll-video.js` でデモサイトのスムーズスクロール動画を MP4 録画できる。

### コマンド

```bash
# 本番 URL を録画
node .claude/skills/mobile-preview/scripts/scroll-video.js \
  https://y1-310.github.io/novatech-siteon-client-bloom/

# ローカルファイルを録画
node .claude/skills/mobile-preview/scripts/scroll-video.js ./index.html
```

出力は実行ディレクトリの `output/` に保存される。
ファイル名: `{サイト名}_scroll_{日付}.mp4`

### 仕様

| 項目 | 値 |
|------|-----|
| デバイス | iPhone 17 Pro (402×874, deviceScaleFactor:3) |
| 出力サイズ | 1080×1920（縦型リール用、FFmpegでスケール） |
| スクロール速度 | 200px/秒（ease-in-out） |
| 底部停止 | 2秒 |
| 最大録画時間 | 30秒（自動停止） |
| 出力フォーマット | MP4 H.264 / FFmpegなし時は WebM |

### 前提条件

- Playwright インストール済み（`npm install` + `npx playwright install chromium`）
- FFmpeg（MP4変換用、任意）: `brew install ffmpeg`

### FFmpegなし時のフォールバック

FFmpegが未インストールの場合は WebM 形式で保存される。  
`brew install ffmpeg` 後に再実行すると MP4 で出力される。

---

## 参謀Claude からのメモ

- 新規案件でデモを作ったら必ずこのスキルで10ビューポート撮影 + 横オーバーフロー監査をしてから Yuichi に報告すること
- Puppeteer（既存の capture.mjs）と役割分担: capture.mjs はビフォーアフター比較用、本スキルは多デバイス網羅確認用
- iOS Safari 固有の崩れは Chrome エミュレーションでは検知できない。実機確認の代替ではなくあくまで参考として使うこと
