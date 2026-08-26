#!/usr/bin/env node
/**
 * モバイルUIチェック — NovaTech / SITEON
 * 実ブラウザ(Chromium)でレンダリングし、スマホ表示の崩れを検出する。
 *
 * 検出対象:
 *   1. 横スクロール発生（ページ全体）
 *   2. ビューポートをはみ出す要素（clip祖先なし = 実際に崩れているもの）
 *   3. コンテナ内で横に溢れている要素（文字切れ・はみ出し）
 *   4. タップターゲットが 44x44px 未満
 *   5. 本文フォントが 12px 未満
 *   6. フォーム入力が 16px 未満（iOSで自動ズームが起きる）
 *   7. 固定要素（下部CTA等）が最下部コンテンツを覆っている
 *   8. アンカー先が固定ヘッダーに隠れる（scroll-margin-top 不足）
 *   9. viewport メタの user-scalable=no / maximum-scale 固定
 *  10. 100vh 指定（iOS Safariでアドレスバー分ズレる。dvh推奨）
 *  11. 画像の縦横比が崩れている（object-fit: fill）
 *  12. スクロール後も見えないままの fade-in 要素（表示されない事故）
 *
 * 使い方:
 *   node check-mobile.js <url|path/to/index.html> [--shot out.png] [--json]
 *   node check-mobile.js .            # カレントの index.html
 */

const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

function loadChromium() {
  const roots = [
    path.join(__dirname, 'node_modules'),
    path.join(__dirname, '..', 'node_modules'),
    path.join(__dirname, '..', 'novatech-siteon-business', 'node_modules'),
    path.join(__dirname, '..', '..', 'novatech-siteon-business', 'node_modules'),
  ];
  for (const r of roots) {
    try { return require(path.join(r, 'playwright')).chromium; } catch (e) { /* next */ }
  }
  try { return require('playwright').chromium; } catch (e) { /* next */ }
  throw new Error(
    'playwright が見つかりません。次を実行してください:\n' +
    '  cd /Users/satouyuuichi/Developer/novatech-siteon-business && npm i && npx playwright install chromium'
  );
}

const WIDTHS = [320, 375, 390, 430];

