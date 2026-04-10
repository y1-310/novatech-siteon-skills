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

## ヒーロー直下CTA（オプション：Q18選択時）【v1.16追加】

ボタン構成：**予約する（TableCheck/一休/電話）→ メニューを見る**
テキスト：「ご予約はお電話またはオンラインで承ります」
Q18「ヒーロー直下CTA」でON/OFF。デフォルト：ON。

```html
<div class="hero-cta-bar">
  <p class="hero-cta-text">ご予約はお電話またはオンラインで承ります</p>
  <div class="hero-cta-buttons">
    <a href="{予約URL}" class="btn btn-cta-bar" target="_blank" rel="noopener">オンライン予約</a>
    <a href="tel:{電話番号}" class="btn btn-cta-bar">お電話で予約</a>
    <a href="#menu" class="btn btn-cta-bar-outline">メニューを見る</a>
  </div>
</div>
```

---

## シェフ・オーナー紹介（オプション：Q18選択時）【v1.16追加】

```html
<section id="chef" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Chef</h2>
  <p class="section-subtitle">料理人について</p>

  <div class="chef-content">
    <div class="chef-photo">
      <img src="{シェフ写真}" alt="{名前}" width="400" height="533" loading="lazy">
    </div>
    <div class="chef-text">
      <h3>{名前}<span class="chef-role">{肩書き}</span></h3>
      <div class="chef-story">
        <p>{経歴 / 修行先 / 料理哲学 / 食材へのこだわり 3〜5段落}</p>
      </div>
    </div>
  </div>
</section>
```

デフォルト：OFF。オーナーが「載せたくない」→ OFF。

---

## Dining Flow（オプション：Q18選択時、プロ以上）【v1.16追加】

```html
<section id="flow" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Dining Flow</h2>
  <p class="section-subtitle">お食事の流れ</p>

  <div class="flow-timeline">
    <div class="flow-item">
      <span class="flow-number" lang="en">01</span>
      <h3>{ステップ名}</h3>
      <p>{説明}</p>
    </div>
    <!-- ご来店→お飲み物→コース/アラカルト→デザート→お会計 -->
  </div>
</section>
```

デフォルト：OFF。プロ以上。

---

## Signature Experience（オプション：Q18選択時）【v1.16追加】

「この店でしかできない体験」を語るセクション。

```html
<section id="experience" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Experience</h2>
  <p class="section-subtitle">この店だけの体験</p>

  <div class="signature-content">
    <figure class="signature-photo">
      <img src="{大写真}" alt="{体験の説明}" width="1200" height="800" loading="lazy">
    </figure>
    <div class="signature-text">
      <h3>{キャッチコピー}</h3>
      <p>{説明文}</p>
    </div>
  </div>
</section>
```

デフォルト：OFF。

---

## Scene・Occasion（オプション：Q18選択時、プロ以上）【v1.16追加】

利用シーン別提案。3〜5シーンをカード形式。

```html
<section id="scene" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Scene</h2>
  <p class="section-subtitle">ご利用シーン</p>

  <div class="scene-cards">
    <div class="scene-card">
      <img src="{シーン写真}" alt="{シーン名}" width="400" height="300" loading="lazy">
      <h3>{シーン名（デート / 接待 / 家族 / 一人飲み等）}</h3>
      <p>{おすすめポイント}</p>
    </div>
  </div>
</section>
```

デフォルト：OFF。プロ以上。

---

## Ingredient・Craft（オプション：Q18選択時）【v1.16追加】

食材・素材へのこだわり。産地直送・契約農家等を紹介。

```html
<section id="ingredient" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Ingredient</h2>
  <p class="section-subtitle">素材のこだわり</p>

  <div class="ingredient-list">
    <div class="ingredient-item">
      <img src="{食材写真}" alt="{食材名}" width="400" height="400" loading="lazy">
      <h3>{食材名・産地}</h3>
      <p>{こだわりの説明}</p>
    </div>
    <!-- 3〜4点 -->
  </div>
</section>
```

デフォルト：OFF。

---

## 口コミ全文カード型（オプション：Q18選択時、プロ以上）【v1.16追加】

lp-salon と同一仕様。数値バー型（デフォルト）/ 全文カード型（プロ以上）。

---

## 予約導線三層構造【v1.16追加】

自動適用（ヒアリング不要）。プラン判定で分岐。

| 層 | 配置 | プラン |
|---|---|---|
| Primary | ヘッダー＋ヒーロー直下CTA＋CTA | 全プラン |
| Secondary | メニュー下「このメニューで予約」 | プロ以上 |
| Tertiary | フッター＋Access内 | 全プラン |

---

## 予約UI（改修F：restaurant調整）【v1.16追加】

Q9の回答に基づくボタン自動生成。restaurant版の並び順：**オンライン予約 → 電話 → LINE**

```html
<div class="reservation-buttons">
  <a href="{予約URL}" class="btn btn-reserve" target="_blank" rel="noopener">{TableCheck / 一休 / 食べログ} で予約</a>
  <a href="tel:{電話番号}" class="btn btn-tel">お電話で予約</a>
  <a href="{LINE URL}" class="btn btn-line" target="_blank" rel="noopener">LINE で予約</a>
</div>
```

Q9で「予約不要」選択時 → 予約UIセクション自体をOFF。

---

## オプションセクション一覧（v1.16更新）

| セクション | 条件 |
|-----------|------|
| ヒーロー直下CTA【NEW】 | Q18選択（デフォルトON） |
| シェフ・オーナー紹介【NEW】 | Q18選択 |
| Dining Flow【NEW】 | Q18選択（プロ以上） |
| Signature Experience【NEW】 | Q18選択 |
| Scene / Occasion【NEW】 | Q18選択（プロ以上） |
| Ingredient / Craft【NEW】 | Q18選択 |
| 口コミ全文カード型【NEW】 | Q18選択（プロ以上） |
| Chef / Staff | Q18選択 |
| Scene / How to Use | Q18選択 |
| EC / Online Shop | Q18選択 |
| Event / News | Q18選択 |
| Party / Course | Q18選択 |
| Kids / Family | Q18選択 |
| Experience | Q18選択 |
| Instagram Feed | Q18選択 |
| Blog / Column | Q18選択 |
| Takeout / Delivery | Q18選択 |

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
