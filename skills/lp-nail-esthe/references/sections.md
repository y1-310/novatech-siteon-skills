# lp-nail-esthe セクション仕様

> **画像選定ルール**: このファイル内の `{画像}` プレースホルダーは、デモサイト生成時に
> `_common/image-guide.md` セクション8.5のフローに従って Unsplash/Pexels の実画像URLに差し替えること。
> placehold.co はローカル開発時のみ使用可。デモ提示用サイトでは実画像必須。
>
> **モバイルナビ実装**: ハンバーガーメニューの HTML/CSS/JS は `_common/mobile-nav.md` を参照すること。


## 概要

lp-salon の sections.md と同じ基本構成。
以下は nail-esthe 固有の差分と追加セクションを記載する。

---

## Hero

lp-salon と同じ3パターン + スプリットレイアウト（v1.14追加）。

### パターン4：スプリットレイアウト（esNAIL型）— プロ以上

```html
<section class="hero hero-split">
  <div class="hero-text">
    <h1 class="hero-logo" lang="en">{サロン名英語}</h1>
    <p class="hero-sub">{キャッチコピー}</p>
    <a href="#reservation" class="btn btn-hero">ご予約はこちら</a>
  </div>
  <div class="hero-photo">
    <img src="{画像}" alt="{サロン名}の施術イメージ" width="960" height="1080">
  </div>
</section>
```

仕様：
- デスクトップ：左50%テキスト（vertical-align: middle）＋ 右50%写真（100vh、object-fit: cover）
- モバイル：写真上（60vh）＋ テキスト下
- テキスト側背景：`var(--bg)` または `var(--bg-alt)`

---

## ヒーロー直下CTA（オプション：Q18選択時）【v1.14追加】

lp-salon と同一構造。nail-esthe固有の調整：
- ボタン並び順：**LINE → HPB → 電話**（LINE予約が主流）
- テキスト：「ご予約・空き状況はLINEでご確認いただけます」
- LINEボタンを最も目立たせる（サイズ大＋LINEブランドカラー `#06C755`）
- デフォルト：ON（おすすめ）
nail-esthe固有の違い：
- ネイル：手元のクローズアップ写真がヒーローに適する
- エステ：施術風景 or リラックス空間の写真
- まつエク：目元のクローズアップ写真

---

## Concept（01）

lp-salon と同じ3パターン。
パターンB（ストーリー型）が特に適合する。
- ネイル：「指先から始まる、あなたらしさ」
- エステ：「本来の美しさを引き出す」
- まつエク：「目元が変わると、印象が変わる」

---

## Therapist / Nailist 紹介セクション（オプション：Q18選択時）【v1.14追加】

業態に応じて呼称を自動決定：
- ネイル → セクション英字タイトル `Nailist`、日本語サブ `施術者について`
- エステ → `Therapist`、`施術者について`
- まつエク → `Eyelist`、`施術者について`

```html
<section id="therapist" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">{Nailist / Therapist / Eyelist}</h2>
  <p class="section-subtitle">施術者について</p>

  <div class="therapist-content">
    <div class="therapist-photo">
      <img src="{施術者写真}" alt="{名前}" width="400" height="533" loading="lazy">
    </div>
    <div class="therapist-text">
      <h3>{名前}<span class="therapist-role">{肩書き}</span></h3>
      <div class="therapist-story">
        <p>{施術歴・資格・得意な施術・使用ブランドへのこだわり 3〜5段落}</p>
      </div>
      <ul class="therapist-credentials">
        <li>{資格・認定（JNA1級、エステティシャン認定等）}</li>
      </ul>
    </div>
  </div>
</section>
```

仕様：
- 写真：施術中の手元写真、またはポートレート
- デフォルト：OFF（写真・経歴の準備が必要）
- 全プランで選択可能
- 配置：Staffの前、またはConceptの後

---

## Features（02）

### 2枚並列レイアウト（オプション）【v1.14追加】

lp-salon と同一仕様。写真が2枚以上のこだわりブロックでは2枚並列を検討。
nail-estheでは1:1正方形を基本とする。

