# lp-nail-esthe セクション仕様

## 概要

lp-salon の sections.md と同じ基本構成。
以下は nail-esthe 固有の差分と追加セクションを記載する。

---

## Hero

lp-salon と同じ3パターン。
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

## Features（02）

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

## Design Gallery（04）— nail-esthe最重要セクション

### ネイル：デザインギャラリー

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

### エステ：ビフォーアフタースライダー

```html
<div class="before-after">
  <div class="ba-item">
    <div class="ba-images">
      <div class="ba-before">
        <img src="{ビフォー}" alt="施術前" width="400" height="400" loading="lazy">
        <span class="ba-label">Before</span>
      </div>
      <div class="ba-after">
        <img src="{アフター}" alt="施術後" width="400" height="400" loading="lazy">
        <span class="ba-label">After</span>
      </div>
    </div>
    <p class="ba-desc">{施術内容・回数}</p>
  </div>
</div>
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

## Staff（05）〜 Footer

lp-salon と同一構造。
Staff の呼称は「ネイリスト」「エステティシャン」「アイリスト」等、業態に応じて変更。
