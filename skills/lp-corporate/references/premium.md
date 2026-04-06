# lp-corporate プレミアム固有仕様

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

## オンライン無料相談予約UI

### 含まれるもの
- 無料相談予約UI（30分 / 60分など）
- 日程候補表示
- 外部カレンダーツール連携
- 完了後のサンクスメッセージ

### 含まれないもの
- 独自の予約管理システム
- 決済機能付き予約
- 顧客管理CRM
- リマインドメールの独自配信基盤

### 予約UI構造

```html
<section id="consultation" class="section">
  <span class="section-number">{番号}</span>
  <h2 class="section-title" lang="en">Free Consultation</h2>
  <p class="section-subtitle">無料相談予約</p>

  <div class="consultation-grid">
    <div class="consultation-card">
      <h3>30分オンライン相談</h3>
      <p class="consultation-desc">{説明}</p>
      <p class="consultation-meta">Zoom / Google Meet</p>
      <a href="{予約URL}" class="btn btn-consultation" target="_blank" rel="noopener">
        日程を選択する
      </a>
    </div>
    <!-- 2〜3プラン -->
  </div>
</section>
```

## シミュレーター機能

### 想定用途
- 顧問料の概算シミュレーター
- 制作費の概算シミュレーター
- 相談内容別の推奨プラン診断

### 実装方針
- クライアントサイドJSのみ
- 入力は select / radio / range を基本
- 計算ロジックは単純明快に保つ
- 結果直下に問い合わせCTAを配置

## 多言語切替

### 含まれるもの
- 日本語 / 英語の2言語切替
- ヘッダー切替UI
- 主要見出し・CTA・会社概要の翻訳
- `lang` 属性の適用

### 含まれないもの
- 3言語以上の多言語展開
- 自動翻訳API連携
- 管理画面での多言語更新

## 高度なFAQ

### 標準FAQに追加

| 項目 | 内容 |
|------|------|
| カテゴリ絞り込み | サービス別・契約前後別 |
| キーワード検索 | 入力語で絞り込み |
| 開閉状態保持 | URLハッシュ or localStorage |
| 構造化データ | FAQPage JSON-LD |

## メディア掲載カルーセル

### 仕様
- ロゴまたはサムネイルを横スライド表示
- 5〜10件程度
- 自動再生＋手動操作
- 外部リンクは別タブ

```html
<section id="media" class="section">
  <span class="section-number">{番号}</span>
  <h2 class="section-title" lang="en">Media</h2>
  <p class="section-subtitle">掲載実績</p>

  <div class="media-carousel">
    <a href="{掲載URL}" class="media-item" target="_blank" rel="noopener">
      <img src="{ロゴ画像}" alt="{媒体名}" width="240" height="120" loading="lazy">
    </a>
    <!-- 繰り返し -->
  </div>
</section>
```

## 詳細SEO

### 基本SEOに追加

| 項目 | 内容 |
|------|------|
| キーワード設計 | エリア×業種×専門分野のキーワード選定 |
| GA4設置 | Google Analytics 4 トラッキング設定 |
| Search Console | サイトマップ送信・基本設定 |
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
- 問い合わせ数・CV率
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
- 企業のブランドカラー・フォントを反映
- テキストは中央60%以内に配置

### 生成フロー
```
1. サイト完成後
2. Figmaでog:image用テンプレート作成
3. サイト名・キャッチ・写真を配置
4. エクスポート → assets/ogp.png
5. HTMLのog:imageパスを更新
```

## 写真撮影ディレクション

オンラインでクライアントに撮影指示。

### 必要枚数
- ヒーロー：1〜3枚
- 代表写真：1〜2枚
- オフィス・仕事風景：4〜8枚
- 実績関連写真：3〜6枚
- チーム写真：人数分
- 合計：12〜20枚以上

### 撮影のコツ
- 代表写真：自然光。胸から上と全身の2パターン。背景は整理されたオフィス
- オフィス：午前〜14時の自然光。広角で空間の整頓を優先
- 仕事風景：打ち合わせ・作業・相談シーンを演出しすぎず撮る

### フォールバック
1. placehold.co プレースホルダー → 写真揃い次第差し替え
2. Unsplash/Pexels → 「実際のオフィスではない」旨明記
3. AI画像生成 → イメージカットのみ。代表写真・実績写真の代用不可