---

業態別のこだわり例：

### ネイル
- パラジェル / フィルイン対応
- 持ちの良さ（3〜4週間キープ）
- デザインのバリエーション
- 爪に優しい施術

### エステ
- 使用機器・技術の説明
- オーガニック / 天然成分へのこだわり
- プライベート空間
- カウンセリングの丁寧さ

### まつエク
- 使用素材（シルク / ミンク / セーブル）
- 自まつ毛への優しさ
- デザインの豊富さ
- 持続性（リペアの頻度）

---

## Menu（03）

lp-salon と同じ3パターンの基本構造。

### ネイル固有のメニュー構成
- ジェルネイル（ワンカラー / グラデーション / フレンチ等）
- 定額デザインコース（月額・定額制）
- ケアメニュー（甘皮処理 / ネイルケア）
- オフ代（自店オフ / 他店オフ）
- アート追加料金

### エステ固有のメニュー構成
- フェイシャルコース
- ボディコース
- 初回体験コース（強調表示）
- お悩み別メニュー
- 回数券・コース料金

### まつエク固有のメニュー構成
- 本数別メニュー（80本 / 100本 / 120本 / 140本）
- デザイン別（ナチュラル / キュート / ゴージャス）
- リペア
- オフのみ

---

## Treatment Flow（オプション：Q18選択時、プロ以上）【v1.14追加】

lp-salon の One Day をnail-esthe向けに調整。エステではデフォルトON。

```html
<section id="flow" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Treatment Flow</h2>
  <p class="section-subtitle">施術の流れ</p>

  <div class="flow-timeline">
    <div class="flow-item">
      <div class="flow-image">
        <img src="{写真}" alt="{ステップ名}" width="600" height="400" loading="lazy">
      </div>
      <div class="flow-text">
        <span class="flow-number" lang="en">01</span>
        <h3>{ステップ小見出し}</h3>
        <p>{説明文 1〜2行}</p>
      </div>
    </div>
    <!-- 3〜5ステップ、左右交互レイアウト -->
  </div>
</section>
```

業態別デフォルトステップ：

**ネイル：** ご来店・カウンセリング → ケア → ベースコート → デザイン・アート → トップコート・仕上げ
**エステ：** ご来店・カウンセリング → クレンジング・洗顔 → 施術 → パック・仕上げ → アフターカウンセリング
**まつエク：** ご来店・カウンセリング → テーピング・下まつげ保護 → エクステ装着 → 仕上げ・確認 → アフターケア説明

- エステ：デフォルトON（施術内容が不透明に感じられやすいため）
- ネイル・まつエク：デフォルトOFF

---

## 口コミ全文カード型（オプション：Q18選択時、プロ以上）【v1.14追加】

lp-salon と同一仕様。カードスタイルはnail-estheのライト背景に合わせる：
- カード背景：`var(--bg-alt)`
- ★アイコン色：`var(--accent)`
- 数値バー型（スタンダード）/ 全文カード型（プロ以上）/ 両方

---

## Design Gallery（04）— nail-esthe最重要セクション

### パターン3：グリッド型（FASTNAIL型）— nail-estheデフォルト 【v1.14追加】

```html
<section id="gallery" class="section">
  <span class="section-number">04</span>
  <h2 class="section-title" lang="en">{Gallery/Collection/Styles}</h2>
  <p class="section-subtitle">デザイン</p>

  <div class="design-grid">
    <div class="design-item">
      <img src="{画像}" alt="{デザイン名}" width="400" height="400" loading="lazy">
      <div class="design-overlay">
        <span class="design-name">{デザイン名}</span>
      </div>
    </div>
    <!-- 12〜20枚 -->
  </div>
  <button class="btn btn-outline gallery-more">もっと見る</button>
  <!-- noscript時は全写真表示 -->
  <noscript><style>.gallery-more{display:none}.design-item:nth-child(n+13){display:block!important}</style></noscript>
</section>
```

