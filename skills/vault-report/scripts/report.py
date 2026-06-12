#!/usr/bin/env python3
"""
vault-report — AI_INDEX.md から関連ノートを選び、根拠付きレポートを生成する
Notionタスク・Git正式仕様は書き換えない。
"""
import argparse
import re
import sys
from datetime import date
from pathlib import Path
from typing import Optional, List

WIKILINK_PATTERN = re.compile(r'\[\[([^\]|#]+?)(?:[|#][^\]]*)?\]\]')
MAX_NOTES = 15
MIN_NOTES = 2


def resolve_note(target: str, vault: Path) -> Optional[Path]:
    clean = target.strip().replace("\\", "/")
    candidates = [
        vault / (clean + ".md"),
        vault / clean,
    ] + list(vault.rglob(f"{Path(clean).name}.md"))
    for c in candidates:
        if c.exists():
            return c
    return None


def select_notes_from_index(index_text: str, topic: str, vault: Path) -> List[Path]:
    """AI_INDEX.md のリンクからトピックに関連するものを選ぶ。"""
    all_links = WIKILINK_PATTERN.findall(index_text)
    topic_lower = topic.lower()

    scored = []
    for link in all_links:
        score = 0
        link_lower = link.lower()
        # トピックキーワードとの一致度でスコアリング
        for word in re.split(r'\W+', topic_lower):
            if len(word) >= 2 and word in link_lower:
                score += 2
        # current.md は高優先
        if "current" in link_lower:
            score += 3
        scored.append((score, link))

    scored.sort(key=lambda x: -x[0])
    selected = []
    seen = set()
    for _, link in scored:
        if len(selected) >= MAX_NOTES:
            break
        resolved = resolve_note(link, vault)
        if resolved and resolved not in seen:
            selected.append(resolved)
            seen.add(resolved)

    return selected


def read_note_summary(path: Path, vault: Path, max_lines: int = 60) -> str:
    """ノートを読み、先頭 max_lines 行を返す。"""
    text = path.read_text(encoding="utf-8", errors="ignore")
    lines = text.splitlines()[:max_lines]
    return "\n".join(lines)


def format_report(topic: str, notes: list[Path], vault: Path, today: date) -> str:
    sources = [str(n.relative_to(vault)) for n in notes]
    lines = [
        "---",
        f"topic: {topic}",
        f"generated: {today}",
        f"sources:",
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
        summary = read_note_summary(note, vault)
        lines += [
            f"## [[{note.stem}]] (`{rel}`)",
            "",
            "```",
            summary[:1200],  # 長すぎる場合は切り詰め
            "```",
            "",
        ]

    lines += [
        "---",
        "## 参照一覧",
        "",
    ]
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
    parser.add_argument("--vault", default="/Users/satouyuuichi/Developer/Knowledge",
                        help="Vault ルートディレクトリ")
    parser.add_argument("--topic", required=True, help="レポートのトピック（例: FlipRadar現在地）")
    parser.add_argument("--notes", default=None,
                        help="使用ノートをカンマ区切りで指定（省略時はAI_INDEXから自動選択）")
    args = parser.parse_args()

    vault = Path(args.vault).expanduser().resolve()
    if not vault.exists():
        print(f"ERROR: Vault が見つかりません: {vault}", file=sys.stderr)
        sys.exit(1)

    today = date.today()

    # ノート選択
    if args.notes:
        notes = []
        for n in args.notes.split(","):
            p = resolve_note(n.strip(), vault)
            if p:
                notes.append(p)
            else:
                print(f"[report] WARN: ノートが見つかりません: {n}", file=sys.stderr)
    else:
        index_path = vault / "AI_INDEX.md"
        if not index_path.exists():
            print(f"ERROR: AI_INDEX.md が見つかりません: {index_path}", file=sys.stderr)
            sys.exit(1)
        index_text = index_path.read_text(encoding="utf-8", errors="ignore")
        notes = select_notes_from_index(index_text, args.topic, vault)

    if len(notes) < MIN_NOTES:
        print(f"[report] WARN: 関連ノートが{MIN_NOTES}件未満 ({len(notes)}件)。手動で --notes を指定してください。",
              file=sys.stderr)

    print(f"[report] 使用ノート ({len(notes)}件): {[str(n.relative_to(vault)) for n in notes]}",
          file=sys.stderr)

    report = format_report(args.topic, notes, vault, today)

    # 出力先
    safe_topic = re.sub(r'[^\w\-]', '-', args.topic)[:40]
    reports_dir = vault / "Reports"
    reports_dir.mkdir(exist_ok=True)
    out = reports_dir / f"{today}-{safe_topic}.md"
    out.write_text(report, encoding="utf-8")
    print(f"[report] レポート出力: {out}", file=sys.stderr)
    print(report)


if __name__ == "__main__":
    main()
