# sns-week-auto スキル v1.0

> SNS週次コンテンツ生成を Step 1〜7 まで一括自動実行するスキル。
> 毎週月曜早朝に CEO Claude Code が自律実行する。

---

## 起動コマンド

```bash
# CEO Claude Code が実行（毎週月曜早朝）
node /Users/satouyuuichi/Developer/novatech-siteon-business/sns/scripts/sns-week-auto.js

# 手動実行
# claude --prompt "sns-week-autoスキルを実行してください"
```

---

## Step 1: 競合分析（Apify API）

**実行スクリプト:** `sns/scripts/sns-competitor-analysis.js`  
**出力:** `sns/analysis/weekly-trends.json`

```bash
APIFY_API_TOKEN=$(grep APIFY_API_TOKEN ~/.zshrc | tail -1 | sed 's/.*"\(.*\)"/\1/') \
  node sns/scripts/sns-competitor-analysis.js
```

監視アカウント（初期設定: Yuichiが選定した5〜8件）:
- 設定場所: `sns/scripts/sns-competitor-analysis.js` の `COMPETITOR_ACCOUNTS` 配列

取得データ:
- 各アカウントの直近10投稿
- いいね数・コメント数・キャプション・ハッシュタグ
- 高エンゲージメント投稿Top3

出力 `weekly-trends.json` の構造:
```json
{
  "week": "2026-W19",
  "stats": { "total_posts": 70, "avg_engagement": 45.3 },
  "top_hashtags": [{"tag": "美容室", "count": 15}, ...],
  "trend_themes": [{"theme": "梅雨・湿気", "count": 8}, ...],
  "top_posts": [...],
  "insight": "今週のトレンド: ..."
}
```

---

## Step 2: コンテンツ計画JSON生成

**担当:** CEO Claude Code（自動生成）  
**参照ファイル:** `sns/analysis/weekly-trends.json`  
**出力:** `sns/plans/YYYY-WNN-plan.json`

`weekly-trends.json` のinsightとトレンドテーマをもとに、
以下の週次投稿計画JSONを生成する:

```json
{
  "week": "2026-W19",
  "trend_insights": "（Step 1のinsightを転記）",
  "posts": [
    {"id":"W19-01","day":"月","axis":"attraction_hint","pattern":"A",
     "theme":"（トレンドから選定）","hook_number":"XX%","hook_title":"..."},
    {"id":"W19-02","day":"火","axis":"attraction_hint","pattern":"A","theme":"..."},
    {"id":"W19-03","day":"水","axis":"scroll_video","pattern":"reel",
     "demo_url":"https://novatech-studio.github.io/novatech-siteon-client-bloom/"},
    {"id":"W19-04","day":"木","axis":"case_study","pattern":"D","theme":"..."},
    {"id":"W19-05","day":"金","axis":"attraction_hint","pattern":"A","theme":"..."},
    {"id":"W19-06","day":"土","axis":"service_intro","pattern":"E","theme":"..."}
  ]
}
```

投稿パターン対照表:
| パターン | 曜日 | スタイル |
|----------|------|----------|
| A（ナチュラル） | 月・火・金 | セージグリーン、人物後ろ姿、明るいカフェ |
| D（ダーク高級） | 木 | 間接照明、ゴールドアクセント |
| E（雑誌風） | 土 | 白ベース、写真＋コラム、ネイビー |

---

## Step 3: コピーライティング（Codex CLI）

**担当:** 制作・品質部長 → Codex CLI  
**参照:** `sns/plans/YYYY-WNN-plan.json`  
**出力:** `sns/captions/WNN.md`

各投稿について生成するもの:

1. **投稿キャプション（caption）**
   - 1行目: 共感を引くフック
   - 中段: 数字・事実・解決策
   - 末尾: 保存CTA + ハッシュタグ5〜8個
   - 文字数: 500〜800字

