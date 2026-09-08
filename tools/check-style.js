#!/usr/bin/env node
/**
 * 装飾・ブランド一貫性チェック — NovaTech / SITEON
 * 実ブラウザ(Chromium)でレンダリングし、「枠→余白」方針とAI生成臭さを検出する。
 *
 * 追加理由:
 *   2026-05-03 に決めた「枠→余白」ルールが、akari では4か月間守られていなかった。
 *   rules.md に条項はあったが検査手段がなく、レビューでも見落としていた。
 *   ルールを書くだけでは守られない。検査して初めて守られる。
 *
 * 検出対象:
 *   1. テキストブロックに残る box-shadow（2026-05-03 枠→余白 変更1/変更2）
 *   2. 意味を持たない装飾的な左アクセントストライプ
 *   3. インディゴ/バイオレット系のアクセント（AI生成の最大の指紋）
 *   4. 絵文字のアイコン利用
 *   5. ダークモード既定
 *   6. ALL CAPS の字間不足
 *   7. 非インタラクティブなカード数（情報のみ・違反にはしない）
 *
 * 判定基準の出典:
 *   - SITEON「枠→余白」改修方針（2026-05-03 / 秘書ノート）
 *   - Refero Design Skill の anti-ai-slop.md（MIT License / Copyright (c) 2026 Refero /
 *     https://github.com/referodesign/refero_skill）を SITEON 向けに翻案
 *
 * 使い方:
 *   node check-style.js <url|path/to/index.html> [--json]
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

/** ページ内で実行する検査本体。 */
const AUDIT = function () {
  const out = { violations: [], info: {} };
  const rgbOf = (s) => { const m = (s || '').match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };
  const sel = (e) => {
    const c = (e.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)[0];
    return e.tagName.toLowerCase() + (e.id ? '#' + e.id : (c ? '.' + c : ''));
  };
  const isInteractive = (e) =>
    e.matches('a,button,input,textarea,select,details,summary,[role=button],[tabindex]') ||
    !!e.querySelector('a,button,input,textarea,select,summary,[role=button]');
  // 枠を残してよい要素（2026-05-03 変更4）: ヘッダー/フッター/ナビ/ヒーロー内パネル/操作要素
  const isExempt = (e) => !!e.closest('header,footer,nav,[class*="header"],[class*="footer"],[class*="hero"]');

  // 1. テキストブロックに残る box-shadow
  for (const e of document.querySelectorAll('div,article,section,aside,figure,blockquote,li')) {
    const cs = getComputedStyle(e);
    if (cs.boxShadow === 'none') continue;
    const r = e.getBoundingClientRect();
    if (r.width < 80 || r.height < 40) continue;
    if (isInteractive(e) || isExempt(e)) continue;
    out.violations.push({
      rule: '枠→余白 変更1/2', severity: '中',
      message: '操作要素でないブロックに box-shadow が残っている。枠ではなく余白と階層で読ませる',
      selector: sel(e), detail: cs.boxShadow.slice(0, 48),
    });
  }

  // 2. 意味を持たない装飾的な左アクセントストライプ（3px以上・他辺より太い・非操作・状態を示さない）
  const MEANINGFUL = /alert|status|priority|active|selected|current|error|warn|success|info|note|callout/i;
  for (const e of document.querySelectorAll('*')) {
    const cs = getComputedStyle(e);
    const w = parseFloat(cs.borderLeftWidth);
    if (!(w >= 3)) continue;
    const others = ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth'].map((k) => parseFloat(cs[k]));
    if (!others.every((v) => v < w)) continue;
    if (isInteractive(e) || isExempt(e)) continue;
    if (MEANINGFUL.test(e.getAttribute('class') || '')) continue;
    out.violations.push({
      rule: 'anti-slop #6', severity: '中',
      message: `左に ${cs.borderLeftWidth} のアクセントストライプがあるが、状態も優先度も示していない装飾`,
      selector: sel(e), detail: cs.borderLeftColor,
    });
  }

  // 3. インディゴ/バイオレット（色相250-290・彩度0.3以上）を面積のある要素の背景/文字色に使用
  const hueOf = (c) => {
    const [r, g, b] = c.map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (!d) return null;
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
    return { h: Math.round(h), s: mx ? d / mx : 0 };
  };
  const seenIndigo = new Set();
  for (const e of document.querySelectorAll('*')) {
    const r = e.getBoundingClientRect();
    if (r.width < 40 || r.height < 20) continue;
    const cs = getComputedStyle(e);
    for (const [prop, v] of [['background', cs.backgroundColor], ['color', cs.color]]) {
      const c = rgbOf(v); if (!c) continue;
      const hs = hueOf(c);
      if (hs && hs.h >= 250 && hs.h <= 290 && hs.s >= 0.3) {
        const key = prop + v;
        if (seenIndigo.has(key)) continue;
        seenIndigo.add(key);
        out.violations.push({
          rule: 'anti-slop #1', severity: '高',
          message: `インディゴ/バイオレット系（色相${hs.h}）を ${prop} に使用。AI生成デザインの最大の指紋`,
          selector: sel(e), detail: v,
        });
      }
    }
  }

  // 4. 絵文字のアイコン利用
  const emoji = [...new Set((document.body.innerText.match(/[\u{1F300}-\u{1FAFF}]|[\u{2700}-\u{27BF}]|[\u{2600}-\u{26FF}]/gu) || []))];
  if (emoji.length) {
    out.violations.push({
      rule: 'anti-slop #5', severity: '中',
      message: '絵文字がページ本文に含まれている。アイコンはSVGまたはUnicode記号を使う',
      selector: 'body', detail: emoji.join(' '),
    });
  }

  // 5. ダークモード既定
  //    body の背景が transparent の場合は html まで遡る。遡らないと (0,0,0) と解釈して
  //    ライトなサイトを「ダーク」と誤判定する。
  const isTransparent = (v) => !v || v === 'transparent' || /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(v);
  let bgSource = getComputedStyle(document.body).backgroundColor;
  if (isTransparent(bgSource)) bgSource = getComputedStyle(document.documentElement).backgroundColor;
  if (isTransparent(bgSource)) bgSource = 'rgb(255, 255, 255)';
  const bodyBg = rgbOf(bgSource);
  out.info.bodyBackground = bgSource;
  if (bodyBg && (bodyBg[0] + bodyBg[1] + bodyBg[2]) / 3 < 90) {
    out.violations.push({
      rule: 'anti-slop #3', severity: '低',
      message: 'ページ全体がダーク基調。業態・ブランドの要請がなければライトが基準',
      selector: 'body', detail: out.info.bodyBackground,
    });
  }

  // 6. ALL CAPS の字間不足（英字3文字以上を含むものだけ。電話番号などを除外）
  for (const e of document.querySelectorAll('*')) {
    if (e.children.length) continue;
    const t = (e.textContent || '').trim();
    if (t.length < 6 || !/^[A-Z0-9 &.,\-/']+$/.test(t)) continue;
    // 4文字以下のブランド名・ラベル（LINE / MENU / FAQ 等）は字間不足として扱わない。
    // 装飾的な大文字組みかどうかは、ある程度の長さがないと判別できない。
    if ((t.match(/[A-Z]/g) || []).length < 6) continue;
    const cs = getComputedStyle(e);
    const ls = cs.letterSpacing;
    if (ls !== 'normal' && parseFloat(ls) >= 0.5) continue;
    out.violations.push({
      rule: 'anti-slop typography', severity: '低',
      message: 'ALL CAPS に letter-spacing が設定されていない。大文字は字間を開けないと読みにくい',
      selector: sel(e), detail: `「${t.slice(0, 28)}」 letter-spacing: ${ls}`,
    });
  }

  // 7. 非インタラクティブなカード数（情報のみ）
  const cards = [...document.querySelectorAll('div,article,section,aside,figure,li')].filter((e) => {
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    if (r.width < 120 || r.height < 60) return false;
    const hasBg = !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor);
    const hasBorder = parseFloat(cs.borderTopWidth) > 0;
    const hasRadius = parseFloat(cs.borderTopLeftRadius) > 2;
    return (hasBg || hasBorder) && hasRadius;
  });
  out.info.cardsTotal = cards.length;
  out.info.cardsNonInteractive = cards.filter((e) => !isInteractive(e)).length;

  return out;
};

(async () => {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) {
    console.error('使い方: node check-style.js <url|path/to/index.html> [--json]');
    process.exit(2);
  }
  let url = target;
  if (!/^https?:/.test(target)) {
    let p = path.resolve(target);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    url = pathToFileURL(p).href;
  }
  const label = path.basename(target.replace(/\/$/, '')) || target;

  const chromium = loadChromium();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  let result;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.evaluate(async () => {
      await new Promise((r) => { let y = 0; const t = setInterval(() => {
        window.scrollBy(0, 600); y += 600;
        if (y >= document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); setTimeout(r, 300); }
      }, 25); });
    });
    result = await page.evaluate(AUDIT);
  } finally {
    await browser.close();
  }

  if (args.includes('--json')) {
    console.log(JSON.stringify({ target: url, ...result }, null, 2));
  } else {
    const v = result.violations;
    const order = { 高: 0, 中: 1, 低: 2 };
    v.sort((a, b) => order[a.severity] - order[b.severity]);
    if (!v.length) {
      console.log(`✅ ${label} — 装飾チェック: 問題なし  (カード ${result.info.cardsTotal}件 / 非操作 ${result.info.cardsNonInteractive}件)`);
    } else {
      console.log(`❌ ${label} — 装飾チェック: ${v.length}件`);
      for (const x of v) console.log(`   [${x.severity}] ${x.rule}  ${x.message}\n        ${x.selector}  ${x.detail}`);
      console.log(`   (カード ${result.info.cardsTotal}件 / 非操作 ${result.info.cardsNonInteractive}件)`);
    }
  }
  process.exit(result.violations.length ? 1 : 0);
})();
