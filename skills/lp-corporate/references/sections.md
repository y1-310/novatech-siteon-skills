# lp-corporate セクション仕様

## 1. Hero（ナンバリングなし）

### パターン1：全画面写真＋中央コピー — スタンダードデフォルト

```html
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-logo" lang="en">{サイト名英語}</h1>
    <p class="hero-sub">{キャッチコピー}</p>
    <a href="#contact" class="btn btn-hero">Contact</a>
  </div>
  <div class="hero-scroll" aria-hidden="true">
    <span lang="en">Scroll</span>
  </div>
</section>
```

仕様：
- 100vh、dark overlay（rgba(0,0,0,0.3)）
- 中央にサイト名＋キャッチ
- Scrollインジケーター（下部中央）
- background-size: cover、background-position: center

### パターン2：スライドショー — プロ以上

```html
<section class="hero hero-slideshow">
  <div class="hero-slides">
    <div class="hero-slide active" style="background-image: url('{画像1}')"></div>
    <div class="hero-slide" style="background-image: url('{画像2}')"></div>
    <div class="hero-slide" style="background-image: url('{画像3}')"></div>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-logo" lang="en">{サイト名英語}</h1>
    <p class="hero-sub">{キャッチコピー}</p>
  </div>
  <div class="hero-dots" role="tablist" aria-label="スライド切り替え">
    <button class="dot active" role="tab" aria-selected="true" aria-label="スライド1"></button>
    <button class="dot" role="tab" aria-selected="false" aria-label="スライド2"></button>
    <button class="dot" role="tab" aria-selected="false" aria-label="スライド3"></button>
  </div>
</section>
```

仕様：
- 100vh、3〜5枚フェード切り替え、5秒間隔
- ドットインジケーター
- JS: opacity切り替え（transform+opacityのみ）

### パターン3：超ミニマル — プロ以上のみ

```html
<section class="hero hero-minimal">
  <div class="hero-image">
    <img src="{画像}" alt="{サイト名}の代表写真またはオフィス写真" width="1200" height="800">
  </div>
  <div class="hero-info">
    <h1 lang="en">{サイト名英語}</h1>
    <ul class="hero-news">
      <li><time>{日付}</time><span>{お知らせ内容}</span></li>
      <!-- 3〜5件 -->
    </ul>
  </div>
</section>
```

仕様：
- 写真1枚＋ロゴのみ
- お知らせ3〜5件
- ナビゲーションが主役

---

## 2. About / Mission（ナンバリング: 01）

### パターンA：3段構造

```html
<section id="about" class="section">
  <span class="section-number">01</span>
  <h2 class="section-title" lang="en">About</h2>
  <p class="section-subtitle">事業理念</p>

  <div class="concept-block">
    <div class="concept-item">
      <span class="concept-label" lang="en">{英字ラベル1}</span>
      <h3>{日本語見出し1}</h3>
      <p>{本文1}</p>
    </div>
    <div class="concept-image">
      <img src="{画像}" alt="{説明}" width="600" height="800" loading="lazy">
    </div>
    <!-- 2段目、3段目も同構造 -->
  </div>
</section>
```

適する場面：理念・提供価値・約束を整理して伝えたい場合

### パターンB：ストーリー型

```html
<section id="about" class="section">
  <span class="section-number">01</span>
  <h2 class="section-title" lang="en">Mission</h2>
  <p class="section-subtitle">ミッション</p>

  <div class="concept-story">
    <div class="concept-text">
      <p class="concept-prose">{散文テキスト。行間広く、max-width: 560px。}</p>
    </div>
    <div class="concept-photo">
      <img src="{画像}" alt="{説明}" width="600" height="800" loading="lazy">
    </div>
  </div>
</section>
```

適する場面：創業背景・思想・想いを一本の流れで見せたい場合

### パターンC：一言コピー型

```html
<section id="about" class="section">
  <span class="section-number">01</span>
  <h2 class="section-title" lang="en">About</h2>
  <p class="section-subtitle">事業理念</p>

  <div class="concept-oneliner">
    <p class="concept-catch">{キャッチコピー 2〜3rem全幅}</p>
    <p class="concept-desc">{補足文 --text-midで控えめ}</p>
  </div>
</section>
```

適する場面：端的なメッセージで信頼感を出したい場合

---

## 3. Service（ナンバリング: 02）

### パターン1：定義リスト型 — スタンダードデフォルト

