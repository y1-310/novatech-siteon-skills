---
name: architect-interview
description: 建築事務所・工務店・リノベーション会社向けのヒアリングスキル。質問形式・Googleフォーム・Agent自動収集の3パターンでクライアント情報を収集し、業態判定後にlp-architectを呼び出す。建築・工務・リノベ系案件の起点となる必須スキル。
---

# architect-interview — 建築事務所・工務店・リノベ向けヒアリングスキル

## 目的
質問形式またはGoogleフォームでクライアント情報を収集し、最適なスキル＋プリセットを自動選択してサイト生成する。

## ヒアリングの入口（3パターン）

| 入口 | 場面 | データの流れ |
|------|------|------------|
| 質問形式（architect-interview） | 対面・オンライン打合せ | リアルタイムで回答→JSON生成 |
| Googleフォーム | 非対面・LINE完結 | クライアント記入→Sheets→Agent がJSON変換 |
| Agent自動収集 | デモサイト先行作成（営業用） | 既存サイトやSNSから情報収集→JSON自動生成 |

3つの入口いずれも最終的にJSONに変換され、同じスキルで処理される。

**Googleフォーム URL**: https://docs.google.com/forms/d/e/1FAIpQLSeiwuMve4CPzavuR7JH3oAiR5CYCT-haIDgoK2WhLCa6H6VQg/viewform

## ヒアリング項目（全6ラウンド）

### Round 0：契約形態

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q0 | 契約形態は？ | single_select | SITEON サブスク / NovaTech 受託（買い切り） |
| Q0.5 | （SITEON時）プランは？ | single_select | スタンダード / プロフェッショナル / プレミアム |

### Round 1：基本情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q1 | 業態は？ | single_select | 設計事務所 / 工務店 / リノベーション会社 / その他 |
| Q1.5 | 主な対象は？ | single_select | 住宅（新築） / 住宅（リフォーム） / 店舗・商業 / マンションリノベ / 複合 |
| Q2 | 事務所名（英語） | テキスト | 例：KOCOCHI ARCHITECT |
| Q3 | 日本語サブ | テキスト | 例：設計事務所 |
| Q4 | エリア・最寄り駅 | テキスト | 例：福岡市中央区 / 薬院駅徒歩5分 |
| Q5 | 住所 | テキスト | — |

### Round 2：営業情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q6 | 営業時間 | テキスト | — |
| Q7 | 定休日 | テキスト | — |
| Q8 | 電話番号 | テキスト | — |
| Q8.5 | お支払い方法 | multi_select | 現金 / 銀行振込 / クレジットカード / PayPay / その他 |
| Q9 | 問い合わせ方法 | multi_select | フォーム / 電話 / メール / LINE / その他 |
| Q9.5 | 問い合わせUIの表示形式 | single_select | 外部リンクのみ / 営業カレンダー表示 / 問い合わせフォーム設置 / 問い合わせウィジェット埋め込み |

### Round 3：サービス・実績

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q10 | 主要サービス＋価格目安 | テキスト | 例：設計監理料 工事金額の10% |
| Q10.3 | 初回相談の案内はありますか？ | single_select | あり / なし |
| Q10.5 | 施工事例の数 | single_select | 3件以下 / 4〜10件 / 11件以上 |
| Q10.7 | サービスごとの期間目安を表示しますか？ | single_select | あり / なし |
| Q11 | 資格・受賞歴 | テキスト | 「あとで」可 |
| Q12 | Worksの表示形式 | single_select | グリッド一覧（STUDIO YY型） / 大写真＋テキスト（Kocochi型） / カテゴリタブ（marutaHOUSE型） |

### Round 4：デザインの方向性

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q13 | 建築4類型 | single_select | 作品主導型（Portfolio First） / 思想主導型（Philosophy First） / 工程説明型（Process Oriented） / 暮らし提案型（Lifestyle） / おまかせ |
| Q14 | ※architect判定時はQ13に統合して非表示 | — | — |
| Q15 | コンセプトの語り方 | single_select | 設計思想を端的に見せる（Kocochi型） / ストーリーで信頼を積む（Toivo型） / 一言コピーで引き締める（STUDIO YY型） / おまかせ |
| Q16 | Heroのスタイル | single_select | 全画面写真＋中央ロゴ / スライドショー / 超ミニマル / おまかせ |
| Q17 | Worksの表示形式 | single_select | グリッド一覧 / 大写真+テキスト / カテゴリタブ / おまかせ |
| Q17.5 | Worksページの命名 | single_select | Works / Projects / Case Study |

### Round 5：オプション要素

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q18 | 追加セクション | multi_select | ヒーロー直下CTA / 建築家紹介 / 設計料について / Google口コミ / 設計料目安 / ブログ・コラム / 受賞歴 / 商品ライン / 性能数値 / イベント / モデルルーム / ビフォーアフター / 費用ガイド / 採用 / 特になし |
| Q18.fee | 設計料選択時：表示方法 | single_select | 具体比率型 / 目安誘導型 / おまかせ |
| Q18.review | Google口コミ選択時：表示形式 | single_select | 数値バーのみ / 全文カード型 / 両方 |
| Q19 | 写真素材 | single_select | 手元にある / まだない（プレースホルダー） |
| Q20 | 参考サイトURL | テキスト | 「なし」可→web_fetchで分析 |

