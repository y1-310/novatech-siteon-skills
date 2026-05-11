import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../schemas/post.schema.json'), 'utf8')
);
const validate = ajv.compile(schema);

// 文字数上限チェック用定義
const limits = {
  'P1.hook_main': 5,
  'P1.hook_title': 15,
  'P2.question': 20,
  'P2.pain_points[]': 15,
  'P3.heading': 20,
  'P3.body_paragraphs.join': 120,
  'P3.supplement': 30,
  'P4.summary_title': 25,
  'P4.summary_sub': 20,
  'P4.cta_text': 10,
  'P4.next_preview': 20,
  'meta.next_preview': 20,
  'meta.caption': 2200
};

export function validatePost(post) {
  // JSONスキーマ検証
  const valid = validate(post);
  if (!valid) {
    throw new Error(`JSONスキーマ検証エラー:\n${JSON.stringify(validate.errors, null, 2)}`);
  }

  const { template_id, post_axis } = post.meta;
  const { P1, P2, P3, P4 } = post.pages;

  // テンプレ種別整合チェック
  if (['T1', 'T2', 'T3'].includes(template_id) && post_axis !== 'attraction_hint') {
    throw new Error(`T1-T3はpost_axis=attraction_hintのみ許可（現在: ${post_axis}）`);
  }
  if (['T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'].includes(template_id)) {
    if (post_axis !== 'case_study') {
      throw new Error(`T4-T10はpost_axis=case_studyのみ許可（現在: ${post_axis}）`);
    }
    if (!P1.hero_image) throw new Error(`T4-T10はP1.hero_image必須`);
    if (!P1.bg_typo) throw new Error(`T4-T10はP1.bg_typo必須`);
    if (!P3.lighthouse_scores) throw new Error(`T4-T10はP3.lighthouse_scores必須`);
    if (!P3.demo_url_display) throw new Error(`T4-T10はP3.demo_url_display必須`);
  }
  if (template_id === 'T11') {
    if (post_axis !== 'service_intro') {
      throw new Error(`T11はpost_axis=service_introのみ許可（現在: ${post_axis}）`);
    }
    if (!P3.features || P3.features.length === 0) throw new Error(`T11はP3.features必須`);
  }

  // 文字数チェック
  checkLength('P1.hook_title', P1.hook_title, limits['P1.hook_title']);
  if (P1.hook_main) checkLength('P1.hook_main', P1.hook_main, limits['P1.hook_main']);
  checkLength('P2.question', P2.question, limits['P2.question']);
  P2.pain_points.forEach((p, i) => checkLength(`P2.pain_points[${i}]`, p, limits['P2.pain_points[]']));
  checkLength('P3.heading', P3.heading, limits['P3.heading']);
  if (P3.body_paragraphs) {
    const total = P3.body_paragraphs.join('').length;
    if (total > limits['P3.body_paragraphs.join']) {
      throw new Error(`P3.body_paragraphs合計文字数オーバー: ${total}字（上限${limits['P3.body_paragraphs.join']}字）`);
    }
  }
  if (P3.supplement) checkLength('P3.supplement', P3.supplement, limits['P3.supplement']);
  checkLength('P4.summary_title', P4.summary_title, limits['P4.summary_title']);
  if (P4.summary_sub) checkLength('P4.summary_sub', P4.summary_sub, limits['P4.summary_sub']);
  checkLength('P4.cta_text', P4.cta_text, limits['P4.cta_text']);
  checkLength('P4.next_preview', P4.next_preview, limits['P4.next_preview']);
  checkLength('meta.next_preview', post.meta.next_preview, limits['meta.next_preview']);
  checkLength('meta.caption', post.meta.caption, limits['meta.caption']);

  return true;
}

function checkLength(field, value, max) {
  if (!value) return;
  if (value.length > max) {
    throw new Error(`${field}が文字数オーバー: ${value.length}字（上限${max}字）\n値: "${value}"`);
  }
}

// CLI実行時
if (process.argv[2]) {
  try {
    const post = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
    validatePost(post);
    console.log('✅ 検証成功');
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  }
}
