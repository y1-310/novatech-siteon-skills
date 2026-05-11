# Instagram 投稿ワークフロー v3.1

SNS v3.0移行（2026-05）以降の運用フロー。
v7テンプレート（build-html.js / render.js）は廃止。Codex Desktop で画像生成。

---

## 投稿スケジュール

| 曜日 | パターン | スタイル |
|-----|---------|---------|
| 月・火・金 | A（ナチュラル） | 暖色・自然光・カフェ空間 |
| 木 | D（ダーク高級） | ダークネイビー・ゴールド・高級サロン |
| 土 | E（雑誌風） | 白ベース・ミニマル・エディトリアル |
| 水・日 | 休み | — |

---

## 画像生成フロー

```
1. 参謀Claude（claude.ai）がプロンプト作成
      ↓  skills/sanbo-image-prompt/SKILL.md に従う
2. Yuichi → Codex Desktop（Playground、GitHub参照モード）に貼り付け
      ↓  skills/codex-image-gen/SKILL.md を参照させる
3. Codex が gpt-image-2 で画像生成（quality: high）
      - 1080x1080px、4枚カルーセル（P1〜P4）
      - P1・P2 生成 → 品質確認 → P3・P4 生成（品質統一）
4. 生成画像をダウンロード
      ↓
5. novatech-reel-assets または GitHub Pages に配置（公開URL取得）
      ↓
6. instagram-post.js でカルーセル投稿（API経由）
   または Instagram アプリで手動アップロード
```

---

## カルーセル投稿（API経由）

```bash
cd ~/Developer/novatech-siteon-business
source ~/.zshrc

node sns/scripts/instagram-post.js \
  --images "URL1,URL2,URL3,URL4" \
  --caption "キャプション本文" \
  --post-id "W21-01"
```

**キャプション1行目ルール:**
Instagramではユーザー名の直後に1行目が表示される。
1行目は短いフック（＼ 保存推奨 ／ など）にすること。

---

## 動画（リール）フロー

```
1. scroll-video は sns/video-pipeline/ に実装
      - capture.js → render.js → encode.js → post.js
2. 現状はリール投稿APIに非対応
      ↓
3. 手動アップロード（Instagram アプリ）
```

---

## 週次ドラフト生成（GitHub Actions 自動）

```
毎週月曜 7:00 JST（UTC 日曜 22:00）
  ↓
weekly-auto-draft.yml が起動
  ↓
Notionネタ帳 → Kimi K2.5 → sns/drafts/ に JSON 生成
  ↓
Slack #sns-analytics に通知
  ↓
Yuichi が ドラフト確認 → Codex Desktop で画像生成（上記フロー）
```

---

## GitHub Actions 現行一覧

| ワークフロー | リポジトリ | トリガー | 状態 |
|------------|-----------|---------|------|
| weekly-auto-draft.yml | novatech-siteon-business | 毎週月曜7:00 JST | ✅ 運用中 |
| monthly-pages-health.yml | novatech-siteon-business | 毎月1日 | ✅ 運用中 |
| update-demo-image.yml | 各client-* | mainブランチpush | ✅ 運用中 |
| ~~sns-generate.yml~~ | ~~novatech-siteon-business~~ | ~~廃止~~ | 🗑️ 2026-05削除 |

---

## 参照スキル

| スキル | 場所 | 用途 |
|-------|------|------|
| codex-image-gen | `skills/codex-image-gen/SKILL.md` | Codex向け画像生成ルール |
| sanbo-image-prompt | `skills/sanbo-image-prompt/SKILL.md` | 参謀Claude向けプロンプト品質基準 |
| sns-image-codex | `.claude/skills/sns-image-codex/SKILL.md` | Claude Code向けSNS画像生成スキル |

---

## Instagram アクセストークン管理

- 場所: `~/.zshrc` の `INSTAGRAM_ACCESS_TOKEN`
- 有効期限: 60日（2ヶ月ごとに手動更新が必要）
- 更新手順: Instagram Graph API Explorer で長期トークンを再生成