仕様：
- 3〜4列グリッド（gap: 4px〜8px）、1:1正方形
- ホバー：scale(1.02) + overlay
- 12枚超は非表示→「もっと見る」で展開、またはInstagramリンク
- **nail-estheではQ17のデフォルトをグリッド型にする**

### ネイル：デザインギャラリー（既存パターン）

```html
<section id="gallery" class="section">
  <span class="section-number">04</span>
  <h2 class="section-title" lang="en">{Gallery/Collection/Styles}</h2>
  <p class="section-subtitle">デザイン</p>

  <div class="design-grid">
    <div class="design-item">
      <img src="{画像}" alt="{デザイン名}" width="400" height="400" loading="lazy">
      <div class="design-info">
        <span class="design-name">{デザイン名}</span>
        <span class="design-price">¥{価格}〜<span class="tax">（税込）</span></span>
      </div>
    </div>
    <!-- 4列グリッド、1:1正方形 -->
  </div>
</section>
```

仕様：
- 4列（desktop）/ 3列（tablet）/ 2列（mobile）
- 1:1 正方形（aspect-ratio: 1/1、object-fit: cover）
- ホバーで価格表示

### 定額デザインコース

```html
<div class="course-cards">
  <div class="course-card">
    <h3>{コース名}</h3>
    <p class="course-price">月額 ¥{価格}<span class="tax">（税込）</span></p>
    <p class="course-desc">{内容説明}</p>
    <div class="course-samples">
      <!-- サンプルデザイン3〜4枚 -->
    </div>
  </div>
</div>
```

### 持ち込みデザイン案内

```html
<div class="bring-design">
  <h3>持ち込みデザイン</h3>
  <p>InstagramやPinterestで見つけたデザインをお持ちください。</p>
  <p>ご予約時にスクリーンショットをお送りいただくとスムーズです。</p>
</div>
```

### エステ：ビフォーアフタースライダー【v1.14強化】

2パターンから選択（Q18でビフォーアフター選択時の追加質問）：

#### 写真並列型（既存）
```html
<div class="ba-item ba-side-by-side">
  <div class="ba-before">
    <img src="{ビフォー}" alt="施術前" width="400" height="400" loading="lazy">
    <span class="ba-label">Before</span>
  </div>
  <div class="ba-after">
    <img src="{アフター}" alt="施術後" width="400" height="400" loading="lazy">
    <span class="ba-label">After</span>
  </div>
  <p class="ba-desc">{施術内容・回数}</p>
</div>
```

#### スライダー比較型（プロ以上・CSS-only）
```html
<div class="ba-item ba-slider">
  <div class="ba-container">
    <img src="{ビフォー}" alt="施術前" width="400" height="400" loading="lazy" class="ba-img-before">
    <img src="{アフター}" alt="施術後" width="400" height="400" loading="lazy" class="ba-img-after">
    <input type="range" min="0" max="100" value="50" class="ba-range" aria-label="ビフォーアフター比較スライダー">
  </div>
  <p class="ba-desc">{施術内容・回数}</p>
</div>
```

仕様：
- CSS-only実装（`input[type="range"]`でクリッピング制御）
- JS依存にしない
- noscript時：Before/After写真を横並びでフォールバック
- 3〜5セット表示
- エステ判定時の追加質問：「ビフォーアフターの表示は？」（写真並列 / スライダー比較 / おまかせ）

```html
<noscript><style>.ba-slider .ba-range{display:none}.ba-slider .ba-img-before,.ba-slider .ba-img-after{display:inline-block;width:49%}</style></noscript>
```

### エステ：初回体験コースCTA

```html
<div class="trial-cta">
  <p class="trial-badge">初回限定</p>
  <h3>{体験コース名}</h3>
  <p class="trial-price">
    <span class="trial-original">通常 ¥{通常価格}</span>
    → <span class="trial-special">¥{体験価格}<span class="tax">（税込）</span></span>
  </p>
  <a href="#reservation" class="btn btn-primary">体験を予約する</a>
</div>
```

### エステ：お悩み別メニュー導線

