# lp-salon-group セクション仕様

> **画像選定ルール**: このファイル内の `{画像}` プレースホルダーは、デモサイト生成時に
> `_common/image-guide.md` セクション8.5のフローに従って Unsplash/Pexels の実画像URLに差し替えること。
> placehold.co はローカル開発時のみ使用可。デモ提示用サイトでは実画像必須。


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

### ヒーロー直下CTA（オプション：Q18選択時）【v1.15追加】

lp-salon と同一構造。グループトップ版の調整：
- ボタン構成：**店舗を探す → HPB → LINE**
- 「店舗を探す」ボタン → `#salons` へのアンカーリンク
- デフォルト：ON（おすすめ）

```html
<div class="hero-cta-bar">
  <p class="hero-cta-text">ご予約・店舗のご案内はこちら</p>
  <div class="hero-cta-buttons">
    <a href="#salons" class="btn btn-cta-bar">店舗を探す</a>
    <a href="{HPB URL}" class="btn btn-cta-bar" target="_blank" rel="noopener">Hot Pepper で予約</a>
    <a href="{LINE URL}" class="btn btn-cta-bar" target="_blank" rel="noopener">LINE で予約</a>
  </div>
</div>
```

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

### 代表メッセージ（オプション：Q18選択時）【v1.15追加】

salon版 Owner Story をグループ向けに「Message」として調整。グループトップ（index.html）のみに配置。

```html
<section id="message" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Message</h2>
  <p class="section-subtitle">代表メッセージ</p>

  <div class="message-content">
    <div class="message-photo">
      <img src="{代表写真}" alt="{代表名}" width="400" height="533" loading="lazy">
    </div>
    <div class="message-text">
      <h3>{代表名}<span class="message-role">代表</span></h3>
      <div class="message-body">
        <p>{グループ全体の理念・ビジョン 3〜5段落}</p>
      </div>
    </div>
  </div>
</section>
```

- デフォルト：OFF
- 各店舗ページには配置しない

---

### Salon List（02）— グループ固有【v1.15強化】

```html
<section id="salons" class="section">
  <span class="section-number">02</span>
  <h2 class="section-title" lang="en">Salons</h2>
  <p class="section-subtitle">店舗一覧</p>

  <div class="salon-grid">
    <a href="yamato.html" class="salon-card">
      <img src="{店舗写真}" alt="{店舗名}の外観" width="600" height="338" loading="lazy">
      <div class="salon-card-info">
        <h3 lang="en">{店舗名英字}</h3>
        <p class="salon-name-ja">{店舗名日本語}</p>
        <p class="salon-catch">{キャッチコピー（1行）}</p>
        <p class="salon-area">{エリア・最寄り駅}</p>
        <span class="salon-link" lang="en">View More →</span>
      </div>
    </a>
    <!-- 各店舗繰り返し -->
  </div>
</section>
```

仕様：
- 各カード：店舗メイン写真（16:9横長）+ 店舗名 + キャッチコピー + エリア + 「この店舗を見る」ボタン
- 2〜3列グリッド（デスクトップ）/ 1列（モバイル）
- ホバーで画像にscale(1.02)＋オーバーレイ
- 常にON（グループ必須セクション）
- キャッチコピー・エリアはオーナー意向で省略可
- 写真がない店舗は placehold.co

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

#### レイアウトルール（必須）

- **募集職種カードは 1 カラム縦並び**（`.recruit-positions` は `display: grid; grid-template-columns: 1fr`）。tablet / mobile 全てで 1 カラム維持。2 カラム以上にしない
- **各職種カード内の dt/dd は横並びの grid**（`.position-list` は `display: grid; grid-template-columns: 120px 1fr; column-gap: 18px; row-gap: 10px; align-items: baseline`）
- **モバイル（≤767px）でも grid を維持**。`.company-list` を 1 カラムに崩しても `.position-list` は崩さない
- 長い値（資格欄など）は `white-space: nowrap` を付けず自然に折り返す（情報損失防止）
- ※ axe-core 対応のため `<dl>` の直下に `<div>` を入れない。dt と dd は直接子要素にする

参考 CSS:

```css
.recruit-positions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.position-list {
  margin: 0;
  display: grid;
  grid-template-columns: 120px 1fr;
  column-gap: 18px;
  row-gap: 10px;
  align-items: baseline;
}

.position-list dd {
  margin: 0;
}

@media (max-width: 767px) {
  .position-list {
    column-gap: 14px;
    row-gap: 8px;
  }
}
```


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
        <dl class="position-list">
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
    <!-- 採用専用ページ作成時（プロ以上）-->
    <a href="recruit.html" class="btn btn-outline">採用について詳しく見る</a>
  </div>
</section>
```

### recruit.html（プロ以上で追加可能）【v1.15追加】

Q18で「採用セクション」選択時の追加質問「採用専用ページを作成しますか？」→「はい」の場合に生成。

構成：
- グループ共通ヘッダー/フッター
- 先輩スタッフの声（2〜3名）
- 1日の流れ（タイムライン形式）
- 給与・待遇詳細
- 研修制度・キャリアパス
- 応募フォーム or 外部リンク（Indeed等）
- canonical URL・ナビゲーション追加必須

オーナーが「採用はIndeed等で行っている」→ 外部リンクボタンのみに簡略化

---

### CTA + エリア別店舗選択【v1.15追加】

```html
<section class="section cta-section">
  <div class="container">
    <p class="cta-catch" lang="en">{英字キャッチ}</p>
    <p class="cta-sub">{日本語サブコピー}</p>

    <!-- エリア別店舗選択（Q18選択時・デフォルトON）-->
    <div class="cta-area-select">
      <p class="cta-area-label">エリアから探す</p>
      <!-- 店舗4件以下：ボタン形式 -->
      <div class="cta-salons">
        <a href="yamato.html#reservation" class="btn btn-cta">{店舗名1}（{エリア}）</a>
        <a href="turuma.html#reservation" class="btn btn-cta">{店舗名2}（{エリア}）</a>
        <!-- 各店舗の予約リンク -->
      </div>
      <!-- 店舗5件以上：select形式 -->
      <!--
      <select class="cta-salon-select" onchange="location.href=this.value+'#reservation'">
        <option value="">店舗を選ぶ</option>
        <option value="yamato.html">{店舗名1}（{エリア}）</option>
      </select>
      -->
    </div>
  </div>
</section>
```

仕様：
- 4件以下→ボタン形式で全店舗並列、5件以上→`<select>`で選択
- Q18「エリア別店舗選択」でON/OFF。デフォルト：ON
- 各ボタン/選択肢にエリア名を併記

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

### 各店舗ページのオプション（v1.15追加）

lp-salon v1.13 の共通改修を各店舗ページに適用：
- **口コミ全文カード型**（改修C）— 各店舗ページごとにON/OFF可。プロ以上
- **One Day（来店の流れ）**（改修D）— 全店舗共通フロー or 個別定義。プロ以上
- **2枚並列レイアウト**（改修E）— Featuresで写真2枚横並び。Agent自動判断
- **予約UI 3点セット**（改修F）— HPB/LINE/電話/Instagram DM。Q9回答ベース

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
