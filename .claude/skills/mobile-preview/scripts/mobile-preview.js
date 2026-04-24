/**
 * mobile-preview.js v1.1 — 静的LP複数デバイスフルページスクショ撮影
 *
 * v1.1 改修点:
 *   - フェードイン/トランジションを撮影前に無効化 (Hero以外空白問題の解消)
 *   - 全ページスクロールで IntersectionObserver & loading="lazy" を発火
 *   - document.fonts.ready でフォント完全読み込みを保証
 *   - デバイス構成刷新 (iPhone 17 Pro / iPad Air 13 / Galaxy S24)
 *
 * 使い方: node scripts/mobile-preview.js [対象パス/URL] [出力ディレクトリ]
 */
'use strict';

const { chromium, devices } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 引数処理
const args = process.argv.slice(2);
const targetArg = args[0] || './index.html';
const outputDirArg = args[1] || '/tmp/previews';

// 対象URL/パスを正規化
let targetUrl;
if (targetArg.startsWith('http')) {
  targetUrl = targetArg;
} else {
  targetUrl = 'file://' + path.resolve(targetArg);
}

// 出力ディレクトリ作成
if (!fs.existsSync(outputDirArg)) {
  fs.mkdirSync(outputDirArg, { recursive: true });
}

// デバイス定義 (v1.1 刷新)
const testDevices = [
  {
    name: 'iPhone-17-Pro',
    preset: {
      viewport: { width: 402, height: 874 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    }
  },
  { name: 'iPhone-SE', preset: devices['iPhone SE'] },
  {
    name: 'iPad-Air-13',
    preset: {
      viewport: { width: 1024, height: 1366 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    }
  },
  {
    name: 'Galaxy-S24',
    preset: {
      viewport: { width: 384, height: 857 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
    }
  },
  { name: 'Desktop-1280', preset: { viewport: { width: 1280, height: 800 } } },
  { name: 'Desktop-1920', preset: { viewport: { width: 1920, height: 1080 } } },
];

(async () => {
  const browser = await chromium.launch();
  console.log(`📸 撮影開始: ${targetUrl}`);
  console.log(`📁 保存先: ${outputDirArg}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const d of testDevices) {
    const context = await browser.newContext(d.preset);
    const page = await context.newPage();

    try {
      // 1. ページ読み込み
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // 2. フェードイン/トランジション無効化 (スクショ専用)
      //    IntersectionObserver 未発火による opacity:0 要素を強制表示
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
          [class*="fade"], [class*="animate"], [class*="scroll"],
          [data-aos], [data-scroll], .is-hidden, .not-visible {
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          }
        `
      });

      // 3. フォント読み込み完了待ち (display=block 対応)
      await page.evaluate(async () => {
        await document.fonts.ready;
      });

      // 4. 全ページスクロール — IntersectionObserver & loading="lazy" 発火
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= document.body.scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              setTimeout(resolve, 500);
            }
          }, 30);
        });
      });

      // 5. 画像読み込み完了待ち
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.onload = img.onerror = resolve;
            }))
        )
      );

      // 6. 最終安定待ち
      await page.waitForTimeout(800);

      // 7. フルページスクショ
      const outputPath = path.join(outputDirArg, `preview-${d.name}.png`);
      await page.screenshot({ path: outputPath, fullPage: true });
      const kb = Math.round(fs.statSync(outputPath).size / 1024);
      console.log(`✅ ${d.name.padEnd(18)} → ${outputPath} (${kb}KB)`);
      successCount++;
    } catch (err) {
      console.error(`❌ ${d.name}: ${err.message}`);
      failCount++;
    }

    await context.close();
  }

  await browser.close();
  console.log(`\n🎉 完了: 成功 ${successCount} / 失敗 ${failCount}`);

  const shouldOpen = !args.includes('--no-open');
  if (process.platform === 'darwin' && shouldOpen) {
    exec(`open "${outputDirArg}"`, (err) => {
      if (err) {
        console.error(`⚠️ Finder 展開失敗: ${err.message}`);
      } else {
        console.log(`📂 Finder で ${outputDirArg} を開きました`);
      }
    });
  } else {
    console.log(`📂 open "${outputDirArg}" で確認できます`);
  }

  if (failCount > 0) process.exit(1);
})();
