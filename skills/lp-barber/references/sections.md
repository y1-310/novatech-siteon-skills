# lp-barber セクション仕様

## 概要

lp-salon の sections.md と同じセクション構成。
以下はバーバー固有の差分のみ記載する。共通部分は lp-salon/references/sections.md を参照。

---

## Hero

lp-salon と同じ3パターン。
バーバー固有の違い：
- ダーク背景前提のため、overlay はより薄めでOK（rgba(0,0,0,0.2)）
- キャッチコピーのトーン：断言的・力強い
  - ○「最高の一杯を、最高の一刻を。」
  - ✕「あなたらしさを引き出す、やさしい空間。」

---

## ヒーロー直下CTA（オプション：Q18選択時）【v1.18追加】

lp-salon と同一構造。barber固有の調整：
- ボタン並び順：**電話 → HPB → LINE**（バーバーは電話予約が主流）
- 電話ボタン：`var(--accent)` 背景（ゴールド）で目立たせる
- テキスト：「ご予約はお電話でも承ります」
- デフォルト：ON

---

## Master Barber セクション（オプション：Q18選択時）【v1.18追加】

```html
<section id="master" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Master Barber</h2>
  <p class="section-subtitle">理容師について</p>

  <div class="master-content">
    <div class="master-photo">
      <img src="{写真}" alt="{名前}" width="400" height="533" loading="lazy">
    </div>
    <div class="master-text">
      <h3>{名前}<span class="master-role">{肩書き}</span></h3>
      <div class="master-story">
        <p>{理容師歴 / 得意な技術 / 修行先 / こだわりの道具 3〜5段落}</p>
      </div>
    </div>
  </div>
</section>
```

- 写真トーン：モノクロまたは高コントラスト推奨
- デフォルト：OFF

---

## Concept（01）

3パターン共通。バーバー固有の違い：
- コピーのトーン：短く力強い。「〜いたします」ではなく「〜する」
- パターンC（一言コピー型）が特に適合する
  - 例：「男の格を上げる、15分。」

---

## Features（02）

バーバー固有のこだわり例：
- フェードカットの技術
- シェービング（本格的な顔剃り）
- プライベート空間
- ウイスキー / コーヒーサービス

---

## Menu（03）

バーバー固有のメニュー構成：
- カット（フェードカット / クラシックカット / ツーブロック等）
- シェービング
- ヘッドスパ
- セットメニュー（カット＋シェービング等）

価格帯：男性メニューは比較的シンプル。
ドットリーダーのスタイルがダーク背景に合う。

---

## Style Gallery（04）

バーバー固有：
- スタイル写真はハイコントラスト
- キャプション例：Fade Cut, Classic Barber, Skin Fade
- 正面＋横からの2ショットが効果的

---

## Staff（05）

バーバー固有：
- 「スタイリスト」ではなく「バーバー」「理容師」
- role の英字例：Owner Barber, Chief Barber, Barber

---

## Photo Gallery（06）

バーバー固有：
- バーバーチェア、ヴィンテージな内装
- 施術道具（ストレートレーザー、クリッパー等）
- 照明はスポットライト風

---

## Access（07）

lp-salon と同一構造。

---

## Grooming Flow（オプション：Q18選択時、プロ以上）【v1.18追加】

```html
<section id="flow" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Grooming Flow</h2>
  <p class="section-subtitle">施術の流れ</p>

  <div class="flow-timeline">
    <div class="flow-item">
      <span class="flow-number" lang="en">01</span>
      <h3>{ステップ名}</h3>
      <p>{説明}</p>
    </div>
  </div>
</section>
```

デフォルトステップ：ご来店・カウンセリング → シャンプー → カット → シェービング（ホットタオル＋ストレートレーザー）→ スタイリング・仕上げ
- シェービング非対応のバーバーはステップ省略可
- デフォルト：OFF。プロ以上

---

## 口コミ全文カード型（オプション：Q18選択時、プロ以上）【v1.18追加】

lp-salon と同一仕様。ダーク背景に合わせる：
- カード背景：`var(--bg-alt)`（ダーク系）
- テキスト色：`var(--text)`（ライト系）
- ★アイコン色：`var(--accent)`（ゴールド）

---

## パララックスエフェクト（オプション：Q18選択時、プロ以上）【v1.18追加】

Featuresセクションの背景写真またはセクション間の全幅写真ブロックに適用。

```css
.parallax-bg {
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  min-height: 400px;
}
/* iOS Safari フォールバック */
@supports (-webkit-touch-callout: none) {
  .parallax-bg { background-attachment: scroll; }
}
@media (prefers-reduced-motion: reduce) {
  .parallax-bg { background-attachment: scroll; }
}
```

- 適用枚数：最大2箇所
- デフォルト：OFF
- Lighthouse Performance への影響がある場合はClaude Codeの判断でOFF

---

## バーバーツール紹介（オプション：Q18選択時）【v1.18追加】

```html
<section id="tools" class="section">
  <span class="section-number">{動的}</span>
  <h2 class="section-title" lang="en">Tools</h2>
  <p class="section-subtitle">こだわりの道具</p>

  <figure class="tools-hero">
    <img src="{道具フラットレイ写真}" alt="バーバーツール" width="1200" height="600" loading="lazy">
  </figure>

  <div class="tools-grid">
    <div class="tool-card">
      <img src="{道具写真}" alt="{道具名}" width="300" height="300" loading="lazy">
      <h3>{道具名}</h3>
      <p>{一言説明}</p>
    </div>
    <!-- 2〜4点 -->
  </div>
</section>
```

- 4列グリッド（デスクトップ）/ 2列（モバイル）
- 写真フィルター：プリセット連動
- デフォルト：OFF

---

## Reservation（08）【v1.18更新】

lp-salon と同一4パターン。barber版の予約ボタン並び順：**電話 → HPB → LINE**

```html
<div class="reservation-buttons reservation-tel-first">
  <a href="tel:{電話番号}" class="btn btn-accent btn-large">
    お電話で予約
    <small>お気軽にお電話ください</small>
  </a>
  <a href="{HPB URL}" class="btn btn-hpb" target="_blank" rel="noopener">Hot Pepper で予約</a>
  <a href="{LINE URL}" class="btn btn-line" target="_blank" rel="noopener">LINE で予約</a>
</div>
```

電話ボタン：`var(--accent)`背景、黒文字、サイズ大。モバイル時最上部かつ最大。

---

## CTA

バーバー固有：
- ダーク背景の場合、CTAセクションはさらに暗く or アクセントカラーのライン追加
- コピー例：「今すぐ予約する」（「ご予約はこちら」より直接的に）

---

## Footer

lp-salon と同一構造。
