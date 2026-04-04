# lp-salon-group セクション仕様

## グループトップ（index.html）

### Hero

```html
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-logo" lang="en">{グループ名}</h1>
    <p class="hero-sub">{キャッチコピー}</p>
  </div>
</section>
```

仕様：
- 80vh（100vhではない、コーポレートサイトらしい抑制）
- グループのコンセプト写真 or 複数店舗のコラージュ

---

### Concept（01）

```html
<section id="concept" class="section">
  <span class="section-number">01</span>
  <h2 class="section-title" lang="en">About</h2>
  <p class="section-subtitle">私たちについて</p>

  <div class="about-content">
    <div class="about-message">
      <h3>代表メッセージ</h3>
      <p>{代表メッセージ}</p>
      <p class="about-name">{代表名}</p>
    </div>
    <div class="about-philosophy">
      <h3 lang="en">Philosophy</h3>
      <p>{グループの理念・ビジョン}</p>
    </div>
  </div>
</section>
```

---

### Salon List（02）— グループ固有

```html
<section id="salons" class="section">
  <span class="section-number">02</span>
  <h2 class="section-title" lang="en">Salons</h2>
  <p class="section-subtitle">店舗一覧</p>

  <div class="salon-grid">
    <a href="yamato.html" class="salon-card">
      <img src="{店舗写真}" alt="{店舗名}の外観" width="600" height="400" loading="lazy">
      <div class="salon-card-info">
        <h3>{店舗名}</h3>
        <p class="salon-area">{エリア・最寄り駅}</p>
        <p class="salon-hours">{営業時間}</p>
        <span class="salon-link" lang="en">View More →</span>
      </div>
    </a>
    <!-- 各店舗繰り返し -->
  </div>
</section>
```

仕様：
- 2〜3列グリッド（デスクトップ）
- 各カードは店舗ページへのリンク
- ホバーで画像を拡大（transform: scale(1.03)）

---

### Company / About（03）

```html
<section id="company" class="section">
  <span class="section-number">03</span>
  <h2 class="section-title" lang="en">Company</h2>
  <p class="section-subtitle">会社概要</p>

  <div class="company-info">
    <dl>
      <dt>会社名</dt><dd>{会社名}</dd>
      <dt>代表者</dt><dd>{代表者名}</dd>
      <dt>設立</dt><dd>{設立年}</dd>
      <dt>所在地</dt><dd>{本社住所}</dd>
      <dt>事業内容</dt><dd>{事業内容}</dd>
      <dt>店舗数</dt><dd>{店舗数}</dd>
      <dt>従業員数</dt><dd>{従業員数}</dd>
    </dl>
  </div>

  <div class="company-history">
    <h3 lang="en">History</h3>
    <ul class="timeline">
      <li><time>{年}</time><span>{沿革内容}</span></li>
      <!-- 繰り返し -->
    </ul>
  </div>
</section>
```

---

### Topics / News（04）

```html
<section id="topics" class="section">
  <span class="section-number">04</span>
  <h2 class="section-title" lang="en">Topics</h2>
  <p class="section-subtitle">お知らせ</p>

  <ul class="topics-list">
    <li class="topic-item">
      <time class="topic-date">{日付}</time>
      <span class="topic-category">{カテゴリ}</span>
      <a href="{リンク}" class="topic-title">{お知らせタイトル}</a>
    </li>
    <!-- 最新5〜10件 -->
  </ul>
</section>
```

---

### Recruit（05）— グループ全体の採用

```html
<section id="recruit" class="section">
  <span class="section-number">05</span>
  <h2 class="section-title" lang="en">Recruit</h2>
  <p class="section-subtitle">採用情報</p>

  <div class="recruit-content">
    <div class="recruit-message">
      <h3>{採用メッセージ見出し}</h3>
      <p>{採用メッセージ本文}</p>
    </div>

    <div class="recruit-positions">
      <div class="position-card">
        <h4>{職種名}</h4>
        <dl>
          <dt>勤務地</dt><dd>{勤務地}</dd>
          <dt>給与</dt><dd>{給与}</dd>
          <dt>勤務時間</dt><dd>{勤務時間}</dd>
          <dt>資格</dt><dd>{必要資格}</dd>
        </dl>
      </div>
      <!-- 繰り返し -->
    </div>

    <div class="recruit-benefits">
      <h3>待遇・福利厚生</h3>
      <ul>
        <li>{福利厚生項目}</li>
        <!-- 繰り返し -->
      </ul>
    </div>

    <a href="mailto:{採用メール}" class="btn btn-primary">応募する</a>
  </div>
</section>
```

---

### CTA

```html
<section class="section cta-section">
  <div class="container">
    <p class="cta-catch" lang="en">{英字キャッチ}</p>
    <p class="cta-sub">{日本語サブコピー}</p>
    <div class="cta-salons">
      <a href="yamato.html#reservation" class="btn btn-cta">{店舗名1}で予約</a>
      <a href="turuma.html#reservation" class="btn btn-cta">{店舗名2}で予約</a>
      <!-- 各店舗の予約リンク -->
    </div>
  </div>
</section>
```

---

### Footer

```html
<footer class="footer">
  <div class="container">
    <div class="footer-group">
      <p class="footer-logo" lang="en">{グループ名}</p>
      <div class="footer-salons">
        <a href="yamato.html">{店舗名1}</a>
        <a href="turuma.html">{店舗名2}</a>
        <!-- 各店舗リンク -->
      </div>
    </div>
    <div class="footer-sns">
      <!-- SNSリンク -->
    </div>
    <p class="footer-copy">&copy; {年} {グループ名}. All rights reserved.</p>
  </div>
</footer>
```

---

## 各店舗ページ（yamato.html等）

各店舗ページは **lp-salon のセクション構成を流用** する。

### 構成
```
グループ共通ヘッダー（グループトップへのリンク付き）
  ↓
Hero（店舗固有の写真）
  ↓
Concept（01）— 店舗のコンセプト
  ↓
Features（02）— 店舗のこだわり
  ↓
Menu（03）— 店舗のメニュー
  ↓
Style Gallery（04）
  ↓
Staff（05）— 店舗のスタッフ
  ↓
Photo Gallery（06）
  ↓
Access（07）— 店舗のアクセス
  ↓
Reservation（08）— 店舗の予約
  ↓
CTA
  ↓
グループ共通フッター
```

### 店舗ページのナビゲーション

```html
<nav class="nav" role="navigation" aria-label="メインナビゲーション">
  <a href="/" class="nav-group-logo" lang="en">{グループ名}</a>
  <span class="nav-separator">|</span>
  <a href="yamato.html" class="nav-salon-name" lang="en">{店舗名}</a>
  <ul class="nav-links">
    <li><a href="#concept" lang="en">Concept</a></li>
    <li><a href="#menu" lang="en">Menu</a></li>
    <li><a href="#gallery" lang="en">Gallery</a></li>
    <li><a href="#access" lang="en">Access</a></li>
  </ul>
  <a href="#reservation" class="btn btn-nav" lang="en">Reserve</a>
</nav>
```

### 店舗ページのJSON-LD

各店舗ページには店舗固有のJSON-LDを設定（@type は業態に応じて HairSalon 等）。
グループトップには Organization として設定。
