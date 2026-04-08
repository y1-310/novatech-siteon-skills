# lp-nail-esthe デザインシステム

## カラープリセット & Q13×Q14 マッピング

→ `salon-interview/references/presets.md` を参照（全 lp-* スキルの Single Source of Truth）。
lp-nail-esthe は3プリセット：フェミニン × 上品 / ラベンダー × 洗練 / ベージュ × ナチュラル。
デフォルトは「フェミニン × 上品」。

## 業態別のプリセット推奨

| 業態 | 推奨プリセット |
|------|-------------|
| ネイル | フェミニン × 上品 or ラベンダー × 洗練 |
| エステ | ベージュ × ナチュラル or フェミニン × 上品 |
| まつエク | フェミニン × 上品 or ラベンダー × 洗練 |

## タイポグラフィ仕様

→ `_common/components.md` の「タイポグラフィ共通仕様」を参照。プリセットに応じてフォントが変わる（presets.md 参照）。

## レスポンシブ仕様

→ `_common/components.md` の「レスポンシブ共通仕様」を参照。lp-salon と同一。

## 技術仕様

lp-salon と同一。ただし JSON-LD の @type は業態で分岐：

| 業態 | @type |
|------|-------|
| ネイル | NailSalon |
| エステ | BeautySalon |
| まつエク | BeautySalon |

## nail-esthe固有のデザインルール

- 写真は1:1正方形を基本とする（ネイルデザイン・施術結果の表示に最適）
- ギャラリーのグリッド：4列（desktop）/ 3列（tablet）/ 2列（mobile）
- border-radius は丸め（var(--r): 8px〜12px）
- フェミニンなトーンだが、甘すぎない上品さを保つ
