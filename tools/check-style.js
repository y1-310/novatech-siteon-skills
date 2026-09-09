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

  // 8. 横スクロールする文字列（マーキー） — rules.md カテゴリ4 の 66
  //    「無限ループするアニメーション」「親が横をクリップしている」「中身が文字」の3つが
  //    そろったものだけを拾う。幅で判定しないのは、文言が短く画面幅に収まるマーキーも
  //    流れて見えるため（bloom 実測 641px < 1440px でも流れていた）。
  //    スクロール指示線のような装飾は文字を持たないので除外される。
  for (const e of document.querySelectorAll('*')) {
    const cs = getComputedStyle(e);
    if (cs.animationName === 'none' || !/infinite/.test(cs.animationIterationCount)) continue;
    const text = (e.textContent || '').trim();
    if (text.length < 8) continue;
    const parent = e.parentElement;
    if (!parent) continue;
    const pox = getComputedStyle(parent).overflowX;
    if (pox !== 'hidden' && pox !== 'clip') continue;
    out.violations.push({
      rule: 'no marquee', severity: '中',
      message: '横に流れる文字列（マーキー）がある。読ませる情報がないまま視線を奪い続ける',
      selector: sel(e),
      detail: `${cs.animationName} 無限ループ / 「${text.slice(0, 24)}」`,
    });
  }

  // 9. 写真の上に載せた情報パネル — rules.md カテゴリ4 の 68
  //    7 のカード判定は border-radius を必須にしているため、角丸なしで背景だけの
  //    半透明パネルはすり抜ける（tomori .floating-card を実際に見逃した）。
  //    「画像の矩形に完全に収まる」「不透明でない背景を持つ」「文字がある」で判定する。
  {
    const imgs = [...document.querySelectorAll('img')]
      .map((i) => i.getBoundingClientRect())
      .filter((r) => r.width > 200 && r.height > 150);
    for (const e of document.querySelectorAll('div,aside,figcaption,p,span')) {
      const cs = getComputedStyle(e);
      if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
      if (isInteractive(e)) continue;
      const text = (e.textContent || '').trim();
      if (text.length < 10) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 80 || r.height < 40) continue;
      const alpha = (cs.backgroundColor.match(/rgba?\(([^)]+)\)/) || [])[1];
      if (!alpha) continue;
      const parts = alpha.split(',').map((x) => parseFloat(x));
      const a = parts.length > 3 ? parts[3] : 1;
      if (a === 0) continue;  // 背景なしの文字（ヒーローのコピー等）は対象外
      const on = imgs.some((ir) =>
        r.left >= ir.left - 4 && r.right <= ir.right + 4 && r.top >= ir.top - 4 && r.bottom <= ir.bottom + 4);
      if (!on) continue;
      out.violations.push({
        rule: 'no panel on photo', severity: '中',
        message: '写真の上に情報パネルを重ねている。写真を隠すうえ、文字の背景が読み手側で予測できない',
        selector: sel(e),
        detail: `背景 ${cs.backgroundColor}${cs.backdropFilter !== 'none' ? ' / ' + cs.backdropFilter : ''} 「${text.replace(/\s+/g, ' ').slice(0, 24)}」`,
      });
    }
  }

  // 10. タイプスケールの段数 — rules.md カテゴリ4 の 70
  //     文字を直接持つ要素の font-size を数える。Refero が公開している DESIGN.md の
  //     実例は5段。段を持たずにその場で rem を決めると 11.52 / 11.84 / 12.16 のような
  //     見分けのつかない値が並ぶ。
  {
    const sizes = new Map();
    for (const e of document.querySelectorAll('body *')) {
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (!own) continue;
      const fs2 = getComputedStyle(e).fontSize;
      sizes.set(fs2, (sizes.get(fs2) || 0) + 1);
    }
    out.info.typeScaleSteps = sizes.size;
    if (sizes.size > 10) {
      const sorted = [...sizes.entries()].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
      out.violations.push({
        rule: 'type scale', severity: '低',
        message: `文字サイズが ${sizes.size} 種類ある。段を決めずにその場で値を作っている`,
        selector: 'body', detail: sorted.map(([k, v]) => `${k}×${v}`).join(' '),
      });
    }
  }

  // 11. 角丸の種類数 — rules.md カテゴリ4 の 71
  //     「箱 / ピル / 円」の3種で足りる。8px と 10px と 12px を混ぜても誰も見分けない。
  {
    const radii = new Set();
    for (const e of document.querySelectorAll('body *')) {
      const r = e.getBoundingClientRect();
      if (r.width < 16 || r.height < 16) continue;
      const v = getComputedStyle(e).borderTopLeftRadius;
      if (v && v !== '0px') radii.add(v);
    }
    out.info.radiusKinds = radii.size;
    if (radii.size > 3) {
      out.violations.push({
        rule: 'radius kinds', severity: '中',
        message: `角丸が ${radii.size} 種類ある。箱・ピル・円の3種に畳む`,
        selector: 'body', detail: [...radii].join(' / '),
      });
    }
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
      console.log(`✅ ${label} — 装飾チェック: 問題なし  (カード ${result.info.cardsTotal}件 / 非操作 ${result.info.cardsNonInteractive}件 / 字種 ${result.info.typeScaleSteps} / 角丸 ${result.info.radiusKinds}種)`);
    } else {
      console.log(`❌ ${label} — 装飾チェック: ${v.length}件`);
      for (const x of v) console.log(`   [${x.severity}] ${x.rule}  ${x.message}\n        ${x.selector}  ${x.detail}`);
      console.log(`   (カード ${result.info.cardsTotal}件 / 非操作 ${result.info.cardsNonInteractive}件 / 字種 ${result.info.typeScaleSteps} / 角丸 ${result.info.radiusKinds}種)`);
    }
  }
  // commit を止めるのは 高 / 中 だけ。低（字種の多さ・ALL CAPS の字間）は
  // 情報として出すが作業は止めない。厳しすぎる検査は無視されるようになる。
  const blocking = result.violations.filter((x) => x.severity !== '低').length;
  process.exit(blocking ? 1 : 0);
})();
