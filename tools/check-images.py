#!/usr/bin/env python3
"""
画像URL疎通確認スクリプト — NovaTech / SITEON
全HTMLファイル内のUnsplash URLを検出し、404を報告する

使い方:
  python3 check-images.py path/to/index.html
  python3 check-images.py path/to/site/          # ディレクトリ指定（index.htmlを自動検索）
  python3 check-images.py                         # カレントディレクトリを検索
"""

import sys
import os
import re
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed


def find_html_files(path):
    if os.path.isfile(path):
        return [path]
    results = []
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules']]
        for f in files:
            if f.endswith('.html'):
                results.append(os.path.join(root, f))
    return results


def extract_unsplash_ids(html_content):
    """HTMLからUnsplash photo-IDと元のURLを抽出"""
    pattern = r'https://images\.unsplash\.com/(photo-[a-f0-9]+-[a-zA-Z0-9]+)[^"\'> ]*'
    matches = re.findall(pattern, html_content)
    return list(set(matches))


def check_url(photo_id):
    """photo-IDの疎通確認（タイムアウト5秒）"""
    url = f"https://images.unsplash.com/{photo_id}?w=10"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            return photo_id, resp.status, None
    except urllib.error.HTTPError as e:
        return photo_id, e.code, None
    except Exception as e:
        return photo_id, None, str(e)


def check_file(html_path):
    """HTMLファイル内の全Unsplash URLをチェック"""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    photo_ids = extract_unsplash_ids(content)
    if not photo_ids:
        return html_path, [], []

    ok = []
    broken = []

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(check_url, pid): pid for pid in photo_ids}
        for future in as_completed(futures):
            photo_id, status, err = future.result()
            if status == 200:
                ok.append(photo_id)
            else:
                # ALTテキストを取得して何の画像か特定
                pattern = rf'https://images\.unsplash\.com/{re.escape(photo_id)}[^"]*"[^>]*alt="([^"]*)"'
                alt_match = re.search(pattern, content)
                alt = alt_match.group(1) if alt_match else "(alt不明)"
                broken.append((photo_id, status or "timeout", alt))

    return html_path, ok, broken


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    html_files = find_html_files(target)

    if not html_files:
        print(f"HTMLファイルが見つかりません: {target}")
        sys.exit(1)

    total_ok = 0
    total_broken = 0
    all_broken = []

    print(f"\n🔍 {len(html_files)}件のHTMLファイルをチェック中...\n")

    for html_path in html_files:
        path, ok, broken = check_file(html_path)
        rel = os.path.relpath(path)
        total_ok += len(ok)
        total_broken += len(broken)

        if broken:
            print(f"❌ {rel}")
            for pid, status, alt in broken:
                print(f"   HTTP {status} — {pid}")
                print(f"   alt: 「{alt}」")
                print(f"   URL: https://images.unsplash.com/{pid}?w=640&h=480&fit=crop")
            all_broken.extend([(rel, pid, status, alt) for pid, status, alt in broken])
        else:
            print(f"✅ {rel} ({len(ok)}枚 全て正常)")

    print(f"\n{'='*60}")
    print(f"結果: {total_ok}枚正常 / {total_broken}枚破損")

    if all_broken:
        print(f"\n⚠️  以下を修正してください:\n")
        for rel, pid, status, alt in all_broken:
            print(f"ファイル: {rel}")
            print(f"  破損: {pid}")
            print(f"  用途: 「{alt}」")
            print(f"  対応: Unsplashで代替写真を検索して差し替え\n")
        print("修正後に再実行してください: python3 check-images.py")
        sys.exit(1)
    else:
        print("\n✅ 全画像URL正常。デプロイ可能です。")
        sys.exit(0)


if __name__ == "__main__":
    main()
