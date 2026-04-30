/**
 * scroll-video.js v1.0 — スムーズスクロール動画録画（Instagram リール用）
 *
 * デバイス: iPhone 17 Pro (402x874 viewport)
 * 出力: MP4 H.264 (1080x1920) / FFmpegなし時は WebM
 * 録画: Playwright 内蔵 recordVideo → FFmpeg で MP4 変換
 *
 * 使い方:
 *   node scripts/scroll-video.js <URL or ./index.html>
 */
'use strict';

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');

// ── 引数処理 ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const targetArg = args[0];

if (!targetArg) {
  console.error('使い方: node scripts/scroll-video.js <URL or ./index.html>');
  process.exit(1);
}

let targetUrl;
if (targetArg.startsWith('http')) {
  targetUrl = targetArg;
} else {
  targetUrl = 'file://' + path.resolve(targetArg);
}

// ── サイト名抽出 ─────────────────────────────────────────────────────────────
function getSiteName(url) {
  try {
    if (url.startsWith('file://')) {
      const dir = path.dirname(url.replace('file://', ''));
      return path.basename(dir) || 'site';
    }
    return new URL(url).hostname.replace(/\W+/g, '-');
  } catch {
    return 'site';
  }
}

const siteName = getSiteName(targetUrl);
const dateStr = new Date().toISOString().slice(0, 10);

// 出力ディレクトリ
const outputDir = path.resolve(process.cwd(), 'output');
const tmpVideoDir = path.join(outputDir, '_tmp_video');
[outputDir, tmpVideoDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

const mp4Path = path.join(outputDir, `${siteName}_scroll_${dateStr}.mp4`);
const webmFallbackPath = path.join(outputDir, `${siteName}_scroll_${dateStr}.webm`);

// ── 定数 ────────────────────────────────────────────────────────────────────
const SCROLL_PX_PER_SEC = 200;
const MAX_SCROLL_SEC = 27; // スクロール最大27秒 + 底部2秒待機 = 29秒 < 30秒上限
const BOTTOM_PAUSE_MS = 2000;

// ── FFmpeg チェック ──────────────────────────────────────────────────────────
function hasFfmpeg() {
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); return true; }
  catch { return false; }
}

// ── メイン ──────────────────────────────────────────────────────────────────
(async () => {
  console.log(`🎬 録画開始: ${targetUrl}`);
  console.log(`📁 出力先: ${mp4Path}\n`);

  const browser = await chromium.launch();

  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    recordVideo: {
      dir: tmpVideoDir,
      size: { width: 402, height: 874 },
    },
  });

  const page = await context.newPage();
  let success = false;

  try {
    // 1. ページ読み込み
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // 2. フォント・画像完全読み込み待ち
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(r => { img.onload = img.onerror = r; }))
      );
    });

    // 3. トップに戻して安定待ち（アニメーション有効のまま録画するため CSS無効化はしない）
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);

    // 4. ease-in-out スムーズスクロール（requestAnimationFrame ベース）
    console.log('▶️  スクロール録画中...');
    await page.evaluate(
      async ({ pxPerSec, maxSec, bottomPauseMs }) => {
        await new Promise((resolve) => {
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight <= 0) { resolve(); return; }

          const duration = Math.min(totalHeight / pxPerSec, maxSec) * 1000;
          const start = performance.now();

          function easeInOut(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          }

          function step(now) {
            const t = Math.min((now - start) / duration, 1);
            window.scrollTo(0, totalHeight * easeInOut(t));
            if (t < 1) {
              requestAnimationFrame(step);
            } else {
              setTimeout(resolve, bottomPauseMs);
            }
          }

          requestAnimationFrame(step);
        });
      },
      { pxPerSec: SCROLL_PX_PER_SEC, maxSec: MAX_SCROLL_SEC, bottomPauseMs: BOTTOM_PAUSE_MS }
    );

    success = true;
    console.log('⏹️  録画停止中...');

  } catch (err) {
    console.error(`❌ 録画エラー: ${err.message}`);
  }

  // 録画ファイル取得（context.close() で確定書き込みされる）
  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!success || !videoPath || !fs.existsSync(videoPath)) {
    console.error('❌ 動画ファイルが取得できませんでした');
    process.exit(1);
  }

  // 5. MP4変換 or WebMフォールバック
  const ffmpegOk = hasFfmpeg();
  if (ffmpegOk) {
    console.log('🔄 MP4変換中 (FFmpeg)...');
    await new Promise((resolve, reject) => {
      // 402x874 → 1080x1920 にスケール（アスペクト比が違う場合は黒帯でパディング）
      const vf = [
        'scale=1080:1920:force_original_aspect_ratio=decrease',
        'pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black',
      ].join(',');
      const cmd = `ffmpeg -y -i "${videoPath}" -vf "${vf}" -c:v libx264 -crf 23 -preset fast -pix_fmt yuv420p "${mp4Path}"`;
      exec(cmd, (err, _stdout, stderr) => {
        if (err) reject(new Error(stderr)); else resolve();
      });
    });
    fs.unlinkSync(videoPath);
    fs.rmSync(tmpVideoDir, { recursive: true, force: true });
    console.log(`✅ MP4保存: ${mp4Path}`);
  } else {
    // FFmpegなし: WebMのままoutputへ移動
    fs.renameSync(videoPath, webmFallbackPath);
    fs.rmSync(tmpVideoDir, { recursive: true, force: true });
    console.log(`⚠️  FFmpegが見つかりません。WebM形式で保存しました: ${webmFallbackPath}`);
    console.log('   MP4変換するには: brew install ffmpeg');
  }

  const finalPath = ffmpegOk ? mp4Path : webmFallbackPath;

  // 6. cmux通知
  exec(
    `cmux notify --title "録画完了" --body "${siteName} スクロール動画: ${path.basename(finalPath)}"`,
    () => {}
  );

  // 7. Finderで開く
  if (process.platform === 'darwin') {
    exec(`open "${outputDir}"`, () => {});
    console.log(`📂 Finder で ${outputDir} を開きました`);
  }

  console.log(`\n🎉 完了: ${path.basename(finalPath)}`);
})();
