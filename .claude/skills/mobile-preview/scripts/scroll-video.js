/**
 * scroll-video.js v2.0 — ストップ&スクロール録画（Instagram リール用）
 *
 * 使い方: node scripts/scroll-video.js <URL or ./index.html>
 * 出力:   ./output/{サイト名}_scroll_{日付}.mp4
 *
 * highlights 配列でポイントを定義。各ポイント間を 200px/s で滑らかにスクロールし、
 * 指定秒数停止する。他サイトはここの highlights を差し替えるだけ。
 */
'use strict';

const { chromium } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');
const { exec, execSync } = require('child_process');

// ── 引数 ─────────────────────────────────────────────────────────────────────
const targetArg = process.argv[2];
if (!targetArg) {
  console.error('使い方: node scripts/scroll-video.js <URL or ./index.html>');
  process.exit(1);
}
const targetUrl = targetArg.startsWith('http')
  ? targetArg
  : 'file://' + path.resolve(targetArg);

// ── サイト名抽出 ──────────────────────────────────────────────────────────────
const siteName = targetUrl.startsWith('file://')
  ? path.basename(path.dirname(targetUrl.replace('file://', ''))) || 'site'
  : new URL(targetUrl).hostname.replace(/\W+/g, '-');

const dateStr   = new Date().toISOString().slice(0, 10);
const outputDir = path.resolve(process.cwd(), 'output');
const tmpDir    = path.join(outputDir, '_tmp');
const mp4Path   = path.join(outputDir, `${siteName}_scroll_${dateStr}.mp4`);
const webmPath  = path.join(outputDir, `${siteName}_scroll_${dateStr}.webm`);
fs.mkdirSync(tmpDir, { recursive: true });

// ── ハイライト設定（BLOOMデフォルト）────────────────────────────────────────
// scrollTo: スクロール先 Y座標（px）/ pause: 停止時間（ms）
const highlights = [
  { scrollTo: 0,    pause: 2000 },  // ファーストビュー
  { scrollTo: 900,  pause: 1500 },  // メニューセクション
  { scrollTo: 2500, pause: 1500 },  // ギャラリー
  { scrollTo: 4500, pause: 1500 },  // スタイル一覧
  { scrollTo: 6000, pause: 1500 },  // 料金セクション
  { scrollTo: 8000, pause: 2000 },  // CTA・フッター
];

// ── スクロール速度設定 ────────────────────────────────────────────────────────
const SCROLL_STEP  = 10;   // px/ステップ
const SCROLL_SPEED = 200;  // px/秒
const SCROLL_DELAY = Math.round(SCROLL_STEP / SCROLL_SPEED * 1000); // 50ms

function hasFfmpeg() {
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); return true; }
  catch { return false; }
}

async function smoothScrollTo(page, from, to) {
  if (from === to) return;
  const step = from < to ? SCROLL_STEP : -SCROLL_STEP;
  let pos = from;
  while ((step > 0 && pos < to) || (step < 0 && pos > to)) {
    pos = step > 0 ? Math.min(pos + step, to) : Math.max(pos + step, to);
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    await page.waitForTimeout(SCROLL_DELAY);
  }
}

// ── メイン ────────────────────────────────────────────────────────────────────
(async () => {
  // 推定尺を事前計算
  const totalScrollDist = highlights.reduce((sum, h, i) =>
    i === 0 ? sum : sum + Math.abs(h.scrollTo - highlights[i - 1].scrollTo), 0);
  const scrollSec = totalScrollDist / SCROLL_SPEED;
  const pauseSec  = highlights.reduce((s, h) => s + h.pause, 0) / 1000;
  const estSec    = scrollSec + pauseSec;

  console.log(`🎬 録画開始: ${targetUrl}`);
  console.log(`   推定尺: ${estSec.toFixed(1)}秒 (スクロール ${scrollSec.toFixed(1)}s + 停止 ${pauseSec.toFixed(1)}s)`);
  console.log(`📁 出力先: ${mp4Path}\n`);

  const browser = await chromium.launch({
    args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
  });
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    recordVideo: { dir: tmpDir, size: { width: 402, height: 874 } },
  });
  const page = await context.newPage();

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('   ページ安定待ち (3秒)...');
  await page.waitForTimeout(3000);

  // Chromium スクロールバグ回避
  await page.addStyleTag({
    content: 'html, body { overflow: auto !important; scroll-behavior: auto !important; }'
  });
  await page.waitForTimeout(200);

  // ハイライト再生
  let currentPos = 0;
  for (const h of highlights) {
    if (h.scrollTo !== currentPos) {
      const dist = Math.abs(h.scrollTo - currentPos);
      console.log(`   → ${currentPos}px → ${h.scrollTo}px (${dist}px, ${(dist / SCROLL_SPEED).toFixed(1)}s)`);
      await smoothScrollTo(page, currentPos, h.scrollTo);
      currentPos = h.scrollTo;
    }
    console.log(`   ⏸  ${h.scrollTo}px で ${h.pause / 1000}s 停止`);
    await page.waitForTimeout(h.pause);
  }

  console.log('\n⏹️  録画停止中...');
  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!videoPath || !fs.existsSync(videoPath)) {
    console.error('❌ 動画ファイルが取得できませんでした');
    process.exit(1);
  }

  const finalPath = hasFfmpeg() ? mp4Path : webmPath;
  if (hasFfmpeg()) {
    console.log('🔄 MP4変換中 (FFmpeg)...');
    await new Promise((resolve, reject) => {
      const vf = 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black';
      exec(
        `ffmpeg -y -i "${videoPath}" -vf "${vf}" -r 60 -c:v libx264 -crf 20 -preset fast -pix_fmt yuv420p "${mp4Path}"`,
        (err, _out, stderr) => err ? reject(new Error(stderr)) : resolve()
      );
    });
    fs.unlinkSync(videoPath);
  } else {
    fs.renameSync(videoPath, webmPath);
    console.log('⚠️  FFmpegなし → WebM保存。変換: brew install ffmpeg');
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });

  exec(`cmux notify --title "録画完了" --body "${siteName}_scroll_${dateStr}"`, () => {});
  if (process.platform === 'darwin') exec(`open "${outputDir}"`, () => {});

  console.log(`\n✅ 完了`);
  console.log(`\n📁 成果物の場所:\n  ${finalPath}`);
  console.log(`\n🔍 確認コマンド:\n  open ${finalPath}`);
})();
