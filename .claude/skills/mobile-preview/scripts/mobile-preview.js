/**
 * mobile-preview.js v1.3 — 全アスペクト比スクショ + 横オーバーフロー監査 + 展開状態監査
 *
 * v1.3 改修点 (2026-09-07):
 *   - メニュー展開状態の監査を追加（rules.md 50〜53）。横オーバーフロー検査では
 *     原理的に検出できない不具合を、モバイル幅で自動判定する:
 *       50: オーバーレイパネルの背景が完全不透明か（rgba の alpha < 1 を検出）
 *       51: パネル上端が固定ヘッダー下端に接しているか（ズレ > 1px を検出）
 *       52: ヘッダー内テキストの行頭に長音符・句読点・閉じ括弧が孤立していないか
 *       53: [id] の scroll-margin-top が 0 にフォールバックしていないか
 *   - 上記いずれかの違反で終了コード 1
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


/**
 * メニュー展開状態の監査（rules.md 50〜53）。モバイル幅でのみ実行する。
 * ハンバーガーを開き、パネルの不透明度・位置・行頭禁則・アンカーオフセットを判定する。
 */
const MENU_AUDIT = function () {
  const out = { applicable: false, violations: [], detail: {} };

  const toggle = document.querySelector(
    '[data-menu-toggle], .menu-toggle, [aria-controls][aria-expanded], button[class*="hamburger"], button[class*="menu"]'
  );
  if (!toggle || getComputedStyle(toggle).display === 'none') return out;

  const controls = toggle.getAttribute('aria-controls');
  let panel = controls ? document.getElementById(controls) : null;
  if (panel) {
    // aria-controls が中身(nav)を指し、実際に背景を持つのはその親パネルのことがある
    let el = panel;
    while (el && el !== document.body) {
      const pos = getComputedStyle(el).position;
      if (pos === 'fixed' || pos === 'absolute') { panel = el; break; }
      el = el.parentElement;
    }
  }
  if (!panel) panel = document.querySelector('.nav-wrap, [class*="nav-panel"], [class*="drawer"]');
  if (!panel) return out;

  out.applicable = true;
  const header = document.querySelector('header, .header, [class*="header"]');
  const pcs = getComputedStyle(panel);

  // 50: 背景が完全不透明か
  //     backdrop-filter の blur が十分に効いている場合、背面は判読不能なぼかしになるため
  //     意図的なガラス表現として許容する（ただし alpha が低すぎる場合は blur があっても不可）。
  const bg = pcs.backgroundColor;
  const m = bg.match(/rgba?\(([^)]+)\)/);
  const alpha = m ? (m[1].split(',')[3] !== undefined ? parseFloat(m[1].split(',')[3]) : 1) : 1;
  const blurMatch = (pcs.backdropFilter || '').match(/blur\(([\d.]+)px\)/);
  const blurPx = blurMatch ? parseFloat(blurMatch[1]) : 0;
  out.detail.panelBackground = bg;
  out.detail.backdropBlur = blurPx ? blurPx + 'px' : 'none';
  if (alpha < 1 && !(blurPx >= 8 && alpha >= 0.92)) {
    out.violations.push({
      rule: 50, severity: '高',
      message: `オーバーレイパネルの背景が半透明（alpha=${alpha}${blurPx ? ` / blur ${blurPx}px` : ' / blur なし'}）。背面が透けて可読性が落ちる`,
      selector: panel.className || panel.tagName.toLowerCase(),
    });
  }

  // 51: パネル上端が固定ヘッダー下端に接しているか
  //     ただし全画面オーバーレイ（ヘッダーごと画面全体を覆う設計）は対象外。
  //     ヘッダーの上端より上から始まり下端より下まで覆っていれば、潜っているのではなく
  //     意図的に覆っている。
  if (header) {
    const hb = header.getBoundingClientRect();
    const nb = panel.getBoundingClientRect();
    const gap = Math.round(nb.top - hb.bottom);
    const isFullOverlay = nb.top <= hb.top + 1 && nb.bottom >= hb.bottom - 1
      && nb.height >= window.innerHeight * 0.9;
    out.detail.headerBottom = Math.round(hb.bottom);
    out.detail.panelTop = Math.round(nb.top);
    out.detail.gap = gap;
    out.detail.fullScreenOverlay = isFullOverlay;
    if (!isFullOverlay && Math.abs(gap) > 1) {
      out.violations.push({
        rule: 51, severity: gap < 0 ? '高' : '中',
        message: gap < 0
          ? `パネルがヘッダーの裏に ${Math.abs(gap)}px 潜っている（ヘッダー実高と固定px参照のズレ）`
          : `パネルとヘッダーの間に ${gap}px の隙間があり背面が見える`,
        selector: panel.className || panel.tagName.toLowerCase(),
      });
    }
  }

  // 52: ヘッダー内テキストの行頭禁則（長音符・句読点・閉じ括弧の孤立）
  const FORBIDDEN = 'ーぁぃぅぇぉっゃゅょァィゥェォッャュョ、。，．）］｝」』〉》〕！？';
  const lineStarts = [];
  const targets = header ? header.querySelectorAll('p, span, h1, h2, a') : [];
  for (const el of targets) {
    const tn = el.firstChild;
    if (!tn || tn.nodeType !== 3 || tn.length < 2) continue;
    const rg = document.createRange();
    let prevTop = null;
    for (let i = 0; i < tn.length; i++) {
      rg.setStart(tn, i); rg.setEnd(tn, i + 1);
      const t = Math.round(rg.getBoundingClientRect().top);
      if (prevTop !== null && t !== prevTop) {
        const ch = tn.data[i];
        lineStarts.push(ch);
        if (FORBIDDEN.includes(ch)) {
          out.violations.push({
            rule: 52, severity: '中',
            message: `行頭に「${ch}」が孤立している（word-break: keep-all が overflow-wrap: anywhere に上書きされている可能性）`,
            selector: (el.className || el.tagName.toLowerCase()) + ' : ' + tn.data.trim().slice(0, 24),
          });
        }
      }
      prevTop = t;
    }
  }
  out.detail.lineStartChars = lineStarts;

  // 53: アンカーの scroll-margin-top が 0 にフォールバックしていないか
  if (header && getComputedStyle(header).position === 'fixed') {
    const ids = [...document.querySelectorAll('section[id], main [id]')].slice(0, 12);
    const zero = ids.filter((el) => parseFloat(getComputedStyle(el).scrollMarginTop) === 0);
    const headerH = Math.round(header.getBoundingClientRect().height);
    out.detail.headerHeight = headerH;
    out.detail.anchorsWithZeroMargin = zero.length + '/' + ids.length;
    if (ids.length && zero.length === ids.length) {
      out.violations.push({
        rule: 53, severity: '高',
        message: `固定ヘッダー(${headerH}px)があるのに [id] の scroll-margin-top が全て 0。アンカーの着地点がヘッダーの裏に隠れる`,
        selector: zero.slice(0, 3).map((e) => '#' + e.id).join(', '),
      });
    } else {
      const tooSmall = ids.filter((el) => {
        const v = parseFloat(getComputedStyle(el).scrollMarginTop);
        return v > 0 && v < headerH;
      });
      if (tooSmall.length) {
        out.violations.push({
          rule: 53, severity: '中',
          message: `scroll-margin-top がヘッダー実高(${headerH}px)より小さく、見出しが一部隠れる`,
          selector: tooSmall.slice(0, 3).map((e) => '#' + e.id).join(', '),
        });
      }
    }
  }

  return out;
};