```html
<section id="service" class="section">
  <span class="section-number">02</span>
  <h2 class="section-title" lang="en">Service</h2>
  <p class="section-subtitle">サービス</p>

  <div class="menu-category">
    <h3 lang="en">{カテゴリ名}</h3>
    <dl class="menu-list">
      <div class="menu-item">
        <dt>{サービス名}</dt>
        <dd class="menu-price">{料金表示}</dd>
      </div>
      <!-- 繰り返し -->
    </dl>
    <p class="menu-desc">{サービス説明}</p>
  </div>
</section>
```

仕様：サービス名・説明・価格の整理を優先。料金なしの場合は説明文中心。

### パターン2：アイコン付きカード型 — プロ以上

```html
<div class="menu-cards">
  <div class="menu-card">
    <img src="{画像}" alt="{サービス名}" width="400" height="300" loading="lazy">
    <h4>{サービス名}</h4>
    <p>{説明文}</p>
    <span class="menu-price">{料金表示}</span>
  </div>
  <!-- 2〜3列グリッド -->
</div>
```

### パターン3：タブ切り替え型 — プロ以上

```html
<div class="menu-tabs" role="tablist">
  <button class="tab active" role="tab" aria-selected="true" aria-controls="tab-advisory">顧問</button>
  <button class="tab" role="tab" aria-selected="false" aria-controls="tab-spot">スポット</button>
  <button class="tab" role="tab" aria-selected="false" aria-controls="tab-project">プロジェクト</button>
</div>
<div id="tab-advisory" class="tab-panel" role="tabpanel">
  <!-- 定義リスト型のサービス -->
</div>
```

仕様：JS実装（CSS :target フォールバック）。noscript時は全展開。

### サービス追加情報

| 追加項目 | 条件 | 内容 |
|---------|------|------|
| 料金表示 | Q10.5＝あり | 各サービスに料金またはプラン価格を表示 |
| 応相談表示 | Q10.5＝応相談のみ表示 | 「応相談」表記で統一 |
| 対応範囲 | 任意 | エリア / 業界 / 企業規模を補足 |
| 成果物例 | 任意 | レポート / 提案書 / 契約書等を記載 |
| 初回相談 | 任意 | 「初回30分無料」等を表示 |

---

## 4. Strength / Features（ナンバリング: 03）

```html
<section id="strength" class="section">
  <span class="section-number">03</span>
  <h2 class="section-title" lang="en">Strength</h2>
  <p class="section-subtitle">選ばれる理由</p>

  <div class="features-list">
    <div class="feature-item">
      <div class="feature-image">
        <img src="{画像}" alt="{説明}" width="600" height="400" loading="lazy">
      </div>
      <div class="feature-text">
        <span class="feature-number" lang="en">01</span>
        <h3>{強みタイトル}</h3>
        <p>{強み説明文}</p>
      </div>
    </div>
    <!-- 交互レイアウト：奇数は画像左、偶数は画像右 -->
  </div>
</section>
```

仕様：
- 3〜4つの強み
- 交互レイアウト（flex-direction: row / row-reverse）
- モバイルでは縦並び

---

## 5. Profile / Team（ナンバリング: 04）

```html
<section id="profile" class="section">
  <span class="section-number">04</span>
  <h2 class="section-title" lang="en">Profile</h2>
  <p class="section-subtitle">代表紹介</p>

  <div class="staff-list">
    <div class="staff-card">
      <img src="{写真}" alt="{名前}" width="400" height="500" loading="lazy">
      <h3>{名前}</h3>
      <p class="staff-role" lang="en">{役職/肩書き}</p>
      <p class="staff-message">{メッセージ}</p>
      <dl class="staff-meta">
        <dt>経歴</dt><dd>{経歴}</dd>
        <dt>資格</dt><dd>{資格}</dd>
      </dl>
    </div>
    <!-- チームメンバーがいる場合は繰り返し -->
  </div>
</section>
```

---

## 6. Company / Info（ナンバリング: 05）

