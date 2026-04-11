#!/usr/bin/env bash
# NovaTech / SITEON — pre-commit フックインストーラー
#
# 使い方:
#   bash /Users/satouyuuichi/Developer/novatech-siteon-skills/tools/install-hooks.sh
#
# 対象: Developer/ 配下の novatech-siteon-client-* リポジトリ全て

set -euo pipefail

TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$(dirname "${TOOLS_DIR}")"
HOOK_SRC="${TOOLS_DIR}/pre-commit"
CURSORRULES_SRC="${SKILLS_DIR}/.cursorrules"
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

  # pre-commit フックのインストール
  if [ -f "${hook_dest}" ] && diff -q "${HOOK_SRC}" "${hook_dest}" > /dev/null 2>&1; then
    echo "⏭️  ${repo_name} — フックは最新"
    SKIPPED=$((SKIPPED + 1))
  else
    [ -f "${hook_dest}" ] && echo "🔄 ${repo_name} — フックを更新" || echo "✅ ${repo_name} — フックをインストール"
    cp "${HOOK_SRC}" "${hook_dest}"
    chmod +x "${hook_dest}"
    INSTALLED=$((INSTALLED + 1))
  fi

  # .cursorrules のコピー（client リポジトリのみ・フックの状態に関わらず実行）
  if [[ "${repo_name}" == novatech-siteon-client-* ]]; then
    cursorrules_dest="${repo_dir}.cursorrules"
    if [ ! -f "${cursorrules_dest}" ] || ! diff -q "${CURSORRULES_SRC}" "${cursorrules_dest}" > /dev/null 2>&1; then
      cp "${CURSORRULES_SRC}" "${cursorrules_dest}"
      echo "   └─ .cursorrules をコピーしました"
    fi
  fi
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "インストール完了: ${INSTALLED}件 / スキップ: ${SKIPPED}件"
echo ""
echo "これ以降、HTML を変更してコミットするたびに"
echo "qa-check.sh が自動実行されます。"
echo "❌ が出るとコミットがブロックされます。"
echo "════════════════════════════════════════════════════════════"
