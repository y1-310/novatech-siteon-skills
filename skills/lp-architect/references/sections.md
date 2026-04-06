# lp-architect セクション仕様

## 1. Hero（ナンバリングなし）

### パターン1：全画面写真＋中央ロゴ（Kocochi型）— スタンダードデフォルト

```html
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-logo" lang="en">{事務所名英語}</h1>
    <p class="hero-sub">{タグライン}</p>
    <a href="#contact" class="btn btn-hero">Contact</a>
  </div>
  <div class="hero-scroll" aria-hidden="true">
    <span lang="en">Scroll</span>
  </div>
</section>
```

仕様：
- 100vh、dark overlay（rgba(0,0,0,0.28)）
- 中央に事務所名＋タグライン
- Scrollインジケーター（下部中央）
- background-size: cover、background-position: center

### パターン2：スライドショー（Toivo型）— プロ以上

```html
<section class="hero hero-slideshow">
  <div class="hero-slides">
    <div class="hero-slide active" style="background-image: url('{画像1}')"></div>
    <div class="hero-slide" style="background-image: url('{画像2}')"></div>
    <div class="hero-slide" style="background-image: url('{画像3}')"></div>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-logo" lang="en">{事務所名英語}</h1>
    <p class="hero-sub">{タグライン}</p>
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

### パターン3：超ミニマル（STUDIO YY型）— プロ以上のみ

```html
<section class="hero hero-minimal">
  <div class="hero-image">
    <img src="{画像}" alt="{事務所名}の代表施工事例" width="1200" height="800">
  </div>
  <div class="hero-info">
    <h1 lang="en">{事務所名英語}</h1>
    <ul class="hero-news">
      <li><time>{日付}</time><span>{お知らせ内容}</span></li>
      <!-- 3〜5件 -->
    </ul>
  </div>
</section>
```

仕様：
- 写真1枚＋事務所名のみ
- お知らせ3〜5件
- ナビゲーションが主役

---

## 2. Philosophy / Concept（ナンバリング: 01）

### パターンA：設計思想を端的に見せる（Kocochi型）

```html
<section id="concept" class="section">
  <span class="section-number">01</span>
  <h2 class="section-title" lang="en">Philosophy</h2>
  <p class="section-subtitle">設計思想</p>

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

適する場面：設計方針を整理して伝えたい設計事務所

### パターンB：ストーリーで信頼を積む（Toivo型）

```html
<section id="concept" class="section">
  <span class="section-number">01</span>
  <h2 class="section-title" lang="en">Concept</h2>
  <p class="section-subtitle">コンセプト</p>

  <div class="concept-story">
    <div class="concept-text">
      <p class="concept-prose">{散文テキスト。行間広く、max-width: 480px。}</p>
    </div>
    <div class="concept-photo">
      <img src="{画像}" alt="{説明}" width="600" height="800" loading="lazy">
    </div>
  </div>
</section>
```

適する場面：暮らし方や改修思想を丁寧に説明したい場合

### パターンC：一言コピー型（STUDIO YY型）

```html
<section id="concept" class="section">
  <span class="section-number">01</span>
  <h2 class="section-title" lang="en">Concept</h2>
  <p class="section-subtitle">コンセプト</p>

  <div class="concept-oneliner">
    <p class="concept-catch">{キャッチコピー 2〜3rem全幅}</p>
    <p class="concept-desc">{補足文 --text-midで控えめ}</p>
  </div>
</section>
```

適する場面：設計事務所のミニマルトーン

---

## 3. Works（ナンバリング: 02）

### パターン1：グリッド一覧（STUDIO YY型）— スタンダードデフォルト

```html
<section id="works" class="section">
  <span class="section-number">02</span>
  <h2 class="section-title" lang="en">Works</h2>
  <p class="section-subtitle">施工事例</p>

  <div class="works-grid">
    <article class="work-card">
      <a href="works/project-01.html">
        <img src="{画像}" alt="{事例名}" width="640" height="480" loading="lazy">
        <div class="work-meta">
          <h3>{事例名}</h3>
          <p>{所在地} / {カテゴリ}</p>
        </div>
      </a>
    </article>
    <!-- 繰り返し -->
  </div>
</section>
```

仕様：
- 2〜3列グリッド
- 写真＋事例名＋所在地・カテゴリ
- クリックで個別ページへ

### パターン2：大写真＋テキスト（Kocochi型）— プロ以上

```html
<section id="works" class="section">
  <span class="section-number">02</span>
  <h2 class="section-title" lang="en">Works</h2>
  <p class="section-subtitle">施工事例</p>

  <div class="works-stack">
    <article class="work-feature">
      <div class="work-photo">
        <img src="{画像}" alt="{事例名}" width="1200" height="800" loading="lazy">
      </div>
      <div class="work-text">
        <h3>{事例名}</h3>
        <p class="work-spec">{所在地} / {構造} / {延床面積}</p>
        <p>{説明文}</p>
        <a href="works/project-01.html" class="text-link">詳しく見る</a>
      </div>
    </article>
    <!-- 繰り返し -->
  </div>
</section>
```

仕様：
- 1カラムで大きな写真＋説明
- スクロールで次の事例

### パターン3：カテゴリタブ（marutaHOUSE型）— プロ以上

```html
<section id="works" class="section">
  <span class="section-number">02</span>
  <h2 class="section-title" lang="en">Works</h2>
  <p class="section-subtitle">施工事例</p>

  <div class="works-tabs" role="tablist">
    <button class="tab active" role="tab" aria-selected="true" aria-controls="tab-newbuild">新築</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="tab-renovation">リフォーム</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="tab-flat">平屋</button>
  </div>
  <div id="tab-newbuild" class="tab-panel" role="tabpanel">
    <!-- グリッド一覧 -->
  </div>
</section>
```

