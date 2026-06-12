#!/usr/bin/env python3
"""
vault-report — AI_INDEX.md から関連ノートを選び、根拠付きレポートを生成する
Notionタスク・Git正式仕様は書き換えない。
"""
import argparse
import os
import re
import sys
from datetime import date
from pathlib import Path
from typing import List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
from vault_secrets import detect_secrets

WIKILINK_FULL = re.compile(r'\[\[([^\]|#]+?)(?:\|([^\]]*))?\]\]')
MAX_NOTES = 15
MIN_NOTES = 2
_EXCLUDE_DIRS = {"Raw", "Reports", ".obsidian", ".git", "Archive"}


def _tokenize_topic(topic: str) -> list:
    """ASCII語と日本語語を分離してトークン化。最低2文字。"""
    lower = topic.lower()
    ascii_tokens = re.findall(r'[a-z0-9]{2,}', lower)
    # CJK統合漢字・ひらがな・カタカナ
    jp_tokens = re.findall(r'[぀-鿿豈-﫿]{2,}', topic)
    return list(dict.fromkeys(ascii_tokens + jp_tokens))


def resolve_note(target: str, vault: Path) -> Optional[Path]:
    clean = target.strip().replace("\\", "/")
    candidates = [
        vault / (clean + ".md"),
        vault / clean,
    ] + list(vault.rglob(f"{Path(clean).name}.md"))
    vault_real = vault.resolve()
    for c in candidates:
        if not (c.exists() and c.is_file()):
            continue
        try:
            rel = c.relative_to(vault)
            if any(part in _EXCLUDE_DIRS for part in rel.parts):
                continue
        except ValueError:
            continue
        # symlink escape: 実体パスもVault配下か確認
        try:
            c.resolve().relative_to(vault_real)
        except ValueError:
            continue
        return c
    return None


def select_notes_from_index(index_text: str, topic: str, vault: Path) -> List[Path]:
    """スコア>0のノートのみ選択。ASCII語・日本語語を分離してスコアリング。
    link target・alias・同一行文脈を対象とする。Raw/Reportsは自動選択対象外。"""
    topic_tokens = _tokenize_topic(topic)
    scored = []
    seen_links: set = set()

    for line in index_text.splitlines():
        for m in WIKILINK_FULL.finditer(line):
            link = m.group(1)
            alias = m.group(2) or ""
            if link in seen_links:
                continue
            seen_links.add(link)

            link_parts = link.replace("\\", "/").split("/")
            if any(part in _EXCLUDE_DIRS for part in link_parts):
                continue

            # スコア対象: linkパス + alias + 同一行のテキスト全体
            context = " ".join([link.lower(), alias.lower(), line.lower()])
            score = sum(2 for token in topic_tokens if token in context)
            if "current" in link.lower() and score > 0:
                score += 1  # currentボーナスはトピック関連ノートのみ
            if score == 0:
                continue
            scored.append((score, link))

    scored.sort(key=lambda x: -x[0])
    selected: List[Path] = []
    seen_paths: set = set()
    for _, link in scored:
        if len(selected) >= MAX_NOTES:
            break
        resolved = resolve_note(link, vault)
        if resolved is None:
            continue
        real = resolved.resolve()
        if real not in seen_paths:
            selected.append(resolved)
            seen_paths.add(real)
    return selected


def validate_manual_notes(raw_specs: str, vault: Path) -> List[Path]:
    """--notes の各パスをVault境界・symlink・dedup検証して返す。境界違反はexit(1)。"""
    notes: List[Path] = []
    seen: set = set()
    for spec in raw_specs.split(","):
        spec = spec.strip()
        if not spec:
            continue
        p = Path(spec)
        candidate = p.resolve() if p.is_absolute() else (vault / spec).resolve()
        try:
            candidate.relative_to(vault)
        except ValueError:
            print(f"ERROR: --notes のパスは Vault 配下のみ指定可能: {spec}", file=sys.stderr)
            sys.exit(1)
        if candidate.is_symlink():
            real_link = Path(os.path.realpath(str(candidate)))
            try:
                real_link.relative_to(vault)
            except ValueError:
                print(f"ERROR: シンボリックリンクによる Vault 外アクセスを拒否: {spec}", file=sys.stderr)
                sys.exit(1)
        if candidate.suffix.lower() != ".md":
            print(f"[report] WARN: .md ファイルのみ指定可能: {spec}", file=sys.stderr)
            continue
        if not candidate.is_file():
            print(f"[report] WARN: ノートが見つかりません: {spec}", file=sys.stderr)
            continue
        real = candidate.resolve()
        if real in seen:
            continue
        seen.add(real)
        notes.append(candidate)
    return notes


