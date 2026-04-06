# lp-restaurant sections

## 必須セクション7つ
### 1. Hero
- 役割: 料理または店内写真を全画面で見せ、第一印象を決める。
- HTML構造:
  - `<section class="hero hero--{variant}">`
  - `<div class="hero__media">`
  - `<div class="hero__body">`
  - `<p class="hero__eyebrow">`
  - `<h1 class="hero__title">`
  - `<p class="hero__lead">`
  - `<div class="hero__cta">`
- バリアント: `photo-full` / `photo-split` / `mood-dark`

### 2. Concept / Story (01)
- 役割: 店の想い・世界観・誰に向けた店かを語る。
- HTML構造:
  - `<section class="story section" id="story">`
  - `<div class="section__head">`
  - `<p class="section__index">01</p>`
  - `<h2 class="section__title">`
  - `<div class="story__grid">`
  - `<div class="story__body">`
  - `<figure class="story__visual">`
- バリアント: `narrative` / `chef-message` / `compact`

### 3. Menu (02)
- 役割: 主力メニュー、価格、注文の雰囲気を伝える。
- HTML構造:
  - `<section class="menu section" id="menu">`
  - `<div class="section__head">`
  - `<p class="section__index">02</p>`
  - `<div class="menu__switch">`
  - `<div class="menu__groups">`
  - `<article class="menu-card">`
  - `<h3 class="menu-card__title">`
  - `<p class="menu-card__price">`
  - `<p class="menu-card__desc">`
- バリアントは下記5パターンを使う。

### 4. Photo Gallery (03)
- 役割: 料理写真と店内写真を組み合わせて来店後のイメージを作る。
- HTML構造:
  - `<section class="gallery section" id="gallery">`
  - `<div class="section__head">`
  - `<p class="section__index">03</p>`
  - `<div class="gallery__grid">`
  - `<figure class="gallery__item">`
- バリアント: `grid-2col` / `masonry` / `slider`

### 5. Access / Hours (04)
- 役割: 住所、営業時間、地図、支払い方法をまとめる。
- HTML構造:
  - `<section class="access section" id="access">`
  - `<div class="section__head">`
  - `<p class="section__index">04</p>`
  - `<div class="access__layout">`
  - `<div class="access__info">`
  - `<dl class="access__list">`
  - `<div class="access__map">`
- バリアント: `map-right` / `map-bottom`

### 6. Reservation / CTA (05)
- 役割: 予約UIと予約誘導をまとめ、行動を起こさせる。
- HTML構造:
  - `<section class="reservation section" id="reservation">`
  - `<div class="section__head">`
  - `<p class="section__index">05</p>`
  - `<div class="reservation__panel">`
  - `<div class="reservation__methods">`
  - `<div class="reservation__cta">`
- バリアント: `buttons` / `card-panel` / `embed-ready`

### 7. Footer
- 役割: SNSリンク、コピーライト、最低限の再導線を配置する。
- HTML構造:
  - `<footer class="footer">`
  - `<div class="footer__brand">`
  - `<nav class="footer__nav">`
  - `<ul class="footer__sns">`
  - `<small class="footer__copy">`

## オプションセクション10種
- Chef / Staff
- Scene / How to Use
- EC / Online Shop
- Event / News
- Party / Course
- Kids / Family
- Experience
- Instagram Feed
- Blog / Column
- Takeout / Delivery

## メニュー表示5パターン
### 1. カテゴリ別リスト
- ランチ、ドリンク、デザートなどカテゴリで区切る。
- クラス名: `menu--category-list`

### 2. 写真付きカード
- 料理写真を伴うカードで主力商品を強く見せる。
- クラス名: `menu--photo-card`

### 3. シーン別タブ
- `Morning` / `Lunch` / `Dinner` の時間帯や利用シーンで切り替える。
- クラス名: `menu--scene-tab`

### 4. コース表示
- コース名、価格、内容、人数条件をまとめる。
- クラス名: `menu--course`

### 5. シンプルリスト
- 文字情報を優先し、縦リズムで見せる。
- クラス名: `menu--simple-list`

## JSON-LD方針
- カフェ系は `CafeOrCoffeeShop`
- バー系は `BarOrPub`
- レストラン、居酒屋、ラーメン屋、定食屋・食堂は `Restaurant` または `FoodEstablishment`
- 住所、電話番号、営業時間、メニューURL、予約URLがあれば含める。

## 実装メモ
- セクション番号は `(01)` 形式またはゼロ埋め数字で統一する。
- HeroとReservationはCTA重複を許容するが、文言は同一トーンにそろえる。
- Accessではお支払い方法をタグ一覧で見せる。
