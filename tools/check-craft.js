#!/usr/bin/env node
/**
 * 作り込みチェック（アクセシビリティ・フォーム） — NovaTech / SITEON
 *
 * 追加理由:
 *   rules.md カテゴリ5「アクセシビリティ（8項目）」のうち、自動検査があったのは
 *   36（タップ領域44px / check-mobile.js）だけだった。31・32・34・35・38 は
 *   条項があるのに検査手段がなく、守られているかを誰も確認できていなかった。
 *   2026-05-03 の「枠→余白」が4か月間守られていなかったのと同じ構図（lessons.md 9）。
 *
 * 検出対象:
 *   [既存ルールの検査化]
 *     31 スキップナビゲーションの有無
 *     32 メニュートグルの aria-expanded / aria-label
 *     34 :focus-visible の定義、outline:none の無補償除去
 *     35 コントラスト比 4.5:1（背景をアルファ合成して判定。背景画像上は判定不能として除外）
 *     38 フォームの label 紐付け
 *   [Refero craft-details.md 由来]
 *     入力欄の type / inputmode / autocomplete の整合
 *     メール欄の spellcheck="false"
 *     ペースト禁止（onpaste で preventDefault）
 *
 * 出典: Refero Design Skill craft-details.md
 *       (MIT License / Copyright (c) 2026 Refero / github.com/referodesign/refero_skill)
 *
 * 使い方:
 *   node check-craft.js <url|path/to/index.html> [--json]
 */

const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

function loadChromium() {
  const roots = [
    path.join(__dirname, '..', '.claude', 'skills', 'mobile-preview', 'node_modules'),
    path.join(__dirname, 'node_modules'),
    path.join(__dirname, '..', 'node_modules'),
    path.join(__dirname, '..', '..', 'novatech-siteon-business', 'node_modules'),
  ];
  for (const r of roots) {
    try { return require(path.join(r, '@playwright/test')).chromium; } catch (e) { /* next */ }
    try { return require(path.join(r, 'playwright')).chromium; } catch (e) { /* next */ }
  }
  try { return require('@playwright/test').chromium; } catch (e) { /* next */ }
  throw new Error('playwright が見つかりません。mobile-preview skill の node_modules を確認してください。');
}

