# salon-interview — サロン向けヒアリングスキル

## 目的
質問形式またはGoogleフォームでクライアント情報を収集し、最適なスキル＋プリセットを自動選択してサイト生成する。

## v2.1：3モデル振り分け
- **Claude Code**：質問形式での対面ヒアリング、業態判定、プリセット決定、最終 JSON 検証
- **Kimi K2.5**：Google フォーム回答→JSON 変換 / HPB・Instagram からのスクレイピング・情報抽出（マルチモーダル） / サロンカルテ整形
- **Codex**：本スキルでは出力タスクなし（後続の lp-* スキルで使用）

3モデル共通ルールは `.claude/shared-context.md` を参照。

## デモサイト生成時の自動データ生成ルール

営業用デモサイトを生成する場合（実クライアントのヒアリング前）、hearing.json は以下を自動生成すること。**空白・プレースホルダー文字列のまま残さない。**

| フィールド | ルール |
|-----------|--------|
| `name_en` / `name_ja` | 業態に合った架空の店舗名をランダム生成（美容室なら BLOOM / LUMIE / NÖA など、バーバーなら IRON & OAK / BLADE など、ネイルなら lila / mua など、エステなら soin / élu など） |
| `address` | 実在しない住所を生成（都道府県＋実在しない番地。例：東京都渋谷区神宮前99-99-99） |
| `tel` | `03-XXXX-XXXX` 形式のダミー番号（先頭が `0120` または `03/06/052` 等のリアルな市外局番、下8桁ランダム） |
| `area` | 住所に合った最寄り駅と徒歩分数を生成（例：表参道駅徒歩2分） |
| `staff.members[].name` | 業態に合う架空の人名（バーバーは男性名、女性向けサロンは女性名中心） |
| `staff.members[].role` / `message` | 役職とメッセージも業態のトーンで生成 |
| `menu.items` | 業態の標準的な料金帯を反映（美容室：カット5,000〜7,000円、バーバー：カット4,000〜5,500円、ネイル：オフ込みワンカラー6,000〜8,000円 等） |
| `hours` / `holiday` / `payment` | 業態の標準的な値で埋める |

**禁止事項**：
- `{サロン名}` / `XXX` / `TBD` / 空文字列のまま出力
- 実在する店舗名・住所・電話番号の使用
- スタッフ名「田中」「佐藤」だけのベタな組み合わせ（もう少しバリエーションを持たせる）

このルールは Claude Code が JSON を生成する場合と Kimi K2.5 がフォーム回答から変換する場合の両方に適用する。

## ヒアリングの入口（3パターン）

| 入口 | 場面 | 担当モデル | データの流れ |
|------|------|----------|------------|
| 質問形式（salon-interview） | 対面・オンライン打合せ | Claude Code | リアルタイムで回答→JSON生成 |
| Googleフォーム | 非対面・LINE完結 | Kimi K2.5 | クライアント記入→Sheets→Kimi がJSON変換 |
| Agent自動収集 | デモサイト先行作成（営業用） | Kimi K2.5（マルチモーダル） | HPB/Instagramのスクショから情報抽出→JSON自動生成 |

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
| Q1.5 | 店舗数は？ | single_select | 1店舗 / 2〜3店舗 / 4店舗以上 |
| Q2 | サロン名（英語） | テキスト | 例：BLOOM |
| Q3 | サロン名（日本語・サブ） | テキスト | 例：hair salon |
| Q4 | エリア・最寄り駅 | テキスト | 例：表参道駅徒歩2分 |
| Q5 | 住所 | テキスト | — |

**Q1=「その他」の処理**：salon-interview の対象外。Claude Code は「飲食店なら restaurant-interview、会社LP なら corporate-interview、建築なら architect-interview を呼んでください」と返却して終了する。

