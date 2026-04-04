# lp-barber マルチページ設計（プロ・プレミアム用）

## 概要

lp-salon の multipage.md と同じ5ページ構成。
以下はバーバー固有の差分のみ記載する。共通構造は lp-salon/references/multipage.md を参照。

## 5ページ構成

| ページ | ファイル名 | 内容 |
|--------|-----------|------|
| トップ | index.html | ヒーロー＋コンセプト要約���メニュープレビュー＋スタッフ顔出し＋CTA |
| About | about.html | コンセプト全文＋こだわり（Features）＋スタッフ紹介 |
| Menu | menu.html | 全メニュー＋セットメニュー＋初回価格＋施術時間 |
| Gallery | gallery.html | スタイル写真＋内装写真。ビフォーアフター。Instagram連携 |
| Info | info.html | アクセス＋Maps＋営業カレンダー＋予約UI＋FAQ |

## バーバー固有の差分

### index.html
- ヒーローはダーク背景前提
- メニュープレビューはセットメニューを目立たせる
- CTAのコ���ーは直接的：「今すぐ予約する」

### about.html
- Conceptはパターン C（一言コピー型）が特に適合
- Features：フェードカット技術・シェービング・プライベート空間
- Staff：「バーバー」「理容師」の呼称

### menu.html
- カテゴリ：Cut / Shave / Head Spa / Set Menu
- セットメニューの割引表示
- メンズサロンはメニュー数が比較的少ないためタブ切り替えは不要な場合が多い

### gallery.html
- ハイコントラストのスタイル写真
- カテゴリ：Fade / Classic / Skin Fade / Beard
- 内装写真：バーバーチェア・ヴィンテージ感

### info.html
- lp-salon と同一構造

## 共通ルール

lp-salon の multipage.md と同一。
- canonical URL全ページ設定
- 同一ヘッダー・フッター
- ブログ・スタッフ個別ページの構造も同じ
