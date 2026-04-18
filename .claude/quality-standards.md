# 品質基準・実装仕様（差分・補足）

> 元資料: novatech-salon-skills-blueprint-v2-final.md（2026-04-19に.claude/へ移行）
> 最終更新: 2026-04-19
> 関連: .claude/rules.md, .claude/CLAUDE.md, .claude/shared-context.md, _common/image-guide.md, _common/seo-base.md
> 注意: 今後Developer/GitHub最適化予定のため、将来的にファイル再配置あり

---

> **重複除外について**
> 画像の扱いルール → `.claude/quality.md` / `_common/image-guide.md`
> ローカルSEO・NAP一貫性 → `_common/seo-base.md`
> アクセシビリティ10項目・prefers-reduced-motion → `.claude/rules.md`
> フォント最適化（3ウェイト/font-display:swap/preconnect） → `.claude/rules.md` + `.claude/shared-context.md`
> 共通コンポーネント（マーキー・区切り線・予約ボタン5箇所） → `.claude/shared-context.md` / `.claude/rules.md`
> noscriptフォールバック → `.claude/rules.md` / `.claude/shared-context.md`
> 多言語基盤（lang="en"） → `.claude/rules.md` / `_common/seo-base.md`
>
> このファイルには**そこに記載のない補足仕様**のみ収録。

---

## クライアント向け写真撮影ガイド（送付用）

> ヒアリング完了後、契約前のデモ提示時にクライアントへ渡す簡易ガイド。
> 詳細な業態別撮影方向は `_common/image-guide.md` を参照。

### 必要枚数の目安

| カテゴリ | 枚数 |
|---------|------|
| ヒーロー | 1〜3枚 |
| 内装 | 3〜6枚 |
| スタイル（施術例） | 6〜12枚 |
| スタッフ | スタッフ人数分 |
| 施術風景 | 1〜3枚 |
| **合計目安** | **12〜20枚以上** |

### 撮影のコツ

**内装写真**
- 時間帯：午前〜14時の自然光
- 構図：部屋の角から対角線方向に広角で
- 準備：私物・荷物を片付ける。鏡への映り込みに注意

**スタイル（ヘアスタイル・施術例）写真**
- 背景：白壁またはシンプルな壁面
- 光：窓際の自然光が最良
- アングル：正面／45度／後ろの3方向
- タイミング：仕上げ直後に撮る

**スタッフ写真**
- 表情：自然な笑顔
- 画角：胸から上
- 統一感：同じ場所・同じ光源で全スタッフ撮影

### 写真が揃わない場合のフォールバック順序

1. placehold.co プレースホルダー → 写真揃い次第差し替え
2. Unsplash / Pexels（商用利用OK）→「実際のサロンではない」旨を明記
3. AI画像生成（内装イメージのみ）→ スタイル写真・スタッフ写真には使用不可

---

## スクロールアニメーション実装パラメータ

> アニメーションのルール・方針は `.claude/rules.md` カテゴリ5に記載済み。
> 以下はその具体的なパラメータ値（rules.mdに記載されていない数値のみ）。

```javascript
// Intersection Observer 設定値
{
  threshold: 0.06,       // 要素の6%が見えたらアニメーション開始
  rootMargin: '0px'      // 追加のオフセットなし
}

// 初期状態（非表示）
opacity: 0;
transform: translateY(12px);   // 本文・汎用要素

// h2見出しの場合
transform: translateY(16px);

// ヒーローキャッチコピーの場合
transform: translateY(20px);

// transition
transition: opacity 0.6s ease, transform 0.6s ease;

// スタガー遅延（グリッド内の子要素）
transition-delay: calc(var(--i, 0) * 0.08s);
```