/** ページ内で実行する検査本体。ブラウザ側コンテキストで動く。 */
const AUDIT = function () {
  const vw = document.documentElement.clientWidth;
  const out = { overflowX: null, maskedOverflow: null, escapes: [], innerOverflow: [], smallTaps: [], tinyText: [], zoomInputs: [], covered: [], anchorHidden: [], badRatio: [], stillHidden: [] };

  const docSW = document.documentElement.scrollWidth;
  if (docSW > vw + 1) out.overflowX = { scrollWidth: docSW, viewport: vw };

  // html/body の overflow-x:hidden は「はみ出しを隠しているだけ」なので、
  // 一時的に外して本当の溢れ幅を測る（隠されている＝内容が切れている）。
  const roots = [document.documentElement, document.body];
  const saved = roots.map((el) => el.style.overflowX);
  const masking = roots.some((el) => /hidden|clip/.test(getComputedStyle(el).overflowX));
  if (masking && !out.overflowX) {
    roots.forEach((el) => { el.style.setProperty('overflow-x', 'visible', 'important'); });
    void document.body.offsetWidth;
    const trueSW = document.documentElement.scrollWidth;
    if (trueSW > vw + 1) out.maskedOverflow = { scrollWidth: trueSW, viewport: vw };
    roots.forEach((el, i) => { el.style.overflowX = saved[i]; });
    void document.body.offsetWidth;
  }

  const label = (el) => {
    const cls = (el.className && el.className.toString().trim().split(/\s+/).slice(0, 3).join('.')) || '';
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls : '') + (txt ? ` «${txt}»` : '');
  };
  const clipped = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (p === document.body || p === document.documentElement) break; // ルートの hidden は握り潰しなので除外
      const o = getComputedStyle(p);
      if (/hidden|clip|auto|scroll/.test(o.overflowX)) return true;
    }
    return false;
  };
  const inHiddenLayer = (el) => {
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p);
      if (o.display === 'none' || o.visibility === 'hidden') return true;
      if (parseFloat(o.opacity) < 0.1) return true;
      if (p.hasAttribute && (p.getAttribute('aria-hidden') === 'true' || p.hasAttribute('inert'))) return true;
    }
    return false;
  };
  // 意図的な演出（マーキー等）: 自身か祖先／子孫にアニメーションがあり、
  // かつクリップ用の祖先を持つものは「はみ出し崩れ」ではなく演出とみなす。
  const animatedBleed = (el) => {
    const anim = (n) => { const o = getComputedStyle(n); return o.animationName !== 'none' || o.transitionProperty.includes('transform'); };
    if (!clipped(el)) return false;
    if (anim(el)) return true;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (anim(p)) return true;
    return [...el.children].some(anim);
  };
  const visible = (el) => {
    if (inHiddenLayer(el)) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  };

  const all = document.querySelectorAll('body *');
  for (const el of all) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();

    // 2. ビューポートはみ出し（clip祖先がない = 実際に横スクロールを生む崩れ）
    if (cs.position !== 'fixed' && (r.right > vw + 1 || r.left < -1) && !clipped(el)) {
      out.escapes.push({ el: label(el), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
    }

    // 3. 中身が親の幅を超えている（＝文字や画像が切れる／余白が食われる）
    // 位置指定された装飾（ぼかし円などの意図的なはみ出し）と、
    // マーキーのような流す演出はそれぞれ除外する。
    const inFlow = cs.position === 'static' || cs.position === 'relative';
    const carriesContent = el.tagName === 'IMG' || [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const parent = el.parentElement;
    if (inFlow && carriesContent && parent && parent.clientWidth > 0 && !animatedBleed(el)) {
      const pcs = getComputedStyle(parent);
      const pad = (parseFloat(pcs.paddingLeft) || 0) + (parseFloat(pcs.paddingRight) || 0);
      const avail = parent.clientWidth - pad;
      // transform: scale した祖先を持つと視覚幅がずれるため、レイアウト幅で比較する
      const laidOut = el.offsetWidth || r.width;
      if (laidOut > avail + 1) {
        out.innerOverflow.push({ el: label(el), width: Math.round(laidOut), available: Math.round(avail) });
      }
    }

    // 11. 画像比率崩れ
    if (el.tagName === 'IMG' && cs.objectFit === 'fill' && el.naturalWidth && r.width > 4) {
      const nat = el.naturalWidth / el.naturalHeight, cur = r.width / r.height;
      if (Math.abs(nat - cur) / nat > 0.15) out.badRatio.push({ el: label(el), natural: +nat.toFixed(2), rendered: +cur.toFixed(2) });
    }
  }

  // 4. タップターゲット
  for (const el of document.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [onclick]')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'contents') continue;
    const r = el.getBoundingClientRect();
    // インライン文中リンクは対象外
    if (el.tagName === 'A' && cs.display === 'inline' && el.closest('p, li')) continue;
    // ::before / ::after で当たり判定を広げている場合はその実寸を採用する
    let w = r.width, h = r.height;
    for (const pe of ['::before', '::after']) {
      const ps = getComputedStyle(el, pe);
      if (!ps || ps.content === 'none' || ps.position !== 'absolute') continue;
      w = Math.max(w, parseFloat(ps.width) || 0);
      h = Math.max(h, parseFloat(ps.height) || 0);
    }
    if (w < 43.5 || h < 43.5) {
      out.smallTaps.push({ el: label(el), w: Math.round(w), h: Math.round(h) });
    }
  }

  // 5/6. 文字サイズ
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    if (hasText && fs < 12) out.tinyText.push({ el: label(el), fontSize: fs });
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && fs < 16) out.zoomInputs.push({ el: label(el), fontSize: fs });
  }

  // 7. 固定要素が最下部を覆う
  const fixedBottom = [...document.querySelectorAll('body *')].filter((el) => {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' || inHiddenLayer(el)) return false;
    const r = el.getBoundingClientRect();
    return r.height > 0 && r.bottom > window.innerHeight - 8 && r.top > window.innerHeight / 2;
  });
  if (fixedBottom.length) {
    const barTop = Math.min(...fixedBottom.map((e) => e.getBoundingClientRect().top));
    const need = Math.ceil(window.innerHeight - barTop);
    const padBottom = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    const marBottom = parseFloat(getComputedStyle(document.body).marginBottom) || 0;
    if (padBottom + marBottom < need - 4) {
      out.covered.push({ el: fixedBottom.map(label).join(', '), barHeight: need, bodyPaddingBottom: padBottom + marBottom });
    }
  }

  // 8. アンカー先が固定ヘッダーに隠れる
  const fixedTop = [...document.querySelectorAll('body *')].filter((el) => {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') return false;
    if (inHiddenLayer(el)) return false; // 閉じたモバイルメニューを拾わない
    const r = el.getBoundingClientRect();
    return r.height > 0 && r.top <= 2 && r.height < window.innerHeight / 2;
  });
  const headerH = fixedTop.length ? Math.max(...fixedTop.map((e) => e.getBoundingClientRect().height)) : 0;
  if (headerH > 0) {
    for (const a of document.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute('href').slice(1);
      if (!id) continue;
      const t = document.getElementById(id);
      if (!t) continue;
      const sm = parseFloat(getComputedStyle(t).scrollMarginTop) || 0;
      if (sm < headerH - 2) out.anchorHidden.push({ target: '#' + id, headerHeight: Math.round(headerH), scrollMarginTop: sm });
    }
  }

  // 12. 表示されないままの reveal 要素
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.position === 'fixed') continue;
    const r = el.getBoundingClientRect();
    const isReveal = /fade|reveal|animate|appear|slide/i.test(String(el.className));
    if (isReveal && r.height > 24 && parseFloat(cs.opacity) < 0.1 && (el.textContent || '').trim()) {
      out.stillHidden.push({ el: label(el), opacity: cs.opacity, docY: Math.round(r.top + window.scrollY) });
    }
  }

  const dedup = (arr, key) => { const s = new Set(); return arr.filter((x) => { const k = key(x); if (s.has(k)) return false; s.add(k); return true; }); };
  out.anchorHidden = dedup(out.anchorHidden, (x) => x.target);
  out.stillHidden = dedup(out.stillHidden, (x) => x.el);
  return out;
};

