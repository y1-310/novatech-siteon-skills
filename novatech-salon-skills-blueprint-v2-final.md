# NovaTech サロンLP スキル設計書 v2.0

> **v1.0 → v2.0 変更点：** pending-items.md の全12項目＋設計検討会議での追加決定事項を全て反映。
> 最終更新：2026-04-04

---

## 目次

1. [全体アーキテクチャ](#全体アーキテクチャ)
2. [.claude/ 設定ファイル構成](#claude-設定ファイル構成)
3. [Codex設定・AGENTS.md](#codex設定agentsmd)
4. [Claude Code と Codex の役割分担](#claude-code-と-codex-の役割分担)
5. [Rules + Skills + Agent 連携フロー](#rules--skills--agent-連携フロー)
6. [Agent活用パターン（6種＋将来1種）](#agent活用パターン)
7. [営業フェーズ詳細フロー](#営業フェーズ詳細フロー)
8. [顧客管理設計](#顧客管理設計)
9. [Gmail 問い合わせ処理フロー](#gmail-問い合わせ処理フロー)
10. [salon-interview（ヒアリングスキル）](#1-salon-interviewヒアリングスキル)
11. [lp-salon（女性向け美容室）](#2-lp-salon女性向け美容室ヘアサロン)
12. [lp-barber（メンズ・バーバー）](#3-lp-barberメンズバーバー)
13. [lp-nail-esthe（ネイル・エステ・まつエク）](#4-lp-nail-estheネイルエステまつエク)
14. [lp-salon-group（多店舗・グループサロン）](#5-lp-salon-group多店舗グループサロン)
15. [SITEON サブスク型HP制作サービス設計](#siteon-サブスク型hp制作サービス設計)
16. [共通コンポーネント仕様](#共通コンポーネント仕様)
17. [Figma連携ワークフロー](#figma連携ワークフロー)
18. [技術スタック方針](#技術スタック方針)
19. [画像の扱いルール](#画像の扱いルール)
20. [ファイル保存場所ルール](#ファイル保存場所ルール)
21. [ローカルSEO対策](#ローカルseo対策)
22. [日本語フォント最適化](#日本語フォント最適化)
23. [SNS連携仕様](#sns連携仕様)
24. [保守・更新マニュアル](#保守更新マニュアル)
25. [納品チェックリスト・パッケージ定義](#納品チェックリスト)
26. [料金・見積もりガイドライン](#料金見積もりガイドライン)
27. [クライアント向け写真撮影ガイド](#クライアント向け写真撮影ガイド)
28. [多言語対応の基盤設計](#多言語対応の基盤設計)
29. [アクセシビリティ](#アクセシビリティ具体チェック項目)
30. [エラーハンドリング・フォールバック](#エラーハンドリングフォールバック)
31. [制作優先順位・将来の業態展開](#制作優先順位)
32. [cc-company / cc-secretary 将来統合](#cc-company--cc-secretary-将来統合)
33. [既存スキルとの統合方針](#既存スキルとの統合方針)
34. [作成物リスト・移行手順](#作成物リスト)

---

# 全体アーキテクチャ

## スキルフォルダ構成

```
skills/
├── _common/                      ← 全業態共通の基盤
│   ├── components.md             ← 共通コンポーネント（マーキー・CTA等）
│   ├── reservation-ui.md         ← 予約UI 4パターン
│   └── seo-base.md               ← 共通SEO仕様
│
├── salon-interview/              ← 入口：ヒアリング → 業態判定 → 該当スキルに振り分け
│   ├── SKILL.md
│   └── references/
│       └── presets.md            ← カラー×トーンのCSS変数プリセット集
│
├── lp-salon/                     ← 女性向け美容室・ヘアサロン
│   ├── SKILL.md                  ← プラン判定→読むファイルを分岐
│   └── references/
│       ├── design-system.md      ← 配色・フォント・コンポーネント仕様
│       ├── sections.md           ← 各セクションのHTML/CSS仕様
│       ├── multipage.md          ← 5ページ構成の設計（プロ・プレミアム用）
│       └── premium.md            ← プレミアム固有仕様（Figma・EC・詳細SEO等）
│
├── lp-barber/                    ← メンズ・バーバー（同構成）
│   ├── SKILL.md
│   └── references/
│       ├── design-system.md
│       ├── sections.md
│       ├── multipage.md
│       └── premium.md
│
├── lp-nail-esthe/                ← ネイル・エステ・まつエク（同構成）
│   ├── SKILL.md
│   └── references/
│       ├── design-system.md
│       ├── sections.md
│       ├── multipage.md
│       └── premium.md
│
├── lp-salon-group/               ← 多店舗・グループサロン
│   ├── SKILL.md
│   └── references/
│       ├── design-system.md
│       └── sections.md           ← グループ版は最初からマルチページ前提
│
├── restaurant-interview/         ← 飲食店用ヒアリング（将来）
├── lp-restaurant/                ← 飲食店（将来）
├── corporate-interview/          ← 会社LP用ヒアリング（将来）
├── lp-corporate/                 ← 会社LP（将来）
├── architect-interview/          ← 建築用ヒアリング（将来）
└── lp-architect/                 ← 建築事務所（将来）
```

## プラン別の参照ファイル分岐

プロ・プレミアム用に別スキルは作らない。各スキル内のSKILL.mdがプラン判定を行い、読み込むreferencesファイルを分岐する。

```
スタンダード → SKILL.md + design-system.md + sections.md
プロ         → 上記 + multipage.md
プレミアム   → 上記 + multipage.md + premium.md
```

## スキル間の連携フロー

```
/client-site 実行（既存スキルを入口として活用）
  ↓
「業種は？」→ サロン / 飲食店 / 会社LP / 建築
  ↓
サロンを選択 → salon-interview が起動
  ↓
Round 0-5 のヒアリング実施（質問形式 or Googleフォーム）
  ↓
業態を判定：
  美容室 → lp-salon
  バーバー → lp-barber
  ネイル/エステ → lp-nail-esthe
  多店舗 → lp-salon-group
  ↓
該当スキルにヒアリング結果（JSON）を渡して生成
（プラン判定→読むreferencesファイルを分岐）
  ↓
品質チェック（/seo-check + /web-design-reviewer + Lighthouse）
  ↓
プレビュー提示 → 修正ループ
  ↓
/deploy でGitHub Pagesにデプロイ
  ↓
Figma MCPでキャプチャ → Figmaで微調整（プレミアム）
```

---

# .claude/ 設定ファイル構成

## 改修後の構成

```
.claude/
├── CLAUDE.md              ← メインガイド（改修）
├── rules.md               ← 品質ルール 8カテゴリ・約45項目（新規）
├── git-workflow.md         ← Git運用ルール（改修）
├── quality.md              ← コード品質基準（改修）
├── siteon-workflow.md      ← SITEON制作フロー（新規）
├── agent-operations.md     ← Agent活用手順（新規）
├── client-management.md    ← 顧客管理手順（新規）
├── wp-theme.md             ← WP用（残すが非標準扱い）
├── lessons.md              ← 修正履歴（既存・引き継ぎ＋修正）
└── backup/                 ← 移行前のバックアップ
```

## rules.md 概要（8カテゴリ・約45項目）

| # | カテゴリ | 項目数 | 主な内容 |
|---|---------|--------|---------|
| 1 | Codex連携 | 5 | コード記述はCodexに委任。指示に全ルール含める。出力を確認。1セクション単位で指示 |
| 2 | ファイル構成 | 4 | 単一HTML+inline CSS/JS。placehold.co使用。コメント日本語 |
| 3 | HTML品質 | 8 | セマンティックHTML。alt属性。loading="lazy"（ヒーロー除く）。lang指定 |
| 4 | CSS品質 | 12 | CSS変数統一（--bg/--accent等）。禁止フォント（Inter/Arial/Roboto/Helvetica）。アニメーションはtransform+opacityのみ。セクション間padding 120px |
| 5 | アクセシビリティ | 8 | スキップナビ。aria属性。コントラスト比4.5:1。タップ44px。focus-visible |
| 6 | パフォーマンス | 6 | Lighthouse全項目90点以上。preconnect。font-display:swap。日本語フォント最大3ウェイト。fallbackスタック必須 |
| 7 | SEO | 7 | JSON-LD（業態別@type）。OGP4種+twitter:card。canonical。title/descriptionパターン。viewport |
| 8 | NovaTech/SITEON共通 | 14 | 予約ボタン3箇所以上。スティッキーCTA+padding-bottom。セクション区切り線。ナンバリング統一。マーキー2回繰り返し。税込統一。tel:リンク。noscript対応。prefers-reduced-motion対応 |

### 禁止事項

- Inter / Arial / Roboto / Helvetica の使用
- top/left/marginのアニメーション
- !important（noscript除く）
- 日本語フォント全ウェイト読み込み
- CSS/JSの外部ファイル分離（スタンダード時）

## lessons.md 引き継ぎ内容

| # | 教訓 | 対応 |
|---|------|------|
| 1 | デザインを勝手に変更しない | そのまま残す |
| 2 | CSSを書き直さない | 修正：「プリセットのCSS変数を勝手に変更しない」 |
| 3 | wp_enqueue_scriptでTailwind CDNを読み込まない | WP用として残す |
| 4 | GitHubが最新版とは限らない | そのまま残す |
| 5 | 量産時はクローンフローで品質担保 | 修正：「量産時はスキル＋プリセットで品質担保」 |

---

# Rules + Skills + Agent 連携フロー

## 全体像

```
【営業フェーズ】（Agent活用パターン1〜3）
  リスト生成→ふるい分け→事前調査→初回DM→デモ作成→クロージング→再アプローチ
  顧客管理：JSON（GitHub）+ Google Sheets 二層管理

【制作フェーズ】（Skills + Rules + Agent）
  /client-site → 業態判定 → ヒアリング（質問形式 or Googleフォーム）
  → JSON保存 → スキルでサイト生成 → Codex記述（Rules適用）
  → /seo-check + /web-design-reviewer + Lighthouseチェック → 自動修正
  → 納品パッケージ自動生成 → /deploy でGitHub Pages push
  → 顧客管理JSON+Sheets更新 → 紹介リマインドタイマーセット

【運用フェーズ】（Agent活用パターン4〜6）
  月次保守バッチ / SNS運用（API自動投稿）/ GBP運用 / 定期市場調査
  スケール時（10件超）：Browser Useで自動化
```

---

# Agent活用パターン

## 6種＋将来追加1種

| # | パターン | 自動/指示 | 詳細 |
|---|---------|----------|------|
| 1 | 見込み客リスト自動生成 | Yuichi指示→Agent実行 | Google Maps検索→条件ふるい分け→CSV出力。3段階アプローチ |
| 2 | 営業メッセージ自動生成 | Yuichi指示→Agent実行 | サロンカルテからパーソナライズDM一括生成 |
| 3 | デモサイト量産 | Yuichi指示→Agent実行 | 反応があったサロンのみ。スキルで30分で生成 |
| 4 | 月次保守バッチ | Agent自動（承認制） | 全サイトLighthouse計測→自動修正→レポート |
| 5 | SNS運用支援 | Agent自動生成→Yuichi確認→API自動投稿 | Instagram（Graph API）/ X（Free API）。費用ゼロ |
| 6 | 定期市場調査 | 月次自動＋四半期レポート | 競合・相場・技術・顧客ニーズの調査 |
| 将来 | GBP継続運用 | Agent作成→手動投稿（10件超でBrowser Use） | 口コミ返信・投稿・写真追加・インサイト分析 |

## SNS発信の3軸

| カテゴリ | 例 |
|---------|-----|
| 制作事例 | ビフォーアフター、「月9,800円でこのクオリティ」 |
| AI・Web知識の発信 | 「AIでHP制作がこう変わった」「HP持たないサロンが損する理由」 |
| 業界情報・お役立ち | 「サロン集客のコツ」「Google口コミの重要性」 |

## GBP継続運用サービス（将来追加オプション）

| プラン | 内容 | 月額 |
|--------|------|------|
| GBPライト | 口コミ返信＋基本情報維持＋祝日設定 | 3,000円 |
| GBPスタンダード | ライト＋月4回投稿＋写真追加＋Q&A管理 | 5,000円 |
| GBPフル | スタンダード＋インサイト分析＋競合分析＋改善提案 | 8,000円 |

スケール対応：10件超でBrowser Use自動化。50件でもYuichiの作業は月15〜30分で固定。

---

# 営業フェーズ詳細フロー

## フェーズ1：リスト生成（Agent）

Yuichi「○○エリアの美容室でリスト作って」→ Agent がGoogle Maps検索 → CSV出力

収集項目：サロン名・住所・電話番号・業態・HP有無/URL・HPB/SNS URL・口コミ評価/件数

## フェーズ2：ふるい分け（Agent）

**第1フィルター（対象外を除外）：** 大手チェーン / プロ品質HP保有 / SNSアカウント皆無

**第2フィルター（ランク付け）：**
- ★★★ Aランク：HP無し＋口コミ4.0以上/30件以上＋Instagram活発
- ★★☆ Bランク：HP古い＋口コミ4.0以上
- ★☆☆ Cランク：HPBのみ＋口コミ普通

## フェーズ3：事前調査（Agent）

Aランク各サロンについて：Instagram・HPB・口コミの深掘り調査 → 競合比較資料（近隣3件のHP状況）作成 → サロンカルテ作成

## フェーズ4：初回アプローチ（Agent作成→Yuichi送信）

AgentがサロンカルテからパーソナライズDMを作成 → Yuichiが確認 → Instagram DMで送信 → 結果記録

## フェーズ5：デモサイト作成（Agent）

返信ありのサロンのみ。Yuichi「○○のデモ作って」→ Agent がスキルでデモ生成（30分）→ デモURLをクライアントに送付

## フェーズ6：クロージング（Agent作成→Yuichi対話）

反応パターン別対応：「いくら？」→プラン比較資料 / 「ここ変えたい」→即修正 / 「検討します」→3日後フォロー / 「高い」→再アプローチリスト

## フェーズ7：再アプローチ（Agent自動管理）

初回反応なし：2ヶ月後→4ヶ月後→6ヶ月後の3回まで。別切り口のDMを自動生成→Yuichiに通知。3回反応なし→除外。

## フェーズ8：成約後処理（Agent自動）

契約情報記録 / 紹介プログラムタイマーセット（1ヶ月後）/ ポートフォリオ更新マーク / 制作フェーズへ引き渡し

## 追加営業施策

| 施策 | 内容 |
|------|------|
| 競合比較資料 | DM送付時に近隣サロンのHP状況を添付 |
| 紹介プログラム | 納品1ヶ月後にリマインド。紹介特典（1ヶ月無料等） |
| Coconalaアップセル | 受託納品時にSITEON月額プラン提案 |
| ポートフォリオ自動更新 | 納品のたびにスクリーンショット＋SNS投稿連動 |
| 季節営業 | 1月/3-4月/9月/11月に時期に合わせた営業メッセージ |

---

# 顧客管理設計

## 二層管理：JSON（GitHub）+ Google Sheets

| レイヤー | 用途 | 操作者 |
|---------|------|--------|
| JSON（GitHubリポジトリ内） | Agentが読み書き。バージョン管理自動 | Agent |
| Google Sheets | Yuichiが一覧確認。ブラウザ・スマホから閲覧 | Yuichi（閲覧）/ Agent（更新） |

**同期ルール：** Agentが変更する時は必ず両方を同時更新。Yuichiも変更したい場合はClaude Code経由で指示（直接Sheets編集はJSON非反映）。

## GitHubリポジトリ構成

```
novatech-skills/（非公開）
├── .claude/            ← ルール・ワークフロー
├── _common/            ← 全業態共通基盤
└── skills/             ← 各業態スキル

novatech-business/（非公開）
├── clients/
│   ├── prospects.json  ← 見込み客
│   ├── active.json     ← 契約中
│   └── churned.json    ← 解約済み
├── reports/            ← 月次レポート
├── sales/              ← 営業資料・DM文面
└── sns/                ← SNS投稿コンテンツ

siteon-{クライアント名}-site/（非公開・1サロン1リポジトリ）
├── index.html
├── assets/
└── ...
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

---

# 1. salon-interview（ヒアリングスキル）

## 目的
質問形式またはGoogleフォームでクライアント情報を収集し、最適なスキル＋プリセットを自動選択してサイト生成する。

## ヒアリングの入口（3パターン）

| 入口 | 場面 | データの流れ |
|------|------|------------|
| 質問形式（salon-interview） | 対面・オンライン打合せ | リアルタイムで回答→JSON生成 |
| Googleフォーム | 非対面・LINE完結 | クライアント記入→Sheets→Agent がJSON変換 |
| Agent自動収集 | デモサイト先行作成（営業用） | HPB/Instagramから情報収集→JSON自動生成 |

3つの入口いずれも最終的にJSONに変換され、同じスキルで処理される。

## ヒアリング項目（全6ラウンド）

### Round 0：契約形態

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q0 | 契約形態は？ | single_select | SITEON サブスク / NovaTech 受託（買い切り） |
| Q0.5 | （SITEON時）プランは？ | single_select | スタンダード / プロフェッショナル / プレミアム |

### Round 1：基本情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q1 | 業態は？ | single_select | 美容室 / バーバー / ネイル / エステ / まつエク / その他 |
| Q2 | サロン名（英語） | テキスト | 例：BLOOM |
| Q3 | サロン名（日本語・サブ） | テキスト | 例：hair salon |
| Q4 | エリア・最寄り駅 | テキスト | 例：表参道駅徒歩2分 |
| Q5 | 住所 | テキスト | — |

### Round 2：営業情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q6 | 営業時間 | テキスト | — |
| Q7 | 定休日 | テキスト | — |
| Q8 | 電話番号 | テキスト | — |
| Q8.5 | お支払い方法 | multi_select | 現金 / クレジットカード / PayPay / 交通系IC / その他 |
| Q9 | 予約方法 | multi_select | Hot Pepper / LINE / 電話 / STORES / Airリザーブ / 自社システム / その他 |
| Q9.5 | 予約UIの表示形式 | single_select | 外部リンクのみ / 営業カレンダー表示 / 予約フォーム設置 / 予約ウィジェット埋め込み |

### Round 3：メニュー・スタッフ

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q10 | 主要メニュー＋価格（3〜5つ） | テキスト | 「あとで」可 |
| Q10.3 | 初回価格はありますか？ | single_select | あり / なし |
| Q10.5 | スタイリスト別料金はありますか？ | single_select | あり / なし / 未定 |
| Q10.7 | 施術時間を表示しますか？ | single_select | あり / なし |
| Q11 | スタッフ人数・名前 | テキスト | 「あとで」可 |
| Q12 | メニュー表示形式 | single_select | 定義リスト型（ILOLI型） / 写真付きカード型（MILLOR型） / タブ切り替え型（mile/TOH型） |

### Round 4：デザインの方向性

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q13 | カラー方向性 | single_select | ナチュラル / モノトーン×ゴールド / グレージュ / くすみカラー / おまかせ |
| Q14 | 全体のトーン | single_select | 静謐・上品 / 温もり・親しみ / モード・洗練 / おまかせ |
| Q15 | コンセプトの語り方 | single_select | 3段構造（NANEA型） / ストーリー型（GREENROOM型） / 一言コピー型（OTOKO型） / おまかせ |
| Q16 | ヒーローのスタイル | single_select | 全画面写真＋中央ロゴ / スライドショー / 超ミニマル（TOH型）/ おまかせ |
| Q17 | ギャラリーの表示 | single_select | 横スクロール / LOOKBOOKスライド / おまかせ |
| Q17.5 | ギャラリーページの命名 | single_select | Gallery / Collection / Styles |

### Round 5：オプション要素

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q18 | 追加セクション | multi_select | Google口コミ数値 / 採用セクション / FAQ / キッズ対応表示 / 物販・商品紹介 / ギフトカード / 縦書きアクセント / スタッフ個別ページ / ビフォーアフター / 駐車場情報 / 道順写真 / 特になし |
| Q19 | 写真素材 | single_select | 手元にある / まだない（プレースホルダー） |
| Q20 | 参考サイトURL | テキスト | 「なし」可→web_fetchで分析 |

### 回答→プリセット 自動マッピング

Q0（契約形態）→ SITEON/NovaTech判定。SITEONの場合はQ0.5でプラン判定→利用可能セクション・オプションを制限。

Q0.5（プラン）→ 参照ファイルの分岐：
```
スタンダード → SKILL.md + design-system.md + sections.md
プロ         → 上記 + multipage.md
プレミアム   → 上記 + multipage.md + premium.md
```

Q1（業態）→ 使用スキルの決定：
```
美容室 → lp-salon
バーバー → lp-barber
ネイル / エステ / まつエク → lp-nail-esthe
「複数店舗あり」と判明 → lp-salon-group
```

Q13×Q14 → CSSプリセット決定
Q15 → Conceptセクション HTML構造
Q16 → Heroセクション HTML構造（超ミニマルTOH型はプロ以上のみ）
Q17 → Galleryセクション HTML構造
Q17.5 → ギャラリー命名（Gallery / Collection / Styles）
Q9.5 → Reservationセクション HTML構造（4パターン）
Q10.5 → スタイリスト別料金フィールド追加
Q12 → メニュー表示形式（3パターン）
Q18 → 追加セクションON/OFF

**デザイン選択が発生する全ての場面で、Agentは最適な選択肢をおすすめとして提示し、Yuichiが最終判断する。**

---

# 2. lp-salon（女性向け美容室・ヘアサロン）

## 対象
女性客がメインの美容室・ヘアサロン。個人経営〜3名程度の小規模サロン。

## 参考サイト
ILOLI HAIR, GROEN, NANEA HAIR, GREENROOM, MILLOR, KORD, HAIR MAKE an, mile, TOH

## デザイン原則

1. 余白で語る — セクション間padding 120px（desktop）/ 72px（mobile）
2. 写真が主役 — テキストは添え物
3. ストーリーで巻き込む — 哲学・想いを詩的に語る
4. 彩度を抑える — ビビッドな色は使わない
5. 横線で区切る — セクション間に1px solid var(--line)

## セクション構成

### 必須セクション（全案件で含む）

| 順序 | セクション | ナンバリング | 概要 |
|------|-----------|-------------|------|
| 1 | Hero | — | 全画面写真＋中央ロゴ / スライドショー / 超ミニマル（TOH型） |
| 2 | Concept | 01 | 哲学・想い（3パターンから選択） |
| 3 | Features | 02 | こだわり3〜4つ（交互レイアウト） |
| 4 | Menu | 03 | 料金表（定義リスト / 写真カード / タブ切り替え） |
| 5 | Style Gallery | 04 | スタイル写真（横スクロール or LOOKBOOK）※命名選択可 |
| 6 | Staff | 05 | スタイリスト紹介（写真＋メッセージ） |
| 7 | Photo Gallery | 06 | サロン内装写真（グリッド＋英字キャプション） |
| 8 | Access | 07 | 住所・営業時間・Google Maps・お支払い方法 |
| 9 | Reservation | 08 | 予約UI（4パターンから選択） |
| 10 | CTA | — | ダーク背景の予約誘導 |
| 11 | Footer | — | ロゴ・SNS・コピーライト |

### 共通演出要素

| 要素 | 仕様 |
|------|------|
| マーキーテキスト | Conceptセクション前後に配置。英字キャッチフレーズ無限スクロール。CSS animationのみ |
| スクロールフェードイン | Intersection Observer。opacity 0→1 + translateY 12px→0。duration 0.7s |
| ヘッダースクロール変化 | transparent → 半透明背景 + border-bottom + backdrop-filter blur |
| モバイルスティッキーCTA | 画面下部に予約ボタン常時表示。padding-bottom追加 |

### オプションセクション

| セクション | 条件 | 仕様 |
|-----------|------|------|
| 予約UI：外部リンク | Q9.5＝外部リンク | HPB/LINE/電話ボタン。CTAに統合 |
| 予約UI：カレンダー | Q9.5＝カレンダー | 3ヶ月分月間カレンダー＋定休日マーク |
| 予約UI：フォーム | Q9.5＝フォーム | Formspree/Web3Forms送信 |
| 予約UI：ウィジェット | Q9.5＝埋め込み | STORES等のiframe |
| Google口コミ | Q18選択時 | ★ 4.8 / 120件以上 の数値バー |
| 採用（Recruit） | Q18選択時 | 募集文＋応募方法 |
| FAQ | Q18選択時 | アコーディオン形式。3〜5問 |
| キッズ対応 | Q18選択時 | Featuresにバッジ or 独立小セクション |
| 物販/商品紹介 | Q18選択時 | 商品カード3〜4枚＋外部ECリンク |
| ギフトカード | Q18選択時 | CTAにサブCTA追加 |
| 縦書きテキスト | Q18選択時 | writing-mode: vertical-rl |
| スタッフ個別ページ | Q18選択時 | staff/1.html等。指名予約率UP |
| ビフォーアフター | Q18選択時 | 施術前後の比較写真 |
| 駐車場情報 | Q18選択時 | Accessセクション内に追加 |
| 道順写真 | Q18選択時 | 駅からの道順を写真で案内 |
| プライバシーポリシー | フォーム設置時必須 | 個人情報保護法対応 |

## Conceptセクション 3パターン

### パターンA：3段構造（NANEA型）
各段にH3＋英字ラベル＋日本語本文。写真を挟みながら展開。
適する場面：語りたいことが多いオーナー、新規開業

### パターンB：ストーリー型（GREENROOM型）
1つの長い散文。写真は横に1枚。行間広く、max-width: 480px。
適する場面：サロン名に想いがあるオーナー

### パターンC：一言コピー型（OTOKO型）
キャッチは2〜3rem全幅。補足文は--text-midで控えめ。
適する場面：モード系トーン

## ヒーロー 3パターン

### パターン1：全画面写真＋中央ロゴ（GROEN型）
100vh、dark overlay、中央にサロン名＋キャッチ、Scrollインジケーター

### パターン2：スライドショー（maple型）
100vh、3〜5枚フェード切り替え、5秒間隔、ドットインジケーター

### パターン3：超ミニマル（TOH型）※プロ以上のみ
写真1枚＋ロゴのみ。お知らせ3〜5件。ナビゲーションが主役

## ギャラリー 2パターン + 命名選択

命名3択：Gallery / Collection / Styles（Q17.5で決定）

### パターン1：横スクロール（GROEN型）
flex + overflow-x: auto + scroll-snap。カード幅260px。

### パターン2：LOOKBOOKスライド（MILLOR型）
1枚ずつ大きく表示＋左右ナビ。ハッシュタグ表示。

## メニュー表示 3パターン

### パターン1：定義リスト型（ILOLI型）
カテゴリ別リスト。ドットリーダー。税込表記。

### パターン2：写真付きカード型（MILLOR型）
写真＋カテゴリ名＋説明文。2〜3列グリッド。

### パターン3：タブ切り替え型（mile/TOH型）
Cut/Color/Perm等のタブで切り替え。JS実装（CSS :targetフォールバック）

### メニュー追加情報

| 追加項目 | 条件 | 内容 |
|---------|------|------|
| 施術時間 | Q10.7＝あり | 各メニューに「約60分」等を表示 |
| 初回価格 | Q10.3＝あり | 「初回 ¥5,500 / 通常 ¥7,700」の併記 |
| スタイリスト別料金 | Q10.5＝あり | ランク別価格表示（3方式から最適を提案） |
| 「こんな方におすすめ」 | 任意 | 各メニューに1行添える |
| 使用薬剤 | 任意 | 「Avedaカラー使用」等 |

### スタイリスト別料金の表示方式

| 方式 | 内容 | 適するケース |
|------|------|-------------|
| A：列追加 | 料金表にランク列を追加 | スタッフ3名以下・メニュー少なめ |
| B：注釈 | メニュー名の横に注釈で展開 | メニュー数が多い場合 |
| C：ランク別タブ | スタイリスト/トップ/ディレクターのタブ切り替え | スタッフ多い・メニュー多い |

Agentが最適な方式をおすすめとして提示→Yuichiが選択。

## 予約UI 4パターン

### パターンA：外部リンク型（デフォルト）
CTAセクション内にHPB/LINE/電話ボタン。

### パターンB：営業カレンダー型（GROEN型）
3ヶ月分月間カレンダー＋定休日マーク＋予約案内ボタン。

### パターンC：予約フォーム型
Formspree/Web3Forms送信。日付/時間/メニュー/名前/電話/備考。仮予約の旨を明記。
※プライバシーポリシーページ必須。

### パターンD：予約ウィジェット埋め込み型
STORES予約・Airリザーブ等のiframe埋め込み。

## カラープリセット（lp-salon用）

### グレージュ × モード
```css
--bg: #F7F5F2; --bg-alt: #EFECE7; --bg-dark: #1C1B19;
--text: #1A1918; --text-mid: #44403B; --text-light: #6E6860;
--accent: #7A6A58; --line: #D4CDC3;
--r: 3px;
英字: Playfair Display; 和文見出し: Shippori Mincho;
```

### ナチュラル × 上品
```css
--bg: #FAF8F4; --bg-alt: #F2EDE5; --bg-dark: #2C2825;
--text: #2C2825; --text-mid: #5C5650; --text-light: #7A746C;
--accent: #6B8A5E; --line: #E0D8CC;
--r: 8px;
英字: Cormorant Garamond; 和文見出し: Zen Old Mincho;
```

### モノトーン × モード
```css
--bg: #F5F5F3; --bg-alt: #EAEAE7; --bg-dark: #111110;
--text: #111110; --text-mid: #3D3D3A; --text-light: #5E5E58;
--accent: #B09B72; --line: #D5D5D0;
--r: 0px;
英字: DM Serif Display; 和文見出し: Shippori Mincho;
```

### くすみカラー × 温もり
```css
--bg: #F8F4F2; --bg-alt: #F0EAE6; --bg-dark: #2A2425;
--text: #2A2425; --text-mid: #524A4C; --text-light: #7A7072;
--accent: #B5868A; --line: #E0D6D4;
--r: 12px;
英字: Cormorant Garamond; 和文見出し: Noto Serif JP;
```

## タイポグラフィ仕様

| 要素 | フォント | サイズ | Weight |
|------|---------|--------|--------|
| セクションナンバー | ディスプレイフォント | 0.72rem | 400 |
| セクション英字タイトル | ディスプレイフォント | clamp(2rem, 4.5vw, 2.8rem) | 400 |
| セクション日本語サブ | Shippori Mincho | 0.85rem | 400 |
| 本文 | Noto Sans JP | 14.5px | 300 |
| コンセプト文 | 和文見出しフォント | 0.92rem | 400 |
| メニュー名 | Noto Sans JP | 0.85rem | 300 |
| 価格 | ディスプレイフォント | 0.95rem | 400 |
| マーキー | ディスプレイフォント italic | 1rem | 300 |

## レスポンシブ仕様

| ブレークポイント | padding | グリッド | ヒーロー |
|----------------|---------|---------|---------|
| Desktop（1280px+） | 120px | 2〜3列 | 100vh |
| Tablet（768px） | 80px | 1〜2列 | 100vh |
| Mobile（375px） | 56px | 1列 | 100vh（min-height: 520px） |

## 技術仕様

- 単一HTMLファイル（CSS/JS inline）
- Google Fonts（font-display: swap、preconnect設定）
- セマンティックHTML（header/nav/main/section/footer）
- OGPメタタグ4種＋twitter:card
- JSON-LD構造化データ（HairSalon）
- Lighthouse各項目90点以上目標
- 全画像にalt属性（日本語）、loading="lazy"（ヒーロー除く）、width/height指定
- canonical URL（マルチページ時）
- viewport設定

---

# 3. lp-barber（メンズ・バーバー）

## 対象
メンズカット・バーバーショップ。フェードカット、シェービングが主力。

## 参考サイト
OTOKO DESIGN, Scissors & Scotch, Birds Barbershop, Blind Barber

## デザイン原則（lp-salonとの違い）

| 項目 | lp-salon | lp-barber |
|------|----------|-----------|
| 背景基調 | ライト | ダーク |
| フォント感 | 繊細・エレガント | 力強い・ソリッド |
| コピーのトーン | 詩的・優しい | 断言的・力強い |
| border-radius | 0〜12px | 0px |
| 写真のトーン | 柔らかい自然光 | ハイコントラスト |

## カラープリセット（lp-barber用）

### ダーク × ソリッド（デフォルト）
```css
--bg: #141312; --bg-alt: #1E1D1B; --bg-dark: #0A0A09;
--text: #E8E4DF; --text-mid: #A8A29B; --text-light: #6E6A64;
--accent: #C4A265; --line: #2E2D2A; --r: 0px;
英字: DM Serif Display; 和文見出し: Shippori Mincho;
```

### ダーク × ヴィンテージ
```css
--bg: #1A1714; --bg-alt: #231F1B; --bg-dark: #0D0B09;
--text: #E0D5C8; --text-mid: #9E9285; --text-light: #6B6158;
--accent: #B87333; --line: #332E28; --r: 0px;
英字: Playfair Display; 和文見出し: Noto Serif JP;
```

### ライト × カジュアル（Birds型）
```css
--bg: #F5F0E8; --bg-alt: #EBE5DA; --bg-dark: #1A1918;
--text: #1A1918; --text-mid: #4A4540; --text-light: #7A756E;
--accent: #C05835; --line: #D8D0C4; --r: 4px;
英字: DM Sans; 和文見出し: Noto Sans JP（weight: 500）;
```

---

# 4. lp-nail-esthe（ネイル・エステ・まつエク）

## 対象
ネイルサロン、エステサロン、まつエクサロン。

## デザイン原則（lp-salonとの違い）

| 項目 | lp-salon | lp-nail-esthe |
|------|----------|---------------|
| 写真の比率 | 3:4縦長 | 1:1正方形 |
| ギャラリーの比重 | バランス型 | ギャラリー最重要 |
| ビフォーアフター | オプション | エステではほぼ必須 |
| 色傾向 | グレージュ〜ナチュラル | フェミニン（ピンク・ラベンダー） |

## 業態別の追加セクション

**ネイル：** デザインギャラリー（4列グリッド）/ 定額デザインコース / 持ち込みデザイン案内 / オフ代・ケアメニュー

**エステ：** 施術フロー図 / ビフォーアフタースライダー / 初回体験コースCTA / お悩み別メニュー導線

**まつエク：** デザイン比較 / 本数別イメージ写真 / 素材別説明表

## カラープリセット（lp-nail-esthe用）

### フェミニン × 上品
```css
--bg: #FAF6F5; --bg-alt: #F2ECEB; --bg-dark: #2A2325;
--accent: #C4919A; --r: 12px;
英字: Cormorant Garamond; 和文見出し: Noto Serif JP;
```

### ラベンダー × 洗練
```css
--bg: #F7F5F9; --bg-alt: #EEEAF2; --bg-dark: #22202A;
--accent: #8E7BA8; --r: 8px;
英字: Playfair Display; 和文見出し: Shippori Mincho;
```

### ベージュ × ナチュラル（エステ向き）
```css
--bg: #F9F6F1; --bg-alt: #F0EBE3; --bg-dark: #28251F;
--accent: #A6896E; --r: 8px;
英字: Cormorant Garamond; 和文見出し: Zen Old Mincho;
```

---

# 5. lp-salon-group（多店舗・グループサロン）

## 対象
4店舗以上を運営するサロングループ・法人。

## 追加セクション
Salon List / Company・About / Topics・News / Recruit

## 構造
```
index.html       ← グループトップ
├── yamato.html  ← 各店舗ページ（lp-salonの構造を流用）
├── turuma.html
└── sakuragaoka.html
```

## カラープリセット
### コーポレート × クリーン
```css
--bg: #F5F5F3; --bg-alt: #EDEDEA; --bg-dark: #18181A;
--accent: #3A6B5C; --r: 4px;
英字: DM Sans; 和文見出し: Noto Sans JP（weight: 500）;
```

---

# SITEON サブスク型HP制作サービス設計

## サービス概要

NovaTechの受託制作事業と並行して運営。初期費用0円・月額制。

**棲み分け：**
- NovaTech受託：一括納品型。カスタム要件が多い案件。5〜20万円/件
- SITEON：月額型。セミオリジナル〜フルオリジナル。継続収入の柱

## 料金プラン

### スタンダード｜月額9,800円（税別）

| 項目 | 内容 |
|------|------|
| ページ数 | 1ページ（スクロール型） |
| デザイン | **セミオリジナル（プリセット48通り＋CSS変数調整）** |
| 参照ファイル | SKILL.md + design-system.md + sections.md |
| 月間修正 | 3回 |
| 予約UI | パターンAのみ |
| 制作時間 | 1〜2時間 |

### プロフェッショナル｜月額15,000円（税別）

| 項目 | 内容 |
|------|------|
| ページ数 | 5ページ＋ブログ |
| デザイン | セミオリジナル＋カスタム調整＋5ページ展開 |
| 参照ファイル | 上記 + multipage.md |
| 月間修正 | 5回 |
| 予約UI | A〜D全選択可 |
| SNS連携 | Instagram埋め込み / LINE友だち追加 |
| 予約システム | STORES予約 無料版 |
| ブログ | 静的HTML（推奨）or microCMS |
| 制作時間 | 3〜5時間 |

### 5ページ構成（プロ・プレミアム共通）

| ページ | ファイル名 | 内容 |
|--------|-----------|------|
| トップ | index.html | ヒーロー＋コンセプト要約＋メニュータブプレビュー＋スタッフ顔出し＋CTA。TOH型ミニマルも選択可 |
| About | about.html | コンセプト全文＋こだわり（Features）＋スタッフ紹介 |
| Menu | menu.html | タブ切り替え式全メニュー＋初回価格＋施術時間＋スタイリスト別料金 |
| Gallery | gallery.html | スタイル写真＋内装写真統合。命名選択可。ビフォーアフター。Instagram連携 |
| Info | info.html | アクセス＋Maps＋営業カレンダー＋予約UI＋FAQ＋お支払い方法＋駐車場＋道順 |

＋ブログ（別枠）＋スタッフ個別ページ（オプション）＋プライバシーポリシー（フォーム時必須）＋特定商取引法表記（EC時必須）

### プレミアム｜月額25,000円（税別）

| 項目 | 内容 |
|------|------|
| ページ数 | 5ページ＋ブログ（プロと同じ） |
| デザイン | **Figmaフルオリジナル** |
| 参照ファイル | 上記 + premium.md |
| 月間修正 | 10回 |
| EC機能 | 商品ページ（10商品まで）＋BASE/STORES連携 |
| SEO | 詳細（GBP最適化＋キーワード設計＋GA4＋月次レポート） |
| アニメーション | カスタム（ページ遷移効果等） |
| OGP画像 | Figmaカスタムデザイン |
| 写真撮影ディレクション | オンライン指示対応 |
| 制作時間 | 8〜15時間 |

### EC機能の範囲（プレミアムのみ）

**含まれるもの：** 商品紹介ページ（10商品まで）/ 外部EC（BASE/STORES）への導線 / 商品ギャラリー＋価格表示 / カートボタン（外部ECリンク）

**含まれないもの：** 独自カート・決済システム / 在庫管理 / 11商品以上（別途500円/月/商品）/ 定期購入

**カート・決済は自前で作らない。** セキュリティリスク・開発コスト・保守コストが見合わないため。BASE/STORESに任せ、NovaTechの価値は「見せ方」に集中する。

### プラン別スキル制約マッピング

| 機能 | スタンダード | プロ | プレミアム |
|------|------------|------|----------|
| ページ数 | 1ページ | 5ページ＋ブログ | 5ページ＋ブログ |
| デザイン | セミオリジナル | セミオリジナル＋カスタム | Figmaフルオリジナル |
| Hero | 全画面＋中央ロゴ固定 | 3種から選択 | 3種＋カスタム |
| Concept | 自動選択（1種） | 3種から選択 | 3種＋カスタム |
| ギャラリー | 横スクロール固定 | 2種＋命名選択 | 2種＋カスタム＋命名選択 |
| メニュー | 定義リスト固定 | 3種から選択 | 3種＋カスタム |
| 予約UI | Aのみ | A〜D全て | A〜D全て |
| スタイリスト別料金 | ✕ | ○ | ○ |
| タブ切り替えメニュー | ✕ | ○ | ○ |
| スタッフ個別ページ | ✕ | ○ | ○ |
| ビフォーアフター | ✕ | ○ | ○ |
| Google口コミ / 採用 / FAQ | ✕ | ○ | ○ |
| 物販/EC | ✕ | ✕ | ○ |
| ブログ | ✕ | ○ | ○ |
| SEO | 基本 | 基本 | 詳細（GBP+GA4+月次レポート） |
| アニメーション | 標準 | 標準 | カスタム |
| OGP | テンプレート | テンプレート | Figmaカスタム |

## 原価構造

| 項目 | 月額コスト |
|------|-----------|
| GitHub Pages | 0円 |
| ドメイン | 125〜250円 |
| SSL | 0円（GitHub Pages自動） |
| フォーム送信 | 0円（Formspree無料枠） |
| 予約システム | 0円（STORES予約無料枠） |
| **合計** | **125〜250円** |

## 粗利計算

| プラン | 月額売上 | 月額原価 | 粗利率 | 年間粗利 |
|--------|---------|---------|--------|---------|
| スタンダード | 9,800円 | 250円 | 97.4% | 114,600円 |
| プロ | 15,000円 | 250円 | 98.3% | 177,000円 |
| プレミアム | 25,000円 | 250円 | 99.0% | 297,000円 |

## 月間収益シミュレーション

| 段階 | スタンダード | プロ | プレミアム | 月額合計 |
|------|------------|------|----------|---------|
| 初期（3ヶ月目） | 5件 | 1件 | 0件 | 64,000円 |
| 成長期（6ヶ月目） | 10件 | 3件 | 1件 | 168,000円 |
| 安定期（12ヶ月目） | 20件 | 5件 | 2件 | 321,000円 |
| 目標（24ヶ月目） | 30件 | 10件 | 3件 | 519,000円 |

## 解約・契約終了時のルール

| 条件 | 対応 |
|------|------|
| 12ヶ月以内の解約 | 残契約月数×月額の50%を違約金 |
| 12ヶ月満了後の解約 | いつでも可能。翌月末停止 |
| 解約後のサイト | サーバーから削除。事前告知30日 |
| ドメイン移管 | 移管手数料3,000円 |
| データ買い取り | HTML一式50,000円で譲渡可能 |

## 予約システム推奨

**STORES予約を標準採用。** 複数メニュー対応。月100件まで無料。小規模サロン（月60〜80件）で十分。超える場合はSTORES有料プラン（月9,790円〜）をクライアント自身が契約。

## ブログ機能

推奨：静的HTMLブログ。更新フロー：クライアントLINE → Yuichi がClaude Code指示 → 記事生成 → git push → 自動反映（5分）。WordPress非推奨。

## 顧客獲得チャネル

| チャネル | 方法 | 想定CVR |
|---------|------|---------|
| X / Instagram | 制作事例・AI知識・業界情報の3軸発信 | 低（認知目的） |
| Instagram広告 | サロンオーナー向けターゲティング | 1〜3% |
| Googleリスティング | 「美容室 ホームページ 制作」等 | 3〜5% |
| Coconala・Lancers | 受託からSITEONアップセル | 10〜20% |
| サロン直営業 | Agent活用の3段階アプローチ | 10〜20% |
| 紹介 | 紹介特典（1ヶ月無料等） | 高 |

---

# 技術スタック方針

## WordPress不採用

理由：セキュリティリスク / 表示速度低下 / 保守コスト高

## 採用構成：静的HTML + Claude Code + GitHub

| 要素 | 役割 |
|------|------|
| 静的HTML | 表示速度最速。セキュリティリスクゼロ |
| Claude Code | 管理画面の代わり。一言指示で修正完了 |
| GitHub | バージョン管理＋デプロイ |
| GitHub Pages | 無料ホスティング。SSL自動。CDN付き |

## デプロイ方式

| パターン | 対象 | 月額コスト |
|---------|------|-----------|
| GitHub Pages（github.io） | デモサイト・初期提案 | 0円 |
| GitHub Pages + 独自ドメイン | **本番サイト（推奨）** | 約125〜250円（ドメイン代のみ） |
| Xserver | メールアドレスが必要な場合のみ | 約275〜550円 |

## 保守フロー

```
クライアント（LINE）→ Yuichi がClaude Codeに指示 → 修正 → git push → GitHub Pagesに自動反映
```

## 画像の扱い

| 場面 | 方法 |
|------|------|
| 開発中・デモ | placehold.co（プレースホルダー） |
| クライアント写真なし | Unsplash / Pexels（商用利用OK） |
| AI画像生成 | 内装イメージ等に限定。スタイル写真・スタッフ写真・商品写真には使わない |

## 将来の管理画面対応

| 顧客数 | 管理方法 |
|--------|---------|
| 1〜30件 | Claude Codeに指示（現行） |
| 30件超で人を雇う時 | 担当者もClaude Codeで指示（日本語だけでOK） |
| 50件超 | 管理画面を構築（コード不要で操作可能に） |

---

# 共通コンポーネント仕様

## マーキーテキスト
テキスト2回繰り返し。CSS animation（25s linear infinite）。ディスプレイフォント italic。

## セクション区切り線
1px solid var(--line)。max-width: var(--mw)。

## 予約ボタン配置箇所（5箇所）
ヘッダーナビ内 / ヒーロー内 / メニューセクション下 / フッターCTA / モバイルスティッキー

## スクロールアニメーション
Intersection Observer。threshold: 0.06。translateY 12px→0 + opacity 0→1。

---

# Figma連携ワークフロー

## Skill → Figma
ヒアリング → サイト生成 → /figma-capture でFigmaにキャプチャ → クライアント共有・微調整 → フィードバック → コード更新

## Figma → Skill（プレミアム）
Figmaでデザイン作成 → Figma MCPでデザイン情報取得 → スキルの構造に従ってコード生成

---

# ローカルSEO対策

## Googleビジネスプロフィール（GBP）

設定必須項目：ビジネス名・住所・電話番号・カテゴリ・営業時間・写真・ウェブサイトURL・説明文

**NAP一貫性：** サイト内・GBP・Hot Pepper・SNS全てで完全一致。表記ゆれ禁止。

## 構造化データ
JSON-LD。@type: HairSalon（業態別）。openingHoursSpecification / geo / aggregateRating / hasMap / FAQPage

## titleタグ
パターン：`[サロン名]｜[エリア名] [最寄り駅]の[業態]｜[特徴キーワード]`

---

# 日本語フォント最適化

- ウェイト最小化（最大3つ：300/400/500）
- font-display: swap 必須
- preconnect 必須
- fallbackスタック必須

---

# SNS連携仕様

## Instagram
小規模サロンはリンクのみ。SNS重視ならSnapWidget。

## LINE
友だち追加ボタン設置。リッチメニューデザインをサイトと統一。

## OGP画像
1200×630px。中央60%以内にテキスト配置。

---

# 保守・更新マニュアル

## 更新方法

全ての更新はClaude Codeに一言指示するだけ。

## 月額保守プラン

| プラン | 内容 | 月額 |
|--------|------|------|
| ライト | テキスト修正月2回 | 3,000円 |
| 標準 | テキスト＋写真月4回＋カレンダー | 5,000円 |
| フル | 標準＋月次SEOレポート＋改善提案 | 10,000円 |

---

# 納品チェックリスト

## 全スキル共通
- [ ] モバイル（375px）全セクション崩れない
- [ ] ナンバリング表記統一
- [ ] 予約ボタン全箇所機能
- [ ] フォント読み込み正常
- [ ] 全画像にalt属性
- [ ] OGP設定済み（4種+twitter:card）
- [ ] JSON-LD構造化データ設定済み
- [ ] Lighthouse全項目90点以上
- [ ] tel:リンク機能
- [ ] 税込表記統一
- [ ] セクション間余白100px以上（desktop）
- [ ] コントラスト比WCAG 2.1 AA準拠
- [ ] マーキーテキスト動作
- [ ] セクション区切り線統一
- [ ] canonical URL設定（マルチページ時）
- [ ] viewport設定
- [ ] プライバシーポリシー（フォーム設置時）
- [ ] 特定商取引法表記（EC時）

## SITEON案件追加
- [ ] GitHub Pages デプロイ済み
- [ ] 独自ドメイン設定・DNS反映済み
- [ ] SSL証明書有効
- [ ] フォーム送信テスト完了
- [ ] 予約システム連携確認
- [ ] GBPにサイトURL設定
- [ ] クライアントに更新依頼方法（LINE）を案内済み
- [ ] GitHubリポジトリ作成・初回push完了

## 納品パッケージ

```
delivery/
├── index.html（＋マルチページ時：about.html等）
├── assets/（ogp.png / favicon等）
├── docs/（README.md / photo-guide.pdf等）
└── original/（design-spec.md）
```

---

# 料金・見積もりガイドライン

## Coconala・Lancers出品価格

| プラン | 価格帯 | 作業時間 |
|--------|--------|---------|
| ライト | 5〜8万円 | 2〜3時間 |
| スタンダード | 8〜12万円 | 3〜5時間 |
| プレミアム | 12〜20万円 | 5〜8時間 |

## オプション単価

| オプション | 追加料金 |
|-----------|---------|
| 予約フォーム（パターンC） | +2万円 |
| ウィジェット設置（パターンD） | +1万円 |
| カレンダー（パターンB） | +1.5万円 |
| LOOKBOOKギャラリー | +1.5万円 |
| Google口コミ連携 | +0.5万円 |
| 採用セクション | +1万円 |
| FAQ | +0.5万円 |
| 物販/商品セクション | +1.5万円 |
| スタッフ個別ページ（1名） | +1万円 |
| タブ切り替えメニュー | +1万円 |
| 写真撮影ディレクション | +3万円 |
| GBP初期設定代行 | +2万円 |

---

# クライアント向け写真撮影ガイド

## 必要枚数
ヒーロー1〜3枚 / 内装3〜6枚 / スタイル6〜12枚 / スタッフ人数分 / 施術風景1〜3枚 / 合計12〜20枚以上

## 撮影のコツ
内装：自然光（午前〜14時）。広角モードで角から対角線。私物片付け。鏡に映り込み注意。
スタイル：白壁or シンプル背景。窓際自然光。正面/45度/後ろの3方向。仕上げ直後。
スタッフ：自然な笑顔。胸から上。同じ場所・同じ光で統一。

## フォールバック
1. placehold.coプレースホルダー → 写真揃い次第差し替え
2. Unsplash/Pexels → 「実際のサロンではない」旨明記
3. AI画像生成 → 内装イメージのみ。スタイル写真不可

---

# 多言語対応の基盤設計

現時点では不要。将来に備えて英字ラベル＋日本語サブの二重表記を維持。英語要素にlang="en"個別指定。

---

# アクセシビリティ具体チェック項目

## 実装必須
スキップナビゲーション / aria-expanded・aria-label / フォーカストラップ / prefers-reduced-motion / フォームlabel紐付け / alt属性ルール / focus-visible / コントラスト比4.5:1 / タップ44px / 色だけに依存しない情報伝達

---

# エラーハンドリング・フォールバック

## フォント：fallbackスタック必須
## 画像：bg-alt背景にaltテキスト表示
## JS無効時：noscript対応（フェードイン→常時表示 / ナビ→フル表示 / マーキー→静止 / タブ→全展開）
## iframe失敗時：電話番号フォールバック

---

# 制作優先順位

| 優先度 | スキル | 理由 |
|--------|--------|------|
| 1 | lp-salon | 最も案件数が多い。SITEON基盤 |
| 2 | salon-interview | lp-salonと連携。入口 |
| 3 | lp-barber | 差別化が大きい |
| 4 | lp-nail-esthe | ギャラリー構成が異なる |
| 5 | lp-salon-group | 高単価だが頻度低い |
| 6 | SITEON LP | サービス集客用LP |
| 7 | lp-corporate | 会社LP（参考サイト分析後） |
| 8 | lp-restaurant | 飲食店（参考サイト分析後） |
| 9 | lp-architect | 建築（参考サイト分析後） |

## 将来の業態展開

全業態で共通基盤（_common/・rules.md・顧客管理・Agent）を流用。業態固有はSKILL.md + references/ のみ新規作成。2業態目からは半分以下の時間で作成可能。

**サロン系スキル完成後、Yuichiに各業態の参考サイトURLを依頼する。**

---

# cc-company / cc-secretary 将来統合

スキル完成後にcc-companyの部署構成をNovaTech向けにカスタマイズ。

| 部署 | 担当 | 対応するAgent活用 |
|------|------|------------------|
| 秘書室 | 窓口・TODO・報告 | 全体統括 |
| CEO | 意思決定・振り分け | 全体統括 |
| 営業部 | リスト・DM・アップセル | ①②③ |
| 制作部 | ヒアリング・サイト生成 | スキル連携 |
| 品質管理 | Lighthouse・ルール準拠 | rules.md |
| 保守部 | 月次保守・カレンダー更新 | ④ |
| マーケ部 | SNS運用・コンテンツ | ⑤ |
| リサーチ部 | 市場調査・競合分析 | ⑥ |
| 経理部 | 請求・売上レポート | 顧客管理 |

導入タイミング：スキル完成後＋顧客5件超えた時。

---

# 既存スキルとの統合方針

## 残す（そのまま活用）
/clone-site / /web-design-reviewer / /seo-check / /figma-capture / /codex:rescue / /social-content / /cold-email / /seo-audit / /copywriting / /pricing-strategy / 他の汎用・システムスキル全て

## 改修
| スキル | 変更内容 |
|--------|---------|
| /client-site | 入口として残し、業態選択→各interviewスキルへ分岐する構造に変更 |
| /deploy | GitHub Pages push対応を追加 |
| /estimate | SITEONプラン料金表と連携 |

## 新規作成
/salon-interview / /lp-salon / /lp-barber / /lp-nail-esthe / /lp-salon-group（以降の業態は将来）

## 使わないが保険として残す
/wp-theme — WordPress案件が来た場合の特別対応用。SITEONの標準サービスとしては提供しない。
---

# Codex設定・AGENTS.md

## 設定ファイル一覧

| ファイル | 保存場所 | 役割 |
|---------|---------|------|
| AGENTS.md | novatech-siteon-skills/ ルート | Codexが毎回自動で読む基本指示 |
| .codex/config.toml | novatech-siteon-skills/.codex/ | プロジェクト固有のCodex設定 |
| ~/.codex/config.toml | /Users/satouyuuichi/.codex/ | Codexグローバル設定（デフォルト場所のまま） |

## ~/.codex/config.toml（グローバル設定）

デフォルトの場所（隠しフォルダ）にそのまま配置。Yuichiが直接触る必要はなく、Claude Codeに指示すれば編集可能。

```toml
# ~/.codex/config.toml
model = "gpt-5.4"

[sandbox_workspace_write]
network_access = false
```

## .codex/config.toml（プロジェクト設定）

```toml
# novatech-siteon-skills/.codex/config.toml
model = "gpt-5.4"
```

## AGENTS.md（Codex基本指示）

```markdown
# NovaTech Codex 基本指示

## あなたの役割
NovaTech / SITEONのコード・コンテンツ生成担当。
Claude Codeからの指示に従い、大量のテキスト・コード・データを正確に出力する。

## 絶対に守ること
- Inter / Arial / Roboto / Helvetica は使用禁止
- HTMLはセマンティック（header/nav/main/section/footer）
- CSS変数（--bg, --accent等）を必ず使用。ハードコードしない
- 全imgにalt属性（日本語）、width、height
- コメントは日本語で記述
- 出力は指示されたフォーマットに厳密に従う
- 判断が必要な場合は自分で判断せず「判断が必要です」と返す

## 出力ルール
- HTMLファイルはlang="ja"から開始
- CSSは<style>タグ内にinline
- JSは<script>タグ内にinline
- 外部ファイルに分割しない
- ファイル冒頭に<!-- Generated by Codex for NovaTech -->コメント

## 禁止事項
- デザインを勝手に変更しない
- 指示にないフォント・色・レイアウトを追加しない
- CSS変数の値を勝手に変更しない
```

---

# Claude Code と Codex の役割分担

## 基本原則

```
Claude Code = 経営者・管理職（判断・計画・監督）
Codex       = 実務担当者（全ての出力作業）

原則：Claude Codeが1行でも文章やコードを自分で書こうとしたら、
     それはCodexに任せるべき作業。
```

## Claude Code の担当（管理・監督・指示）

- 何をやるか決める（計画）
- どの方法が最適か選ぶ（判断）
- Codexに具体的な指示を出す（指示）
- Codexの出力をチェックする（監督）
- git操作・API呼び出しを実行する（実行）
- エラーの原因を分析する（分析）
- 顧客ステータスを管理する（管理）

## Codex の担当（全ての出力作業）

- HTML/CSS/JS サイト生成
- JSON データ生成・整形
- Markdown ドキュメント（README・レポート・マニュアル・議事録等）
- メール文面（返信・通知・請求案内・契約更新案内等）
- 営業DM・提案書・見積書等の文書一括生成
- SEOテキスト（title/description/JSON-LD）一括生成
- SNS投稿文・ブログ記事の生成
- Notion更新用コンテンツ生成
- Google Sheets用データ生成
- 口コミ返信文の一括生成
- 法的文書テンプレート（プライバシーポリシー・特商法表記・契約書ドラフト）
- FAQ・コンセプト文・キャッチコピー
- Changelog・更新履歴の生成
- サロンカルテの整形
- Googleフォームの質問項目テキスト生成

## サブエージェント・cc-company での適用

cc-companyの各部署、サブエージェントからの出力作業も同様にCodexに委任する。

```
各部署（Claude Code）→ 判断・計画 → Codexに出力指示 → 出力チェック → 採用
```

## Plusプランでの段階的運用

Codexにはプランに応じたトークン使用制限がある。
ChatGPT Plusプランでは利用量が限られるため、段階的に運用する。

### フェーズ1：Plus のまま（今〜成約3件）

```
Codex優先で任せる：
  ★ HTML/CSS/JS サイト生成（最も出力量が多く、コスト差が最大）
  ★ JSON データ生成・大量のDM一括生成

Claude Codeが対応：
  メール返信・レポート要約等の短い文書（量が少ないうちは許容）
```

### フェーズ2：Pro にアップグレード（成約3件超）

```
全ての出力作業をCodexに委任（本来の設計通り）
月$200はSITEON3件分（月29,400円）で回収可能
4件目から利益
```

### フェーズ3：スケール時（成約10件超）

```
Proのまま or APIキー利用に切り替え（使用量を見て判断）
APIキー：上限なし・従量課金。月$200相当使うならProの方が得
```

### Codexのコスト節約策

| 策 | 内容 |
|-----|------|
| モデル選択 | 軽い作業はgpt-5.4-miniを使う（消費クレジット少ない） |
| 指示の精度 | 1回で正確に出力させる（やり直しがクレジットの無駄） |
| AGENTS.md | 事前ルール設定で出力品質UP→やり直し削減 |
| バッチ処理 | 複数の小さな依頼を1回にまとめる |

---

# ファイル保存場所ルール

## ローカルフォルダ構成

```
/Users/satouyuuichi/Developer/
├── novatech-siteon-skills/           ← GitHub連携
│   ├── .claude/
│   │   ├── CLAUDE.md
│   │   ├── rules.md
│   │   ├── git-workflow.md
│   │   ├── quality.md
│   │   ├── siteon-workflow.md
│   │   ├── agent-operations.md
│   │   ├── client-management.md
│   │   ├── wp-theme.md
│   │   └── lessons.md
│   ├── .codex/
│   │   └── config.toml
│   ├── AGENTS.md
│   ├── _common/
│   │   ├── components.md
│   │   ├── reservation-ui.md
│   │   └── seo-base.md
│   └── skills/
│       ├── salon-interview/
│       ├── lp-salon/
│       ├── lp-barber/
│       ├── lp-nail-esthe/
│       ├── lp-salon-group/
│       └── ...（将来の業態）
│
├── novatech-siteon-business/         ← GitHub連携
│   ├── clients/
│   │   ├── prospects.json
│   │   ├── active.json
│   │   └── churned.json
│   ├── reports/
│   ├── sales/
│   └── sns/
│
├── novatech-siteon-client-bloom/     ← GitHub連携（1サロン1リポ）
│   ├── index.html
│   ├── assets/
│   └── ...
│
└── novatech-siteon-client-kord/      ← GitHub連携
    └── ...

（Codexグローバル設定は ~/.codex/config.toml デフォルト場所のまま）
```

## 保存場所ルール表

| データの種類 | 保存先 | GitHub |
|------------|--------|--------|
| スキル・ルール・共通基盤 | Developer/novatech-siteon-skills/ | ✅ |
| 顧客管理JSON | Developer/novatech-siteon-business/clients/ | ✅ |
| 月次レポート | Developer/novatech-siteon-business/reports/ | ✅ |
| 営業資料・DM文面 | Developer/novatech-siteon-business/sales/ | ✅ |
| SNS投稿コンテンツ | Developer/novatech-siteon-business/sns/ | ✅ |
| クライアントサイト | Developer/novatech-siteon-client-{名前}/ | ✅ |
| デモサイト | Developer/novatech-siteon-client-{名前}/ | ✅ |
| Codexグローバル設定 | ~/.codex/config.toml | ❌ ローカル |
| APIキー・認証情報 | ローカル | ❌ |
| 契約書・請求書 | Google Drive | ❌ |
| クライアント写真（大容量） | Google Drive | ❌ |

## 命名ルール

| 対象 | 命名規則 | 例 |
|------|---------|-----|
| クライアントサイトリポ | novatech-siteon-client-{サロン名英語小文字} | novatech-siteon-client-bloom |
| 顧客JSON内のID | 3桁連番 | 001, 002, 003 |
| レポートファイル | YYYY-MM-{種類}.md | 2026-04-monthly.md |
| SNS投稿ファイル | YYYY-MM-DD-{プラットフォーム}.md | 2026-04-15-instagram.md |
| ブランチ名 | main のみ | main |
| コミットメッセージ | v{番号} {要約} | v1.2 メニュー価格更新 |

## Claude Code / Codex が守るルール

1. 新規ファイルは必ず上記の保存先ルールに従う
2. Developer/ 配下以外にプロジェクトファイルを作らない
3. GitHub連携リポジトリのファイルを変更したら必ず add→commit→push
4. APIキー・パスワードは絶対にGitHubリポジトリに入れない
5. クライアントサイトは必ず novatech-siteon-client- プレフィックスを付ける
6. 大容量ファイル（画像10MB以上）はGoogle Driveに保存

---

# Gmail 問い合わせ処理フロー

## 使用メールアドレス

事業用：novatech.siteon@gmail.com

## 問い合わせ経路

| 経路 | 場面 |
|------|------|
| Gmail | サイトのフォーム（Formspree）からの通知 |
| Gmail | Coconala・Lancersからの案件通知 |
| Gmail | 直営業への返信 |
| Instagram DM | SNS経由の問い合わせ |
| LINE | 既存クライアントからの連絡 |

## 処理フロー

```
問い合わせメール着信（novatech.siteon@gmail.com）
  ↓
Agent（Claude Code）が /gws-gmail で検知・分類（判断作業）
  ↓
分類：
  A：新規制作の相談
    → 顧客管理JSONに見込み客として登録
    → Sheetsに追加
    → Codexが返信文を生成
    → Yuichiに通知

  B：既存クライアントの更新依頼
    → 該当クライアント情報を表示
    → 対応方法を提案
    → Yuichiに通知

  C：Coconala・Lancersの案件通知
    → 案件内容を要約
    → SITEONアップセル提案の可否を判断
    → Codexが提案文を生成
    → Yuichiに通知

  D：その他（営業メール・スパム等）
    → 重要度判定→不要はスキップ
  ↓
Yuichiが確認→承認
  ↓
Claude Code が /gws-gmail で送信
  送信元：novatech.siteon@gmail.com
```

## Formspreeからの通知の流れ

```
お客様がサイトのフォームに入力
  ↓
Formspreeが処理
  ↓
2箇所に通知：
  ① novatech.siteon@gmail.com → Agent が検知・対応
  ② クライアントのメール → クライアントが直接対応（予約等）
```

NovaTech/SITEONへの問い合わせのみをGmailで管理。サロンへの予約問い合わせはクライアント自身が対応。

## Codex が生成するメール文面の種類

| 種類 | 場面 |
|------|------|
| 問い合わせ返信 | 新規相談への初回返信 |
| フォローメール | 検討中クライアントへの追客 |
| 納品完了通知 | サイト完成時の案内 |
| 請求案内 | 月額請求の通知 |
| 契約更新案内 | 12ヶ月満了時の更新確認 |
| 保守報告 | 月次保守完了の報告 |

全てCodexが生成→Claude Codeがチェック→Yuichi承認→送信。

---

# 画像の扱いルール

| 場面 | 方法 |
|------|------|
| 開発中・デモ | placehold.co（https://placehold.co/幅x高さ） |
| クライアント写真なし | Unsplash / Pexels（商用利用OK） |
| AI画像生成 | 内装イメージ等に限定 |

### AI画像生成の制限

| 用途 | AI生成 | 理由 |
|------|--------|------|
| サロン内装イメージ | ○ | 雰囲気伝達目的なら十分 |
| OGP背景・テクスチャ | ○ | 背景用途 |
| スタイル写真（ヘアスタイル） | ✕ | AIとわかると信頼を失う |
| スタッフ写真 | ✕ | 実在人物でないとダメ |
| 商品写真（EC） | ✕ | 実物写真が必要 |

---

# 作成物リスト（Claude Codeへの移行時）

| # | 作成物 | 作成者 | 形式 |
|---|--------|--------|------|
| 1 | 設計書 v2.0 最終版 | このチャット（Claude） | Markdown ✅完了 |
| 2 | .claude/配下の全ファイル | Codex（Claude Code経由） | Markdown |
| 3 | AGENTS.md | Codex（Claude Code経由） | Markdown |
| 4 | 業態別ヒアリングシート | Codex（Claude Code経由） | Google Sheets用 |
| 5 | 全決定事項クイックリファレンス | Codex（Claude Code経由） | Notion |
| 6 | Yuichiの処理一覧＋手順書 | Codex（Claude Code経由） | Notion |

## Claude Codeへの移行手順

| Step | 作業 | Yuichiの作業 | 所要時間 |
|------|------|-------------|---------|
| 1 | GitHubリポジトリ作成 | Claude Codeに「リポジトリ作って」と指示 | 10分 |
| 2 | 既存スキルのバックアップ | Claude Codeに指示 | 5分 |
| 3 | 設計書v2.0をリポジトリに配置 | Claude Codeに渡す | 5分 |
| 4 | 共通基盤ファイル作成 | Claude Codeに「設計書を読んで作って」と指示 | 30分 |
| 5 | サロン系スキル作成 | Claude Code + Codex | 確認のみ |
| 6 | テスト生成・調整 | 確認・修正指示 | 1〜2時間 |
| 7 | ヒアリングシート作成 | Googleフォーム反映 | 1時間 |
| 8 | 顧客管理構築 | Claude Codeに指示 | 確認のみ |
| 9 | 本番運用開始 | — | — |