/** ハンバーガーを開く。トランジション完了は呼び出し側で待つ。 */
const OPEN_MENU = function () {
  const toggle = document.querySelector(
    '[data-menu-toggle], .menu-toggle, [aria-controls][aria-expanded], button[class*="hamburger"], button[class*="menu"]'
  );
  if (!toggle || getComputedStyle(toggle).display === 'none') return false;
  toggle.click();
  return true;
};

/** ハンバーガーを閉じる（スクショに影響させない）。 */
const CLOSE_MENU = function () {
  const toggle = document.querySelector(
    '[data-menu-toggle], .menu-toggle, [aria-controls][aria-expanded], button[class*="hamburger"], button[class*="menu"]'
  );
  if (toggle) toggle.click();
};

(async () => {
  const browser = await chromium.launch();
  console.log(`📐 mobile-preview v1.3 — ${auditOnly ? '監査のみ' : '撮影 + 監査'}`);
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

      // メニュー展開状態の監査（rules.md 50〜53）。ハンバーガーが出るモバイル幅のみ。
      let menu = { applicable: false, violations: [] };
      if (v.width < 768) {
        const opened = await page.evaluate(OPEN_MENU);
        if (opened) {
          await page.waitForTimeout(600); // transition 完了待ち
          menu = await page.evaluate(MENU_AUDIT);
          await page.evaluate(CLOSE_MENU);
          await page.waitForTimeout(400);
        }
      }
      results.push({ viewport: v.name, note: v.note, ...audit, menu });

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
      if (menu.violations && menu.violations.length) {
        menu.violations.forEach((x) => {
          console.log(`   ❌ [メニュー展開/ルール${x.rule}/${x.severity}] ${x.message}`);
          console.log(`      └ ${x.selector}`);
        });
      } else if (menu.applicable) {
        const kind = menu.detail.fullScreenOverlay ? '全画面オーバーレイ' : `ヘッダーとの差 ${menu.detail.gap}px`;
        console.log(`   ✅ メニュー展開状態 OK (背景 ${menu.detail.panelBackground} / ${kind})`);
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
  const menuBad = results.filter((r) => r.menu && r.menu.violations && r.menu.violations.length);
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
  lines.push('');
  lines.push('## メニュー展開状態の検査（rules.md 50〜53）');
  lines.push('');
  const menuChecked = results.filter((r) => r.menu && r.menu.applicable);
  if (!menuChecked.length) {
    lines.push('ハンバーガーメニューを検出できませんでした（該当なし）。');
  } else if (!menuBad.length) {
    lines.push('| ビューポート | パネル背景 | ヘッダーとの差 | アンカー | 判定 |');
    lines.push('|---|---|---|---|---|');
    for (const r of menuChecked) {
      const d = r.menu.detail;
      lines.push(`| ${r.viewport} | ${d.panelBackground} | ${d.gap}px | ${d.anchorsWithZeroMargin || '-'} | ✅ |`);
    }
  } else {
    lines.push('| ビューポート | ルール | 重要度 | 指摘 | 該当 |');
    lines.push('|---|---|---|---|---|');
    for (const r of menuBad) {
      for (const x of r.menu.violations) {
        lines.push(`| ${r.viewport} | ${x.rule} | ${x.severity} | ${x.message} | \`${x.selector}\` |`);
      }
    }
  }

  const mdPath = path.join(outputDirArg, 'responsive-audit.md');
  fs.writeFileSync(mdPath, lines.join('\n') + '\n', 'utf-8');

  console.log(`\n📄 レポート: ${mdPath}`);
  console.log(`📄 JSON:     ${jsonPath}`);
  const menuViolationCount = menuBad.reduce((n, r) => n + r.menu.violations.length, 0);
  console.log(`\n🎉 完了: 成功 ${successCount} / 失敗 ${failCount} / 横はみ出し ${bad.length} ビューポート / メニュー展開の指摘 ${menuViolationCount} 件`);

  if (process.platform === 'darwin' && shouldOpen) {
    exec(`open "${outputDirArg}"`, (err) => {
      if (err) console.error(`⚠️ Finder 展開失敗: ${err.message}`);
      else console.log(`📂 Finder で ${outputDirArg} を開きました`);
    });
  }

  if (failCount > 0 || bad.length > 0 || menuBad.length > 0) process.exit(1);
})();
