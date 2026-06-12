#!/usr/bin/env python3
"""
vault-compile — Knowledge/Raw/ 未整理資料から整理提案を生成
正本（Projects/Decisions/SOP/Lessons）は変更しない。
"""
import argparse
import os
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
from vault_secrets import detect_secrets

PROTECTED_DIRS = {"Projects", "Decisions", "SOP", "Lessons"}

CONCEPT_HEADERS = re.compile(r'^#{1,3}\s+(.{5,60})', re.MULTILINE)
DECISION_MARKERS = re.compile(
    r'(?i)(判断|決定|採用|却下|廃止|方針|ルール|決まった|確定)[：:]\s*(.{5,120})',
    re.MULTILINE,
)
LESSON_MARKERS = re.compile(
    r'(?i)(失敗|問題|再発防止|教訓|気づき|ミス|バグ|修正)[：:]\s*(.{5,120})',
    re.MULTILINE,
)
SOP_MARKERS = re.compile(
    r'(?i)(手順|ステップ|やり方|方法|フロー|プロセス)\s*[:：]?\s*(.{5,120})',
    re.MULTILINE,
)


def validate_file_arg(file_arg: str, vault: Path, raw_dir: Path) -> Path:
    """--file を解決し Raw/ 配下であることを確認する。違反は stderr + exit(1)。
    相対パスは `foo.md` と `Raw/foo.md` の両形式を受理する。"""
    p = Path(file_arg)
    if p.is_absolute():
        candidate = p.resolve()
    else:
        # "Raw/foo.md" と "foo.md" の両方を raw_dir/foo.md として解決する
        normalized = re.sub(r'^[Rr]aw[/\\]', '', file_arg)
        candidate = (raw_dir / normalized).resolve()

    if any(protected in candidate.parts for protected in PROTECTED_DIRS):
        print(f"ERROR: 正本ディレクトリは処理対象外です: {file_arg}", file=sys.stderr)
        sys.exit(1)

    try:
        candidate.relative_to(raw_dir)
    except ValueError:
        print(f"ERROR: --file は Raw/ 配下のファイルを指定してください: {file_arg}", file=sys.stderr)
        sys.exit(1)

    if candidate.is_symlink():
        real = Path(os.path.realpath(str(candidate)))
        try:
            real.relative_to(raw_dir)
        except ValueError:
            print(f"ERROR: シンボリックリンクによる Raw/ 外アクセスを拒否: {file_arg}", file=sys.stderr)
            sys.exit(1)

    if not candidate.is_file():
        print(f"ERROR: ファイルが見つかりません: {file_arg}", file=sys.stderr)
        sys.exit(1)

    return candidate


def extract_proposals(text: str, source_name: str, vault: Path) -> dict:
    concepts = [m.group(1).strip() for m in CONCEPT_HEADERS.finditer(text)][:10]
    decisions = [(m.group(1), m.group(2).strip()) for m in DECISION_MARKERS.finditer(text)][:5]
    lessons = [(m.group(1), m.group(2).strip()) for m in LESSON_MARKERS.finditer(text)][:5]
    sops = [(m.group(1), m.group(2).strip()) for m in SOP_MARKERS.finditer(text)][:5]

    existing_notes = {
        p.stem for p in vault.rglob("*.md")
        if not any(x in str(p) for x in [".obsidian", "Raw", "Reports"])
    }

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
        "---",
        "type: compile-proposal",
        f"source: Raw/{p['source']}",
        f"generated: {today}",
        "status: draft",
        "---",
        "",
        f"# 整理提案: {p['source']}",
        "",
        "> このファイルは提案です。正本（Decisions/SOP/Lessons/Projects）への反映は人間が判断してください。",
        f"> 出典: [[Raw/{p['source']}]]",
        "",
    ]

    if p["concepts"]:
        lines += ["## 概念候補", ""]
        for c in p["concepts"]:
            lines.append(f"- {fn(c)}")
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

    lines += ["---", "反映後はこのファイルを削除またはアーカイブしてください。"]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="vault-compile: Raw/ 資料から整理提案を生成")
    parser.add_argument("--vault", default="/Users/satouyuuichi/Developer/Knowledge")
    parser.add_argument("--file", default=None, help="特定ファイルのみ処理（省略時は Raw/ 全件）")
    parser.add_argument("--dry-run", action="store_true",
                        help="Reports/ への出力なし。提案を stdout に表示")
    args = parser.parse_args()

    vault = Path(args.vault).expanduser().resolve()
    raw_dir = vault / "Raw"
    if not raw_dir.exists():
        print(f"ERROR: Raw/ ディレクトリが見つかりません: {raw_dir}", file=sys.stderr)
        sys.exit(1)

    if args.file:
        targets = [validate_file_arg(args.file, vault, raw_dir)]
    else:
        targets = list(raw_dir.glob("*.md"))

    if not targets:
        print("[compile] Raw/ に処理対象ファイルがありません。", file=sys.stderr)
        sys.exit(0)

    today = date.today()
    proposals_dir = vault / "Reports" / "compile-proposals"

    processed = 0
    skipped = 0
    secret_skips = 0
    for target in targets:
        if not target.exists():
            print(f"[compile] SKIP (not found): {target.name}", file=sys.stderr)
            skipped += 1
            continue

        if any(protected in target.parts for protected in PROTECTED_DIRS):
            print(f"[compile] SKIP (protected): {target.name}", file=sys.stderr)
            skipped += 1
            continue

        text = target.read_text(encoding="utf-8", errors="ignore")
        cats = detect_secrets(text)
        if cats:
            # 本文は一切出力しない。ファイル名とカテゴリのみstderrへ
            print(f"[compile] SKIP (secret={','.join(cats)}): {target.name}", file=sys.stderr)
            secret_skips += 1
            skipped += 1
            continue

        proposal = extract_proposals(text, target.name, vault)
        content = format_proposal(proposal, today)

        if args.dry_run:
            print(content)
        else:
            proposals_dir.mkdir(parents=True, exist_ok=True)
            out = proposals_dir / f"{today}-{target.stem}.md"
            out.write_text(content, encoding="utf-8")
            print(f"[compile] 提案出力: {out.relative_to(vault)}", file=sys.stderr)
        processed += 1

    print(f"[compile] 完了: {processed}件処理, {skipped}件スキップ", file=sys.stderr)
    if secret_skips > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
