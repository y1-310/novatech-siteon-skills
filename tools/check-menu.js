#!/usr/bin/env node
/**
 * モバイルメニューを「開いた状態」で検査する。
 *
 * ①〜⑨ はすべてメニューを閉じたまま測っているため、開いたときにだけ壊れる作りを
 * 1件も捕まえられなかった（Codex 監査 2026-09-11 指摘）。あわせて rules.md
 * アクセシビリティ 33「フォーカストラップを実装する（モーダル・メニュー）」は
 * どの検査器も見ていなかった。ここで両方を見る。
 *
 * 使い方: node check-menu.js <url|path/to/index.html> [--json]
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

function loadChromium() {
  const roots = [
    path.join(__dirname, 'node_modules'),
    path.join(__dirname, '..', 'node_modules'),
    path.join(__dirname, '..', '..', 'novatech-siteon-business', 'node_modules'),
    path.join(__dirname, '..', 'novatech-siteon-business', 'node_modules'),
  ];
  for (const r of roots) {
    try { return require(path.join(r, 'playwright')).chromium; } catch (e) { /* next */ }
  }
  try { return require('playwright').chromium; } catch (e) { /* next */ }
  throw new Error('playwright が見つかりません');
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';

(async () => {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) { console.error('使い方: node check-menu.js <url|path> [--json]'); process.exit(2); }
  let url = target;
  if (!/^https?:/.test(target)) {
    let p = path.resolve(target);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    url = pathToFileURL(p).href;
  }
  const label = path.basename(target.replace(/\/$/, '')) || target;

  const out = { violations: [], info: {} };
  const add = (severity, message, detail) => out.violations.push({ rule: 'rules.md 33 / メニュー展開', severity, message, detail });

  const chromium = loadChromium();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.addStyleTag({ content: '*,*::before,*::after{animation-duration:1ms!important;animation-delay:0s!important;transition-duration:0s!important}' });
    await page.waitForTimeout(200);

    // ---- 開閉ボタンを見つける（サイトごとにクラス名が違うので役割で探す）----
    const toggleSel = await page.evaluate(() => {
      const vis = (e) => {
        const r = e.getBoundingClientRect();
        return r.width > 8 && r.height > 8 && (!e.checkVisibility || e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));
      };
      const cands = [...document.querySelectorAll('button[aria-expanded],[role=button][aria-expanded],a[aria-expanded]')].filter(vis);
      // ヘッダー内にあり、FAQ のような本文中のアコーディオンではないものを選ぶ
      const head = cands.find((e) => e.closest('header,nav') && e.getBoundingClientRect().top < 200);
      const pick = head || cands[0];
      if (!pick) return null;
      pick.setAttribute('data-qa-toggle', '1');
      return '[data-qa-toggle]';
    });

    if (!toggleSel) {
      out.info.skipped = 'aria-expanded を持つ開閉ボタンが 390px で見つからない';
      add('高', 'モバイルメニューの開閉ボタンが見つからない（aria-expanded を持つ操作要素がない）', 'rules.md 32');
    } else {
      const before = await page.getAttribute(toggleSel, 'aria-expanded');
      if (before !== 'false') add('中', `閉じている状態で aria-expanded が "${before}" になっている`, 'rules.md 32');

      await page.click(toggleSel);
      await page.waitForTimeout(250);

      const st = await page.evaluate((FOCUSABLE) => {
        const t = document.querySelector('[data-qa-toggle]');
        const id = t.getAttribute('aria-controls');
        let panel = id ? document.getElementById(id) : null;
        if (!panel) {
          // aria-controls が無いサイトは、開いたときに見えるナビを探す
          panel = [...document.querySelectorAll('nav,[role=dialog],.mobile-menu,.nav-panel')]
            .filter((e) => e !== t && (!e.checkVisibility || e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })))
            .sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0] || null;
        }
        if (panel) panel.setAttribute('data-qa-panel', '1');
        const items = panel ? [...panel.querySelectorAll(FOCUSABLE)].filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }) : [];
        const small = items.filter((e) => {
          const r = e.getBoundingClientRect();
          return Math.min(r.width, r.height) < 44;
        }).map((e) => {
          const r = e.getBoundingClientRect();
          return (e.textContent || '').trim().slice(0, 12) + ` ${Math.round(r.width)}×${Math.round(r.height)}px`;
        });
        const bodyCs = getComputedStyle(document.body);
        return {
          expanded: t.getAttribute('aria-expanded'),
          panelFound: !!panel,
          panelVisible: panel ? (!panel.checkVisibility || panel.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) : false,
          itemCount: items.length,
          small,
          scrollLocked: bodyCs.overflow === 'hidden' || bodyCs.overflowY === 'hidden' || bodyCs.position === 'fixed',
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1
            ? `scrollWidth ${document.documentElement.scrollWidth} > ${window.innerWidth}` : null,
          focusInPanel: panel ? panel.contains(document.activeElement) : false,
        };
      }, FOCUSABLE);

      out.info.items = st.itemCount;
      if (st.expanded !== 'true') add('高', `開いたのに aria-expanded が "${st.expanded}" のまま`, 'rules.md 32');
      if (!st.panelFound || !st.panelVisible) add('高', 'メニューを開いてもパネルが表示されない', 'aria-controls の指す要素が見えない');
      if (st.overflow) add('高', 'メニューを開くと横スクロールが出る', st.overflow);
      if (st.small.length) add('中', `メニュー内に44px未満のタップ領域が ${st.small.length}件ある`, st.small.slice(0, 5).join(' / '));
      if (!st.scrollLocked) add('中', 'メニューを開いても背面がスクロールできる', 'body に overflow: hidden / position: fixed がない');
      if (!st.focusInPanel) add('中', '開いた直後のフォーカスがメニューの中に入っていない', 'rules.md 33');

      // ---- フォーカストラップ（rules.md 33）----
      if (st.panelFound && st.itemCount > 1) {
        let escaped = null;
        for (let i = 0; i < st.itemCount + 3; i++) {
          await page.keyboard.press('Tab');
          const inside = await page.evaluate(() => {
            const p = document.querySelector('[data-qa-panel]');
            const a = document.activeElement;
            const t = document.querySelector('[data-qa-toggle]');
            return !!p && (p.contains(a) || a === t);
          });
          if (!inside) { escaped = i + 1; break; }
        }
        if (escaped !== null) {
          add('高', `Tab ${escaped}回でフォーカスがメニューの外へ出る。背面のリンクに触れてしまう`, 'rules.md 33 フォーカストラップ');
        }
      }

      // ---- Escape で閉じ、フォーカスがボタンへ戻るか ----
      await page.keyboard.press('Escape');
      await page.waitForTimeout(250);
      const after = await page.evaluate(() => {
        const t = document.querySelector('[data-qa-toggle]');
        return { expanded: t.getAttribute('aria-expanded'), returned: document.activeElement === t };
      });
      if (after.expanded !== 'false') add('高', 'Escape でメニューが閉じない', 'rules.md 33');
      else if (!after.returned) add('中', 'Escape で閉じたあと、フォーカスが開閉ボタンへ戻らない', 'rules.md 33');
    }
  } finally {
    await ctx.close();
    await browser.close();
  }

  if (args.includes('--json')) { console.log(JSON.stringify({ target: url, ...out }, null, 2)); }
  else if (!out.violations.length) console.log(`✅ ${label} — メニュー展開時: 問題なし  (項目 ${out.info.items || 0}件)`);
  else {
    console.log(`❌ ${label} — メニュー展開時: ${out.violations.length}件`);
    for (const x of out.violations) console.log(`   [${x.severity}] ${x.message}\n        ${x.detail}`);
  }
  process.exit(out.violations.filter((x) => x.severity !== '低').length ? 1 : 0);
})();