## 回答→プリセット 自動マッピング

### Q0（契約形態）→ SITEON/NovaTech判定
SITEONの場合はQ0.5でプラン判定→利用可能セクション・オプションを制限。

### Q0.5（プラン）→ 参照ファイルの分岐
```
スタンダード → SKILL.md + design-system.md + sections.md
プロ         → 上記 + multipage.md
プレミアム   → 上記 + multipage.md + premium.md
```

### Q1（業態）→ 使用スキルの決定
```
設計事務所 → lp-architect
工務店 → lp-architect
リノベーション会社 → lp-architect
その他 → lp-architect
```

### Q13×Q14 → CSSプリセット決定
各スキルの design-system.md のプリセット表を参照。

### デザイン選択のマッピング
| 質問 | 決定する内容 |
|------|------------|
| Q15 | Philosophy / Conceptセクション HTML構造（3パターン） |
| Q16 | Heroセクション HTML構造（3パターン。超ミニマルはプロ以上のみ） |
| Q17 | Worksセクション HTML構造（3パターン） |
| Q17.5 | Works命名（Works / Projects / Case Study） |
| Q9.5 | Contactセクション HTML構造（4パターン） |
| Q10.5 | Works件数に応じた見せ方の密度調整 |
| Q12 | Works表示形式の初期提案 |
| Q18 | 追加セクションON/OFF |

## プラン別の制約適用

スタンダードプラン選択時、以下は自動的に固定：
- Hero → 全画面写真＋中央ロゴ（パターン1固定）
- Concept → 自動選択（1種）
- Works → グリッド一覧（パターン1固定）
- Contact UI → パターンAのみ
- オプションセクション → 全て✕

**デザイン選択が発生する全ての場面で、Agentは最適な選択肢をおすすめとして提示し、Yuichiが最終判断する。**

## 出力フォーマット（JSON）

ヒアリング完了後、以下のJSON形式で結果を出力し、該当スキルに渡す。

```json
{
  "contract": {
    "type": "siteon",
    "plan": "standard"
  },
  "basic": {
    "business_type": "設計事務所",
    "target_type": "住宅（新築）",
    "name_en": "KOCOCHI ARCHITECT",
    "name_ja": "設計事務所",
    "area": "福岡市中央区 / 薬院駅徒歩5分",
    "address": "福岡県福岡市中央区...",
    "tel": "092-123-4567",
    "hours": "10:00〜18:00",
    "holiday": "水曜・祝日",
    "payment": ["銀行振込", "クレジットカード"]
  },
  "contact": {
    "methods": ["フォーム", "電話", "メール"],
    "ui_type": "external_link"
  },
  "services": {
    "items": [
      {"name": "新築住宅の設計監理", "price": "工事金額の10%", "duration": "約6〜10ヶ月"},
      {"name": "マンションリノベーション", "price": "工事金額の12%", "duration": "約3〜6ヶ月"}
    ],
    "has_first_consultation": true,
    "works_count": "4〜10件",
    "show_duration": true,
    "display_type": "grid"
  },
  "about": {
    "qualifications_awards": [
      "一級建築士",
      "2025年度 住宅デザインアワード入賞"
    ]
  },
  "works": [
    {
      "title": "光庭のある家",
      "category": "住宅（新築）",
      "area": "福岡県福岡市",
      "year": "2025",
      "summary": "中庭を中心に光と風を取り込む木造住宅。"
    }
  ],
  "design": {
    "color_direction": "ホワイト×ナチュラル",
    "tone": "静謐・上品",
    "preset": "white_natural",
    "concept_pattern": "A",
    "hero_pattern": 1,
    "works_pattern": 1,
    "works_name": "Works",
    "services_pattern": 1
  },
  "options": {
    "fee_price": false,
    "blog_column": false,
    "awards": false,
    "lineup": false,
    "performance": false,
    "event": false,
    "model_room": false,
    "before_after": false,
    "cost_guide": false,
    "recruit": false
  },
  "photos": {
    "status": "placeholder"
  },
  "reference_url": ""
}
```

## 処理フロー

```
1. /client-site から起動（業種＝建築系選択時）
2. Round 0〜5 を順番にヒアリング
   - 質問形式：1問ずつ提示。「あとで」も受け付ける
   - Googleフォーム：Sheets回答をJSON変換
   - Agent自動収集：既存サイトやSNSから情報取得→JSON自動生成
3. プラン判定→制約適用
4. プリセット自動マッピング
5. JSON出力
6. 業態判定→該当スキル呼び出し
   設計事務所 → lp-architect
   工務店 → lp-architect
   リノベーション会社 → lp-architect
   その他 → lp-architect
7. スキルがJSONを受け取り→サイト生成開始
```
