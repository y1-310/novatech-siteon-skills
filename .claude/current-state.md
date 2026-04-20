# NovaTech 現在の状態（軽量サマリー）

> このファイルは Claude Code と参謀Claude が**毎セッション冒頭に読む**軽量スナップショット。
> 詳細は Notion「NovaTech 現在の状態」ページ（33cfbbb9-a761-8195-9a33-f3d07f41a42e）参照。
> 作業完了時に Claude Code が自動更新する。

最終更新: 2026-04-20 JST

---

## 🎯 現在のフェーズ

- Phase 1（スキル開発）: ✅完了（2026-04-08）
- Phase 2（営業準備）: 🔄進行中
  - 2a 日本語品質基盤: ✅完了
  - 2b スキル強化: ✅完了
  - 2c デモサイト品質改善: ✅完了
  - 2d NovaTech HP再構築 v6.0: ✅完了（2026-04-14）

多忙期間：2026-04-15〜04-25。復帰後に営業フェーズ開始。

## 🏢 cc-company サブエージェント体制（2026-04-20〜）

- CEO: Claude Code Opus 4.7（Max $100/月）— 振り分け・最終判断・監督
- 営業・リサーチ部長: Opus 4.6 サブ → Kimi K2.5 を道具（稼働中）
- 制作・品質部長: Opus 4.6 サブ → Codex を道具（稼働中）→ 2026-05にCursor PRO移行判断
- マーケ・運営部長: Opus 4.6 サブ → Kimi を道具（顧客5件超で本格稼働）
- 秘書室: Opus 4.6 サブ → Notion MCP（問い合わせ型のみ稼働・2週間試運転後に自動モード移行）

## ✅ 直近完了（過去7日）

- 2026-04-20: Notion タスク棚卸し実施（1件を✅完了・1件を備考更新）
- 2026-04-20: Safari iOS overflow-x バグ修正（デモ4件 + rules.md ルール36 + mobile-nav.md）
- 2026-04-20: cc-company サブエージェント化 Phase 1-3 完了（agents/ 4指示書・CLAUDE.md/agent-operations/shared-context 新構造化・秘書ノートページ作成）
- 2026-04-20: スマホ⇔Mac運用設計完了（.claude/mobile-ops.md 新規作成・Notionタスク4件追加）
- 2026-04-19: v2-final整理プロジェクト実施（.claude/ 3ファイル追加・current-state.md新設・Notion追記）
- 2026-04-19: v1.11 デモサイト4件モバイルナビ修正完了（mori/akari inset fix push済み）
- 2026-04-18: Instagram D案実行（@novatech_jp作成）・X @novatech_jp リネーム・siteon.jp SSL修復・rules.md カテゴリ15追加
- 2026-04-17: SNS v7 自動化 Phase 7 完了（月曜9:00 JST自動パイプライン本番稼働）

## 🔄 進行中・待機中

- Instagram MCP 再構築：Day 2-3（4/22-23）プロアカウント化＋FBページ接続
- Day 4以降：Meta for Developers 再登録→アプリ作成→権限→トークン→Account ID→MCP再接続
- Stripe商品登録（3プラン）：初クライアント獲得前に
- Coconala・Lancers アカウント整備・出品：4/25以降
- Cursor PRO移行判断：2026-05（Codexで十分なら延期）
- Dispatch環境構築（将来のスマホ→Mac委任に備えた環境準備・優先度🟡中）

## 🚧 ブロッカー

（解消されたものは削除。発生したら追記）

## 📊 スキル・インフラ状況

- スキル v1.20（7業態Lighthouse 90+達成）+ SNS v7（11テンプレ稼働）
- siteon.jp: v6.0稼働・SSL修復済み・Lighthouse 95/97/100/100
- GitHub: y1-310（skills/business/一部client）+ novatech-studio（デモ4件）
- ブランド: @novatech_jp（X/Instagram統一、全小文字）

## 🔗 主要リンク

- Notion NovaTech 現在の状態: `33cfbbb9-a761-8195-9a33-f3d07f41a42e`
- Notion タスク一覧DB: `33afbbb9-a761-8113-9273-d71ec47f0c6c`
- Notion 秘書ノート: `348fbbb9-a761-8193-8003-cd196408daf2`
- Notion 場面別クイック一覧DB: `33afbbb9-a761-80d8-83d2-efc7ed424f05`
- Notion 将来検討事項: `345fbbb9a76181bdab89d5bd6ca26e2d`
- Notion 分析サマリー: `33efbbb9-a761-818a-8d90-c15c7f5f249e`
- Notion 自社サイト設計: `33afbbb9a76181908420e92d4c54f9bb`
- Notion SNS v7 実装指示書: `345fbbb9a761813c9ecdd3e3b11ac057`
- siteon.jp: https://siteon.jp
- LINE: https://lin.ee/oRKHrcK

---

## 📝 更新ルール（Claude Code向け）

このファイルは以下のタイミングで Claude Code が自動更新する：
1. 新規タスク完了時 → 「直近完了」に追記（7日超の項目は削除）
2. フェーズ進捗変化時 → 該当セクション更新
3. 新ブロッカー発生/解消時 → 「ブロッカー」更新
4. 毎月1日 → インフラ状況の数値更新

更新後は必ず `git push`。コミットメッセージ：`chore(state): {変更概要}`
