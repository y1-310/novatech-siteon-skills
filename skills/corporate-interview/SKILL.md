# corporate-interview — 企業LP向けヒアリングスキル

## 目的
質問形式またはGoogleフォームでクライアント情報を収集し、最適なスキル＋プリセットを自動選択してサイト生成する。

## ヒアリングの入口（3パターン）

| 入口 | 場面 | データの流れ |
|------|------|------------|
| 質問形式（corporate-interview） | 対面・オンライン打合せ | リアルタイムで回答→JSON生成 |
| Googleフォーム | 非対面・LINE完結 | クライアント記入→Sheets→Agent がJSON変換 |
| Agent自動収集 | デモサイト先行作成（営業用） | 既存サイト・SNSから情報収集→JSON自動生成 |

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
| Q1 | 業種は？ | single_select | 弁護士 / 税理士 / 社労士 / 行政書士 / コンサル / IT / 映像・デザイン / その他 |
| Q1.5 | 従業員数は？ | single_select | 1名（個人） / 2〜5名 / 6〜15名 / 16〜30名 |
| Q2 | サイト名（英語） | テキスト | 例：NOVA LEGAL |
| Q3 | 日本語サブ | テキスト | 例：法律事務所 |
| Q4 | エリア | テキスト | 例：渋谷区 / オンライン全国対応 |
| Q5 | 住所 | テキスト | — |

### Round 2：営業情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q6 | 営業時間 | テキスト | — |
| Q7 | 定休日 | テキスト | — |
| Q8 | 電話番号 | テキスト | — |
| Q8.5 | お支払い方法 | multi_select | 現金 / クレジットカード / 銀行振込 / 請求書払い / その他 |
| Q9 | 問い合わせ方法 | multi_select | フォーム / 電話 / メール / LINE |
| Q9.5 | 問い合わせUIの表示形式 | single_select | 外部リンクのみ / 営業カレンダー表示 / 問い合わせフォーム設置 / 問い合わせウィジェット埋め込み |

### Round 3：サービス・代表情報

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q10 | 主要サービス（3〜5つ） | テキスト | 「あとで」可 |
| Q10.5 | 料金表を掲載しますか？ | single_select | あり / なし / 応相談のみ表示 |
| Q11 | 代表者プロフィール | テキスト | 名前・経歴・資格・写真 |
| Q12 | サービス表示形式 | single_select | 定義リスト型 / アイコン付きカード型 / タブ切り替え型 |

### Round 4：デザインの方向性

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q13 | カラー方向性 | single_select | クリーン×信頼 / ミニマル×洗練 / アーティスティック×世界観 / ウォーム×親しみ / おまかせ |
| Q14 | 全体のトーン | single_select | 信頼・端正 / ミニマル・洗練 / 世界観・表現性 / 親しみ・安心感 / おまかせ |
| Q15 | コンセプトの語り方 | single_select | 3段構造 / ストーリー型 / 一言コピー型 / おまかせ |
| Q16 | ヒーローのスタイル | single_select | 全画面写真＋中央コピー / スライドショー / 超ミニマル / おまかせ |
| Q17 | ギャラリーの表示 | single_select | 横スクロール / LOOKBOOKスライド / おまかせ |

### Round 5：オプション要素

| # | 質問 | 形式 | 選択肢 |
|---|------|------|--------|
| Q18 | 追加セクション | multi_select | 料金表 / 実績・事例 / ブログ・コラム / FAQ / サービスの流れ / お客様の声 / 提携先 / お知らせ / 採用 / メディア掲載 / 特になし |
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
弁護士 → lp-corporate
税理士 → lp-corporate
社労士 → lp-corporate
行政書士 → lp-corporate
コンサル → lp-corporate
IT → lp-corporate
映像・デザイン → lp-corporate
その他 → lp-corporate
```

### Q13×Q14 → CSSプリセット決定
references/presets.md のプリセット表を参照。

### デザイン選択のマッピング
| 質問 | 決定する内容 |
|------|------------|
| Q15 | About / Missionセクション HTML構造（3パターン） |
| Q16 | Heroセクション HTML構造（3パターン。超ミニマルはプロ以上のみ） |
| Q17 | Works / Galleryセクション HTML構造（2パターン） |
| Q9.5 | Contactセクション HTML構造（4パターン） |
| Q10.5 | Price / Feeセクションの有無と表示方法 |
| Q12 | Service表示形式（3パターン） |
| Q18 | 追加セクションON/OFF |

## プラン別の制約適用

スタンダードプラン選択時、以下は自動的に固定：
- Hero → 全画面写真＋中央コピー（パターン1固定）
- About / Mission → 自動選択（1種）
- ギャラリー → 横スクロール（パターン1固定）
- Service → 定義リスト型（パターン1固定）
- 問い合わせUI → パターンAのみ
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
    "business_type": "税理士",
    "employee_size": "2〜5名",
    "name_en": "NOVA TAX",
    "name_ja": "税理士事務所",
    "area": "渋谷区 / オンライン全国対応",
    "address": "東京都渋谷区...",
    "tel": "03-1234-5678",
    "hours": "平日 9:00〜18:00",
    "holiday": "土日祝",
    "payment": ["銀行振込", "クレジットカード"]
  },
  "contact": {
    "methods": ["フォーム", "電話", "メール"],
    "ui_type": "form"
  },
  "services": {
    "items": [
      {"name": "税務顧問", "description": "月次監査と申告支援", "price": "月額 33,000円〜"},
      {"name": "会社設立支援", "description": "設立書類作成と初期税務設計", "price": "110,000円〜"}
    ],
    "has_price_table": true,
    "price_visibility": "full",
    "display_type": "definition_list"
  },
  "profile": {
    "representative": {
      "name": "田中 太郎",
      "career": "会計事務所勤務10年",
      "qualification": "税理士",
      "photo": "あり"
    }
  },
  "design": {
    "color_direction": "クリーン×信頼",
    "tone": "信頼・端正",
    "preset": "clean_trust",
    "concept_pattern": "A",
    "hero_pattern": 1,
    "gallery_pattern": 1,
    "service_pattern": 1
  },
  "options": {
    "price": true,
    "works": false,
    "blog": false,
    "faq": false,
    "flow": false,
    "testimonial": false,
    "partner": false,
    "news": false,
    "recruit": false,
    "media": false
  },
  "photos": {
    "status": "placeholder"
  },
  "reference_url": ""
}
```

## 処理フロー

```
1. /client-site から起動（業種＝企業LP選択時）
2. Round 0〜5 を順番にヒアリング
   - 質問形式：1問ずつ提示。「あとで」も受け付ける
   - Googleフォーム：Sheets回答をJSON変換
   - Agent自動収集：既存サイト・SNSから情報取得→JSON自動生成
3. プラン判定→制約適用
4. プリセット自動マッピング
5. JSON出力
6. 業態判定→該当スキル呼び出し
   全業種 → lp-corporate
7. スキルがJSONを受け取り→サイト生成開始
```
