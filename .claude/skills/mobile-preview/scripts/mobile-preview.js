/**
 * mobile-preview.js v1.2 — 全アスペクト比フルページスクショ + 横オーバーフロー監査
 *
 * v1.2 改修点 (2026-09-07):
 *   - 検証ビューポートを 10 種に拡張（最小スマホ〜PC帯 + アスペクト比異常系 1280x600）
 *   - 全ビューポートで documentElement.scrollWidth <= window.innerWidth を判定し数値を記録
 *   - はみ出し検出時は該当要素のセレクタを特定してレポートに含める
 *   - responsive-audit.json / responsive-audit.md をレポートとして出力
 *   - --audit-only でスクショを省略（検査のみ・高速）
 *
 * v1.1 改修点:
 *   - フェードイン/トランジションを撮影前に無効化 (Hero以外空白問題の解消)
 *   - 全ページスクロールで IntersectionObserver & loading="lazy" を発火
 *   - document.fonts.ready でフォント完全読み込みを保証
 *
 * 使い方: node scripts/mobile-preview.js [対象パス/URL] [出力ディレクトリ] [--audit-only] [--no-open]
 */
'use strict';

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 引数処理
const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const targetArg = positional[0] || './index.html';
const outputDirArg = positional[1] || '/tmp/previews';
const auditOnly = args.includes('--audit-only');
const shouldOpen = !args.includes('--no-open') && !auditOnly;

// 対象URL/パスを正規化
let targetUrl;
if (targetArg.startsWith('http')) {
  targetUrl = targetArg;
} else {
  targetUrl = 'file://' + path.resolve(targetArg);
}

if (!fs.existsSync(outputDirArg)) {
  fs.mkdirSync(outputDirArg, { recursive: true });
}

/**
 * 検証ビューポート (v1.2)
 * 幅ベースは高さを標準比率に合わせる。1280x600 はアスペクト比異常系。
 */
const VIEWPORTS = [
  { name: '320x568',  width: 320,  height: 568,  dsf: 2, mobile: true,  note: '最小スマホ' },
  { name: '375x667',  width: 375,  height: 667,  dsf: 2, mobile: true,  note: '現行スマホ帯 (iPhone SE)' },
  { name: '390x844',  width: 390,  height: 844,  dsf: 3, mobile: true,  note: '現行スマホ帯' },
  { name: '430x932',  width: 430,  height: 932,  dsf: 3, mobile: true,  note: '現行スマホ帯 (Pro Max)' },
  { name: '768x1024', width: 768,  height: 1024, dsf: 2, mobile: true,  note: 'タブレット縦' },
  { name: '1024x768', width: 1024, height: 768,  dsf: 2, mobile: true,  note: 'タブレット横' },
  { name: '1280x800', width: 1280, height: 800,  dsf: 1, mobile: false, note: 'PC帯' },
  { name: '1536x960', width: 1536, height: 960,  dsf: 1, mobile: false, note: 'PC帯' },
  { name: '1920x1080',width: 1920, height: 1080, dsf: 1, mobile: false, note: 'PC帯' },
  { name: '1280x600', width: 1280, height: 600,  dsf: 1, mobile: false, note: 'アスペクト比異常系（低い横長・hero/fixed崩れ検出用）' },
];

const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

/**
 * ページ内で実行する横オーバーフロー監査。
 * html/body の overflow-x:hidden は「はみ出しを隠しているだけ」なので
 * 一時的に外して実際の溢れ幅とその原因要素を特定する（rules.md 49）。
 */