def scan_and_filter(notes: List[Path], vault: Path) -> List[Path]:
    """機密を含むノートを除去。警告はstderrにファイル名とカテゴリのみ。"""
    clean: List[Path] = []
    for note in notes:
        text = note.read_text(encoding="utf-8", errors="ignore")
        cats = detect_secrets(text)
        if cats:
            rel = str(note.relative_to(vault))
            print(f"[report] SKIP (secret={','.join(cats)}): {rel}", file=sys.stderr)
        else:
            clean.append(note)
    return clean


def read_note_summary(path: Path, max_lines: int = 60) -> str:
    lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()[:max_lines]
    return "\n".join(lines)


def format_report(topic: str, notes: List[Path], vault: Path, today: date) -> str:
    sources = [str(n.relative_to(vault)) for n in notes]
    lines = [
        "---",
        f"topic: {topic}",
        f"generated: {today}",
        "sources:",
    ] + [f"  - {s}" for s in sources] + [
        "---",
        "",
        f"# {topic} — レポート ({today})",
        "",
        "> 根拠: 下記の正本ノートを読んでまとめた。Raw は確認済み情報の補足にのみ使用。",
        "",
    ]

    for note in notes:
        rel = str(note.relative_to(vault))
        summary = read_note_summary(note)
        lines += [
            f"## [[{note.stem}]] (`{rel}`)",
            "",
            "```",
            summary[:1200],
            "```",
            "",
        ]

    lines += ["---", "## 参照一覧", ""]
    for s in sources:
        lines.append(f"- [[{Path(s).stem}]] (`{s}`)")
    lines += [
        "",
        "---",
        "このレポートは正本ではない。正本は各 `sources:` ファイルを参照。",
        "Notionタスク状態・Git正式仕様はこのファイルでは変更しない。",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="vault-report: 根拠付きレポート生成")
    parser.add_argument("--vault", default="/Users/satouyuuichi/Developer/Knowledge")
    parser.add_argument("--topic", required=True, help="レポートのトピック")
    parser.add_argument("--notes", default=None,
                        help="使用ノートをカンマ区切りで指定（省略時はAI_INDEXから自動選択）")
    parser.add_argument("--dry-run", action="store_true",
                        help="Reports/ への出力なし。結果を stdout に表示")
    args = parser.parse_args()

    vault = Path(args.vault).expanduser().resolve()
    if not vault.exists():
        print(f"ERROR: Vault が見つかりません: {vault}", file=sys.stderr)
        sys.exit(1)

    today = date.today()

    if args.notes:
        notes = validate_manual_notes(args.notes, vault)
    else:
        index_path = vault / "AI_INDEX.md"
        if not index_path.exists():
            print(f"ERROR: AI_INDEX.md が見つかりません: {index_path}", file=sys.stderr)
            sys.exit(1)
        index_text = index_path.read_text(encoding="utf-8", errors="ignore")
        notes = select_notes_from_index(index_text, args.topic, vault)

    notes = scan_and_filter(notes, vault)

    if len(notes) < MIN_NOTES:
        print(
            f"ERROR: 機密スキャン後に残ったノートが{MIN_NOTES}件未満 ({len(notes)}件)。"
            f"レポートを生成しません。手動で --notes を指定してください。",
            file=sys.stderr,
        )
        sys.exit(1)

    print(f"[report] 使用ノート ({len(notes)}件): {[str(n.relative_to(vault)) for n in notes]}",
          file=sys.stderr)

    report = format_report(args.topic, notes, vault, today)

    if args.dry_run:
        print(report)
        return

    safe_topic = re.sub(r'[^\w\-]', '-', args.topic)[:40]
    reports_dir = vault / "Reports"
    reports_dir.mkdir(exist_ok=True)
    out = reports_dir / f"{today}-{safe_topic}.md"
    out.write_text(report, encoding="utf-8")
    print(f"[report] レポート出力: {out}", file=sys.stderr)
    print(report)


if __name__ == "__main__":
    main()