仕様：
- 新築 / リフォーム / 平屋等のタブ切り替え
- noscript時は全展開

### Works追加情報

| 追加項目 | 条件 | 内容 |
|---------|------|------|
| 件数表示 | Q10.5に応じて | 3件以下なら厳選表示、11件以上なら一覧密度を上げる |
| 竣工年 | 任意 | 各事例に「2025」等を表示 |
| 構造・面積 | 任意 | 木造 / RC / 100.2㎡ 等 |
| 設計の要点 | 任意 | 各事例に1〜2行 |
| 写真点数 | 任意 | 個別ページで5〜12枚を推奨 |

---

## 4. Features / Strengths（ナンバリング: 03）

```html
<section id="features" class="section">
  <span class="section-number">03</span>
  <h2 class="section-title" lang="en">Strengths</h2>
  <p class="section-subtitle">強み</p>

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

## 5. Flow（ナンバリング: 04）

```html
<section id="flow" class="section">
  <span class="section-number">04</span>
  <h2 class="section-title" lang="en">Flow</h2>
  <p class="section-subtitle">家づくりの流れ</p>

  <ol class="flow-list">
    <li class="flow-item">
      <span class="flow-number" lang="en">01</span>
      <h3>{ステップ名}</h3>
      <p>{説明文}</p>
    </li>
    <!-- 5〜8ステップ -->
  </ol>
</section>
```

仕様：
- 5〜8ステップ
- 相談から引き渡しまでの流れを図解

---

## 6. Staff / About（ナンバリング: 05）

```html
<section id="about" class="section">
  <span class="section-number">05</span>
  <h2 class="section-title" lang="en">About</h2>
  <p class="section-subtitle">代表・事務所紹介</p>

  <div class="about-grid">
    <div class="about-photo">
      <img src="{写真}" alt="{代表名}" width="500" height="640" loading="lazy">
    </div>
    <div class="about-text">
      <h3>{代表名}</h3>
      <p class="about-role" lang="en">{肩書き}</p>
      <p>{プロフィール本文}</p>
      <dl class="about-meta">
        <div><dt>資格</dt><dd>{資格}</dd></div>
        <div><dt>受賞歴</dt><dd>{受賞歴}</dd></div>
      </dl>
    </div>
  </div>
</section>
```

---

## 7. Access / Contact（ナンバリング: 06）

```html
<section id="contact" class="section">
  <span class="section-number">06</span>
  <h2 class="section-title" lang="en">Access</h2>
  <p class="section-subtitle">所在地・お問い合わせ</p>

  <div class="contact-grid">
    <div class="contact-info">
      <dl>
        <div><dt>住所</dt><dd>{住所}</dd></div>
        <div><dt>営業時間</dt><dd>{営業時間}</dd></div>
        <div><dt>定休日</dt><dd>{定休日}</dd></div>
        <div><dt>電話</dt><dd><a href="tel:{電話番号}">{電話番号}</a></dd></div>
      </dl>
    </div>
    <div class="contact-map">
      <iframe src="{Google Maps埋め込みURL}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>
```

### 問い合わせUIパターン（_common/reservation-ui.md を準用）

| パターン | 条件 | 内容 |
|---------|------|------|
| A：外部リンク | Q9.5＝外部リンクのみ | フォーム / LINE / 電話 / メールへの導線 |
| B：営業カレンダー | Q9.5＝営業カレンダー表示 | 相談可能日の表示 |
| C：問い合わせフォーム | Q9.5＝問い合わせフォーム設置 | Formspree / Web3Forms |
| D：問い合わせウィジェット | Q9.5＝問い合わせウィジェット埋め込み | iframe埋め込み |

---

## 8. CTA（ナンバリングなし）

```html
<section class="cta-band">
  <div class="cta-inner">
    <p class="cta-kicker" lang="en">Consultation</p>
    <h2>まずは無料相談・資料請求から</h2>
    <div class="cta-actions">
      <a href="#contact" class="btn btn-primary">無料相談を申し込む</a>
      <a href="{資料URL}" class="btn btn-secondary">資料をダウンロード</a>
    </div>
  </div>
</section>
```

---

## 9. Footer（ナンバリングなし）

```html
<footer class="footer">
  <div class="footer-inner">
    <a href="/" class="footer-logo" lang="en">{事務所名英語}</a>
    <nav class="footer-nav" aria-label="フッターナビゲーション">
      <a href="#concept">Concept</a>
      <a href="#works">Works</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
    <p class="footer-copy">© {年} {事務所名英語}</p>
  </div>
</footer>
```

---

## オプションセクション

| セクション | 条件 | 仕様 |
|-----------|------|------|
| Fee / Price | Q18選択時 | 設計料目安（工事金額の○% 等） |
| Blog / Column | Q18選択時 | 記事一覧＋カテゴリ |
| Awards | Q18選択時 | 受賞一覧（年・名称・主催） |
| Lineup | Q18選択時 | 商品ラインカード |
| Performance | Q18選択時 | 耐震・断熱等級の数値カード |
| Event | Q18選択時 | 見学会や相談会一覧＋申込導線 |
| Model Room | Q18選択時 | モデルルーム案内＋予約導線 |
| Before-After | Q18選択時 | 比較写真＋説明 |
| Cost Guide | Q18選択時 | 価格帯・予算感の説明 |
| Recruit | Q18選択時 | 募集職種＋応募方法 |

## JSON-LD 方針

| サブタイプ | @type |
|-----------|------|
| 設計事務所 | ArchitecturalFirm |
| 工務店 | HomeAndConstructionBusiness |
| リノベーション会社 | HomeAndConstructionBusiness |