```html
<section id="company" class="section">
  <span class="section-number">05</span>
  <h2 class="section-title" lang="en">Company</h2>
  <p class="section-subtitle">会社概要</p>

  <div class="access-content">
    <div class="access-info">
      <dl>
        <dt>住所</dt><dd>{住所}</dd>
        <dt>営業時間</dt><dd>{営業時間}</dd>
        <dt>定休日</dt><dd>{定休日}</dd>
        <dt>電話番号</dt><dd><a href="tel:{電話番号}">{電話番号表示}</a></dd>
        <dt>お支払い方法</dt><dd>{支払い方法}</dd>
      </dl>
    </div>
    <div class="access-map">
      <iframe
        src="https://www.google.com/maps/embed?pb={MAP_EMBED_ID}"
        width="100%" height="400" style="border:0;" allowfullscreen=""
        loading="lazy" referrerpolicy="no-referrer-when-downgrade"
        title="{サイト名}の地図"
      ></iframe>
    </div>
  </div>
</section>
```

仕様：
- 定義リスト形式
- 会社名 / 所在地 / 連絡先 / 営業時間を整理
- Google Maps埋め込み可

---

## 7. Contact / CTA（ナンバリング: 06）

### パターンA：外部リンク型 — スタンダードデフォルト

```html
<section id="contact" class="section contact-cta">
  <span class="section-number">06</span>
  <h2 class="section-title" lang="en">Contact</h2>
  <p class="section-subtitle">お問い合わせ</p>

  <div class="reservation-links">
    <a href="{資料請求URL}" class="btn">資料請求</a>
    <a href="tel:{電話番号}" class="btn btn-secondary">電話で相談</a>
    <a href="{LINE_URL}" class="btn btn-tertiary">LINE相談</a>
  </div>
</section>
```

### パターンB：営業カレンダー表示 — プロ以上

```html
<section id="contact" class="section">
  <span class="section-number">06</span>
  <h2 class="section-title" lang="en">Consultation</h2>
  <p class="section-subtitle">相談可能日</p>

  <div class="calendar-wrap">
    <!-- reservation-ui.md の営業カレンダー仕様を流用 -->
  </div>
</section>
```

### パターンC：問い合わせフォーム設置 — プロ以上

```html
<section id="contact" class="section">
  <span class="section-number">06</span>
  <h2 class="section-title" lang="en">Contact</h2>
  <p class="section-subtitle">お問い合わせ</p>

  <form class="contact-form">
    <label>お名前<input type="text" name="name" required></label>
    <label>メールアドレス<input type="email" name="email" required></label>
    <label>ご相談内容<textarea name="message" rows="6" required></textarea></label>
    <button type="submit" class="btn">送信する</button>
  </form>
</section>
```

### パターンD：問い合わせウィジェット埋め込み — プロ以上

```html
<section id="contact" class="section">
  <span class="section-number">06</span>
  <h2 class="section-title" lang="en">Schedule</h2>
  <p class="section-subtitle">日程調整</p>

  <div class="contact-widget">
    <iframe src="{Calendly等の埋め込みURL}" title="問い合わせウィジェット"></iframe>
  </div>
</section>
```

---

## 8. Footer（ナンバリングなし）

```html
<footer class="footer">
  <div class="footer-brand">
    <p class="footer-logo" lang="en">{サイト名英語}</p>
    <p class="footer-sub">{日本語サブ}</p>
  </div>
  <div class="footer-info">
    <p>{住所}</p>
    <p><a href="tel:{電話番号}">{電話番号表示}</a></p>
  </div>
  <small>&copy; {年} {サイト名英語}. All rights reserved.</small>
</footer>
```

---

## オプションセクション補足

### Price / Fee
- プラン比較表または定義リスト
- 「応相談」表示時は問い合わせ導線を近接配置

### Works / Case Study
- 実績カード3〜6件
- 課題 / 提案 / 成果の3点を要約

### Blog / Column
- 記事一覧＋カテゴリ
- SEO導線としてtitle/description整理

### FAQ
- 3〜5問
- アコーディオン形式

### Flow
- 3〜6ステップ
- 初回相談→提案→契約→実行など

### Testimonial
- 顧客名は匿名可
- 役職・業種を補足

### Partner
- 提携先ロゴ一覧
- 外部リンクは別タブ

### News
- 日付＋タイトル一覧
- 3〜6件

### Recruit
- 募集職種＋勤務形態＋応募方法

### Media
- 掲載媒体ロゴ＋リンク
- 実績・受賞の補足テキスト可

## JSON-LD仕様

| サブタイプ | @type |
|-----------|------|
| 弁護士 | LegalService |
| 税理士 | AccountingService |
| 社労士 / 行政書士 / コンサル / IT / 映像・デザイン | ProfessionalService |
| その他 | Organization |
