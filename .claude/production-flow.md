# cc-company 生産フロー v1.0

## 目的
LP制作における各AIの役割と起動条件を明確化し、
参謀Claudeが毎回指示しなくても自律的に最適なAIが起動する
設計を確立する。

## 基本原則
- 人=Claude Code、AI=道具
- Claude Code(CEO+sub-agent)が判断・監督
- Codex/Kimiは道具(判断しない)
- 専門タスクは専門AIへ自動委託

## 標準LP制作フロー

### フェーズ1: 戦略判断【参謀Claude】
- 要件定義
- アーキテクチャ決定
- 品質基準設定
- プロンプト設計

### フェーズ2: タスク分解【CEO Claude Code】
参謀Claudeからの指示を受け、以下を自律的に実行:
1. 作業内容を分析し、最適な実行者を判定(下記マトリクス参照)
2. 各AI向けのプロンプトを作成
3. 作業順序を決定
4. 実行計画をYuichiに簡潔に報告(承認待たず着手可)

### フェーズ3: 実生成【専門AI並列】

| タスク種別 | 実行者 | トリガー条件 |
|---|---|---|
| HTML/CSS/JS 新規生成 | **Codex** | skill準拠のLP/コンポーネント制作時 |
| HTML/CSS/JS 20行未満の修正 | Claude Code直接 | 緊急修正/細部調整 |
| 日本語コピーライティング | **Kimi K2.5** | キャッチコピー/本文/メニュー文言 |
| 競合サイトリサーチ | **Kimi K2.5** | 参考事例調査 |
| 複雑ロジック実装 | **制作・品質部署長sub-agent** | JS複雑処理/API統合 |
| 画像選定 | Claude Code + Unsplash | 全画像選定 |
| Notion書き込み | CEO Claude Code | データ保存(唯一権限者) |

### フェーズ4: 品質監督【制作・品質部署長sub-agent】
Codex/Kimi出力を自動レビュー:
1. lp-novatech skill 準拠チェック
2. Borderless First原則適用確認
3. レスポンシブ対応確認(モバイルSticky等)
4. アクセシビリティ確認(WCAG AA)
不備あれば該当AIに再生成指示

### フェーズ5: 統合・検証【CEO Claude Code + QA自動】
1. 各AI出力を統合
2. mobile-preview skill 自動実行(LP完成時)
3. Lighthouse測定(可能な場合)
4. 結果をYuichiへ報告

## 自律判断マトリクス

### CEO Claude Code の判断ロジック

指示受信時、以下のフローで自律判断:

```
参謀Claude or Yuichiから指示受信
  ↓
タスク内容を分析
  ↓
┌─ HTML/CSS/JS生成含む? ─Yes→ Codex用プロンプト作成 → Yuichiに提示
│                         No
│                         ↓
├─ 日本語コピー生成含む? ─Yes→ Kimi用プロンプト作成 → Yuichiに提示
│                         No
│                         ↓
├─ リサーチ含む? ─Yes→ Kimi用プロンプト作成 → Yuichiに提示
│                No
│                ↓
├─ 複雑ロジック? ─Yes→ 制作・品質部署長sub-agentをTask起動
│                No
│                ↓
└─ 定型作業のみ → Claude Code直接実行
```

### Codex 委託判定基準

以下のいずれかに該当すれば Codex 委託:
- 新規HTMLファイル作成
- CSSの新規スタイル定義(10行以上)
- JavaScriptの新規ロジック実装
- lp-novatech skill準拠の LP 生成
- コンポーネント新規作成

以下は Claude Code 直接処理可:
- 既存コードの1-2行修正
- 文字列置換
- コメント追加
- ファイル構造整理

### Kimi 委託判定基準

以下のいずれかに該当すれば Kimi 委託:
- 日本語キャッチコピー生成
- 日本語本文作成(50文字以上)
- 競合/参考サイトのリサーチ
- 業種別デザイントレンド調査
- 大量データの分類・整理

以下は Claude Code 直接処理可:
- 短い日本語修正(50文字未満)
- 既存テキストのマイナー調整

## 例外ルール

### トークン分散タスク
Yuichi が明示的に「トークン分散」と指示した場合、
Claude Code が HTML/CSS/JS を直接生成してよい。
用途: Yuichi不在時のClaude Code稼働維持。

### 緊急対応
Codex/Kimi障害時は Claude Code が代替実行可。
ただし事後報告必須、Notionに「例外実行」として記録。

### 参謀Claude明示指示
参謀Claudeが「Claude Code直接」と明示した場合は従う。

## 違反検知

CEO Claude Code は受信指示を分析し、
本来専門AIに委託すべきタスクを自分で実行しようとしていないか
セルフチェックする。違反リスクあれば以下を Yuichi に提起:

"このタスクは本来 [Codex/Kimi/sub-agent] に委託すべきです。
 委託用プロンプトを作成しますか、このまま直接実行しますか?"