### Round 2：営業情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q6 | 営業時間 | テキスト | — |
| Q7 | 定休日 | テキスト | — |
| Q8 | 電話番号 | テキスト | — |
| Q8.5 | お支払い方法 | multi_select | 現金 / クレジットカード / PayPay / 交通系IC / その他 |
| Q9 | 予約方法 | multi_select | Hot Pepper / LINE / 電話 / Instagram DM / STORES / Airリザーブ / 自社システム / その他 |
| Q9.5 | 予約UIの表示形式 | single_select | 外部リンクのみ / 営業カレンダー表示 / 予約フォーム設置 / 予約ウィ���ェット埋め込み |

### Round 3：メニュー・スタッフ

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q10 | 主要メニュー＋価格（3〜5つ） | テキスト | 「あとで」可 |
| Q10.3 | 初回価格はありますか？ | single_select | あり / なし |
| Q10.5 | スタイリスト別料金はありますか？ | single_select | あり / なし / 未定 |
| Q10.7 | 施術時間を表示しますか？ | single_select | あり / なし |
| Q11 | スタッフ人数・名前 | テキスト | 「あとで」可 |
| Q11.5 | オーナーのプロフィール・経歴を掲載しますか？ | single_select | はい / いいえ / あとで |
| Q12 | メニュー表示形式 | single_select | 定義リスト型（ILOLI型） / 写真付きカード型（MILLOR型） / タブ切り替え型（mile/TOH型） |

### Round 4：デザインの方向性

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q13 | カラー方向性 | single_select | ナチュラル / モノトーン×ゴールド / グレージュ / くすみカラー / おまかせ |
| Q14 | 全体のトーン | single_select | 静謐・上品 / 温もり・親しみ / モード・���練 / おまかせ |
| Q15 | コンセプトの語り方 | single_select | 3段構造（NANEA型） / ストーリー型（GREENROOM型） / 一言コピー型（OTOKO型） / おまかせ |
| Q16 | ヒーローのスタイル | single_select | 全画面写真＋中央ロゴ / スライドショー / 超ミニマル（TOH型）/ おまかせ |
| Q17 | ギャラリーの表示 | single_select | 横スクロール / LOOKBOOKスライド / おまかせ |
| Q17.5 | ギャラリーページの命名 | single_select | Gallery / Collection / Styles |

### Round 5：オプション要素

#### Q18.common（全業態共通）

| # | 質問 | 形式 | 選択肢（業態共通） |
|---|------|------|--------|
| Q18.common | 共通追加セクション | multi_select | ヒーロー直下CTA / Google口コミ / オーナーストーリー / 来店の流れ（One Day） / 採用セクション / FAQ / キッズ対応 / 物販・商品紹介 / ギフトカード / 縦書きテキスト / スタッフ個別ページ / ビフォーアフター / 駐車場情報 / 道順写真 / 特になし |
| Q18.review | Google口コミ選択時：表示形式 | single_select | 数値バーのみ / 全文カード型 / 両方 |

#### Q18 業態別追加（Q1 で分岐）

| 業態 | 追加で聞くオプション |
|------|------------------|
| 美容室 / バーバー | （共通のみ） |
| ネイル | 定額デザインコース / 持ち込みデザイン案内 / オフ代・ケアメニュー |
| エステ | 施術フロー図 / 初回体験コースCTA / お悩み別メニュー導線（ビフォーアフターはエステではほぼ必須として常時 ON 推奨） |
| まつエク | デザイン比較（ナチュラル/キュート/ゴージャス） / 本数別イメージ写真 / 素材別説明表 |

#### Q19・Q20

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
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

### Q1 + Q1.5（業態 + 店舗数）→ 使用スキルの決定

```
Q1.5 = 4店舗以上                       → lp-salon-group（業態問わず）
Q1.5 = 1〜3店舗 かつ Q1 = 美容室         → lp-salon
Q1.5 = 1〜3店舗 かつ Q1 = バーバー       → lp-barber
Q1.5 = 1〜3店舗 かつ Q1 = ネイル/エステ/まつエク → lp-nail-esthe
Q1 = その他                            → 対象外（restaurant/corporate/architect-interview を案内して終了）
```