const AUDIT = function () {
  const cssPath = (el) => {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && parts.length < 4) {
      let seg = node.tagName.toLowerCase();
      if (node.id) { parts.unshift(seg + '#' + node.id); break; }
      const cls = (node.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
      if (cls.length) seg += '.' + cls.join('.');
      parts.unshift(seg);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const hasClippingAncestor = (el) => {
    let node = el.parentElement;
    while (node && node !== document.documentElement) {
      const ox = getComputedStyle(node).overflowX;
      if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true;
      node = node.parentElement;
    }
    return false;
  };

  const roots = [document.documentElement, document.body];
  const saved = roots.map((el) => el.style.overflowX);
  const masking = roots.some((el) => /hidden|clip/.test(getComputedStyle(el).overflowX));
  if (masking) roots.forEach((el) => { el.style.overflowX = 'visible'; });

  const innerWidth = window.innerWidth;
  const clientWidth = document.documentElement.clientWidth;
  const scrollWidth = document.documentElement.scrollWidth;

  const offenders = [];
  if (scrollWidth > innerWidth + 1) {
    const all = document.body.querySelectorAll('*');
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const overRight = r.right - innerWidth;
      const overLeft = -r.left;
      if (overRight <= 1 && overLeft <= 1) continue;
      if (hasClippingAncestor(el)) continue;
      offenders.push({
        selector: cssPath(el),
        tag: el.tagName.toLowerCase(),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        overflowPx: Math.round(Math.max(overRight, overLeft)),
      });
    }
    // 深い子孫が同じ原因を重複報告するため、溢れ幅の大きい順に上位のみ残す
    offenders.sort((a, b) => b.overflowPx - a.overflowPx);
  }

  if (masking) roots.forEach((el, i) => { el.style.overflowX = saved[i]; });

  return {
    innerWidth,
    clientWidth,
    scrollWidth,
    ok: scrollWidth <= innerWidth + 1,
    maskedByOverflowHidden: masking && scrollWidth > innerWidth + 1,
    offenders: offenders.slice(0, 15),
  };
};

(async () => {
  const browser = await chromium.launch();
  console.log(`📐 mobile-preview v1.2 — ${auditOnly ? '監査のみ' : '撮影 + 監査'}`);
  console.log(`🎯 対象: ${targetUrl}`);
  console.log(`📁 保存先: ${outputDirArg}\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const v of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: v.width, height: v.height },
      deviceScaleFactor: v.dsf,
      isMobile: v.mobile,
      hasTouch: v.mobile,
      ...(v.mobile ? { userAgent: MOBILE_UA } : {}),
    });
    const page = await context.newPage();

    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // フェードイン/トランジション無効化（スクショ・計測専用）
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

      await page.evaluate(async () => { await document.fonts.ready; });

      // 全ページスクロール — IntersectionObserver & loading="lazy" 発火
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

      // lazy 画像を eager に切り替えて実際に fetch させる（上限つき）
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
        await Promise.race([
          Promise.all(
            Array.from(document.images)
              .filter(img => !img.complete)
              .map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))
          ),
          new Promise(resolve => setTimeout(resolve, 8000)),
        ]);
      });

      await page.waitForTimeout(800);

      // 横オーバーフロー監査（全ビューポート必須）
      const audit = await page.evaluate(AUDIT);
      results.push({ viewport: v.name, note: v.note, ...audit });

      let shotPath = null;
      if (!auditOnly) {
        shotPath = path.join(outputDirArg, `preview-${v.name}.png`);
        await page.screenshot({ path: shotPath, fullPage: true });
      }

      const mark = audit.ok ? '✅' : '❌';
      const kb = shotPath ? ` (${Math.round(fs.statSync(shotPath).size / 1024)}KB)` : '';
      console.log(
        `${mark} ${v.name.padEnd(10)} scrollWidth=${String(audit.scrollWidth).padStart(5)} / ` +
        `innerWidth=${String(audit.innerWidth).padStart(5)}` +
        (audit.ok ? '' : `  ← +${audit.scrollWidth - audit.innerWidth}px はみ出し / 原因 ${audit.offenders.length}件`) +
        kb
      );
      if (!audit.ok) {
        audit.offenders.slice(0, 5).forEach((o) => {
          console.log(`      └ +${o.overflowPx}px  ${o.selector}  (w=${o.width}, right=${o.right})`);
        });
      }
      successCount++;
    } catch (err) {
      console.error(`⚠️  ${v.name}: ${err.message}`);
      results.push({ viewport: v.name, note: v.note, error: err.message });
      failCount++;
    }

    await context.close();
  }

  await browser.close();

  // レポート出力
  const report = {
    target: targetUrl,
    generatedAt: new Date().toISOString(),
    tool: 'mobile-preview v1.2',
    criterion: 'document.documentElement.scrollWidth <= window.innerWidth',
    results,
  };
  const jsonPath = path.join(outputDirArg, 'responsive-audit.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');

  const lines = [];
  lines.push(`# 全アスペクト比レスポンシブ検査レポート`);
  lines.push('');
  lines.push(`- 対象: \`${targetUrl}\``);
  lines.push(`- 実行: ${report.generatedAt}`);
  lines.push(`- 判定基準: \`documentElement.scrollWidth <= window.innerWidth\``);
  lines.push(`- ツール: mobile-preview v1.2 (Playwright / Chromium)`);
  lines.push('');
  lines.push('| ビューポート | 用途 | scrollWidth | innerWidth | clientWidth | 判定 | はみ出し |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const r of results) {
    if (r.error) {
      lines.push(`| ${r.viewport} | ${r.note} | - | - | - | ⚠️ エラー | ${r.error} |`);
      continue;
    }
    lines.push(
      `| ${r.viewport} | ${r.note} | ${r.scrollWidth} | ${r.innerWidth} | ${r.clientWidth} | ` +
      `${r.ok ? '✅' : '❌'} | ${r.ok ? '0px' : `+${r.scrollWidth - r.innerWidth}px`} |`
    );
  }
  const bad = results.filter((r) => !r.error && !r.ok);
  if (bad.length) {
    lines.push('');
    lines.push('## はみ出し原因要素');
    lines.push('');
    lines.push('| ビューポート | はみ出し | セレクタ | 幅 | right |');
    lines.push('|---|---|---|---|---|');
    for (const r of bad) {
      for (const o of r.offenders) {
        lines.push(`| ${r.viewport} | +${o.overflowPx}px | \`${o.selector}\` | ${o.width} | ${o.right} |`);
      }
      if (!r.offenders.length) {
        lines.push(`| ${r.viewport} | +${r.scrollWidth - r.innerWidth}px | （個別要素を特定できず。html/body の overflow-x に隠されている可能性） | - | - |`);
      }
    }
  } else {
    lines.push('');
    lines.push('全ビューポートで横オーバーフローなし。');
  }
  const mdPath = path.join(outputDirArg, 'responsive-audit.md');
  fs.writeFileSync(mdPath, lines.join('\n') + '\n', 'utf-8');

  console.log(`\n📄 レポート: ${mdPath}`);
  console.log(`📄 JSON:     ${jsonPath}`);
  console.log(`\n🎉 完了: 成功 ${successCount} / 失敗 ${failCount} / 横はみ出し ${bad.length} ビューポート`);

  if (process.platform === 'darwin' && shouldOpen) {
    exec(`open "${outputDirArg}"`, (err) => {
      if (err) console.error(`⚠️ Finder 展開失敗: ${err.message}`);
      else console.log(`📂 Finder で ${outputDirArg} を開きました`);
    });
  }

  if (failCount > 0 || bad.length > 0) process.exit(1);
})();
