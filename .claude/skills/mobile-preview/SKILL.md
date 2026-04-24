# mobile-preview skill v1.1

## 1. 目的

静的 LP / HTML ファイルを複数デバイスサイズでフルページスクリーンショット撮影する共通スキル。
全案件（月凪・bloom・mori 等）で使い回せる恒久資産として整備。

Playwright を使用して実際の CSS/JS 描画済み状態を画像化するため、
Lighthouse の desktop エミュレーションより精度が高い。

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

## 3. 対応デバイス一覧（v1.1 刷新）

| デバイス名 | 解像度 | 用途 |
|---|---|---|
| iPhone-17-Pro | 402×874 (deviceScaleFactor: 3) | iOS Safari 2024-2025 主流機種 |
| iPhone-SE | 375×667 (deviceScaleFactor: 2) | iOS Safari 最小基準 |
| iPad-Air-13 | 1024×1366 (deviceScaleFactor: 2) | タブレット確認（大画面） |
| Galaxy-S24 | 384×857 (deviceScaleFactor: 3) | Android Chrome 2024 基準 |
| Desktop-1280 | 1280×800 | デスクトップ標準 |
| Desktop-1920 | 1920×1080 | デスクトップ Wide |

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

出力ファイル名: `preview-{デバイス名}.png`

## 6. トラブルシューティング

| エラー | 対処 |
|---|---|
| `chromium not found` | `npx playwright install chromium` を再実行 |
| `timeout` | 外部リソース（Unsplash 等）の読み込みに時間がかかる場合。HTTP サーバー経由に切り替え |
| `file:// CORS エラー` | `python3 -m http.server` でローカルサーバー経由に切り替え |
| `fonts not loaded` | スクリプト内の `document.fonts.ready` 待機が機能しているか確認 |

## 参謀Claude からのメモ

- 新規案件でデモを作ったら必ずこのスキルで6デバイス撮影してから Yuichi に報告すること
- Puppeteer（既存の capture.mjs）と役割分担: capture.mjs はビフォーアフター比較用、本スキルは多デバイス網羅確認用
- iOS Safari 固有の崩れは Chrome エミュレーションでは検知できない。実機確認の代替ではなくあくまで参考として使うこと