### Q13×Q14 → CSSプリセット決定
`salon-interview/references/presets.md` の Q13×Q14 マッピング表を参照（lp-salon / lp-barber / lp-nail-esthe / lp-salon-group ごとに全組み合わせ網羅済み）。

### 値マッピング（質問選択肢 → JSON 値）

JSON 出力時の英語キーは以下に統一する。Codex/Kimi K2.5 が誤解釈しないよう厳格に従うこと。

#### Q9.5（予約UI表示形式）→ `reservation.ui_type`

| 選択肢 | JSON値 |
|--------|--------|
| 外部リンクのみ | `external_link` |
| 営業カレンダー表示 | `calendar` |
| 予約フォーム設置 | `form` |
| 予約ウィジェット埋め込み | `widget` |

#### Q12（メニュー表示形式）→ `menu.display_type` / `design.menu_pattern`

| 選択肢 | display_type | menu_pattern |
|--------|-------------|-------------|
| 定義リスト型（ILOLI型） | `definition_list` | 1 |
| 写真付きカード型（MILLOR型） | `photo_card` | 2 |
| タブ切り替え型（mile/TOH型） | `tab` | 3 |

#### Q15（コンセプトの語り方）→ `design.concept_pattern`

| 選択肢 | 値 |
|--------|----|
| 3段構造（NANEA型） | `A` |
| ストーリー型（GREENROOM型） | `B` |
| 一言コピー型（OTOKO型） | `C` |
| おまかせ | Claude Code が業態・トーンから自動選択 |

#### Q16（ヒーロースタイル）→ `design.hero_pattern`

| 選択肢 | 値 |
|--------|----|
| 全画面写真＋中央ロゴ（GROEN型） | 1 |
| スライドショー（maple型） | 2 |
| 超ミニマル（TOH型） | 3（プロ以上のみ） |
| おまかせ | Claude Code が自動選択（スタンダードは1固定） |

#### Q17（ギャラリー表示）→ `design.gallery_pattern`

| 選択肢 | 値 |
|--------|----|
| 横スクロール（GROEN型） | 1 |
| LOOKBOOKスライド（MILLOR型） | 2 |
| おまかせ | Claude Code が自動選択（スタンダードは1固定） |

#### Q18（オプション）→ `options.{key}`

| 選択肢ラベル | JSON キー |
|-----------|---------|
| ヒーロー直下CTA | `hero_cta_bar` |
| Google口コミ | `google_review` |
| Google口コミ表示形式 | `google_review_style` (値: `bar` / `card` / `both`) |
| オーナーストーリー | `owner_story` |
| 来店の流れ（One Day） | `oneday_flow` |
| 採用セクション | `recruit` |
| FAQ | `faq` |
| キッズ対応 | `kids` |
| 物販・商品紹介 | `products` |
| ギフトカード | `gift_card` |
| 縦書きテキスト | `vertical_text` |
| スタッフ個別ページ | `staff_pages` |
| ビフォーアフター | `before_after` |
| 駐車場情報 | `parking` |
| 道順写真 | `directions` |
| （ネイル）定額デザインコース | `nail_subscription` |
| （ネイル）持ち込みデザイン案内 | `nail_byo_design` |
| （ネイル）オフ代・ケアメニュー | `nail_off_care` |
| （エステ）施術フロー図 | `esthe_flow` |
| （エステ）初回体験コースCTA | `esthe_first_trial` |
| （エステ）お悩み別メニュー導線 | `esthe_concern_nav` |
| （まつエク）デザイン比較 | `eyelash_design_compare` |
| （まつエク）本数別イメージ写真 | `eyelash_volume_images` |
| （まつエク）素材別説明表 | `eyelash_material_table` |

