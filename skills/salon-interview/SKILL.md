# salon-interview — サロン向けヒアリングスキル

## 目的
質問形式またはGoogleフォームでクライアント情報を収集し、最適なスキル＋プリセットを自動選択してサイト生成する。

## ヒアリングの入口（3パターン）

| 入口 | 場面 | データの流れ |
|------|------|------------|
| 質問形式（salon-interview） | 対面・��ンライン打合せ | リアルタイムで回答→JSON生成 |
| Googleフォーム | 非対面・LINE完結 | クライアント記入→Sheets→Agent がJSON変換 |
| Agent自動収集 | デモサイト先行作成（営業用） | HPB/Instagramから情報収集→JSON自動生成 |

3つの入口いずれも最終��にJSONに変換され、同じスキルで処理される。

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
| Q4 | エリア・最寄り駅 | テキスト | 例：���参道駅徒歩2分 |
| Q5 | 住所 | テキスト | — |

### Round 2：営業情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q6 | 営業時間 | テキスト | — |
| Q7 | 定休日 | テキスト | — |
| Q8 | 電話番号 | テキスト | — |
| Q8.5 | お支払い方法 | multi_select | 現金 / クレジットカード / PayPay / 交通系IC / その他 |
| Q9 | 予約方法 | multi_select | Hot Pepper / LINE / 電話 / STORES / Airリザーブ / 自社システム / その他 |
| Q9.5 | 予約UIの表示形式 | single_select | 外部リンクのみ / 営業カレンダー表示 / 予約フォーム設置 / 予約ウィ���ェット埋め込み |

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
| Q14 | 全体のトーン | single_select | 静謐・上品 / 温もり・親しみ / モード・���練 / おまかせ |
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
美容室 → lp-salon
バーバー �� lp-barber
ネイル / エステ / まつエク → lp-nail-esthe
「複数店舗あり」と判明 → lp-salon-group
```

### Q13×Q14 → CSSプリセット決定
各スキルの design-system.md のプリセット表を参照。

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
      {"name": "カット", "price": 5500, "time": "約60分"},
      {"name": "カラー", "price": 7700, "time": "約90分"}
    ],
    "has_first_visit_price": true,
    "has_stylist_price": false,
    "show_time": true,
    "display_type": "definition_list"
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
    "directions": false
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
   - 質問形式：1問ずつ提示。「あとで」も受け付ける
   - Googleフォーム：Sheets回答をJSON変換
   - Agent自動収集：HPB/Instagramから情報取得→JSON自動生成
3. プラン判定→制約適用
4. プリセット自動マッピング
5. JSON出力
6. 業態判定→該当スキル呼び出し
   美容室 → lp-salon
   バーバー → lp-barber
   ネイル/エステ/まつエク → lp-nail-esthe
   多店舗 → lp-salon-group
7. スキルがJSONを受け取り→サイト生成開始
```
