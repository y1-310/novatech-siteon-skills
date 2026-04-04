# 顧客管理手順

## 二層管理：JSON（GitHub）+ Google Sheets

| レイヤー | 用途 | 操作者 |
|---------|------|--------|
| JSON（GitHubリポジトリ内） | Agentが読み書き。バージョン管理自動 | Agent |
| Google Sheets | Yuichiが一覧確認。ブラウザ・スマホから閲覧 | Yuichi（閲覧）/ Agent（更新） |

**同期ルール：** Agentが変更する時は必ず両方を同時更新。Yuichiも変更したい場合はClaude Code経由で指示（直接Sheets編集はJSON非反映）。

## GitHubリポジトリ構成

```
novatech-siteon-business/（非公開）
├── clients/
│   ├── prospects.json  ← 見込み客
│   ├── active.json     ← 契約中
│   └── churned.json    ← 解約済み
├── reports/            ← 月次レポート
├── sales/              ← 営業資料・DM文面
└── sns/                ← SNS投稿コンテンツ
```

## データ保存場所の使い分け

| データの種類 | 保存場所 | 理由 |
|------------|---------|------|
| クライアントのサイト本体 | GitHub（個別リポジトリ） | バージョン管理＋デプロイ |
| 顧客管理データ（JSON） | GitHub（novatech-business） | Agent読み書き＋履歴管理 |
| スキルファイル | GitHub（novatech-skills） | Claude Code参照 |
| デモサイト | GitHub Pages | デモURL即時発行 |
| 月次レポート・営業資料 | GitHub（novatech-business） | Agent自動生成＋履歴管理 |
| SNS投稿コンテンツ | GitHub（novatech-business） | Agent生成→API投稿 |
| 請求・契約書等の機密書類 | Google Drive | GitHubに置かない |
| クライアントから受け取った写真 | Google Drive | 大容量ファイル |

## ステータス遷移

```
未接触（prospect）→ DM送信済（contacted）→ 商談中（negotiating）
→ デモ提示済（demo_sent）→ 提案済（proposed）→ 契約中（active）→ 解約済（churned）

各段階で「反応なし」→ 再アプローチリスト（re_approach）
「興味なし」明言 → 除外（excluded）
```

## 月額保守プラン

| プラン | 内容 | 月額 |
|--------|------|------|
| ライト | テキスト修正月2回 | 3,000円 |
| 標準 | テキスト＋写真月4回＋カレンダー | 5,000円 |
| フル | 標準＋月次SEOレポート＋改善提案 | 10,000円 |

## 月間収益シミュレーション

| 段階 | スタンダード | プロ | プレミアム | 月額合計 |
|------|------------|------|----------|---------|
| 初期（3ヶ月目） | 5件 | 1件 | 0件 | 64,000円 |
| 成長期（6ヶ月目） | 10件 | 3件 | 1件 | 168,000円 |
| 安定期（12ヶ月目） | 20件 | 5件 | 2件 | 321,000円 |
| 目標（24ヶ月目） | 30件 | 10件 | 3件 | 519,000円 |
