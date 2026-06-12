#!/usr/bin/env python3
"""
vault-compile — Knowledge/Raw/ 未整理資料から整理提案を生成
正本（Projects/Decisions/SOP/Lessons）は変更しない。
"""
import argparse
import re
import sys
from datetime import date
from pathlib import Path

SECRET_PATTERNS = re.compile(
    r'(?i)(api[_-]?key\s*[:=]\s*\S+|token\s*[:=]\s*[A-Za-z0-9+/]{20,}|'
    r'password\s*[:=]\s*\S+|bearer\s+[A-Za-z0-9\-._~+/]+=*|'
    r'sk-[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]+\.eyJ)',
    re.MULTILINE,
)

PROTECTED_DIRS = {"Projects", "Decisions", "SOP", "Lessons"}

# パターン: 概念・判断・手順・教訓のセクションヘッダー
CONCEPT_HEADERS = re.compile(
    r'^#{1,3}\s+(.{5,60})', re.MULTILINE
)
DECISION_MARKERS = re.compile(
    r'(?i)(判断|決定|採用|却下|廃止|方針|ルール|決まった|確定)[：:]\s*(.{5,120})',
    re.MULTILINE
)
LESSON_MARKERS = re.compile(
    r'(?i)(失敗|問題|再発防止|教訓|気づき|ミス|バグ|修正)[：:]\s*(.{5,120})',
    re.MULTILINE
)
SOP_MARKERS = re.compile(
    r'(?i)(手順|ステップ|やり方|方法|フロー|プロセス)\s*[:：]?\s*(.{5,120})',
    re.MULTILINE
)


def redact_secrets(text: str) -> tuple[str, list[str]]:
    """機密パターンを検出。含む場合は警告リストを返し、本文は返さない。"""
    warnings = []
    for m in SECRET_PATTERNS.finditer(text):
        snippet = m.group()[:20]
        warnings.append(f"機密パターン検出（{snippet[:10]}…）")
    return text, warnings


def extract_proposals(text: str, source_name: str, vault: Path) -> dict:
    """テキストから概念・判断・手順・教訓の候補を抽出する。"""
    concepts = [m.group(1).strip() for m in CONCEPT_HEADERS.finditer(text)][:10]
    decisions = [(m.group(1), m.group(2).strip()) for m in DECISION_MARKERS.finditer(text)][:5]
    lessons = [(m.group(1), m.group(2).strip()) for m in LESSON_MARKERS.finditer(text)][:5]
    sops = [(m.group(1), m.group(2).strip()) for m in SOP_MARKERS.finditer(text)][:5]

    # 既存ノートへのWikiリンク候補を探す
    existing_notes = {p.stem for p in vault.rglob("*.md")
                      if not any(x in str(p) for x in [".obsidian", "Raw", "Reports"])}

    def wikilink_if_exists(term: str) -> str:
        for stem in existing_notes:
            if term.lower() in stem.lower() or stem.lower() in term.lower():
                return f"[[{stem}]]"
        return term

    return {
        "source": source_name,
        "concepts": concepts,
        "decisions": decisions,
        "lessons": lessons,
        "sops": sops,
        "wikilink_fn": wikilink_if_exists,
    }


def format_proposal(p: dict, today: date) -> str:
    fn = p["wikilink_fn"]
    lines = [
        f"---",
        f"type: compile-proposal",
        f"source: Raw/{p['source']}",
        f"generated: {today}",
        f"status: draft",
        f"---",
        f"",
        f"# 整理提案: {p['source']}",
        f"",
        f"> このファイルは提案です。正本（Decisions/SOP/Lessons/Projects）への反映は人間が判断してください。",
        f"> 出典: [[Raw/{p['source']}]]",
        f"",
    ]

    if p["concepts"]:
        lines += ["## 概念候補", ""]
        for c in p["concepts"]:
            linked = fn(c)
            lines.append(f"- {linked}")
        lines.append("")

    if p["decisions"]:
        lines += ["## 判断候補 → [[Decisions/index]] へ", ""]
        for kind, content in p["decisions"]:
            lines.append(f"- **{kind}**: {content}")
        lines.append("")

    if p["sops"]:
        lines += ["## 手順候補 → [[SOP/index]] へ", ""]
        for kind, content in p["sops"]:
            lines.append(f"- **{kind}**: {content}")
        lines.append("")

    if p["lessons"]:
        lines += ["## 教訓候補 → [[Lessons/index]] へ", ""]
        for kind, content in p["lessons"]:
            lines.append(f"- **{kind}**: {content}")
        lines.append("")

    lines += [
        "---",
        "反映後はこのファイルを削除またはアーカイブしてください。",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="vault-compile: Raw/ 資料から整理提案を生成")
    parser.add_argument("--vault", default="/Users/satouyuuichi/Developer/Knowledge",
                        help="Vault ルートディレクトリ")
    parser.add_argument("--file", default=None,
                        help="特定ファイルのみ処理（省略時は Raw/ 全件）")
    args = parser.parse_args()

    vault = Path(args.vault).expanduser().resolve()
    raw_dir = vault / "Raw"
    if not raw_dir.exists():
        print(f"ERROR: Raw/ ディレクトリが見つかりません: {raw_dir}", file=sys.stderr)
        sys.exit(1)

    # 処理対象ファイル
    if args.file:
        targets = [vault / args.file]
    else:
        targets = list(raw_dir.glob("*.md"))

    if not targets:
        print("[compile] Raw/ に処理対象ファイルがありません。", file=sys.stderr)
        sys.exit(0)

    today = date.today()
    proposals_dir = vault / "Reports" / "compile-proposals"
    proposals_dir.mkdir(parents=True, exist_ok=True)

    processed = 0
    skipped = 0
    for target in targets:
        if not target.exists():
            print(f"[compile] SKIP (not found): {target}", file=sys.stderr)
            skipped += 1
            continue

        # 正本ディレクトリへの書き込みガード
        for protected in PROTECTED_DIRS:
            if protected in target.parts:
                print(f"[compile] SKIP (protected): {target}", file=sys.stderr)
                skipped += 1
                continue

        text = target.read_text(encoding="utf-8", errors="ignore")

        # 機密チェック
        _, warnings = redact_secrets(text)
        if warnings:
            for w in warnings:
                print(f"[compile] WARN: {target.name}: {w}", file=sys.stderr)
            print(f"[compile] SKIP (secret detected): {target.name}", file=sys.stderr)
            skipped += 1
            continue

        # 抽出・整形
        proposal = extract_proposals(text, target.name, vault)
        content = format_proposal(proposal, today)

        out = proposals_dir / f"{today}-{target.stem}.md"
        out.write_text(content, encoding="utf-8")
        print(f"[compile] 提案出力: {out.relative_to(vault)}", file=sys.stderr)
        processed += 1

    print(f"[compile] 完了: {processed}件処理, {skipped}件スキップ", file=sys.stderr)


if __name__ == "__main__":
    main()