/** ソース側の静的チェック（レンダリングでは拾えないもの） */
function staticChecks(html) {
  const issues = [];
  const vp = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i);
  if (!vp) issues.push('viewport メタタグがありません');
  else {
    const c = (vp[0].match(/content=["']([^"']*)["']/i) || [, ''])[1];
    if (/user-scalable\s*=\s*(no|0)/i.test(c)) issues.push('viewport に user-scalable=no があります（ピンチズーム禁止はアクセシビリティ違反）');
    if (/maximum-scale\s*=\s*1(\.0)?\b/i.test(c)) issues.push('viewport に maximum-scale=1 があります（ズーム制限を外してください）');
    if (!/width\s*=\s*device-width/i.test(c)) issues.push('viewport に width=device-width がありません');
  }
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  // 100vh（min-height:100vh の hero は iOS でアドレスバー分はみ出す）
  // 100vh の直後に 100svh / 100dvh のフォールバックがあれば適正とみなす
  const vhBare = [...styles.matchAll(/(height|min-height)\s*:\s*100vh\s*;(?![^]{0,120}?100[sd]vh)/gi)];
  if (vhBare.length) issues.push(`100vh 指定が ${vhBare.length} 箇所（iOS Safari でズレます。直後に 100svh のフォールバックを足してください）`);
  // IntersectionObserver の threshold が高いと、画面より背の高い要素が永久に発火しない
  for (const m of html.matchAll(/threshold\s*:\s*([0-9.]+)/g)) {
    const t = parseFloat(m[1]);
    if (t > 0.05) issues.push(`IntersectionObserver の threshold が ${t}（縦 ${Math.round(667 / t)}px を超える要素はスマホで永久に表示されません。0.01〜0.05 + rootMargin 推奨）`);
  }
  return issues;
}

async function auditUrl(chromium, url, label, shotDir) {
  const browser = await chromium.launch();
  const results = [];
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 812 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    // reveal アニメーションを全て発火させる
    // reveal アニメーションを実機と同じ速度で全て発火させる。
    // 速すぎると IntersectionObserver が追いつかず「非表示のまま」を誤検出する。
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.4);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 130));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1200));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    const r = await page.evaluate(AUDIT);
    results.push({ width, ...r });
    if (shotDir && width === 375) {
      fs.mkdirSync(shotDir, { recursive: true });
      await page.screenshot({ path: path.join(shotDir, `${label}-375.png`), fullPage: true });
    }
    await ctx.close();
  }
  await browser.close();
  return results;
}

