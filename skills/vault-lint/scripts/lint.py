#!/usr/bin/env python3
"""
vault-lint — Knowledge Vault 品質検査スクリプト
検査のみ。ファイルの修正・削除・統合は行わない。
"""
import argparse
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Dict, List

SECRET_PATTERNS = re.compile(
    r'(?i)(api[_-]?key\s*[:=]\s*\S+|token\s*[:=]\s*[A-Za-z0-9+/]{20,}|'
    r'password\s*[:=]\s*\S+|bearer\s+[A-Za-z0-9\-._~+/]+=*|'
    r'sk-[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]+\.eyJ)',
    re.MULTILINE,
)
TASK_PATTERNS = re.compile(
    r'(^- \[[ x]\]|担当\s*[:：]|期限\s*[:：]|完了日\s*[:：]|due\s*[:：])', re.MULTILINE
)
WIKILINK_PATTERN = re.compile(r'\[\[([^\]|#]+?)(?:[|#][^\]]*)?\]\]')
EVIDENCE_PATTERN = re.compile(
    r'(commit\s+[a-f0-9]{5,}|https?://|/[A-Za-z][\w/.-]+\.(md|js|py|json)|`[^`]+`)'
)

PRIORITY = {"HIGH": 1, "MEDIUM": 2, "LOW": 3}


def find_all_notes(vault: Path) -> List[Path]:
    skip = {".obsidian", ".git", "Reports", "Archive"}
    return [
        p for p in vault.rglob("*.md")
        if not any(part in skip for part in p.parts)
    ]


def resolve_wikilink(target: str, vault: Path) -> bool:
    """Return True if the wikilink target resolves to an existing file."""
    clean = target.strip().replace("\\", "/")
    # Try exact match relative to vault
    candidates = [
        vault / (clean + ".md"),
        vault / clean,
    ] + list(vault.rglob(f"{Path(clean).name}.md"))
    return any(c.exists() for c in candidates)


def check_broken_links(notes: List[Path], vault: Path) -> List[dict]:
    issues = []
    for note in notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        for m in WIKILINK_PATTERN.finditer(text):
            target = m.group(1)
            if not resolve_wikilink(target, vault):
                issues.append({
                    "id": "L1", "priority": "MEDIUM",
                    "file": str(note.relative_to(vault)),
                    "detail": f"壊れたリンク: [[{target}]]",
                })
    return issues


def check_orphans(notes: List[Path], vault: Path) -> List[dict]:
    linked = set()
    for note in notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        for m in WIKILINK_PATTERN.finditer(text):
            linked.add(m.group(1).strip().lower())
    issues = []
    skip_names = {"ai_index", "index", "readme"}
    for note in notes:
        stem = note.stem.lower()
        if stem in skip_names:
            continue
        rel = str(note.relative_to(vault).with_suffix("")).replace("\\", "/").lower()
        is_linked = any(
            target.lower() in (stem, rel, rel.split("/")[-1])
            for target in linked
        )
        if not is_linked:
            issues.append({
                "id": "L2", "priority": "LOW",
                "file": str(note.relative_to(vault)),
                "detail": "孤立ノート: 他のノートからリンクされていない",
            })
    return issues


def check_duplicates(notes: List[Path], vault: Path) -> List[dict]:
    from collections import defaultdict
    by_stem = defaultdict(list)
    for note in notes:
        by_stem[note.stem.lower()].append(note)
    issues = []
    for stem, paths in by_stem.items():
        if len(paths) > 1:
            files = ", ".join(str(p.relative_to(vault)) for p in paths)
            issues.append({
                "id": "L3", "priority": "LOW",
                "file": files,
                "detail": f"重複候補: ファイル名が同一 ({stem})",
            })
    return issues


def check_current_md(notes: List[Path], vault: Path, today: date) -> List[dict]:
    issues = []
    current_notes = [n for n in notes if n.stem.lower() == "current"]
    for note in current_notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        rel = str(note.relative_to(vault))

        # L4: 14日以上未確認
        mtime = datetime.fromtimestamp(note.stat().st_mtime).date()
        age = (today - mtime).days
        # Also look for explicit date in text
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})', text)
        if date_match:
            try:
                explicit_date = date.fromisoformat(date_match.group(1))
                age = (today - explicit_date).days
            except ValueError:
                pass
        if age > 14:
            issues.append({
                "id": "L4", "priority": "HIGH",
                "file": rel,
                "detail": f"古い current.md: {age}日前が最終確認",
            })

        # L5: 根拠なし
        if not EVIDENCE_PATTERN.search(text):
            issues.append({
                "id": "L5", "priority": "MEDIUM",
                "file": rel,
                "detail": "根拠なし current.md: commit/ファイル/URL の根拠記述がない",
            })

        # L6: タスク混入
        task_m = TASK_PATTERNS.search(text)
        if task_m:
            issues.append({
                "id": "L6", "priority": "HIGH",
                "file": rel,
                "detail": f"タスク混入: current.md にタスク/担当/期限記述 ({task_m.group().strip()[:40]})",
            })
    return issues


