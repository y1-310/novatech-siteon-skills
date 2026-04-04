# lp-salon プレミアム固有仕様

## 概要

プレミアムプラン（月額25,000円税別）固有の追加仕様。
multipage.md の5ページ構成をベースに、以下の機能を追加。

## Figmaフルオリジナルデザイン

### ワークフロー

```
1. ヒアリング完了
2. スキルでベースサイト生成（プロと同じ構造）
3. /figma-capture でFigmaにキャプチャ
4. Figma上でフルカスタムデザイン
5. クライアント共有・フィードバック
6. Figma MCPでデザイン情報取得
7. コード反映（スキルの構造に従う）
8. 修正ループ
```

### Figma連携

- Skill → Figma：サイト生成後にキャプチャ→Figmaで微調整
- Figma → Skill：Figmaでデザイン→MCPでデザイン情報取得→コード生成

## EC機能

### 含まれるもの
- 商品紹介ページ（10商品まで）
- 外部EC（BASE/STORES）への導線
- 商品ギャラリー＋価格表示
- カートボタン（外部ECリンク）

### 含まれないもの
- 独自カート・決済システム
- 在庫管理
- 11商品以上（別途500円/月/商品）
- 定期購入

### 商品ページ構造

```html
<section id="products" class="section">
  <span class="section-number">{番号}</span>
  <h2 class="section-title" lang="en">Products</h2>
  <p class="section-subtitle">商品</p>

  <div class="product-grid">
    <div class="product-card">
      <img src="{商品画像}" alt="{商品名}" width="400" height="400" loading="lazy">
      <h3>{商品名}</h3>
      <p class="product-desc">{商品説明}</p>
      <p class="product-price">¥{価格}<span class="tax">（税込）</span></p>
      <a href="{BASE/STORES商品URL}" class="btn btn-product" target="_blank" rel="noopener">
        購入はこちら
      </a>
    </div>
    <!-- 最大10商品 -->
  </div>
</section>
```

### 特定商取引法表記ページ

EC機能設置時に必須。`tokushoho.html` として作成。

```html
<section class="section legal">
  <h1>特定商取引法に基づく表記</h1>
  <dl>
    <dt>事業者名</dt><dd>{事業者名}</dd>
    <dt>所在地</dt><dd>{住所}</dd>
    <dt>電話番号</dt><dd>{電話番号}</dd>
    <dt>販売価格</dt><dd>商品ページに記載</dd>
    <dt>支払方法</dt><dd>外部ECサイト（BASE/STORES）の決済手段に準ずる</dd>
    <dt>返品・交換</dt><dd>{返品ポリシー}</dd>
  </dl>
</section>
```

**カート・決済は自前で作らない。** セキュリティリスク・開発コスト・保守コストが見合わないため。BASE/STORESに任せる。

## 詳細SEO

### 基本SEOに追加

| 項目 | 内容 |
|------|------|
| GBP最適化 | Googleビジネスプロフィール初期設定・最適化 |
| キーワード設計 | エリア×業態×特徴のキーワード選定 |
| GA4設置 | Google Analytics 4 トラッキング設定 |
| 月次レポート | アクセス数・流入元・検索キーワード・改善提案 |

### GA4設置

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id={GA4_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{GA4_ID}');
</script>
```

### 月次レポート項目

- PV数・UU数・セッション数
- 流入元内訳（オーガニック / SNS / 直接 / 広告）
- 検索キーワードTop10
- ページ別閲覧数
- デバイス比率
- GBP インサイト（表示回数・アクション数）
- 改善提案（3点）

## カスタムアニメーション

### 標準アニメーション（スタンダード・プロ共通）に追加

| アニメーション | 仕様 |
|-------------|------|
| ページ遷移効果 | ページ読み込み時のフェードイン |
| パララックス | スクロールに応じた背景移動（transform: translateYのみ） |
| テキスト出現 | 文字が1文字ずつフェードイン（span分割＋遅延） |
| 画像ズーム | ホバー時にscale(1.05)（transform: scaleのみ） |

ルール：
- transform と opacity のみ使用（top/left/margin禁止）
- prefers-reduced-motion 対応必須
- パフォーマンスに影響しない範囲で

## OGP画像カスタムデザイン

### 仕様
- サイズ：1200×630px
- Figmaでカスタムデザイン
- サロンのブランドカラー・フォントを反映
- テキストは中央60%以内に配置

### 生成フロー
```
1. サイト完成後
2. Figmaでog:image用テンプレート作成
3. サロン名・キャッチ・写真を配置
4. エクスポート → assets/ogp.png
5. HTMLのog:imageパスを更新
```

## 写真撮影ディレクション

オンラインでクライアントに撮影指示。

### 必要枚数
- ヒーロー：1〜3枚
- 内装：3〜6枚
- スタイル：6〜12枚
- スタッフ：人数分
- 施術風景：1〜3枚
- 合計：12〜20枚以上

### 撮影のコツ
- 内装：自然光（午前〜14時）。広角モードで角から対角線。私物片付け。鏡に映り込み注意
- スタイル：白壁or シンプル背景。窓際自然光。正面/45度/後ろの3方向。仕上げ直後
- スタッフ：自然な笑顔。胸から上。同じ場所・同じ光で統一

### フォールバック
1. placehold.co プレースホルダー → 写真揃い次第差し替え
2. Unsplash/Pexels → 「実際のサロンではない」旨明記
3. AI画像生成 → 内装イメージのみ。スタイル写真・スタッフ写真不可
