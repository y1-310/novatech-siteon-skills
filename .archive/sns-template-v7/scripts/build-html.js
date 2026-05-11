import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const ROOT_DIR      = path.join(__dirname, '..');

// setContent() は about:blank 基準のため相対CSSパスが解決できない → 起動時にインライン化
const BASE_CSS      = fs.readFileSync(path.join(TEMPLATES_DIR, 'base.css'), 'utf8');
const THEME_VARS_CSS = fs.readFileSync(path.join(TEMPLATES_DIR, 'theme-vars.css'), 'utf8');
const INLINE_CSS_BLOCK = `<style>\n${THEME_VARS_CSS}\n</style>\n<style>\n${BASE_CSS}\n</style>`;

const CTA_ICONS = {
  arrow: '→',
  bookmark: '🔖',
  message: '💬'
};

export function buildHTML(pageId, post) {
  // 背景写真モード：bg_imagesが指定されていればカードレイアウトを生成して返す
  const bgRelPath = post.meta.bg_images?.[pageId];
  if (bgRelPath) {
    return buildBgHTML(pageId, post, path.resolve(ROOT_DIR, bgRelPath));
  }

  const templatePath = path.join(TEMPLATES_DIR, `${pageId}.html`);
  let html = fs.readFileSync(templatePath, 'utf8');

  // 外部CSS参照をインラインに置換（setContent() では相対パスが解決されないため）
  html = html
    .replace('<link rel="stylesheet" href="theme-vars.css">', '')
    .replace('<link rel="stylesheet" href="base.css">', INLINE_CSS_BLOCK);

  const { template_id } = post.meta;
  const pageData = post.pages[pageId];

  // variant判定
  let variant;
  if (['T1', 'T2', 'T3'].includes(template_id)) variant = 'brand';
  else if (template_id === 'T11') variant = 'service';
  else variant = 'case';

  // 共通置換
  html = html.replaceAll('{{template_id}}', template_id);
  html = html.replaceAll('{{variant}}', variant);

  // ページ別の固有置換
  const bgTypo = post.pages.P1?.bg_typo || '';
  switch (pageId) {
    case 'P1':
      html = buildP1(html, pageData, variant);
      break;
    case 'P2':
      html = buildP2(html, pageData, variant, bgTypo);
      break;
    case 'P3':
      html = buildP3(html, pageData, variant, bgTypo);
      break;
    case 'P4':
      html = buildP4(html, pageData, variant);
      break;
  }

  return html;
}

function buildP1(html, p1, variant) {
  // hero_block（T4-T10のみ画像）
  let heroBlock = '';
  if (variant === 'case' && p1.hero_image) {
    heroBlock = `<img class="hero-image" src="${p1.hero_image}" alt="">
<div class="hero-overlay"></div>`;
  }

  // hook_block
  let hookBlock = '';
  if (variant === 'brand') {
    const hookNum = p1.hook_main ? `<div class="hook-num">${esc(p1.hook_main)}</div>` : '';
    hookBlock = `${hookNum}<h1 class="hook-title">${esc(p1.hook_title)}</h1>`;
  } else if (variant === 'case') {
    const bgTypo = p1.bg_typo ? `<div class="bg-typo">${esc(p1.bg_typo)}</div>` : '';
    hookBlock = `${bgTypo}<h1 class="hook-title">${esc(p1.hook_title)}</h1>`;
  } else if (variant === 'service') {
    hookBlock = `<div class="hook-price">9,800</div>
<div class="hook-price-unit">円 / 月</div>
<h1 class="hook-title">${esc(p1.hook_title)}</h1>`;
  }

  html = html.replaceAll('{{hero_block}}', heroBlock);
  html = html.replaceAll('{{hook_block}}', hookBlock);
  return html;
}