const AUDIT = function () {
  const v = [];
  const info = {};
  const add = (rule, severity, message, selector, detail) => v.push({ rule, severity, message, selector, detail });
  const sel = (e) => {
    const c = (e.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)[0];
    return e.tagName.toLowerCase() + (e.id ? '#' + e.id : (c ? '.' + c : ''));
  };

  // ---- CSS ルールを走査する共通処理 ----
  const cssRules = [];
  for (const ss of document.styleSheets) {
    let list; try { list = ss.cssRules; } catch (e) { continue; }
    // Chrome では CSSStyleRule にも空の cssRules が存在する（ネストCSS対応）。
    // 真偽判定で再帰すると全スタイルルールをスキップしてしまうため length で判定する。
    const walk = (rs) => { for (const r of rs) {
      if (r.selectorText) cssRules.push({ sel: r.selectorText, css: r.style.cssText });
      if (r.cssRules && r.cssRules.length) walk(r.cssRules);
    } };
    walk(list);
  }
  info.cssRuleCount = cssRules.length;

  // ---- 34. focus-visible ----
  const focusVisible = cssRules.filter((r) => /:focus-visible/.test(r.sel));
  info.focusVisibleRules = focusVisible.length;
  if (!focusVisible.length) {
    add('rules.md 34', '高', ':focus-visible が一度も定義されていない。キーボード操作時に現在位置が分からない', 'stylesheet', '-');
  }
  // outline を消しているのに代替（box-shadow / border / outline再指定）がないもの
  for (const r of cssRules) {
    if (!/outline:\s*(none|0)/.test(r.css)) continue;
    const hasReplacement = /box-shadow|border|outline-offset/.test(r.css);
    const isFocusRule = /:focus/.test(r.sel);
    if (isFocusRule && !hasReplacement) {
      add('rules.md 34', '高', 'フォーカス時に outline を消しているが代替の視覚表現がない。キーボード操作が壊れる', r.sel.slice(0, 60), r.css.slice(0, 60));
    }
  }
  // :focus に対して見た目を付けているが :focus-visible がない（マウスクリックでもリングが出る）
  const focusOnly = cssRules.filter((r) => /:focus(?![-\w])/.test(r.sel) && !/:focus-visible|:focus-within/.test(r.sel) && /outline|box-shadow|border-color/.test(r.css));
  if (focusOnly.length && !focusVisible.length) {
    add('craft-details 1', '中', ':focus にのみフォーカス表現がある。マウスクリックでもリングが出る。:focus-visible を使う', focusOnly[0].sel.slice(0, 60), `${focusOnly.length}件`);
  }

  // ---- 31. スキップナビゲーション ----
  const skip = [...document.querySelectorAll('a[href^="#"]')].slice(0, 5)
    .find((a) => /skip|スキップ|本文|content|main/i.test(a.textContent + ' ' + (a.className || '')));
  info.skipLink = !!skip;
  if (!skip) add('rules.md 31', '中', 'スキップナビゲーションが見つからない。キーボード利用者がナビを毎回通過させられる', 'body', '-');

  // ---- 32. メニュートグルの aria ----
  const toggle = document.querySelector('[data-menu-toggle], .menu-toggle, button[class*="hamburger"], button[aria-controls]');
  if (toggle) {
    const missing = [];
    if (!toggle.hasAttribute('aria-expanded')) missing.push('aria-expanded');
    if (!toggle.hasAttribute('aria-label') && !toggle.textContent.trim()) missing.push('aria-label');
    if (!toggle.hasAttribute('aria-controls')) missing.push('aria-controls');
    info.menuToggleAria = missing.length ? '不足: ' + missing.join(' / ') : '完備';
    if (missing.length) add('rules.md 32', '中', 'メニュートグルの aria 属性が不足している', sel(toggle), missing.join(' / '));
  } else { info.menuToggleAria = 'トグルなし'; }

  // ---- 38. label 紐付け ----
  for (const e of document.querySelectorAll('input,textarea,select')) {
    if (e.type === 'hidden' || e.type === 'submit' || e.type === 'button') continue;
    const labelled = (e.labels && e.labels.length) || e.hasAttribute('aria-label') || e.hasAttribute('aria-labelledby');
    if (!labelled) add('rules.md 38', '高', '入力欄に label が紐付いていない', sel(e), `name=${e.name || '-'}`);
  }

  // ---- Refero craft: 入力欄の type / inputmode / autocomplete ----
  const EXPECT = [
    { re: /mail/i, type: 'email', ac: 'email', spellcheck: false },
    { re: /tel|phone|denwa/i, type: 'tel', ac: 'tel' },
    { re: /^name$|お名前|namae|fullname/i, ac: 'name' },
  ];
  for (const e of document.querySelectorAll('input')) {
    if (['hidden', 'submit', 'button', 'checkbox', 'radio'].includes(e.type)) continue;
    const key = `${e.name || ''} ${e.id || ''} ${(e.labels && e.labels[0] ? e.labels[0].textContent : '')}`;
    for (const x of EXPECT) {
      if (!x.re.test(key)) continue;
      if (x.type && e.getAttribute('type') !== x.type) {
        add('craft-details 2', '中', `入力欄の type が ${x.type} でない。モバイルで適切なキーボードが出ない`, sel(e), `type=${e.getAttribute('type') || '-'} 期待=${x.type}`);
      }
      if (x.ac && (e.getAttribute('autocomplete') || '') !== x.ac) {
        add('craft-details 2', '中', `autocomplete="${x.ac}" が設定されていない。自動入力が効かず入力の手間が増える`, sel(e), `autocomplete=${e.getAttribute('autocomplete') || '-'}`);
      }
      if (x.spellcheck === false && e.getAttribute('spellcheck') !== 'false') {
        add('craft-details 2', '低', 'メール欄に spellcheck="false" がない。赤波線が出て入力を妨げる', sel(e), '-');
      }
      break;
    }
  }

  // ---- Refero craft: ペースト禁止 ----
  const pasteBlocked = [...document.querySelectorAll('input,textarea')].filter((e) => e.getAttribute('onpaste'));
  if (pasteBlocked.length) {
    add('craft-details 2', '高', 'ペーストを禁止している。アクセシビリティ違反かつ利用者に不親切', sel(pasteBlocked[0]), `${pasteBlocked.length}件`);
  }

  // ---- 35. コントラスト比（アルファ合成。背景画像上は判定不能として除外）----
  const rgba = (s) => { const m = (s || '').match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2], m[3] !== undefined ? +m[3] : 1] : null; };
  const isTransparent = (s) => !s || s === 'transparent' || /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(s);
  const composite = (el) => {
    const stack = []; let n = el, hasImage = false, overlay = false;
    while (n) { const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') hasImage = true;
      const c = rgba(cs.backgroundColor);
      // 不透明な背景に到達する前に fixed / absolute の祖先を通過した場合、
      // その要素は下の別コンテンツ（ヒーロー写真など）の上に浮いている。
      // 祖先を辿るだけでは実際の背面色が分からないため判定不能として扱う。
      // （固定ヘッダーの白文字を「白地に白」と誤判定するのを防ぐ）
      if ((cs.position === 'fixed' || cs.position === 'absolute') && !(c && c[3] === 1)) overlay = true;
      if (c && c[3] > 0) stack.push(c);
      if (c && c[3] === 1) break;
      n = n.parentElement; }
    let out = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) { const [r, g, b, a] = stack[i];
      out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)]; }
    return { bg: out.map(Math.round), hasImage, overlay };
  };
  // 非表示要素（opacity 0 / visibility hidden / display none の子孫）は判定しない
  const isInvisible = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return true;
      n = n.parentElement;
    }
    return false;
  };
  const lum = ([r, g, b]) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const seen = new Set(); let skippedByImage = 0;
  for (const e of document.querySelectorAll('p,li,h1,h2,h3,h4,a,dd,dt,button,small,label,span,td,th')) {
    // 直接のテキストノードを持つ要素だけを測る。
    // 子要素に文字がある場合、親の computed color は実際に描画される色ではない
    // （例: li の継承色は暗いが、中の a は明るい色で描かれている）。
    const ownText = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim()).join(' ');
    if (!ownText) continue;
    const t = ownText;
    const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    if (isInvisible(e)) continue;
    const cs = getComputedStyle(e);
    const fg0 = rgba(cs.color); if (!fg0) continue;
    const { bg, hasImage, overlay } = composite(e);
    const key = cs.color + '|' + bg.join() + '|' + cs.fontSize + '|' + cs.fontWeight;
    if (seen.has(key)) continue; seen.add(key);
    if (hasImage || overlay) { skippedByImage++; continue; }
    const fg = [0, 1, 2].map((i) => Math.round(fg0[i] * fg0[3] + bg[i] * (1 - fg0[3])));
    const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
    const size = parseFloat(cs.fontSize);
    const need = (size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700)) ? 3 : 4.5;
    if (ratio < need) {
      add('rules.md 35', '高', `コントラスト比 ${ratio.toFixed(2)}（必要 ${need}）`, sel(e), `${cs.fontSize} rgb(${fg}) on rgb(${bg}) 「${t.slice(0, 20)}」`);
    }
  }
  info.contrastUndecidable = skippedByImage; // 背景画像上 / 浮いている要素

  return { violations: v, info };
};

