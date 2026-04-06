# lp-restaurant multipage

## 個別ページ
### 1. Menu詳細
- URL例: `/menu/`
- 内容: カテゴリ別一覧、価格、説明、写真、アレルギー注記、季節限定
- SEO: `メニュー名 + 店名 + エリア`
- パンくず: `Home > Menu`

### 2. Chef紹介
- URL例: `/chef/`
- 内容: シェフまたは店主の経歴、哲学、食材への考え、写真
- SEO: `シェフ紹介 + 店名`
- パンくず: `Home > Chef`

### 3. Event詳細
- URL例: `/event/{slug}/`
- 内容: イベント概要、開催日、定員、料金、予約方法
- SEO: `イベント名 + 店名 + 開催日`
- パンくず: `Home > Event > Detail`

### 4. Blog記事
- URL例: `/blog/{slug}/`
- 内容: コラム、季節メニュー告知、営業案内、裏話
- SEO: `記事タイトル + 店名`
- パンくず: `Home > Blog > Article`

### 5. Course詳細
- URL例: `/course/`
- 内容: コース名、金額、料理数、飲み放題有無、予約条件
- SEO: `コース料理 + 店名`
- パンくず: `Home > Course`

## ルーティング方針
- 下層ページは `/slug/` の静的ルーティングを基本とする。
- イベントとブログは一覧ページ省略も許容するが、導線上の一貫性を保つ。
- トップから下層への導線は Hero、Menu、Footer のいずれかに置く。

## SEO方針
- 各ページは固有の title / description / OGP を持つ。
- canonical は個別URLごとに設定する。
- メニュー、イベント、記事は重複文言を避け、ページ固有情報を優先する。

## パンくず
- すべての下層ページにパンくずを配置する。
- パンくずは構造化データ `BreadcrumbList` と整合させる。

## JSON-LD
- Menu詳細では `Menu` または `hasMenu` を検討する。
- Blog記事では `BlogPosting`
- Event詳細では `Event`
- Chef紹介では `Person`
- Course詳細は `Menu` または `Offer` を補助的に使う。
