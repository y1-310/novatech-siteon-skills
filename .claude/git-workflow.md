# Git Workflow

## 基本ルール

- コード変更後は必ず `git add` → `git commit` → `git push` する
- ブランチは main のみ使用する
- コミットメッセージ形式：`v{番号} {要約}`（例：v1.2 メニュー価格更新）
- APIキー・パスワードは絶対にGitHubリポジトリに入れない

## GitHubアカウント

- アカウント：y1-310
- スキルリポ：y1-310/novatech-siteon-skills
- ビジネスリポ：y1-310/novatech-siteon-business
- クライアントサイト：y1-310/novatech-siteon-client-{サロン名英語小文字}

## リポジトリ命名規則

| 対象 | 命名規則 | 例 |
|------|---------|-----|
| スキル | novatech-siteon-skills | — |
| ビジネス | novatech-siteon-business | — |
| クライアントサイト | novatech-siteon-client-{名前} | novatech-siteon-client-bloom |

## コミットメッセージ規則

```
v{番号} {変更内容の要約}

例：
v1.0 初期スキル・ルール構築
v1.1 lp-salon スキル追加
v1.2 メニュー価格更新
v2.0 マルチページ対応
```

## デプロイ

| パターン | 対象 | 月額コスト |
|---------|------|-----------|
| GitHub Pages（github.io） | デモサイト・初期提案 | 0円 |
| GitHub Pages + 独自ドメイン | 本番サイト（推奨） | 約125〜250円 |
| Xserver | メールアドレスが必要な場合のみ | 約275〜550円 |

## 保守フロー

```
クライアント（LINE）→ Yuichi がClaude Codeに指示 → 修正 → git push → GitHub Pagesに自動反映
```
