#!/usr/bin/env bash
# QA全チェック — NovaTech / SITEON
# 3つのチェックスクリプトを一括実行する
#
# 使い方:
#   bash qa-check.sh path/to/index.html
#   bash qa-check.sh path/to/site/
#   bash qa-check.sh           # カレントディレクトリ

set -euo pipefail

TARGET="${1:-.}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PASS=0
FAIL=0

run_check() {
    local name="$1"
    local script="$2"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 ${name}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if python3 "${TOOLS_DIR}/${script}" "${TARGET}"; then
        PASS=$((PASS + 1))
    else
        FAIL=$((FAIL + 1))
    fi
}

echo "╔══════════════════════════════════════════════════════════╗"
echo "║         NovaTech / SITEON QA チェック                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo "対象: ${TARGET}"

run_check "① 画像URL疎通確認（404チェック）" "check-images.py"
run_check "② 人物写真Unsplash使用チェック" "check-persons.py"
run_check "③ ナビゲーション日本語チェック" "check-nav.py"
run_check "④ CSSレイアウトチェック（img寸法・align-items・max-height）" "check-layout.py"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "QA結果サマリー: ${PASS}件通過 / $((PASS + FAIL))件中"
echo "════════════════════════════════════════════════════════════"

if [ "${FAIL}" -gt 0 ]; then
    echo "❌ ${FAIL}件の問題が検出されました。修正してから commit してください。"
    exit 1
else
    echo "✅ 全チェック通過。デプロイ可能です。"
    exit 0
fi