function buildP2(html, p2, variant, bgTypo) {
  // bg_typo_block
  let bgTypoBlock = '';
  if (variant === 'brand') {
    bgTypoBlock = '<div class="bg-typo">ISSUE</div>';
  } else if (variant === 'case' && bgTypo) {
    bgTypoBlock = `<div class="bg-typo">${esc(bgTypo)}</div>`;
  }
  html = html.replaceAll('{{bg_typo_block}}', bgTypoBlock);

  html = html.replaceAll('{{question}}', esc(p2.question));

  const painItems = p2.pain_points.map(point => `
    <li class="pain-item">
      <span class="pain-icon">—</span>
      <span class="pain-text">${esc(point)}</span>
    </li>`).join('');

  html = html.replaceAll('{{pain_items}}', painItems);
  return html;
}

function buildP3(html, p3, variant, bgTypo) {
  // bg_typo_block
  let bgTypoBlock = '';
  if (variant === 'brand') {
    bgTypoBlock = '<div class="bg-typo">POINT</div>';
  } else if (variant === 'case' && bgTypo) {
    bgTypoBlock = `<div class="bg-typo">${esc(bgTypo)}</div>`;
  }
  html = html.replaceAll('{{bg_typo_block}}', bgTypoBlock);

  html = html.replaceAll('{{heading}}', esc(p3.heading));

  let content = '';
  if (variant === 'brand') {
    // T1-T3: body_paragraphs
    const paragraphs = (p3.body_paragraphs || []).map(para =>
      `<p class="body-para">${esc(para)}</p>`
    ).join('');
    content = `<div class="body-paragraphs">${paragraphs}</div>`;
  } else if (variant === 'case') {
    // T4-T10: lighthouse scores + url + supplement
    const lh = p3.lighthouse_scores || {};
    const lhItems = [
      { score: lh.p, label: 'Performance' },
      { score: lh.a, label: 'Accessibility' },
      { score: lh.bp, label: 'Best Practices' },
      { score: lh.s, label: 'SEO' }
    ].map(item => `
      <div class="lh-item">
        <div class="lh-score">${item.score ?? '-'}</div>
        <div class="lh-label">${item.label}</div>
      </div>`).join('');

    const urlBlock = p3.demo_url_display
      ? `<div class="demo-url">${esc(p3.demo_url_display)}</div>` : '';
    const suppBlock = p3.supplement
      ? `<div class="supplement">${esc(p3.supplement)}</div>` : '';

    content = `<div class="lighthouse-grid">${lhItems}</div>${urlBlock}${suppBlock}`;
  } else if (variant === 'service') {
    // T11: features grid
    const featureItems = (p3.features || []).map(f => `
      <div class="feature-item">
        <span class="feature-check">✓</span>
        <div class="feature-body">
          <div class="feature-name">${esc(f.name)}</div>
          <div class="feature-desc">${esc(f.description)}</div>
        </div>
      </div>`).join('');
    content = `<div class="features-grid">${featureItems}</div>`;
  }

  html = html.replaceAll('{{p3_content}}', content);
  return html;
}