2. **画像テキスト P1〜P4**
   ```json
   {
     "P1": {"hook_number":"XX%","hook_title":"...","subtitle":"..."},
     "P2": {"heading":"...","items":[...],"footer":"..."},
     "P3": {"heading":"...","items":[...],"footer":"..."},
     "P4": {"heading":"...","prices":[...],"cta":["保存してあとで見返す","DMで相談する"]}
   }
   ```

Codex CLI用プロンプトテンプレート:
```
以下の計画JSONをもとに、Instagramカルーセル投稿のキャプションと
画像テキスト（P1〜P4）を生成してください。

ブランド: SITEON（美容室・小規模事業者向けHP制作）
トーン: 親しみやすく、具体的な数字で信頼感
テーマ: {theme}

[計画JSON]
{plan_json}
```

---

## Step 4: 画像生成（Codex CLI 完成品出力）

**担当:** 制作・品質部長 → Codex CLI
**参照:** Step 3のP1〜P4テキスト + AGENTS.mdの「Codex完成品出力ルール」
**出力:** `sns/images/YYYY-WNN/WNN-0N/P1.png〜P4.png`

### 方式

Codex gpt-image-2 でテキスト込みの完成品画像を直接生成する。
v7テンプレート（build-html.js + render.js）は使用しない。

### 実行手順

1. Step 3で生成されたP1〜P4のテキスト内容を確認
2. 今週の投稿パターン（A/D/E）を計画JSONから取得
3. AGENTS.mdの「Codex完成品出力ルール」のプロンプトテンプレートに沿って、
   Codex CLI に各画像（P1〜P4）の生成を依頼
4. 生成された画像を `sns/images/YYYY-WNN/WNN-0N/` に保存
5. 全画像のテキスト誤字チェック（Step 6で再確認するが、ここでも一次チェック）

### Codex CLI 実行例

```
AGENTS.md の「SNS投稿画像 — Codex完成品出力ルール」を参照して、
以下の内容でパターンAの投稿画像P1を生成してください。

テーマ: 検索で見つからないサロンの割合
テキスト:
- 上部: 「検索で見つからないサロンの割合」
- 中央大文字: 「73%」
- 下部カード: 「あなたのサロンは大丈夫？」

保存先: ~/Developer/novatech-siteon-business/sns/images/2026-W19/W19-01/P1.png
```

### 注意事項

- 1枚ずつ生成・確認すること（バッチ生成すると品質がばらつく）
- 日本語テキストの誤字は生成後に必ず目視確認
- 背景写真と文字のコントラストが不十分な場合は再生成

---

## Step 5: スクロール動画録画

**担当:** CEO Claude Code（自動実行）  
**出力:** `sns/images/YYYY-WNN/WNN-03_scroll.mp4`

```bash
node /Users/satouyuuichi/Developer/novatech-siteon-skills/.claude/skills/mobile-preview/scripts/scroll-video.js \
  https://novatech-studio.github.io/novatech-siteon-client-bloom/
# 生成後に sns/images/YYYY-WNN/ に移動
```

仕様:
- デバイス: iPhone 17 Pro（1080×1920）
- スクロール: 80px/秒 / トップ2秒停止 / ボトム2秒停止
- 尺: 15〜20秒

---

## Step 6: 品質チェック（制作部長 自動）

制作・品質部長サブエージェントが全素材を確認:

チェック項目:
- [ ] 日本語の誤字脱字（すべてのキャプション・画像テキスト）
- [ ] 画像の文字切れ・レイアウト崩れ（P1〜P4×5投稿）
- [ ] ハッシュタグ重複チェック（6投稿間で同じタグを使いまわさない）
- [ ] 文字数チェック（キャプション2,200字以内）
- [ ] 4枚のデザイントーン統一（パターン内で色・フォント一致）
- [ ] スクロール動画再生確認（無音でも内容が伝わるか）

問題検出時: CEOに報告 → 該当箇所のみ再生成

