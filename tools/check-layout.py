#!/usr/bin/env python3
"""
CSSレイアウトチェック — NovaTech / SITEON
よくあるレイアウトバグを静的解析で検出する

検出対象:
  1. img タグに width / height 属性がない（hero 除く）
  2. .section-heading に align-items: end が設定されている
  3. portrait-stack の img に max-height が設定されていない

使い方:
  python3 check-layout.py path/to/index.html
  python3 check-layout.py path/to/site/
"""

import sys, os, re

# ── パターン定義 ────────────────────────────────────────────────

# <style> ブロック抽出
STYLE_BLOCK = re.compile(r'<style[^>]*>(.*?)</style>', re.DOTALL | re.IGNORECASE)

# imgタグ（自己閉じも対応）
IMG_TAG = re.compile(r'<img\b[^>]*>', re.DOTALL | re.IGNORECASE)

# loading="eager" または loading なし かつ hero 系クラスの判定（ヒーロー画像は除外）
HERO_CONTEXT = re.compile(
    r'class="[^"]*(?:hero|banner)[^"]*"[^>]*>|'
    r'<section[^>]*class="[^"]*hero[^"]*"[^>]*>',
    re.IGNORECASE
)

# width / height 属性
HAS_WIDTH  = re.compile(r'\bwidth\s*=\s*["\']?\d', re.IGNORECASE)
HAS_HEIGHT = re.compile(r'\bheight\s*=\s*["\']?\d', re.IGNORECASE)

# alt属性テキスト抽出
ALT_TEXT = re.compile(r'\balt\s*=\s*"([^"]*)"', re.IGNORECASE)

# .section-heading ブロック内の align-items: end
SECTION_HEADING_BLOCK = re.compile(
    r'\.section-heading\b[^{]*\{([^}]*)\}',
    re.DOTALL
)
ALIGN_END = re.compile(r'align-items\s*:\s*end\b')

# portrait-stack img ルール
PORTRAIT_IMG_RULE = re.compile(
    r'\.portrait-stack\b[^{]*(?:img|\.image-card)[^{]*\{([^}]*)\}|'
    r'\.portrait-stack\s+\.image-card\s*:first-child\s+img\s*\{([^}]*)\}|'
    r'\.portrait-stack\s+img\s*\{([^}]*)\}',
    re.DOTALL
)
HAS_MAX_HEIGHT = re.compile(r'max-height\s*:')


# ── チェック関数 ─────────────────────────────────────────────────

def check_file(path):
    with open(path, encoding='utf-8') as f:
        content = f.read()

    issues   = []
    warnings = []

    # CSS ブロック抽出
    css = ''
    m = STYLE_BLOCK.search(content)
    if m:
        css = m.group(1)

    # ① img に width/height なし ─────────────────────────────────
    # ヒーロー section の範囲を特定してスキップ
    hero_section_re = re.compile(
        r'<section[^>]*class="[^"]*hero[^"]*"[^>]*>.*?</section>',
        re.DOTALL | re.IGNORECASE
    )
    hero_html = ''.join(m.group(0) for m in hero_section_re.finditer(content))

    for m in IMG_TAG.finditer(content):
        img_tag = m.group(0)
        # ヒーローセクション内の img は除外
        if img_tag in hero_html:
            continue
        if not HAS_WIDTH.search(img_tag) or not HAS_HEIGHT.search(img_tag):
            alt_m  = ALT_TEXT.search(img_tag)
            alt_txt = alt_m.group(1)[:40] if alt_m else '(no alt)'
            issues.append(f'  img に width/height なし → alt="{alt_txt}"')

    # ② .section-heading に align-items: end ─────────────────────
    for m in SECTION_HEADING_BLOCK.finditer(css):
        block_body = m.group(1)
        if ALIGN_END.search(block_body):
            issues.append(
                '  .section-heading に align-items: end が設定されています\n'
                '  → align-items: start に変更してください'
            )

    # ③ portrait-stack img に max-height なし ────────────────────
    if '.portrait-stack' in css:
        found_portrait_rule = False
        found_max_height    = False
        for m in PORTRAIT_IMG_RULE.finditer(css):
            found_portrait_rule = True
            body = next((g for g in m.groups() if g), '')
            if HAS_MAX_HEIGHT.search(body):
                found_max_height = True
                break
        if found_portrait_rule and not found_max_height:
            warnings.append(
                '  portrait-stack img に max-height が設定されていません\n'
                '  → max-height: 420px の追加を推奨します'
            )

    return issues, warnings


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else '.'

    html_files = []
    if os.path.isfile(target):
        html_files = [target]
    else:
        for root, dirs, files in os.walk(target):
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules']]
            for f in files:
                if f.endswith('.html'):
                    html_files.append(os.path.join(root, f))

    if not html_files:
        print(f'HTMLファイルが見つかりません: {target}')
        sys.exit(1)

    total_issues   = 0
    total_warnings = 0

    for path in html_files:
        issues, warnings = check_file(path)
        rel = os.path.relpath(path)

        if issues or warnings:
            if issues:
                print(f'\n❌ {rel} — レイアウトバグを検出:')
                for i in issues:
                    print(i)
            if warnings:
                print(f'\n⚠️  {rel} — 推奨修正:')
                for w in warnings:
                    print(w)
            total_issues   += len(issues)
            total_warnings += len(warnings)
        else:
            print(f'✅ {rel} — レイアウトチェック: 問題なし')

    print(f'\n{"="*60}')
    if total_issues:
        print(f'❌ {total_issues}件のレイアウトバグが検出されました')
        print('修正してから commit してください')
        sys.exit(1)
    elif total_warnings:
        print(f'⚠️  {total_warnings}件の推奨修正があります（commit は可能）')
        sys.exit(0)
    else:
        print('✅ レイアウトチェック: 問題なし')
        sys.exit(0)


if __name__ == '__main__':
    main()
