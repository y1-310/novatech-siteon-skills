# lp-restaurant

## 目的
飲食店（カフェ / レストラン / バー / 居酒屋 / ラーメン屋 / 定食屋。個人〜3店舗）向けのLPまたは小規模サイトを生成する。

## 入力
- `restaurant-interview` が生成したJSONを受け取る。
- 入力JSONには契約種別、プラン、店舗情報、営業情報、メニュー、スタッフ、デザイン方向、追加要素、予約情報を含める。

## 参照ファイル
### 共通参照
- `../../../_common/components.md`
- `../../../_common/reservation-ui.md`
- `../../../_common/seo-base.md`

### プラン別参照
- スタンダード: `SKILL.md` + `references/design-system.md` + `references/sections.md`
- プロ: 上記 + `references/multipage.md`
- プレミアム: 上記 + `references/multipage.md` + `references/premium.md`

## 生成対象
- トップページのHTML一式
- 必要に応じた下層ページ定義
- SEOメタ、OGP、構造化データ
- 予約導線、メニュー導線、アクセス導線

## 生成手順
1. JSONを読み込み、必須項目とプランを確認する。
2. `references/design-system.md` を使ってプリセットを決定する。
3. `references/sections.md` を使ってセクション構成とHTMLを生成する。
4. 予約UIは `../../../_common/reservation-ui.md` を参照して反映する。
5. 共通UIや装飾は `../../../_common/components.md` を参照して必要範囲のみ適用する。
6. `../../../_common/seo-base.md` を参照してSEO情報を生成する。
7. プロは `references/multipage.md` を使って下層ページ要件を追加する。
8. プレミアムは `references/premium.md` の拡張機能を追加する。
9. 最後に品質チェックを行い、構造・導線・SEO・予約導線の欠落がないか確認する。

## 品質チェック
- 業態とプリセットの整合性があること。
- Hero、Concept、Menu、Gallery、Access、Reservation、Footer が最低限そろうこと。
- JSONの `reservation` 情報とCTA内容が一致していること。
- `scene` 情報がある場合はメニューまたは導線に反映されていること。
- プラン外の機能を混入させないこと。
