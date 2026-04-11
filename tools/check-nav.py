#!/usr/bin/env python3
"""
ナビゲーションリンク日本語チェック — NovaTech / SITEON
navリンクに英語テキストが残っていたら警告する

使い方:
  python3 check-nav.py path/to/index.html
  python3 check-nav.py path/to/site/
"""

import sys, os, re

# 英語のみのナビリンクテキストを検出（短い英単語 or 全角英字）
# 日本語文字（ひらがな・カタカナ・漢字）が含まれていればOK
JAPANESE_PATTERN = re.compile(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]')

# navタグ内のaタグのテキストを抽出
NAV_LINK_PATTERN = re.compile(r'<nav[^>]*>(.*?)</nav>', re.DOTALL | re.IGNORECASE)
A_TAG_PATTERN = re.compile(r'<a[^>]*>(.*?)</a>', re.DOTALL | re.IGNORECASE)
TAG_STRIP_PATTERN = re.compile(r'<[^>]+>')

# 許容する英数字のみのテキスト（ロゴ・アイコン等）
ALLOWED_PATTERNS = [
    r'^$',           # 空
    r'^\s*$',        # 空白のみ
    r'^[0-9]+$',     # 数字のみ
]

# よく使われる英語ナビ表現（全て禁止）
ENGLISH_NAV_WORDS = [
    'home', 'about', 'service', 'services', 'menu', 'works', 'gallery',
    'news', 'blog', 'contact', 'access', 'staff', 'team', 'price',
    'concept', 'philosophy', 'flow', 'faq', 'reserve', 'book',
    'reservation', 'profile', 'salon', 'hair', 'nail', 'beauty',
    'table', 'food', 'drink', 'architect', 'office', 'recruit',
    'company', 'top', 'information', 'greeting', 'message',
]


def extract_nav_links(content):
    """navタグ内のリンクテキストを全て抽出"""
    results = []
    for nav_match in NAV_LINK_PATTERN.finditer(content):
        nav_html = nav_match.group(1)
        for a_match in A_TAG_PATTERN.finditer(nav_html):
            inner = a_match.group(1)
            text = TAG_STRIP_PATTERN.sub('', inner).strip()
            if text:
                results.append(text)
    return results


def is_english_only(text):
    """日本語を含まない英語テキストか判定"""
    # 日本語文字が1文字でも含まれていればOK
    if JAPANESE_PATTERN.search(text):
        return False

    # 許容パターンにマッチすればOK
    for pattern in ALLOWED_PATTERNS:
        if re.match(pattern, text):
            return False

    # 英字を含む場合は英語のみと判定
    if re.search(r'[a-zA-Z]', text):
        return True

    return False


def check_file(path):
    with open(path, encoding='utf-8') as f:
        content = f.read()

    nav_texts = extract_nav_links(content)
    issues = []

    for text in nav_texts:
        if is_english_only(text):
            # 既知の英語ナビ単語かチェック
            lower = text.lower().strip()
            is_known = lower in ENGLISH_NAV_WORDS
            issues.append({'text': text, 'known': is_known})

    return issues


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

    total_issues = 0
    for path in html_files:
        issues = check_file(path)
        rel = os.path.relpath(path)
        if issues:
            print(f'\n❌ {rel} — ナビゲーションに英語テキストを検出:')
            for i in issues:
                label = '（既知の英語ナビ表現）' if i['known'] else '（要確認）'
                print(f'   「{i["text"]}」{label}')
            print(f'   → ナビリンクのテキストを日本語に変更すること')
            total_issues += len(issues)
        else:
            print(f'✅ {rel} — ナビリンクは全て日本語')

    print(f'\n{"="*60}')
    if total_issues:
        print(f'⚠️  {total_issues}件の英語ナビリンクが検出されました')
        print('ナビゲーションのテキストを日本語に変更してください')
        sys.exit(1)
    else:
        print('✅ ナビゲーションチェック: 問題なし')
        sys.exit(0)


if __name__ == '__main__':
    main()