### デザイン選択のマッピング
| 質問 | 決定する内容 |
|------|------------|
| Q15 | Conceptセクション HTML構造（3パターン） |
| Q16 | Heroセクション HTML構造（3パターン。超ミニマルTOH型はプロ以上のみ） |
| Q17 | Galleryセクション HTML構造（2パターン） |
| Q17.5 | ギャラリー命名（Gallery / Collection / Styles） |
| Q9.5 | Reservationセクション HTML構造（4パターン） |
| Q10.5 | スタイリスト別料金フィールド追加 |
| Q12 | メニュー表示形式（3パターン） |
| Q18 | 追加セクションON/OFF |

## プラン別の制約適用

スタンダードプラン選択時、以下は自動的に固定：
- Hero → 全画面写真＋中央ロゴ（パターン1固定）
- Concept → 自動選択（1種）
- ギャラリー → 横スクロール（パターン1固定）
- メニュー → 定義リスト（パターン1固定）
- 予約UI → パターンAのみ
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
    "business_type": "美容室",
    "store_count": "1店舗",
    "name_en": "BLOOM",
    "name_ja": "hair salon",
    "area": "表参道駅徒歩2分",
    "address": "東京都渋谷区...",
    "tel": "03-1234-5678",
    "hours": "10:00〜20:00",
    "holiday": "毎週火曜日",
    "payment": ["現金", "クレジットカード", "PayPay"]
  },
  "reservation": {
    "methods": ["Hot Pepper", "LINE", "電話"],
    "ui_type": "external_link"
  },
  "menu": {
    "items": [
      {"name": "カット", "price": 5500, "first_visit_price": 4400, "duration_min": 60},
      {"name": "カラー", "price": 7700, "first_visit_price": null, "duration_min": 90}
    ],
    "has_first_visit_price": true,
    "has_stylist_price": false,
    "show_time": true,
    "display_type": "definition_list",
    "stylist_pricing": null
  },
  "staff": {
    "count": 2,
    "members": [
      {"name": "田中", "role": "Owner Stylist"}
    ]
  },
  "design": {
    "color_direction": "グレージュ",
    "tone": "モード・洗練",
    "preset": "greige_mode",
    "concept_pattern": "A",
    "hero_pattern": 1,
    "gallery_pattern": 1,
    "gallery_name": "Gallery",
    "menu_pattern": 1
  },
  "options": {
    "google_review": false,
    "recruit": false,
    "faq": false,
    "kids": false,
    "products": false,
    "gift_card": false,
    "vertical_text": false,
    "staff_pages": false,
    "before_after": false,
    "parking": false,
    "directions": false,
    "nail_subscription": false,
    "nail_byo_design": false,
    "nail_off_care": false,
    "esthe_flow": false,
    "esthe_first_trial": false,
    "esthe_concern_nav": false,
    "eyelash_design_compare": false,
    "eyelash_volume_images": false,
    "eyelash_material_table": false
  },
  "photos": {
    "status": "placeholder"
  },
  "reference_url": ""
}
```

## 処理フロー

```
1. /client-site から起動（業種＝サロン選択時）
2. Round 0〜5 を順番にヒアリング
   - 質問形式：Claude Code が1問ずつ提示。「あとで」も受け付ける
   - Googleフォーム：Sheets回答を Kimi K2.5 が JSON 変換
   - Agent自動収集：Kimi K2.5 マルチモーダルが HPB/Instagram スクショから情報抽出→JSON 自動生成
3. Q1=「その他」なら restaurant/corporate/architect-interview を案内して終了
4. Q1.5（店舗数）と Q1（業態）でスキル振り分け
5. プラン判定（Q0.5）→制約適用
6. プリセット自動マッピング（presets.md 参照）
7. 値マッピング表で JSON キーに正規化
8. Round 5 業態別オプションを Q1 に応じて動的追加
9. JSON 出力（Claude Code が最終検証）
10. 該当スキル呼び出し
    Q1.5=4店舗以上              → lp-salon-group
    1〜3店舗 + 美容室            → lp-salon
    1〜3店舗 + バーバー          → lp-barber
    1〜3店舗 + ネイル/エステ/まつエク → lp-nail-esthe
11. スキルがJSONを受け取り→サイト生成開始
```