function report(label, results, staticIssues) {
  const lines = [];
  let fail = 0;
  const push = (title, items, fmt) => {
    if (!items || !items.length) return;
    fail += items.length;
    lines.push(`  ${title} (${items.length}件)`);
    items.slice(0, 8).forEach((i) => lines.push('    - ' + fmt(i)));
    if (items.length > 8) lines.push(`    … 他 ${items.length - 8} 件`);
  };

  if (staticIssues.length) {
    fail += staticIssues.length;
    lines.push('  [ソース] 静的チェック');
    staticIssues.forEach((i) => lines.push('    - ' + i));
  }

  for (const r of results) {
    const sub = [];
    const p = (t, items, fmt) => { if (items && items.length) sub.push({ t, items, fmt }); };
    p('横スクロール発生', r.overflowX ? [r.overflowX] : [], (i) => `scrollWidth ${i.scrollWidth}px > viewport ${i.viewport}px`);
    p('はみ出しを overflow-x:hidden で握り潰している', r.maskedOverflow ? [r.maskedOverflow] : [], (i) => `本来 ${i.scrollWidth}px > viewport ${i.viewport}px（内容が切れています）`);
    p('画面外はみ出し要素', r.escapes, (i) => `${i.el} → left:${i.left} right:${i.right} w:${i.w}`);
    p('中身が親の幅を超えている', r.innerOverflow, (i) => `${i.el} → ${i.width}px / 使える幅 ${i.available}px`);
    p('タップ領域が44px未満', r.smallTaps, (i) => `${i.el} → ${i.w}x${i.h}px`);
    p('文字が12px未満', r.tinyText, (i) => `${i.el} → ${i.fontSize}px`);
    p('入力欄が16px未満（iOS自動ズーム）', r.zoomInputs, (i) => `${i.el} → ${i.fontSize}px`);
    p('固定バーが最下部を覆っている', r.covered, (i) => `${i.el} → バー高 ${i.barHeight}px / body余白 ${i.bodyPaddingBottom}px`);
    p('アンカー先が固定ヘッダーに隠れる', r.anchorHidden, (i) => `${i.target} → ヘッダー ${i.headerHeight}px / scroll-margin-top ${i.scrollMarginTop}px`);
    p('画像の縦横比が崩れている', r.badRatio, (i) => `${i.el} → 元 ${i.natural} / 表示 ${i.rendered}`);
    p('スクロール後も非表示のまま', r.stillHidden, (i) => `${i.el} → opacity ${i.opacity} (y=${i.docY})`);

    if (sub.length) {
      lines.push(`  [${r.width}px]`);
      sub.forEach((s) => push(s.t, s.items, s.fmt));
    }
  }

  if (!lines.length) {
    console.log(`✅ ${label} — モバイルチェック: 問題なし`);
    return 0;
  }
  console.log(`\n❌ ${label} — モバイル表示の問題を検出:`);
  lines.forEach((l) => console.log(l));
  return fail;
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOut = args.includes('--json');
  const shotIdx = args.indexOf('--shot');
  const shotDir = shotIdx >= 0 ? args[shotIdx + 1] : null;
  let target = args.find((a) => !a.startsWith('--') && a !== shotDir) || '.';

  let url, htmlPath;
  if (/^https?:\/\//.test(target)) {
    url = target;
  } else {
    htmlPath = fs.statSync(target).isDirectory() ? path.join(target, 'index.html') : target;
    if (!fs.existsSync(htmlPath)) { console.error(`HTMLが見つかりません: ${htmlPath}`); process.exit(1); }
    url = pathToFileURL(path.resolve(htmlPath)).href;
  }
  const label = htmlPath ? path.basename(path.dirname(path.resolve(htmlPath))) : url;
  const staticIssues = htmlPath ? staticChecks(fs.readFileSync(htmlPath, 'utf8')) : [];

  const chromium = loadChromium();
  const results = await auditUrl(chromium, url, label, shotDir);

  if (jsonOut) { console.log(JSON.stringify({ label, staticIssues, results }, null, 2)); process.exit(0); }
  const fail = report(label, results, staticIssues);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e.message); process.exit(2); });
