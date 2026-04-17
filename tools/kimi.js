#!/usr/bin/env node
/**
 * Kimi K2.5 CLI ツール
 * 使い方:
 *   node tools/kimi.js "プロンプト"
 *   node tools/kimi.js --instant "高速モードで質問"
 *   node tools/kimi.js --file data.json "このデータを分析して"
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai').default || require('openai');

// ─── 設定 ────────────────────────────────────────────────
const SHARED_CONTEXT_PATH = path.join(__dirname, '../.claude/shared-context.md');
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;
const BASE_URL = 'https://api.moonshot.ai/v1';

// ─── 引数パース ───────────────────────────────────────────
function parseArgs(argv) {
  const args = argv.slice(2);
  let instant = false;
  let filePath = null;
  const promptParts = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--instant') {
      instant = true;
    } else if (args[i] === '--file' && args[i + 1]) {
      filePath = args[++i];
    } else {
      promptParts.push(args[i]);
    }
  }

  return { instant, filePath, prompt: promptParts.join(' ') };
}

// ─── メイン ───────────────────────────────────────────────
async function main() {
  // API キー確認
  if (!MOONSHOT_API_KEY) {
    console.error('❌ エラー: 環境変数 MOONSHOT_API_KEY が設定されていません。');
    console.error('   export MOONSHOT_API_KEY="your-key" を実行してください。');
    process.exit(1);
  }

  const { instant, filePath, prompt } = parseArgs(process.argv);

  if (!prompt) {
    console.error('❌ エラー: プロンプトを指定してください。');
    console.error('   使い方: node tools/kimi.js "質問内容"');
    console.error('   オプション: --instant（高速モード）, --file <path>（ファイル添付）');
    process.exit(1);
  }

  // shared-context.md 読み込み
  let systemPrompt = '';
  if (fs.existsSync(SHARED_CONTEXT_PATH)) {
    systemPrompt = fs.readFileSync(SHARED_CONTEXT_PATH, 'utf-8');
  } else {
    console.warn('⚠️  shared-context.md が見つかりません。システムプロンプトなしで実行します。');
  }

  // --file オプション処理
  let userContent = prompt;
  if (filePath) {
    const absPath = path.resolve(filePath);
    if (!fs.existsSync(absPath)) {
      console.error(`❌ エラー: ファイルが見つかりません: ${absPath}`);
      process.exit(1);
    }
    const fileContent = fs.readFileSync(absPath, 'utf-8');
    userContent = `【添付ファイル: ${path.basename(absPath)}】\n\`\`\`\n${fileContent}\n\`\`\`\n\n${prompt}`;
  }

  // モデル選択
  const model = instant ? 'kimi-k2.5' : 'kimi-k2.5';
  const mode = instant ? '⚡ Instant' : '🧠 Thinking';
  console.error(`${mode} モードで実行中...`);

  // API クライアント初期化
  const client = new OpenAI({
    apiKey: MOONSHOT_API_KEY,
    baseURL: BASE_URL,
  });

  // メッセージ構築
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: userContent });

  // API 呼び出し（ストリーミング）
  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
      ...(instant ? {} : { thinking: { type: 'enabled', budget_tokens: 8000 } }),
    });

    let hasContent = false;
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        if (!hasContent) {
          hasContent = true;
          console.error(''); // 改行でモード表示と分離
        }
        process.stdout.write(delta.content);
      }
    }
    if (hasContent) process.stdout.write('\n');

  } catch (err) {
    if (err.status === 401) {
      console.error('\n❌ 認証エラー: MOONSHOT_API_KEY が無効です。');
    } else if (err.status === 429) {
      console.error('\n❌ レート制限: しばらく待ってから再試行してください。');
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      console.error('\n❌ 接続エラー: ネットワークを確認してください。');
    } else {
      console.error(`\n❌ エラー: ${err.message || err}`);
    }
    process.exit(1);
  }
}

main();
