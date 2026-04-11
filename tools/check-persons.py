#!/usr/bin/env python3
"""
人物写真のUnsplash使用チェック — NovaTech / SITEON
スタッフ・代表者写真にUnsplashが使われていたら警告する

使い方:
  python3 check-persons.py path/to/index.html
"""

import sys, os, re

# スタッフ・代表者を示すalt/クラスのキーワード
PERSON_PATTERNS = [
    r'alt="[^"]*(?:スタッフ|代表|オーナー|税理士|建築士|stylist|owner|staff|portrait|代表者|スタイリスト)[^"]*"',
    r'class="[^"]*(?:staff|portrait|profile|owner|member|about-portrait)[^"]*"',
    r'id="(?:staff|about|profile)[^"]*"',
]

UNSPLASH = r'https://images\.unsplash\.com/photo-[a-zA-Z0-9_-]+'

def check_file(path):
    with open(path, encoding='utf-8') as f:
        content = f.read()

    issues = []
    # imgタグを全て抽出して判定
    img_tags = re.findall(r'<img[^>]+>', content, re.IGNORECASE)
    for tag in img_tags:
        src_m = re.search(r'src="([^"]*)"', tag)
        alt_m = re.search(r'alt="([^"]*)"', tag)
        if not src_m:
            continue
        src = src_m.group(1)
        alt = alt_m.group(1) if alt_m else ''

        if not re.search(UNSPLASH, src):
            continue  # Unsplashでなければスキップ

        # 人物写真かどうかを判定
        is_person = False
        person_keywords = ['スタッフ', '代表', 'オーナー', '税理士', '建築士',
                           'stylist', 'owner', 'staff', 'portrait', 'スタイリスト',
                           'プロフィール', 'profile', '担当者']
        for kw in person_keywords:
            if kw.lower() in alt.lower():
                is_person = True
                break

        # 人物系クラス・ID を含む文脈か確認（imgの前後100文字）
        idx = content.find(tag)
        context = content[max(0, idx-200):idx+len(tag)+100]
        context_keywords = ['staff-card', 'portrait', 'profile-card', 'about-portrait',
                            'staff-list', 'member', 'スタッフ', '代表']
        for kw in context_keywords:
            if kw in context:
                is_person = True
                break

        if is_person:
            photo_id = re.search(r'photo-[a-zA-Z0-9_-]+', src).group()
            issues.append({'alt': alt, 'src': src, 'id': photo_id})

    return issues

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else '.'

    # HTML収集
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
            print(f'\n❌ {rel} — 人物写真にUnsplashを使用:')
            for i in issues:
                print(f'   alt: 「{i["alt"]}」')
                print(f'   src: {i["src"]}')
                print(f'   → images/ フォルダのローカル画像に差し替えること')
            total_issues += len(issues)
        else:
            print(f'✅ {rel} — 人物写真は全てローカル or 非Unsplash')

    print(f'\n{"="*60}')
    if total_issues:
        print(f'⚠️  {total_issues}件の人物写真がUnsplashを使用しています')
        print('generate-staff-photos.py でAI生成画像を作成して差し替えてください')
        sys.exit(1)
    else:
        print('✅ 人物写真チェック: 問題なし')
        sys.exit(0)

if __name__ == '__main__':
    main()
