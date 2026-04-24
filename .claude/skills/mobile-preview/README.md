# mobile-preview v1.1 — 多デバイスフルページスクショスキル

## 概要

静的 LP / HTML を Playwright で 6 デバイス分フルページ撮影する共通ツール。
NovaTech 全案件で使い回せる恒久資産。

## v1.1 改修内容

**問題**: v1.0 ではヒーロー以外のセクションが空白になる現象が発生。
**原因**: IntersectionObserver による `.fade-in` 要素が `opacity:0` のまま撮影されていた。

**修正内容**:
1. フェードイン/トランジション CSS を撮影前に強制無効化
2. 全ページスクロールで IntersectionObserver と `loading="lazy"` を発火
3. `document.fonts.ready` でフォント完全読み込みを保証
4. デバイス構成を 2024–2025 主流機種に刷新（iPhone-17-Pro / Galaxy-S24 / iPad-Air-13）

## セットアップ（初回のみ）

```bash
cd /Users/satouyuuichi/Developer/novatech-siteon-skills/.claude/skills/mobile-preview/
npm install
npx playwright install chromium
```

## 基本的な使い方

```bash
node scripts/mobile-preview.js [対象] [出力先]
```

### ローカルファイル指定
```bash
node scripts/mobile-preview.js \
  ~/Developer/tsukinagi-kamakura-lp/index.html \
  /tmp/previews
```

### HTTP サーバー経由（外部リソースが必要な場合）
```bash
python3 -m http.server 8888 -d ~/Developer/myproject &
node scripts/mobile-preview.js http://localhost:8888/ /tmp/previews
```

## 引数

| 引数 | デフォルト | 説明 |
|---|---|---|
| 第1引数 | `./index.html` | 対象の HTML パス または URL |
| 第2引数 | `/tmp/previews` | PNG 出力先ディレクトリ |

## 出力例

```
📸 撮影開始: file:///Users/.../index.html
📁 保存先: /tmp/previews

✅ iPhone-17-Pro   → /tmp/previews/preview-iPhone-17-Pro.png (1204KB)
✅ iPhone-SE       → /tmp/previews/preview-iPhone-SE.png (892KB)
✅ iPad-Air-13     → /tmp/previews/preview-iPad-Air-13.png (1453KB)
✅ Galaxy-S24      → /tmp/previews/preview-Galaxy-S24.png (967KB)
✅ Desktop-1280    → /tmp/previews/preview-Desktop-1280.png (1820KB)
✅ Desktop-1920    → /tmp/previews/preview-Desktop-1920.png (2105KB)

🎉 完了: 成功 6 / 失敗 0
```

## 既知の制約

- iOS Safari 固有の CSS バグ（`-webkit-` 系）は Chromium では検知できない
- `file://` プロトコルでは外部フォント（Google Fonts）が読み込まれない場合あり → HTTP サーバー経由を推奨
- `networkidle` 待機 30 秒のタイムアウトあり。重い外部リソースを含む場合は HTTP サーバー経由で高速化

## 参謀 Claude からのメモ

新規 LP 完成時は必ずこのスキルで 6 デバイス確認してから Yuichi に報告。
iOS Safari 実機確認の代替ではなく「事前スクリーニング」として使用。
