#!/usr/bin/env node
/**
 * 写真の上に載った文字のコントラストを、実際の画素で測る。
 *
 * check-craft.js は背景が画像だと「判定不能」として外していた。
 * ここでは背景画像を canvas に描き直して実際の画素を読み、
 * その上に重なる膜（linear-gradient の単色レイヤー）を合成してから
 * 文字色とのコントラスト比を出す。
 *
 * 使い方: node check-hero-contrast.js <url|path/to/index.html> [--json]
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

const AUDIT = async () => {
  const out = { violations: [], info: {} };

  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  // src を dst の上に alpha 合成する
  const over = (src, dst) => {
    const a = src[3];
    return [0, 1, 2].map((i) => Math.round(src[i] * a + dst[i] * (1 - a)));
  };

  const sel = (e) => {
    const c = (e.className || '').toString().trim().split(/\s+/).filter(Boolean)[0];
    return e.tagName.toLowerCase() + (c ? '.' + c : '');
  };

  // 画像の実画素を読む。<img> でも CSS background でも同じ扱いにする。
  const imgCache = new Map();
  const loadImg = async (url) => {
    if (!imgCache.has(url)) {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      const ok = await new Promise((res) => { im.onload = () => res(true); im.onerror = () => res(false); im.src = url; });
      imgCache.set(url, ok ? im : null);
    }
    return imgCache.get(url);
  };
  const cv = document.createElement('canvas');
  cv.width = 1; cv.height = 1;
  const cctx = cv.getContext('2d', { willReadFrequently: true });

  // cover 相当の写像で 1px を読む
  const pixelAt = async (el, url, fit, x, y) => {
    const im = await loadImg(url);
    if (!im || !im.naturalWidth) return null;
    const r = el.getBoundingClientRect();
    const pick = fit === 'contain' ? Math.min : Math.max;
    const scale = pick(r.width / im.naturalWidth, r.height / im.naturalHeight);
    const dw = im.naturalWidth * scale, dh = im.naturalHeight * scale;
    const sx = Math.min(im.naturalWidth - 1, Math.max(0, ((x - r.left) - (r.width - dw) / 2) / scale));
    const sy = Math.min(im.naturalHeight - 1, Math.max(0, ((y - r.top) - (r.height - dh) / 2) / scale));
    try {
      cctx.clearRect(0, 0, 1, 1);
      cctx.drawImage(im, sx, sy, 1, 1, 0, 0, 1, 1);
      const d = cctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    } catch (e) { return null; }
  };

  // その要素が重ねている「膜」。
  // linear-gradient は1枚の層なので、停止色を平均して1回だけ合成する。
  // 停止色ごとに合成すると rgba(x,0.6) が2つある指定を 0.84 として数えてしまう。
  const filmsOf = (el, includeImageLayerOnly, pseudo) => {
    const cs = getComputedStyle(el, pseudo || null);
    const res = [];
    for (const m of (cs.backgroundImage || '').matchAll(/linear-gradient\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g)) {
      const stops = [...m[1].matchAll(/rgba?\([^)]*\)/g)].map((c) => parse(c[0])).filter(Boolean);
      if (!stops.length) continue;
      const avg = [0, 1, 2, 3].map((i) => stops.reduce((a, b) => a + b[i], 0) / stops.length);
      if (avg[3] > 0) res.push(avg);
    }
    if (!includeImageLayerOnly) {
      const bc = parse(cs.backgroundColor);
      if (bc && bc[3] > 0) res.push(bc);
    }
    return res;
  };

  // 座標 (x,y) における、text 要素の「真下」の実際の色。
  // 下から上へ順に積み上げる。途中で止めない。
  // 不透明な層（背景色 / 画像）に当たったらそこで色を置き換え、
  // 半透明の層（膜）は重ねる。止めてしまうと、その上にある写真を見落とす。
  // ::before / ::after で作った暗幕は elementsFromPoint に現れない。
  // forge / mori は .hero::before で膜を作っており、これを数えないと
  // 実際より明るい背景として測ってしまう（Codex 監査 2026-09-11 指摘）。
  const pseudoFilms = (el) => {
    const res = [];
    for (const which of ['::before', '::after']) {
      const c = getComputedStyle(el, which);
      if (!c || c.content === 'none' || c.content === 'normal') continue;
      if (c.position !== 'absolute' && c.position !== 'fixed') continue;
      // 親の面を覆っているものだけを膜とみなす
      const covers = ['top', 'right', 'bottom', 'left'].every((k) => {
        const v = c[k];
        return v === '0px' || v === 'auto';
      }) && (parseFloat(c.width) > 0 || c.width === 'auto');
      if (!covers) continue;
      for (const f of filmsOf(el, false, which)) res.push(f);
    }
    return res;
  };

  const backdropAt = async (textEl, x, y) => {
    const stack = document.elementsFromPoint(x, y);
    if (!stack.length) return null;
    const ti = stack.indexOf(textEl);
    const below = ti >= 0 ? stack.slice(ti + 1) : stack;

    let color = null;
    for (let i = below.length - 1; i >= 0; i--) {
      const el = below[i];
      const cs = getComputedStyle(el);

      const bc = parse(cs.backgroundColor);
      if (bc && bc[3] > 0) color = bc[3] === 1 ? bc.slice(0, 3) : (color ? over(bc, color) : bc.slice(0, 3));

      const url = (cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/) || [])[1];
      if (url) {
        const px = await pixelAt(el, url, cs.backgroundSize, x, y);
        if (px) {
          let c = px;
          for (const f of filmsOf(el, true)) c = over(f, c);
          color = c;
        }
      } else {
        for (const f of filmsOf(el, true)) color = color ? over(f, color) : null;
      }

      if (el.tagName === 'IMG' && el.currentSrc) {
        const px = await pixelAt(el, el.currentSrc, cs.objectFit, x, y);
        if (px) color = px;
      }

      // この要素の ::before / ::after が張った膜を重ねる
      if (color) for (const f of pseudoFilms(el)) color = over(f, color);
    }

    const ownBg = parse(getComputedStyle(textEl).backgroundColor);
    if (ownBg && ownBg[3] === 1) return ownBg.slice(0, 3);
    if (ownBg && ownBg[3] > 0 && color) color = over(ownBg, color);
    return color;
  };

  const texts = [...document.querySelectorAll('body *')].filter((e) => {
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) return false;
    const r = e.getBoundingClientRect();
    if (r.width <= 8 || r.height <= 8) return false;
    // 閉じたモバイルメニューのように、レイアウトはされているが見えていない要素を除く。
    // アニメーションは呼び出し側で1msに潰し、スクロールも済ませてから測るので、
    // ここで opacity を見ても IntersectionObserver のフェードインは巻き込まない。
    if (e.checkVisibility && !e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
    return getComputedStyle(e).visibility !== 'hidden';
  });

  let measured = 0;
  for (const e of texts) {
    const cs = getComputedStyle(e);
    const fg = parse(cs.color);
    if (!fg) continue;
    const r = e.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight * 6) continue;
    let worst = Infinity, worstBg = null, hit = false;
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 3; j++) {
        const x = r.left + (r.width * i) / 5;
        const y = r.top + (r.height * j) / 4;
        if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;
        const bg = await backdropAt(e, x, y);
        if (!bg) continue;
        hit = true;
        // 半透明の文字色を不透明として扱うと過大評価になる（Codex 監査指摘）
        const fgOn = fg[3] < 1 ? over(fg, bg) : fg.slice(0, 3);
        const c = ratio(fgOn, bg);
        if (c < worst) { worst = c; worstBg = bg; }
      }
    }
    if (!hit) continue;
    measured++;
    const size = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    if (worst < need) {
      out.violations.push({
        rule: 'rules.md 35（写真上）', severity: worst < need - 1 ? '高' : '中',
        message: `写真の上の文字のコントラスト比 ${worst.toFixed(2)}（必要 ${need}）`,
        selector: sel(e),
        detail: `${cs.color} on 実測 rgb(${worstBg.join(',')}) / ${Math.round(size)}px`,
      });
    }
  }
  out.info.measured = measured;
  return out;
};

(async () => {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) { console.error('使い方: node check-hero-contrast.js <url|path> [--json]'); process.exit(2); }
  let url = target;
  if (!/^https?:/.test(target)) {
    let p = path.resolve(target);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    url = pathToFileURL(p).href;
  }
  const label = path.basename(target.replace(/\/$/, '')) || target;
  const chromium = loadChromium();
  // file:// の画像を canvas から読むために必要
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  // モバイルだけ写真の明部に文字が来る作りがあるため、両方で測る（Codex 監査指摘）
  const WIDTHS = [1280, 390];
  let result = { violations: [], info: { measured: 0 } };
  for (const W of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  let r1;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.addStyleTag({ content: '*,*::before,*::after{animation-duration:1ms!important;animation-delay:0s!important;transition-duration:0s!important}' });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 20)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    // AUDIT は viewport 内の座標でしか画素を読めない。
    // 1画面ずつ送りながら測り、ページ全体を対象にする（Codex 監査指摘）。
    r1 = await page.evaluate(AUDIT);
  } finally { await ctx.close(); }
  for (const v of r1.violations) { v.message = `[${W}px] ` + v.message; }
  result.violations.push(...r1.violations);
  result.info.measured += r1.info.measured;
  }
  await browser.close();

  if (args.includes('--json')) { console.log(JSON.stringify({ target: url, ...result }, null, 2)); }
  else {
    const v = result.violations;
    if (!v.length) console.log(`✅ ${label} — 写真上の文字: 問題なし  (実測 ${result.info.measured}件)`);
    else {
      console.log(`❌ ${label} — 写真上の文字: ${v.length}件  (実測 ${result.info.measured}件)`);
      for (const x of v) console.log(`   [${x.severity}] ${x.message}\n        ${x.selector}  ${x.detail}`);
    }
  }
  process.exit(result.violations.filter((x) => x.severity === '高').length ? 1 : 0);
})();