(async () => {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) { console.error('使い方: node check-craft.js <url|path/to/index.html> [--json]'); process.exit(2); }
  let url = target;
  if (!/^https?:/.test(target)) {
    let p = path.resolve(target);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    url = pathToFileURL(p).href;
  }
  const label = path.basename(target.replace(/\/$/, '')) || target;

  const browser = await loadChromium().launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  let result;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => { await document.fonts.ready; });
    // スクロールせずに測ると、IntersectionObserver 未発火のフェードイン要素が
    // opacity:0 のままになり「非表示だから測らない」で取りこぼす（偽陰性）。
    // 全ページをスクロールして発火させ、残ったトランジションも無効化してから測る。
    await page.evaluate(async () => {
      await new Promise((r) => { let y = 0; const t = setInterval(() => {
        window.scrollBy(0, 600); y += 600;
        if (y >= document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); setTimeout(r, 300); }
      }, 25); });
    });
    await page.addStyleTag({ content:
      '*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}' +
      '[class*="fade"],[class*="reveal"],[class*="animate"],[data-aos],.is-hidden{opacity:1!important;transform:none!important}' });
    await page.waitForTimeout(400);
    result = await page.evaluate(AUDIT);
  } finally { await browser.close(); }

  if (args.includes('--json')) { console.log(JSON.stringify({ target: url, ...result }, null, 2)); }
  else {
    const v = result.violations;
    const order = { 高: 0, 中: 1, 低: 2 };
    v.sort((a, b) => order[a.severity] - order[b.severity]);
    const meta = `(focus-visible ${result.info.focusVisibleRules}件 / skipリンク ${result.info.skipLink ? 'あり' : 'なし'} / メニューaria ${result.info.menuToggleAria} / コントラスト判定不能 ${result.info.contrastUndecidable}組)`;
    if (!v.length) console.log(`✅ ${label} — 作り込みチェック: 問題なし  ${meta}`);
    else {
      console.log(`❌ ${label} — 作り込みチェック: ${v.length}件`);
      for (const x of v) console.log(`   [${x.severity}] ${x.rule}  ${x.message}\n        ${x.selector}  ${x.detail}`);
      console.log(`   ${meta}`);
    }
  }
  process.exit(result.violations.length ? 1 : 0);
})();
