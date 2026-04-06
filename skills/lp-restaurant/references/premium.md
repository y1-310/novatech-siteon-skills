# lp-restaurant premium

## プレミアム機能

| 機能 | 内容 |
|------|------|
| 1. TableCheck予約ウィジェット埋め込み | `Reservation / CTA` セクション内に埋め込み可能な構造を用意する。通常CTAが残る場合は導線競合を避けるため主従関係を明確にする。 |
| 2. EC商品連携 | Base / Shopify の外部商品ページへリンクする。LP内では商品一覧カードを見せ、購入は外部遷移で処理する。 |
| 3. Instagram Feed自動更新 | SnapWidgetを使った埋め込みを許可する。埋め込み不可の場合は静的サムネイル一覧へフォールバックする。 |
| 4. シーン別タブのアニメーション切替 | `Morning` / `Lunch` / `Dinner` などの切り替えにフェードまたはスライドを付与する。アニメーションは情報取得を阻害しない速度に抑える。 |
| 5. 多言語メニュー | JP / EN を基本とし、メニュー名、説明、注意書きを切り替える。JSON入力に英語がない場合は日本語を優先し、未翻訳扱いを明示する。 |
| 6. マーキー・スクロールアニメ | `../../../_common/components.md` のマーキーまたはスクロール演出を活用する。過剰演出を避け、HeroやScene導線など限られた箇所で使う。 |
| 7. 高解像度フードフォト最適化 | 料理写真は高解像度前提で表示しつつ、読み込みサイズを最適化する。重要写真はLCPを阻害しない順序で読み込む。 |

## コード断片

### TableCheck予約ウィジェット埋め込み

```html
<section id="reservation" class="reservation section">
  <div class="reservation__panel">
    <div class="reservation__methods"></div>
    <div class="reservation__cta"></div>
    <div class="reservation__embed">
      <!-- TableCheck予約ウィジェット -->
    </div>
  </div>
</section>
```

### EC商品連携

```html
<section class="shop section" id="shop">
  <div class="shop__grid">
    <article class="shop-card">
      <a href="{Base / Shopify の外部商品ページURL}">
        <div class="shop-card__body"></div>
      </a>
    </article>
  </div>
</section>
```

### Instagram Feed自動更新

```html
<section class="instagram section" id="instagram">
  <div class="instagram__embed">
    <!-- SnapWidget埋め込み -->
  </div>
</section>
```

### シーン別タブのアニメーション切替

```html
<div class="menu__switch">
  <button data-scene="Morning">Morning</button>
  <button data-scene="Lunch">Lunch</button>
  <button data-scene="Dinner">Dinner</button>
</div>
```

### 多言語メニュー

```html
<article class="menu-card" data-lang="jp">
  <h3 class="menu-card__title"></h3>
  <p class="menu-card__desc"></p>
</article>
<article class="menu-card" data-lang="en">
  <h3 class="menu-card__title"></h3>
  <p class="menu-card__desc"></p>
</article>
```

## 運用上の注意

| 項目 | 内容 |
|------|------|
| 外部埋め込み | 読み込み失敗時の代替導線を必ず持つ。 |
| 多言語導線 | 全ページ一括ではなく、メニューと予約導線を優先する。 |
| プレミアム機能 | スタンダードやプロへ混在させない。 |
