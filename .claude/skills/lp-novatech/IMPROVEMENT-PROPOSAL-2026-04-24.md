# lp-novatech skill 改善提案 (2026-04-24)

## 提案者
参謀Claude(claude.ai) + Yuichi

## 検証元
月凪(鎌倉サロン)LP作成セッション、
mobile-preview skill で全6デバイス動作確認後に抽出。
最終 commit: 8192268

---

## 提案1: Borderless First 原則の明文化

月凪検証で Figma Make 版が「オシャレに見えた」本質は
Box/枠に頼らず余白で構造を示すこと。
Coming Soon プレースホルダーの成功もこの原則の延長線上。

### 追加すべきルール
- セクション全体を枠で囲わない
- 特徴紹介(3本柱等)を card/枠で分離しない
- Gallery 画像に装飾枠・ドロップシャドウを付けない
- 本文段落は枠なし余白で区切る

### Box 使用許可箇所
- Menu 料金表の罫線(1px、塗りなし)
- CTA ボタン(角丸 ≤2px)
- フォーム入力欄(下線 1px 推奨)
- 強調箇所(全 LP 内 1-2 箇所まで)

---

## 提案2: Coming Soon プレースホルダーの標準化

クライアント画像未入手時の標準フォールバックとして
Coming Soon プレースホルダーを skill に組み込む。

### 標準コード
```html
<div class="gallery__item gallery__item--placeholder">
  <div class="gallery__placeholder" aria-label="施術例 — 準備中">Coming Soon</div>
</div>
```

```css
.gallery__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #F5F1EA 0%, #E8E0D0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-roman);
  font-style: italic;
  color: var(--color-sage-text);
  font-size: 1.2rem;
  letter-spacing: 0.1em;
}
```

### 運用ルール
- 明示的に「選定困難なら Coming Soon プレースホルダー採用」を skill 内のルールに明記
- 妥協した画像は絶対選ばない
- クライアント画像確定後に差し替え

---

## 提案3: 画像選定ロジックの厳格化

月凪出力で Gallery/Staff に月凪コンセプトと乖離した
画像が選ばれた問題への対応。

### 追加すべき条件
業種・コンセプト別の画像条件を skill 内で明示。

例(和モダン_サロン):
- hair_color: 黒/濃茶/ベージュ
- background: 木目/障子/古民家/自然光
- subject_age: 30-50代
- subject_angle: 後ろ姿/横顔
- saturation_adjustment: -20%
- exclude: ピンク背景/派手な金髪/マスク着用/プロダクト単体写真

全7業種でこの粒度の条件定義を追加。

---

## 提案4: モバイル Sticky 予約ボタン実装の自動化

skill 要件に含まれているが lp-novatech 出力では未実装だった。
生成時に必ず含まれるようテンプレ必須化。

### 追加検証
iPhone SE(375px)での position:fixed 動作確認を
skill 生成後の QA チェックリストに追加。

---

## 提案5: 縦書きキャッチのモバイル対応

`writing-mode: vertical-rl` をデスクトップ適用時、
自動的にモバイルブレイクポイント(767px以下)で `horizontal-tb` に
フォールバックする CSS を skill に組込み。

### 標準パターン
```css
.hero__catch {
  writing-mode: vertical-rl;
}

@media (max-width: 767px) {
  .hero__catch {
    writing-mode: horizontal-tb;
    font-size: clamp(1.25rem, 5.5vw, 1.625rem);
    letter-spacing: 0.08em;
  }
}
```

---

## 提案6: 画像形状の業種別指針

円/楕円/正方形/長方形の使い分けを業種別に明記:

| 業種 | Staff | Gallery | Hero |
|------|-------|---------|------|
| サロン | 円 | 正方形+楕円 mix | 長方形 |
| 建築 | 正方形 | 長方形中心 | パノラマ |
| レストラン | 円 | 正方形 | 横長 |
| 居酒屋 | 正方形 | 正方形 | 横長 |
| 企業 | 正方形 | 長方形 | 広角 |
| 整骨院 | 円 | 正方形 | 横長 |
| カフェ | 円 | 正方形+円 mix | 横長 |

---

## 提案7: 単価×装飾密度の反比例則

料金表のデザインを単価帯で自動調整:
- 低価格帯(〜5000円): 罫線あり + 背景色で視認性重視
- 中価格帯(5000〜10000円): 細罫線のみ
- 高価格帯(10000円〜): 罫線なし、余白のみで構造化

skill に `price_tier` パラメータ追加し自動切替。

---

## 提案8: ナビゲーション項目の多言語一貫性

月凪検証で Desktop 版の英語ナビとモバイル版の日本語ナビで
一部ズレが発生。skill 生成時に「全デバイスで同一言語統一」を
強制するバリデーション追加。
→ QA pre-commit hook の check-nav.py で自動検出済み。

---

## 次回更新タイミング
Yuichi 営業フェーズ開始後(4/25〜)の初案件着手前に反映推奨。
最初のリアル案件で skill を使う前に、この8点を反映した v1.x 版を作る。
