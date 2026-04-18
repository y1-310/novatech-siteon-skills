#!/usr/bin/env node
/**
 * GitHub Pages 健全性チェック
 * 全 novatech-siteon-client-* リポの Custom Domain / https_enforced / SSL 証明書を検証し
 * 異常があれば Slack #alerts に通知する。
 *
 * 使い方（ローカル）:
 *   SLACK_BOT_TOKEN=xoxb-... GITHUB_TOKEN=ghp-... node tools/github-pages-health-check.js
 *
 * GitHub Actions からは環境変数を secrets 経由で渡す。
 */

import { execSync } from 'child_process';
import { createConnection } from 'net';

// ─── 設定 ────────────────────────────────────────────────────────────────────

const REPOS = [
  // y1-310 配下（本番）
  { owner: 'y1-310', repo: 'novatech-siteon-client-novatech', domain: 'siteon.jp' },
  // novatech-studio 配下（デモ）※ Custom Domain なしの場合はドメインを null に
  { owner: 'novatech-studio', repo: 'novatech-siteon-client-bloom',       domain: null },
  { owner: 'novatech-studio', repo: 'novatech-siteon-client-test-tomori', domain: null },
  { owner: 'novatech-studio', repo: 'novatech-siteon-client-test-mori',   domain: null },
  { owner: 'novatech-studio', repo: 'novatech-siteon-client-test-akari',  domain: null },
];

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL   = 'C0ATGHMPVMK'; // #sns-generation（alerts も同チャンネル）
const GITHUB_TOKEN    = process.env.GITHUB_TOKEN;

// ─── ユーティリティ ──────────────────────────────────────────────────────────

function ghApi(path) {
  try {
    const headers = GITHUB_TOKEN
      ? `-H "Authorization: Bearer ${GITHUB_TOKEN}"`
      : '';
    const out = execSync(`gh api ${path} ${headers} 2>&1`, { encoding: 'utf8' });
    return JSON.parse(out);
  } catch {
    return null;
  }
}

function httpsCheck(domain) {
  return new Promise((resolve) => {
    const sock = createConnection(443, domain);
    sock.setTimeout(5000);
    sock.on('connect', () => { sock.destroy(); resolve(true); });
    sock.on('error',   () => resolve(false));
    sock.on('timeout', () => { sock.destroy(); resolve(false); });
  });
}

async function slackPost(text) {
  if (!SLACK_BOT_TOKEN) {
    console.error('SLACK_BOT_TOKEN が未設定のため Slack 通知をスキップします');
    return;
  }
  const { default: fetch } = await import('node-fetch');
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel: SLACK_CHANNEL, text }),
  });
}

// ─── チェック本体 ────────────────────────────────────────────────────────────

async function checkRepo({ owner, repo, domain }) {
  const issues = [];
  const pages = ghApi(`repos/${owner}/${repo}/pages`);

  if (!pages) {
    return { repo, status: 'SKIP', note: 'Pages API 取得失敗（リポが private / Pages 未設定の可能性）' };
  }

  // 1. Custom Domain
  const cname = pages.cname ?? null;
  if (domain && cname !== domain) {
    issues.push(`Custom Domain が期待値と異なる: ${cname ?? '未設定'} ≠ ${domain}`);
  }

  // 2. https_enforced
  if (domain && pages.https_enforced !== true) {
    issues.push(`⚠️ https_enforced = false（SSL 証明書がワイルドカードになる可能性）`);
  }

  // 3. CNAME ファイル
  if (domain) {
    const cnameFile = ghApi(`repos/${owner}/${repo}/contents/CNAME`);
    if (!cnameFile) {
      issues.push('CNAME ファイルがリポジトリルートに存在しない');
    }
  }

  // 4. HTTPS 接続チェック（Custom Domain がある場合のみ）
  if (domain) {
    const reachable = await httpsCheck(domain);
    if (!reachable) {
      issues.push(`HTTPS 接続失敗: ${domain}:443 に到達できない`);
    }
  }

  const status = issues.length === 0 ? 'OK' : 'NG';
  return { repo: `${owner}/${repo}`, domain, status, issues };
}

// ─── メイン ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`=== GitHub Pages 健全性チェック 開始 (${new Date().toISOString()}) ===\n`);

  const results = await Promise.all(REPOS.map(checkRepo));

  const ngList = results.filter(r => r.status === 'NG');
  const okList = results.filter(r => r.status === 'OK');

  // コンソール出力
  for (const r of results) {
    const icon = r.status === 'OK' ? '✅' : r.status === 'SKIP' ? '⏭' : '❌';
    console.log(`${icon} ${r.repo}${r.domain ? ` (${r.domain})` : ''}`);
    for (const issue of r.issues ?? []) {
      console.log(`   └ ${issue}`);
    }
    if (r.note) console.log(`   └ ${r.note}`);
  }

  console.log(`\n結果: OK ${okList.length} / NG ${ngList.length} / 計 ${results.length}`);

  // Slack 通知
  if (ngList.length > 0) {
    const lines = ngList.map(r => {
      const issueText = r.issues.map(i => `  • ${i}`).join('\n');
      return `*❌ ${r.repo}* (${r.domain ?? 'no domain'})\n${issueText}`;
    }).join('\n\n');

    await slackPost(
      `🚨 *GitHub Pages 月次健全性チェック — 異常検出*\n\n${lines}\n\n` +
      `修復手順は \`rules.md\` カテゴリ15を参照してください。`
    );
    console.log('\nSlack #alerts に異常通知を送信しました。');
    process.exit(1);
  } else {
    await slackPost(
      `✅ *GitHub Pages 月次健全性チェック — 全サイト正常*\n` +
      `確認: ${okList.map(r => r.repo).join(' / ')}`
    );
    console.log('\nSlack に正常通知を送信しました。');
  }
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
