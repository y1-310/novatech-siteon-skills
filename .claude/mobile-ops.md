# スマホ⇔Mac運用ルール（mobile-ops）

> 元設計: 2026-04-19 参謀Claudeとの設計セッション
> 最終更新: 2026-04-19
> 関連: .claude/current-state.md, .claude/CLAUDE.md, .claude/rules.md
> 注意: Developer/GitHub最適化後にファイル再配置の可能性あり

---

## 📱 基本方針

Yuichiの運用スタイルに合わせた設計。

### 通常運用（Mac手元作業）
- Claude Code（VS Code内）で作業実行
- 参謀Claude（Claude.ai / このアプリ）で戦略判断・壁打ち
- ドキュメント・コード生成はClaude Codeがローカル操作

### 外出時（Mac離れる）
- iPhone/iPad の Claude mobile app で参謀Claudeとチャット
- 次の作業方針・rule/skill詰め・指示文生成
- 帰宅後にMac開いてClaude Codeへコピペ実行

### 緊急時（将来・必要に応じて）
- Dispatch を経由してMacを遠隔実行
- 基本は手動運用を優先、自動化は段階導入

---

## 🖥️ Claude Code 起動時の初動ルーチン

新しいセッション開始時、以下を順次確認する。

1. `.claude/current-state.md` を読み込んで現状把握
2. `git pull` で最新化（必要に応じて）
3. Notion「NovaTech タスク一覧DB」の優先度🔴高・未着手を確認
   - DB ID: `33afbbb9-a761-8113-9273-d71ec47f0c6c`
4. Slack #novatech-ops の未読確認（参謀Claudeからの予約メモがあれば）
5. 見つかった作業候補をYuichiに報告→着手優先順位を相談

**自動実行はしない。** Yuichiが「今日何する？」と聞いた時に上記を実施。

---

## 📲 参謀Claude経由の予約タスク運用

Yuichiが外出中に参謀Claudeとチャットして、Mac戻ったら実行したい場合。

### パターン1：コピペ型（推奨）
```
外出中：参謀Claudeに指示文を作らせる
  ↓
指示文をコピー（Claude.aiアプリからテキスト選択）
  ↓
Mac帰宅：Claude Code のチャット欄にペースト
  ↓
Claude Code実行
```

### パターン2：Slack #novatech-ops メモ型
Slack MCPで参謀Claudeが #novatech-ops にメモを残す。Mac戻った時にClaude Codeが
Slackを確認して、未処理メモがあればYuichiに報告。

### パターン3：Notion タスク登録型
参謀Claudeが Notion タスク一覧DBに「優先度🔴高」で新規タスク登録。Macで
Claude Code が起動時ルーチンで検知。長めの指示・背景説明が必要な時に有効。

---

## 🔒 Dispatch 運用準備（将来用・環境構築のみ）

現時点ではDispatchを日常運用に組み込まない。しかし環境構築は済ませて、
必要になった時すぐ使える状態にしておく。

### 権限スコープ設計（3層）

**Tier A：自由にアクセス可（フォルダ許可済み）**
- `~/Developer/novatech-siteon-skills/`
- `~/Developer/novatech-siteon-business/`
- `~/Developer/novatech-siteon-client-*/`

**Tier B：都度承認（Connector/アプリ）**
- Gmail（読み取りOK、送信は必ずYuichi承認）
- Slack（全チャンネル投稿可、ただし重要チャンネルは承認）
- Notion（全ページ操作可）

**Tier C：禁止（Denied apps 設定）**
- System Settings
- Terminal（Claude Code経由のCLIは別ルート）
- Finder全般（特定フォルダのみ許可で代替）
- 個人フォルダ（`~/Documents`の私用ファイル等）
- SSH/キーチェーン関連アプリ

### フォルダショートカット登録

Dispatchで以下のショートカット名で呼び出せるようにする：

| ショートカット | 実パス |
|-------------|--------|
| `スキルリポ` | `~/Developer/novatech-siteon-skills/` |
| `ビジネスリポ` | `~/Developer/novatech-siteon-business/` |
| `bloom` | `~/Developer/novatech-siteon-client-bloom/` |
| `tomori` | `~/Developer/novatech-siteon-client-test-tomori/` |
| `mori` | `~/Developer/novatech-siteon-client-test-mori/` |
| `akari` | `~/Developer/novatech-siteon-client-test-akari/` |
| `営業リスト` | `~/Developer/novatech-siteon-business/clients/` |
| `SNS下書き` | `~/Developer/novatech-siteon-business/sns/drafts/` |

### Dispatch制約の認識

- macOS専用
- Mac常時起動・awake必須（蓋閉じると停止）
- Keep computer awake 設定推奨
- ファイル添付不可（iPhoneから→Gmail経由で回避）
- セッション承認は30分で期限切れ・再承認必要
- プロンプトインジェクションリスク（Gmail内の隠し文字など）

### 有効化タイミング

以下のいずれかに該当したら Dispatch を本格運用開始：
- 顧客3件超えて忙しさが増した時
- 営業フェーズで1日数回リモート指示が必要な時
- Macから離れる時間が規則的に増えた時

それまでは環境構築のみ済ませて、手動運用で進める。

---

## 🏢 Slack #novatech-ops の役割

### 使う場面
- 参謀Claudeからの予約タスクメモ
- Claude Codeからの進捗・完了報告
- Yuichi自身のメモ（思いついた時）
- 重要決定事項のアーカイブ

### 使わない場面
- リアルタイムの指示伝達（参謀Claudeとのチャットが速い）
- 短い質問・相談（参謀Claudeのmobile app単体で完結）

### チャンネルID
`C0ATNJR1PPD`（プライベート）

---

## 📋 GitHub Actions 候補（PC不要の定期タスク）

Notionタスク一覧DBに登録済みの運用自動化候補：

| タスク | 優先度 | 実装時期 |
|-------|--------|---------|
| 月次Lighthouseレポート自動化 | 🟢低 | 顧客3件超で |
| Kimi API残高監視（週次Slack通知） | 🟡中 | 営業フェーズ開始時に |
| 週次ツール調査PDCA自動化 | 🟢低 | 余裕できた時 |

実装時は既存のSNS v7 パターン（`weekly-auto-draft.yml` / `monthly-pages-health.yml`）を
流用する。GitHub Actionsクラウド実行なのでYuichi不在・Mac電源OFFでも稼働。

---

## ⚙️ Keep computer awake 設定

Dispatchを使う日（将来）は以下を有効化：

```
Claude Desktop app
  → Settings
    → Desktop app
      → General
        → Keep computer awake: ON
```

ただし：
- 蓋を閉じるとsleep = Dispatch停止
- 電源アダプタ接続推奨
- 平時は OFF のままでOK（手元作業中心なので）

---

## 🔄 このファイルの更新ルール

以下のタイミングで Claude Code が自動更新：

1. Dispatch運用を本格開始した時 → 運用実態を反映
2. 新しい参謀Claude⇔Claude Code連携パターンが確立した時
3. GitHub Actions追加タスクが稼働開始した時
4. Slack #novatech-ops の運用方針変更時

更新後は必ず `git push`。コミットメッセージ：`chore(mobile-ops): {変更概要}`
