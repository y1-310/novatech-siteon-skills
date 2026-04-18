# lp-corporate セクション仕様

> **画像選定ルール**: このファイル内の `{画像}` プレースホルダーは、デモサイト生成時に
> `_common/image-guide.md` セクション8.5のフローに従って Unsplash/Pexels の実画像URLに差し替えること。
> placehold.co はローカル開発時のみ使用可。デモ提示用サイトでは実画像必須。
>
> **モバイルナビ実装**: ハンバーガーメニューの HTML/CSS/JS は `_common/mobile-nav.md` を参照すること。


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

## ヒーロー直下CTA（オプション：Q18選択時）【v1.19追加】

ボタン構成：**無料相談はこちら → 電話で相談**
デフォルト：ON。

```html
<div class="hero-cta-bar">
  <p class="hero-cta-text">まずはお気軽にご相談ください</p>
  <div class="hero-cta-buttons">
    <a href="#contact" class="btn btn-cta-bar">無料相談はこちら</a>
    <a href="tel:{電話番号}" class="btn btn-cta-bar-outline">電話で相談</a>
  </div>
</div>
```

---

## 代表者プロフィール強化（Q18選択時）【v1.19追加】

分析5/5件で代表者の顔出しが信頼の基本。デフォルト：ON（強く推奨）。

セクション英字タイトル：`Representative` / `Profile`、日本語サブ：`代表について`

推奨項目：
- 顔写真（必須。分析5/5件で顔出し）
- 資格（税理士/行政書士/社労士/弁護士等）
- 登録番号（任意）
- 経歴・専門分野
- 代表メッセージ（2〜3段落）
- 所属団体・認定

オーナーが「顔を出したくない」→ OFF可。ただしAgentが「顔出しは信頼度に大きく影響します」と一度だけ提案。

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

## FAQ — 必須セクション【v1.19強化】

分析5/5件で掲載。士業では「何を相談できるか」「費用はいくらか」の疑問を事前解消が問い合わせ率に直結。
**デフォルト：ON（必須扱い）。** 最低5問。オーナーが明示的に不要と言わない限りON。

士業別デフォルトFAQ（たたき台。オーナーがカスタマイズ）：

**税理士：** 初回相談は無料ですか？ / 顧問料の目安 / 個人事業主でも対応可能か / 確定申告だけの依頼 / 対応エリア
**行政書士：** 対応手続き / 費用 / 相談だけでも可能か / 土日夜間の相談 / オンライン対応
**社労士：** 対応業務の範囲 / 顧問契約の内容 / 助成金申請 / スポット依頼 / 初回相談
**弁護士：** 相談の流れ / 弁護士費用 / 初回無料相談 / 秘密厳守 / 対応分野
**コンサル：** 契約の流れ / 費用体系 / 成果物 / リモート対応 / 契約期間

---

## 料金表示2パターン【v1.19追加】

Q10で料金情報が記入された場合 → パターン1自動適用。「未定」「要相談」→ パターン2自動適用。

### パターン1：料金明示型
サービス名＋料金（税込）＋備考。表形式またはカード形式。
「※上記は目安です。詳細はお問い合わせください」の注記を必ず追加。

### パターン2：要問い合わせ型
料金記載せず。サービス一覧は掲載するが、価格欄は「要相談」「お見積もり」。
問い合わせボタンを配置。

---

## 対応業務一覧セクション【v1.19追加】

**必須セクション扱い（デフォルトON）。** 「何ができるか」を一覧で見せる。

```html
<section id="service-list" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Service</h2>
  <p class="section-subtitle">対応業務</p>

  <div class="service-grid">
    <div class="service-card">
      <div class="service-icon"><!-- CSS図形 or SVGアイコン --></div>
      <h3>{業務名}</h3>
      <p>{1行説明}</p>
    </div>
    <!-- 業務カテゴリ別にグループ化 -->
  </div>
</section>
```

- 2〜3列グリッド（デスクトップ）/ 1列（モバイル）
- 対応業務不明の場合はAgentが士業別の一般的な業務リストをたたき台提案

---

## 解決事例セクション（オプション：Q18選択時、プロ以上）【v1.19追加】

守秘義務配慮の匿名事例。「お客様の声」の代替として有効。

```html
<section id="cases" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Case</h2>
  <p class="section-subtitle">解決事例</p>

  <div class="case-cards">
    <div class="case-card">
      <p class="case-client">A社様（製造業）</p>
      <h3 class="case-problem">{お悩み}</h3>
      <p class="case-action">{対応内容}</p>
      <p class="case-result">{結果（○○万円のコスト削減 等）}</p>
    </div>
    <!-- 3〜5件 -->
  </div>
  <p class="case-note">※守秘義務に配慮し、社名・個人名は仮名にしています。</p>
</section>
```

- デフォルト：OFF。プロ以上
- オーナーが実名掲載希望 → 口コミ全文型を使用

---

## 口コミ全文カード型（オプション：Q18選択時、プロ以上）【v1.19追加】

lp-salon と同一仕様。士業では「お客様の声」として掲載。
守秘義務で掲載できないケースが多い → 解決事例セクション（改修I）を代替推奨。

---

## 守秘義務配慮ガイドライン【v1.19追加】

- お客様の声・事例は全て匿名化が基本
- 実名掲載はオーナーの明示的な許可がある場合のみ
- 「A社様（製造業）」「B様（個人事業主）」等の表記を推奨
- 具体的な金額・手続き内容は一般化して掲載

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
