import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../templates');

const CTA_ICONS = {
  arrow: '→',
  bookmark: '🔖',
  message: '💬'
};

export function buildHTML(pageId, post) {
  const templatePath = path.join(TEMPLATES_DIR, `${pageId}.html`);
  let html = fs.readFileSync(templatePath, 'utf8');

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
  switch (pageId) {
    case 'P1':
      html = buildP1(html, pageData, variant);
      break;
    case 'P2':
      html = buildP2(html, pageData);
      break;
    case 'P3':
      html = buildP3(html, pageData, variant);
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

function buildP2(html, p2) {
  html = html.replaceAll('{{question}}', esc(p2.question));

  const painItems = p2.pain_points.map(point => `
    <li class="pain-item">
      <div class="pain-dot"></div>
      <span class="pain-text">${esc(point)}</span>
    </li>`).join('');

  html = html.replaceAll('{{pain_items}}', painItems);
  return html;
}

function buildP3(html, p3, variant) {
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
        <div class="feature-name">${esc(f.name)}</div>
        <div class="feature-desc">${esc(f.description)}</div>
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
