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

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
from vault_secrets import detect_secrets

TASK_PATTERNS = re.compile(
    r'(^- \[[ x]\]|担当\s*[:：]|期限\s*[:：]|完了日\s*[:：]|due\s*[:：])', re.MULTILINE
)
WIKILINK_PATTERN = re.compile(r'\[\[([^\]|#]+?)(?:[|#][^\]]*)?\]\]')
EVIDENCE_PATTERN = re.compile(
    r'(commit\s+[a-f0-9]{5,}|https?://|/[A-Za-z][\w/.-]+\.(md|js|py|json)|`[^`]+`)'
)
_LAST_UPDATED_RE = re.compile(
    r'(?:最終更新|最終確認)\s*[：:]\s*(\d{4}-\d{2}-\d{2})',
    re.MULTILINE,
)

PRIORITY = {"HIGH": 1, "MEDIUM": 2, "LOW": 3}
_STRUCTURAL_STEMS = {"current", "index"}


def find_all_notes(vault: Path) -> List[Path]:
    skip = {".obsidian", ".git", "Reports", "Archive"}
    return [
        p for p in vault.rglob("*.md")
        if not any(part in skip for part in p.parts)
    ]


def resolve_wikilink(target: str, vault: Path) -> bool:
    clean = target.strip().replace("\\", "/")
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


def _note_title(path: Path) -> str:
    try:
        for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
            if line.startswith("# "):
                return line[2:].strip().lower()
    except OSError:
        pass
    return ""


def check_duplicates(notes: List[Path], vault: Path) -> List[dict]:
    from collections import defaultdict
    by_stem: Dict[str, List[Path]] = defaultdict(list)
    for note in notes:
        stem = note.stem.lower()
        if stem in _STRUCTURAL_STEMS:
            continue  # current.md / index.md are per-project structural files
        by_stem[stem].append(note)

    issues = []
    for stem, paths in by_stem.items():
        if len(paths) <= 1:
            continue
        titles = [_note_title(p) for p in paths]
        non_empty = [t for t in titles if t]
        if non_empty and len(set(non_empty)) < len(non_empty):
            files = ", ".join(str(p.relative_to(vault)) for p in paths)
            issues.append({
                "id": "L3", "priority": "LOW",
                "file": files,
                "detail": f"重複候補: ファイル名が同一で内容も類似 ({stem})",
            })
    return issues


def _current_age_days(note: Path, text: str, today: date) -> int:
    """最終更新/最終確認ラベルを優先。なければmtimeにフォールバック。"""
    m = _LAST_UPDATED_RE.search(text)
    if m:
        try:
            return (today - date.fromisoformat(m.group(1))).days
        except ValueError:
            pass
    return (today - datetime.fromtimestamp(note.stat().st_mtime).date()).days


def check_current_md(notes: List[Path], vault: Path, today: date) -> List[dict]:
    issues = []
    for note in (n for n in notes if n.stem.lower() == "current"):
        text = note.read_text(encoding="utf-8", errors="ignore")
        rel = str(note.relative_to(vault))

        age = _current_age_days(note, text, today)
        if age > 14:
            issues.append({
                "id": "L4", "priority": "HIGH",
                "file": rel,
                "detail": f"古い current.md: {age}日前が最終確認",
            })

        if not EVIDENCE_PATTERN.search(text):
            issues.append({
                "id": "L5", "priority": "MEDIUM",
                "file": rel,
                "detail": "根拠なし current.md: commit/ファイル/URL の根拠記述がない",
            })

        if TASK_PATTERNS.search(text):
            issues.append({
                "id": "L6", "priority": "HIGH",
                "file": rel,
                "detail": "タスク混入: current.md にタスク/担当/期限記述を検出",
            })
    return issues


def check_secrets(notes: List[Path], vault: Path) -> List[dict]:
    issues = []
    for note in notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        categories = detect_secrets(text)
        if categories:
            issues.append({
                "id": "L8", "priority": "HIGH",
                "file": str(note.relative_to(vault)),
                "detail": f"機密らしき記述を検出: カテゴリ={','.join(categories)}",
            })
    return issues


def check_contradictions(notes: List[Path], vault: Path) -> List[dict]:
    col_pattern = re.compile(r'(\d+)列')
    col_claims: Dict[int, List[str]] = {}
    for note in notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        for m in col_pattern.finditer(text):
            val = int(m.group(1))
            if 10 <= val <= 60:
                col_claims.setdefault(val, []).append(str(note.relative_to(vault)))
    all_files: Dict[str, set] = {}
    for val, files in col_claims.items():
        for f in files:
            all_files.setdefault(f, set()).add(val)
    issues = []
    for f, vals in all_files.items():
        if len(vals) > 1 and 33 not in vals:
            issues.append({
                "id": "L7", "priority": "LOW",
                "file": f,
                "detail": f"矛盾候補: 同一ファイルに複数の列数記述 {sorted(vals)}",
            })
    return issues


def top3(issues: List[dict]) -> List[dict]:
    return sorted(issues, key=lambda x: PRIORITY.get(x["priority"], 9))[:3]


def format_report(all_issues: List[dict], today: date, vault: Path) -> str:
    top = top3(all_issues)
    high = sum(1 for i in all_issues if i["priority"] == "HIGH")
    med = sum(1 for i in all_issues if i["priority"] == "MEDIUM")
    low = sum(1 for i in all_issues if i["priority"] == "LOW")
    lines = [
        f"# vault-lint レポート {today}",
        "",
        f"検査日: {today}  Vault: {vault}",
        f"検出件数: {len(all_issues)}  (HIGH={high}  MEDIUM={med}  LOW={low})",
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
        lines += ["問題なし", ""]

    for priority in ("HIGH", "MEDIUM", "LOW"):
        grp = [x for x in all_issues if x["priority"] == priority]
        if not grp:
            continue
        lines += [f"## {priority} ({len(grp)}件)", ""]
        for issue in grp:
            lines += [f"- [{issue['id']}] `{issue['file']}`", f"  {issue['detail']}"]
        lines.append("")

    lines += [
        "---",
        "自動修正・削除・統合は行っていない。修正の判断は人間が行うこと。",
        "機密情報の詳細はこのファイルへ出力していない。",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="vault-lint: Knowledge Vault 品質検査")
    parser.add_argument("--vault", default="/Users/satouyuuichi/Developer/Knowledge")
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

    all_issues: List[dict] = []
    all_issues += check_broken_links(notes, vault)
    all_issues += check_orphans(notes, vault)
    all_issues += check_duplicates(notes, vault)
    all_issues += check_current_md(notes, vault, today)
    all_issues += check_secrets(notes, vault)
    all_issues += check_contradictions(notes, vault)

    report = format_report(all_issues, today, vault)

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
