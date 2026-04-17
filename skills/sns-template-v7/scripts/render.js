import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validatePost } from './validate.js';
import { buildHTML } from './build-html.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

export async function renderPost(inputPath) {
  const post = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  validatePost(post);

  const { template_id, post_axis, publish_date } = post.meta;
  const outputDir = path.join(ROOT_DIR, 'output', `${publish_date}_${template_id}_${post_axis}`);
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  for (const pageId of ['P1', 'P2', 'P3', 'P4']) {
    const html = buildHTML(pageId, post);

    // ① ネットワーク停止待機
    await page.setContent(html, { waitUntil: 'networkidle0' });
    // ② フォントAPI完了待機
    await page.evaluateHandle('document.fonts.ready');
    // ③ レンダリング安定化
    await new Promise(r => setTimeout(r, 500));

    const outputPath = path.join(outputDir, `${pageId}.png`);
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1080 }
    });
    console.log(`✅ ${pageId}.png 生成: ${outputPath}`);
  }

  await browser.close();

  // 元データをアーカイブ
  fs.copyFileSync(inputPath, path.join(outputDir, 'post.json'));
  console.log(`\n完了: ${outputDir}`);

  return outputDir;
}

// CLI実行時（複数ファイル対応）
const args = process.argv.slice(2);
if (args.length > 0) {
  (async () => {
    for (const arg of args) {
      // glob展開はシェルに任せる
      try {
        await renderPost(arg);
      } catch (err) {
        console.error(`❌ ${arg}: ${err.message}`);
        process.exit(1);
      }
    }
  })();
}
