# restaurant-interview

## 目的
質問形式またはGoogleフォームで飲食店クライアント情報を収集し、最適なスキルとプリセットを自動選択してサイト生成に接続する。

## ヒアリングの入口3パターン
### 1. 質問形式
- CodexがRound 0からRound 5まで順番に質問する。
- 回答不足がある場合のみ不足項目を再質問する。

### 2. Googleフォーム
- フォーム URL: https://docs.google.com/forms/d/e/1FAIpQLSfFk_M2GZ1QP5DFywp_RKH_h2Jwjqrf91FjzQxer10Ekej9aQ/viewform
- フォーム回答をそのまま受け取り、各設問をJSONへ正規化する。
- 自由記述は意味を変えずに整形する。

### 3. Agent自動収集
- 食べログやInstagramの公開情報から取得できる範囲を補完する。
- 自動収集対象は店舗名、業態、住所、最寄り駅、営業時間、定休日、電話番号、予約導線、写真傾向、世界観の手掛かりに限定する。
- 推定が混ざる項目は `source: inferred` を付け、未確定として扱う。

## Round 0: 契約形態
- Q0 契約形態: `SITEON サブスク` / `NovaTech 受託`
- Q0.5 プラン: `スタンダード` / `プロフェッショナル` / `プレミアム`

## Round 1: 基本情報
- Q1 業態: `カフェ` / `レストラン` / `バー` / `居酒屋` / `ラーメン屋` / `定食屋・食堂` / `その他`
- Q1.5 客単価帯: `〜1,000円` / `1,000〜3,000円` / `3,000〜5,000円` / `5,000円〜`
- Q2 店舗名（英語）
- Q3 日本語サブ
- Q4 エリア・最寄り駅
- Q5 住所

## Round 2: 営業情報
- Q6 営業時間
- Q7 定休日
- Q8 電話番号
- Q8.5 お支払い方法 multi_select: `現金` / `クレジットカード` / `PayPay` / `交通系IC` / `その他`
- Q9 予約方法 multi_select: `食べログ` / `ぐるなび` / `ホットペッパー` / `TableCheck` / `一休` / `LINE` / `電話` / `Instagram DM` / `予約不要` / `その他`
- Q9.5 テイクアウト対応: `あり` / `なし`
- Q9.7 通販（EC）対応: `あり` / `なし` / `検討中`

## Round 3: メニュー・スタッフ
- Q10 メニュー構成（主要メニュー3〜5つ＋価格）
- Q10.5 コース料理はありますか？: `あり` / `なし`
- Q11 スタッフ・シェフ名
- Q12 メニュー表示形式: `カテゴリ別リスト` / `写真付きカード` / `シーン別タブ` / `コース表示` / `シンプルリスト` / `おまかせ`

## Round 4: デザインの方向性
- Q13 飲食店5類型 single_select: `Japanese Fine Dining（料理を売る型）` / `Nature Italian（空間を売る型）` / `Destination Cafe（時間を売る型）` / `Craft Bakery（商品思想を売る型）` / `Holiday Diner（居酒屋・バル型）` / `おまかせ`
- Q14 ※restaurant判定時はQ13に統合して非表示
- Q15 コンセプトの語り方
- Q16 ヒーローのスタイル
- Q17 ギャラリーの表示

## Round 5: オプション要素
- Q18 追加セクション multi_select: `ヒーロー直下CTA` / `シェフ・オーナー紹介` / `お食事の流れ（Dining Flow）` / `シグネチャー体験` / `利用シーン（Scene）` / `食材・素材のこだわり` / `Google口コミ` / `シーン提案` / `通販` / `イベント` / `パーティー・貸切` / `キッズ対応` / `体験コンテンツ` / `Instagram連携` / `ブログ` / `テイクアウト` / `特になし`
- Q18.review Google口コミ選択時：表示形式 single_select: `数値バーのみ` / `全文カード型` / `両方`
- Q19 写真素材
- Q20 参考サイトURL

## 回答→プリセット自動マッピング
- Q1業態判定は全て `lp-restaurant` へ1対1固定分岐する。
- Q0.5プラン判定で参照ファイルを切り替える。
- `スタンダード` は `references/design-system.md` と `references/sections.md` を使用する。
- `プロフェッショナル` は上記に加えて `references/multipage.md` を使用する。
- `プレミアム` は上記に加えて `references/premium.md` を使用する。
- Q13の5類型選択でCSSプリセットを決定する（Q14はQ13に統合済み）。
- Q12でメニュー表示5パターンを決定する。
- `おまかせ` が選ばれた場合は業態別デフォルトパターンへフォールバックする。

## プラン別制約
- スタンダードは単一LPを前提とし、追加ページ生成を行わない。
- プロフェッショナルは複数固定ページを許可する。
- プレミアムは外部予約、EC、多言語、埋め込み連携、拡張アニメーションを許可する。

## 出力フォーマットJSON
- salon系構造を踏襲しつつ、`business_type` に飲食業態を入れる。
- `menu.items` には `description` を追加する。
- `reservation` に `takeout` と `ec` フラグを持たせる。
- `scene` フィールドを追加し、利用シーンや時間帯訴求を格納する。

```json
{
  "contract": {
    "type": "SITEON サブスク",
    "plan": "スタンダード"
  },
  "business_type": "カフェ",
  "store": {
    "name_en": "CAFE LENTO",
    "name_sub_ja": "街角で深呼吸するためのカフェ",
    "area_station": "渋谷・代官山駅",
    "address": "東京都渋谷区..."
  },
  "operations": {
    "hours": "08:00-20:00",
    "closed": "水曜",
    "phone": "03-0000-0000",
    "payment_methods": ["現金", "クレジットカード", "PayPay"],
    "reservation_methods": ["食べログ", "Instagram DM"]
  },
  "reservation": {
    "takeout": true,
    "ec": "検討中"
  },
  "menu": {
    "display": "写真付きカード",
    "has_course": false,
    "items": [
      {
        "name": "本日のプレート",
        "price": "1,280円",
        "description": "季節の野菜を中心にした日替わりセット"
      }
    ]
  },
  "staff": {
    "chef_or_staff_name": "Yuki Sato"
  },
  "design": {
    "color_direction": "やわらかい生成り",
    "tone": "ナチュラルで静か",
    "concept_voice": "丁寧で余白のある語り口",
    "hero_style": "料理と店内の引き写真",
    "gallery_style": "料理多め"
  },
  "scene": {
    "labels": ["Morning", "Lunch", "Cafe Time"]
  },
  "options": {
    "sections": ["シーン提案", "Instagram連携"],
    "photo_assets": "支給あり",
    "reference_urls": ["https://example.com"]
  },
  "routing": {
    "skill": "lp-restaurant",
    "preset": "natural-warmth"
  }
}
```

## 処理フロー
1. 入口を判定し、質問形式・Googleフォーム・Agent自動収集のいずれかで情報を受け取る。
2. Round 0からRound 5の順に回答を集約し、未回答と推定値を区別する。
3. 回答を正規化してJSONへ変換する。
4. Q1で `lp-restaurant` 固定分岐を行う。
5. Q0.5でプラン別参照ファイル群を決定する。
6. Q13×Q14とQ12からデザインプリセットとメニュー表示方式を自動マッピングする。
7. 完成したJSONを `lp-restaurant` に渡して生成を開始する。