品質チェック完了後の承認メッセージ:
```
✅ W19 品質チェック完了
  - キャプション 6件 OK
  - 画像 20枚 OK（W19-01〜06 各P1〜P4）
  - スクロール動画 OK（18.5秒）
  - ハッシュタグ重複なし
```

---

## Step 7: Git保存・通知

**担当:** CEO Claude Code

```bash
# 1. ファイル構成確認
ls sns/images/2026-W19/
ls sns/captions/

# 2. Git commit & push
cd /Users/satouyuuichi/Developer/novatech-siteon-business
git add sns/images/2026-W19/ sns/captions/W19.md sns/analysis/weekly-trends.json sns/plans/
git commit -m "auto: W19 SNS素材生成完了（20枚 + 動画1本）"
git push

# 3. cmux通知
cmux notify --title "W19 SNS素材 生成完了" \
  --body "20枚の画像 + スクロール動画を生成しました。月曜7:00に確認をお願いします。"

# 4. Googleカレンダーのメモ更新（任意）
# → 秘書室に依頼してGCalのStep 8予定に完了報告を追記
```

---

## ディレクトリ構造

```
novatech-siteon-business/
├── sns/
│   ├── scripts/
│   │   ├── sns-competitor-analysis.js  ← Step 1
│   │   └── sns-week-auto.js            ← 全Step統括（TODO）
│   ├── analysis/
│   │   └── weekly-trends.json          ← Step 1出力
│   ├── plans/
│   │   └── 2026-W19-plan.json          ← Step 2出力
│   ├── captions/
│   │   └── W19.md                      ← Step 3出力
│   └── images/
│       └── 2026-W19/
│           ├── W19-01/ (P1〜P4.png)
│           ├── W19-02/ (P1〜P4.png)
│           ├── W19-03_scroll.mp4
│           ├── W19-04/ (P1〜P4.png)
│           ├── W19-05/ (P1〜P4.png)
│           └── W19-06/ (P1〜P4.png)
```

---

## Step 8: Instagram投稿（Yuichi承認後）

**担当:** CEO Claude Code（Yuichi承認後に手動実行）  
**前提:** Step 7完了 + Yuichi月曜7:00確認で承認済み

```bash
node sns/scripts/instagram-post.js \
  --images "sns/images/2026-WNN/WNN-01/P1.png,P2.png,P3.png,P4.png" \
  --caption "sns/captions/WNN.md" \
  --post-id "WNN-01"
```

**運用ルール:**
- Yuichiの承認なしに絶対に実行しない
- 1日1投稿ペース（6投稿/週）
- 投稿成功後に Slack #sns-analytics に通知（スクリプト自動送信）

**注意:** 画像は GitHub Pages で公開されている必要がある
- ベースURL: `https://y1-310.github.io/novatech-siteon-business/`
- トークン期限切れ時は Instagram Graph API Explorer で再生成

---

## 環境変数

| 変数 | 用途 | 設定場所 |
|------|------|---------|
| `APIFY_API_TOKEN` | 競合分析（Step 1） | `~/.zshrc` |
| `MOONSHOT_API_KEY` | Kimi K2.5（Step 3補助） | `~/.zshrc` |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Instagram投稿（Step 8） | `~/.zshrc` |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram投稿（Step 8） | `~/.zshrc` |

---

## 今後の実装TODO

- [ ] `sns/scripts/sns-week-auto.js` — Step 1〜7を1コマンドで実行する統括スクリプト
- [ ] GitHub Actions / cron で毎週月曜早朝に自動起動
- [ ] Codex CLI画像生成の自動化（現在は手動実行）
- [ ] Meta Graph API連携（Phase C: 自動投稿）

---

## 関連ファイル

- ワークフロー全体仕様: `sns/sns-operations-v3.md`
- 競合分析スクリプト: `sns/scripts/sns-competitor-analysis.js`
- スクロール動画スキル: `novatech-siteon-skills/.claude/skills/mobile-preview/scripts/scroll-video.js`
