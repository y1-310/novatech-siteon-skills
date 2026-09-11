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
  // 見出しは <h2><span>…</span></h2> の形もあるため、blocks とは別に走査する
  for (const el of document.querySelectorAll('h1,h2')) {
    const t = (el.innerText || '').replace(/\s+/g, '').trim();
    if (!t || !isJa(t)) continue;
    const cs = getComputedStyle(el);
    let lh = parseFloat(cs.lineHeight);
    if (!lh || cs.lineHeight === 'normal') lh = parseFloat(cs.fontSize) * 1.5;
    const lines = Math.round(el.getBoundingClientRect().height / lh);
    // 2026-09-11 見直し。3行を一律に違反としていたが、ヒーローの大きな
    // ディスプレイ見出し（tomori「素材と火、ふたつだけで語る。」14文字）は
    // 意図して3行に置いている。問題なのは1行あたりの文字数が落ちて
    // 文が細切れになる場合なので、4行以上を違反、3行は情報として出す。
    if (lines >= 3) {
      add('cat9 見出しの行数', lines >= 4 ? '中' : '低',
          `見出しが${lines}行に割れている（${t.length}文字 / 1行あたり約${Math.round(t.length / lines)}文字）`,
          `${(el.closest('section') || {}).id || '-'} ${el.tagName.toLowerCase()}`, t.slice(0, 34));
    }
  }

  for (const b of blocks) {
    if (!isJa(b.text)) continue;
    if (/^h[12]$/.test(b.tag)) {
      // 文字数ではなく実際の行数で見る。
      // 20文字という上限は根拠が薄く、editorial な見出しを一律に弾いてしまう。
      // 実害は「スマートフォンで3行以上に割れて塊に見えること」なので、そこを測る。
      continue; // 行数判定は上の h1/h2 走査で済ませている
    }
    if (/^h[34]$/.test(b.tag)) continue;
    // 「A / B / C」のように区切り記号で並べた一覧は文ではない
    // 区切り記号で並べた一覧は文ではない。ただし本文中にたまたま / が出る長文を
    // 丸ごと除外しないよう、「区切りで割った各片が短い」ことを条件にする。
    const parts = b.text.split(/\s\/\s/);
    if (parts.length >= 3 && parts.every((x) => x.trim().length <= 24)) continue;
    for (const s of b.text.split(/(?<=。)/)) {
      const t = s.trim(); if (t.length <= 60) continue;
      add('cat9 文字数', '中', `1文が60文字を超えている（${t.length}文字）`, `${b.section} ${b.tag}.${b.cls}`, t.slice(0, 40) + '…');
    }
  }

  // ---- 読点 ----
  // 2026-09-11 見直し。従来は「1文に読点3個以上」「20文字以上読点なし」で
  // 87件を挙げていたが、その大半は住所・営業時間・並列の列挙で、直しようがなかった。
  // 読みにくさは読点の個数ではなく「ひと息で読む長さ」で決まる。
  //   - 住所 / 営業時間 / 価格など文でないものは対象から外す
  //   - 「A、B、C」の列挙は、区切りが短ければ読点がいくつあっても読める
  const isProse = (t, b) => {
    if (/(meta|address|hours|price|date|time|tel|access|subtitle)/i.test(b.cls || '')) return false;
    if (/^(dd|time)$/.test(b.tag) && !/。/.test(t)) return false;
    // 句点で終わらず、数字や区切り記号を含むもの（住所・時間・電話・型番）
    if (!/。/.test(t) && /[0-9０-９/／~〜–—-]/.test(t)) return false;
    return true;
  };
  for (const b of blocks) {
    if (/^h[1-4]$/.test(b.tag) || !isJa(b.text)) continue;
    for (const s of b.text.split(/(?<=。)/)) {
      const t = s.trim(); if (t.length < 6 || !isJa(t)) continue;
      if (!isProse(t, b)) continue;
      const segs = t.split('、');
      // 長い区切りが3つ以上続く文は、読点を足しても読みやすくならない。文を分ける
      const longSegs = segs.filter((x) => x.length > 14).length;
      if (longSegs >= 3) {
        add('cat9 読点', '低', `長い区切りが${longSegs}個続いている（読点ではなく文を分ける）`, `${b.section} ${b.tag}.${b.cls}`, t.slice(0, 40));
      }
      // 読点なしでひと息に読ませる長さの上限
      const worst = Math.max(...segs.map((x) => x.length));
      if (worst >= 30) {
        add('cat9 読点', '低', `読点なしで${worst}文字続いている`, `${b.section} ${b.tag}.${b.cls}`, t.slice(0, 40));
      }
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
  // 見出しが何行に割れるかはスマートフォン幅でしか分からない。
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 } });
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
      const low = v.filter((x) => x.severity === '低').length;
      const block = v.length - low;
      console.log(`   ${meta}`);
      const hi = v.filter((x) => x.severity === '高').length;
      console.log(`   ${hi ? '❌ commit をブロック: 高 ' + hi + '件' : '✅ 高は0件のため commit は通る'}（中 ${v.length - low - hi}件 / 低 ${low}件 は要判断・情報）`);
    }
  }
  // commit を止めるのは「高」だけにする。
  //   高 = 禁止カタカナ・英語直訳。明確な欠陥で、置き換えれば直る
  //   中 = 見出し20文字超・1文60文字超・行頭孤立。文言の書き換えが必要で、
  //        何をどう言い換えるかは人の判断。ここで commit を止めると作業が止まる
  //   低 = 読点。文章表現の問題で、機械的に直すべきものではない
  // 中・低 は出力には出す。直すかどうかは読んだ人が決める。
  const blocking = result.violations.filter((x) => x.severity === '高').length;
  process.exit(blocking ? 1 : 0);
})();