function buildP4(html, p4, variant) {
  html = html.replaceAll('{{summary_title}}', esc(p4.summary_title));
  html = html.replaceAll('{{next_preview}}', esc(p4.next_preview));

  // summary_sub（T4-T10のみ）
  const subBlock = p4.summary_sub
    ? `<div class="summary-sub">${esc(p4.summary_sub)}</div>` : '';
  html = html.replaceAll('{{summary_sub_block}}', subBlock);

  // CTA ブロック
  let ctaBlock = '';
  if (variant === 'service') {
    // T11: URLのみ
    const urlDisplay = p4.url_display || 'siteon.jp';
    const subText = p4.sub_text || 'プロフィールのリンクから';
    ctaBlock = `<div class="service-url">${esc(urlDisplay)}</div>
<div class="service-sub-text">${esc(subText)}</div>`;
  } else {
    // 通常CTA
    const icon = CTA_ICONS[p4.cta_icon] || '→';
    ctaBlock = `<div class="cta-button">
  <span class="cta-icon">${icon}</span>
  <span>${esc(p4.cta_text)}</span>
</div>`;
  }
  html = html.replaceAll('{{cta_block}}', ctaBlock);

  return html;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 背景写真モード ─────────────────────────────────────────────────────────
// setContent() は about:blank 起源のため file:// URL が読めない。
// 画像を base64 データURL に変換してHTMLに直接埋め込む。
function buildBgHTML(pageId, post, bgImagePath) {
  const { template_id } = post.meta;
  let variant;
  if (['T1', 'T2', 'T3'].includes(template_id)) variant = 'brand';
  else if (template_id === 'T11') variant = 'service';
  else variant = 'case';

  const pageData = post.pages[pageId];
  const PAGE_NUM = { P1: '1', P2: '2', P3: '3', P4: '4' };

  const imgBuffer = fs.readFileSync(bgImagePath);
  const ext = path.extname(bgImagePath).slice(1).toLowerCase();
  const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : 'image/png';
  const bgDataUrl = `data:${mime};base64,${imgBuffer.toString('base64')}`;

  let cardContent;
  switch (pageId) {
    case 'P1': cardContent = buildBgCardP1(pageData); break;
    case 'P2': cardContent = buildBgCardP2(pageData); break;
    case 'P3': cardContent = buildBgCardP3(pageData, variant); break;
    case 'P4': cardContent = buildBgCardP4(pageData, variant); break;
  }

  const bottomLogo = pageId === 'P4'
    ? `<div class="bg-logo bg-logo--full">NovaTech.</div>`
    : `<div class="bg-logo">NovaTech.</div>`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
${INLINE_CSS_BLOCK}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1080px; overflow: hidden; }
.canvas {
  width: 1080px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  background-image: url('${bgDataUrl}');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.15);
  pointer-events: none;
}
.text-card {
  position: relative;
  z-index: 1;
  width: 920px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 16px;
  padding: 52px 56px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
  display: flex;
  flex-direction: column;
}
.card-divider {
  width: 48px;
  height: 2px;
  background: var(--accent);
  margin: 28px 0;
  flex-shrink: 0;
}
.card-hook-num {
  font-family: var(--font-serif-en);
  font-size: 120px;
  color: var(--accent);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.card-hook-title {
  font-family: var(--font-serif-jp);
  font-size: 52px;
  font-weight: 700;
  color: var(--color-brand-charcoal);
  line-height: 1.4;
  word-break: keep-all;
}
.card-question {
  font-family: var(--font-serif-jp);
  font-size: 44px;
  font-weight: 700;
  color: var(--color-brand-charcoal);
  line-height: 1.4;
  word-break: keep-all;
}
.card-pain-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.card-pain-item {
  display: flex;
  align-items: center;
  gap: 16px;
}
.card-pain-icon {
  color: var(--accent);
  font-family: var(--font-serif-en);
  font-size: 24px;
  font-weight: 400;
  flex-shrink: 0;
}
.card-pain-text {
  font-family: var(--font-sans-jp);
  font-size: 34px;
  font-weight: 500;
  color: var(--color-brand-charcoal);
  line-height: 1.5;
  word-break: keep-all;
}
.card-heading {
  font-family: var(--font-serif-jp);
  font-size: 48px;
  font-weight: 700;
  color: var(--color-brand-charcoal);
  line-height: 1.3;
  word-break: keep-all;
}
.card-body-paras {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card-body-para {
  font-family: var(--font-sans-jp);
  font-size: 30px;
  font-weight: 400;
  color: var(--color-brand-charcoal);
  line-height: 1.7;
  word-break: keep-all;
}
.card-summary-title {
  font-family: var(--font-serif-jp);
  font-size: 52px;
  font-weight: 700;
  color: var(--color-brand-charcoal);
  line-height: 1.3;
  word-break: keep-all;
}
.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-sans-jp);
  font-size: 34px;
  font-weight: 700;
  padding: 28px 48px;
  border-radius: 8px;
  letter-spacing: 0.02em;
  align-self: flex-start;
}
.card-cta-icon { font-size: 28px; }
.card-next {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-sans-jp);
  font-size: 24px;
  font-weight: 400;
  color: var(--color-brand-charcoal);
  opacity: 0.65;
}
.card-next-label {
  font-family: var(--font-serif-en);
  font-size: 16px;
  color: var(--accent);
  letter-spacing: 0.08em;
  opacity: 1;
}
.bg-page-num {
  position: absolute;
  right: 48px;
  top: 48px;
  color: #fff;
  font-family: var(--font-serif-en);
  font-size: 22px;
  font-weight: 400;
  opacity: 0.9;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  z-index: 2;
}
.bg-logo {
  position: absolute;
  left: 48px;
  bottom: 48px;
  color: #fff;
  font-family: var(--font-serif-en);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.06em;
  opacity: 0.9;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  z-index: 2;
}
.bg-logo--full {
  left: auto;
  right: 48px;
  font-size: 36px;
}
</style>
</head>
<body data-template="${template_id}">
<div class="canvas">
  <div class="bg-overlay"></div>
  <div class="text-card">