def check_secrets(notes: List[Path], vault: Path) -> List[dict]:
    issues = []
    for note in notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        m = SECRET_PATTERNS.search(text)
        if m:
            snippet = m.group()[:30].replace("\n", " ")
            issues.append({
                "id": "L8", "priority": "HIGH",
                "file": str(note.relative_to(vault)),
                "detail": f"機密らしき記述を検出（内容は出力しない）: パターン一致 [{snippet[:15]}…]",
            })
    return issues


def check_contradictions(notes: List[Path], vault: Path) -> List[dict]:
    """シンプルな矛盾チェック: 同一キーワードに対して異なる値が複数ノートに存在するか"""
    issues = []
    col_pattern = re.compile(r'(\d+)列')
    col_claims = {}
    for note in notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        for m in col_pattern.finditer(text):
            val = int(m.group(1))
            if 10 <= val <= 60:
                rel = str(note.relative_to(vault))
                col_claims.setdefault(val, []).append(rel)
    all_files = {}
    for val, files in col_claims.items():
        for f in files:
            all_files.setdefault(f, set()).add(val)
    for f, vals in all_files.items():
        if len(vals) > 1 and not (33 in vals):  # 33列ルールは正常
            issues.append({
                "id": "L7", "priority": "LOW",
                "file": f,
                "detail": f"矛盾候補: 同一ファイルに複数の列数記述 {sorted(vals)}",
            })
    return issues


def top3(issues: List[dict]) -> List[dict]:
    return sorted(issues, key=lambda x: PRIORITY.get(x["priority"], 9))[:3]


def format_report(all_issues: List[dict], today: date, vault: Path, dry_run: bool) -> str:
    top = top3(all_issues)
    lines = [
        f"# vault-lint レポート {today}",
        "",
        f"検査日: {today}  Vault: {vault}",
        f"検出件数: {len(all_issues)}  (HIGH={sum(1 for i in all_issues if i['priority']=='HIGH')}  "
        f"MEDIUM={sum(1 for i in all_issues if i['priority']=='MEDIUM')}  "
        f"LOW={sum(1 for i in all_issues if i['priority']=='LOW')})",
        "",
        "## 要対応（優先度上位3件）",
        "",
    ]
    if top:
        for i, issue in enumerate(top, 1):
            lines.append(f"{i}. [{issue['priority']}] [{issue['id']}] {issue['file']}")
            lines.append(f"   {issue['detail']}")
            lines.append("")
    else:
        lines.append("問題なし")
        lines.append("")

    for priority in ["HIGH", "MEDIUM", "LOW"]:
        grp = [x for x in all_issues if x["priority"] == priority]
        if not grp:
            continue
        lines.append(f"## {priority} ({len(grp)}件)")
        lines.append("")
        for issue in grp:
            lines.append(f"- [{issue['id']}] `{issue['file']}`")
            lines.append(f"  {issue['detail']}")
        lines.append("")

    lines += [
        "---",
        "自動修正・削除・統合は行っていない。修正の判断は人間が行うこと。",
        "機密情報の詳細はこのファイルへ出力していない。",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="vault-lint: Knowledge Vault 品質検査")
    parser.add_argument("--vault", default="/Users/satouyuuichi/Developer/Knowledge",
                        help="Vault ルートディレクトリ")
    parser.add_argument("--dry-run", action="store_true",
                        help="Reports/ への出力なし。結果を stdout に表示")
    args = parser.parse_args()

    vault = Path(args.vault).expanduser().resolve()
    if not vault.exists():
        print(f"ERROR: Vault が見つかりません: {vault}", file=sys.stderr)
        sys.exit(1)

    today = date.today()
    notes = find_all_notes(vault)
    print(f"[lint] {len(notes)} ノートを検査中...", file=sys.stderr)

    all_issues = []
    all_issues += check_broken_links(notes, vault)
    all_issues += check_orphans(notes, vault)
    all_issues += check_duplicates(notes, vault)
    all_issues += check_current_md(notes, vault, today)
    all_issues += check_secrets(notes, vault)
    all_issues += check_contradictions(notes, vault)

    report = format_report(all_issues, today, vault, args.dry_run)

    if args.dry_run:
        print(report)
    else:
        reports_dir = vault / "Reports"
        reports_dir.mkdir(exist_ok=True)
        out = reports_dir / f"vault-lint-{today}.md"
        out.write_text(report, encoding="utf-8")
        print(f"[lint] レポート出力: {out}", file=sys.stderr)
        print(report)

    high_count = sum(1 for i in all_issues if i["priority"] == "HIGH")
    sys.exit(1 if high_count > 0 else 0)


if __name__ == "__main__":
    main()