```html
<div class="concern-nav">
  <h3>お悩みから探す</h3>
  <div class="concern-tags">
    <a href="#facial" class="concern-tag">たるみ</a>
    <a href="#facial" class="concern-tag">シミ</a>
    <a href="#body" class="concern-tag">毛穴</a>
    <a href="#body" class="concern-tag">セルライト</a>
  </div>
</div>
```

### エステ：施術フロー図

```html
<div class="flow-steps">
  <div class="flow-step">
    <span class="flow-number">01</span>
    <h4>カウンセリング</h4>
    <p>お肌の状態を確認し、最適なメニューをご提案します。</p>
  </div>
  <div class="flow-step">
    <span class="flow-number">02</span>
    <h4>施術</h4>
    <p>リラックスした空間で施術を行います。</p>
  </div>
  <div class="flow-step">
    <span class="flow-number">03</span>
    <h4>アフターケア</h4>
    <p>施術後のケア方法をアドバイスします。</p>
  </div>
</div>
```

### まつエク：デザイン比較

```html
<div class="lash-comparison">
  <div class="lash-design">
    <img src="{画像}" alt="ナチュラルデザイン" width="400" height="400" loading="lazy">
    <h4>Natural</h4>
    <p>自然な仕上がり。初めての方におすすめ。</p>
  </div>
  <div class="lash-design">
    <img src="{画像}" alt="キュートデザイン" width="400" height="400" loading="lazy">
    <h4>Cute</h4>
    <p>丸みのある可愛らしい目元に。</p>
  </div>
  <div class="lash-design">
    <img src="{画像}" alt="ゴージャスデザイン" width="400" height="400" loading="lazy">
    <h4>Gorgeous</h4>
    <p>華やかな目元を演出。</p>
  </div>
</div>
```

### まつエク：本数別イメージ

```html
<div class="lash-volume">
  <div class="volume-item">
    <img src="{画像}" alt="80本イメージ" width="400" height="400" loading="lazy">
    <h4>80本</h4>
    <p>すっぴん風ナチュラル</p>
  </div>
  <!-- 100本、120本、140本 -->
</div>
```

### まつエク：素材別説明表

```html
<div class="lash-materials">
  <table>
    <thead>
      <tr><th>素材</th><th>特徴</th><th>持続期間</th><th>価格帯</th></tr>
    </thead>
    <tbody>
      <tr><td>シルク</td><td>ツヤ感・コスパ◎</td><td>約3週間</td><td>¥{価格}〜</td></tr>
      <tr><td>ミンク</td><td>軽い・自然な仕上がり</td><td>約3〜4週間</td><td>¥{価格}〜</td></tr>
      <tr><td>セーブル</td><td>最高級・自まつ毛に近い</td><td>約4週間</td><td>¥{価格}〜</td></tr>
    </tbody>
  </table>
</div>
```

---

## Reservation — 予約UI LINE最優先【v1.14追加】

lp-salon と同一の4パターン。パターンA（外部リンク型）のボタン並び順をnail-esthe版に調整：

- **nail-esthe版の並び順：LINE → HPB → 電話**（LINE予約が主流）
- LINEボタンのスタイル強化：他のボタンより大きく、補足テキスト「LINEで空き状況をチェック」
- モバイル時：LINEが最上部かつ最大
- Q9の回答から表示ボタンを自動決定

```html
<div class="reservation-buttons reservation-line-first">
  <a href="{LINE URL}" class="btn btn-line btn-large" target="_blank" rel="noopener">
    LINE で予約・空き確認
    <small>LINEで空き状況をチェック</small>
  </a>
  <a href="{HPB URL}" class="btn btn-hpb" target="_blank" rel="noopener">Hot Pepper で予約</a>
  <a href="tel:{電話番号}" class="btn btn-tel">お電話で予約</a>
</div>
```

---

## Staff（05）〜 Footer

lp-salon と同一構造。
Staff の呼称は「ネイリスト」「エステティシャン」「アイリスト」等、業態に応じて変更。
