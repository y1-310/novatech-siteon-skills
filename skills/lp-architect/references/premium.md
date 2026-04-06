# lp-architect プレミアム固有仕様

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

## 建築向けプレミアム機能

### 含まれるもの
- Before-After比較スライダー
- モデルルーム予約導線
- 3D内観ウォークスルー導線
- 高度なWorksフィルタリング
- 施工事例個別ページの拡張レイアウト

### 含まれないもの
- 独自会員システム
- 独自予約決済システム
- WebGLベースのフル3D実装
- 物件管理CMSのフルスクラッチ開発

### Before-After比較スライダー

```html
<section id="before-after" class="section">
  <span class="section-number">{番号}</span>
  <h2 class="section-title" lang="en">Before / After</h2>
  <p class="section-subtitle">ビフォーアフター</p>

  <div class="ba-slider">
    <img src="{Before画像}" alt="{事例名}の改修前" width="1200" height="800" loading="lazy">
    <div class="ba-after">
      <img src="{After画像}" alt="{事例名}の改修後" width="1200" height="800" loading="lazy">
    </div>
    <input type="range" min="0" max="100" value="50" aria-label="ビフォーアフター比較">
  </div>
</section>
```

### モデルルーム予約

```html
<section id="model-room" class="section">
  <span class="section-number">{番号}</span>
  <h2 class="section-title" lang="en">Model Room</h2>
  <p class="section-subtitle">モデルルーム見学</p>

  <div class="model-room-card">
    <img src="{画像}" alt="{モデルルーム名}" width="800" height="560" loading="lazy">
    <div class="model-room-info">
      <h3>{モデルルーム名}</h3>
      <p>{所在地・案内文}</p>
      <a href="{予約URL}" class="btn btn-model">見学予約をする</a>
    </div>
  </div>
</section>
```

### 3D内観ウォークスルー

```html
<section id="walkthrough" class="section">
  <span class="section-number">{番号}</span>
  <h2 class="section-title" lang="en">3D Walkthrough</h2>
  <p class="section-subtitle">内観ウォークスルー</p>

  <div class="walkthrough-embed">
    <iframe src="{Matterport等の埋め込みURL}" title="{事例名}の3D内観ウォークスルー" loading="lazy"></iframe>
  </div>
</section>
```

### 高度なWorksフィルタリング

```html
<div class="works-filters" role="group" aria-label="施工事例の絞り込み">
  <button class="filter-chip is-active">すべて</button>
  <button class="filter-chip">新築</button>
  <button class="filter-chip">リノベ</button>
  <button class="filter-chip">平屋</button>
  <button class="filter-chip">木造</button>
</div>
```

絞り込み軸：
- 用途（新築 / リノベ / 店舗）
- 価格帯
- 構造
- エリア
- 竣工年

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
- ブランドカラー・フォントを反映
- テキストは中央60%以内に配置

### 生成フロー
```
1. サイト完成後
2. Figmaでog:image用テンプレート作成
3. 事務所名・キャッチ・写真を配置
4. エクスポート → assets/ogp.png
5. HTMLのog:imageパスを更新
```

## 写真撮影ディレクション

オンラインでクライアントに撮影指示。

### 必要枚数
- ヒーロー：1〜3枚
- 施工事例：6〜15枚
- 代表・スタッフ：人数分
- 打合せ風景：1〜3枚
- 外観・周辺：2〜4枚
- 合計：15〜25枚以上

### 撮影のコツ
- 外観：午前か夕方の斜光。電線や車の写り込みを避ける
- 内観：自然光中心。広角で歪ませすぎない。生活感の整理を徹底
- 人物：表情を硬くしすぎず、仕事風景も含める

### フォールバック
1. placehold.co プレースホルダー → 写真揃い次第差し替え
2. Unsplash/Pexels → 「実際の施工事例ではない」旨明記
3. AI画像生成 → イメージカットのみ。実績写真の代替には使わない
