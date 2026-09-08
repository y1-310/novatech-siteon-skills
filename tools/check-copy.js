#!/usr/bin/env node
/**
 * 日本語コピー品質チェック — NovaTech / SITEON
 * rules.md カテゴリ9（15項目）のうち、機械判定できる項目を検査する。
 *
 * 追加理由:
 *   カテゴリ9は条項があるだけで自動検査が一つもなかった。
 *   2026-05-03「枠→余白」やカテゴリ5と同じく、検査がなければ守られない（lessons.md 9）。
 *
 * 判定基準の出典: _common/japanese-copy-guide.md
 *
 * 機械判定しない項目（主観・文脈依存のため人が見る）:
 *   - 文体レベル A/B/C が業態デフォルトに合っているか
 *   - 同じ主語の2回以上の繰り返し（主語判定が必要）
 *   - コンセプト文の具体性テスト
 *
 * 使い方: node check-copy.js <url|path/to/index.html> [--json]
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

function loadChromium() {
  const roots = [
    path.join(__dirname, '..', '.claude', 'skills', 'mobile-preview', 'node_modules'),
    path.join(__dirname, 'node_modules'), path.join(__dirname, '..', 'node_modules'),
  ];
  for (const r of roots) {
    try { return require(path.join(r, '@playwright/test')).chromium; } catch (e) {}
    try { return require(path.join(r, 'playwright')).chromium; } catch (e) {}
  }
  try { return require('@playwright/test').chromium; } catch (e) {}
  throw new Error('playwright が見つかりません。');
}

const AUDIT = function () {
  const v = [];
  const info = {};
  const add = (rule, severity, message, where, detail) => v.push({ rule, severity, message, where, detail });

  // 本文テキストを収集（script/style/noscript とデモ注記は除外）
  const skip = (el) => el.closest('script,style,noscript,template,.demo-notice') ||
                       /SateOnの制作イメージ|写真はイメージです/.test(el.textContent || '');
  // 日本語を含まないテキスト（英字の eyebrow / ブランド表記など）は
  // 文字数・読点ルールの対象外。ガイドは日本語コピーの基準を定めたもの。
  const isJa = (t) => /[぀-ヿ一-鿿]/.test(t);
  const blocks = [];
  for (const el of document.querySelectorAll('p,li,dd,h1,h2,h3,h4,figcaption,blockquote,span')) {
    if (skip(el)) continue;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join('');
    if (!own || own.length < 2) continue;
    const r = el.getBoundingClientRect(); if (r.width < 4) continue;
    blocks.push({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').split(' ')[0],
      text: own, section: (el.closest('section') || {}).id || '-', el });
  }
  info.blocks = blocks.length;
  const allText = blocks.map((b) => b.text).join('\n');
  info.chars = allText.length;

  // ---- 1文60文字 / 見出し20文字 ----
  for (const b of blocks) {
    if (!isJa(b.text)) continue;
    if (/^h[12]$/.test(b.tag)) {
      if (b.text.length > 20) add('cat9 文字数', '中', `見出しが20文字を超えている（${b.text.length}文字）`, `${b.section} ${b.tag}`, b.text.slice(0, 34));
      continue;
    }
    if (/^h[34]$/.test(b.tag)) continue;
    for (const s of b.text.split(/(?<=。)/)) {
      const t = s.trim(); if (t.length <= 60) continue;
      add('cat9 文字数', '中', `1文が60文字を超えている（${t.length}文字）`, `${b.section} ${b.tag}.${b.cls}`, t.slice(0, 40) + '…');
    }
  }

  // ---- 読点: 20文字以上読点なし / 1文に読点3個以上 ----
  for (const b of blocks) {
    if (/^h[1-4]$/.test(b.tag) || !isJa(b.text)) continue;
    for (const s of b.text.split(/(?<=。)/)) {
      const t = s.trim(); if (t.length < 6 || !isJa(t)) continue;
      const commas = (t.match(/、/g) || []).length;
      // guide 15章: 1文に読点は最大2つ。3つ以上入るなら文を分割する
      if (commas >= 3) add('cat9 読点', '低', `1文に読点が${commas}個ある（最大2つ。3つ以上なら文を分割する）`, `${b.section} ${b.tag}.${b.cls}`, t.slice(0, 40));
      // guide 15章: 20文字以上続いたら読点を打つ
      if (t.length >= 20 && commas === 0) add('cat9 読点', '低', `${t.length}文字の文に読点がない`, `${b.section} ${b.tag}.${b.cls}`, t.slice(0, 40));
    }
  }

  // ---- 文末表現の混在（ですます / である）: セクション単位 ----
  const bySection = {};
  for (const b of blocks) {
    if (/^h[1-4]$/.test(b.tag)) continue;
    (bySection[b.section] = bySection[b.section] || []).push(b.text);
  }
  for (const [sec, arr] of Object.entries(bySection)) {
    const joined = arr.join('');
    const desumasu = (joined.match(/(です|ます)。/g) || []).length;
    const dearu = (joined.match(/(である|だ)。/g) || []).length;
    if (desumasu >= 2 && dearu >= 2) {
      add('cat9 文体', '中', `同一セクション内で「ですます」と「である」が混在（${desumasu} / ${dearu}）`, sec, '-');
    }
  }

  // ---- 「〜的」が1文に2回以上 ----
  for (const b of blocks) {
    if (!isJa(b.text)) continue;
    for (const s of b.text.split(/(?<=。)/)) {
      const n = (s.match(/的/g) || []).length;
      if (n >= 2) add('cat9 表現', '低', `1文に「的」が${n}回ある`, `${b.section} ${b.tag}.${b.cls}`, s.trim().slice(0, 36));
    }
  }

  // ---- 接続詞の連続（文頭） ----
  const sentences = allText.split(/(?<=。)|\n/).map((s) => s.trim()).filter(Boolean);
  const CONJ = /^(また|さらに|そして|しかし|つまり)/;
  for (let i = 1; i < sentences.length; i++) {
    if (CONJ.test(sentences[i]) && CONJ.test(sentences[i - 1])) {
      add('cat9 表現', '低', '接続詞で始まる文が連続している', '-', sentences[i - 1].slice(0, 18) + ' → ' + sentences[i].slice(0, 18));
    }
  }

  // ---- 誇張語が1ページ2回以上 ----
  for (const w of ['最高', '究極', '完璧']) {
    const n = (allText.match(new RegExp(w, 'g')) || []).length;
    if (n >= 2) add('cat9 誇張', '中', `誇張語「${w}」が${n}回使われている（1ページ2回以上は禁止）`, '-', '-');
  }

  // ---- 「させていただく」が1ページ3回以上 ----
  const sasete = (allText.match(/させていただ/g) || []).length;
  info.saseteitadaku = sasete;
  if (sasete >= 3) add('cat9 表現', '中', `「させていただく」が${sasete}回使われている（3回以上は禁止）`, '-', '-');

  // ---- 英語直訳パターン ----
  const TRANSLATIONESE = ['次のレベル', 'ソリューションを提供', '価値を提供し', 'お客様第一主義',
    '〜にコミット', 'ワンストップで提供', 'トータルでサポートいたします'];
  for (const w of TRANSLATIONESE) {
    if (allText.includes(w)) add('cat9 表現', '中', `英語直訳パターン「${w}」が使われている`, '-', '-');
  }

  // ---- 漢字ひらがな基準（固有名詞と衝突しない語のみ）----
  // 「御 / 事 / 物 / 為 / 等 / 様」は事務所・食事・建物・行為・等々・様子 等と衝突するため対象外。
  const KANJI = [['下さい', 'ください'], ['致します', 'いたします'], ['全て', 'すべて'],
    ['於いて', 'おいて'], ['出来る', 'できる'], ['出来ます', 'できます'], ['頂く', 'いただく'],
    ['頂き', 'いただき'], ['更に', 'さらに'], ['是非', 'ぜひ'], ['宜しく', 'よろしく'],
    ['沢山', 'たくさん'], ['有難う', 'ありがとう'], ['何時も', 'いつも']];
  for (const [ng, ok] of KANJI) {
    const n = (allText.split(ng).length - 1);
    if (n) add('cat9 表記', '中', `「${ng}」は「${ok}」と書く（${n}箇所）`, '-', ok);
  }

  // ---- 禁止カタカナ ----
  const NGKATA = ['ソリューション', 'オプティマイズ', 'コンバージョン', 'エンゲージメント',
    'プラットフォーム', 'アジャイル', 'イノベーション', 'シナジー', 'エクスペリエンス',
    'パーソナライズ', 'エンパワー', 'ジャーニー'];
  for (const w of NGKATA) {
    const n = (allText.split(w).length - 1);
    if (n) add('cat9 表記', '高', `禁止カタカナ「${w}」が使われている（${n}箇所）`, '-', '-');
  }

  // ---- word-break: keep-all が見出しに設定されているか ----
  // h1/h2 のみを対象にする。h3 以下はグリッド内の小見出しが多く、keep-all を当てると
  // 320px で溢れる（mori 実測 294px > 288px）。break-word は min-content 幅を縮めないため
  // 回避できない。h3 の禁則は line-break: strict で担保する。
  const heads = [...document.querySelectorAll('h1,h2')].filter((e) => (e.innerText || '').trim());
  const noKeepAll = heads.filter((e) => getComputedStyle(e).wordBreak !== 'keep-all');
  info.headings = heads.length;
  info.h3WithoutKeepAll = [...document.querySelectorAll('h3')]
    .filter((e) => (e.innerText || '').trim() && getComputedStyle(e).wordBreak !== 'keep-all').length;
  if (noKeepAll.length) {
    add('cat9 改行', '中', `h1/h2 に word-break: keep-all が設定されていない（${noKeepAll.length}/${heads.length}件）`,
      noKeepAll[0].tagName.toLowerCase(), (noKeepAll[0].innerText || '').trim().slice(0, 24));
  }
  // 禁則処理が効いているか
  if (getComputedStyle(document.body).lineBreak !== 'strict') {
    add('cat9 改行', '中', 'body に line-break: strict が設定されていない。長音符や促音が行頭に孤立する', 'body', '-');
  }

  // ---- 行頭禁則（長音符・拗促音・句読点・閉じ括弧の孤立）----
  const FORBIDDEN = 'ーぁぃぅぇぉっゃゅょァィゥェォッャュョ、。，．）］｝」』〉》〕！？';
  for (const b of blocks.slice(0, 400)) {
    const tn = [...b.el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!tn || tn.length < 4) continue;
    const rg = document.createRange(); let prev = null;
    for (let i = 0; i < tn.length; i++) {
      rg.setStart(tn, i); rg.setEnd(tn, i + 1);
      const top = Math.round(rg.getBoundingClientRect().top);
      if (prev !== null && top !== prev && FORBIDDEN.includes(tn.data[i])) {
        add('cat9 改行', '中', `行頭に「${tn.data[i]}」が孤立している`, `${b.section} ${b.tag}.${b.cls}`, b.text.slice(0, 28));
        break;
      }
      prev = top;
    }
  }
  return { violations: v, info };
};

(async () => {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) { console.error('使い方: node check-copy.js <url|path/to/index.html> [--json]'); process.exit(2); }
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
    await page.evaluate(async () => { await new Promise((r) => { let y = 0; const t = setInterval(() => {
      window.scrollBy(0, 600); y += 600;
      if (y >= document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); setTimeout(r, 300); } }, 25); }); });
    await page.addStyleTag({ content: '[class*="fade"],[class*="reveal"],[class*="animate"],.is-hidden{opacity:1!important;transform:none!important}' });
    await page.waitForTimeout(300);
    result = await page.evaluate(AUDIT);
  } finally { await browser.close(); }

  if (args.includes('--json')) console.log(JSON.stringify({ target: url, ...result }, null, 2));
  else {
    const v = result.violations; const order = { 高: 0, 中: 1, 低: 2 };
    v.sort((a, b) => order[a.severity] - order[b.severity]);
    const meta = `(本文 ${result.info.chars}文字 / 見出し ${result.info.headings}件 / させていただく ${result.info.saseteitadaku}回)`;
    if (!v.length) console.log(`✅ ${label} — 日本語コピーチェック: 問題なし  ${meta}`);
    else {
      console.log(`❌ ${label} — 日本語コピーチェック: ${v.length}件`);
      for (const x of v.slice(0, 40)) console.log(`   [${x.severity}] ${x.rule}  ${x.message}\n        ${x.where}  ${x.detail}`);
      if (v.length > 40) console.log(`   … 他 ${v.length - 40}件`);
      console.log(`   ${meta}`);
    }
  }
  process.exit(result.violations.length ? 1 : 0);
})();
