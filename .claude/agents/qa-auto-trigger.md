# QA 自動発火ルール

## 目的
LP完成時やコンポーネント生成時に、
Yuichi や参謀Claude が指示しなくても
自動的に品質検証が走る仕組み。

## 自動発火トリガー

### トリガー1: LP完成検知
CEO Claude Code が以下を検知したら自動発火:
- index.html が新規生成された
- 既存index.html が大幅修正(20行以上)された
- git commit 直前

実行内容:
1. 制作・品質部署長 sub-agent 起動 → QAチェック
2. 合格なら mobile-preview skill 実行
3. スクショ生成 → /tmp/previews/ に保存
4. Finder 自動展開
5. Yuichi & 参謀Claudeに結果報告

### トリガー2: Codex/Kimi出力直後
専門AIから出力が戻ったら自動発火:
1. 制作・品質部署長 sub-agent 起動
2. 品質チェック
3. 不備あれば該当AIに再生成指示
4. 合格したら次フェーズへ進む

### トリガー3: 日次QA(任意)
毎日定時に以下を自動実行(将来拡張):
- 進行中LP の Lighthouse 再測定
- 変更点の影響確認

## 発火しないケース
- Yuichi が「QA不要」と明示指示時
- トークン節約モード時(明示指示)
- 1-2行の軽微修正時

## 結果通知
QA結果は以下に自動記録:
- Notion「QAログ」DB
- 秘書ノート「参謀Claude宛メモ」(不備ありの場合)
- Slack #qa-results (将来連携)
