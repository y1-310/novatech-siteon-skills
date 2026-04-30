/**
 * scroll-video.js v1.4 — スクロール動画録画（Instagram リール用）
 *
 * 使い方: node scripts/scroll-video.js <URL or ./index.html>
 * 出力:   ./output/{サイト名}_scroll_{日付}.mp4
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

const dateStr    = new Date().toISOString().slice(0, 10);
const outputDir  = path.resolve(process.cwd(), 'output');
const tmpDir     = path.join(outputDir, '_tmp');
const mp4Path    = path.join(outputDir, `${siteName}_scroll_${dateStr}.mp4`);
const webmPath   = path.join(outputDir, `${siteName}_scroll_${dateStr}.webm`);
fs.mkdirSync(tmpDir, { recursive: true });

function hasFfmpeg() {
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); return true; }
  catch { return false; }
}

// ── メイン ────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`🎬 録画開始: ${targetUrl}`);
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

  // 1. ページロード → 3秒待機
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('   ページ安定待ち (3秒)...');
  await page.waitForTimeout(3000);

  // 2. ファーストビュー 2秒静止
  await page.evaluate(() => window.scrollTo(0, 0));
  console.log('   ファーストビュー静止 (2秒)...');
  await page.waitForTimeout(2000);

  // 3. スクロール前のCSS修正
  //    html+bodyの両方にoverflow-x:hiddenが設定されるとChromiumでスクロールが消える
  //    scroll-behavior:smoothは即時反映を妨げる → 両方を auto に上書き
  await page.addStyleTag({
    content: 'html, body { overflow: auto !important; scroll-behavior: auto !important; }'
  });
  await page.waitForTimeout(200);

  // Playwrightループでスクロール（ページ高さに応じて速度を動的計算）
  const totalHeight = await page.evaluate(
    () => document.body.scrollHeight - window.innerHeight
  );
  console.log(`   ページ高さ: ${totalHeight}px`);
  console.log('▶️  スクロール中...');

  // 目標スクロール時間: 15秒 / フレーム間隔: 30ms
  const TARGET_SCROLL_MS = 15000;
  const scrollDelay = 30;
  const totalSteps  = Math.round(TARGET_SCROLL_MS / scrollDelay);   // 500ステップ
  const scrollStep  = Math.max(1, Math.round(totalHeight / totalSteps));
  console.log(`   速度: ${Math.round(scrollStep * 1000 / scrollDelay)}px/s (${scrollStep}px × ${scrollDelay}ms)`);

  let scrolled = 0;
  while (scrolled < totalHeight) {
    await page.evaluate((step) => window.scrollBy(0, step), scrollStep);
    scrolled += scrollStep;
    await page.waitForTimeout(scrollDelay);
  }

  // 4. 最下部 2秒静止
  await page.waitForTimeout(2000);

  console.log('⏹️  録画停止中...');
  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!videoPath || !fs.existsSync(videoPath)) {
    console.error('❌ 動画ファイルが取得できませんでした');
    process.exit(1);
  }

  // 4. MP4変換 or WebMフォールバック
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

  // 5. 通知・完了
  exec(`cmux notify --title "録画完了" --body "${siteName}_scroll_${dateStr}"`, () => {});
  if (process.platform === 'darwin') exec(`open "${outputDir}"`, () => {});

  console.log(`\n✅ 完了`);
  console.log(`\n📁 成果物の場所:\n  ${finalPath}`);
  console.log(`\n🔍 確認コマンド:\n  open ${finalPath}`);
})();
