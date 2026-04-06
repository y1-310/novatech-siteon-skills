# lp-restaurant sections

## 必須セクション7つ

| セクション | 役割 | バリアント |
|-----------|------|-----------|
| 1. Hero | 料理または店内写真を全画面で見せ、第一印象を決める。 | `photo-full` / `photo-split` / `mood-dark` |
| 2. Concept / Story (01) | 店の想い・世界観・誰に向けた店かを語る。 | `narrative` / `chef-message` / `compact` |
| 3. Menu (02) | 主力メニュー、価格、注文の雰囲気を伝える。 | 下記5パターンを使う。 |
| 4. Photo Gallery (03) | 料理写真と店内写真を組み合わせて来店後のイメージを作る。 | `grid-2col` / `masonry` / `slider` |
| 5. Access / Hours (04) | 住所、営業時間、地図、支払い方法をまとめる。 | `map-right` / `map-bottom` |
| 6. Reservation / CTA (05) | 予約UIと予約誘導をまとめ、行動を起こさせる。 | `buttons` / `card-panel` / `embed-ready` |
| 7. Footer | SNSリンク、コピーライト、最低限の再導線を配置する。 | なし |

### 1. Hero

```html
<section class="hero hero--{variant}">
  <div class="hero__media"></div>
  <div class="hero__body">
    <p class="hero__eyebrow"></p>
    <h1 class="hero__title"></h1>
    <p class="hero__lead"></p>
    <div class="hero__cta"></div>
  </div>
</section>
```

### 2. Concept / Story (01)

```html
<section class="story section" id="story">
  <div class="section__head">
    <p class="section__index">01</p>
    <h2 class="section__title"></h2>
  </div>
  <div class="story__grid">
    <div class="story__body"></div>
    <figure class="story__visual"></figure>
  </div>
</section>
```

### 3. Menu (02)

```html
<section class="menu section" id="menu">
  <div class="section__head">
    <p class="section__index">02</p>
  </div>
  <div class="menu__switch"></div>
  <div class="menu__groups">
    <article class="menu-card">
      <h3 class="menu-card__title"></h3>
      <p class="menu-card__price"></p>
      <p class="menu-card__desc"></p>
    </article>
  </div>
</section>
```

### 4. Photo Gallery (03)

```html
<section class="gallery section" id="gallery">
  <div class="section__head">
    <p class="section__index">03</p>
  </div>
  <div class="gallery__grid">
    <figure class="gallery__item"></figure>
  </div>
</section>
```

### 5. Access / Hours (04)

```html
<section class="access section" id="access">
  <div class="section__head">
    <p class="section__index">04</p>
  </div>
  <div class="access__layout">
    <div class="access__info">
      <dl class="access__list"></dl>
    </div>
    <div class="access__map"></div>
  </div>
</section>
```

### 6. Reservation / CTA (05)

```html
<section class="reservation section" id="reservation">
  <div class="section__head">
    <p class="section__index">05</p>
  </div>
  <div class="reservation__panel">
    <div class="reservation__methods"></div>
    <div class="reservation__cta"></div>
  </div>
</section>
```

### 7. Footer

```html
<footer class="footer">
  <div class="footer__brand"></div>
  <nav class="footer__nav"></nav>
  <ul class="footer__sns"></ul>
  <small class="footer__copy"></small>
</footer>
```

## オプションセクション10種

| セクション |
|-----------|
| Chef / Staff |
| Scene / How to Use |
| EC / Online Shop |
| Event / News |
| Party / Course |
| Kids / Family |
| Experience |
| Instagram Feed |
| Blog / Column |
| Takeout / Delivery |

## メニュー表示5パターン

| パターン | 内容 | クラス名 |
|---------|------|---------|
| 1. カテゴリ別リスト | ランチ、ドリンク、デザートなどカテゴリで区切る。 | `menu--category-list` |
| 2. 写真付きカード | 料理写真を伴うカードで主力商品を強く見せる。 | `menu--photo-card` |
| 3. シーン別タブ | `Morning` / `Lunch` / `Dinner` の時間帯や利用シーンで切り替える。 | `menu--scene-tab` |
| 4. コース表示 | コース名、価格、内容、人数条件をまとめる。 | `menu--course` |
| 5. シンプルリスト | 文字情報を優先し、縦リズムで見せる。 | `menu--simple-list` |

## JSON-LD方針

| 対象 | 方針 |
|------|------|
| カフェ系 | `CafeOrCoffeeShop` |
| バー系 | `BarOrPub` |
| レストラン、居酒屋、ラーメン屋、定食屋・食堂 | `Restaurant` または `FoodEstablishment` |
| 付与項目 | 住所、電話番号、営業時間、メニューURL、予約URLがあれば含める。 |

## 実装メモ

| 項目 | 内容 |
|------|------|
| セクション番号 | `(01)` 形式またはゼロ埋め数字で統一する。 |
| CTA | HeroとReservationはCTA重複を許容するが、文言は同一トーンにそろえる。 |
| Access | お支払い方法をタグ一覧で見せる。 |
