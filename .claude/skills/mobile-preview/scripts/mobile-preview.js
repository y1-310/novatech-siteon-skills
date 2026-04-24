/**
 * mobile-preview.js — 静的LP複数デバイスフルページスクショ撮影
 * 使い方: node scripts/mobile-preview.js [対象パス/URL] [出力ディレクトリ]
 */
'use strict';

const { chromium, devices } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

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

// デバイス定義
const testDevices = [
  { name: 'iPhone-14-Pro', preset: devices['iPhone 14 Pro'] },
  { name: 'iPhone-SE',     preset: devices['iPhone SE'] },
  { name: 'Galaxy-S9',     preset: devices['Galaxy S9+'] },
  { name: 'iPad-Mini',     preset: devices['iPad Mini'] },
  { name: 'Desktop-1280',  preset: { viewport: { width: 1280, height: 800 } } },
  { name: 'Desktop-1920',  preset: { viewport: { width: 1920, height: 1080 } } },
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
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
      // フォント読み込み待機（display=block 対応）
      await page.waitForFunction(() => document.fonts.ready);
      const outputPath = path.join(outputDirArg, `preview-${d.name}.png`);
      await page.screenshot({ path: outputPath, fullPage: true });
      const stat = fs.statSync(outputPath);
      const kb = Math.round(stat.size / 1024);
      console.log(`✅ ${d.name.padEnd(14)} → ${outputPath} (${kb}KB)`);
      successCount++;
    } catch (err) {
      console.error(`❌ ${d.name}: ${err.message}`);
      failCount++;
    }
    await context.close();
  }

  await browser.close();
  console.log(`\n🎉 完了: 成功 ${successCount} / 失敗 ${failCount}`);
  console.log(`📂 open "${outputDirArg}" で確認できます`);

  if (failCount > 0) process.exit(1);
})();