${cardContent}
  </div>
  <div class="bg-page-num">${PAGE_NUM[pageId]}/4</div>
  ${bottomLogo}
</div>
</body>
</html>`;
}

function buildBgCardP1(p1) {
  const hookNum = p1.hook_main
    ? `<div class="card-hook-num">${esc(p1.hook_main)}</div>` : '';
  return `${hookNum}
    <h1 class="card-hook-title">${esc(p1.hook_title)}</h1>`;
}

function buildBgCardP2(p2) {
  const items = p2.pain_points.map(pt => `
      <li class="card-pain-item">
        <span class="card-pain-icon">—</span>
        <span class="card-pain-text">${esc(pt)}</span>
      </li>`).join('');
  return `    <h2 class="card-question">${esc(p2.question)}</h2>
    <div class="card-divider"></div>
    <ul class="card-pain-list">${items}
    </ul>`;
}

function buildBgCardP3(p3, variant) {
  let content = '';
  if (variant === 'brand') {
    const paras = (p3.body_paragraphs || [])
      .map(p => `<p class="card-body-para">${esc(p)}</p>`).join('');
    content = `<div class="card-body-paras">${paras}</div>`;
  } else if (variant === 'case') {
    const lh = p3.lighthouse_scores || {};
    const lhItems = [
      { score: lh.p, label: 'Performance' },
      { score: lh.a, label: 'Accessibility' },
      { score: lh.bp, label: 'Best Practices' },
      { score: lh.s, label: 'SEO' },
    ].map(item => `
      <div class="lh-item">
        <div class="lh-score">${item.score ?? '-'}</div>
        <div class="lh-label">${item.label}</div>
      </div>`).join('');
    content = `<div class="lighthouse-grid">${lhItems}</div>`;
  } else {
    const features = (p3.features || []).map(f => `
      <div class="feature-item">
        <span class="feature-check">✓</span>
        <div class="feature-body">
          <div class="feature-name">${esc(f.name)}</div>
          <div class="feature-desc">${esc(f.description)}</div>
        </div>
      </div>`).join('');
    content = `<div class="features-grid">${features}</div>`;
  }
  return `    <h2 class="card-heading">${esc(p3.heading)}</h2>
    <div class="card-divider"></div>
    ${content}`;
}

function buildBgCardP4(p4, variant) {
  const icon = CTA_ICONS[p4.cta_icon] || '→';
  const ctaHtml = variant === 'service'
    ? `<div style="font-family:var(--font-serif-en);font-size:80px;font-weight:400;color:var(--accent);line-height:1;margin-bottom:12px;">${esc(p4.url_display || 'siteon.jp')}</div>
    <div style="font-family:var(--font-sans-jp);font-size:28px;color:var(--color-brand-charcoal);opacity:0.7;">${esc(p4.sub_text || 'プロフィールのリンクから')}</div>`
    : `<div class="card-cta"><span class="card-cta-icon">${icon}</span><span>${esc(p4.cta_text)}</span></div>`;
  return `    <h2 class="card-summary-title">${esc(p4.summary_title)}</h2>
    <div class="card-divider"></div>
    ${ctaHtml}
    <div class="card-divider"></div>
    <div class="card-next">
      <span class="card-next-label">NEXT</span>
      <span>${esc(p4.next_preview)}</span>
    </div>`;
}
