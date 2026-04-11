#!/usr/bin/env bash
# NovaTech / SITEON — pre-commit フックインストーラー
#
# 使い方:
#   bash /Users/satouyuuichi/Developer/novatech-siteon-skills/tools/install-hooks.sh
#
# 対象: Developer/ 配下の novatech-siteon-client-* リポジトリ全て

set -euo pipefail

TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK_SRC="${TOOLS_DIR}/pre-commit"
DEV_DIR="/Users/satouyuuichi/Developer"

if [ ! -f "${HOOK_SRC}" ]; then
  echo "❌ pre-commit フックが見つかりません: ${HOOK_SRC}"
  exit 1
fi

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   NovaTech / SITEON — pre-commit フックインストーラー   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

INSTALLED=0
SKIPPED=0

# novatech-siteon-* のディレクトリを全て検索
for repo_dir in "${DEV_DIR}"/novatech-siteon-*/; do
  # .git ディレクトリが存在する場合のみ対象
  if [ ! -d "${repo_dir}.git" ]; then
    continue
  fi

  hook_dest="${repo_dir}.git/hooks/pre-commit"
  repo_name="$(basename "${repo_dir}")"

  if [ -f "${hook_dest}" ]; then
    # 既存フックが同じ内容なら上書きしない
    if diff -q "${HOOK_SRC}" "${hook_dest}" > /dev/null 2>&1; then
      echo "⏭️  ${repo_name} — 既に最新のフックがインストール済み"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
    echo "🔄 ${repo_name} — 既存フックを更新します"
  else
    echo "✅ ${repo_name} — フックをインストールします"
  fi

  cp "${HOOK_SRC}" "${hook_dest}"
  chmod +x "${hook_dest}"
  INSTALLED=$((INSTALLED + 1))
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "インストール完了: ${INSTALLED}件 / スキップ: ${SKIPPED}件"
echo ""
echo "これ以降、HTML を変更してコミットするたびに"
echo "qa-check.sh が自動実行されます。"
echo "❌ が出るとコミットがブロックされます。"
echo "════════════════════════════════════════════════════════════"
